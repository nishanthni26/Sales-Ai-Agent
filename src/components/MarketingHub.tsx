import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Mail,
  Globe,
  FileText,
  Share2,
  BarChart2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Plus,
  TrendingUp,
  Bot,
  Layout,
  MessageSquare,
  Target,
  Smartphone,
  PenTool,
  SearchCheck,
  MousePointer,
  Calendar,
  DollarSign,
  Flame,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Activity,
  Layers,
  Search,
  Sliders,
  Award,
} from "lucide-react";

interface AIRecommendation {
  id: string;
  text: string;
  impact: string;
  category: string;
  applied: boolean;
}

export const MarketingHub: React.FC = () => {
  const [promptText, setPromptText] = useState("");
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponseModal, setAiResponseModal] = useState<{
    title: string;
    content: string;
    type: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "rec-1",
      text: "Your email open rate can improve by 18%.",
      impact: "+18% Open Rate",
      category: "Email Marketing",
      applied: false,
    },
    {
      id: "rec-2",
      text: "Facebook campaigns are outperforming Google Ads.",
      impact: "Reallocate $1,200/mo",
      category: "Ad Optimization",
      applied: false,
    },
    {
      id: "rec-3",
      text: "Send follow-up emails tomorrow at 10 AM.",
      impact: "2.4x Higher Engagement",
      category: "Audience Timing",
      applied: false,
    },
    {
      id: "rec-4",
      text: "Landing page conversion dropped this week.",
      impact: "Auto-Fix Headline & Form",
      category: "Conversion Rate",
      applied: false,
    },
    {
      id: "rec-5",
      text: "Create a WhatsApp campaign for inactive leads.",
      impact: "+34 Re-engaged Leads",
      category: "Lead Recovery",
      applied: false,
    },
  ]);

  const examplePrompts = [
    "Launch a campaign for luxury apartments.",
    "Generate 1000 real estate leads.",
    "Create an email sequence for new buyers.",
    "Build a landing page for my latest project.",
    "Generate Facebook & Google Ads.",
    "Promote my new property launch.",
  ];

  const quickActions = [
    { label: "Generate Campaign", icon: Sparkles },
    { label: "Email Marketing", icon: Mail },
    { label: "Landing Page", icon: Layout },
    { label: "Lead Magnet", icon: FileText },
    { label: "Google Ads", icon: Target },
    { label: "Meta Ads", icon: Share2 },
    { label: "WhatsApp Campaign", icon: Send },
    { label: "Social Posts", icon: MessageSquare },
    { label: "Campaign Report", icon: BarChart2 },
  ];

  const recentCampaigns = [
    {
      name: "Waterfront Luxury Launch",
      status: "Active",
      score: 96,
      channels: ["Email", "Meta Ads", "WhatsApp"],
      leadCount: 420,
      roi: "420%",
    },
    {
      name: "Q3 High-Net Investor Drip",
      status: "Active",
      score: 92,
      channels: ["Email", "LinkedIn"],
      leadCount: 185,
      roi: "310%",
    },
    {
      name: "Brickell Penthouse Google Ads",
      status: "Scheduled",
      score: 88,
      channels: ["Google Search", "Landing Page"],
      leadCount: 94,
      roi: "280%",
    },
  ];

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );
  };

  const handleRunAiPrompt = (queryToRun?: string) => {
    const query = queryToRun || promptText;
    if (!query.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiResponseModal({
        title: `AI Generated Strategy: "${query}"`,
        type: "Omnichannel Campaign",
        content: `SalesFlow AI has successfully constructed a multi-touch campaign targeting high-intent buyer profiles for "${query}".\n\n1. Target Audience: High-Net-Worth Buyers ($2.5M+ Budget)\n2. Email Subject: "Exclusive VIP Access: Prime Residence Portfolio"\n3. Ad Copy: "Discover unlisted waterfront luxury with private dockage in Miami. Tap for floorplans."\n4. WhatsApp Broadcast: Automated 3D tour dispatch scheduled.\n5. Estimated Leads: 180 - 320 qualified buyers in 14 days.`,
      });
    }, 800);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const featureCards = [
    {
      id: "email",
      title: "EMAIL MARKETING",
      icon: Mail,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Automated high-conversion email builder and sequence engine.",
      tags: [
        "Professional Email Builder",
        "Drag & Drop Editor",
        "AI Email Writer",
        "Templates",
        "Personalization",
        "A/B Testing",
        "Scheduling",
        "Automation",
      ],
      metrics: ["Open Rate: 62.4%", "Click Rate: 28.1%", "Bounce Rate: 0.4%"],
      actionLabel: "Launch Email Studio",
    },
    {
      id: "landing",
      title: "LANDING PAGES",
      icon: Layout,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "High-converting responsive landing page generator.",
      tags: [
        "AI Landing Page Generator",
        "Drag & Drop Builder",
        "Templates",
        "Mobile Responsive",
        "SEO Optimization",
        "Conversion Tracking",
        "Publishing",
        "Analytics",
      ],
      metrics: ["Avg Conv. Rate: 14.2%", "Page Load: 0.8s", "SEO Score: 98/100"],
      actionLabel: "Build Landing Page",
    },
    {
      id: "forms",
      title: "FORMS",
      icon: FileText,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Smart forms and popups with instant lead routing.",
      tags: [
        "AI Form Generator",
        "Lead Capture Forms",
        "Popup Forms",
        "Embedded Forms",
        "Conditional Logic",
        "Spam Protection",
        "Analytics",
      ],
      metrics: ["Form Completion: 42%", "Spam Blocked: 99.9%", "Submissions: 1,420"],
      actionLabel: "Create Smart Form",
    },
    {
      id: "social",
      title: "SOCIAL MEDIA",
      icon: MessageSquare,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Multi-channel content scheduling & AI caption crafting.",
      tags: [
        "Content Calendar",
        "AI Caption Generator",
        "Post Scheduler",
        "Facebook",
        "Instagram",
        "LinkedIn",
        "Twitter/X",
        "Performance Analytics",
      ],
      metrics: ["Posts Scheduled: 28", "Total Reach: 142K", "Avg Engagement: 8.4%"],
      actionLabel: "Schedule Social Content",
    },
    {
      id: "ads",
      title: "ADS",
      icon: Target,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "AI search & social ad copy creation with automated ROI tracking.",
      tags: [
        "Google Ads",
        "Meta Ads",
        "LinkedIn Ads",
        "Campaign Budget",
        "Audience Builder",
        "AI Ad Copy Generator",
        "Conversion Tracking",
        "ROI Dashboard",
      ],
      metrics: ["Cost Per Lead: $14.20", "ROAS: 4.8x", "Impressions: 380K"],
      actionLabel: "Launch Ad Campaign",
    },
    {
      id: "blog",
      title: "BLOG",
      icon: PenTool,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "SEO-optimized article generation and topic clustering.",
      tags: [
        "AI Blog Writer",
        "Topic Generator",
        "SEO Suggestions",
        "Categories",
        "Publishing",
        "Performance",
      ],
      metrics: ["Articles Drafted: 14", "Organic Traffic: +34%", "Keywords Ranked: 120"],
      actionLabel: "Write Blog Article",
    },
    {
      id: "seo",
      title: "SEO",
      icon: SearchCheck,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Automated site audits, keyword rank tracking, and AI fixes.",
      tags: [
        "Website Audit",
        "Keyword Tracking",
        "On-page SEO",
        "Technical SEO",
        "Competitor Analysis",
        "AI SEO Recommendations",
      ],
      metrics: ["Health Score: 96/100", "Top 10 Keywords: 42", "Backlinks: 1,280"],
      actionLabel: "Run SEO Audit",
    },
    {
      id: "lead_capture",
      title: "LEAD CAPTURE",
      icon: Smartphone,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Interactive chatbots, exit intent popups, and lead magnets.",
      tags: [
        "Lead Magnets",
        "Popups",
        "Live Chat",
        "Chatbot",
        "Exit Intent",
        "Visitor Tracking",
        "Lead Qualification",
      ],
      metrics: ["Chat Conversations: 380", "Qualified Rate: 78%", "Exit Capture: 12%"],
      actionLabel: "Configure Lead Magnets",
    },
    {
      id: "analytics",
      title: "MARKETING ANALYTICS",
      icon: BarChart2,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Multi-touch attribution, conversion funnels, and revenue forecasting.",
      tags: [
        "Campaign Dashboard",
        "Traffic Sources",
        "Conversion Rate",
        "Funnel Analysis",
        "Revenue Attribution",
        "ROI",
        "Campaign Performance",
        "AI Insights",
        "Forecast",
      ],
      metrics: ["Attributed Revenue: $1.4M", "Total ROI: 540%", "Funnel Conv: 18.4%"],
      actionLabel: "View Analytics Hub",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              SalesFlow AI Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Marketing Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Create, launch and optimize every marketing campaign with AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-3 py-2 rounded-xl">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>AI Copilot Active</span>
          </div>
          <button
            onClick={() => handleRunAiPrompt("Launch an all-in-one campaign for new luxury buyers")}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>New AI Campaign</span>
          </button>
        </div>
      </div>

      {/* TOP HERO SECTION: LARGE AI ASSISTANT CARD + RIGHT SIDE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large AI Assistant Card (Takes 70% width on desktop) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              <Bot className="w-4 h-4" />
              <span>AI Campaign Director</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              What would you like to market today?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Type a request or select a quick prompt below. SalesFlow AI will automatically draft email sequences, create landing pages, and launch targeted ads.
            </p>
          </div>

          {/* Large Prompt Input Box */}
          <div className="relative z-10 space-y-3">
            <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xl border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2 pl-2 flex-1">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRunAiPrompt()}
                  placeholder="Ask AI to launch a campaign, build a page, or write ad copy..."
                  className="w-full bg-transparent text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleRunAiPrompt()}
                disabled={isGenerating}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate with AI</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Example Prompts Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-blue-200">Examples:</span>
              {examplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(p);
                    handleRunAiPrompt(p);
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
                    onClick={() => {
                      setActiveQuickAction(qa.label);
                      handleRunAiPrompt(`Launch ${qa.label} generator`);
                    }}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group backdrop-blur-xs"
                  >
                    <Icon className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-semibold leading-tight line-clamp-1">
                      {qa.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Panel (Takes 30% width on desktop) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Campaign Overview</h3>
              <p className="text-[11px] text-slate-500">Live performance & AI diagnostics</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>94/100 Score</span>
            </span>
          </div>

          {/* Recent Campaigns List */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Campaigns
            </p>
            {recentCampaigns.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all space-y-1.5 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </h4>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{c.leadCount} Leads Captured</span>
                  <span className="text-emerald-600 font-bold">ROI: {c.roi}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Diagnostic Suggestion Box */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Suggestion</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              "Reallocating 15% budget from Google Search to Meta Video Ads is predicted to lower CPL by <strong>$4.10</strong>."
            </p>
          </div>
        </div>
      </div>

      {/* MARKETING FEATURES SECTION HEADER */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Marketing Tools & Suite
            </h2>
            <p className="text-xs text-slate-500">
              Access individual tools directly or let AI manage them autonomously.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            9 AI Modules Ready
          </span>
        </div>
      </div>

      {/* MARKETING FEATURES CARDS GRID (Equal height 3-column layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm tracking-wide">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Capability Tags Pill Cloud */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {card.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics & Action */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  {card.metrics.map((m, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500">
                      {m}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    handleRunAiPrompt(`Open and configure ${card.title} module`);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM SECTION: AI RECOMMENDATIONS */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                AI Marketing Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Automated continuous optimization insights generated from real-time lead interaction data
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            5 Actionable Insights
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
                    <span>Applied to Campaign</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Apply Recommendation</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI GENERATION MODAL */}
      {aiResponseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">{aiResponseModal.title}</h3>
              </div>
              <button
                onClick={() => setAiResponseModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
              {aiResponseModal.content}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => copyToClipboard(aiResponseModal.content, "modal")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === "modal" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "modal" ? "Copied" : "Copy Prompt"}</span>
              </button>

              <button
                onClick={() => {
                  alert("Launching campaign across Email, Meta Ads, and WhatsApp channels!");
                  setAiResponseModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RocketIcon className="w-4 h-4" />
                <span>Launch Omnichannel Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.2-2.55L4.5 16.5z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
      <path d="M15 9c2-4.51-2-5-2-7" />
    </svg>
  );
}
