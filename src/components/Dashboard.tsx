import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Mail,
  CheckCircle2,
  MousePointer,
  MessageSquare,
  DollarSign,
  Calendar,
  Award,
  Zap,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Users,
  Target,
  ShieldCheck,
  Flame,
  ChevronRight,
  Activity,
  Layers,
  Phone,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { GeneratedCampaign } from "../types";

interface DashboardProps {
  campaign: GeneratedCampaign;
  onOpenAssistant: (query?: string) => void;
}

const engagementTrendData = [
  { day: "Mon", opens: 420, clicks: 180, replies: 45 },
  { day: "Tue", opens: 890, clicks: 340, replies: 92 },
  { day: "Wed", opens: 1250, clicks: 520, replies: 140 },
  { day: "Thu", opens: 1680, clicks: 710, replies: 186 },
  { day: "Fri", opens: 2100, clicks: 940, replies: 230 },
  { day: "Sat", opens: 2350, clicks: 1020, replies: 260 },
  { day: "Sun", opens: 2580, clicks: 1100, replies: 285 },
];

const funnelData = [
  { stage: "Sent", count: 4480 },
  { stage: "Delivered", count: 4412 },
  { stage: "Opened", count: 2580 },
  { stage: "Clicked", count: 1100 },
  { stage: "Replied", count: 186 },
  { stage: "Conversions", count: 42 },
];

const leadScorePieData = [
  { name: "Hot (80-100)", value: 42, color: "#f43f5e" },
  { name: "Warm (50-79)", value: 38, color: "#f59e0b" },
  { name: "Cold (<50)", value: 20, color: "#3b82f6" },
];

const revenueTrendData = [
  { week: "W1", revenue: 24000, roi: 320 },
  { week: "W2", revenue: 58000, roi: 540 },
  { week: "W3", revenue: 112000, roi: 890 },
  { week: "W4", revenue: 185000, roi: 1240 },
];

export const Dashboard: React.FC<DashboardProps> = ({ campaign, onOpenAssistant }) => {
  const [recommendations, setRecommendations] = useState([
    {
      id: "rec-1",
      title: "Resend to Non-Openers with AI Subject Line B",
      description: "1,832 prospects haven't opened Email 1. Resending with AI Subject 'Quick question regarding hospital triage' is projected to yield +18% open rate.",
      impact: "+18% Open Rate",
      applied: false,
    },
    {
      id: "rec-2",
      title: "Automate Instant WhatsApp Ping on Link Clicks",
      description: "Prospects who click demo links are 4x more likely to book. Trigger immediate WhatsApp introduction within 5 minutes of click.",
      impact: "+32% Meetings",
      applied: false,
    },
    {
      id: "rec-3",
      title: "Adjust Send Time to Tuesday 10:15 AM EST",
      description: "Healthcare decision-makers engage 2.4x higher on Tuesday mornings compared to Thursday afternoons.",
      impact: "+14% Conversions",
      applied: false,
    },
  ]);

  const handleApplyRec = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );
  };

  const metrics = campaign.metrics || {
    sent: 4480,
    delivered: 4412,
    openRate: 58.4,
    clickRate: 24.8,
    replies: 186,
    conversions: 42,
    revenue: 185000,
    meetingsBooked: 28,
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#ececec] p-4 lg:p-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Live Campaign Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {campaign.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Target Goal: <span className="text-slate-200 font-semibold">{campaign.goal}</span> • Status: <span className="text-emerald-400 font-semibold capitalize">{campaign.status}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAssistant("Show campaign report")}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            id="dashboard-btn-ai-audit"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask AI Audit</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Emails Sent */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 transition-all shadow-md hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Emails Sent</span>
            <Mail className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {metrics.sent.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium mt-1">98.5% Delivery Rate</p>
        </div>

        {/* Delivered */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 transition-all shadow-md hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {metrics.delivered.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium mt-1">Inbox Placement</p>
        </div>

        {/* Open Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 transition-all shadow-md hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Open Rate</span>
            <MousePointer className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {metrics.openRate}%
          </p>
          <p className="text-[10px] text-emerald-400 font-medium mt-1">+14.2% vs Benchmark</p>
        </div>

        {/* Click Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 transition-all shadow-md hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Click Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {metrics.clickRate}%
          </p>
          <p className="text-[10px] text-emerald-400 font-medium mt-1">High Intent Clicks</p>
        </div>

        {/* Replies */}
        <div className="p-4 rounded-2xl bg-[#2f2f2f] border border-white/10 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Replies</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {metrics.replies}
          </p>
          <p className="text-[10px] text-amber-400 font-medium mt-1">4.2% Reply Rate</p>
        </div>

        {/* Conversions */}
        <div className="p-4 rounded-2xl bg-[#2f2f2f] border border-white/10 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Conversions</span>
            <Award className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {metrics.conversions}
          </p>
          <p className="text-[10px] text-rose-400 font-medium mt-1">Closed Deals</p>
        </div>
      </div>

      {/* SECONDARY METRICS: REVENUE, ROI, MEETINGS, DEALS WON & PIPELINE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-300 font-medium">Revenue</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              ${metrics.revenue.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-300 font-medium">Campaign ROI</p>
            <p className="text-2xl font-extrabold text-white mt-1">1,240%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/40 to-slate-900 border border-violet-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-violet-300 font-medium">Meetings Booked</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {metrics.meetingsBooked}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-300 font-medium">Deals Won</p>
            <p className="text-2xl font-extrabold text-white mt-1">14</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-cyan-300 font-medium">Pipeline Value</p>
            <p className="text-2xl font-extrabold text-white mt-1">$341,000</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CHARTS ROW 1: ENGAGEMENT TREND & CONVERSION FUNNEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Campaign Engagement Trend</h3>
              <p className="text-xs text-slate-400">Daily breakdown of opens, clicks, and replies</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              7-Day Activity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementTrendData}>
                <defs>
                  <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212121",
                    borderColor: "#3f3f46",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="opens"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorOpens)"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Conversion Funnel</h3>
            <p className="text-xs text-slate-400">Prospect dropoff at each channel stage</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" stroke="#a1a1aa" fontSize={10} />
                <YAxis dataKey="stage" type="category" stroke="#a1a1aa" fontSize={10} width={75} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212121",
                    borderColor: "#3f3f46",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: LEAD SCORE PIE & REVENUE LINE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Score Pie Chart */}
        <div className="p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Lead Score Distribution</h3>
            <p className="text-xs text-slate-400">AI qualification tiers across campaign leads</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadScorePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadScorePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212121",
                    borderColor: "#3f3f46",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around text-xs font-medium">
            <span className="text-rose-400">Hot: 42%</span>
            <span className="text-amber-400">Warm: 38%</span>
            <span className="text-blue-400">Cold: 20%</span>
          </div>
        </div>

        {/* Revenue & ROI Growth */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Revenue & ROI Growth</h3>
              <p className="text-xs text-slate-400">Pacing towards monthly closed revenue target</p>
            </div>
            <span className="text-xs font-bold text-emerald-400">$185,000 Total</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <XAxis dataKey="week" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212121",
                    borderColor: "#3f3f46",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CUSTOMER JOURNEY MAP & AI RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Journey Flow */}
        <div className="p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Customer Journey Map</h3>
            <span className="text-xs text-emerald-400 font-semibold">Real-time Path</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#212121] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Outreach Delivered</p>
                  <p className="text-slate-400 text-[11px]">4,480 multi-channel messages sent</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#212121] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Email & WhatsApp Opened</p>
                  <p className="text-slate-400 text-[11px]">2,580 unique prospect engagements</p>
                </div>
              </div>
              <span className="text-indigo-400 font-bold">58.4%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#212121] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Demo Page Clicked</p>
                  <p className="text-slate-400 text-[11px]">1,100 high-intent landing page visitors</p>
                </div>
              </div>
              <span className="text-cyan-400 font-bold">24.8%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#212121] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Meeting Booked / Won</p>
                  <p className="text-slate-400 text-[11px]">28 meetings booked, 42 deals closed</p>
                </div>
              </div>
              <span className="text-rose-400 font-bold">42 Deals</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations Module */}
        <div className="p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">AI Performance Optimization</h3>
            </div>
            <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              3 Suggestions
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-2xl border transition-all ${
                  rec.applied
                    ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                    : "bg-[#212121] border-white/10 hover:border-emerald-500/50 text-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {rec.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{rec.description}</p>

                <button
                  onClick={() => handleApplyRec(rec.id)}
                  disabled={rec.applied}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    rec.applied
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                  }`}
                  id={`rec-btn-${rec.id}`}
                >
                  {rec.applied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied to Campaign</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Apply AI Optimization</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOT LEADS HIGH INTENT QUEUE */}
      <div className="p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Hot Leads & Immediate Engagement Queue</h3>
              <p className="text-xs text-slate-400">High-scoring decision makers currently interacting with your campaign</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>42 Hot Leads (Score &gt; 80)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: "hl-1",
              name: "Dr. Sarah Jenkins",
              title: "Chief Medical Information Officer",
              company: "MetroHealth Systems",
              score: 98,
              trigger: "Clicked Landing Demo Link & Opened WhatsApp 2m ago",
              email: "sjenkins@metrohealth.org",
              phone: "+1 (555) 234-5678",
              avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80",
            },
            {
              id: "hl-2",
              name: "Marcus Vance",
              title: "VP of Health Information Systems",
              company: "Sutter Health Network",
              score: 94,
              trigger: "Replied 'Interested in pricing schedule' on LinkedIn InMail",
              email: "mvance@sutterhealth.org",
              phone: "+1 (555) 876-5432",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            },
            {
              id: "hl-3",
              name: "Elena Rostova",
              title: "Director of Clinical Operations",
              company: "Kaiser Permanente Regional",
              score: 89,
              trigger: "Downloaded EHR Integration Whitepaper & Watched Video",
              email: "erostova@kp.org",
              phone: "+1 (555) 345-6789",
              avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
            },
          ].map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-2xl bg-[#212121] border border-white/10 space-y-3 hover:border-rose-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={lead.avatar}
                    alt={lead.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs">{lead.name}</h4>
                    <p className="text-[11px] text-slate-400">{lead.title}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">{lead.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-xl border border-rose-500/30 inline-block">
                    🔥 {lead.score}
                  </span>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">AI Score</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 text-[11px] text-slate-300">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Latest Activity Trigger:</p>
                <p className="font-medium text-emerald-300 mt-0.5">{lead.trigger}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenAssistant(`Draft personalized WhatsApp follow-up for ${lead.name} at ${lead.company}`)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => onOpenAssistant(`Prepare 1-minute phone pitch script for ${lead.name} (${lead.title})`)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-slate-700"
                  title="Call Lead"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
