import React, { useState } from "react";
import {
  Users,
  Building2,
  DollarSign,
  CheckSquare,
  Calendar as CalendarIcon,
  Video,
  FileText,
  Activity,
  Flame,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Tag,
  Clock,
  ArrowUpRight,
  Folder,
  X,
  Check,
  Upload,
  Download,
  StickyNote,
  Layers,
  Award,
  Send,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  Globe,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import {
  Contact,
  Company,
  Deal,
  Task,
  Meeting,
  CRMDocument,
  CRMNote,
  CRMActivity,
} from "../types";

interface CRMViewProps {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  meetings: Meeting[];
  documents: CRMDocument[];
  notes: CRMNote[];
  activities: CRMActivity[];
  onAddContact: (contact: Contact) => void;
  onBulkImportContacts: (contacts: Contact[]) => void;
  onAddCompany: (company: Company) => void;
  onAddDeal: (deal: Deal) => void;
  onUpdateDealStage: (dealId: string, stage: Deal["stage"]) => void;
  onAddTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onAddMeeting: (meeting: Meeting) => void;
  onAddDocument: (document: CRMDocument) => void;
  onAddNote: (note: CRMNote) => void;
  onAddActivity: (activity: CRMActivity) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  contacts,
  companies,
  deals,
  tasks,
  meetings,
  documents,
  notes,
  activities,
  onAddContact,
  onBulkImportContacts,
  onAddCompany,
  onAddDeal,
  onUpdateDealStage,
  onAddTask,
  onToggleTask,
  onAddMeeting,
  onAddDocument,
  onAddNote,
  onAddActivity,
}) => {
  const [activeModule, setActiveModule] = useState<
    | "dashboard"
    | "contacts"
    | "companies"
    | "deals"
    | "pipelines"
    | "tasks"
    | "calendar"
    | "activities"
    | "meetings"
    | "notes"
    | "documents"
    | "leadscoring"
  >("dashboard");

  // Advanced Search & Filter State
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Modals
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showImportCsvModal, setShowImportCsvModal] = useState(false);

  // Forms State
  // 1. Add Contact
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactCompany, setNewContactCompany] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // 2. Add Company
  const [newCompName, setNewCompName] = useState("");
  const [newCompDomain, setNewCompDomain] = useState("");
  const [newCompIndustry, setNewCompIndustry] = useState("");
  const [newCompSize, setNewCompSize] = useState("100-500 employees");

  // 3. Add Deal
  const [newDealTitle, setNewDealTitle] = useState("");
  const [newDealCompany, setNewDealCompany] = useState("");
  const [newDealContact, setNewDealContact] = useState("");
  const [newDealValue, setNewDealValue] = useState("50000");
  const [newDealStage, setNewDealStage] = useState<Deal["stage"]>("lead");

  // 4. Add Task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("2026-07-30");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("high");

  // 5. Add Meeting
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingContact, setNewMeetingContact] = useState("");
  const [newMeetingCompany, setNewMeetingCompany] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("2026-07-28 14:00 EST");

  // 6. Add Note
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteEntity, setNewNoteEntity] = useState("");

  // 7. Add Activity
  const [newActType, setNewActType] = useState<CRMActivity["type"]>("call");
  const [newActTitle, setNewActTitle] = useState("");
  const [newActDesc, setNewActDesc] = useState("");

  // CSV Import State
  const [csvStep, setCsvStep] = useState<"upload" | "map" | "preview">("upload");
  const [csvFileName, setCsvFileName] = useState("Hospital_Leads_Import.csv");

  // Sample CSV mapped records
  const sampleImportContacts: Contact[] = [
    {
      id: `c-imp-1`,
      name: "Dr. Arthur Pendelton",
      email: "apendelton@mayoclinic.org",
      phone: "+1 (555) 321-7788",
      company: "Mayo Clinic Network",
      role: "VP of Medical Operations",
      leadScore: 92,
      scoreGrade: "Hot",
      status: "lead",
      tags: ["CSV Import", "Healthcare"],
      lastContacted: "Just now",
      timeline: [
        {
          id: `t-imp-1`,
          date: "Today",
          type: "note_added",
          description: "Imported from CSV list: Hospital_Leads_Import.csv",
        },
      ],
    },
    {
      id: `c-imp-2`,
      name: "Sophia Martinez",
      email: "smartinez@kaiser.org",
      phone: "+1 (555) 444-9911",
      company: "Kaiser Permanente",
      role: "Chief Nursing Information Officer",
      leadScore: 89,
      scoreGrade: "Hot",
      status: "lead",
      tags: ["CSV Import", "Decision Maker"],
      lastContacted: "Just now",
      timeline: [
        {
          id: `t-imp-2`,
          date: "Today",
          type: "note_added",
          description: "Imported from CSV list: Hospital_Leads_Import.csv",
        },
      ],
    },
    {
      id: `c-imp-3`,
      name: "Gregory Vance",
      email: "gvance@clevelandclinic.org",
      phone: "+1 (555) 777-2233",
      company: "Cleveland Clinic",
      role: "Director of Health Systems",
      leadScore: 78,
      scoreGrade: "Warm",
      status: "lead",
      tags: ["CSV Import", "Warm Prospect"],
      lastContacted: "Just now",
      timeline: [
        {
          id: `t-imp-3`,
          date: "Today",
          type: "note_added",
          description: "Imported from CSV list: Hospital_Leads_Import.csv",
        },
      ],
    },
  ];

  // CSV Export Handler
  const handleExportCSV = (moduleName: string) => {
    let headers = "";
    let rows: string[] = [];

    if (moduleName === "contacts") {
      headers = "ID,Name,Email,Phone,Company,Role,LeadScore,ScoreGrade,Status,LastContacted\n";
      rows = contacts.map(
        (c) =>
          `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.company}","${c.role}",${c.leadScore},"${c.scoreGrade}","${c.status}","${c.lastContacted}"`
      );
    } else if (moduleName === "companies") {
      headers = "ID,Name,Domain,Industry,Size,DealsCount,Revenue\n";
      rows = companies.map(
        (c) =>
          `"${c.id}","${c.name}","${c.domain}","${c.industry}","${c.size}",${c.dealsCount},${c.revenue}`
      );
    } else if (moduleName === "deals") {
      headers = "ID,Title,CompanyName,ContactName,Value,Stage,Probability,ExpectedClose\n";
      rows = deals.map(
        (d) =>
          `"${d.id}","${d.title}","${d.companyName}","${d.contactName}",${d.value},"${d.stage}",${d.probability},"${d.expectedClose}"`
      );
    } else {
      headers = "ID,Title,DueDate,Priority,Completed,Assignee,RelatedTo\n";
      rows = tasks.map(
        (t) =>
          `"${t.id}","${t.title}","${t.dueDate}","${t.priority}",${t.completed},"${t.assignee}","${t.relatedTo}"`
      );
    }

    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SalesFlow_CRM_${moduleName}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Handlers
  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactEmail) return;

    const created: Contact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      email: newContactEmail,
      phone: newContactPhone || "+1 (555) 000-1122",
      company: newContactCompany || "Independent",
      role: newContactRole || "Executive",
      leadScore: 85,
      scoreGrade: "Hot",
      status: "lead",
      tags: ["Manual Entry", "New Prospect"],
      lastContacted: "Just now",
      timeline: [
        {
          id: `t-${Date.now()}`,
          date: "Today",
          type: "note_added",
          description: "Contact added manually via SalesFlow CRM Hub",
        },
      ],
    };

    onAddContact(created);
    setShowAddContactModal(false);
    setNewContactName("");
    setNewContactEmail("");
    setNewContactCompany("");
    setNewContactRole("");
  };

  const handleCreateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName) return;

    const created: Company = {
      id: `comp-${Date.now()}`,
      name: newCompName,
      domain: newCompDomain || `${newCompName.toLowerCase().replace(/\s+/g, "")}.com`,
      industry: newCompIndustry || "Technology",
      size: newCompSize,
      dealsCount: 0,
      revenue: 0,
    };

    onAddCompany(created);
    setShowAddCompanyModal(false);
    setNewCompName("");
    setNewCompDomain("");
    setNewCompIndustry("");
  };

  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle) return;

    const created: Deal = {
      id: `d-${Date.now()}`,
      title: newDealTitle,
      companyName: newDealCompany || "Saint Jude Health System",
      contactName: newDealContact || "Dr. Elena Rostova",
      value: parseFloat(newDealValue) || 50000,
      stage: newDealStage,
      probability: 60,
      expectedClose: "2026-08-30",
    };

    onAddDeal(created);
    setShowAddDealModal(false);
    setNewDealTitle("");
    setNewDealValue("50000");
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const created: Task = {
      id: `tk-${Date.now()}`,
      title: newTaskTitle,
      dueDate: newTaskDue,
      priority: newTaskPriority,
      completed: false,
      assignee: "Sales AI Agent",
      relatedTo: "General Outreach",
    };

    onAddTask(created);
    setShowAddTaskModal(false);
    setNewTaskTitle("");
  };

  const handleCreateMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle) return;

    const created: Meeting = {
      id: `m-${Date.now()}`,
      title: newMeetingTitle,
      contactName: newMeetingContact || "Executive Contact",
      company: newMeetingCompany || "Target Account",
      dateTime: newMeetingTime,
      duration: "30 mins",
      link: "https://meet.google.com/salesflow-demo-session",
      status: "upcoming",
    };

    onAddMeeting(created);
    setShowAddMeetingModal(false);
    setNewMeetingTitle("");
  };

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;

    const created: CRMNote = {
      id: `n-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      relatedEntityName: newNoteEntity || "General Account",
      relatedEntityType: "company",
      tags: ["Internal Note"],
      createdAt: "Just now",
      author: "Alex Rivers",
    };

    onAddNote(created);
    setShowAddNoteModal(false);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const handleCreateActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActTitle) return;

    const created: CRMActivity = {
      id: `act-${Date.now()}`,
      type: newActType,
      title: newActTitle,
      description: newActDesc || "Logged manually from CRM activity hub",
      performedBy: "Alex Rivers",
      relatedTo: "General Outreach",
      timestamp: "Just now",
    };

    onAddActivity(created);
    setShowAddActivityModal(false);
    setNewActTitle("");
    setNewActDesc("");
  };

  // Filtered Lists
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(globalSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
      c.role.toLowerCase().includes(globalSearch.toLowerCase());

    const matchesTag =
      selectedTagFilter === "all" || c.tags.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase());

    const matchesScore =
      selectedScoreFilter === "all" ||
      (selectedScoreFilter === "hot" && c.scoreGrade === "Hot") ||
      (selectedScoreFilter === "warm" && c.scoreGrade === "Warm") ||
      (selectedScoreFilter === "cold" && c.scoreGrade === "Cold");

    return matchesSearch && matchesTag && matchesScore;
  });

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const totalRevenueWon = deals.filter((d) => d.stage === "closed_won").reduce((sum, d) => sum + d.value, 0);
  const totalHotLeads = contacts.filter((c) => c.scoreGrade === "Hot").length;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#ececec] p-3 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* ENTERPRISE CRM TOP BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              SalesFlow Enterprise CRM Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Customer Relationship & Revenue Engine
          </h1>
          <p className="text-xs text-slate-400">
            Real-time synchronization across contacts, accounts, deal pipelines, tasks, and predictive AI lead scores.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddContactModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>

          <button
            onClick={() => setShowAddDealModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Deal</span>
          </button>

          <button
            onClick={() => setShowImportCsvModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => handleExportCSV(activeModule === "companies" ? "companies" : activeModule === "deals" ? "deals" : "contacts")}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND ADVANCED FILTER BAR */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Universal Search across contacts, companies, deals, tasks..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto shrink-0">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Grade:</span>
          </span>
          <select
            value={selectedScoreFilter}
            onChange={(e) => setSelectedScoreFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Grades</option>
            <option value="hot">🔥 Hot Score</option>
            <option value="warm">⚡ Warm Score</option>
            <option value="cold">❄️ Cold Score</option>
          </select>
        </div>
      </div>

      {/* ALL 12 CRM NAVIGATION MODULE TABS */}
      <div className="flex flex-nowrap overflow-x-auto gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 scrollbar-none backdrop-blur-xl">
        {[
          { id: "dashboard", label: "CRM Overview", count: "Live", icon: TrendingUp },
          { id: "contacts", label: "Contacts", count: contacts.length, icon: Users },
          { id: "companies", label: "Companies", count: companies.length, icon: Building2 },
          { id: "deals", label: "Deals", count: deals.length, icon: DollarSign },
          { id: "pipelines", label: "Pipeline Kanban", count: "Board", icon: Layers },
          { id: "tasks", label: "Tasks", count: tasks.length, icon: CheckSquare },
          { id: "calendar", label: "Calendar", count: "Jul", icon: CalendarIcon },
          { id: "activities", label: "Activities", count: activities.length, icon: Activity },
          { id: "meetings", label: "Meetings", count: meetings.length, icon: Video },
          { id: "notes", label: "Notes", count: notes.length, icon: StickyNote },
          { id: "documents", label: "Files & Documents", count: documents.length, icon: FileText },
          { id: "leadscoring", label: "Lead Scoring", count: "AI", icon: Flame },
        ].map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as any)}
              id={`crm-module-${mod.id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                activeModule === mod.id
                  ? "bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mod.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeModule === mod.id ? "bg-emerald-500 text-white" : "bg-[#212121] text-slate-400"
                }`}
              >
                {mod.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: DASHBOARD OVERVIEW */}
      {activeModule === "dashboard" && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider">Total Pipeline Value</p>
                <p className="text-2xl font-extrabold text-white mt-1">${totalPipelineValue.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-1">↑ +18.4% vs last month</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs text-emerald-300 font-medium uppercase tracking-wider">Closed Won Revenue</p>
                <p className="text-2xl font-extrabold text-white mt-1">${totalRevenueWon.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-1">100% Win Rate verified</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/30 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs text-rose-300 font-medium uppercase tracking-wider">High Intent Hot Leads</p>
                <p className="text-2xl font-extrabold text-white mt-1">{totalHotLeads} Contacts</p>
                <p className="text-[10px] text-rose-400 font-bold mt-1">AI Lead Score &gt; 80</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs text-cyan-300 font-medium uppercase tracking-wider">Upcoming Meetings</p>
                <p className="text-2xl font-extrabold text-white mt-1">{meetings.length} Scheduled</p>
                <p className="text-[10px] text-cyan-400 font-bold mt-1">Next: Today 14:00 EST</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Video className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick CRM Overview Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deals Progress Summary */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Active Deal Pipeline Stages</h3>
                <button
                  onClick={() => setActiveModule("pipelines")}
                  className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Pipeline Board</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {deals.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white text-sm">{d.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{d.companyName} • Contact: {d.contactName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-emerald-400 text-sm">${d.value.toLocaleString()}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase mt-1 inline-block">
                        {d.stage.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities Feed */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Live Activity Stream</h3>
                <button
                  onClick={() => setActiveModule("activities")}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-bold text-[10px]">
                      <span>{act.title}</span>
                      <span className="text-slate-500">{act.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{act.description}</p>
                    <p className="text-[10px] text-slate-500">By {act.performedBy} • {act.relatedTo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CONTACTS */}
      {activeModule === "contacts" && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Displaying {filteredContacts.length} Contacts
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV("contacts")}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Contact Name & Email</th>
                    <th className="p-4">Company & Title</th>
                    <th className="p-4">Lead Score</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Tags</th>
                    <th className="p-4">Last Contacted</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-emerald-300">{c.company}</div>
                        <div className="text-[11px] text-slate-400">{c.role}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            c.scoreGrade === "Hot"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : c.scoreGrade === "Warm"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          🔥 {c.leadScore} ({c.scoreGrade})
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{c.phone}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {c.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">{c.lastContacted}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedContact(c)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          View Timeline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: COMPANIES */}
      {activeModule === "companies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Target Enterprise Accounts ({companies.length})</h3>
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((comp) => (
              <div key={comp.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{comp.name}</h3>
                    <a
                      href={`https://${comp.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{comp.domain}</span>
                    </a>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {comp.size}
                  </span>
                </div>

                <p className="text-xs text-slate-400">Industry: {comp.industry}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300 font-medium">
                  <span>{comp.dealsCount} Deals Associated</span>
                  <span className="text-emerald-400 font-extrabold">${comp.revenue.toLocaleString()} Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: DEALS LIST */}
      {activeModule === "deals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">All Deals & Value Estimates</h3>
            <button
              onClick={() => setShowAddDealModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Deal</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Deal Title</th>
                  <th className="p-4">Company / Contact</th>
                  <th className="p-4">Value ($)</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Win Probability</th>
                  <th className="p-4">Expected Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {deals.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{d.title}</td>
                    <td className="p-4">
                      <div className="text-emerald-300 font-semibold">{d.companyName}</div>
                      <div className="text-[11px] text-slate-400">{d.contactName}</div>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-400">${d.value.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {d.stage.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-cyan-300">{d.probability}%</td>
                    <td className="p-4 text-slate-400 font-mono">{d.expectedClose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 5: PIPELINES KANBAN BOARD */}
      {activeModule === "pipelines" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Visual Sales Pipeline Stages</h3>
            <span className="text-xs text-slate-400">Total Value: ${totalPipelineValue.toLocaleString()}</span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto gap-3 pb-4 scrollbar-none">
            {[
              { id: "lead", label: "Lead Identified", color: "border-slate-700" },
              { id: "contacted", label: "Contacted", color: "border-indigo-500/50" },
              { id: "meeting", label: "Meeting Scheduled", color: "border-violet-500/50" },
              { id: "proposal", label: "Proposal Sent", color: "border-cyan-500/50" },
              { id: "closed_won", label: "Closed Won", color: "border-emerald-500/50" },
            ].map((col) => {
              const stageDeals = deals.filter((d) => d.stage === col.id);
              const totalVal = stageDeals.reduce((sum, d) => sum + d.value, 0);

              return (
                <div
                  key={col.id}
                  className={`bg-[#1c2333] border-t-2 ${col.color} border-slate-800 rounded-2xl p-4 space-y-3 min-w-[270px] max-w-[310px] shrink-0 min-h-[440px] shadow-xl`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200">{col.label}</span>
                    <span className="text-[10px] font-bold bg-[#0b0f17] px-2.5 py-0.5 rounded-full text-emerald-400 border border-slate-800">
                      ${(totalVal / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageDeals.map((dl) => (
                      <div
                        key={dl.id}
                        className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-emerald-500/50 space-y-2 transition-all shadow-md"
                      >
                        <p className="font-bold text-xs text-white">{dl.title}</p>
                        <p className="text-[11px] text-slate-400">{dl.companyName}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                          <span className="text-emerald-400 font-extrabold text-xs">${dl.value.toLocaleString()}</span>
                          <span className="text-slate-400">{dl.probability}% Win</span>
                        </div>

                        {col.id !== "closed_won" && (
                          <button
                            onClick={() => {
                              const stages: Deal["stage"][] = ["lead", "contacted", "meeting", "proposal", "closed_won"];
                              const nextIdx = stages.indexOf(dl.stage) + 1;
                              if (nextIdx < stages.length) {
                                onUpdateDealStage(dl.id, stages[nextIdx]);
                              }
                            }}
                            className="w-full py-1.5 mt-1 rounded-xl text-[10px] font-bold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                          >
                            Advance to Next Stage →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODULE 6: TASKS */}
      {activeModule === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Sales & Outreach Action Tasks</h3>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((tk) => (
              <div
                key={tk.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleTask(tk.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      tk.completed
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "border-slate-700 hover:border-emerald-500"
                    }`}
                  >
                    {tk.completed && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <p className={`font-bold text-slate-100 ${tk.completed ? "line-through text-slate-500" : ""}`}>
                      {tk.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Related to: {tk.relatedTo} • Assignee: {tk.assignee}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-[11px]">Due {tk.dueDate}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      tk.priority === "high" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {tk.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: CALENDAR */}
      {activeModule === "calendar" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Sales Meeting & Task Schedule (July 2026)</h3>
            <button
              onClick={() => setShowAddMeetingModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isToday = day === 23;
              const hasMeeting = day === 25 || day === 26 || day === 22;

              return (
                <div
                  key={day}
                  className={`p-3 rounded-2xl min-h-[85px] border flex flex-col justify-between ${
                    isToday
                      ? "bg-emerald-950/40 border-emerald-500/50"
                      : hasMeeting
                      ? "bg-slate-950 border-indigo-500/30"
                      : "bg-slate-950/50 border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs ${isToday ? "text-emerald-400 font-bold" : "text-slate-400"}`}>
                      {day}
                    </span>
                    {isToday && <span className="text-[9px] font-bold text-emerald-400 uppercase">Today</span>}
                  </div>

                  {hasMeeting && (
                    <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30 truncate">
                      {day === 25 ? "🏥 AI Demo" : day === 26 ? "🚚 Tech Q&A" : "📈 Strategy Sync"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODULE 8: ACTIVITIES */}
      {activeModule === "activities" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Audit & Outreach Activity Feed</h3>
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Activity</span>
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-sm">{act.title}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{act.timestamp}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{act.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>Logged by: {act.performedBy}</span>
                  <span>Related to: {act.relatedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 9: MEETINGS */}
      {activeModule === "meetings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Executive Meetings & Demos</h3>
            <button
              onClick={() => setShowAddMeetingModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((m) => (
              <div key={m.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{m.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.contactName} • {m.company}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <span>📅 {m.dateTime} ({m.duration})</span>
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Launch Meeting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 10: NOTES */}
      {activeModule === "notes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Account & Opportunity Notes</h3>
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {notes.map((n) => (
              <div key={n.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{n.relatedEntityName}</span>
                  <span className="text-[10px] font-mono text-slate-500">{n.createdAt}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{n.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

                <div className="flex flex-wrap gap-1 pt-2">
                  {n.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 11: DOCUMENTS */}
      {activeModule === "documents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Repository Files & Attachments</h3>
            <button
              onClick={() => {
                const newDoc: CRMDocument = {
                  id: `doc-${Date.now()}`,
                  name: `Executive_Proposal_Draft_Q3.pdf`,
                  type: `PDF Document`,
                  size: `3.8 MB`,
                  category: `Proposal`,
                  uploadedAt: `Just now`,
                };
                onAddDocument(newDoc);
              }}
              className="px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Simulate File Upload</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400">
                  <FileText className="w-6 h-6 shrink-0" />
                  <span className="font-bold text-xs text-white truncate">{doc.name}</span>
                </div>
                <p className="text-xs text-slate-400">{doc.category} • {doc.size}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  <span>Uploaded {doc.uploadedAt}</span>
                  <button
                    onClick={() => alert(`Downloading ${doc.name}...`)}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 12: LEAD SCORING */}
      {activeModule === "leadscoring" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">AI Predictive Lead Scoring Engine</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated engagement analysis & high-intent buyer identification</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              🔥 42 Decision Makers Above Threshold (Score &gt; 80)
            </span>
          </div>

          {/* Scoring Rules Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-rose-400">+25 Points: Demo Booked</p>
              <p className="text-slate-400">Immediate escalation to "Hot" tier upon scheduling interactive session</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-amber-400">+15 Points: Demo Link Clicked</p>
              <p className="text-slate-400">Prospect opened landing page from email or WhatsApp outreach</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-blue-400">+10 Points: Title Match</p>
              <p className="text-slate-400">VP, Chief Medical Officer, or C-Level title detected in profile</p>
            </div>
          </div>

          {/* High Score Queue */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Scoring Decision Makers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts
                .filter((c) => c.scoreGrade === "Hot")
                .map((lead) => (
                  <div key={lead.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-white text-sm">{lead.name}</h5>
                        <p className="text-xs text-slate-400">{lead.role} at {lead.company}</p>
                      </div>
                      <span className="text-xs font-extrabold text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-xl border border-rose-500/30">
                        🔥 {lead.leadScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => alert(`Opening WhatsApp chat with ${lead.name}...`)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => alert(`Dialing ${lead.phone}...`)}
                        className="py-1.5 px-3 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700"
                      >
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT TIMELINE DRAWER */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-end p-4">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full rounded-3xl p-6 relative overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Contact Profile
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{selectedContact.name}</h2>
              <p className="text-xs text-slate-400">{selectedContact.role} at {selectedContact.company}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-200 font-mono">{selectedContact.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200 font-mono">{selectedContact.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lead Score:</span>
                <span className="text-rose-400 font-bold">{selectedContact.leadScore} ({selectedContact.scoreGrade})</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Communication Timeline
              </h3>
              <div className="space-y-2">
                {selectedContact.timeline.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-indigo-400 font-bold text-[10px]">
                      <span>{item.type.replace("_", " ").toUpperCase()}</span>
                      <span className="text-slate-500">{item.date}</span>
                    </div>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSV IMPORT WIZARD MODAL */}
      {showImportCsvModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowImportCsvModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Import Contacts CSV</h3>
                <p className="text-xs text-slate-400">Bulk upload prospect lists into SalesFlow CRM</p>
              </div>
            </div>

            {csvStep === "upload" && (
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-800 hover:border-emerald-500 rounded-2xl text-center space-y-3 bg-slate-950/50 transition-all cursor-pointer">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-white">Click to upload CSV file or drag & drop</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Supports CSV, XLSX up to 25MB</p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                    {csvFileName}
                  </span>
                </div>

                <button
                  onClick={() => setCsvStep("map")}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Continue to Field Mapping →
                </button>
              </div>
            )}

            {csvStep === "map" && (
              <div className="space-y-4 text-xs">
                <p className="font-bold text-slate-200">Map CSV Columns to CRM Fields:</p>
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">First_Name + Last_Name →</span>
                    <span className="font-bold text-emerald-400">Contact Name</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Email_Address →</span>
                    <span className="font-bold text-emerald-400">Primary Email</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Organization_Name →</span>
                    <span className="font-bold text-emerald-400">Company</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Job_Title →</span>
                    <span className="font-bold text-emerald-400">Role / Title</span>
                  </div>
                </div>

                <button
                  onClick={() => setCsvStep("preview")}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Preview Sample Records →
                </button>
              </div>
            )}

            {csvStep === "preview" && (
              <div className="space-y-4 text-xs">
                <p className="font-bold text-slate-200">Preview 3 Records Ready to Import:</p>
                <div className="space-y-2">
                  {sampleImportContacts.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="font-bold text-white">{c.name} ({c.role})</p>
                      <p className="text-slate-400 text-[11px]">{c.email} • {c.company}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onBulkImportContacts(sampleImportContacts);
                    setShowImportCsvModal(false);
                    setCsvStep("upload");
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg"
                >
                  Import 3 Contacts Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CONTACT */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddContactModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Add New CRM Contact</h3>

            <form onSubmit={handleCreateContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Dr. Arthur Vance"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="arthur@healthsystem.org"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Company</label>
                <input
                  type="text"
                  value={newContactCompany}
                  onChange={(e) => setNewContactCompany(e.target.value)}
                  placeholder="Saint Jude Health System"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Role / Title</label>
                <input
                  type="text"
                  value={newContactRole}
                  onChange={(e) => setNewContactRole(e.target.value)}
                  placeholder="Chief Medical Officer"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer shadow-md"
              >
                Save Contact
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD COMPANY */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddCompanyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Add Target Account / Company</h3>

            <form onSubmit={handleCreateCompanySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="Mayo Clinic System"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Domain URL</label>
                <input
                  type="text"
                  value={newCompDomain}
                  onChange={(e) => setNewCompDomain(e.target.value)}
                  placeholder="mayoclinic.org"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Industry</label>
                <input
                  type="text"
                  value={newCompIndustry}
                  onChange={(e) => setNewCompIndustry(e.target.value)}
                  placeholder="Healthcare & Hospitals"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
              >
                Create Company Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD DEAL */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddDealModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create New Sales Deal</h3>

            <form onSubmit={handleCreateDealSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={newDealTitle}
                  onChange={(e) => setNewDealTitle(e.target.value)}
                  placeholder="Hospital AI Intake Pilot Expansion"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Value ($)</label>
                <input
                  type="number"
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pipeline Stage</label>
                <select
                  value={newDealStage}
                  onChange={(e) => setNewDealStage(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                >
                  <option value="lead">Lead Identified</option>
                  <option value="contacted">Contacted</option>
                  <option value="meeting">Meeting Scheduled</option>
                  <option value="proposal">Proposal Sent</option>
                  <option value="closed_won">Closed Won</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
              >
                Create Deal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddTaskModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create Task</h3>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Send customized proposal deck"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD MEETING */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddMeetingModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Schedule Executive Demo</h3>

            <form onSubmit={handleCreateMeetingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  placeholder="AI Healthcare Triage Demo"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Date & Time</label>
                <input
                  type="text"
                  value={newMeetingTime}
                  onChange={(e) => setNewMeetingTime(e.target.value)}
                  placeholder="2026-07-28 14:00 EST"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
              >
                Schedule Meeting
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD NOTE */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddNoteModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create Account Note</h3>

            <form onSubmit={handleCreateNoteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="EHR Integration Feedback"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Notes from call with CMIO..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
              >
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: ADD ACTIVITY */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddActivityModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Log Activity</h3>

            <form onSubmit={handleCreateActivitySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="Completed phone check-in"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Activity Description</label>
                <input
                  type="text"
                  value={newActDesc}
                  onChange={(e) => setNewActDesc(e.target.value)}
                  placeholder="Discussed pilot onboarding timeframe..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
              >
                Log Activity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
