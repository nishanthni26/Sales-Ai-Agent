import {
  WorkflowAutomation,
  WorkflowExecutionLog,
  Contact,
  GeneratedCampaign,
  Deal,
  Task,
} from "../types";
import {
  recordSentEmailInFirestore,
  addCampaignEventToFirestore,
  addDealToFirestore,
  addTaskToFirestore,
  updateContactInFirestore,
  addInteractionAndAutoScore,
  saveWorkflowExecutionLogToFirestore,
  getUserWorkflows,
  getUserCampaigns,
  getUserContacts,
} from "./firestoreService";

export interface AutomationRunResult {
  workflowId: string;
  workflowName: string;
  contactsProcessed: number;
  emailsSent: number;
  tasksCreated: number;
  dealsCreated: number;
  scoresUpdated: number;
  errors: string[];
  executionLogIds: string[];
}

export interface AutomationRunProgress {
  workflowName: string;
  contactName: string;
  contactIndex: number;
  totalContacts: number;
  stepLabel: string;
  status: "info" | "success" | "warning" | "error";
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildWorkflowFromCampaign(campaign: GeneratedCampaign): WorkflowAutomation {
  const nodes = campaign.workflowNodes?.length
    ? campaign.workflowNodes
    : [
        { id: "n1", type: "trigger" as const, subtype: "contact_created" as const, label: "New Contact Added" },
        { id: "n2", type: "action" as const, subtype: "send_email" as const, label: "Send Campaign Email", config: { emailSubject: campaign.emailContent?.subjectLines?.[0] || campaign.name, emailBody: campaign.emailContent?.body || "" } },
        { id: "n3", type: "delay" as const, subtype: "delay_duration" as const, label: "Wait 2 Days", config: { delayDays: 2 } },
        { id: "n4", type: "action" as const, subtype: "send_whatsapp" as const, label: "Send WhatsApp Follow-up", config: { whatsappMessage: campaign.whatsAppMessages?.[0]?.text || "Hi! Following up on our conversation." } },
        { id: "n5", type: "action" as const, subtype: "create_task" as const, label: "Create Follow-up Task", config: { taskTitle: "Follow up with lead" } },
        { id: "n6", type: "end" as const, subtype: "end_workflow" as const, label: "Workflow Complete" },
      ];

  const edges = nodes.slice(0, -1).map((n, i) => ({
    id: `e${i}`,
    source: n.id,
    target: nodes[i + 1].id,
    label: "Next",
  }));

  return {
    id: `wf-${campaign.id}`,
    name: campaign.name,
    description: `Auto-generated workflow for campaign: ${campaign.name}`,
    category: "Campaign Automation",
    status: "active",
    nodes,
    edges,
    analytics: { totalExecutions: 0, activeExecutions: 0, completedExecutions: 0, failedExecutions: 0, successRate: 0, avgDuration: 0, lastRunAt: "" },
    createdAt: campaign.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function runAutomationForUser(
  userId: string,
  onProgress?: (progress: AutomationRunProgress) => void,
  options?: { workflowId?: string; campaignId?: string; contactFilter?: (c: Contact) => boolean }
): Promise<AutomationRunResult> {
  const result: AutomationRunResult = {
    workflowId: "",
    workflowName: "",
    contactsProcessed: 0,
    emailsSent: 0,
    tasksCreated: 0,
    dealsCreated: 0,
    scoresUpdated: 0,
    errors: [],
    executionLogIds: [],
  };

  try {
    const [workflows, campaigns, contacts] = await Promise.all([
      getUserWorkflows(userId),
      getUserCampaigns(userId),
      getUserContacts(userId),
    ]);

    let activeWorkflows: WorkflowAutomation[] = workflows.filter((w) => w.status === "active");

    if (options?.workflowId) {
      activeWorkflows = activeWorkflows.filter((w) => w.id === options.workflowId);
    }

    const campaignWorkflows = campaigns
      .filter((c) => c.status === "active" && (!options?.campaignId || c.id === options?.campaignId))
      .map(buildWorkflowFromCampaign);

    const allWorkflows = [...activeWorkflows, ...campaignWorkflows];

    if (allWorkflows.length === 0) {
      result.errors.push("No active workflows or campaigns found to run.");
      return result;
    }

    const targetContacts = contacts.filter(
      options?.contactFilter || ((c) => c.status === "lead" || c.status === "contacted")
    );

    if (targetContacts.length === 0) {
      result.errors.push("No matching contacts found for automation.");
      return result;
    }

    for (const workflow of allWorkflows) {
      result.workflowId = workflow.id;
      result.workflowName = workflow.name;

      for (let ci = 0; ci < targetContacts.length; ci++) {
        const contact = targetContacts[ci];
        result.contactsProcessed++;

        onProgress?.({
          workflowName: workflow.name,
          contactName: contact.name,
          contactIndex: ci,
          totalContacts: targetContacts.length,
          stepLabel: "Starting",
          status: "info",
        });

        try {
          const execResult = await executeWorkflowActions(workflow, contact, userId, onProgress, ci, targetContacts.length);

          result.emailsSent += execResult.emailsSent;
          result.tasksCreated += execResult.tasksCreated;
          result.dealsCreated += execResult.dealsCreated;
          result.scoresUpdated += execResult.scoresUpdated;

          if (execResult.executionLogId) {
            result.executionLogIds.push(execResult.executionLogId);
          }

          if (execResult.errors.length > 0) {
            result.errors.push(...execResult.errors);
          }
        } catch (err: any) {
          result.errors.push(`Error processing ${contact.name}: ${err?.message || "Unknown error"}`);
        }

        if (ci < targetContacts.length - 1) {
          await delay(300);
        }
      }
    }
  } catch (err: any) {
    result.errors.push(`Fatal error: ${err?.message || "Unknown error"}`);
  }

  return result;
}

interface SingleContactResult {
  emailsSent: number;
  tasksCreated: number;
  dealsCreated: number;
  scoresUpdated: number;
  errors: string[];
  executionLogId: string;
}

async function executeWorkflowActions(
  workflow: WorkflowAutomation,
  contact: Contact,
  userId: string,
  onProgress?: (progress: AutomationRunProgress) => void,
  contactIndex?: number,
  totalContacts?: number
): Promise<SingleContactResult> {
  const res: SingleContactResult = {
    emailsSent: 0,
    tasksCreated: 0,
    dealsCreated: 0,
    scoresUpdated: 0,
    errors: [],
    executionLogId: "",
  };

  const logEntries: { timestamp: string; nodeId: string; nodeLabel: string; nodeType: string; message: string; status: "info" | "success" | "warning" | "error" }[] = [];
  const now = () => new Date().toISOString();

  const triggerNode = workflow.nodes.find((n) => n.type === "trigger");
  const startId = triggerNode?.id || workflow.nodes[0]?.id;

  if (!startId) {
    res.errors.push("No trigger/start node found in workflow.");
    return res;
  }

  let currentNodeId: string | undefined = startId;
  const visited = new Set<string>();
  let updatedContact: Contact = { ...contact };

  while (currentNodeId && !visited.has(currentNodeId)) {
    visited.add(currentNodeId);
    const node = workflow.nodes.find((n) => n.id === currentNodeId);
    if (!node) break;

    const stepLabel = node.label || node.title || node.type;

    onProgress?.({
      workflowName: workflow.name,
      contactName: contact.name,
      contactIndex: contactIndex || 0,
      totalContacts: totalContacts || 1,
      stepLabel,
      status: "info",
    });

    try {
      switch (node.type) {
        case "trigger":
          logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "trigger", message: `Trigger fired for ${contact.name}`, status: "info" });
          break;

        case "delay":
          const delayHours = node.config?.delayHours || (node.config?.delayDays ? node.config.delayDays * 24 : 0);
          logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "delay", message: `Waiting ${delayHours}h (simulated)`, status: "info" });
          break;

        case "condition":
          let conditionPassed = true;
          const subtype = node.subtype;
          if (subtype === "if_lead_score_gt") {
            conditionPassed = updatedContact.leadScore > (node.config?.leadScoreThreshold || 50);
          } else if (subtype === "if_email_opened") {
            conditionPassed = updatedContact.timeline?.some((t) => t.type === "email_opened") || updatedContact.leadScore > 50;
          } else if (subtype === "if_link_clicked") {
            conditionPassed = updatedContact.timeline?.some((t) => t.type === "link_clicked");
          } else if (subtype === "if_deal_value_gt") {
            conditionPassed = true;
          }

          logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "condition", message: `Condition evaluated: ${conditionPassed ? "PASS" : "FAIL"}`, status: conditionPassed ? "success" : "warning" });

          const matchingEdge = workflow.edges.find(
            (e) => e.source === node.id && (conditionPassed ? e.label === "Yes" || e.label === "Next" : e.label === "No")
          );
          if (matchingEdge) {
            currentNodeId = matchingEdge.target;
            continue;
          }
          break;

        case "action":
          await executeActionNode(node, updatedContact, userId, res, logEntries, onProgress, contactIndex, totalContacts);

          if (node.subtype === "lead_score" && node.config?.scoreChange) {
            updatedContact.leadScore = Math.min(100, Math.max(0, updatedContact.leadScore + (node.config.scoreChange || 0)));
            res.scoresUpdated++;
          }
          break;

        case "end":
          logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "end", message: "Workflow complete", status: "success" });
          currentNodeId = undefined;
          break;
      }
    } catch (err: any) {
      logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: node.type, message: `Error: ${err?.message}`, status: "error" });
      res.errors.push(`${stepLabel}: ${err?.message}`);
    }

    if (currentNodeId) {
      const nextEdge = workflow.edges.find((e) => e.source === currentNodeId);
      currentNodeId = nextEdge?.target;
    }
  }

  if (res.scoresUpdated > 0) {
    try {
      await updateContactInFirestore(contact.id, {
        leadScore: updatedContact.leadScore,
        scoreGrade: updatedContact.leadScore >= 80 ? "Hot" : updatedContact.leadScore < 50 ? "Cold" : "Warm",
      });
    } catch (e) {
      /* non-fatal */
    }
  }

  try {
    const execLog: Partial<WorkflowExecutionLog> = {
      workflowId: workflow.id,
      workflowName: workflow.name,
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email,
      status: res.errors.length > 0 ? "failed" : "completed",
      logs: logEntries.map((l) => ({ ...l })),
      startedAt: logEntries[0]?.timestamp || now(),
      completedAt: now(),
    };
    res.executionLogId = await saveWorkflowExecutionLogToFirestore(userId, execLog);
  } catch (e) {
    /* non-fatal */
  }

  return res;
}

async function executeActionNode(
  node: any,
  contact: Contact,
  userId: string,
  res: SingleContactResult,
  logEntries: any[],
  onProgress?: (progress: AutomationRunProgress) => void,
  contactIndex?: number,
  totalContacts?: number
) {
  const now = () => new Date().toISOString();
  const stepLabel = node.label || node.title || node.subtype || "Action";

  switch (node.subtype) {
    case "send_email": {
      const subject = node.config?.emailSubject || `Following up: ${contact.company}`;
      const body = node.config?.emailBody || `Hi ${contact.firstName || contact.name},\n\nI wanted to reach out regarding how we can help ${contact.company} achieve its goals.\n\nBest regards,\nThe Team`;

      try {
        const emailId = await recordSentEmailInFirestore(userId, "auto-campaign", contact.email, subject, body, "sent");
        await addCampaignEventToFirestore(userId, "auto-campaign", "email_sent", `Email "${subject}" sent to ${contact.name}`, { emailId, contactId: contact.id });
        await addInteractionAndAutoScore(contact, { type: "email_opened", description: `Campaign email sent: ${subject}` });
        res.emailsSent++;
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Email sent to ${contact.email}`, status: "success" });
        onProgress?.({ workflowName: "", contactName: contact.name, contactIndex: contactIndex || 0, totalContacts: totalContacts || 1, stepLabel: `Email sent to ${contact.email}`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Failed to send email: ${err?.message}`, status: "error" });
        res.errors.push(`Email send failed: ${err?.message}`);
      }
      break;
    }

    case "send_whatsapp": {
      const msg = node.config?.whatsappMessage || `Hi ${contact.firstName || contact.name}! Following up on our conversation.`;
      try {
        await addCampaignEventToFirestore(userId, "auto-campaign", "whatsapp_sent", `WhatsApp message sent to ${contact.name}`, { message: msg, contactId: contact.id });
        await addInteractionAndAutoScore(contact, { type: "whatsapp_sent", description: `WhatsApp: ${msg.slice(0, 80)}` });
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `WhatsApp sent to ${contact.phone || contact.name}`, status: "success" });
        onProgress?.({ workflowName: "", contactName: contact.name, contactIndex: contactIndex || 0, totalContacts: totalContacts || 1, stepLabel: `WhatsApp sent to ${contact.name}`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `WhatsApp failed: ${err?.message}`, status: "error" });
        res.errors.push(`WhatsApp failed: ${err?.message}`);
      }
      break;
    }

    case "send_sms": {
      const msg = node.config?.smsMessage || `Hi ${contact.firstName || contact.name}, following up!`;
      try {
        await addCampaignEventToFirestore(userId, "auto-campaign", "sms_sent", `SMS sent to ${contact.name}`, { message: msg, contactId: contact.id });
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `SMS sent to ${contact.phone || contact.name}`, status: "success" });
        onProgress?.({ workflowName: "", contactName: contact.name, contactIndex: contactIndex || 0, totalContacts: totalContacts || 1, stepLabel: `SMS sent`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `SMS failed: ${err?.message}`, status: "error" });
        res.errors.push(`SMS failed: ${err?.message}`);
      }
      break;
    }

    case "create_task": {
      const taskTitle = node.config?.taskTitle || "Follow up with lead";
      try {
        const taskData: Partial<Task> = {
          title: `${taskTitle}: ${contact.name}`,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "high",
          completed: false,
          assignee: "Sales AI Agent",
          relatedTo: contact.company || "General Outreach",
        };
        await addTaskToFirestore(userId, taskData);
        await addCampaignEventToFirestore(userId, "auto-campaign", "task_created", `Task created: ${taskTitle} for ${contact.name}`, { contactId: contact.id });
        res.tasksCreated++;
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Task created: ${taskTitle}`, status: "success" });
        onProgress?.({ workflowName: "", contactName: contact.name, contactIndex: contactIndex || 0, totalContacts: totalContacts || 1, stepLabel: `Task created`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Task creation failed: ${err?.message}`, status: "error" });
        res.errors.push(`Task creation failed: ${err?.message}`);
      }
      break;
    }

    case "create_deal": {
      try {
        const dealData: Partial<Deal> = {
          title: `New deal: ${contact.company}`,
          companyName: contact.company || "Unknown",
          contactName: contact.name,
          value: 50000,
          currency: "USD ($)",
          pipeline: "Standard Sales Pipeline",
          stage: "lead",
          probability: 25,
          expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          owner: contact.owner || "Alex Rivers",
        };
        await addDealToFirestore(userId, dealData);
        await addCampaignEventToFirestore(userId, "auto-campaign", "deal_created", `Deal created for ${contact.name} at ${contact.company}`, { contactId: contact.id });
        res.dealsCreated++;
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Deal created for ${contact.company}`, status: "success" });
        onProgress?.({ workflowName: "", contactName: contact.name, contactIndex: contactIndex || 0, totalContacts: totalContacts || 1, stepLabel: `Deal created`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Deal creation failed: ${err?.message}`, status: "error" });
        res.errors.push(`Deal creation failed: ${err?.message}`);
      }
      break;
    }

    case "lead_score": {
      const scoreChange = node.config?.scoreChange || 5;
      logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Lead score adjusted by ${scoreChange > 0 ? "+" : ""}${scoreChange}`, status: "info" });
      onProgress?.({ workflowName: "", contactName: contact.name, contactIndex: contactIndex || 0, totalContacts: totalContacts || 1, stepLabel: `Score adjusted`, status: "info" });
      break;
    }

    case "assign_sales_rep": {
      const rep = node.config?.assignedRep || "Auto-assigned";
      try {
        await updateContactInFirestore(contact.id, { owner: rep });
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Assigned to ${rep}`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Assignment failed: ${err?.message}`, status: "error" });
      }
      break;
    }

    case "update_contact": {
      try {
        if (node.config?.updateFields) {
          await updateContactInFirestore(contact.id, node.config.updateFields);
        }
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Contact updated`, status: "success" });
      } catch (err: any) {
        logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Update failed: ${err?.message}`, status: "error" });
      }
      break;
    }

    default:
      logEntries.push({ timestamp: now(), nodeId: node.id, nodeLabel: stepLabel, nodeType: "action", message: `Action executed: ${node.subtype}`, status: "info" });
      break;
  }
}
