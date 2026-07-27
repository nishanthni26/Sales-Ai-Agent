import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { checkAIHealth } from "../services/aiService";

interface AIStatusBadgeProps {
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
  showModelSelector?: boolean;
  className?: string;
}

export const AIStatusBadge: React.FC<AIStatusBadgeProps> = ({
  selectedModel = "llama3.2",
  onSelectModel,
  showModelSelector = true,
  className = "",
}) => {
  const [status, setStatus] = useState<"connected" | "offline" | "checking">("checking");
  const [latency, setLatency] = useState<number>(0);
  const [provider, setProvider] = useState<string>("ollama");

  const runHealthCheck = async () => {
    setStatus("checking");
    const res = await checkAIHealth();
    setStatus(res.connected ? "connected" : "offline");
    setLatency(res.latencyMs);
    setProvider(res.provider);
  };

  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 20000); // Check every 20s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* AI Connection Status Badge */}
      <button
        onClick={runHealthCheck}
        title={`Click to re-ping AI Service (${provider})`}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          status === "connected"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            : status === "offline"
            ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
            : "bg-slate-800 border-slate-700 text-slate-400"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            status === "connected"
              ? "bg-emerald-400 animate-pulse"
              : status === "offline"
              ? "bg-rose-500"
              : "bg-amber-400 animate-spin"
          }`}
        />
        <span>
          {status === "connected" ? (
            provider === "gemini" ? "Live Gemini" : provider === "ollama" ? "Live Ollama" : "Live AI"
          ) : status === "offline" ? (
            "Standby"
          ) : (
            "Connecting..."
          )}
        </span>
        {status === "connected" && latency > 0 && (
          <span className="text-[10px] opacity-70 font-mono">({latency}ms)</span>
        )}
      </button>

      {/* Model Selector Dropdown */}
      {showModelSelector && onSelectModel && (
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 ml-2" />
          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium py-1 px-2 focus:outline-none cursor-pointer"
          >
            <option value="llama3.2" className="bg-slate-900 text-white">
              Llama 3.2
            </option>
            <option value="qwen3" className="bg-slate-900 text-white">
              Qwen 3
            </option>
            <option value="gemma3" className="bg-slate-900 text-white">
              Gemma 3
            </option>
          </select>
        </div>
      )}
    </div>
  );
};
