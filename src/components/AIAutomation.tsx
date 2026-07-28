import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  Zap,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  Plus,
  Settings2,
  Clock,
  Send,
  FileText,
  Calendar,
  Share2,
  Users,
  ShieldCheck,
  Loader2,
  Activity,
  Mail,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  X,
  ChevronRight,
  Rocket,
  Target,
  Bell,
} from "lucide-react";
import {
  WorkflowAutomation,
  WorkflowExecutionLog,
  Contact,
  GeneratedCampaign,
} from "../types";
import {
  getUserWorkflows,
  getUserCampaigns,
  getUserContacts,
  updateWorkflowStatusInFirestore,
  saveWorkflowToFirestore,
  deleteWorkflowFromFirestore,
  getWorkflowExecutionLogsFromFirestore,
} from "../services/firestoreService";
import {
  runAutomationForUser,
  AutomationRunResult,
  AutomationRunProgress,
} from "../services/automationRunner";

interface ActivityEntry {
  id: string;
  timestamp: string;
  workflowName: string;
  contactName: string;
  stepLabel: string;
  status: "info" | "success" | "warning" | "error";
}

export const AIAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowAutomation[]>([]);
  const [campaigns, setCampaigns] = useState<GeneratedCampaign[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState<AutomationRunProgress | null>(null);
  const [lastRunResult, setLastRunResult] = useState<AutomationRunResult | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    activeWorkflows: 0,
    emailsSent: 0,
    tasksCreated: 0,
    dealsCreated: 0,
    contactsProcessed: 0,
  });
  const feedEndRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const dummyUserId = "usr-default";
      const [wfs, cmps, cts] = await Promise.all([
        getUserWorkflows(dummyUserId).catch(() => []),
        getUserCampaigns(dummyUserId).catch(() => []),
        getUserContacts(dummyUserId).catch(() => []),
      ]);
      setWorkflows(wfs);
      setCampaigns(cmps.filter((c) => c.status === "active"));
      setContacts(cts);
      setStats((prev) => ({
        ...prev,
        activeWorkflows: wfs.filter((w) => w.status === "active").length,
        totalExecutions: wfs.reduce((sum, w) => sum + (w.analytics?.totalExecutions || 0), 0),
      }));

      const logs = await getWorkflowExecutionLogsFromFirestore(dummyUserId).catch(() => []);
      setExecutionLogs(logs.slice(0, 20));
    } catch (err) {
      console.error("Error loading automation data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollTop = feedEndRef.current.scrollHeight;
    }
  }, [activityFeed]);

  const addActivity = (entry: Omit<ActivityEntry, "id" | "timestamp">) => {
    setActivityFeed((prev) =>
      [
        ...prev,
        {
          ...entry,
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ].slice(-100)
    );
  };

  const handleRunAll = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActivityFeed([]);
    setLastRunResult(null);
    addActivity({ workflowName: "System", contactName: "-", stepLabel: "Starting automation run across all active workflows and campaigns", status: "info" });

    try {
      const result = await runAutomationForUser("usr-default", (progress) => {
        setRunProgress(progress);
        addActivity({
          workflowName: progress.workflowName || "Campaign",
          contactName: progress.contactName,
          stepLabel: progress.stepLabel,
          status: progress.status,
        });
      });

      setLastRunResult(result);
      addActivity({
        workflowName: "System",
        contactName: "-",
        stepLabel: `Run complete: ${result.contactsProcessed} contacts processed, ${result.emailsSent} emails sent, ${result.tasksCreated} tasks created`,
        status: result.errors.length > 0 ? "warning" : "success",
      });

      setStats((prev) => ({
        ...prev,
        emailsSent: prev.emailsSent + result.emailsSent,
        tasksCreated: prev.tasksCreated + result.tasksCreated,
        dealsCreated: prev.dealsCreated + result.dealsCreated,
        contactsProcessed: prev.contactsProcessed + result.contactsProcessed,
        totalExecutions: prev.totalExecutions + result.contactsProcessed,
      }));

      loadData();
    } catch (err: any) {
      addActivity({ workflowName: "System", contactName: "-", stepLabel: `Error: ${err?.message}`, status: "error" });
    } finally {
      setIsRunning(false);
      setRunProgress(null);
    }
  };

  const toggleWorkflow = async (id: string, currentActive: boolean) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: currentActive ? "paused" : "active" } : w))
    );
    try {
      await updateWorkflowStatusInFirestore("usr-default", id, currentActive ? "paused" : "active");
    } catch (err) {
      console.error("Error toggling workflow:", err);
      loadData();
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      await deleteWorkflowFromFirestore(id);
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Error deleting workflow:", err);
    }
  };

  const handleCreateWorkflow = async (wf: Partial<WorkflowAutomation>) => {
    try {
      const id = await saveWorkflowToFirestore("usr-default", wf);
      setWorkflows((prev) => [...prev, { ...(wf as WorkflowAutomation), id }]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating workflow:", err);
    }
  };

  const activeWorkflowCount = workflows.filter((w) => w.status === "active").length;
  const progressPercent = runProgress
    ? Math.round(((runProgress.contactIndex + 1) / runProgress.totalContacts) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}`} />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {isRunning ? "Running Automations..." : "Autonomous Campaign Engine"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            AI Automation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automatically runs campaigns across all your contacts — sends emails, creates tasks, updates lead scores, and creates deals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRunAll}
            disabled={isRunning || loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Run All Automations</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>New Workflow</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && runProgress && (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span className="text-sm font-bold text-white">
                Processing {runProgress.contactName} ({runProgress.contactIndex + 1}/{runProgress.totalContacts})
              </span>
            </div>
            <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{runProgress.stepLabel}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={<Activity className="w-4 h-4" />} label="Total Runs" value={stats.totalExecutions} color="cyan" />
        <StatCard icon={<Zap className="w-4 h-4" />} label="Active Workflows" value={activeWorkflowCount} color="emerald" />
        <StatCard icon={<Mail className="w-4 h-4" />} label="Emails Sent" value={stats.emailsSent} color="blue" />
        <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Tasks Created" value={stats.tasksCreated} color="amber" />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Deals Created" value={stats.dealsCreated} color="purple" />
        <StatCard icon={<Users className="w-4 h-4" />} label="Contacts Processed" value={stats.contactsProcessed} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Workflows & Campaigns</h2>
            <span className="text-xs text-slate-500">{workflows.length} workflows, {campaigns.length} active campaigns</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
          ) : workflows.length === 0 && campaigns.length === 0 ? (
            <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-8 text-center">
              <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No workflows yet. Create one or launch a campaign to get started.</p>
            </div>
          ) : (
            <>
              {workflows.map((wf) => (
                <WorkflowCard
                  key={wf.id}
                  workflow={wf}
                  onToggle={() => toggleWorkflow(wf.id, wf.status === "active")}
                  onDelete={() => handleDeleteWorkflow(wf.id)}
                />
              ))}

              {campaigns.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active Campaign Auto-Workflows</h3>
                  {campaigns.map((cmp) => (
                    <CampaignWorkflowCard key={cmp.id} campaign={cmp} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Live Activity Feed</h2>
          <div
            ref={feedEndRef}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 h-[500px] overflow-y-auto custom-scrollbar space-y-2"
          >
            {activityFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bell className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">Activity will appear here when automations run.</p>
              </div>
            ) : (
              activityFeed.map((act) => (
                <div
                  key={act.id}
                  className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                    act.status === "success"
                      ? "bg-emerald-500/5 border border-emerald-500/20"
                      : act.status === "error"
                      ? "bg-rose-500/5 border border-rose-500/20"
                      : act.status === "warning"
                      ? "bg-amber-500/5 border border-amber-500/20"
                      : "bg-slate-800/50"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {act.status === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : act.status === "error" ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : act.status === "warning" ? (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium truncate">{act.stepLabel}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {act.timestamp} • {act.contactName}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Last Run Summary */}
          {lastRunResult && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Last Run Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <SummaryItem label="Contacts" value={lastRunResult.contactsProcessed} />
                <SummaryItem label="Emails" value={lastRunResult.emailsSent} />
                <SummaryItem label="Tasks" value={lastRunResult.tasksCreated} />
                <SummaryItem label="Deals" value={lastRunResult.dealsCreated} />
                <SummaryItem label="Scores Updated" value={lastRunResult.scoresUpdated} />
                <SummaryItem label="Errors" value={lastRunResult.errors.length} />
              </div>
              {lastRunResult.errors.length > 0 && (
                <div className="mt-2 p-2 bg-rose-500/5 border border-rose-500/20 rounded-lg text-[11px] text-rose-300 max-h-20 overflow-y-auto">
                  {lastRunResult.errors.slice(0, 3).map((e, i) => (
                    <p key={i} className="truncate">{e}</p>
                  ))}
                  {lastRunResult.errors.length > 3 && <p>...and {lastRunResult.errors.length - 3} more</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Execution Logs */}
      {executionLogs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recent Execution Logs</h2>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            {executionLogs.slice(0, 10).map((log, i) => (
              <div
                key={log.id || i}
                className={`flex items-center justify-between px-4 py-3 text-xs border-b border-slate-800 last:border-0 ${
                  log.status === "completed" ? "bg-emerald-500/5" : log.status === "failed" ? "bg-rose-500/5" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.status === "completed" ? "bg-emerald-400" : log.status === "failed" ? "bg-rose-400" : "bg-amber-400"
                    }`}
                  />
                  <span className="font-bold text-white truncate">{log.workflowName}</span>
                  <span className="text-slate-400 truncate hidden sm:inline">{log.contactName}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500">{log.logs?.length || 0} steps</span>
                  <span className={`font-bold ${log.status === "completed" ? "text-emerald-400" : log.status === "failed" ? "text-rose-400" : "text-amber-400"}`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <CreateWorkflowModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateWorkflow} />
      )}
    </div>
  );
};

// --- Sub Components ---

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({
  icon,
  label,
  value,
  color,
}) => {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };
  return (
    <div className={`rounded-xl p-3 border ${colorMap[color] || colorMap.cyan}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-extrabold text-white">{value.toLocaleString()}</p>
    </div>
  );
};

const SummaryItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className="font-bold text-white">{value}</span>
  </div>
);

const WorkflowCard: React.FC<{
  workflow: WorkflowAutomation;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ workflow, onToggle, onDelete }) => {
  const isActive = workflow.status === "active";
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
            isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"
          }`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{workflow.name}</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
              <span>{workflow.nodes?.length || 0} steps</span>
              <span>•</span>
              <span>{workflow.category}</span>
              <span>•</span>
              <span>{workflow.analytics?.totalExecutions || 0} runs</span>
            </div>
          </div>
        </div>
        {workflow.description && <p className="text-xs text-slate-400 pl-12">{workflow.description}</p>}
      </div>

      <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 justify-between md:justify-end">
        <button
          onClick={onDelete}
          className="px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isActive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {isActive ? (
            <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Active</span></>
          ) : (
            <><Pause className="w-4 h-4 text-slate-400" /><span>Paused</span></>
          )}
        </button>
      </div>
    </div>
  );
};

const CampaignWorkflowCard: React.FC<{ campaign: GeneratedCampaign }> = ({ campaign }) => {
  const steps = campaign.workflowNodes || [];
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-500/20 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm truncate">{campaign.name}</h3>
          <p className="text-[11px] text-slate-400">{campaign.type} • {campaign.goal}</p>
        </div>
        <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">Auto-Active</span>
      </div>
      {steps.length > 0 && (
        <div className="flex items-center gap-1 mt-2 pl-11 flex-wrap">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">{step.label || step.type}</span>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateWorkflowModal: React.FC<{
  onClose: () => void;
  onCreate: (wf: Partial<WorkflowAutomation>) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState("contact_created");
  const [action, setAction] = useState("send_email");
  const [actionConfig, setActionConfig] = useState({ emailSubject: "", emailBody: "", whatsappMessage: "", taskTitle: "" });

  const handleCreate = () => {
    if (!name.trim()) return;
    const configMap: Record<string, any> = {
      send_email: { emailSubject: actionConfig.emailSubject || "Follow up", emailBody: actionConfig.emailBody || "Hi there!" },
      send_whatsapp: { whatsappMessage: actionConfig.whatsappMessage || "Hi! Following up." },
      create_task: { taskTitle: actionConfig.taskTitle || "Follow up with lead" },
    };

    const workflow: Partial<WorkflowAutomation> = {
      name,
      description: description || `Custom workflow: ${name}`,
      category: "Custom Automation",
      status: "active",
      nodes: [
        { id: "n1", type: "trigger", subtype: trigger as any, label: "Trigger" },
        { id: "n2", type: "action", subtype: action as any, label: action.replace(/_/g, " "), config: configMap[action] },
        { id: "n3", type: "end", subtype: "end_workflow", label: "Complete" },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2", label: "Next" },
        { id: "e2", source: "n2", target: "n3", label: "Next" },
      ],
      analytics: { totalExecutions: 0, activeExecutions: 0, completedExecutions: 0, failedExecutions: 0, successRate: 0, avgDuration: 0, lastRunAt: "" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onCreate(workflow);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Custom Workflow</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workflow Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Lead Welcome Sequence"
              className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trigger</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="contact_created">New Contact Created</option>
                <option value="form_submitted">Form Submitted</option>
                <option value="deal_created">Deal Created</option>
                <option value="email_opened">Email Opened</option>
                <option value="meeting_booked">Meeting Booked</option>
                <option value="manual_trigger">Manual Trigger</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="send_email">Send Email</option>
                <option value="send_whatsapp">Send WhatsApp</option>
                <option value="send_sms">Send SMS</option>
                <option value="create_task">Create Task</option>
                <option value="create_deal">Create Deal</option>
                <option value="lead_score">Update Lead Score</option>
                <option value="assign_sales_rep">Assign Sales Rep</option>
              </select>
            </div>
          </div>

          {action === "send_email" && (
            <div className="space-y-2">
              <input value={actionConfig.emailSubject} onChange={(e) => setActionConfig({ ...actionConfig, emailSubject: e.target.value })} placeholder="Email subject" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none" />
              <textarea value={actionConfig.emailBody} onChange={(e) => setActionConfig({ ...actionConfig, emailBody: e.target.value })} placeholder="Email body" rows={3} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none" />
            </div>
          )}
          {action === "send_whatsapp" && (
            <input value={actionConfig.whatsappMessage} onChange={(e) => setActionConfig({ ...actionConfig, whatsappMessage: e.target.value })} placeholder="WhatsApp message" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none" />
          )}
          {action === "create_task" && (
            <input value={actionConfig.taskTitle} onChange={(e) => setActionConfig({ ...actionConfig, taskTitle: e.target.value })} placeholder="Task title" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none" />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 cursor-pointer">Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()} className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 text-sm font-extrabold cursor-pointer disabled:cursor-not-allowed">Create Workflow</button>
        </div>
      </div>
    </div>
  );
};
