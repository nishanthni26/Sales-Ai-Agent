import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Bell,
  DollarSign,
  UserCheck,
  CheckSquare,
  FileText,
  Calendar,
  Send,
  Sliders,
  X,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Award,
  Globe,
  Database,
  Terminal,
  Activity,
  Bot,
  Tag,
  Gift,
  HelpCircle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  WorkflowAutomation,
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeType,
  WorkflowSubtype,
  WorkflowAnalytics,
  WorkflowExecutionLog,
  CRMContact,
  UserProfile,
} from "../types";
import {
  getUserWorkflows,
  saveWorkflowToFirestore,
  updateWorkflowStatusInFirestore,
  deleteWorkflowFromFirestore,
  getWorkflowExecutionLogsFromFirestore,
  saveWorkflowExecutionLogToFirestore,
} from "../services/firestoreService";
import { generateWorkflowFromAIPrompt } from "../services/aiService";
import { executeWorkflowForContact } from "../services/workflowEngine";
import { WORKFLOW_CATEGORIES, INITIAL_WORKFLOWS, WorkflowTemplate } from "./WorkflowMarketplacePage";

interface WorkflowAutomationEngineProps {
  user?: UserProfile | null;
  appMode?: "demo" | "real";
  selectedModel?: string;
  contacts?: CRMContact[];
  onCustomizeWithAI?: (wfName: string) => void;
}

// Initial Sample Workflows for Engine
const DEMO_WORKFLOWS: WorkflowAutomation[] = [
  {
    id: "wf-101",
    name: "Inbound Speed-to-Lead Instant Response",
    description: "Triggers on form submission. Delivers instant AI email, WhatsApp follow-up, and assigns round-robin sales rep.",
    category: "Lead Nurturing",
    status: "published",
    createdAt: "2026-07-20",
    updatedAt: "2026-07-23",
    analytics: {
      activeContacts: 34,
      completedContacts: 142,
      conversionRate: 38.4,
      openRate: 72.1,
      clickRate: 41.5,
      revenueGenerated: 68500,
      goalCompletion: 94,
      avgCompletionTime: "1.5 Days",
    },
    nodes: [
      { id: "n-1", type: "trigger", subtype: "form_submitted", label: "Form Submitted", description: "Fires when user submits Demo Request", config: {}, position: { x: 350, y: 40 } },
      { id: "n-2", type: "action", subtype: "send_email", label: "Send Instant AI Welcome Email", description: "Delivers personalized confirmation", config: { emailSubject: "Thanks for reaching out! Let's connect" }, position: { x: 350, y: 160 } },
      { id: "n-3", type: "delay", subtype: "delay_duration", label: "Wait 15 Minutes", description: "Pauses 15 mins before WhatsApp outreach", config: { delayHours: 0.25 }, position: { x: 350, y: 280 } },
      { id: "n-4", type: "condition", subtype: "if_email_opened", label: "If Email Opened?", description: "Checks if prospect opened email", config: {}, position: { x: 350, y: 400 } },
      { id: "n-5", type: "action", subtype: "send_whatsapp", label: "Send WhatsApp Concierge", description: "Sends calendar link on WhatsApp", config: { whatsappMessage: "Hi {{first_name}}! Select a time on our calendar that works best." }, position: { x: 180, y: 530 } },
      { id: "n-6", type: "action", subtype: "send_sms", label: "Send SMS Nudge", description: "Sends SMS reminder", config: { smsMessage: "SalesFlow: We received your request! Check email for details." }, position: { x: 520, y: 530 } },
      { id: "n-7", type: "action", subtype: "assign_sales_rep", label: "Assign Sales Rep", description: "Assigns to Senior AE", config: { assignedRep: "Alex Rivers" }, position: { x: 350, y: 660 } },
      { id: "n-8", type: "end", subtype: "end_workflow", label: "End Workflow", description: "Concludes instant response sequence", config: {}, position: { x: 350, y: 780 } },
    ],
    edges: [
      { id: "e1-2", source: "n-1", target: "n-2", label: "Next" },
      { id: "e2-3", source: "n-2", target: "n-3", label: "Next" },
      { id: "e3-4", source: "n-3", target: "n-4", label: "Next" },
      { id: "e4-5", source: "n-4", target: "n-5", label: "Yes (Opened)" },
      { id: "e4-6", source: "n-4", target: "n-6", label: "No (Not Opened)" },
      { id: "e5-7", source: "n-5", target: "n-7", label: "Next" },
      { id: "e6-7", source: "n-6", target: "n-7", label: "Next" },
      { id: "e7-8", source: "n-7", target: "n-8", label: "Complete" },
    ],
  },
  {
    id: "wf-102",
    name: "High-Yield Abandoned Cart & Checkout Recovery",
    description: "Recovers lost deals by sending timely multi-channel nudges with personalized discount codes.",
    category: "E-Commerce",
    status: "active",
    createdAt: "2026-07-18",
    updatedAt: "2026-07-22",
    analytics: {
      activeContacts: 18,
      completedContacts: 98,
      conversionRate: 36.2,
      openRate: 64.5,
      clickRate: 32.8,
      revenueGenerated: 42000,
      goalCompletion: 89,
      avgCompletionTime: "2.0 Days",
    },
    nodes: [
      { id: "n-1", type: "trigger", subtype: "landing_page_submitted", label: "Cart Abandoned", description: "Fires on incomplete checkout", config: {}, position: { x: 350, y: 40 } },
      { id: "n-2", type: "delay", subtype: "delay_duration", label: "Wait 1 Hour", description: "Allows 1 hour grace period", config: { delayHours: 1 }, position: { x: 350, y: 160 } },
      { id: "n-3", type: "condition", subtype: "if_purchase_completed", label: "Purchased?", description: "Checks if order was finalized", config: {}, position: { x: 350, y: 280 } },
      { id: "n-4", type: "action", subtype: "send_email", label: "Send Cart Recovery Email", description: "Sends saved checkout link", config: { emailSubject: "Complete your SalesFlow upgrade" }, position: { x: 200, y: 410 } },
      { id: "n-5", type: "action", subtype: "send_email", label: "Send Thank You Note", description: "Delivers receipt", config: {}, position: { x: 500, y: 410 } },
      { id: "n-6", type: "action", subtype: "create_deal", label: "Create Deal in CRM", description: "Logs deal in sales pipeline", config: { dealValueThreshold: 2500 }, position: { x: 200, y: 540 } },
      { id: "n-7", type: "end", subtype: "end_workflow", label: "End Workflow", description: "Concludes sequence", config: {}, position: { x: 350, y: 670 } },
    ],
    edges: [
      { id: "e1-2", source: "n-1", target: "n-2", label: "Next" },
      { id: "e2-3", source: "n-2", target: "n-3", label: "Next" },
      { id: "e3-4", source: "n-3", target: "n-4", label: "No (Abandoned)" },
      { id: "e3-5", source: "n-3", target: "n-5", label: "Yes (Purchased)" },
      { id: "e4-6", source: "n-4", target: "n-6", label: "Next" },
      { id: "e6-7", source: "n-6", target: "n-7", label: "Complete" },
      { id: "e5-7", source: "n-5", target: "n-7", label: "Complete" },
    ],
  },
];

// All available component types for Sidebar palette
const TRIGGER_COMPONENTS = [
  { subtype: "contact_created", label: "Contact Created", desc: "Triggers when a new contact enters the CRM" },
  { subtype: "form_submitted", label: "Form Submitted", desc: "Triggers on web form completion" },
  { subtype: "landing_page_submitted", label: "Landing Page Submitted", desc: "Triggers on landing page sign-up" },
  { subtype: "email_opened", label: "Email Opened", desc: "Triggers when recipient opens campaign email" },
  { subtype: "email_clicked", label: "Email Clicked", desc: "Triggers on link click in email" },
  { subtype: "deal_created", label: "Deal Created", desc: "Triggers when new pipeline deal is added" },
  { subtype: "deal_won", label: "Deal Won", desc: "Triggers when deal is marked Closed Won" },
  { subtype: "deal_lost", label: "Deal Lost", desc: "Triggers when deal is marked Closed Lost" },
  { subtype: "meeting_booked", label: "Meeting Booked", desc: "Triggers on calendar meeting booking" },
  { subtype: "purchase_completed", label: "Purchase Completed", desc: "Triggers on successful checkout transaction" },
  { subtype: "birthday", label: "Birthday", desc: "Triggers on contact birthday date" },
  { subtype: "anniversary", label: "Anniversary", desc: "Triggers on account milestone anniversary" },
  { subtype: "manual_trigger", label: "Manual Trigger", desc: "Triggered manually by team rep" },
  { subtype: "webhook_trigger", label: "Webhook Trigger", desc: "Triggers on external HTTP webhook POST" },
  { subtype: "csv_import", label: "CSV Import", desc: "Triggers on bulk contact CSV upload" },
];

const DELAY_COMPONENTS = [
  { subtype: "delay_duration", label: "Delay Duration", desc: "Waits specified hours or days before proceeding" },
  { subtype: "wait_until", label: "Wait Until", desc: "Pauses until exact date, time or countdown event" },
];

const CONDITION_COMPONENTS = [
  { subtype: "if_email_opened", label: "If Email Opened", desc: "Branches based on email open status" },
  { subtype: "if_email_not_opened", label: "If Email Not Opened", desc: "Branches if email remains unopened" },
  { subtype: "if_link_clicked", label: "If Link Clicked", desc: "Branches if prospect clicked link" },
  { subtype: "if_deal_value_gt", label: "If Deal Value >", desc: "Branches if deal value exceeds threshold" },
  { subtype: "if_country", label: "If Country", desc: "Branches based on contact geographic country" },
  { subtype: "if_tag_exists", label: "If Tag Exists", desc: "Branches if contact has specified tag" },
  { subtype: "if_lead_score_gt", label: "If Lead Score >", desc: "Branches if lead score exceeds threshold" },
  { subtype: "if_purchase_completed", label: "If Purchase Completed", desc: "Branches if customer made purchase" },
  { subtype: "if_meeting_booked", label: "If Meeting Booked", desc: "Branches if prospect scheduled meeting" },
];

const ACTION_COMPONENTS = [
  { subtype: "send_email", label: "Send Email", desc: "Delivers personalized email via SalesFlow AI" },
  { subtype: "send_whatsapp", label: "Send WhatsApp", desc: "Sends WhatsApp template or interactive message" },
  { subtype: "send_sms", label: "Send SMS", desc: "Delivers direct SMS mobile message" },
  { subtype: "push_notification", label: "Push Notification", desc: "Triggers mobile or web push notification" },
  { subtype: "create_deal", label: "Create Deal", desc: "Creates new deal stage in CRM pipeline" },
  { subtype: "update_contact", label: "Update Contact", desc: "Modifies contact status, tag or custom field" },
  { subtype: "assign_sales_rep", label: "Assign Sales Representative", desc: "Assigns account to sales rep or team" },
  { subtype: "create_task", label: "Create Task", desc: "Creates follow-up task for sales rep" },
  { subtype: "send_notification", label: "Send Notification", desc: "Alerts team member in SalesFlow dashboard" },
  { subtype: "generate_ai_followup", label: "Generate AI Follow-up", desc: "Generates dynamic AI response email draft" },
  { subtype: "generate_proposal", label: "Generate Proposal", desc: "Drafts automated sales proposal document" },
  { subtype: "book_meeting", label: "Book Meeting", desc: "Sends interactive single-click calendar booking link" },
  { subtype: "generate_report", label: "Generate Report", desc: "Compiles account engagement PDF summary" },
  { subtype: "lead_score", label: "Lead Score", desc: "Increments or decrements contact lead score" },
  { subtype: "webhook", label: "Webhook", desc: "Dispatches HTTP payload to external endpoint" },
  { subtype: "api_call", label: "API Call", desc: "Executes REST API endpoint call" },
];

const END_COMPONENTS = [
  { subtype: "end_workflow", label: "End Workflow", desc: "Concludes execution path for contact" },
];

export const WorkflowAutomationEngine: React.FC<WorkflowAutomationEngineProps> = ({
  user,
  appMode = "demo",
  selectedModel = "Llama 3.2",
  contacts = [],
  onCustomizeWithAI,
}) => {
  // Navigation View Mode: 'dashboard' | 'builder' | 'analytics' | 'marketplace'
  const [activeView, setActiveView] = useState<"dashboard" | "builder" | "analytics" | "marketplace">("dashboard");

  // Workflows state
  const [workflows, setWorkflows] = useState<WorkflowAutomation[]>(DEMO_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAutomation | null>(DEMO_WORKFLOWS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // AI Prompt Generator input
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Canvas visual state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isConnectingFromNode, setIsConnectingFromNode] = useState<string | null>(null);

  // Live Test Execution Modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedContactForTest, setSelectedContactForTest] = useState<CRMContact | null>(contacts[0] || null);
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog | null>(null);
  const [activeExecutingNodeId, setActiveExecutingNodeId] = useState<string | null>(null);

  // Historical Execution Logs
  const [allExecutionLogs, setAllExecutionLogs] = useState<WorkflowExecutionLog[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Workflows from Firestore if in Real AI Mode
  useEffect(() => {
    if (appMode === "real" && user && user.id !== "usr-demo") {
      async function loadRealData() {
        try {
          const list = await getUserWorkflows(user!.id);
          if (list.length > 0) {
            setWorkflows(list);
            if (!selectedWorkflow) setSelectedWorkflow(list[0]);
          }
          const logs = await getWorkflowExecutionLogsFromFirestore(user!.id);
          setAllExecutionLogs(logs);
        } catch (e) {
          console.error("Error loading Firestore workflows:", e);
        }
      }
      loadRealData();
    }
  }, [appMode, user]);

  // Handle AI Workflow Generation
  const handleGenerateAIWorkflow = async (customPrompt?: string) => {
    const queryPrompt = customPrompt || aiPrompt;
    if (!queryPrompt.trim()) return;

    setIsGeneratingAI(true);
    try {
      const newWf = await generateWorkflowFromAIPrompt(queryPrompt, selectedModel);

      if (appMode === "real" && user && user.id !== "usr-demo") {
        await saveWorkflowToFirestore(user.id, newWf);
      }

      setWorkflows((prev) => [newWf, ...prev]);
      setSelectedWorkflow(newWf);
      setAiPrompt("");
      setActiveView("builder");
      showToast(`AI generated workflow: "${newWf.name}"!`);
    } catch (e) {
      console.error("Error generating workflow:", e);
      showToast("Error generating workflow with AI.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle Create Blank Workflow
  const handleCreateBlankWorkflow = async () => {
    const newWf: WorkflowAutomation = {
      id: `wf-${Date.now()}`,
      name: "New Blank Sales Automation",
      description: "Custom drag and drop workflow built from scratch.",
      category: "Custom",
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      analytics: {
        activeContacts: 0,
        completedContacts: 0,
        conversionRate: 0,
        openRate: 0,
        clickRate: 0,
        revenueGenerated: 0,
        goalCompletion: 0,
        avgCompletionTime: "0 Hours",
      },
      nodes: [
        {
          id: "node-start",
          type: "trigger",
          subtype: "contact_created",
          label: "Contact Created",
          description: "Start workflow when contact is created",
          config: {},
          position: { x: 350, y: 50 },
        },
        {
          id: "node-end",
          type: "end",
          subtype: "end_workflow",
          label: "End Workflow",
          description: "End workflow execution",
          config: {},
          position: { x: 350, y: 300 },
        },
      ],
      edges: [
        { id: "e-start-end", source: "node-start", target: "node-end", label: "Next" },
      ],
    };

    if (appMode === "real" && user && user.id !== "usr-demo") {
      await saveWorkflowToFirestore(user.id, newWf);
    }

    setWorkflows((prev) => [newWf, ...prev]);
    setSelectedWorkflow(newWf);
    setActiveView("builder");
    showToast("Created new blank workflow!");
  };

  // Save current workflow updates
  const handleSaveWorkflow = async (updated: WorkflowAutomation) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setSelectedWorkflow(updated);

    if (appMode === "real" && user && user.id !== "usr-demo") {
      try {
        await saveWorkflowToFirestore(user.id, updated);
        showToast("Workflow saved to Firestore!");
      } catch (e) {
        showToast("Error saving workflow.");
      }
    } else {
      showToast("Workflow updated in local state!");
    }
  };

  // Duplicate Workflow
  const handleDuplicateWorkflow = async (wf: WorkflowAutomation) => {
    const dup: WorkflowAutomation = {
      ...wf,
      id: `wf-copy-${Date.now()}`,
      name: `${wf.name} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    if (appMode === "real" && user && user.id !== "usr-demo") {
      await saveWorkflowToFirestore(user.id, dup);
    }

    setWorkflows((prev) => [dup, ...prev]);
    showToast(`Duplicated "${wf.name}"!`);
  };

  // Delete Workflow
  const handleDeleteWorkflow = async (wfId: string) => {
    if (appMode === "real" && user && user.id !== "usr-demo") {
      await deleteWorkflowFromFirestore(wfId);
    }
    setWorkflows((prev) => prev.filter((w) => w.id !== wfId));
    if (selectedWorkflow?.id === wfId) {
      setSelectedWorkflow(workflows.find((w) => w.id !== wfId) || null);
    }
    showToast("Workflow deleted.");
  };

  // Toggle Workflow Status
  const handleToggleStatus = async (wf: WorkflowAutomation) => {
    const nextStatus = wf.status === "active" || wf.status === "published" ? "paused" : "active";
    const updated = { ...wf, status: nextStatus as any };

    if (appMode === "real" && user && user.id !== "usr-demo") {
      await updateWorkflowStatusInFirestore(user.id, wf.id, nextStatus as any);
    }

    handleSaveWorkflow(updated);
    showToast(`Workflow is now ${nextStatus.toUpperCase()}.`);
  };

  // Add node to selected workflow
  const handleAddNode = (type: WorkflowNodeType, subtype: WorkflowSubtype, label: string) => {
    if (!selectedWorkflow) return;

    const newId = `node-${Date.now()}`;
    const newY = (selectedWorkflow.nodes.length + 1) * 120;

    const newNode: WorkflowNode = {
      id: newId,
      type,
      subtype,
      label,
      description: `Configured ${label} component`,
      config: {},
      position: { x: 350, y: newY },
    };

    const updatedNodes = [...selectedWorkflow.nodes, newNode];
    let updatedEdges = [...selectedWorkflow.edges];

    // Auto connect to last non-end node
    const lastNode = selectedWorkflow.nodes[selectedWorkflow.nodes.length - 1];
    if (lastNode && lastNode.type !== "end") {
      updatedEdges.push({
        id: `e-${lastNode.id}-${newId}`,
        source: lastNode.id,
        target: newId,
        label: "Next",
      });
    }

    const updatedWf = { ...selectedWorkflow, nodes: updatedNodes, edges: updatedEdges };
    handleSaveWorkflow(updatedWf);
    setSelectedNode(newNode);
    showToast(`Added component "${label}" to Canvas!`);
  };

  // Connect two nodes
  const handleConnectNodes = (sourceId: string, targetId: string, edgeLabel: string = "Next") => {
    if (!selectedWorkflow || sourceId === targetId) return;

    const newEdge: WorkflowEdge = {
      id: `e-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      label: edgeLabel,
    };

    const updatedEdges = [...selectedWorkflow.edges.filter((e) => !(e.source === sourceId && e.target === targetId)), newEdge];
    const updatedWf = { ...selectedWorkflow, edges: updatedEdges };
    handleSaveWorkflow(updatedWf);
    setIsConnectingFromNode(null);
    showToast("Connected nodes successfully!");
  };

  // Delete Node
  const handleDeleteNode = (nodeId: string) => {
    if (!selectedWorkflow) return;

    const updatedNodes = selectedWorkflow.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = selectedWorkflow.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

    handleSaveWorkflow({ ...selectedWorkflow, nodes: updatedNodes, edges: updatedEdges });
    setSelectedNode(null);
    showToast("Node removed from canvas.");
  };

  // Execute Live Test Run
  const handleRunLiveTest = async () => {
    if (!selectedWorkflow) return;

    const dummyContact: CRMContact = selectedContactForTest || {
      id: "cnt-test-01",
      name: "Sarah Jenkins (Test Prospect)",
      email: "s.jenkins@apexcloud.io",
      phone: "+1 (555) 234-5678",
      company: "Apex Cloud Systems",
      role: "VP of Sales Operations",
      leadScore: 85,
      scoreGrade: "Hot",
      status: "lead",
      tags: ["Enterprise ICP", "Test Run"],
    };

    setIsExecutingTest(true);
    setExecutionLogs(null);

    const result = await executeWorkflowForContact(selectedWorkflow, dummyContact, (nodeId) => {
      setActiveExecutingNodeId(nodeId);
    });

    setExecutionLogs(result.log);
    setAllExecutionLogs((prev) => [result.log, ...prev]);

    if (appMode === "real" && user && user.id !== "usr-demo") {
      await saveWorkflowExecutionLogToFirestore(user.id, result.log);
    }

    setIsExecutingTest(false);
    setActiveExecutingNodeId(null);
    showToast("Live Test Run completed successfully!");
  };

  // Filtered Workflows list for dashboard
  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Node Color Helper
  const getNodeBadgeColor = (type: WorkflowNodeType) => {
    switch (type) {
      case "trigger":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "delay":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "condition":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      case "action":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "end":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#ececec] p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & VIEW TABS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                AI Workflow Automation Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider border border-indigo-500/30">
                Production-Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visual drag-and-drop builder, real AI generator, live contact execution runner, and analytics.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeView === "dashboard"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView("builder")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeView === "builder"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Visual Builder</span>
          </button>

          <button
            onClick={() => setActiveView("analytics")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeView === "analytics"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & Logs</span>
          </button>

          <button
            onClick={() => setActiveView("marketplace")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeView === "marketplace"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Marketplace Templates</span>
          </button>
        </div>
      </div>

      {/* AI WORKFLOW GENERATOR PROMPT BAR */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
              AI Workflow Generator
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Model: <strong className="text-emerald-400">{selectedModel}</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerateAIWorkflow()}
            placeholder="Type: 'Create a welcome email workflow', 'Create an abandoned cart workflow', 'Create a webinar reminder workflow'..."
            className="flex-1 px-4 py-2.5 bg-slate-950/90 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleGenerateAIWorkflow()}
            disabled={isGeneratingAI || !aiPrompt.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 shrink-0"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Building Graph...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Workflow</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips requested by prompt */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-slate-400 font-bold">Quick Prompts:</span>
          {[
            "Create a welcome email workflow.",
            "Create an abandoned cart workflow.",
            "Create a webinar reminder workflow.",
            "Create a lead nurturing workflow.",
          ].map((promptChip) => (
            <button
              key={promptChip}
              onClick={() => handleGenerateAIWorkflow(promptChip)}
              className="px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer font-medium"
            >
              "{promptChip}"
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: DASHBOARD */}
      {activeView === "dashboard" && (
        <div className="space-y-6">
          {/* Dashboard Controls & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-3xl">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter workflows by name or description..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCreateBlankWorkflow}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-950"
              >
                <Plus className="w-4 h-4" />
                <span>Create Workflow</span>
              </button>
            </div>
          </div>

          {/* Workflows Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkflows.map((wf) => (
              <div
                key={wf.id}
                className={`p-5 rounded-3xl bg-slate-900/90 border transition-all duration-200 space-y-4 shadow-xl flex flex-col justify-between relative group ${
                  selectedWorkflow?.id === wf.id
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-3">
                  {/* Status Badge & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${
                        wf.status === "published" || wf.status === "active"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : wf.status === "paused"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {wf.status}
                    </span>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleStatus(wf)}
                        title={wf.status === "active" || wf.status === "published" ? "Pause Workflow" : "Resume / Activate Workflow"}
                        className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
                      >
                        {wf.status === "active" || wf.status === "published" ? (
                          <Pause className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDuplicateWorkflow(wf)}
                        title="Duplicate Workflow"
                        className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      </button>

                      <button
                        onClick={() => handleDeleteWorkflow(wf.id)}
                        title="Delete Workflow"
                        className="p-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {wf.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  {/* Metrics preview */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Active</p>
                      <p className="text-xs font-black text-indigo-400">{wf.analytics?.activeContacts || 0}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Completed</p>
                      <p className="text-xs font-black text-emerald-400">{wf.analytics?.completedContacts || 0}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Conversion</p>
                      <p className="text-xs font-black text-amber-400">{wf.analytics?.conversionRate || 0}%</p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedWorkflow(wf);
                      setActiveView("builder");
                    }}
                    className="flex-1 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs rounded-xl border border-indigo-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit in Canvas</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedWorkflow(wf);
                      setIsTestModalOpen(true);
                    }}
                    className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs rounded-xl border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: VISUAL DRAG & DROP CANVAS BUILDER */}
      {activeView === "builder" && selectedWorkflow && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: WORKFLOW COMPONENTS PALETTE */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl max-h-[800px] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Components</span>
                </h2>
                <span className="text-[10px] font-mono text-slate-500">HubSpot Style</span>
              </div>

              {/* Triggers Category */}
              <div className="space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Triggers ({TRIGGER_COMPONENTS.length})
                </p>
                <div className="space-y-1">
                  {TRIGGER_COMPONENTS.map((item) => (
                    <button
                      key={item.subtype}
                      onClick={() => handleAddNode("trigger", item.subtype as any, item.label)}
                      className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 transition-all cursor-pointer space-y-0.5 group"
                    >
                      <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
                        <span>{item.label}</span>
                        <Plus className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delays Category */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Delays & Waits ({DELAY_COMPONENTS.length})
                </p>
                <div className="space-y-1">
                  {DELAY_COMPONENTS.map((item) => (
                    <button
                      key={item.subtype}
                      onClick={() => handleAddNode("delay", item.subtype as any, item.label)}
                      className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 transition-all cursor-pointer space-y-0.5 group"
                    >
                      <div className="text-xs font-bold text-purple-300 group-hover:text-purple-200 flex items-center justify-between">
                        <span>{item.label}</span>
                        <Plus className="w-3 h-3 text-slate-500 group-hover:text-purple-300" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditions Category */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> If/Else Conditions ({CONDITION_COMPONENTS.length})
                </p>
                <div className="space-y-1">
                  {CONDITION_COMPONENTS.map((item) => (
                    <button
                      key={item.subtype}
                      onClick={() => handleAddNode("condition", item.subtype as any, item.label)}
                      className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer space-y-0.5 group"
                    >
                      <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center justify-between">
                        <span>{item.label}</span>
                        <Plus className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Category */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Actions ({ACTION_COMPONENTS.length})
                </p>
                <div className="space-y-1">
                  {ACTION_COMPONENTS.map((item) => (
                    <button
                      key={item.subtype}
                      onClick={() => handleAddNode("action", item.subtype as any, item.label)}
                      className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer space-y-0.5 group"
                    >
                      <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 flex items-center justify-between">
                        <span>{item.label}</span>
                        <Plus className="w-3 h-3 text-slate-500 group-hover:text-emerald-300" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* End Category */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> End Workflow ({END_COMPONENTS.length})
                </p>
                <div className="space-y-1">
                  {END_COMPONENTS.map((item) => (
                    <button
                      key={item.subtype}
                      onClick={() => handleAddNode("end", item.subtype as any, item.label)}
                      className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer space-y-0.5 group"
                    >
                      <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200 flex items-center justify-between">
                        <span>{item.label}</span>
                        <Plus className="w-3 h-3 text-slate-500 group-hover:text-rose-300" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CENTER: VISUAL CANVAS GRAPH */}
          <div className="lg:col-span-9 space-y-4">
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between p-4 bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white">{selectedWorkflow.name}</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedWorkflow.nodes.length} Nodes | {selectedWorkflow.edges.length} Connections
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-300 px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  <Play className="w-4 h-4" />
                  <span>Run Live Test</span>
                </button>
              </div>
            </div>

            {/* Canvas Graph Rendering Surface */}
            <div className="relative min-h-[650px] bg-slate-950 border border-slate-800/80 rounded-3xl p-8 overflow-auto shadow-2xl bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
              <div
                className="relative transition-transform duration-200 origin-top-center min-w-[700px] flex flex-col items-center space-y-8"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {selectedWorkflow.nodes.map((node, index) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isExecuting = activeExecutingNodeId === node.id;

                  return (
                    <div key={node.id} className="relative flex flex-col items-center group">
                      {/* Edge Connection Line Leading to next */}
                      {index > 0 && (
                        <div className="w-0.5 h-8 bg-indigo-500/40 my-1 relative flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                          <span className="absolute -right-12 text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            Next
                          </span>
                        </div>
                      )}

                      {/* Interactive Visual Node Card */}
                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`w-80 p-4 rounded-2xl bg-slate-900 border transition-all duration-200 shadow-xl cursor-pointer relative ${
                          isExecuting
                            ? "border-emerald-400 ring-4 ring-emerald-500/30 scale-105"
                            : isSelected
                            ? "border-indigo-500 ring-2 ring-indigo-500/30"
                            : "border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {/* Header & Subtype Badge */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                          <span
                            className={`px-2 py-0.5 rounded-full font-extrabold text-[9px] uppercase tracking-wider border ${getNodeBadgeColor(
                              node.type
                            )}`}
                          >
                            {node.type} • {node.subtype.replace("_", " ")}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="p-1 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove Node"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Title & Description */}
                        <div className="pt-2 space-y-1">
                          <h4 className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{node.label}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {node.description || "Click to configure parameters..."}
                          </p>
                        </div>

                        {/* Config Summary Chips */}
                        {Object.keys(node.config || {}).length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1">
                            {node.config.emailSubject && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                                Subj: {node.config.emailSubject.slice(0, 20)}...
                              </span>
                            )}
                            {node.config.delayHours && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
                                Delay: {node.config.delayHours} hrs
                              </span>
                            )}
                            {node.config.scoreChange && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                                Score: +{node.config.scoreChange}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ANALYTICS & EXECUTION LOGS */}
      {activeView === "analytics" && (
        <div className="space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase">Active Contacts</p>
              <p className="text-2xl font-black text-indigo-400">
                {selectedWorkflow?.analytics?.activeContacts || 42}
              </p>
              <p className="text-[10px] text-slate-500">Currently in workflow</p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase">Completed Contacts</p>
              <p className="text-2xl font-black text-emerald-400">
                {selectedWorkflow?.analytics?.completedContacts || 184}
              </p>
              <p className="text-[10px] text-emerald-500 font-bold">+18% vs last week</p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase">Conversion Rate</p>
              <p className="text-2xl font-black text-amber-400">
                {selectedWorkflow?.analytics?.conversionRate || 34.2}%
              </p>
              <p className="text-[10px] text-amber-500 font-bold">Verified ROI</p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase">Revenue Generated</p>
              <p className="text-2xl font-black text-emerald-400">
                ${(selectedWorkflow?.analytics?.revenueGenerated || 68500).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Attributed sales deals</p>
            </div>
          </div>

          {/* Detailed Logs Table */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Execution Logs Stream</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Showing {allExecutionLogs.length} historical logs
              </span>
            </div>

            {allExecutionLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No execution logs recorded yet. Run a live test in the Canvas Builder to see step-by-step logs!
              </div>
            ) : (
              <div className="space-y-3">
                {allExecutionLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="text-indigo-300">{log.workflowName}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{log.completedAt}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Executed for contact: <strong>{log.contactName}</strong> ({log.contactEmail})
                    </div>
                    <div className="space-y-1 pt-2 border-t border-slate-900">
                      {log.logs.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          <span className="text-slate-500">[{entry.timestamp}]</span>
                          <span className="text-emerald-400 font-bold">{entry.nodeLabel}:</span>
                          <span>{entry.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: MARKETPLACE TEMPLATES GALLERY */}
      {activeView === "marketplace" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INITIAL_WORKFLOWS.slice(0, 9).map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 shadow-xl cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {tmpl.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{tmpl.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{tmpl.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-bold">{tmpl.estimatedResults}</span>
                  <button
                    onClick={() => {
                      handleGenerateAIWorkflow(tmpl.name);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Load into Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEST EXECUTION MODAL */}
      {isTestModalOpen && selectedWorkflow && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Run Live Test Execution</span>
              </h3>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Select Target Contact:</label>
                <select
                  value={selectedContactForTest?.id || ""}
                  onChange={(e) => {
                    const found = contacts.find((c) => c.id === e.target.value);
                    if (found) setSelectedContactForTest(found);
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white cursor-pointer"
                >
                  {contacts.length === 0 ? (
                    <option value="cnt-demo">Sarah Jenkins (Demo Lead)</option>
                  ) : (
                    contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.email} ({c.company})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Execution Progress & Stream Output */}
              {executionLogs && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-h-60 overflow-y-auto font-mono text-[11px]">
                  <p className="text-emerald-400 font-bold">Live Execution Output:</p>
                  {executionLogs.logs.map((e, idx) => (
                    <div key={idx} className="text-slate-300">
                      <span className="text-slate-500">[{e.timestamp}]</span>{" "}
                      <span className="text-indigo-300">[{e.nodeLabel}]</span> {e.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={handleRunLiveTest}
                disabled={isExecutingTest}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExecutingTest ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Start Live Runner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
