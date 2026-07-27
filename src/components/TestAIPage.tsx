import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Send,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Terminal,
  Activity,
  Server,
  Code2,
  Trash2,
  Play,
  Zap,
} from "lucide-react";
import { streamAIChat, checkAIHealth, getStoredAISettings } from "../services/aiService";
import { getAILogsFromFirestore, logAIRequestToFirestore } from "../services/firestoreService";
import { AILogEntry, UserProfile } from "../types";
import { AIStatusBadge } from "./AIStatusBadge";

interface TestAIPageProps {
  user?: UserProfile | null;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
}

export const TestAIPage: React.FC<TestAIPageProps> = ({
  user,
  selectedModel = "llama3.2",
  onSelectModel,
}) => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(selectedModel);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTest, setActiveTest] = useState<{
    prompt: string;
    modelUsed: string;
    responseTimeMs: number;
    response: string;
    error?: string;
  } | null>(null);

  const [streamText, setStreamText] = useState("");
  const [logs, setLogs] = useState<AILogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const userId = user?.id || "guest";

  useEffect(() => {
    loadLogs();
  }, [userId]);

  useEffect(() => {
    if (selectedModel) setModel(selectedModel);
  }, [selectedModel]);

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    const fetchedLogs = await getAILogsFromFirestore(userId);
    setLogs(fetchedLogs);
    setIsLoadingLogs(false);
  };

  const handleRunTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    const testPrompt = prompt.trim();
    setIsProcessing(true);
    setStreamText("");
    setActiveTest(null);

    const startTime = Date.now();
    let capturedError: string | undefined = undefined;

    try {
      const { fullText, modelUsed, responseTimeMs, error } = await streamAIChat(
        testPrompt,
        [],
        "You are SalesFlow AI testing engine. Answer concisely and accurately.",
        (chunk) => {
          setStreamText((prev) => prev + chunk);
        },
        "Test AI Prompt",
        model,
        userId
      );

      const durationMs = Date.now() - startTime;
      capturedError = error;

      setActiveTest({
        prompt: testPrompt,
        modelUsed: modelUsed || model,
        responseTimeMs: durationMs,
        response: fullText || "AI service offline.",
        error: capturedError,
      });
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      capturedError = err.message || "AI service offline.";
      setActiveTest({
        prompt: testPrompt,
        modelUsed: model,
        responseTimeMs: durationMs,
        response: "AI service offline.",
        error: capturedError,
      });
    } finally {
      setIsProcessing(false);
      loadLogs();
    }
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Test AI Backend Diagnostics
              </h1>
              <p className="text-xs text-slate-400">
                Execute live prompt queries against your Ollama model backend with latency metrics and execution logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AIStatusBadge
            selectedModel={model}
            onSelectModel={(m) => {
              setModel(m);
              if (onSelectModel) onSelectModel(m);
            }}
          />
        </div>
      </div>

      {/* Main Grid: Prompt Form & Output Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              Prompt Execution Sandbox
            </h2>

            <form onSubmit={handleRunTest} className="space-y-4">
              {/* Model Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Select AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    if (onSelectModel) onSelectModel(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="llama3.2">Llama 3.2 (Default - General Purpose)</option>
                  <option value="qwen3">Qwen 3 (CRM & Strategy Analytics)</option>
                  <option value="gemma3">Gemma 3 (Social & Messaging)</option>
                </select>
              </div>

              {/* Prompt Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Prompt Input
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter any test prompt (e.g. Write a 3-step cold email pitch for a healthcare SaaS company...)"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono"
                />
              </div>

              {/* Sample Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Draft a B2B sales email for SaaS decision makers",
                  "Explain how lead scoring improves CRM pipeline conversion",
                  "Generate 3 catchy WhatsApp follow-up messages",
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample)}
                    className="text-[11px] bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-colors text-left truncate max-w-full"
                  >
                    "{sample.slice(0, 42)}..."
                  </button>
                ))}
              </div>

              {/* Run Button */}
              <button
                type="submit"
                disabled={isProcessing || !prompt.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Streaming AI Response...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run AI Test Query</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Execution Output Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 min-h-[340px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Diagnostic Metrics & Result
                </h2>
                {activeTest && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTest.error
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {activeTest.error ? "Error Recorded" : "Execution Success"}
                  </span>
                )}
              </div>

              {/* Metrics Display Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Model Used</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1 truncate">
                    {activeTest?.modelUsed || model}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Response Time</p>
                  <p className="text-xs font-bold text-indigo-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeTest ? `${activeTest.responseTimeMs} ms` : "0 ms"}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Status</p>
                  <p
                    className={`text-xs font-bold mt-1 ${
                      activeTest?.error
                        ? "text-rose-400"
                        : activeTest
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {activeTest?.error
                      ? "Offline / Error"
                      : activeTest
                      ? "200 OK"
                      : "Ready"}
                  </p>
                </div>
              </div>

              {/* Prompt Display */}
              {activeTest?.prompt && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Tested Prompt:
                  </span>
                  <p className="text-slate-300 italic font-mono">"{activeTest.prompt}"</p>
                </div>
              )}

              {/* Error Box if any */}
              {(activeTest?.error || streamText === "AI service offline.") && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Error Output: </span>
                    <span>{activeTest?.error || "AI service offline."}</span>
                  </div>
                </div>
              )}

              {/* Streaming Output Box */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  AI Output Response:
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {isProcessing ? (
                    streamText || (
                      <span className="text-slate-500 animate-pulse">
                        Connecting to Ollama model backend...
                      </span>
                    )
                  ) : activeTest?.response ? (
                    activeTest.response
                  ) : (
                    <span className="text-slate-600">
                      Submit a prompt above to view live stream tokens and model response metrics.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Logs Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            AI Execution Logs (Stored in Firestore)
          </h2>

          <button
            onClick={loadLogs}
            disabled={isLoadingLogs}
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoadingLogs ? "animate-spin" : ""}`} />
            <span>Refresh Logs</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No execution logs recorded yet. Run a prompt above to log request metrics!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[10px] uppercase text-slate-400 font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Latency</th>
                  <th className="px-4 py-3">Prompt</th>
                  <th className="px-4 py-3">Response Snippet</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.slice(0, 15).map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2.5 text-emerald-400 font-bold whitespace-nowrap">
                      {log.model}
                    </td>
                    <td className="px-4 py-2.5 text-indigo-400 whitespace-nowrap">
                      {log.responseTimeMs} ms
                    </td>
                    <td className="px-4 py-2.5 text-slate-200 max-w-[200px] truncate font-sans">
                      {log.prompt}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 max-w-[260px] truncate font-sans">
                      {log.response}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === "error" || log.response === "AI service offline."
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {log.status === "error" || log.response === "AI service offline."
                          ? "Error / Offline"
                          : "200 Success"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
