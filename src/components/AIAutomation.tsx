import React, { useState } from "react";
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
} from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  active: boolean;
  executions: number;
  lastRun: string;
}

const initialAutomations: AutomationRule[] = [
  {
    id: "auto-1",
    name: "Instant Portal Lead Qualification Agent",
    description: "AI Copilot immediately texts inbound leads from Zillow & Realtor.com to qualify budget, timeline, and pre-approval status.",
    trigger: "New Lead Created in CRM",
    action: "Send AI SMS Qualification Sequence",
    active: true,
    executions: 342,
    lastRun: "8m ago",
  },
  {
    id: "auto-2",
    name: "Automated WhatsApp Showing Scheduler",
    description: "Coordinates buyer calendar with listing agent availability and sends WhatsApp confirmation with directions.",
    trigger: "Lead Score > 80 & Tour Requested",
    action: "Dispatch WhatsApp Calendar Link",
    active: true,
    executions: 128,
    lastRun: "22m ago",
  },
  {
    id: "auto-3",
    name: "Price Reduction Broadcast Engine",
    description: "Auto-scans property price changes and fires personalized alerts to all buyers with matching budget profiles.",
    trigger: "Property Price Decreased",
    action: "Broadcast WhatsApp & Email Alert",
    active: true,
    executions: 84,
    lastRun: "2h ago",
  },
  {
    id: "auto-4",
    name: "Purchase Contract AI Deadline Parser",
    description: "Parses signed PDF agreements to extract inspection, financing, and escrow closing dates directly into team calendar.",
    trigger: "Document Uploaded (Purchase Agreement)",
    action: "Extract Deadlines & Create Tasks",
    active: true,
    executions: 56,
    lastRun: "1d ago",
  },
  {
    id: "auto-5",
    name: "Open House Visitor Auto-Followup Drip",
    description: "Sends customized thank-you video and floorplan PDF 2 hours after open house sign-in form is submitted.",
    trigger: "Open House Form Submitted",
    action: "Trigger 3-Day Nurture Drip",
    active: false,
    executions: 210,
    lastRun: "3d ago",
  },
];

export const AIAutomation: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>(initialAutomations);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Autonomous Real Estate Workflows
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            AI Automation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automate lead nurture, showing dispatches, contract deadline tracking, and listing broadcasts on autopilot.
          </p>
        </div>

        <button
          onClick={() => alert("Creating a new AI Workflow Rule...")}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Workflow</span>
        </button>
      </div>

      {/* AUTOMATION CARDS GRID */}
      <div className="space-y-4">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  auto.active ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{auto.name}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>Trigger: <strong className="text-slate-200">{auto.trigger}</strong></span>
                    <span>•</span>
                    <span>Action: <strong className="text-cyan-400">{auto.action}</strong></span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 pl-12">{auto.description}</p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 justify-between md:justify-end">
              <div className="text-right text-xs">
                <p className="font-extrabold text-white">{auto.executions.toLocaleString()} Triggers</p>
                <p className="text-[10px] text-slate-500">Last run: {auto.lastRun}</p>
              </div>

              <button
                onClick={() => toggleAutomation(auto.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  auto.active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {auto.active ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-slate-400" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
