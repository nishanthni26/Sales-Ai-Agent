import React, { useState } from "react";
import {
  Mail,
  Layout,
  FileText,
  Share2,
  BarChart2,
  ArrowRight,
  Plus,
  MessageSquare,
  Target,
  PenTool,
  SearchCheck,
  Calendar,
  Users,
  Zap,
  Layers,
  Search,
  Award,
  TrendingUp,
  MousePointer,
  Tag,
  Webhook,
  Bell,
  Filter,
  ListChecks,
  Rss,
  Video,
  Megaphone,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Activity,
  ChevronDown,
  RotateCw,
} from "lucide-react";

export const MarketingHub: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const categories = [
    { id: "all", label: "All", icon: Layers },
    { id: "email", label: "Email", icon: Mail },
    { id: "landing", label: "Landing", icon: Layout },
    { id: "automation", label: "Automation", icon: Zap },
    { id: "leads", label: "Leads", icon: Users },
    { id: "social", label: "Social", icon: MessageSquare },
    { id: "ads", label: "Ads", icon: Target },
    { id: "content", label: "Content", icon: PenTool },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  const stats = [
    { label: "Active Campaigns", value: "34", icon: Megaphone },
    { label: "Total Leads", value: "12,480", icon: Users },
    { label: "Emails Sent", value: "84.2K", icon: Mail },
    { label: "Attributed Revenue", value: "$1.4M", icon: DollarSign },
  ];

  const recentCampaigns = [
    { name: "Waterfront Luxury Launch", status: "Active", channels: ["Email", "Meta Ads", "WhatsApp"], leadCount: 420, roi: "420%", type: "Email Program" },
    { name: "Q3 High-Net Investor Drip", status: "Active", channels: ["Email", "LinkedIn"], leadCount: 185, roi: "310%", type: "Nurture Program" },
    { name: "Brickell Penthouse Google Ads", status: "Scheduled", channels: ["Google Search", "Landing Page"], leadCount: 94, roi: "280%", type: "Ad Program" },
    { name: "Spring Open House Webinar", status: "Draft", channels: ["Email", "Landing Page", "Social"], leadCount: 0, roi: "—", type: "Event Program" },
  ];

  const featureCards = [
    { id: "email", category: "email", title: "Email Marketing", icon: Mail, description: "Build, personalize, and automate high-conversion email programs.", tags: ["Drag & Drop Builder", "Templates", "Personalization", "A/B Testing", "Dynamic Content", "Send Time Optimization", "Scheduling", "Subscription Preferences"], metrics: ["Open: 62.4%", "Click: 28.1%", "Bounce: 0.4%"], actionLabel: "Open Email Studio" },
    { id: "email_automation", category: "email", title: "Email Automation", icon: Zap, description: "Triggered email sequences and drip nurture programs.", tags: ["Drip Campaigns", "Triggered Emails", "Welcome Series", "Re-engagement Flows", "Behavioral Triggers", "Branching Logic", "Exhaustion Management", "Communication Limits"], metrics: ["Flows: 12", "Avg Steps: 5.2", "Completion: 74%"], actionLabel: "Manage Automations" },
    { id: "landing", category: "landing", title: "Landing Pages", icon: Layout, description: "Build high-converting, mobile-responsive landing pages.", tags: ["Drag & Drop Builder", "Guided Templates", "Mobile Responsive", "A/B Testing", "Dynamic Content", "SEO Meta Tags", "Custom Domains", "Publishing Workflow"], metrics: ["Conv: 14.2%", "Load: 0.8s", "SEO: 98/100"], actionLabel: "Build Landing Page" },
    { id: "forms", category: "landing", title: "Forms & Popups", icon: FileText, description: "Capture leads with smart forms, popups, and progressive profiling.", tags: ["Form Builder", "Progressive Profiling", "Embedded Forms", "Popup Forms", "Exit-Intent Popups", "Conditional Logic", "Field Validation", "Spam Protection"], metrics: ["Completion: 42%", "Spam Blocked: 99.9%", "Submissions: 1,420"], actionLabel: "Create Form" },
    { id: "cta", category: "landing", title: "CTA Management", icon: MousePointer, description: "Create, manage, and track call-to-action buttons across pages.", tags: ["Smart CTAs", "Button Builder", "A/B Testing", "Click Tracking", "Placement Rules", "Audience Targeting", "Performance Reports"], metrics: ["Active CTAs: 28", "CTR: 6.8%", "Top: 'Book a Tour'"], actionLabel: "Manage CTAs" },
    { id: "smart_campaigns", category: "automation", title: "Smart Campaigns", icon: Zap, description: "Trigger and batch campaigns with behavioral filters and flow steps.", tags: ["Trigger Campaigns", "Batch Campaigns", "Behavioral Filters", "Demographic Filters", "Flow Steps", "Wait Steps", "Webhook Actions", "Campaign Queue"], metrics: ["Active: 34", "Triggers Today: 182", "Avg Flow: 4.2d"], actionLabel: "Build Smart Campaign" },
    { id: "nurture", category: "automation", title: "Engagement Programs", icon: ListChecks, description: "Multi-stream nurture programs with content cadence and exhaustion rules.", tags: ["Nurture Streams", "Content Cadence", "Stream Transitions", "Exhaustion Management", "Priority Rules", "A/B Stream Testing", "Program Membership"], metrics: ["Programs: 8", "Members: 1,240", "Avg Steps: 6"], actionLabel: "Manage Nurture" },
    { id: "workflows", category: "automation", title: "Marketing Workflows", icon: Activity, description: "Visual workflow builder for multi-step cross-channel automations.", tags: ["Visual Flow Builder", "Branching Logic", "Multi-Channel Steps", "Goal-Based Exits", "Suppression Lists", "Re-enrollment Rules", "Workflow Templates"], metrics: ["Workflows: 22", "Active Contacts: 840", "Avg Steps: 7.4"], actionLabel: "Open Workflow Builder" },
    { id: "webhooks", category: "automation", title: "Webhooks & Integrations", icon: Webhook, description: "Send real-time event data to external systems via custom webhooks.", tags: ["Custom Webhooks", "Event Subscriptions", "Payload Mapping", "Authentication", "Retry Logic", "API Access", "CRM Sync", "Zapier Integration"], metrics: ["Webhooks: 14", "Calls Today: 3,200", "Success: 99.2%"], actionLabel: "Configure Webhooks" },
    { id: "lead_scoring", category: "leads", title: "Lead Scoring", icon: Award, description: "Behavioral and demographic scoring models with lifecycle stages.", tags: ["Behavioral Scoring", "Demographic Scoring", "Score Thresholds", "Grade Models", "Lifecycle Stages", "Stage Transitions", "Score Decay", "Custom Score Fields"], metrics: ["Hot Leads: 142", "Avg Score: 68", "Conversion: 34%"], actionLabel: "Configure Scoring" },
    { id: "segmentation", category: "leads", title: "Segmentation & Lists", icon: Filter, description: "Dynamic smart lists and static lists with behavioral and demographic filters.", tags: ["Smart Lists", "Static Lists", "Behavioral Filters", "Demographic Filters", "List Combos", "Suppression Lists", "Seed Lists", "List Imports"], metrics: ["Smart Lists: 48", "Segments: 12K", "Avg Size: 420"], actionLabel: "Manage Segments" },
    { id: "lead_capture", category: "leads", title: "Lead Capture", icon: Target, description: "Interactive lead magnets, popups, and visitor tracking.", tags: ["Lead Magnets", "Exit-Intent Popups", "Visitor Tracking", "Source Attribution", "UTM Tracking", "Progressive Profiling", "Duplicate Management"], metrics: ["Captures Today: 84", "Qualified: 78%", "Exit Capture: 12%"], actionLabel: "Configure Capture" },
    { id: "lifecycle", category: "leads", title: "Lifecycle Modeler", icon: TrendingUp, description: "Visual revenue cycle modeler with stage transition rules.", tags: ["Revenue Cycle Modeler", "Stage Definitions", "Transition Rules", "Stage Gates", "SLA Timers", "Milestone Tracking", "Stage Reports"], metrics: ["Stages: 8", "Avg Cycle: 24d", "Conversion: 18.4%"], actionLabel: "Edit Lifecycle Model" },
    { id: "social", category: "social", title: "Social Media", icon: MessageSquare, description: "Multi-channel content scheduling and social listening.", tags: ["Content Calendar", "Post Scheduler", "Facebook", "Instagram", "LinkedIn", "Twitter/X", "Social Listening", "Performance Analytics"], metrics: ["Scheduled: 28", "Reach: 142K", "Engagement: 8.4%"], actionLabel: "Schedule Content" },
    { id: "social_ads", category: "social", title: "Social Advertising", icon: Share2, description: "Manage paid social campaigns across Facebook, Instagram, and LinkedIn.", tags: ["Facebook Ads", "Instagram Ads", "LinkedIn Ads", "Audience Builder", "Lookalike Audiences", "Retargeting", "Budget Management", "Conversion Tracking"], metrics: ["Cost/Lead: $14.20", "ROAS: 4.8x", "Impressions: 380K"], actionLabel: "Launch Social Ads" },
    { id: "search_ads", category: "ads", title: "Search Ads", icon: Target, description: "Google Ads and Bing Ads management with keyword tracking.", tags: ["Google Search Ads", "Bing Ads", "Keyword Management", "Ad Groups", "Bid Strategy", "Budget Allocation", "Conversion Tracking", "ROI Dashboard"], metrics: ["CPC: $3.20", "ROAS: 5.2x", "Conversions: 340"], actionLabel: "Manage Search Ads" },
    { id: "ad_attribution", category: "ads", title: "Ad Attribution", icon: DollarSign, description: "Multi-touch attribution models and spend tracking across channels.", tags: ["First-Touch", "Last-Touch", "Multi-Touch", "Spend Tracking", "Revenue Attribution", "Channel Comparison", "Budget Forecasting"], metrics: ["Revenue: $1.4M", "ROI: 540%", "Spend: $42K/mo"], actionLabel: "View Attribution" },
    { id: "blog", category: "content", title: "Blog & Content", icon: PenTool, description: "Content management with editorial calendar and topic clustering.", tags: ["Content Editor", "Editorial Calendar", "Topic Clusters", "Content Staging", "Categories & Tags", "Author Management", "Publishing Workflow", "Content Performance"], metrics: ["Articles: 14", "Organic: +34%", "Avg Time: 3.2m"], actionLabel: "Write Article" },
    { id: "seo", category: "content", title: "SEO & Search", icon: SearchCheck, description: "Site audits, keyword rank tracking, and on-page optimization.", tags: ["Website Audit", "Keyword Tracking", "On-Page SEO", "Technical SEO", "Backlink Monitoring", "Competitor Analysis", "Content Strategy", "SERP Tracking"], metrics: ["Health: 96/100", "Top 10: 42", "Backlinks: 1,280"], actionLabel: "Run SEO Audit" },
    { id: "video", category: "content", title: "Video Hosting", icon: Video, description: "Host, embed, and track video content across campaigns.", tags: ["Video Upload", "Embed Codes", "Custom Player", "Video CTAs", "View Tracking", "Heatmaps", "Channel Pages"], metrics: ["Videos: 18", "Views: 24K", "Watch: 62%"], actionLabel: "Manage Videos" },
    { id: "rss", category: "content", title: "RSS & Feeds", icon: Rss, description: "RSS feed management and content syndication.", tags: ["RSS Feed Builder", "Content Syndication", "Feed Scheduling", "Custom Feed URLs", "Feed Analytics"], metrics: ["Feeds: 6", "Subscribers: 3.2K", "CTR: 12%"], actionLabel: "Manage Feeds" },
    { id: "analytics", category: "analytics", title: "Marketing Analytics", icon: BarChart2, description: "Multi-touch attribution, conversion funnels, and revenue reporting.", tags: ["Campaign Dashboard", "Traffic Sources", "Conversion Funnels", "Revenue Attribution", "ROI Reporting", "Program Analyzer", "Revenue Explorer", "Custom Reports"], metrics: ["Revenue: $1.4M", "ROI: 540%", "Funnel: 18.4%"], actionLabel: "View Analytics" },
    { id: "calendar", category: "analytics", title: "Marketing Calendar", icon: Calendar, description: "Visual calendar for all campaigns, content, and events.", tags: ["Campaign Calendar", "Content Schedule", "Event Planning", "Drag & Drop", "Color-Coded Views", "Team Assignments", "Approval Workflow"], metrics: ["Scheduled: 48", "This Week: 12", "Pending: 4"], actionLabel: "Open Calendar" },
    { id: "event_marketing", category: "analytics", title: "Event Marketing", icon: Megaphone, description: "Webinars, trade shows, and in-person event management.", tags: ["Webinar Hosting", "Event Registration", "Trade Show Tracking", "RSVP Forms", "Reminder Emails", "Check-In Management", "Post-Event Surveys", "Event ROI"], metrics: ["Upcoming: 6", "Registrants: 420", "Attendance: 68%"], actionLabel: "Manage Events" },
    { id: "tokens", category: "analytics", title: "Tokens & Variables", icon: Tag, description: "Program-level tokens and variable management for dynamic content.", tags: ["My Tokens", "Program Tokens", "System Tokens", "Dynamic Content", "Variable Inheritance", "Token Library", "Bulk Token Updates"], metrics: ["Tokens: 84", "Programs: 22", "Types: 12"], actionLabel: "Manage Tokens" },
    { id: "subscription", category: "analytics", title: "Subscription Management", icon: Bell, description: "Email preferences, unsubscribe management, and frequency capping.", tags: ["Preference Center", "Unsubscribe Management", "Frequency Capping", "Communication Limits", "Subscription Types", "Opt-In Forms", "Compliance Tracking"], metrics: ["Opted-In: 8.2K", "Unsub: 0.4%", "Frequency: 3.2/wk"], actionLabel: "Edit Preferences" },
  ];

  const filteredCards = activeFilter === "all" ? featureCards : featureCards.filter((c) => c.category === activeFilter);

  const performanceRows = [
    { channel: "Email Marketing", programs: 12, leads: 4200, mqls: 840, conv: "20%", revenue: "$420K", roi: "380%" },
    { channel: "Paid Search (Google)", programs: 6, leads: 1840, mqls: 420, conv: "22.8%", revenue: "$310K", roi: "280%" },
    { channel: "Paid Social (Meta/LinkedIn)", programs: 8, leads: 2400, mqls: 380, conv: "15.8%", revenue: "$280K", roi: "240%" },
    { channel: "Landing Pages", programs: 14, leads: 3200, mqls: 680, conv: "21.2%", revenue: "$340K", roi: "320%" },
    { channel: "Nurture Programs", programs: 8, leads: 1840, mqls: 520, conv: "28.2%", revenue: "$260K", roi: "410%" },
    { channel: "Events & Webinars", programs: 4, leads: 680, mqls: 240, conv: "35.2%", revenue: "$180K", roi: "220%" },
    { channel: "Social (Organic)", programs: 5, leads: 1200, mqls: 180, conv: "15%", revenue: "$90K", roi: "180%" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Marketing Hub</h1>
          <div className="flex items-center gap-3">
            <button onClick={triggerRefresh} className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer" title="Refresh">
              <RotateCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => alert("Opening campaign builder...")} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Create, launch, and optimize multi-channel marketing campaigns.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0 border border-slate-200">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-black text-slate-900 truncate">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
        <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">Campaign Overview</h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">In the last 30 days</span>
                <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">All channels</span>
              </div>
            </div>
            <button onClick={triggerRefresh} className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${refreshing ? "animate-spin" : ""}`} title="Refresh report">
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Active Programs", value: "34", delta: "+6 this week" },
              { label: "Leads Captured", value: "1,840", delta: "+312 this week" },
              { label: "Conversion Rate", value: "18.4%", delta: "+2.1% lift" },
              { label: "Pipeline Value", value: "$4.2M", delta: "+$380K" },
            ].map((qs, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-0.5">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{qs.label}</p>
                <p className="text-lg font-black text-slate-900">{qs.value}</p>
                <p className="text-[10px] text-emerald-600 font-bold">{qs.delta}</p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Quick Launch</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Email Program", icon: Mail },
                { label: "Nurture Stream", icon: ListChecks },
                { label: "Landing Page", icon: Layout },
                { label: "Smart Campaign", icon: Zap },
                { label: "Event", icon: Megaphone },
                { label: "Social Post", icon: MessageSquare },
              ].map((qa, i) => {
                const Icon = qa.icon;
                return (
                  <button key={i} onClick={() => alert(`Creating new ${qa.label}...`)} className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                    <Icon className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{qa.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
        <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Recent Campaigns</h3>
              <p className="text-[11px] text-slate-500">Live performance tracking</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>4 Active</span>
            </span>
          </div>
          <div className="space-y-3">
            {recentCampaigns.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all space-y-1.5 cursor-pointer group">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors truncate">{c.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${c.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : c.status === "Scheduled" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{c.status}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{c.type}</span>
                  <span>{c.leadCount} Leads</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {c.channels.map((ch, ci) => (
                    <span key={ci} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{ch}</span>
                  ))}
                  <span className="text-[10px] text-emerald-600 font-bold ml-auto">ROI: {c.roi}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => alert("Opening full campaign list...")} className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
            <span>View All Campaigns</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-black text-white tracking-tight">Marketing Tools</h2>
          <p className="text-[11px] text-slate-500">{filteredCards.length} modules across {categories.length - 1} categories</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 text-xs font-bold">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setActiveFilter(cat.id)} className={`px-3 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeFilter === cat.id ? "bg-cyan-500 text-slate-950 border border-cyan-400" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md hover:border-cyan-200 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0 border border-slate-200">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-slate-900 text-sm tracking-wide">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{card.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-slate-50 text-slate-700 px-2 py-1 rounded-lg border border-slate-100">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  {card.metrics.map((m, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500 font-semibold">{m}</span>
                  ))}
                </div>
                <button onClick={() => alert(`Opening ${card.title} module...`)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
        <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center border border-slate-200">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Program Performance</h3>
                <p className="text-[11px] text-slate-500">Channel-level ROI summary</p>
              </div>
            </div>
            <button onClick={() => alert("Exporting report...")} className="text-[11px] font-bold text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100 hover:bg-cyan-100 transition-all cursor-pointer flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel</th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Programs</th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leads</th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">MQLs</th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Conv</th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ROI</th>
                </tr>
              </thead>
              <tbody>
                {performanceRows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 text-xs font-bold text-slate-900">{row.channel}</td>
                    <td className="py-3 pr-4 text-xs text-slate-600">{row.programs}</td>
                    <td className="py-3 pr-4 text-xs text-slate-600">{row.leads.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-xs text-slate-600">{row.mqls.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-xs font-bold text-cyan-600">{row.conv}</td>
                    <td className="py-3 pr-4 text-xs font-bold text-slate-900">{row.revenue}</td>
                    <td className="py-3 pr-4 text-xs font-bold text-emerald-600">{row.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden space-y-3">
            {performanceRows.map((row, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{row.channel}</h4>
                  <span className="text-xs font-bold text-emerald-600">{row.roi}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div><p className="text-slate-500 font-bold uppercase">Prog</p><p className="text-slate-800 font-bold">{row.programs}</p></div>
                  <div><p className="text-slate-500 font-bold uppercase">Leads</p><p className="text-slate-800 font-bold">{row.leads.toLocaleString()}</p></div>
                  <div><p className="text-slate-500 font-bold uppercase">MQLs</p><p className="text-slate-800 font-bold">{row.mqls.toLocaleString()}</p></div>
                  <div><p className="text-slate-500 font-bold uppercase">Rev</p><p className="text-slate-800 font-bold">{row.revenue}</p></div>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold">Conversion</span>
                  <span className="text-[10px] font-bold text-cyan-600">{row.conv}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-6 pb-6">
        <p className="text-xs text-slate-400 font-semibold">Account time zone</p>
        <p className="text-xs font-bold text-slate-300">GMT-04:00</p>
      </div>
    </div>
  );
};
