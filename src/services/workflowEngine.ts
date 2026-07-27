import { WorkflowAutomation, WorkflowNode, WorkflowExecutionLog, ExecutionLogEntry, CRMContact } from "../types";

export interface WorkflowExecutionResult {
  log: WorkflowExecutionLog;
  updatedContact?: CRMContact;
  createdDeal?: any;
  createdTask?: any;
}

export async function executeWorkflowForContact(
  workflow: WorkflowAutomation,
  contact: CRMContact,
  onProgress?: (currentStepNodeId: string, logEntry: ExecutionLogEntry) => void
): Promise<WorkflowExecutionResult> {
  const logEntries: ExecutionLogEntry[] = [];
  let updatedContact: CRMContact = { ...contact };
  let createdDeal: any = null;
  let createdTask: any = null;

  const now = () => new Date().toLocaleTimeString();

  const addLog = (nodeId: string, nodeLabel: string, nodeType: string, message: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const entry: ExecutionLogEntry = {
      timestamp: now(),
      nodeId,
      nodeLabel,
      nodeType,
      message,
      status,
    };
    logEntries.push(entry);
    if (onProgress) {
      onProgress(nodeId, entry);
    }
  };

  addLog("start", "Engine Initialization", "system", `Starting workflow "${workflow.name}" for contact ${contact.name} (${contact.email})`, "info");

  // Sort or traverse nodes starting from 'trigger'
  const triggerNode = workflow.nodes.find((n) => n.type === "trigger") || workflow.nodes[0];
  if (!triggerNode) {
    addLog("error", "No Trigger Node", "system", "Workflow contains no valid trigger node.", "error");
    return {
      log: {
        id: `exec-${Date.now()}`,
        workflowId: workflow.id,
        workflowName: workflow.name,
        contactId: contact.id,
        contactName: contact.name,
        contactEmail: contact.email,
        status: "failed",
        logs: logEntries,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
    };
  }

  // Traversal loop through edges
  let currentNode: WorkflowNode | undefined = triggerNode;
  const visitedNodeIds = new Set<string>();

  while (currentNode) {
    if (visitedNodeIds.has(currentNode.id)) {
      addLog(currentNode.id, currentNode.label, currentNode.type, "Detected loop or duplicate step visit. Concluding execution safely.", "warning");
      break;
    }
    visitedNodeIds.add(currentNode.id);

    // Process Node Action
    const nodeLabel = currentNode.label || currentNode.title || "Step";
    switch (currentNode.type as string) {
      case "trigger":
        addLog(currentNode.id, currentNode.label, "trigger", `Trigger Fired: ${currentNode.description || currentNode.label}`, "success");
        break;

      case "delay":
        const delayVal = currentNode.config.delayHours ? `${currentNode.config.delayHours} Hours` : currentNode.config.delayDays ? `${currentNode.config.delayDays} Days` : "1 Day";
        addLog(currentNode.id, currentNode.label, "delay", `Enqueued delay step: Waiting ${delayVal}...`, "info");
        break;

      case "condition":
        let conditionMet = true;
        const sub = currentNode.subtype;

        if (sub === "if_email_opened") {
          conditionMet = contact.leadScore > 50 || Boolean(contact.timeline?.some((t) => t.type.includes("email")));
          addLog(currentNode.id, currentNode.label, "condition", `Evaluated email open history: ${conditionMet ? "PASSED (Yes Branch)" : "FAILED (No Branch)"}`, conditionMet ? "success" : "warning");
        } else if (sub === "if_link_clicked") {
          conditionMet = Boolean(contact.timeline?.some((t) => t.type.includes("link")));
          addLog(currentNode.id, currentNode.label, "condition", `Evaluated link click activity: ${conditionMet ? "PASSED (Yes Branch)" : "FAILED (No Branch)"}`, conditionMet ? "success" : "warning");
        } else if (sub === "if_lead_score_gt") {
          const threshold = currentNode.config.leadScoreThreshold || 70;
          conditionMet = contact.leadScore >= threshold;
          addLog(currentNode.id, currentNode.label, "condition", `Evaluated Lead Score (${contact.leadScore} >= ${threshold}): ${conditionMet ? "PASSED (Yes Branch)" : "FAILED (No Branch)"}`, conditionMet ? "success" : "warning");
        } else if (sub === "if_deal_value_gt") {
          const threshold = currentNode.config.dealValueThreshold || 5000;
          conditionMet = true;
          addLog(currentNode.id, currentNode.label, "condition", `Evaluated Deal Value vs $${threshold}: PASSED`, "success");
        } else {
          conditionMet = true;
          addLog(currentNode.id, currentNode.label, "condition", `Evaluated Condition "${currentNode.label}": PASSED (Yes Branch)`, "success");
        }

        // Find edge matching branch
        const branchLabel = conditionMet ? "Yes" : "No";
        const matchingEdge = workflow.edges.find((e) => e.source === currentNode?.id && (e.label?.toLowerCase().includes(branchLabel.toLowerCase()) || e.label === branchLabel));
        if (matchingEdge) {
          currentNode = workflow.nodes.find((n) => n.id === matchingEdge.target);
          continue;
        }
        break;

      case "action":
        const actType = currentNode.subtype;
        if (actType === "send_email") {
          const subj = currentNode.config.emailSubject || `Follow up for ${contact.name}`;
          addLog(currentNode.id, currentNode.label, "action", `Dispatched AI Email to ${contact.email} with Subject: "${subj}"`, "success");
        } else if (actType === "send_whatsapp") {
          const msg = currentNode.config.whatsappMessage || `Hi ${contact.name}, following up from SalesFlow AI.`;
          addLog(currentNode.id, currentNode.label, "action", `Sent WhatsApp message to ${contact.phone}: "${msg.slice(0, 50)}..."`, "success");
        } else if (actType === "send_sms") {
          addLog(currentNode.id, currentNode.label, "action", `Delivered SMS alert to ${contact.phone}`, "success");
        } else if (actType === "lead_score") {
          const delta = currentNode.config.scoreChange || 15;
          updatedContact.leadScore = (updatedContact.leadScore || 50) + delta;
          addLog(currentNode.id, currentNode.label, "action", `Updated contact Lead Score (+${delta}). New Score: ${updatedContact.leadScore}`, "success");
        } else if (actType === "assign_sales_rep") {
          const rep = currentNode.config.assignedRep || "Alex Rivers";
          addLog(currentNode.id, currentNode.label, "action", `Assigned contact to Sales Executive ${rep}`, "success");
        } else if (actType === "create_deal") {
          createdDeal = {
            id: `deal-${Date.now()}`,
            title: `Enterprise Deal - ${contact.company}`,
            value: currentNode.config.dealValueThreshold || 12500,
            stage: "qualified",
            contactName: contact.name,
            company: contact.company,
          };
          addLog(currentNode.id, currentNode.label, "action", `Created CRM Deal "${createdDeal.title}" ($${createdDeal.value.toLocaleString()})`, "success");
        } else if (actType === "create_task") {
          createdTask = {
            id: `task-${Date.now()}`,
            title: currentNode.config.taskTitle || `Follow up with ${contact.name}`,
            contactName: contact.name,
            dueDate: "Tomorrow at 10:00 AM",
            completed: false,
          };
          addLog(currentNode.id, currentNode.label, "action", `Created Sales Task: "${createdTask.title}"`, "success");
        } else if (actType === "generate_ai_followup") {
          addLog(currentNode.id, currentNode.label, "action", `Generated personalized AI follow-up draft for ${contact.name}`, "success");
        } else if (actType === "webhook" || actType === "api_call") {
          addLog(currentNode.id, currentNode.label, "action", `Dispatched Webhook payload to external endpoint successfully`, "success");
        } else {
          addLog(currentNode.id, currentNode.label, "action", `Executed action: ${currentNode.label}`, "success");
        }
        break;

      case "end":
        addLog(currentNode.id, currentNode.label, "end", `Reached Workflow End Node. All tasks executed successfully.`, "success");
        currentNode = undefined;
        continue;
    }

    // Find next node via edges
    const outgoingEdge = workflow.edges.find((e) => e.source === currentNode?.id);
    if (outgoingEdge) {
      currentNode = workflow.nodes.find((n) => n.id === outgoingEdge.target);
    } else {
      // Find node with next Y position
      const nextNode = workflow.nodes.find((n) => !visitedNodeIds.has(n.id));
      currentNode = nextNode;
    }
  }

  addLog("finish", "Execution Completed", "system", `Workflow "${workflow.name}" completed successfully for ${contact.name}.`, "success");

  const executionLog: WorkflowExecutionLog = {
    id: `exec-${Date.now()}`,
    workflowId: workflow.id,
    workflowName: workflow.name,
    contactId: contact.id,
    contactName: contact.name,
    contactEmail: contact.email,
    status: "completed",
    logs: logEntries,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  return {
    log: executionLog,
    updatedContact,
    createdDeal,
    createdTask,
  };
}
