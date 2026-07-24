import React, { useState } from "react";
import {
  Link2,
  Check,
  X,
  Settings as SettingsIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Mail,
  MessageSquare,
  Calendar,
  Share2,
  ShoppingBag,
  TrendingUp,
  Database,
  Key,
  Sliders,
  Copy,
  Plus,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";

export interface Integration {
  id: string;
  name: string;
  category: "crm" | "communication" | "productivity" | "ecommerce_ads";
  description: string;
  status: "connected" | "disconnected" | "syncing" | "action_needed";
  iconBg: string;
  badgeColor: string;
  logoLetter: string;
  brandColor: string;
  connectedAt?: string;
  lastSync?: string;
  syncFrequency: string;
  apiKey?: string;
  webhookUrl?: string;
  autoSyncLeads: boolean;
  autoSyncDeals: boolean;
  autoSyncCampaigns: boolean;
  fieldsMapped: number;
}

export const initialIntegrations: Integration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    description: "Two-way sync for Contacts, Deals, and Lifecycle stages with HubSpot CRM.",
    status: "connected",
    iconBg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    logoLetter: "HS",
    brandColor: "#ff7a59",
    connectedAt: "2026-06-12",
    lastSync: "3 mins ago",
    syncFrequency: "Real-time (Webhooks)",
    apiKey: "pat-na1-893f021a-429a-4c81-8b01-salesflow",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/hubspot/wh_8832910",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 14,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "crm",
    description: "Enterprise Lead routing, Opportunity stage sync, and Account hierarchy alignment.",
    status: "connected",
    iconBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    logoLetter: "SF",
    brandColor: "#00a1e0",
    connectedAt: "2026-05-20",
    lastSync: "12 mins ago",
    syncFrequency: "Every 15 minutes",
    apiKey: "sf_oauth_refresh_token_993021980312",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/salesforce/wh_9012384",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: false,
    fieldsMapped: 22,
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    category: "crm",
    description: "Sync Leads, Contacts, and Modules seamlessly into Zoho CRM ecosystem.",
    status: "disconnected",
    iconBg: "bg-red-500/10 border-red-500/30 text-red-400",
    badgeColor: "bg-slate-800 text-slate-400 border-slate-700",
    logoLetter: "ZH",
    brandColor: "#e42528",
    syncFrequency: "Hourly",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/zoho/wh_zoho_default",
    autoSyncLeads: true,
    autoSyncDeals: false,
    autoSyncCampaigns: false,
    fieldsMapped: 8,
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "crm",
    description: "Automate deal creation, activity logging, and contact updates in Pipedrive pipelines.",
    status: "connected",
    iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    logoLetter: "PD",
    brandColor: "#222222",
    connectedAt: "2026-07-01",
    lastSync: "1 hour ago",
    syncFrequency: "Every 15 minutes",
    apiKey: "pipedrive_api_token_3349019283012",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/pipedrive/wh_3289012",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 11,
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "communication",
    description: "Send cold campaigns, track email opens, replies, and auto-sync thread histories.",
    status: "connected",
    iconBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    logoLetter: "GM",
    brandColor: "#ea4335",
    connectedAt: "2026-04-10",
    lastSync: "Real-time",
    syncFrequency: "Real-time (Push)",
    apiKey: "google_oauth_token_alex_salesflow",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/gmail/push_gmail_001",
    autoSyncLeads: true,
    autoSyncDeals: false,
    autoSyncCampaigns: true,
    fieldsMapped: 6,
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "communication",
    description: "Microsoft 365 Exchange email outreach, auto-reply detection, and calendar sync.",
    status: "disconnected",
    iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    badgeColor: "bg-slate-800 text-slate-400 border-slate-700",
    logoLetter: "OL",
    brandColor: "#0078d4",
    syncFrequency: "Every 15 minutes",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/outlook/wh_default",
    autoSyncLeads: true,
    autoSyncDeals: false,
    autoSyncCampaigns: true,
    fieldsMapped: 5,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "communication",
    description: "Direct WhatsApp messaging outreach, interactive templates, and instant response bots.",
    status: "connected",
    iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    logoLetter: "WA",
    brandColor: "#25d366",
    connectedAt: "2026-06-18",
    lastSync: "Just now",
    syncFrequency: "Real-time (Cloud API)",
    apiKey: "EAAXz00192830192830192830192380",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/whatsapp/meta_wa_9912",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 9,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "communication",
    description: "InMail outreach automation, profile scraping enrichment, and Connection requests.",
    status: "connected",
    iconBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    logoLetter: "LI",
    brandColor: "#0a66c2",
    connectedAt: "2026-07-05",
    lastSync: "25 mins ago",
    syncFrequency: "Hourly",
    apiKey: "li_at_09128301928301928301293",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/linkedin/wh_li_8829",
    autoSyncLeads: true,
    autoSyncDeals: false,
    autoSyncCampaigns: true,
    fieldsMapped: 7,
  },
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    description: "Get instant channel alerts for new hot leads, closed won deals, and campaign replies.",
    status: "connected",
    iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    logoLetter: "SL",
    brandColor: "#4a154b",
    connectedAt: "2026-05-01",
    lastSync: "Real-time",
    syncFrequency: "Real-time",
    apiKey: "xoxb-9912039102-salesflow-alerts",
    webhookUrl: "https://hooks.slack.com/services/T00/B00/XXXXXX",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 4,
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "productivity",
    description: "Auto-detect meeting slots, send calendar invites, and sync executive demos.",
    status: "connected",
    iconBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    logoLetter: "GC",
    brandColor: "#4285f4",
    connectedAt: "2026-04-12",
    lastSync: "Real-time",
    syncFrequency: "Real-time (Sync)",
    apiKey: "gcal_oauth_refresh_token_9930128",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/gcal/push_88301",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: false,
    fieldsMapped: 8,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "productivity",
    description: "Create video demo meeting links, notify team channels, and log call summaries.",
    status: "disconnected",
    iconBg: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    badgeColor: "bg-slate-800 text-slate-400 border-slate-700",
    logoLetter: "MT",
    brandColor: "#6264a7",
    syncFrequency: "Every 15 minutes",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/teams/wh_default",
    autoSyncLeads: false,
    autoSyncDeals: true,
    autoSyncCampaigns: false,
    fieldsMapped: 4,
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "productivity",
    description: "Connect SalesFlow to 6,000+ apps via webhooks, triggers, and automated Zaps.",
    status: "connected",
    iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    logoLetter: "ZP",
    brandColor: "#ff4f00",
    connectedAt: "2026-03-22",
    lastSync: "5 mins ago",
    syncFrequency: "Real-time (Webhooks)",
    apiKey: "zapier_api_key_sf_live_00998877",
    webhookUrl: "https://hooks.zapier.com/hooks/catch/991823/salesflow",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 30,
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "ecommerce_ads",
    description: "Sync e-commerce customer purchase history, abandoned carts, and order values.",
    status: "connected",
    iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    logoLetter: "SH",
    brandColor: "#95bf47",
    connectedAt: "2026-06-30",
    lastSync: "40 mins ago",
    syncFrequency: "Real-time (Webhooks)",
    apiKey: "shpat_9920192039102930129",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/shopify/orders_created",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: false,
    fieldsMapped: 12,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "ecommerce_ads",
    description: "Import WooCommerce store buyers into outreach campaigns with order tag filters.",
    status: "disconnected",
    iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    badgeColor: "bg-slate-800 text-slate-400 border-slate-700",
    logoLetter: "WC",
    brandColor: "#96588a",
    syncFrequency: "Hourly",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/woocommerce/wh_default",
    autoSyncLeads: true,
    autoSyncDeals: false,
    autoSyncCampaigns: false,
    fieldsMapped: 6,
  },
  {
    id: "google_ads",
    name: "Google Ads",
    category: "ecommerce_ads",
    description: "Sync search conversion leads directly into high-priority sales agent queues.",
    status: "connected",
    iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    logoLetter: "GA",
    brandColor: "#4285f4",
    connectedAt: "2026-07-10",
    lastSync: "10 mins ago",
    syncFrequency: "Real-time",
    apiKey: "gads_customer_id_991_283_9102",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/googleads/conversions_001",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 15,
  },
  {
    id: "meta_ads",
    name: "Meta Ads",
    category: "ecommerce_ads",
    description: "Instant Meta Instant Lead Form synchronization with predictive lead scoring.",
    status: "connected",
    iconBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    logoLetter: "MA",
    brandColor: "#0668e1",
    connectedAt: "2026-07-15",
    lastSync: "Just now",
    syncFrequency: "Real-time (Graph API)",
    apiKey: "EAAC_meta_ads_access_token_901238",
    webhookUrl: "https://api.salesflow.ai/v1/webhooks/metaads/leadgen_9921",
    autoSyncLeads: true,
    autoSyncDeals: true,
    autoSyncCampaigns: true,
    fieldsMapped: 18,
  },
];

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "crm" | "communication" | "productivity" | "ecommerce_ads">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "connected" | "disconnected">("all");

  // Selected Integration for Settings Modal or Connect Drawer
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  // Connection Flow Form State
  const [connectApiKeyInput, setConnectApiKeyInput] = useState("");
  const [isConnectingLoading, setIsConnectingLoading] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Filtered List
  const filteredIntegrations = integrations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "connected" && item.status === "connected") ||
      (statusFilter === "disconnected" && item.status === "disconnected");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  // Toggle Connect / Disconnect Handler
  const handleConnectIntegration = (id: string) => {
    setIsConnectingLoading(true);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "connected",
                connectedAt: new Date().toISOString().split("T")[0],
                lastSync: "Just now",
                apiKey: connectApiKeyInput || `live_key_${item.id}_${Date.now()}`,
              }
            : item
        )
      );
      setIsConnectingLoading(false);
      setIsConnectOpen(false);
      setConnectApiKeyInput("");
    }, 600);
  };

  const handleDisconnectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "disconnected",
              connectedAt: undefined,
              lastSync: undefined,
            }
          : item
      )
    );
    setIsSettingsOpen(false);
  };

  const handleToggleAutoSync = (id: string, field: "autoSyncLeads" | "autoSyncDeals" | "autoSyncCampaigns") => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: !item[field],
            }
          : item
      )
    );

    if (selectedIntegration && selectedIntegration.id === id) {
      setSelectedIntegration((prev) =>
        prev
          ? {
              ...prev,
              [field]: !prev[field],
            }
          : null
      );
    }
  };

  const handleCopyWebhook = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#ececec] p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* INTEGRATIONS TOP HERO BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Integration Ecosystem & API Connectors
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Seamlessly Connect Your Stack
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Unify CRMs, email inboxes, messaging platforms, ad channels, and e-commerce stores with SalesFlow AI’s automated two-way synchronization engine.
          </p>
        </div>

        {/* System Sync Stats */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Connections</p>
            <p className="text-2xl font-black text-emerald-400">{connectedCount} / {integrations.length}</p>
            <p className="text-[10px] text-emerald-500 font-bold">100% Operational</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Real-Time Sync Rate</p>
            <p className="text-2xl font-black text-indigo-400">99.98%</p>
            <p className="text-[10px] text-indigo-400 font-bold">&lt; 1.2s Latency</p>
          </div>
        </div>
      </div>

      {/* FILTER & CATEGORY TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Integrations", count: integrations.length },
            { id: "crm", label: "CRMs", count: integrations.filter((i) => i.category === "crm").length },
            { id: "communication", label: "Communication & Outreach", count: integrations.filter((i) => i.category === "communication").length },
            { id: "productivity", label: "Productivity & Calendar", count: integrations.filter((i) => i.category === "productivity").length },
            { id: "ecommerce_ads", label: "E-Commerce & Ads", count: integrations.filter((i) => i.category === "ecommerce_ads").length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              id={`integration-category-${cat.id}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-950"
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

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Salesforce, Gmail, Zapier..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="connected">Connected Only</option>
            <option value="disconnected">Disconnected</option>
          </select>
        </div>
      </div>

      {/* INTEGRATIONS GRID (16 SPECIFIC APPS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredIntegrations.map((item) => {
          const isConnected = item.status === "connected";

          return (
            <div
              key={item.id}
              id={`integration-card-${item.id}`}
              className="group p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/20"
            >
              <div className="space-y-3">
                {/* Header: Logo + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md border ${item.iconBg}`}
                    >
                      {item.logoLetter}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">
                        {item.category.replace("_", " & ")}
                      </p>
                    </div>
                  </div>

                  {/* Connection Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 flex items-center gap-1 ${
                      isConnected
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-800/80 border-slate-700 text-slate-400"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                    <span>{isConnected ? "Connected" : "Disconnected"}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                  {item.description}
                </p>
              </div>

              {/* Bottom Actions & Details */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                {isConnected && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-emerald-400" />
                      <span>Sync: {item.lastSync}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {item.fieldsMapped} Fields Mapped
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedIntegration(item);
                          setIsSettingsOpen(true);
                        }}
                        id={`btn-settings-${item.id}`}
                        className="flex-1 py-2 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={() => handleDisconnectIntegration(item.id)}
                        className="p-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-all cursor-pointer"
                        title="Disconnect Integration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedIntegration(item);
                        setIsConnectOpen(true);
                      }}
                      id={`btn-connect-${item.id}`}
                      className="w-full py-2 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-950 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Connect Integration</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: CONNECT INTEGRATION SETUP */}
      {isConnectOpen && selectedIntegration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsConnectOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${selectedIntegration.iconBg}`}
              >
                {selectedIntegration.logoLetter}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Connect {selectedIntegration.name}</h3>
                <p className="text-xs text-slate-400">Authenticate API access and authorize SalesFlow sync</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <p className="text-xs font-semibold text-slate-200">OAuth / API Authentication Key</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Provide your {selectedIntegration.name} API Secret Key or OAuth Access Token to enable two-way sync.
              </p>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={connectApiKeyInput}
                  onChange={(e) => setConnectApiKeyInput(e.target.value)}
                  placeholder={`Paste ${selectedIntegration.name} API Key...`}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300">Sync Scope Permissions</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Read/Write Contacts and Lead records</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sync Opportunity stage transitions & deal values</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log automated AI email/WhatsApp interaction activity</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsConnectOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConnectIntegration(selectedIntegration.id)}
                disabled={isConnectingLoading}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                {isConnectingLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-white" />
                )}
                <span>Authorize & Connect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SETTINGS MODAL */}
      {isSettingsOpen && selectedIntegration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${selectedIntegration.iconBg}`}
              >
                {selectedIntegration.logoLetter}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedIntegration.name} Integration Settings</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">Configure real-time webhooks, automated sync, and field maps</p>
              </div>
            </div>

            {/* Config Sections */}
            <div className="space-y-4">
              {/* API Key / Access Token Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">API Access Token / Key</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Status: Verified</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 truncate">
                  {selectedIntegration.apiKey || "pat-live-993019283019283012930"}
                </div>
              </div>

              {/* Webhook Endpoint for Incoming Events */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Incoming Webhook Endpoint</span>
                  <button
                    onClick={() => handleCopyWebhook(selectedIntegration.webhookUrl)}
                    className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWebhook ? "Copied!" : "Copy URL"}</span>
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 truncate">
                  {selectedIntegration.webhookUrl || "https://api.salesflow.ai/v1/webhooks/default"}
                </p>
              </div>

              {/* Sync Controls / Auto Sync Switches */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Automated Sync Toggles</span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Auto-Sync Leads & Contacts</p>
                      <p className="text-[10px] text-slate-400">Push new inbound leads automatically to {selectedIntegration.name}</p>
                    </div>
                    <button
                      onClick={() => handleToggleAutoSync(selectedIntegration.id, "autoSyncLeads")}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        selectedIntegration.autoSyncLeads ? "bg-emerald-600" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          selectedIntegration.autoSyncLeads ? "left-5.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Auto-Sync Deals & Opportunity Values</p>
                      <p className="text-[10px] text-slate-400">Align stage transitions and pipeline values</p>
                    </div>
                    <button
                      onClick={() => handleToggleAutoSync(selectedIntegration.id, "autoSyncDeals")}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        selectedIntegration.autoSyncDeals ? "bg-emerald-600" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          selectedIntegration.autoSyncDeals ? "left-5.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">Auto-Sync AI Campaign Metrics</p>
                      <p className="text-[10px] text-slate-400">Track email/outreach response rates inside {selectedIntegration.name}</p>
                    </div>
                    <button
                      onClick={() => handleToggleAutoSync(selectedIntegration.id, "autoSyncCampaigns")}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        selectedIntegration.autoSyncCampaigns ? "bg-emerald-600" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          selectedIntegration.autoSyncCampaigns ? "left-5.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sync Frequency Select */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Sync Frequency Schedule</p>
                  <p className="text-[10px] text-slate-400">Current schedule: {selectedIntegration.syncFrequency}</p>
                </div>
                <select className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer">
                  <option value="realtime">Real-time (Webhooks)</option>
                  <option value="15m">Every 15 Minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily Batch</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDisconnectIntegration(selectedIntegration.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 cursor-pointer"
              >
                Disconnect Integration
              </button>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
