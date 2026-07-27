import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Briefcase,
  DollarSign,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  FileText,
  Phone,
  MessageSquare,
  MoreVertical,
  Flame,
  ArrowRight,
  Zap,
  TrendingUp,
  BarChart2,
  CheckSquare,
  Clock,
  Video,
  Mail,
  Smartphone,
  ShieldCheck,
  Bot,
  Activity,
  Award,
  Layers,
  Copy,
  Check,
  Percent,
  Sliders,
  AlertCircle,
  Eye,
} from "lucide-react";

interface Deal {
  id: string;
  client: string;
  property: string;
  value: string;
  stage: string;
  probability: number;
  expectedClose: string;
  owner: string;
  nextAction: string;
  aiRecommendation: string;
  avatar: string;
}

interface AIRecommendation {
  id: string;
  text: string;
  dealName?: string;
  impact: string;
  category: string;
  applied: boolean;
}

const KANBAN_STAGES = [
  { id: "new", name: "New Leads", color: "bg-blue-500" },
  { id: "contacted", name: "Contacted", color: "bg-indigo-500" },
  { id: "qualified", name: "Qualified", color: "bg-purple-500" },
  { id: "proposal", name: "Proposal Sent", color: "bg-amber-500" },
  { id: "negotiation", name: "Negotiation", color: "bg-cyan-500" },
  { id: "won", name: "Won", color: "bg-emerald-500" },
  { id: "lost", name: "Lost", color: "bg-rose-500" },
];

const INITIAL_DEALS: Deal[] = [
  {
    id: "deal-1",
    client: "Dr. Elena Rostova",
    property: "Waterfront Luxury Villa #420",
    value: "$4,850,000",
    stage: "proposal",
    probability: 87,
    expectedClose: "Aug 24, 2026",
    owner: "Alex Rivers (AI)",
    nextAction: "Send customized closing contract & schedule site visit",
    aiRecommendation: "Customer opened proposal 5 times today. High buying intent.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "deal-2",
    client: "Marcus Vance",
    property: "Brickell Sky Penthouse A",
    value: "$2,950,000",
    stage: "negotiation",
    probability: 78,
    expectedClose: "Sep 10, 2026",
    owner: "Alex Rivers (AI)",
    nextAction: "Offer 3% closing fee waiver to seal negotiation",
    aiRecommendation: "Property price is within customer's budget. Offer site visit this weekend.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "deal-3",
    client: "Sophia Martinez",
    property: "Star Island Private Compound",
    value: "$7,200,000",
    stage: "qualified",
    probability: 65,
    expectedClose: "Oct 15, 2026",
    owner: "Sarah Jenkins",
    nextAction: "Schedule private virtual walkthrough",
    aiRecommendation: "Follow up within 24 hours to maintain high engagement momentum.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "deal-4",
    client: "David Chen",
    property: "Coconut Grove Modern Residence",
    value: "$3,650,000",
    stage: "contacted",
    probability: 50,
    expectedClose: "Nov 02, 2026",
    owner: "Alex Rivers (AI)",
    nextAction: "Send automated WhatsApp brochure & financing options",
    aiRecommendation: "Lead is becoming inactive. Trigger AI re-engagement sequence.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "deal-5",
    client: "Victoria Sterling",
    property: "Coral Gables Estate Manor",
    value: "$5,100,000",
    stage: "won",
    probability: 100,
    expectedClose: "Jul 28, 2026",
    owner: "Sarah Jenkins",
    nextAction: "Onboard to VIP Concierge & Request Referral",
    aiRecommendation: "Deal closed! Send automated thank-you gift basket.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "deal-6",
    client: "Jonathan Hayes",
    property: "Sunny Isles Ocean Suite 1802",
    value: "$1,850,000",
    stage: "new",
    probability: 30,
    expectedClose: "Nov 20, 2026",
    owner: "Alex Rivers (AI)",
    nextAction: "Qualify purchasing timeline & budget constraints",
    aiRecommendation: "New lead from Google Ads. High-intent response expected within 1 hour.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

export const SalesHub: React.FC = () => {
  const [promptText, setPromptText] = useState("");
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "leads" | "tasks" | "email" | "analytics">("pipeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [aiModalResponse, setAiModalResponse] = useState<{
    title: string;
    details: string;
    actionDone: string;
  } | null>(null);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "rec-1",
      text: "This deal has an 87% chance of closing.",
      dealName: "Waterfront Villa - Dr. Elena Rostova",
      impact: "Expected Value: $4.85M",
      category: "Closing Forecast",
      applied: false,
    },
    {
      id: "rec-2",
      text: "Follow up within 24 hours.",
      dealName: "Star Island Compound - Sophia Martinez",
      impact: "+32% Close Rate",
      category: "Timing Optimization",
      applied: false,
    },
    {
      id: "rec-3",
      text: "Customer opened your proposal 5 times.",
      dealName: "Waterfront Villa - Dr. Elena Rostova",
      impact: "High Buying Intent",
      category: "Engagement Spike",
      applied: false,
    },
    {
      id: "rec-4",
      text: "This lead is becoming inactive.",
      dealName: "Coconut Grove - David Chen",
      impact: "Trigger Re-engagement",
      category: "Pipeline Health",
      applied: false,
    },
    {
      id: "rec-5",
      text: "Offer a site visit this weekend.",
      dealName: "Brickell Sky Penthouse - Marcus Vance",
      impact: "High Probability",
      category: "Next Best Action",
      applied: false,
    },
    {
      id: "rec-6",
      text: "Property price is within customer's budget.",
      dealName: "Brickell Sky Penthouse - Marcus Vance",
      impact: "Budget Match 100%",
      category: "Qualifying Score",
      applied: false,
    },
    {
      id: "rec-7",
      text: "Schedule another follow-up call.",
      dealName: "Sunny Isles Ocean Suite - Jonathan Hayes",
      impact: "Lead Qualification",
      category: "Automated Reminder",
      applied: false,
    },
  ]);

  const examplePrompts = [
    "Follow up with all hot leads today.",
    "Prioritize deals worth more than ₹5 lakh.",
    "Schedule meetings with interested buyers.",
    "Send proposal emails to all qualified leads.",
    "Update my sales pipeline automatically.",
    "Find deals likely to close this week.",
    "Generate this week's sales report.",
  ];

  const quickActions = [
    { label: "Follow Up Leads", icon: Phone },
    { label: "Schedule Meetings", icon: Calendar },
    { label: "Generate Quotes", icon: FileText },
    { label: "Send Proposal", icon: Send },
    { label: "Update CRM", icon: Sliders },
    { label: "Prioritize Deals", icon: Flame },
    { label: "Create Sales Sequence", icon: Zap },
    { label: "Forecast Revenue", icon: TrendingUp },
    { label: "AI Sales Report", icon: BarChart2 },
  ];

  const todayMeetings = [
    { time: "10:30 AM", title: "Site Tour: Waterfront Villa", client: "Dr. Elena Rostova", type: "In-Person" },
    { time: "02:00 PM", title: "Proposal Review: Brickell Penthouse", client: "Marcus Vance", type: "Video Call" },
    { time: "04:30 PM", title: "Discovery Call: Sunny Isles Suite", client: "Jonathan Hayes", type: "Phone" },
  ];

  const tasksDue = [
    { task: "Send revised contract draft", client: "Dr. Elena Rostova", due: "Today 5:00 PM", priority: "High" },
    { task: "Prepare HOA disclosure docs", client: "Marcus Vance", due: "Today 6:30 PM", priority: "Medium" },
    { task: "WhatsApp virtual tour video", client: "David Chen", due: "Tomorrow", priority: "High" },
  ];

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );
  };

  const handleRunAiCommand = (customPrompt?: string) => {
    const query = customPrompt || promptText;
    if (!query.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiModalResponse({
        title: `AI Sales Manager Action Executed`,
        details: `Command: "${query}"\n\n1. Analyzed active pipeline ($25.5M total volume).\n2. Filtered 3 high-probability deals closing within 14 days.\n3. Dispatched personalized AI follow-ups across Email & WhatsApp.\n4. Scheduled 2 site visits for this weekend.\n5. Updated CRM pipeline stages automatically.`,
        actionDone: "All follow-ups and CRM updates have been completed successfully.",
      });
    }, 750);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDeals = deals.filter(
    (d) =>
      d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              SalesFlow AI Autonomous CRM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sales Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Manage your entire sales process with one AI Sales Manager.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-3 py-2 rounded-xl">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Sales Manager: Online</span>
          </div>
          <button
            onClick={() => handleRunAiCommand("Update all deal close probabilities and follow up with hot leads")}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run AI Auto-Pilot</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION: LARGE AI ASSISTANT CARD (70%) + RIGHT PANEL (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large AI Assistant Card (70% width on desktop) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>AI Sales Manager</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              What would you like AI to do today?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Type any instruction or click a quick action below. SalesFlow AI will execute follow-ups, draft proposal quotes, organize calendar meetings, and update deal pipelines automatically.
            </p>
          </div>

          {/* Large Prompt Box */}
          <div className="relative z-10 space-y-3">
            <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xl border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2 pl-2 flex-1">
                <Bot className="w-5 h-5 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRunAiCommand()}
                  placeholder="Tell AI: 'Follow up with hot leads', 'Schedule site visits', 'Forecast closing revenue'..."
                  className="w-full bg-transparent text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleRunAiCommand()}
                disabled={isGenerating}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <span>Instruct AI</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Example Prompts Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-blue-200">Example Prompts:</span>
              {examplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(p);
                    handleRunAiCommand(p);
                  }}
                  className="text-[11px] font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/15 transition-all cursor-pointer backdrop-blur-xs"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Quick AI Actions Grid */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-3">
              Quick AI Actions
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {quickActions.map((qa, i) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleRunAiCommand(`Execute ${qa.label}`)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group backdrop-blur-xs"
                  >
                    <Icon className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-semibold leading-tight line-clamp-2">
                      {qa.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Panel (30% width on desktop) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          {/* Today's Pipeline Overview */}
          <div className="space-y-3 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Today's Pipeline</h3>
                <p className="text-[11px] text-slate-500">6 Active Deals in Pipeline</p>
              </div>
              <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                $25.6M
              </span>
            </div>
          </div>

          {/* Today's Meetings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Today's Meetings</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">3 Scheduled</span>
            </div>
            <div className="space-y-1.5">
              {todayMeetings.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">{m.title}</p>
                    <p className="text-[10px] text-slate-500">{m.client}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-blue-600 px-2 py-0.5 rounded border border-slate-200">
                    {m.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Due & Deals Closing Soon */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tasks Due</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                2 Critical
              </span>
            </div>
            <div className="space-y-1">
              {tasksDue.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-slate-700 py-1">
                  <span className="truncate max-w-[190px] font-medium">• {t.task}</span>
                  <span className="text-[10px] font-bold text-slate-400">{t.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Activities */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Recent AI Activity</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-tight">
              AI Sales Manager sent proposal follow-up to <strong>Dr. Elena Rostova</strong> at 09:42 AM.
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS FOR DETAILED SALES VIEWS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("pipeline")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === "pipeline"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sales Pipeline (Kanban)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("leads")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === "leads"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Lead Management & Scoring</span>
        </button>

        <button
          onClick={() => setActiveSubTab("tasks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === "tasks"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tasks & Meetings</span>
        </button>

        <button
          onClick={() => setActiveSubTab("email")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === "email"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email & Communication</span>
        </button>

        <button
          onClick={() => setActiveSubTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === "analytics"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Sales Analytics</span>
        </button>
      </div>

      {/* SUB-VIEW 1: SALES PIPELINE KANBAN BOARD */}
      {activeSubTab === "pipeline" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client name, property, or value..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Pipeline Stage Filter:</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                7 Stages Configured
              </span>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 overflow-x-auto pb-4 custom-scrollbar">
            {KANBAN_STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 min-w-[240px] flex flex-col space-y-3"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <h3 className="font-extrabold text-slate-900 text-xs">{stage.name}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {stageDeals.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="space-y-3 flex-1">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2 cursor-pointer group hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-black text-slate-900">{deal.value}</span>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            {deal.probability}% Prob
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {deal.client}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{deal.property}</p>
                        </div>

                        <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[10px] text-slate-700 space-y-1">
                          <p className="font-bold text-blue-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>AI Recommendation</span>
                          </p>
                          <p className="line-clamp-2 text-slate-600">{deal.aiRecommendation}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                          <span className="font-semibold text-slate-600">Action: {deal.nextAction}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                        No deals in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: LEAD MANAGEMENT */}
      {activeSubTab === "leads" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Lead Scoring & AI Qualification</h2>
              <p className="text-xs text-slate-500">Autonomous lead scoring based on buying signals, budget fit, and inquiry frequency.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={deal.avatar} alt={deal.client} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{deal.client}</h4>
                      <p className="text-[10px] text-slate-500">{deal.property}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                    Score: 94/100
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget Match:</span>
                    <span className="font-bold text-slate-800">{deal.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Qualification Status:</span>
                    <span className="font-bold text-emerald-600">AI Verified High-Intent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Customer Journey:</span>
                    <span className="font-semibold text-blue-600">Visited Website 14x</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRunAiCommand(`Qualify lead ${deal.client} and dispatch instant quote`)}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Qualify & Follow Up</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: TASKS & MEETINGS */}
      {activeSubTab === "tasks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Upcoming Sales Meetings</span>
            </h3>
            <div className="space-y-3">
              {todayMeetings.map((m, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{m.title}</h4>
                    <p className="text-[11px] text-slate-500">Client: {m.client} • {m.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                    {m.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <span>AI Suggested Follow-Up Tasks</span>
            </h3>
            <div className="space-y-3">
              {tasksDue.map((t, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{t.task}</h4>
                    <p className="text-[11px] text-slate-500">For: {t.client} ({t.due})</p>
                  </div>
                  <button
                    onClick={() => handleRunAiCommand(`Execute task: ${t.task}`)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Execute AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: EMAIL & COMMUNICATION */}
      {activeSubTab === "email" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Email & Omnichannel Communication Studio</h2>
              <p className="text-xs text-slate-500">AI-powered sales email generator, follow-up drip sequences, open tracking, and WhatsApp dispatch.</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Avg Open Rate: 68.2%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-xs">Proposal Drip D-1</h4>
              <p className="text-[11px] text-slate-600">Automated sequence dispatched 24 hours after initial site tour.</p>
              <p className="text-[10px] font-bold text-blue-700 pt-1">Open Rate: 82% | Reply Rate: 44%</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-xs">WhatsApp VIP Dispatch</h4>
              <p className="text-[11px] text-slate-600">Direct instant message broadcast with 3D virtual floorplan video.</p>
              <p className="text-[10px] font-bold text-emerald-700 pt-1">Delivery Rate: 99.8% | Click Rate: 56%</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
              <Smartphone className="w-6 h-6 text-purple-600" />
              <h4 className="font-bold text-slate-900 text-xs">Re-Engagement Drip</h4>
              <p className="text-[11px] text-slate-600">Triggers when a lead becomes inactive for over 72 hours.</p>
              <p className="text-[10px] font-bold text-purple-700 pt-1">Re-engagement Success: 38%</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: SALES ANALYTICS */}
      {activeSubTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue Closed</p>
            <p className="text-2xl font-black text-slate-900">$14.6M</p>
            <p className="text-[11px] font-bold text-emerald-600">+28% vs last month</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Pipeline Volume</p>
            <p className="text-2xl font-black text-blue-600">$25.5M</p>
            <p className="text-[11px] font-bold text-blue-600">6 High-Value Deals</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Win Rate</p>
            <p className="text-2xl font-black text-emerald-600">68%</p>
            <p className="text-[11px] font-bold text-emerald-600">+12% AI Boost</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Avg Sales Cycle</p>
            <p className="text-2xl font-black text-purple-600">18 Days</p>
            <p className="text-[11px] font-bold text-purple-600">Reduced from 42 days</p>
          </div>
        </div>
      )}

      {/* BOTTOM SECTION: AI SALES RECOMMENDATIONS */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                AI Sales Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Real-time actionable insights generated by AI Sales Manager to accelerate pipeline closure.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            7 Active Recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-3 ${
                rec.applied
                  ? "border-emerald-200 bg-emerald-50/20"
                  : "border-slate-200 hover:border-blue-300 shadow-xs"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {rec.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {rec.impact}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  "{rec.text}"
                </p>
                {rec.dealName && (
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    Deal: {rec.dealName}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleApplyRecommendation(rec.id)}
                disabled={rec.applied}
                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  rec.applied
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                }`}
              >
                {rec.applied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Action Executed</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Execute AI Action</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DEAL DETAILS MODAL */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full uppercase border border-blue-100">
                  {selectedDeal.stage}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">{selectedDeal.client}</h3>
                <p className="text-xs text-slate-500">{selectedDeal.property}</p>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px]">Deal Value</span>
                <p className="font-black text-slate-900 text-sm">{selectedDeal.value}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px]">Closing Probability</span>
                <p className="font-black text-emerald-600 text-sm">{selectedDeal.probability}%</p>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Deal Summary</span>
              </p>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {selectedDeal.aiRecommendation}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRunAiCommand(`Execute next action for ${selectedDeal.client}: ${selectedDeal.nextAction}`);
                  setSelectedDeal(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Execute Next Action</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI EXECUTION MODAL */}
      {aiModalResponse && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">{aiModalResponse.title}</h3>
              </div>
              <button
                onClick={() => setAiModalResponse(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
              {aiModalResponse.details}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => copyToClipboard(aiModalResponse.details, "sales_modal")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === "sales_modal" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "sales_modal" ? "Copied" : "Copy Log"}</span>
              </button>

              <button
                onClick={() => setAiModalResponse(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
