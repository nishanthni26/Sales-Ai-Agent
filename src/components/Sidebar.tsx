import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  Zap,
  Folder,
  Layers,
  Home,
  FileText,
  Search,
  Eye,
  Link2,
} from "lucide-react";
import { UserProfile, GeneratedCampaign } from "../types";

interface SidebarProps {
  activeTab: "landing" | "wizard" | "dashboard" | "crm" | "preview" | "integrations" | "aimarketplace" | "workflows" | "settings";
  setActiveTab: (tab: "landing" | "wizard" | "dashboard" | "crm" | "preview" | "integrations" | "aimarketplace" | "workflows" | "settings") => void;
  user: UserProfile | null;
  onNewCampaign: () => void;
  onSelectCampaignThread: (campaign: GeneratedCampaign) => void;
  activeCampaign: GeneratedCampaign;
  onOpenAuth: () => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onNewCampaign,
  onSelectCampaignThread,
  activeCampaign,
  onOpenAuth,
  onLogout,
  collapsed,
  setCollapsed,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0d1117] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64 shadow-2xl"
        }`}
      >
      {/* Top Header & New Chat */}
      <div className="p-3 space-y-3">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between px-2 py-1">
          {!collapsed && (
            <div
              onClick={() => setActiveTab(user ? "wizard" : "landing")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                SalesFlow AI
              </span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            id="sidebar-toggle-btn"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* New Campaign / Chat Button */}
        <button
          onClick={() => {
            onNewCampaign();
            setActiveTab("wizard");
          }}
          id="sidebar-btn-new-campaign"
          className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-white text-xs font-semibold transition-all ${
            collapsed ? "justify-center px-0" : "justify-start"
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>New Sales Campaign</span>}
        </button>

        {/* Navigation Section */}
        <div className="space-y-1 pt-2">
          {!collapsed && (
            <p className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Workspace
            </p>
          )}

          <button
            onClick={() => setActiveTab("wizard")}
            id="sidebar-link-ai-manager"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "wizard"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && <span>AI Campaign Manager</span>}
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            id="sidebar-link-dashboard"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
            {!collapsed && <span>Analytics Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            id="sidebar-link-crm"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "crm"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && <span>Sales CRM Hub</span>}
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            id="sidebar-link-preview"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "preview"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Eye className="w-4 h-4 text-teal-400 shrink-0" />
            {!collapsed && <span>Campaign Previews</span>}
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            id="sidebar-link-integrations"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "integrations"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
            {!collapsed && <span>Integrations Hub</span>}
          </button>

          <button
            onClick={() => setActiveTab("aimarketplace")}
            id="sidebar-link-aimarketplace"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "aimarketplace"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && <span>AI Marketplace</span>}
          </button>

          <button
            onClick={() => setActiveTab("workflows")}
            id="sidebar-link-workflows"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "workflows"
                ? "bg-slate-800 text-white border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            {!collapsed && <span>Workflow Hub</span>}
          </button>
        </div>

        {/* Campaign Threads List (ChatGPT style history) */}
        {!collapsed && (
          <div className="pt-4 space-y-1">
            <p className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Recent Campaigns
            </p>

            <div
              onClick={() => {
                onSelectCampaignThread(activeCampaign);
                setActiveTab("wizard");
              }}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs cursor-pointer flex items-center justify-between border border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-[11px] font-medium">{activeCampaign.name}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Info & Settings */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {user ? (
          <div className={`flex items-center justify-between ${collapsed ? "flex-col gap-2" : ""}`}>
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                {user.name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#ececec] truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.company}</p>
                </div>
              )}
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
              id="sidebar-btn-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  </>
  );
};
