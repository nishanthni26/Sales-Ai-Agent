import React, { useState } from "react";
import {
  Users,
  Target,
  DollarSign,
  Plus,
  Search,
  ChevronRight,
  Calendar,
  CheckCircle2,
  FileText,
  Phone,
  MessageSquare,
  ArrowRight,
  Zap,
  TrendingUp,
  BarChart2,
  CheckSquare,
  Clock,
  Mail,
  Smartphone,
  Activity,
  Award,
  Layers,
  RotateCw,
  Filter,
  Briefcase,
  Handshake,
  PhoneCall,
  Video,
  UserCheck,
  ClipboardList,
  FileSignature,
  Calculator,
  Repeat,
  Bell,
  ExternalLink,
  Tag,
  Sliders,
  Eye,
  ListChecks,
} from "lucide-react";

export const SalesHub: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "leads" | "tasks" | "email" | "analytics">("pipeline");

  const triggerRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const categories = [
    { id: "all", label: "All", icon: Layers },
    { id: "pipeline", label: "Pipeline", icon: Briefcase },
    { id: "leads", label: "Leads", icon: Users },
    { id: "automation", label: "Automation", icon: Zap },
    { id: "email", label: "Email", icon: Mail },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "quotes", label: "Quotes", icon: FileSignature },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  const stats = [
    { label: "Total Revenue", value: "$14.6M", icon: DollarSign },
    { label: "Open Deals", value: "42", icon: Briefcase },
    { label: "Win Rate", value: "68%", icon: Award },
    { label: "Avg Cycle", value: "18 Days", icon: Clock },
  ];

  const KANBAN_STAGES = [
    { id: "new", name: "New", color: "bg-blue-500" },
    { id: "contacted", name: "Contacted", color: "bg-indigo-500" },
    { id: "qualified", name: "Qualified", color: "bg-cyan-500" },
    { id: "proposal", name: "Proposal", color: "bg-amber-500" },
    { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
    { id: "won", name: "Won", color: "bg-emerald-500" },
    { id: "lost", name: "Lost", color: "bg-rose-500" },
  ];

  const deals = [
    { id: "d1", client: "Dr. Elena Rostova", property: "Waterfront Luxury Villa #420", value: "$4,850,000", stage: "proposal", probability: 87, expectedClose: "Aug 24, 2026", owner: "Sarah Jenkins" },
    { id: "d2", client: "Marcus Vance", property: "Brickell Sky Penthouse A", value: "$2,950,000", stage: "negotiation", probability: 78, expectedClose: "Sep 10, 2026", owner: "Alex Rivera" },
    { id: "d3", client: "Sophia Martinez", property: "Star Island Compound", value: "$7,200,000", stage: "qualified", probability: 65, expectedClose: "Oct 15, 2026", owner: "Sarah Jenkins" },
    { id: "d4", client: "David Chen", property: "Coconut Grove Residence", value: "$3,650,000", stage: "contacted", probability: 50, expectedClose: "Nov 02, 2026", owner: "Alex Rivera" },
    { id: "d5", client: "Victoria Sterling", property: "Coral Gables Estate", value: "$5,100,000", stage: "won", probability: 100, expectedClose: "Jul 28, 2026", owner: "Sarah Jenkins" },
    { id: "d6", client: "Jonathan Hayes", property: "Sunny Isles Suite 1802", value: "$1,850,000", stage: "new", probability: 30, expectedClose: "Nov 20, 2026", owner: "Alex Rivera" },
  ];

  const filteredDeals = deals.filter(
    (d) =>
      d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayMeetings = [
    { time: "10:30 AM", title: "Site Tour: Waterfront Villa", client: "Dr. Elena Rostova", type: "In-Person" },
    { time: "02:00 PM", title: "Proposal Review: Brickell Penthouse", client: "Marcus Vance", type: "Video Call" },
    { time: "04:30 PM", title: "Discovery Call: Sunny Isles Suite", client: "Jonathan Hayes", type: "Phone" },
  ];

  const tasksDue = [
    { task: "Send revised contract draft", client: "Dr. Elena Rostova", due: "Today 5:00 PM", priority: "High" },
    { task: "Prepare HOA disclosure docs", client: "Marcus Vance", due: "Today 6:30 PM", priority: "Medium" },
    { task: "Send virtual tour video", client: "David Chen", due: "Tomorrow", priority: "High" },
  ];

  const featureCards = [
    { id: "pipeline", category: "pipeline", title: "Deal Pipeline Management", icon: Briefcase, description: "Visual Kanban board with drag-and-drop deal stages and probability tracking.", tags: ["Kanban Board", "Drag & Drop", "Deal Stages", "Probability Tracking", "Custom Stages", "Deal Routing", "Weighted Pipeline", "Forecast Categories"], metrics: ["Open Deals: 42", "Pipeline: $25.5M", "Stages: 7"], actionLabel: "View Pipeline" },
    { id: "lead_mgmt", category: "leads", title: "Lead Management", icon: Users, description: "Capture, route, and qualify leads with automated assignment rules.", tags: ["Lead Capture", "Lead Routing", "Assignment Rules", "Round Robin", "Lead Qualification", "Status Tracking", "Source Attribution", "Duplicate Merge"], metrics: ["Leads: 1,840", "Qualified: 620", "Response Time: 4m"], actionLabel: "Manage Leads" },
    { id: "lead_scoring", category: "leads", title: "Lead Scoring", icon: Award, description: "Behavioral and demographic scoring with lifecycle stage progression.", tags: ["Behavioral Scoring", "Demographic Scoring", "Score Thresholds", "Lifecycle Stages", "Stage Transitions", "Hot/Warm/Cold", "Score Decay", "Custom Score Fields"], metrics: ["Hot Leads: 142", "Avg Score: 68", "Conversion: 34%"], actionLabel: "Configure Scoring" },
    { id: "sequences", category: "automation", title: "Sales Sequences", icon: Zap, description: "Multi-step email and call sequences with automated follow-up scheduling.", tags: ["Email Sequences", "Call Sequences", "Auto Follow-Up", "Step Scheduling", "Enrollment Rules", "Unenrollment Triggers", "Sequence Analytics", "Template Library"], metrics: ["Active Sequences: 18", "Enrolled: 420", "Reply Rate: 24%"], actionLabel: "Build Sequence" },
    { id: "workflows", category: "automation", title: "Sales Workflows", icon: Activity, description: "Automate repetitive sales tasks with trigger-based workflow rules.", tags: ["Trigger-Based", "Task Automation", "Field Updates", "Notification Rules", "SLA Timers", "Escalation Rules", "Webhook Actions", "Workflow Templates"], metrics: ["Workflows: 24", "Tasks Automated: 320", "Time Saved: 42h"], actionLabel: "Manage Workflows" },
    { id: "tasks", category: "automation", title: "Task & Activity Queue", icon: CheckSquare, description: "Prioritized task queue with due dates, reminders, and completion tracking.", tags: ["Task Queue", "Priority Levels", "Due Date Reminders", "Recurring Tasks", "Task Templates", "Bulk Actions", "Activity Logging", "Task Reports"], metrics: ["Open Tasks: 38", "Overdue: 4", "Completed: 180"], actionLabel: "View Task Queue" },
    { id: "email_tracking", category: "email", title: "Email Tracking", icon: Mail, description: "Real-time open and click notifications with engagement timeline.", tags: ["Open Tracking", "Click Tracking", "Real-Time Notifications", "Engagement Timeline", "Attachment Tracking", "Link Analytics", "Reply Detection", "Email Templates"], metrics: ["Open Rate: 68%", "Reply Rate: 24%", "Avg Response: 3.2h"], actionLabel: "View Email Analytics" },
    { id: "email_templates", category: "email", title: "Email Templates", icon: FileText, description: "Reusable sales email templates with personalization tokens and snippets.", tags: ["Template Library", "Personalization Tokens", "Snippets", "A/B Testing", "Category Folders", "Sharing Rules", "Template Analytics", "Approval Workflow"], metrics: ["Templates: 84", "Categories: 12", "Top Open: 74%"], actionLabel: "Manage Templates" },
    { id: "meetings", category: "meetings", title: "Meeting Scheduler", icon: Calendar, description: "Self-serve booking links with calendar sync and round-robin routing.", tags: ["Booking Links", "Calendar Sync", "Round-Robin Routing", "Meeting Types", "Buffer Time", "Availability Rules", "Time Zone Detection", "CRM Auto-Log"], metrics: ["Booked This Week: 28", "No-Show Rate: 8%", "Avg Duration: 32m"], actionLabel: "Configure Scheduler" },
    { id: "calls", category: "meetings", title: "Call Tracking", icon: PhoneCall, description: "Log calls, record conversations, and track call outcomes automatically.", tags: ["Call Logging", "Call Recording", "Transcription", "Call Outcomes", "Disposition Codes", "Voicemail Drop", "Power Dialer", "Call Analytics"], metrics: ["Calls Today: 42", "Connect Rate: 58%", "Avg Duration: 4.2m"], actionLabel: "View Call Log" },
    { id: "quotes", category: "quotes", title: "Quotes & Proposals", icon: FileSignature, description: "Generate branded quotes and proposals with e-signature and approval workflows.", tags: ["Quote Builder", "Line Items", "Custom Pricing", "Discount Approval", "E-Signature", "Proposal Templates", "Version Tracking", "Acceptance Tracking"], metrics: ["Active Quotes: 24", "Accepted: 68%", "Avg Value: $3.2M"], actionLabel: "Create Quote" },
    { id: "playbooks", category: "quotes", title: "Sales Playbooks", icon: ClipboardList, description: "Step-by-step guided selling with stage-specific playbooks and battle cards.", tags: ["Guided Selling", "Stage Playbooks", "Battle Cards", "Objection Handling", "Discovery Questions", "Competitor Cards", "Talk Track Library", "Playbook Analytics"], metrics: ["Playbooks: 12", "Adoption: 78%", "Win Lift: +22%"], actionLabel: "View Playbooks" },
    { id: "forecasting", category: "analytics", title: "Sales Forecasting", icon: TrendingUp, description: "Pipeline forecast with weighted projections and quota tracking.", tags: ["Weighted Forecast", "Pipeline Projection", "Quota Tracking", "Forecast Categories", "Win Probability", "Close Date Analysis", "Revenue Targets", "Forecast Variance"], metrics: ["Forecast: $14.6M", "Quota: $18M", "Attainment: 81%"], actionLabel: "View Forecast" },
    { id: "analytics", category: "analytics", title: "Sales Analytics", icon: BarChart2, description: "Comprehensive dashboards for revenue, activity, and team performance.", tags: ["Revenue Dashboard", "Activity Reports", "Win/Loss Analysis", "Sales Cycle Metrics", "Rep Leaderboard", "Conversion Funnel", "Deal Velocity", "Custom Reports"], metrics: ["Revenue: $14.6M", "Win Rate: 68%", "Avg Cycle: 18d"], actionLabel: "View Analytics" },
    { id: "territories", category: "analytics", title: "Territory Management", icon: Sliders, description: "Define and manage sales territories with assignment rules and capacity.", tags: ["Territory Builder", "Assignment Rules", "Capacity Planning", "Territory Hierarchy", "Account Mapping", "Balance Reports", "Territory Reassignment", "Geo Rules"], metrics: ["Territories: 8", "Reps: 24", "Balance: 92%"], actionLabel: "Manage Territories" },
    { id: "notifications", category: "analytics", title: "Notifications & Alerts", icon: Bell, description: "Real-time deal alerts, task reminders, and engagement notifications.", tags: ["Deal Alerts", "Task Reminders", "Engagement Alerts", "SLA Warnings", "Stage Change Alerts", "Custom Triggers", "Digest Emails", "Mobile Push"], metrics: ["Alerts Today: 18", "Ack Rate: 94%", "Avg Response: 2.1m"], actionLabel: "Configure Alerts" },
  ];

  const filteredCards = activeFilter === "all" ? featureCards : featureCards.filter((c) => c.category === activeFilter);

  const performanceRows = [
    { rep: "Sarah Jenkins", deals: 14, closed: 8, revenue: "$8.4M", quota: "$10M", attainment: "84%" },
    { rep: "Alex Rivera", deals: 12, closed: 6, revenue: "$5.2M", quota: "$8M", attainment: "65%" },
    { rep: "Maria Lopez", deals: 8, closed: 5, revenue: "$3.8M", quota: "$6M", attainment: "63%" },
    { rep: "James Park", deals: 10, closed: 4, revenue: "$2.9M", quota: "$5M", attainment: "58%" },
    { rep: "Nina Patel", deals: 6, closed: 3, revenue: "$2.1M", quota: "$4M", attainment: "52%" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Sales Hub</h1>
          <div className="flex items-center gap-3">
            <button onClick={triggerRefresh} className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer" title="Refresh">
              <RotateCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => alert("Creating new deal...")} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Deal</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Manage your pipeline, leads, sequences, and revenue forecasting.</p>
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
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "pipeline" as const, label: "Pipeline", icon: Layers },
            { id: "leads" as const, label: "Leads", icon: Users },
            { id: "tasks" as const, label: "Tasks", icon: CheckSquare },
            { id: "email" as const, label: "Email", icon: Mail },
            { id: "analytics" as const, label: "Analytics", icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeSubTab === tab.id ? "bg-cyan-500 text-slate-950 border border-cyan-400" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeSubTab === "pipeline" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          <div className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search deals by client, property, or value..." className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="flex sm:grid sm:grid-cols-7 gap-3 overflow-x-auto pb-2 no-scrollbar">
            {KANBAN_STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
              return (
                <div key={stage.id} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-md min-w-[200px] sm:min-w-0 flex flex-col space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <h3 className="font-black text-slate-900 text-[11px]">{stage.name}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-200">{stageDeals.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map((deal) => (
                      <div key={deal.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all cursor-pointer space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">{deal.value}</span>
                          <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">{deal.probability}%</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-[11px]">{deal.client}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{deal.property}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                          <span className="text-[10px] text-slate-500">{deal.owner}</span>
                          <span className="text-[10px] text-slate-400">{deal.expectedClose}</span>
                        </div>
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-[10px] font-medium">No deals</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === "leads" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{deal.client}</h4>
                  <p className="text-[11px] text-slate-500">{deal.property}</p>
                </div>
                <span className="text-xs font-black text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-100">Score: {deal.probability}/100</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex justify-between"><span className="text-slate-400">Deal Value:</span><span className="font-bold text-slate-800">{deal.value}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Owner:</span><span className="font-bold text-slate-800">{deal.owner}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Stage:</span><span className="font-bold text-cyan-600 capitalize">{deal.stage}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Close Date:</span><span className="font-bold text-slate-800">{deal.expectedClose}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === "tasks" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Upcoming Meetings</span>
            </h3>
            <div className="space-y-2">
              {todayMeetings.map((m, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{m.title}</h4>
                    <p className="text-[11px] text-slate-500">{m.client} - {m.type}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 text-xs font-bold rounded-lg border border-cyan-100">{m.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Tasks Due</span>
            </h3>
            <div className="space-y-2">
              {tasksDue.map((t, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{t.task}</h4>
                    <p className="text-[11px] text-slate-500">{t.client} - {t.due}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.priority === "High" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "email" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Email & Communication</h3>
                <p className="text-[11px] text-slate-500">Sequences, templates, and tracking</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Open Rate: 68%</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: Mail, title: "Proposal Follow-Up Sequence", desc: "5-step email sequence after proposal sent", metric: "Open: 82% | Reply: 44%", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
                { icon: MessageSquare, title: "WhatsApp VIP Dispatch", desc: "Direct messaging with virtual tour links", metric: "Delivery: 99.8% | Click: 56%", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                { icon: Smartphone, title: "Re-Engagement Drip", desc: "Triggers when lead inactive for 72+ hours", metric: "Re-engagement: 38%", color: "text-amber-600 bg-amber-50 border-amber-100" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`p-3 rounded-xl border ${item.color} space-y-1.5`}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.desc}</p>
                    <p className="text-[10px] font-bold">{item.metric}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "analytics" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Revenue Closed", value: "$14.6M", delta: "+28%", icon: DollarSign },
              { label: "Pipeline Volume", value: "$25.5M", delta: "42 Deals", icon: Briefcase },
              { label: "Win Rate", value: "68%", delta: "+12%", icon: Award },
              { label: "Avg Sales Cycle", value: "18 Days", delta: "-24 days", icon: Clock },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md space-y-1">
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-cyan-600" />
                    <span className="text-[10px] font-bold text-emerald-600">{s.delta}</span>
                  </div>
                  <p className="text-lg font-black text-slate-900">{s.value}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Rep Performance</h3>
              <button onClick={() => alert("Exporting...")} className="text-[11px] font-bold text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100 hover:bg-cyan-100 transition-all cursor-pointer flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rep</th>
                    <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deals</th>
                    <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Closed</th>
                    <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                    <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quota</th>
                    <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attainment</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 text-xs font-bold text-slate-900">{row.rep}</td>
                      <td className="py-3 pr-4 text-xs text-slate-600">{row.deals}</td>
                      <td className="py-3 pr-4 text-xs text-slate-600">{row.closed}</td>
                      <td className="py-3 pr-4 text-xs font-bold text-slate-900">{row.revenue}</td>
                      <td className="py-3 pr-4 text-xs text-slate-600">{row.quota}</td>
                      <td className="py-3 pr-4 text-xs font-bold text-cyan-600">{row.attainment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-3">
              {performanceRows.map((row, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{row.rep}</h4>
                    <span className="text-xs font-bold text-cyan-600">{row.attainment}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div><p className="text-slate-500 font-bold uppercase">Deals</p><p className="text-slate-800 font-bold">{row.deals}</p></div>
                    <div><p className="text-slate-500 font-bold uppercase">Closed</p><p className="text-slate-800 font-bold">{row.closed}</p></div>
                    <div><p className="text-slate-500 font-bold uppercase">Rev</p><p className="text-slate-800 font-bold">{row.revenue}</p></div>
                    <div><p className="text-slate-500 font-bold uppercase">Quota</p><p className="text-slate-800 font-bold">{row.quota}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-black text-white tracking-tight">Sales Tools</h2>
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
                <button onClick={() => alert(`Opening ${card.title}...`)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-6 pb-6">
        <p className="text-xs text-slate-400 font-semibold">Account time zone</p>
        <p className="text-xs font-bold text-slate-300">GMT-04:00</p>
      </div>
    </div>
  );
};
