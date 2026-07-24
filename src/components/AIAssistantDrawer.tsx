import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  Zap,
  CheckCircle2,
  Rocket,
  BarChart2,
  Users,
  Mail,
  MessageSquare,
  Globe,
  Calendar,
} from "lucide-react";
import { askAIChat } from "../services/aiService";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onExecuteCommand: (command: string) => void;
}

const QUICK_COMMANDS = [
  "Create another campaign.",
  "Send follow-up emails.",
  "Show campaign report.",
  "Import contacts.",
  "Create landing page.",
  "Generate WhatsApp messages.",
  "Book meetings.",
  "Show CRM.",
];

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  initialQuery,
  onExecuteCommand,
}) => {
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; text: string; actionApplied?: string }[]
  >([
    {
      id: "a-welcome",
      role: "assistant",
      text: "👋 I'm your persistent SalesFlow AI Assistant. What action would you like me to execute for you?",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleRunCommand(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleRunCommand = async (cmdText: string) => {
    const userMsg = { id: `a-usr-${Date.now()}`, role: "user" as const, text: cmdText };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsProcessing(true);

    // Call server AI endpoint or process locally
    const aiRes = await askAIChat(cmdText);
    setIsProcessing(false);

    let actionLabel = "";
    const lower = cmdText.toLowerCase();

    if (lower.includes("campaign") && (lower.includes("create") || lower.includes("new"))) {
      actionLabel = "Navigated to Campaign Wizard";
      onExecuteCommand("nav:wizard");
    } else if (lower.includes("report") || lower.includes("analytics")) {
      actionLabel = "Opened Analytics Dashboard";
      onExecuteCommand("nav:dashboard");
    } else if (lower.includes("crm") || lower.includes("contact")) {
      actionLabel = "Opened CRM Hub";
      onExecuteCommand("nav:crm");
    } else if (lower.includes("landing page")) {
      actionLabel = "Generated Landing Page Preview";
      onExecuteCommand("preview:landing");
    } else if (lower.includes("whatsapp")) {
      actionLabel = "Generated WhatsApp Sequence";
      onExecuteCommand("preview:whatsapp");
    } else if (lower.includes("meeting") || lower.includes("book")) {
      actionLabel = "Opened Meetings Calendar";
      onExecuteCommand("nav:crm:meetings");
    }

    const botMsg = {
      id: `a-bot-${Date.now()}`,
      role: "assistant" as const,
      text:
        aiRes.text ||
        `Executed action: "${cmdText}". ${
          actionLabel ? `[Action Result: ${actionLabel}]` : "I've applied this to your active sales workflow."
        }`,
      actionApplied: actionLabel,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    handleRunCommand(inputQuery);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col relative shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">SalesFlow AI Assistant</h3>
              <p className="text-[10px] text-emerald-400 font-medium">Ready for Commands</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            id="assistant-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Chips */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5">
          {QUICK_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleRunCommand(cmd)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700/60 text-indigo-300 transition-all"
            >
              &gt; {cmd}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-xs p-3.5 rounded-2xl ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                {m.actionApplied && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{m.actionApplied}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Executing AI action...</span>
            </div>
          )}
        </div>

        {/* Footer Command Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type command e.g. 'Show campaign report'..."
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            id="assistant-input-box"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
            id="assistant-submit-btn"
          >
            <span>Run</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
