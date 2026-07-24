import React, { useState } from "react";
import {
  Sparkles,
  BarChart3,
  Users,
  Bot,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  Eye,
  Link2,
  Layers,
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  activeTab: "landing" | "wizard" | "dashboard" | "crm" | "preview" | "integrations" | "aimarketplace" | "workflows" | "settings";
  setActiveTab: (tab: "landing" | "wizard" | "dashboard" | "crm" | "preview" | "integrations" | "aimarketplace" | "workflows" | "settings") => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAssistant: (initialQuery?: string) => void;
  toggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  onOpenAssistant,
  toggleSidebar,
}) => {
  const [selectedModel, setSelectedModel] = useState("SalesFlow AI");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f17]/90 backdrop-blur-md border-b border-white/10 px-4 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar toggle & Model Selector */}
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* ChatGPT Style Model Dropdown Header */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-semibold transition-all"
              id="navbar-model-selector"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showModelDropdown && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs space-y-1 backdrop-blur-xl">
                {[
                  { name: "SalesFlow AI", desc: "AI Sales & Marketing Manager engine" },
                  { name: "SalesFlow AI Pro", desc: "Advanced lead scoring & campaign strategy" },
                  { name: "SalesFlow AI Outreach", desc: "Specialized for instant messaging copy" },
                ].map((mod, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedModel(mod.name);
                      setShowModelDropdown(false);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                      selectedModel === mod.name ? "bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <p className="font-semibold text-slate-100">{mod.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{mod.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Workspace Navigation Tabs & Assistant */}
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("wizard")}
              id="nav-tab-ai-manager"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "wizard"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              id="nav-tab-dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("crm")}
              id="nav-tab-crm"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "crm"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">CRM</span>
            </button>

            <button
              onClick={() => setActiveTab("preview")}
              id="nav-tab-preview"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              onClick={() => setActiveTab("integrations")}
              id="nav-tab-integrations"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "integrations"
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Integrations</span>
            </button>

            <button
              onClick={() => setActiveTab("aimarketplace")}
              id="nav-tab-aimarketplace"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "aimarketplace"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI Store</span>
            </button>

            <button
              onClick={() => setActiveTab("workflows")}
              id="nav-tab-workflows"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "workflows"
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Workflows</span>
            </button>

            <button
              onClick={() => onOpenAssistant()}
              id="nav-btn-assistant-toggle"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Command Drawer</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all"
            >
              Start Free
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

