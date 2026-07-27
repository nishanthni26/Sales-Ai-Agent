import React, { useState, useEffect } from "react";
import {
  Settings,
  Server,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Zap,
  Globe,
  Gauge,
  Radio,
  Sparkles,
} from "lucide-react";
import { getStoredAISettings, saveStoredAISettings, checkAIHealth, DEFAULT_AI_SETTINGS } from "../services/aiService";
import { AISettings, UserProfile } from "../types";
import { AIStatusBadge } from "./AIStatusBadge";

interface AISettingsPageProps {
  user?: UserProfile | null;
  onSettingsSaved?: (newSettings: AISettings) => void;
}

export const AISettingsPage: React.FC<AISettingsPageProps> = ({ user, onSettingsSaved }) => {
  const [settings, setSettings] = useState<AISettings>(getStoredAISettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    connected: boolean;
    latencyMs: number;
    provider: string;
  } | null>(null);

  const userId = user?.id || "default_user";

  useEffect(() => {
    runHealthTest();
  }, []);

  const runHealthTest = async () => {
    const res = await checkAIHealth(settings.ollamaUrl);
    setHealthStatus({
      connected: res.connected,
      latencyMs: res.latencyMs,
      provider: res.provider,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    saveStoredAISettings(settings, userId);
    if (onSettingsSaved) onSettingsSaved(settings);

    await runHealthTest();

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_AI_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              AI Service Settings & Ollama Config
            </h1>
            <p className="text-xs text-slate-400">
              Configure your local Ollama AI endpoints, model selection, temperature, and generation parameters.
            </p>
          </div>
        </div>

        <AIStatusBadge selectedModel={settings.defaultModel} />
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Endpoint Configuration Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Ollama Server Connection
            </h2>

            {healthStatus && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  healthStatus.connected
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthStatus.connected ? "bg-emerald-400" : "bg-rose-500"
                  }`}
                />
                {healthStatus.connected ? "Connected" : "AI Service Offline"}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ollama API Chat Endpoint URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={settings.ollamaUrl}
                  onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                  placeholder="http://localhost:11434/api/chat"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Default endpoint: <code className="text-emerald-400">http://localhost:11434/api/chat</code>
              </p>
            </div>
          </div>
        </div>

        {/* Model Selection Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Default Model Selection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "llama3.2",
                name: "Llama 3.2",
                tag: "General Purpose",
                desc: "High precision general sales intelligence, email composition, and workflow steps.",
              },
              {
                id: "qwen3",
                name: "Qwen 3",
                tag: "CRM & Analytics",
                desc: "Optimized for structured JSON data parsing, lead scoring, and campaign analytics.",
              },
              {
                id: "gemma3",
                name: "Gemma 3",
                tag: "Social & Messaging",
                desc: "Lightweight, rapid response model suited for WhatsApp and short-form SMS outreach.",
              },
            ].map((modelOpt) => {
              const isSelected = settings.defaultModel === modelOpt.id;
              return (
                <div
                  key={modelOpt.id}
                  onClick={() => setSettings({ ...settings, defaultModel: modelOpt.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-100">{modelOpt.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {modelOpt.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{modelOpt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hyperparameters Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Generation Parameters & Behavior
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">
                  Temperature ({settings.temperature})
                </label>
                <span className="text-[10px] text-slate-500">
                  {settings.temperature < 0.4
                    ? "Exact / Precise"
                    : settings.temperature > 0.7
                    ? "Creative / Expressive"
                    : "Balanced"}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) =>
                  setSettings({ ...settings, temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Lower values give predictable outputs; higher values increase creativity in outreach text.
              </p>
            </div>

            {/* Max Tokens Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Max Output Tokens
              </label>
              <input
                type="number"
                min="256"
                max="8192"
                step="256"
                value={settings.maxTokens}
                onChange={(e) =>
                  setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 2048 })
                }
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                Maximum token limit per AI response (default: 2048).
              </p>
            </div>

            {/* Streaming Toggle */}
            <div className="col-span-1 md:col-span-2 flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-200">Real-Time Response Streaming</p>
                <p className="text-[11px] text-slate-500">
                  Stream token outputs character-by-character directly into chat UI like ChatGPT.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, streaming: !settings.streaming })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.streaming ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.streaming ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Settings Saved!
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save AI Configuration"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
