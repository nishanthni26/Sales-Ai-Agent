import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Search,
  Check,
  Plus,
  Settings as SettingsIcon,
  X,
  Zap,
  CheckCircle2,
  Sliders,
  Mail,
  MessageSquare,
  FileText,
  Globe,
  PenTool,
  Users,
  TrendingUp,
  Headphones,
  Calendar,
  Share2,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
  Copy,
  ShieldCheck,
  SlidersHorizontal,
  Flame,
  Award,
  ArrowRight,
} from "lucide-react";

export interface AIAgent {
  id: string;
  name: string;
  category: "sales_lead" | "content_marketing" | "operations_support";
  iconName: string;
  description: string;
  status: "installed" | "active" | "available" | "paused";
  rating: number;
  installsCount: number;
  badge: string;
  badgeColor: string;
  iconBg: string;
  // Configuration options
  model: "gemini-1.5-pro" | "gemini-1.5-flash" | "claude-3-5-sonnet" | "gpt-4o";
  tone: "professional" | "persuasive" | "friendly" | "authoritative" | "concise";
  autoExecute: boolean;
  dailyQuotaLimit: number;
  triggerEvent: string;
  customPromptOverride: string;
  lastActive: string;
  executionsCount: number;
}

export const initialAIAgents: AIAgent[] = [
  {
    id: "lead_gen",
    name: "Lead Generation Agent",
    category: "sales_lead",
    iconName: "TrendingUp",
    description: "Scrapes, enriches, and qualifies target decision-makers using firmographic filters and intent data signals.",
    status: "active",
    rating: 4.9,
    installsCount: 14200,
    badge: "Most Popular",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    model: "gemini-1.5-pro",
    tone: "persuasive",
    autoExecute: true,
    dailyQuotaLimit: 500,
    triggerEvent: "New company added to target list",
    customPromptOverride: "Prioritize C-level executives in Healthcare and Logistics with revenue > $50M.",
    lastActive: "2 mins ago",
    executionsCount: 3840,
  },
  {
    id: "cold_email",
    name: "Cold Email Agent",
    category: "sales_lead",
    iconName: "Mail",
    description: "Drafts hyper-personalized cold email sequences, manages spintax variations, and executes automated follow-ups.",
    status: "active",
    rating: 4.9,
    installsCount: 18900,
    badge: "Top Rated",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    model: "gemini-1.5-pro",
    tone: "professional",
    autoExecute: true,
    dailyQuotaLimit: 1000,
    triggerEvent: "Lead score reaches > 70",
    customPromptOverride: "Reference recent company news or funding rounds in the first sentence.",
    lastActive: "12 mins ago",
    executionsCount: 12450,
  },
  {
    id: "whatsapp_agent",
    name: "WhatsApp Agent",
    category: "sales_lead",
    iconName: "MessageSquare",
    description: "Automates conversational WhatsApp outreach, interactive quick replies, and instant meeting booking.",
    status: "active",
    rating: 4.8,
    installsCount: 9300,
    badge: "High Conversion",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    model: "gemini-1.5-flash",
    tone: "friendly",
    autoExecute: true,
    dailyQuotaLimit: 300,
    triggerEvent: "Contact opens WhatsApp broadcast link",
    customPromptOverride: "Keep messages under 3 sentences with clear CTA to book a demo.",
    lastActive: "Just now",
    executionsCount: 5210,
  },
  {
    id: "proposal_gen",
    name: "Proposal Generator",
    category: "sales_lead",
    iconName: "FileText",
    description: "Generates custom PDF sales proposals, ROI calculations, and tailored pricing tiers based on discovery notes.",
    status: "installed",
    rating: 4.7,
    installsCount: 6800,
    badge: "Closing Boost",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    iconBg: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    model: "gemini-1.5-pro",
    tone: "authoritative",
    autoExecute: false,
    dailyQuotaLimit: 50,
    triggerEvent: "Deal stage moves to 'Proposal Sent'",
    customPromptOverride: "Include 3-tier enterprise pricing table and 90-day implementation roadmap.",
    lastActive: "2 hours ago",
    executionsCount: 890,
  },
  {
    id: "seo_agent",
    name: "SEO Agent",
    category: "content_marketing",
    iconName: "Globe",
    description: "Analyzes high-volume keywords, audits competitor backlinks, and optimizes landing pages for search rank.",
    status: "available",
    rating: 4.6,
    installsCount: 5400,
    badge: "Traffic Driver",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    model: "gemini-1.5-flash",
    tone: "concise",
    autoExecute: false,
    dailyQuotaLimit: 200,
    triggerEvent: "Weekly landing page audit schedule",
    customPromptOverride: "Target long-tail keywords for enterprise sales software.",
    lastActive: "Never",
    executionsCount: 0,
  },
  {
    id: "content_writer",
    name: "Content Writer",
    category: "content_marketing",
    iconName: "PenTool",
    description: "Creates long-form blog articles, LinkedIn thought leadership posts, case studies, and email newsletters.",
    status: "installed",
    rating: 4.8,
    installsCount: 11200,
    badge: "Content Creator",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    model: "gemini-1.5-pro",
    tone: "persuasive",
    autoExecute: false,
    dailyQuotaLimit: 100,
    triggerEvent: "Manual trigger or weekly schedule",
    customPromptOverride: "Write in an engaging, data-driven style with actionable takeaways.",
    lastActive: "1 day ago",
    executionsCount: 1420,
  },
  {
    id: "crm_assistant",
    name: "CRM Assistant",
    category: "operations_support",
    iconName: "Users",
    description: "Cleans duplicate contacts, auto-updates deal stages, logs email sentiment, and predicts churn risks.",
    status: "active",
    rating: 4.9,
    installsCount: 16500,
    badge: "Essential",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    model: "gemini-1.5-flash",
    tone: "concise",
    autoExecute: true,
    dailyQuotaLimit: 2000,
    triggerEvent: "Real-time contact or deal update",
    customPromptOverride: "Flag accounts inactive for > 14 days and assign high churn risk status.",
    lastActive: "4 mins ago",
    executionsCount: 18900,
  },
  {
    id: "sales_assistant",
    name: "Sales Assistant",
    category: "sales_lead",
    iconName: "Bot",
    description: "Real-time AI co-pilot for sales reps: generates objection handling scripts, competitor battle cards, and call summaries.",
    status: "active",
    rating: 4.9,
    installsCount: 13800,
    badge: "Co-Pilot",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    model: "gemini-1.5-pro",
    tone: "professional",
    autoExecute: true,
    dailyQuotaLimit: 800,
    triggerEvent: "Call transcript uploaded or live query",
    customPromptOverride: "Emphasize security compliance and HIPAA readiness during competitor comparisons.",
    lastActive: "15 mins ago",
    executionsCount: 7600,
  },
  {
    id: "customer_support",
    name: "Customer Support Agent",
    category: "operations_support",
    iconName: "Headphones",
    description: "Handles inbound customer tickets 24/7, resolves technical FAQs, and escalates complex issues to human agents.",
    status: "available",
    rating: 4.7,
    installsCount: 8100,
    badge: "24/7 Resolution",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    model: "gemini-1.5-flash",
    tone: "friendly",
    autoExecute: false,
    dailyQuotaLimit: 1500,
    triggerEvent: "Inbound ticket received",
    customPromptOverride: "Always maintain an empathetic tone and offer KB links.",
    lastActive: "Never",
    executionsCount: 0,
  },
  {
    id: "meeting_scheduler",
    name: "Meeting Scheduler",
    category: "operations_support",
    iconName: "Calendar",
    description: "Interprets email availability, resolves time zone overlaps, and schedules Google Meet/Teams demos automatically.",
    status: "installed",
    rating: 4.8,
    installsCount: 12400,
    badge: "Time Saver",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    iconBg: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    model: "gemini-1.5-flash",
    tone: "concise",
    autoExecute: true,
    dailyQuotaLimit: 400,
    triggerEvent: "Prospect requests a call in email or chat",
    customPromptOverride: "Provide 3 alternative time slots across EST/PST.",
    lastActive: "1 hour ago",
    executionsCount: 2150,
  },
  {
    id: "social_media",
    name: "Social Media Agent",
    category: "content_marketing",
    iconName: "Share2",
    description: "Schedules viral LinkedIn & Twitter posts, responds to comments, and monitors brand mention sentiment.",
    status: "available",
    rating: 4.5,
    installsCount: 4900,
    badge: "Brand Growth",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    iconBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    model: "gemini-1.5-flash",
    tone: "friendly",
    autoExecute: false,
    dailyQuotaLimit: 300,
    triggerEvent: "New blog post published or scheduled time",
    customPromptOverride: "Use relevant industry hashtags and line breaks for scannability.",
    lastActive: "Never",
    executionsCount: 0,
  },
];

export const AIMarketplacePage: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(initialAIAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "sales_lead" | "content_marketing" | "operations_support"
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "installed" | "available">("all");

  // Selected Agent for Configuration Drawer / Modal
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Configuration Form State
  const [configModel, setConfigModel] = useState<AIAgent["model"]>("gemini-1.5-pro");
  const [configTone, setConfigTone] = useState<AIAgent["tone"]>("professional");
  const [configAutoExecute, setConfigAutoExecute] = useState(true);
  const [configQuota, setConfigQuota] = useState(500);
  const [configPrompt, setConfigPrompt] = useState("");
  const [configTrigger, setConfigTrigger] = useState("");

  const handleInstallAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "active",
              lastActive: "Just now",
            }
          : a
      )
    );
  };

  const handleToggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === "active" ? "paused" : "active";
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleOpenConfig = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setConfigModel(agent.model);
    setConfigTone(agent.tone);
    setConfigAutoExecute(agent.autoExecute);
    setConfigQuota(agent.dailyQuotaLimit);
    setConfigPrompt(agent.customPromptOverride);
    setConfigTrigger(agent.triggerEvent);
    setIsConfigOpen(true);
  };

  const handleSaveConfig = () => {
    if (!selectedAgent) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === selectedAgent.id
          ? {
              ...a,
              model: configModel,
              tone: configTone,
              autoExecute: configAutoExecute,
              dailyQuotaLimit: configQuota,
              customPromptOverride: configPrompt,
              triggerEvent: configTrigger,
            }
          : a
      )
    );
    setIsConfigOpen(false);
  };

  const filteredAgents = agents.filter((ag) => {
    const matchesSearch =
      ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || ag.category === categoryFilter;
    const matchesStat =
      statusFilter === "all" ||
      (statusFilter === "active" && ag.status === "active") ||
      (statusFilter === "installed" && (ag.status === "installed" || ag.status === "active")) ||
      (statusFilter === "available" && ag.status === "available");

    return matchesSearch && matchesCat && matchesStat;
  });

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case "TrendingUp":
        return TrendingUp;
      case "Mail":
        return Mail;
      case "MessageSquare":
        return MessageSquare;
      case "FileText":
        return FileText;
      case "Globe":
        return Globe;
      case "PenTool":
        return PenTool;
      case "Users":
        return Users;
      case "Bot":
        return Bot;
      case "Headphones":
        return Headphones;
      case "Calendar":
        return Calendar;
      case "Share2":
        return Share2;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#ececec] p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* MARKETPLACE HERO BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              SalesFlow AI Agent Store
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Autonomous Sales & Growth Agents
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Deploy specialized AI agents to automate lead scoring, cold outreach, WhatsApp broadcasts, proposal drafting, CRM hygiene, and meeting scheduling.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Installed Agents</p>
            <p className="text-2xl font-black text-emerald-400">
              {agents.filter((a) => a.status === "active" || a.status === "installed").length} / 11
            </p>
            <p className="text-[10px] text-emerald-500 font-bold">5 Running Autonomously</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total AI Executions</p>
            <p className="text-2xl font-black text-indigo-400">54,360</p>
            <p className="text-[10px] text-indigo-400 font-bold">100% Precision Rate</p>
          </div>
        </div>
      </div>

      {/* TOOLBAR: SEARCH & CATEGORIES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Agents", count: agents.length },
            { id: "sales_lead", label: "Sales & Lead Gen", count: agents.filter((a) => a.category === "sales_lead").length },
            { id: "content_marketing", label: "Content & Marketing", count: agents.filter((a) => a.category === "content_marketing").length },
            { id: "operations_support", label: "Operations & Support", count: agents.filter((a) => a.category === "operations_support").length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              id={`agent-category-${cat.id}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === cat.id
                  ? "bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span>{cat.label}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#1c2333] text-slate-300">
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Lead Gen, WhatsApp, Proposals..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Now</option>
            <option value="installed">Installed</option>
            <option value="available">Available Store</option>
          </select>
        </div>
      </div>

      {/* 11 AI AGENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredAgents.map((ag) => {
          const IconComponent = getAgentIcon(ag.iconName);
          const isInstalled = ag.status === "installed" || ag.status === "active" || ag.status === "paused";
          const isActive = ag.status === "active";

          return (
            <div
              key={ag.id}
              id={`agent-card-${ag.id}`}
              className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 relative"
            >
              <div className="space-y-3">
                {/* Header: Icon + Badge + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md ${ag.iconBg}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                        {ag.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        {ag.category.replace("_", " & ")}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${ag.badgeColor}`}
                  >
                    {ag.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed min-h-[44px]">
                  {ag.description}
                </p>

                {/* Performance & Execution Specs */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block font-semibold">Model Engine</span>
                    <span className="font-mono text-emerald-400 font-bold">{ag.model}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block font-semibold">Executions</span>
                    <span className="font-bold text-slate-200">{ag.executionsCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    ★ {ag.rating} <span className="text-slate-500 text-[10px]">({ag.installsCount.toLocaleString()} users)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Status: <strong className={isActive ? "text-emerald-400" : "text-slate-400"}>{ag.status.toUpperCase()}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isInstalled ? (
                    <>
                      <button
                        onClick={() => handleOpenConfig(ag)}
                        id={`btn-config-${ag.id}`}
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Configure Agent</span>
                      </button>

                      <button
                        onClick={() => handleToggleAgentStatus(ag.id)}
                        className={`p-2.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                        title={isActive ? "Pause Agent" : "Resume Agent"}
                      >
                        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleInstallAgent(ag.id)}
                      id={`btn-install-${ag.id}`}
                      className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Install Agent</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIGURATION MODAL */}
      {isConfigOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md ${selectedAgent.iconBg}`}
              >
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedAgent.name} Settings</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Configured
                  </span>
                </div>
                <p className="text-xs text-slate-400">Set AI parameters, custom prompts, execution frequency, and model engines</p>
              </div>
            </div>

            {/* Config Fields */}
            <div className="space-y-4">
              {/* Model & Tone Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 block">AI Model Engine</label>
                  <select
                    value={configModel}
                    onChange={(e) => setConfigModel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Reasoning)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast)</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gpt-4o">GPT-4o Enterprise</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 block">Outreach Tone & Style</label>
                  <select
                    value={configTone}
                    onChange={(e) => setConfigTone(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="professional">Professional & Consultative</option>
                    <option value="persuasive">Persuasive & Direct</option>
                    <option value="friendly">Friendly & Warm</option>
                    <option value="authoritative">Authoritative Enterprise</option>
                    <option value="concise">Concise & Action-Oriented</option>
                  </select>
                </div>
              </div>

              {/* Automation Rules */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Automation & Execution Rules</span>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Autonomous Execution Mode</p>
                    <p className="text-[10px] text-slate-400">Execute tasks automatically without manual rep confirmation</p>
                  </div>
                  <button
                    onClick={() => setConfigAutoExecute(!configAutoExecute)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      configAutoExecute ? "bg-emerald-600" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                        configAutoExecute ? "left-5.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Trigger Event</label>
                  <input
                    type="text"
                    value={configTrigger}
                    onChange={(e) => setConfigTrigger(e.target.value)}
                    placeholder="e.g. Lead score > 80, New contact added..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom System Prompt Override */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Custom System Prompt Directives</label>
                  <span className="text-[10px] text-emerald-400 font-mono">Fine-tuning active</span>
                </div>
                <textarea
                  value={configPrompt}
                  onChange={(e) => setConfigPrompt(e.target.value)}
                  rows={4}
                  placeholder="Inject specific company messaging rules, compliance guidelines, or objection responses..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Daily Quota Slider */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Daily Task Execution Quota</label>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">{configQuota} Tasks / Day</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={configQuota}
                  onChange={(e) => setConfigQuota(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsConfigOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Agent Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
