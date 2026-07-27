import React, { useState } from "react";
import {
  RotateCw,
  Share2,
  Plus,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Check,
  Info,
  Users,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Send,
  Building2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { GeneratedCampaign } from "../types";

interface DashboardProps {
  campaign?: GeneratedCampaign;
  onOpenAssistant?: (query?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

// Mock Data for "CRM Data Overview"
const contactSourcesData = [
  { source: "HubSpot Processing", count: 2 },
  { source: "Organic Search", count: 1 },
  { source: "Direct Traffic", count: 1 },
];

const contactsOverTimeData = [
  { date: "6/27/2026", count: 0 },
  { date: "7/02/2026", count: 0 },
  { date: "7/07/2026", count: 0 },
  { date: "7/12/2026", count: 0 },
  { date: "7/17/2026", count: 2 },
  { date: "7/22/2026", count: 0 },
  { date: "7/27/2026", count: 0 },
];

const ticketStatusData = [
  { name: "New (Support)", value: 20, color: "#FF8A65" }, // coral
  { name: "Waiting on Contact", value: 17, color: "#EC407A" }, // pink
  { name: "In Progress", value: 9, color: "#AB47BC" }, // purple
  { name: "Waiting on Us", value: 9, color: "#26A69A" }, // teal
  { name: "Escalated", value: 3, color: "#42A5F5" }, // blue
  { name: "Resolved", value: 3, color: "#FFCA28" }, // amber
];

const teamActivityData = [
  { name: "Unassigned", Call: 2, Meeting: 2, Task: 2 },
  { name: "Nishanth R", Call: 1, Meeting: 1, Task: 2 },
];

// Mock Data for "Outreach Overview"
const outreachEngagementData = [
  { month: "Jan", opens: 120, clicks: 45, replies: 18 },
  { month: "Feb", opens: 210, clicks: 82, replies: 34 },
  { month: "Mar", opens: 340, clicks: 140, replies: 62 },
  { month: "Apr", opens: 480, clicks: 210, replies: 95 },
  { month: "May", opens: 620, clicks: 290, replies: 130 },
  { month: "Jun", opens: 810, clicks: 380, replies: 175 },
];

// Mock Data for "Pipeline Overview"
const dealStageData = [
  { stage: "Qualified Lead", count: 14, value: "$4.2M" },
  { stage: "Meeting Scheduled", count: 8, value: "$2.8M" },
  { stage: "Proposal Sent", count: 5, value: "$1.9M" },
  { stage: "Contract Drafted", count: 3, value: "$1.4M" },
  { stage: "Closed Won", count: 12, value: "$5.8M" },
];

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAssistant,
  onNavigateTab,
}) => {
  // Active Dashboard Selection State
  const [selectedDashboard, setSelectedDashboard] = useState<
    "CRM Data Overview" | "Outreach Overview" | "Pipeline Overview"
  >("CRM Data Overview");
  const [showSelectDashboardModal, setShowSelectDashboardModal] = useState(false);

  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState("In the last 30 days");
  const [selectedTeam, setSelectedTeam] = useState("All teams");
  const [selectedOwner, setSelectedOwner] = useState("All owners");

  // Active Dropdown Filter Modal
  const [activeFilterModal, setActiveFilterModal] = useState<
    "date_range" | "teams" | "owners" | null
  >(null);

  // Refresh animation state for cards
  const [refreshingCards, setRefreshingCards] = useState<{ [key: string]: boolean }>({});

  const triggerCardRefresh = (cardId: string) => {
    setRefreshingCards((prev) => ({ ...prev, [cardId]: true }));
    setTimeout(() => {
      setRefreshingCards((prev) => ({ ...prev, [cardId]: false }));
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* SELECT DASHBOARD DRAWER / MODAL */}
      {showSelectDashboardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900">
            <button
              onClick={() => setShowSelectDashboardModal(false)}
              className="p-2 rounded-xl text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black tracking-tight text-white">Select dashboard</h2>
          </div>

          {/* List Options */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {[
              "CRM Data Overview",
              "Outreach Overview",
              "Pipeline Overview",
            ].map((dash) => {
              const isSelected = selectedDashboard === dash;
              return (
                <button
                  key={dash}
                  onClick={() => {
                    setSelectedDashboard(dash as any);
                    setShowSelectDashboardModal(false);
                  }}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/60 text-white font-extrabold shadow-md"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900 font-bold"
                  }`}
                >
                  <span className="text-sm">{dash}</span>
                  {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER OPTION MODAL */}
      {activeFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white capitalize">
                Select {activeFilterModal.replace("_", " ")}
              </h3>
              <button
                onClick={() => setActiveFilterModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Done
              </button>
            </div>

            <div className="space-y-2 text-xs font-bold">
              {activeFilterModal === "date_range" &&
                ["In the last 30 days", "In the last 90 days", "This month", "All time"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedDateRange(opt);
                      setActiveFilterModal(null);
                    }}
                    className={`w-full p-3 rounded-xl text-left border cursor-pointer ${
                      selectedDateRange === opt
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                        : "bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}

              {activeFilterModal === "teams" &&
                ["All teams", "Sales Team", "Customer Support", "Marketing Team"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedTeam(opt);
                      setActiveFilterModal(null);
                    }}
                    className={`w-full p-3 rounded-xl text-left border cursor-pointer ${
                      selectedTeam === opt
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                        : "bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}

              {activeFilterModal === "owners" &&
                ["All owners", "Unassigned", "Nishanth R", "Alex Rivera"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedOwner(opt);
                      setActiveFilterModal(null);
                    }}
                    className={`w-full p-3 rounded-xl text-left border cursor-pointer ${
                      selectedOwner === opt
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                        : "bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboards</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert("Dashboard shared successfully!")}
              className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Share Dashboard"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSelectDashboardModal(true)}
              className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Add / Switch Dashboard"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* CENTERED SELECTOR DROPDOWN BUTTON */}
        <div className="flex justify-center pt-1">
          <button
            onClick={() => setShowSelectDashboardModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-400 hover:bg-slate-800 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>{selectedDashboard}</span>
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* FILTER PILLS ROW */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveFilterModal("date_range")}
            className="px-3.5 py-2 bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 rounded-full flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Date range</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveFilterModal("teams")}
            className="px-3.5 py-2 bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 rounded-full flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Teams</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveFilterModal("owners")}
            className="px-3.5 py-2 bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 rounded-full flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Owners</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT CARDS CONTAINER */}
      <div className="max-w-3xl mx-auto px-4 space-y-5">
        {selectedDashboard === "CRM Data Overview" && (
          <>
            {/* CARD 1: New Contacts Created */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    New Contacts Created
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 uppercase tracking-wider">
                      Compared to | Previous 30 days
                    </span>
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 uppercase tracking-wider">
                      In the last 30 days
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => triggerCardRefresh("new_contacts")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["new_contacts"] ? "animate-spin" : ""
                  }`}
                  title="Refresh report"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-6">
                <span className="text-xs font-extrabold text-slate-500 block mb-1">
                  (Count) Contacts
                </span>
                <span className="text-4xl font-black text-slate-900 tracking-tight">2</span>
              </div>
            </div>

            {/* CARD 2: Contact Sources */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Contact Sources
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      IN THE LAST 30 DAYS
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => triggerCardRefresh("sources")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["sources"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>(Count) Contacts</span>
              </div>

              {/* BAR CHART */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contactSourcesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="source"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 4]} ticks={[0, 2, 4]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                    <Bar dataKey="count" fill="#FF8A65" radius={[4, 4, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-[11px] font-black text-slate-800 uppercase tracking-wider">
                Record source
              </p>
            </div>

            {/* CARD 3: Contacts Added Over Time */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Contacts Added Over Time
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      IN THE LAST 30 DAYS | DAILY
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => triggerCardRefresh("over_time")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["over_time"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>(Count) Contacts</span>
              </div>

              {/* LINE CHART */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contactsOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 4]} ticks={[0, 2, 4]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#FF8A65"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#FF8A65" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-[11px] font-black text-slate-800 uppercase tracking-wider">
                Create Date
              </p>
            </div>

            {/* CARD 4: Ticket Status Breakdown */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Ticket Status Breakdown
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      ALL TIME
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => triggerCardRefresh("tickets")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["tickets"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>New (Support Pipeline)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                  ▲ 1/6 ▼
                </span>
              </div>

              <div className="text-center text-xs font-extrabold text-slate-700">
                Total (Count) Tickets: <span className="font-black text-slate-900">61</span>
              </div>

              {/* DONUT PIE CHART */}
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ticketStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* PIE LEGEND LABELS */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700 pt-2 border-t border-slate-100">
                {ticketStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 5: Team Activity Summary */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Team Activity Summary
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      IN THE LAST 30 DAYS
                    </span>
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      FILTERS (1)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => triggerCardRefresh("team_activity")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["team_activity"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>Call</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Meeting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span>Task</span>
                </div>
              </div>

              {/* STACKED BAR CHART */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} dy={8} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 10]} ticks={[0, 5, 10]} />
                    <Tooltip />
                    <Bar dataKey="Task" stackId="a" fill="#AB47BC" radius={[0, 0, 0, 0]} barSize={40} />
                    <Bar dataKey="Meeting" stackId="a" fill="#26A69A" radius={[0, 0, 0, 0]} barSize={40} />
                    <Bar dataKey="Call" stackId="a" fill="#FF8A65" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-[11px] font-black text-slate-800 uppercase tracking-wider">
                Activity assigned to
              </p>
            </div>

            {/* CARD 6: Open Ticket Summary */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Open Ticket Summary
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      IN THE LAST 90 DAYS
                    </span>
                    <span className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      FILTERS (1)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => triggerCardRefresh("open_tickets")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["open_tickets"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 bg-slate-50 p-3 font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <span>TICKET OWNER</span>
                  <div className="flex items-center gap-1 justify-end">
                    <span>CHAT</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 p-3 font-bold text-slate-800 border-b border-slate-100">
                  <span>Unassigned</span>
                  <span className="text-right text-blue-600 font-extrabold">12</span>
                </div>
                <div className="grid grid-cols-2 p-3 font-bold text-slate-800">
                  <span>Nishanth R</span>
                  <span className="text-right text-blue-600 font-extrabold">4</span>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedDashboard === "Outreach Overview" && (
          <div className="space-y-5">
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Email Engagement Trends</h3>
                  <p className="text-xs text-slate-500 font-medium">Opens, clicks, and reply volume over time</p>
                </div>
                <button
                  onClick={() => triggerCardRefresh("outreach_chart")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["outreach_chart"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={outreachEngagementData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="opens" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="clicks" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedDashboard === "Pipeline Overview" && (
          <div className="space-y-5">
            <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Pipeline Stage Distribution</h3>
                  <p className="text-xs text-slate-500 font-medium">Active deal volume by stage</p>
                </div>
                <button
                  onClick={() => triggerCardRefresh("pipeline_chart")}
                  className={`p-2 hover:bg-slate-100 rounded-full text-cyan-600 transition-all cursor-pointer ${
                    refreshingCards["pipeline_chart"] ? "animate-spin" : ""
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {dealStageData.map((item) => (
                  <div key={item.stage} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">{item.stage}</p>
                      <p className="text-[11px] text-slate-500 font-bold">{item.count} Active Deals</p>
                    </div>
                    <span className="text-sm font-extrabold text-blue-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TIMEZONE FOOTER NOTE */}
        <div className="text-center pt-2 pb-6">
          <p className="text-xs text-slate-400 font-semibold">Account time zone</p>
          <p className="text-xs font-bold text-slate-300">GMT-04:00</p>
        </div>
      </div>

      {/* FLOATING AI ACTION BUTTON (✨ Ask Breeze) */}
      <button
        onClick={() => {
          if (onOpenAssistant) {
            onOpenAssistant("Help me analyze my dashboard performance metrics, ticket breakdown, and contact sources");
          }
        }}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-500 text-white font-black text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer ring-4 ring-pink-500/20"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow shrink-0" />
        <span>✨ Ask Breeze</span>
      </button>
    </div>
  );
};
