import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Building2,
  ChevronDown,
  Menu,
  Check,
  X,
  Sparkles,
  User,
  LogOut,
  ExternalLink,
  MessageSquare,
  Building,
  Users,
  Briefcase,
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
  toggleSidebar?: () => void;
  onSearchSelect?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  toggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    { id: "n-1", title: "New Lead Matched!", desc: "High-net-worth buyer interested in Grand Waterfront Villa.", time: "5m ago", unread: true },
    { id: "n-2", title: "Offer Received", desc: "Penthouse at Brickell Tower received an offer of $2.9M.", time: "1h ago", unread: true },
    { id: "n-3", title: "Automation Triggered", desc: "WhatsApp brochure sent to 14 active buyers.", time: "3h ago", unread: false },
  ];

  // Shortcut key listener for Command/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-2.5 shadow-md text-slate-100">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5 text-cyan-400" />
            </button>
          )}
        </div>

        {/* Center: Search Bar Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-400 text-xs font-medium flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search properties, contacts, deals, or automations...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Search Icon (Mobile), Notifications, Help, Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 sm:hidden cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-xs text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="font-bold text-white">Notifications</span>
                  <span className="text-[10px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                    2 New
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        n.unread ? "bg-slate-800/80 border border-cyan-500/30" : "bg-slate-950"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white text-xs">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Center */}
          <div className="relative">
            <button
              onClick={() => setShowHelpCenter(!showHelpCenter)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Help Center"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {showHelpCenter && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-xs text-slate-200 space-y-2">
                <div className="font-bold text-white border-b border-slate-800 pb-2">
                  Help & Documentation
                </div>
                <div className="space-y-1">
                  <a
                    href="#docs"
                    onClick={(e) => { e.preventDefault(); setShowHelpCenter(false); }}
                    className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <span>SalesFlow Knowledge Base</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                  <a
                    href="#api"
                    onClick={(e) => { e.preventDefault(); setShowHelpCenter(false); }}
                    className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <span>MLS & CRM Integration Guides</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                  <a
                    href="#support"
                    onClick={(e) => { e.preventDefault(); setShowHelpCenter(false); }}
                    className="flex items-center justify-between p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <span>24/7 Priority Concierge Support</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
              />
              <span className="text-xs font-bold text-white hidden md:inline">{user.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
              <Search className="w-5 h-5 text-cyan-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, leads, contacts, or automations..."
                className="w-full text-sm font-medium text-white bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-3 custom-scrollbar text-xs">
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2">
                QUICK RESULTS
              </p>
              <div className="space-y-1">
                <div
                  onClick={() => setShowSearchModal(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <Building className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">The Grand Waterfront Villa ($4,850,000)</p>
                    <p className="text-[11px] text-slate-400">420 Ocean Drive, Miami FL • Active Listing</p>
                  </div>
                </div>
                <div
                  onClick={() => setShowSearchModal(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Dr. Elena Rostova (CMIO)</p>
                    <p className="text-[11px] text-slate-400">Saint Jude Health System • Hot Buyer Lead</p>
                  </div>
                </div>
                <div
                  onClick={() => setShowSearchModal(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Brickell Penthouse Deal ($2,950,000)</p>
                    <p className="text-[11px] text-slate-400">Under Contract • Close Date: Aug 28</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


