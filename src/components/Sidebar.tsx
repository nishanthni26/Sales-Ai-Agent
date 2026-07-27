import React from "react";
import {
  Building2,
  LayoutDashboard,
  Megaphone,
  Briefcase,
  Users,
  Bot,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Layers,
  ChevronDown,
  Building,
} from "lucide-react";
import { UserProfile } from "../types";

export type PropValueTab = "dashboard" | "marketing" | "sales" | "contacts" | "ai_automation" | "settings" | "properties";

interface SidebarProps {
  activeTab: PropValueTab;
  setActiveTab: (tab: PropValueTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  onNewAutomation?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  collapsed,
  setCollapsed,
  onNewAutomation,
}) => {
  const navItems = [
    {
      id: "dashboard" as PropValueTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "marketing" as PropValueTab,
      label: "Marketing Hub",
      icon: Megaphone,
      badge: "8 Modules",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "sales" as PropValueTab,
      label: "Sales Hub",
      icon: Briefcase,
      badge: "$14.2M",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "contacts" as PropValueTab,
      label: "Contacts (CRM)",
      icon: Users,
      badge: "1,420",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "ai_automation" as PropValueTab,
      label: "AI Automation",
      icon: Bot,
      badge: "AI Powered",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "properties" as PropValueTab,
      label: "Property Listings",
      icon: Building,
      badge: "4 Active",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "settings" as PropValueTab,
      label: "Settings",
      icon: Settings,
      badge: null,
      color: "text-slate-400 bg-slate-800 border-slate-700",
    },
  ];

  const handleTabSelect = (tab: PropValueTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 shadow-xl text-slate-200 ${
          collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header & Logo */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            {!collapsed ? (
              <div
                onClick={() => handleTabSelect("dashboard")}
                className="flex items-center gap-3 cursor-pointer group min-h-[40px]"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 text-slate-950 font-black flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-base text-white tracking-tight">SalesFlow</span>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30">.ai</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Outreach CRM & Intelligence</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleTabSelect("dashboard")}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/20 mx-auto cursor-pointer"
              >
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden md:flex items-center justify-center"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4 text-cyan-400" /> : <ChevronLeft className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>

          {/* Quick Action Button */}
          {!collapsed && (
            <div className="p-3 pb-1">
              <button
                onClick={() => {
                  if (onNewAutomation) onNewAutomation();
                  handleTabSelect("ai_automation");
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>New AI Automation</span>
              </button>
            </div>
          )}

          {/* Main Navigation Links */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2">
                MAIN NAVIGATION
              </p>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60">
            {user ? (
              <div className={`flex items-center justify-between ${collapsed ? "flex-col gap-2" : ""}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover shrink-0"
                  />
                  {!collapsed && (
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-cyan-400/80 truncate">Lead Broker & Manager</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};

