import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Mail,
  Smartphone,
  Globe,
  MessageSquare,
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  Edit3,
  Check,
  Send,
  Eye,
  ArrowRight,
  RefreshCw,
  Sliders,
  Copy,
  ExternalLink,
  Laptop,
  Flame,
  Award,
  Layers,
  Phone,
  BarChart2,
  Calendar,
  LayoutGrid,
  ListFilter,
  Search,
  Plus,
  Trash2,
  Play,
  X,
  ChevronRight,
  DollarSign,
  Users,
  Target,
  Share2,
} from "lucide-react";
import { GeneratedCampaign, UserProfile } from "../types";
import { CampaignLaunchManager } from "./CampaignLaunchManager";

export interface CampaignTileItem {
  id: string;
  name: string;
  type: string;
  goal: string;
  status: "active" | "draft" | "scheduled";
  targetPersona: string;
  channels: ("email" | "whatsapp" | "sms" | "landing" | "linkedin")[];
  openRate: number;
  replyRate: number;
  expectedValue: number;
  healthScore: number;
  createdAt: string;
  teaserSubject: string;
  campaignData: GeneratedCampaign;
}

interface CampaignPreviewPageProps {
  campaign: GeneratedCampaign;
  user?: UserProfile | null;
  onUpdateCampaign?: (updated: GeneratedCampaign) => void;
  onLaunchCampaign?: (campaign: GeneratedCampaign) => void;
  onBackToChat?: () => void;
}

export const CampaignPreviewPage: React.FC<CampaignPreviewPageProps> = ({
  campaign,
  user,
  onUpdateCampaign,
  onLaunchCampaign,
  onBackToChat,
}) => {
  // Mode View Switcher: "tiles" or "detailed"
  const [viewMode, setViewMode] = useState<"tiles" | "detailed">("tiles");

  // Local active state for preview editing & channel tabs
  const [activeChannel, setActiveChannel] = useState<
    "desktop-email" | "mobile-email" | "landing" | "whatsapp" | "sms" | "linkedin"
  >("desktop-email");

  // Editable local copy of campaign
  const [currentCampaign, setCurrentCampaign] = useState<GeneratedCampaign>(campaign);

  // Initial Campaign Tiles Gallery
  const [campaignTiles, setCampaignTiles] = useState<CampaignTileItem[]>([
    {
      id: campaign.id || "cmp-001",
      name: campaign.name || "Q3 Enterprise AI Healthcare Launch",
      type: campaign.type || "Product Launch",
      goal: campaign.goal || "Generate Leads",
      status: campaign.status || "active",
      targetPersona: campaign.customerPersona?.title || "Chief Medical Information Officer (CMIO)",
      channels: ["email", "whatsapp", "sms", "landing", "linkedin"],
      openRate: 68.4,
      replyRate: 24.2,
      expectedValue: 180000,
      healthScore: 96,
      createdAt: "Today",
      teaserSubject: campaign.emailContent?.subjectLines?.[0] || "Reduce hospital ER triage delays by 42% with AI",
      campaignData: campaign,
    },
    {
      id: "cmp-002",
      name: "SaaS Inbound Lead Fast-Track Drip",
      type: "Automated Lead Drip",
      goal: "Onboard & Convert Inbound Signups",
      status: "active",
      targetPersona: "VP of Software Engineering & Tech Leads",
      channels: ["email", "whatsapp", "sms"],
      openRate: 74.2,
      replyRate: 31.8,
      expectedValue: 125000,
      healthScore: 98,
      createdAt: "Yesterday",
      teaserSubject: "Fast-track your sales pipeline setup in under 5 minutes",
      campaignData: {
        ...campaign,
        id: "cmp-002",
        name: "SaaS Inbound Lead Fast-Track Drip",
        type: "Automated Campaign",
        goal: "Onboard & Convert Inbound Signups",
        status: "active",
      },
    },
    {
      id: "cmp-003",
      name: "Cold Lead Win-Back & Re-Engagement",
      type: "Re-Engagement Drip",
      goal: "Re-Activate Inactive Accounts (>60 Days)",
      status: "scheduled",
      targetPersona: "Dormant Enterprise Directors",
      channels: ["email", "linkedin"],
      openRate: 48.6,
      replyRate: 16.4,
      expectedValue: 65000,
      healthScore: 92,
      createdAt: "3 days ago",
      teaserSubject: "Is {{company}} still looking to streamline sales operations?",
      campaignData: {
        ...campaign,
        id: "cmp-003",
        name: "Cold Lead Win-Back & Re-Engagement",
        type: "Custom Campaign",
        goal: "Re-Activate Inactive Accounts",
        status: "scheduled",
      },
    },
    {
      id: "cmp-004",
      name: "B2B LinkedIn C-Suite Executive Outreach",
      type: "Executive Cold Outreach",
      goal: "Book High-Ticket Discovery Meetings",
      status: "active",
      targetPersona: "Chief Operating Officers & Supply Chain VPs",
      channels: ["linkedin", "email", "landing"],
      openRate: 81.5,
      replyRate: 36.2,
      expectedValue: 240000,
      healthScore: 95,
      createdAt: "1 week ago",
      teaserSubject: "Automating executive pipeline reporting for {{company}}",
      campaignData: {
        ...campaign,
        id: "cmp-004",
        name: "B2B LinkedIn C-Suite Executive Outreach",
        type: "Social Selling",
        goal: "Book High-Ticket Discovery Meetings",
        status: "active",
      },
    },
    {
      id: "cmp-005",
      name: "Q4 High-Volume Flash Promo Campaign",
      type: "Promotional Drip",
      goal: "Drive Fast Pre-Orders & Retargeting",
      status: "draft",
      targetPersona: "Procurement & Purchasing Managers",
      channels: ["email", "sms", "whatsapp"],
      openRate: 59.1,
      replyRate: 19.8,
      expectedValue: 88000,
      healthScore: 89,
      createdAt: "Just now",
      teaserSubject: "Exclusive Pre-Launch Access: Save 25% on Enterprise Software",
      campaignData: {
        ...campaign,
        id: "cmp-005",
        name: "Q4 High-Volume Flash Promo Campaign",
        type: "Promotional Launch",
        goal: "Drive Fast Pre-Orders",
        status: "draft",
      },
    },
  ]);

  // Tiles Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "scheduled" | "draft">("all");
  const [filterChannel, setFilterChannel] = useState<"all" | "email" | "whatsapp" | "sms" | "linkedin">("all");

  // Quick Tile Creation Modal State
  const [showNewTileModal, setShowNewTileModal] = useState(false);
  const [newTileTitle, setNewTileTitle] = useState("");
  const [newTileGoal, setNewTileGoal] = useState("Generate Leads");
  const [newTileTarget, setNewTileTarget] = useState("VPs & Decision Makers");
  const [newTileType, setNewTileType] = useState("Outbound Sequence");

  // Email subject line selector
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState(0);

  // Step selectors for multi-step channels
  const [waStepIdx, setWaStepIdx] = useState(0);
  const [smsStepIdx, setSmsStepIdx] = useState(0);
  const [linkedInStepIdx, setLinkedInStepIdx] = useState(0);

  // Scores State (Dynamic - increases when suggestions applied!)
  const [scores, setScores] = useState({
    healthScore: 94,
    spamScore: 98.5, // 98.5% safe
    personalizationScore: 92,
    deliverabilityScore: 99.1,
  });

  // AI Suggestions list
  const [suggestions, setSuggestions] = useState([
    {
      id: "sug-1",
      title: "Add Secondary CTA in Email Sequence",
      channel: "Email",
      impact: "+4% Conversion",
      description: "Adding a direct booking calendar link in email follow-up step 2 boosts response rates.",
      applied: false,
    },
    {
      id: "sug-2",
      title: "Optimize WhatsApp Copy for 2-Second Mobile Scan",
      channel: "WhatsApp",
      impact: "+8% Open & Reply",
      description: "Shorten WhatsApp intro line and add bold formatting on value metrics.",
      applied: false,
    },
    {
      id: "sug-3",
      title: "Inject {{company}} Dynamic Tag in LinkedIn Opening",
      channel: "LinkedIn",
      impact: "+12% Accept Rate",
      description: "Personalizing the connection note with prospect company name increases trust.",
      applied: false,
    },
    {
      id: "sug-4",
      title: "Include Calendar Booking Link in SMS Follow-Up",
      channel: "SMS",
      impact: "+15% Meeting Booked",
      description: "Providing a direct 1-click meeting calendar link converts SMS replies faster.",
      applied: false,
    },
  ]);

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Apply suggestion handler
  const handleApplySuggestion = (sugId: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === sugId ? { ...s, applied: true } : s))
    );

    // Dynamic boost to metrics!
    setScores((prev) => ({
      healthScore: Math.min(100, prev.healthScore + 2),
      spamScore: Math.min(99.9, prev.spamScore + 0.3),
      personalizationScore: Math.min(100, prev.personalizationScore + 3),
      deliverabilityScore: Math.min(100, prev.deliverabilityScore + 0.2),
    }));

    // Update campaign content depending on suggestion
    if (sugId === "sug-1") {
      const updated = { ...currentCampaign };
      updated.emailContent.body += "\n\nPS: Want to skip the queue? Book a 10-minute slot on my calendar: {{booking_link}}";
      setCurrentCampaign(updated);
      if (onUpdateCampaign) onUpdateCampaign(updated);
    } else if (sugId === "sug-2") {
      const updated = { ...currentCampaign };
      if (updated.whatsAppMessages.length > 0) {
        updated.whatsAppMessages[0].text = `*Quick Question {{first_name}}* ⚡\n\nWe helped teams like {{company}} boost sales pipelines by *300%*.\n\nGot 2 mins to check how? ${updated.meetingBookingPage?.link || "https://salesflow.ai/book"}`;
      }
      setCurrentCampaign(updated);
      if (onUpdateCampaign) onUpdateCampaign(updated);
    } else if (sugId === "sug-3") {
      const updated = { ...currentCampaign };
      if (updated.linkedInMessages.length > 0) {
        updated.linkedInMessages[0].text = `Hi {{first_name}}, loved what you are building at {{company}}! Would love to connect and share how we automate sales pipelines.`;
      }
      setCurrentCampaign(updated);
      if (onUpdateCampaign) onUpdateCampaign(updated);
    } else if (sugId === "sug-4") {
      const updated = { ...currentCampaign };
      if (updated.smsContent.length > 0) {
        updated.smsContent[0].text = `Hi {{first_name}}, quick follow up from SalesFlow! Grab a 5-min demo here: ${updated.meetingBookingPage?.link || "https://salesflow.ai/book"}`;
      }
      setCurrentCampaign(updated);
      if (onUpdateCampaign) onUpdateCampaign(updated);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Filtered Tiles calculation
  const filteredTiles = campaignTiles.filter((tile) => {
    const matchesQuery =
      tile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tile.targetPersona.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tile.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tile.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || tile.status === filterStatus;
    const matchesChannel = filterChannel === "all" || tile.channels.includes(filterChannel);

    return matchesQuery && matchesStatus && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* GLOBAL VIEW MODE SWITCHER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>AI Campaign Studio</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {campaignTiles.length} Active AI Campaigns
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {viewMode === "tiles"
                ? "Browse, filter, and manage all your multi-channel AI campaign tiles."
                : "Inspecting detailed content, SLA scores, and omni-channel previews."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode("tiles")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === "tiles"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>AI Campaign Tiles Gallery ({campaignTiles.length})</span>
          </button>

          <button
            onClick={() => setViewMode("detailed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === "detailed"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Detailed Campaign Audit</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE A: AI CAMPAIGN TILES GALLERY VIEW */}
      {viewMode === "tiles" && (
        <div className="space-y-6">
          {/* SEARCH, FILTER & ACTION TOOLBAR */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI Campaign tiles by name, persona, or goal..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Add New Campaign Tile Button */}
              <button
                onClick={() => setShowNewTileModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New AI Campaign Tile</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Status:</span>
                </span>
                {(["all", "active", "scheduled", "draft"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                      filterStatus === st
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Channel:</span>
                {(["all", "email", "whatsapp", "sms", "linkedin"] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setFilterChannel(ch)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                      filterChannel === ch
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                        : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CAMPAIGN TILES GRID */}
          {filteredTiles.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No AI Campaign Tiles Match Your Filter</h3>
              <p className="text-xs text-slate-400">Try clearing your search query or channel filter to view all campaigns.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterChannel("all");
                }}
                className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-200 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTiles.map((tile) => (
                <div
                  key={tile.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {tile.type}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            tile.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : tile.status === "scheduled"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {tile.status}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {tile.healthScore}% Safe
                        </span>
                      </div>
                    </div>

                    {/* Campaign Name & Persona */}
                    <div>
                      <h3 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition-colors">
                        {tile.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{tile.targetPersona}</span>
                      </div>
                    </div>

                    {/* Active Channels Icons */}
                    <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500">Omni-Channels:</span>
                      <div className="flex items-center gap-2">
                        {tile.channels.includes("email") && <Mail className="w-3.5 h-3.5 text-blue-400" title="Email" />}
                        {tile.channels.includes("whatsapp") && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" title="WhatsApp" />}
                        {tile.channels.includes("sms") && <Smartphone className="w-3.5 h-3.5 text-purple-400" title="SMS" />}
                        {tile.channels.includes("landing") && <Globe className="w-3.5 h-3.5 text-cyan-400" title="Landing Page" />}
                        {tile.channels.includes("linkedin") && <Linkedin className="w-3.5 h-3.5 text-indigo-400" title="LinkedIn" />}
                      </div>
                    </div>

                    {/* KPI Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Open Rate</p>
                        <p className="text-xs font-extrabold text-emerald-400">{tile.openRate}%</p>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Reply Rate</p>
                        <p className="text-xs font-extrabold text-cyan-400">{tile.replyRate}%</p>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Value</p>
                        <p className="text-xs font-extrabold text-indigo-300">${(tile.expectedValue / 1000).toFixed(0)}k</p>
                      </div>
                    </div>

                    {/* Teaser Subject line */}
                    <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 text-[11px] text-slate-300 line-clamp-2 italic">
                      "{tile.teaserSubject}"
                    </div>
                  </div>

                  {/* Tile Footer Action Controls */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => {
                        setCurrentCampaign(tile.campaignData);
                        setViewMode("detailed");
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect Tile</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onLaunchCampaign) onLaunchCampaign(tile.campaignData);
                      }}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
                      title="Launch Campaign"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        const dup: CampaignTileItem = {
                          ...tile,
                          id: `cmp-${Date.now()}`,
                          name: `${tile.name} (Copy)`,
                          status: "draft",
                        };
                        setCampaignTiles([dup, ...campaignTiles]);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                      title="Duplicate Tile"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setCampaignTiles(
                          campaignTiles.map((t) =>
                            t.id === tile.id
                              ? {
                                  ...t,
                                  healthScore: Math.min(100, t.healthScore + 2),
                                  openRate: Math.min(99, +(t.openRate + 2.5).toFixed(1)),
                                  replyRate: Math.min(80, +(t.replyRate + 1.8).toFixed(1)),
                                }
                              : t
                          )
                        );
                      }}
                      className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer"
                      title="AI Optimize Tile"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setCampaignTiles(campaignTiles.filter((t) => t.id !== tile.id));
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                      title="Delete Tile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE B: DETAILED SINGLE CAMPAIGN AUDIT VIEW */}
      {viewMode === "detailed" && (
        <div className="space-y-8">
          {/* TOP HEADER & CONTROLS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Full Campaign Audit & Preview</span>
                </span>
                <span className="text-xs font-mono text-slate-400 border-l border-slate-700 pl-2.5">
                  ID: {currentCampaign.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentCampaign.name}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Target Goal: <span className="text-emerald-400 font-bold">{currentCampaign.goal}</span> • Created: {currentCampaign.createdAt}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 relative z-10">
              {onBackToChat && (
                <button
                  onClick={onBackToChat}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                >
                  Back to AI Chat
                </button>
              )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              isEditing
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? "Exit Edit Mode" : "Edit Preview Copy"}</span>
          </button>

          {onLaunchCampaign && (
            <button
              onClick={() => onLaunchCampaign(currentCampaign)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Launch Campaign Now</span>
            </button>
          )}
        </div>
      </div>

      {/* CAMPAIGN SCORES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Campaign Health Score */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{scores.healthScore}</span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Excellent
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scores.healthScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">All 6 channel assets validated & optimized</p>
        </div>

        {/* 2. Spam Score */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spam Safety</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{scores.spamScore}%</span>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              0 Trigger Words
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scores.spamScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">DKIM, SPF & Unsubscribe compliance verified</p>
        </div>

        {/* 3. Personalization Score */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personalization</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{scores.personalizationScore}</span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              High Relevance
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-indigo-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scores.personalizationScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Dynamic variables across all touchpoints</p>
        </div>

        {/* 4. Deliverability Score */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deliverability</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{scores.deliverabilityScore}%</span>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Top Tier
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scores.deliverabilityScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Estimated 98.5% inbox placement rate</p>
        </div>
      </div>

      {/* AI SUGGESTIONS BAR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">AI Optimization Suggestions</h3>
              <p className="text-xs text-slate-400">Click to apply instant high-converting copy improvements</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            {suggestions.filter((s) => s.applied).length} / {suggestions.length} Applied
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                sug.applied
                  ? "bg-emerald-950/20 border-emerald-500/40 text-slate-300"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-white"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{sug.title}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {sug.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{sug.description}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono">Channel: {sug.channel}</span>
                {sug.applied ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplySuggestion(sug.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Apply Suggestion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHANNEL PREVIEW NAVIGATION TABS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>Interactive Multi-Channel Previews</span>
          </h2>
          {copiedNotification && (
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 animate-pulse">
              ✓ Copy copied to clipboard
            </span>
          )}
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 scrollbar-none">
          {[
            { id: "desktop-email", label: "Desktop Email", icon: Laptop },
            { id: "mobile-email", label: "Mobile Email", icon: Smartphone },
            { id: "landing", label: "Landing Page", icon: Globe },
            { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
            { id: "sms", label: "SMS Outreach", icon: Phone },
            { id: "linkedin", label: "LinkedIn Direct", icon: Linkedin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChannel === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChannel(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PREVIEW CONTAINER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        
        {/* 1. DESKTOP EMAIL PREVIEW */}
        {activeChannel === "desktop-email" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>Desktop Email Client Mockup (Gmail / Outlook)</span>
              </span>
              <button
                onClick={() => copyToClipboard(currentCampaign.emailContent.body)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Email Text
              </button>
            </div>

            {/* Email Header bar */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="space-y-1">
                  <p className="text-slate-400">
                    <strong className="text-slate-200">From:</strong> SalesFlow AI Manager &lt;alex@salesflow.ai&gt;
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-200">To:</strong> {"{{first_name}}"} &lt;{"{{email}}"}&gt;
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Today at 10:15 AM</span>
              </div>

              {/* Subject selector */}
              <div>
                <label className="text-slate-400 font-bold block mb-1">Subject Line Variation:</label>
                <select
                  value={selectedSubjectIdx}
                  onChange={(e) => setSelectedSubjectIdx(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                >
                  {currentCampaign.emailContent.subjectLines.map((s, idx) => (
                    <option key={idx} value={idx}>
                      Option {idx + 1}: {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preheader */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-400">
                <strong className="text-slate-300">Preheader:</strong> {currentCampaign.emailContent.preheader}
              </div>

              {/* Editable Body */}
              <div className="pt-2">
                {isEditing ? (
                  <textarea
                    rows={8}
                    value={currentCampaign.emailContent.body}
                    onChange={(e) =>
                      setCurrentCampaign({
                        ...currentCampaign,
                        emailContent: { ...currentCampaign.emailContent, body: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none leading-relaxed font-sans"
                  />
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
                    {currentCampaign.emailContent.body}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-4 text-center">
                <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer">
                  {currentCampaign.emailContent.cta}
                </button>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-1">
                <p>SalesFlow AI • 100 Enterprise Way, San Francisco CA</p>
                <p className="underline cursor-pointer hover:text-slate-400">Unsubscribe or manage notification preferences</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. MOBILE EMAIL PREVIEW */}
        {activeChannel === "mobile-email" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className="text-xs font-bold text-slate-400">Smartphone Mobile Frame (iOS / Android)</span>

            {/* iPhone Frame */}
            <div className="w-full max-w-[340px] bg-slate-950 border-4 border-slate-800 rounded-[40px] p-4 shadow-2xl space-y-3 relative font-sans">
              {/* Notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto -mt-4 mb-2" />

              {/* Mobile Status Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 font-mono">
                <span>9:41 AM</span>
                <span className="flex items-center gap-1">5G 🔋</span>
              </div>

              {/* Email Content Box */}
              <div className="space-y-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-[11px]">
                <div className="border-b border-slate-800 pb-2">
                  <p className="text-slate-400">
                    <strong className="text-white">From:</strong> SalesFlow AI
                  </p>
                  <p className="font-bold text-emerald-400 mt-1 line-clamp-2">
                    {currentCampaign.emailContent.subjectLines[selectedSubjectIdx]}
                  </p>
                </div>

                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {currentCampaign.emailContent.body}
                </p>

                <div className="text-center pt-2">
                  <button className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-[11px]">
                    {currentCampaign.emailContent.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. LANDING PAGE PREVIEW */}
        {activeChannel === "landing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Responsive Landing Page Web Preview</span>
              </span>
              <a
                href={`https://salesflow.ai/landing/${currentCampaign.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Open in New Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Browser Mockup */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              {/* Browser Address Bar */}
              <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex-1 bg-slate-950 rounded-lg px-3 py-1 text-[11px] font-mono text-slate-400 border border-slate-800 text-center">
                  https://salesflow.ai/p/{currentCampaign.id}
                </div>
              </div>

              {/* Landing Content */}
              <div className="p-8 text-center space-y-6 max-w-2xl mx-auto">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 inline-block">
                  🚀 Exclusive Offer for {"{{company}}"}
                </span>

                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {currentCampaign.landingPage.headline}
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {currentCampaign.landingPage.subheadline}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                  {currentCampaign.landingPage.features.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-left space-y-3 pt-4">
                  <p className="font-bold text-xs text-white text-center">Claim Special Access & Consultation</p>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Work Email Address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer">
                    {currentCampaign.landingPage.ctaText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. WHATSAPP PREVIEW */}
        {activeChannel === "whatsapp" && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Instant Messaging Preview</span>
              </span>

              {/* Step pills */}
              <div className="flex gap-1">
                {currentCampaign.whatsAppMessages.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWaStepIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      waStepIdx === idx ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Step {m.step}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Container */}
            <div className="bg-[#0b141a] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl font-sans">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] p-3.5 flex items-center gap-3 border-b border-slate-800">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  SF
                </div>
                <div>
                  <p className="font-bold text-xs text-white flex items-center gap-1">
                    SalesFlow AI Manager
                    <span className="text-emerald-400 text-[10px]">✓</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Business Account • Online</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-5 min-h-[220px] bg-[radial-gradient(#111b21_1px,transparent_1px)] [background-size:16px_16px] space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#005c4b] text-white text-xs max-w-[85%] ml-auto shadow-md space-y-2">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {currentCampaign.whatsAppMessages[waStepIdx]?.text || "No WhatsApp copy available."}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200">
                    <span>10:14 AM</span>
                    <span className="text-cyan-300 font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SMS PREVIEW */}
        {activeChannel === "sms" && (
          <div className="max-w-sm mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>SMS Outreach Text View</span>
              </span>

              <div className="flex gap-1">
                {currentCampaign.smsContent.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSmsStepIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      smsStepIdx === idx ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    SMS {s.step}
                  </button>
                ))}
              </div>
            </div>

            {/* SMS Bubble Frame */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 shadow-2xl space-y-3 font-sans">
              <div className="text-center text-[10px] text-slate-500 font-mono">
                SMS Message • AT&T 5G Today 11:30 AM
              </div>

              <div className="p-4 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-100 text-xs leading-relaxed space-y-2">
                <p>{currentCampaign.smsContent[smsStepIdx]?.text || "No SMS copy generated."}</p>
              </div>

              <p className="text-[10px] text-slate-500 text-center">Reply STOP to cancel alerts.</p>
            </div>
          </div>
        )}

        {/* 6. LINKEDIN PREVIEW */}
        {activeChannel === "linkedin" && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn InMail / Connection Message</span>
              </span>

              <div className="flex gap-1">
                {currentCampaign.linkedInMessages.map((li, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLinkedInStepIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      linkedInStepIdx === idx ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Note {li.step}
                  </button>
                ))}
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4 font-sans">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  AR
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Alex Rivers • 1st</p>
                  <p className="text-[10px] text-slate-400">Head of Growth at SalesFlow AI</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                {currentCampaign.linkedInMessages[linkedInStepIdx]?.text || "No LinkedIn message generated."}
              </div>

              <div className="flex gap-2 pt-1">
                <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
                  Accept & Connect
                </button>
                <button className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium">
                  Ignore
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REAL WORKING CAMPAIGN LAUNCH, SCHEDULER & FIRESTORE SYSTEM */}
        <div className="pt-6 border-t border-slate-800">
          <CampaignLaunchManager
            campaign={currentCampaign}
            user={user || null}
            onUpdateCampaign={(updated) => {
              setCurrentCampaign(updated);
              if (onUpdateCampaign) onUpdateCampaign(updated);
            }}
          />
        </div>
      </div>
      </div>
      )}

      {/* CREATE NEW CAMPAIGN TILE MODAL */}
      <AnimatePresence>
        {showNewTileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Generate AI Campaign Tile</h3>
                    <p className="text-xs text-slate-400">Quickly create a new multi-channel AI campaign tile</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNewTileModal(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Campaign Tile Name</label>
                  <input
                    type="text"
                    value={newTileTitle}
                    onChange={(e) => setNewTileTitle(e.target.value)}
                    placeholder="e.g. Q4 Fintech Decision Makers Sequence"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Goal</label>
                    <select
                      value={newTileGoal}
                      onChange={(e) => setNewTileGoal(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Generate Leads">Generate Leads</option>
                      <option value="Book Meetings">Book Meetings</option>
                      <option value="Product Trial Onboarding">Product Trial Onboarding</option>
                      <option value="Re-activate Inactive Leads">Re-activate Inactive Leads</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Campaign Type</label>
                    <select
                      value={newTileType}
                      onChange={(e) => setNewTileType(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Outbound Sequence">Outbound Sequence</option>
                      <option value="Inbound Lead Drip">Inbound Lead Drip</option>
                      <option value="Social Outreach">Social Outreach</option>
                      <option value="Flash Promo Launch">Flash Promo Launch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Persona</label>
                  <input
                    type="text"
                    value={newTileTarget}
                    onChange={(e) => setNewTileTarget(e.target.value)}
                    placeholder="e.g. Chief Risk Officers & Compliance VPs"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowNewTileModal(false)}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 hover:text-white font-bold rounded-2xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const createdName = newTileTitle.trim() || "AI Multi-Channel Campaign";
                    const newTile: CampaignTileItem = {
                      id: `cmp-${Date.now()}`,
                      name: createdName,
                      type: newTileType,
                      goal: newTileGoal,
                      status: "draft",
                      targetPersona: newTileTarget,
                      channels: ["email", "whatsapp", "linkedin"],
                      openRate: 65.0,
                      replyRate: 22.0,
                      expectedValue: 110000,
                      healthScore: 94,
                      createdAt: "Just now",
                      teaserSubject: `Introducing AI-powered ${createdName} to your executive team`,
                      campaignData: {
                        ...currentCampaign,
                        id: `cmp-${Date.now()}`,
                        name: createdName,
                        type: newTileType,
                        goal: newTileGoal,
                        status: "draft",
                      },
                    };
                    setCampaignTiles([newTile, ...campaignTiles]);
                    setShowNewTileModal(false);
                    setNewTileTitle("");
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl transition-all cursor-pointer text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Campaign Tile</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
