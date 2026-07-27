import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Edit,
  Zap,
  Bot,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  LifeBuoy,
  FileCheck,
  Wrench,
  Share2,
  Copy,
  CheckCircle2,
  Sliders,
  HelpCircle,
  FilePlus,
  Link2,
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
  GeneratedCampaign,
  ServiceTicket,
  SalesQuote,
  MarketingSequence,
  DataHealthIssue,
} from "../types";
import {
  initialServiceTickets,
  initialSalesQuotes,
  initialMarketingSequences,
  initialDataHealthIssues,
} from "../data/mockData";
import { calculateLeadScoreAndStatus } from "../services/leadScoringEngine";

export interface NurtureSequenceInfo {
  isEnrolled: boolean;
  status: "active" | "completed" | "paused";
  statusLabel: string;
  sequenceName: string;
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  channel: "email" | "omnichannel" | "whatsapp" | "linkedin";
  lastActivityTime?: string;
  lastActivityDesc?: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  indicatorColor: string;
}

export function getContactNurtureStatus(
  contact: Contact,
  activeCampaign?: GeneratedCampaign,
  activities: CRMActivity[] = []
): NurtureSequenceInfo {
  const isChurned = contact.status === "churned";
  const hasPausedTag = contact.tags?.some(
    (t) =>
      t.toLowerCase().includes("paused") ||
      t.toLowerCase().includes("opt-out") ||
      t.toLowerCase().includes("unsubscribed")
  );

  if (isChurned || hasPausedTag) {
    return {
      isEnrolled: false,
      status: "paused",
      statusLabel: "Sequence Paused",
      sequenceName: activeCampaign?.name || "AI Sales Nurture Sequence",
      stepNumber: 0,
      totalSteps: 4,
      stepTitle: "Paused / Opted Out",
      channel: "email",
      badgeBg: "bg-slate-800/80",
      badgeBorder: "border-slate-700",
      badgeText: "text-slate-400",
      indicatorColor: "bg-slate-500",
    };
  }

  if (contact.status === "customer") {
    return {
      isEnrolled: true,
      status: "completed",
      statusLabel: "Sequence Completed",
      sequenceName: activeCampaign?.name || "Enterprise AI Nurture",
      stepNumber: 4,
      totalSteps: 4,
      stepTitle: "Converted & Onboarded",
      channel: "omnichannel",
      lastActivityTime: contact.lastContacted,
      lastActivityDesc: "Successfully converted to customer from AI sequence",
      badgeBg: "bg-emerald-500/20",
      badgeBorder: "border-emerald-500/30",
      badgeText: "text-emerald-300",
      indicatorColor: "bg-emerald-400",
    };
  }

  // Active nurture evaluation using timeline and Firestore activity logs
  const timeline = contact.timeline || [];
  const relatedActivities = activities.filter(
    (a) => a.relatedTo && a.relatedTo.toLowerCase().includes(contact.name.toLowerCase())
  );

  const totalInteractions = timeline.length + relatedActivities.length;
  const latestTimeline = timeline[0];
  const latestActivity = relatedActivities[0];

  let stepNumber = 1;
  let stepTitle = "Step 1: Campaign Pitch Sent";
  let channel: "email" | "omnichannel" | "whatsapp" | "linkedin" = "email";

  if (timeline.some((t) => t.type === "reply_received" || t.type === "meeting_booked")) {
    stepNumber = 3;
    stepTitle = "Step 3: High-Intent Response";
    channel = "omnichannel";
  } else if (timeline.some((t) => t.type === "link_clicked")) {
    stepNumber = 2;
    stepTitle = "Step 2: CTA Link Clicked";
    channel = "email";
  } else if (timeline.some((t) => t.type === "whatsapp_sent")) {
    stepNumber = 2;
    stepTitle = "Step 2: WhatsApp Touchpoint";
    channel = "whatsapp";
  } else if (timeline.some((t) => t.type === "email_opened")) {
    stepNumber = 1;
    stepTitle = "Step 1: Email Nurture Opened";
    channel = "email";
  } else if (totalInteractions > 0) {
    stepNumber = Math.min(3, 1 + totalInteractions);
    stepTitle = `Step ${stepNumber}: Active Campaign Sequence`;
  }

  const campaignTitle = activeCampaign?.name || "AI Sales Nurture Engine";

  return {
    isEnrolled: true,
    status: "active",
    statusLabel: "In Active AI Nurture",
    sequenceName: campaignTitle,
    stepNumber,
    totalSteps: 4,
    stepTitle,
    channel,
    lastActivityTime: latestTimeline?.date || latestActivity?.timestamp || contact.lastContacted,
    lastActivityDesc: latestTimeline?.description || latestActivity?.description || "In active automated drip sequence",
    badgeBg: "bg-cyan-500/20",
    badgeBorder: "border-cyan-500/40",
    badgeText: "text-cyan-300",
    indicatorColor: "bg-cyan-400",
  };
}

interface CRMViewProps {
  activeCampaign?: GeneratedCampaign;
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  meetings: Meeting[];
  documents: CRMDocument[];
  notes: CRMNote[];
  activities: CRMActivity[];
  onAddContact: (contact: Partial<Contact>) => void;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contactId: string) => void;
  onBulkImportContacts: (contacts: Contact[]) => void;
  onAddCompany: (company: Partial<Company>) => void;
  onEditCompany?: (company: Company) => void;
  onDeleteCompany?: (companyId: string) => void;
  onAddDeal: (deal: Partial<Deal>) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (dealId: string) => void;
  onUpdateDealStage: (dealId: string, stage: Deal["stage"]) => void;
  onAddTask: (task: Partial<Task>) => void;
  onToggleTask: (taskId: string) => void;
  onAddMeeting: (meeting: Meeting) => void;
  onAddDocument: (document: CRMDocument) => void;
  onAddNote: (note: CRMNote) => void;
  onAddActivity: (activity: CRMActivity) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  activeCampaign,
  contacts,
  companies,
  deals,
  tasks,
  meetings,
  documents,
  notes,
  activities,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onBulkImportContacts,
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
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
    | "tickets"
    | "quotes"
    | "sequences"
    | "datahealth"
    | "tasks"
    | "calendar"
    | "activities"
    | "meetings"
    | "notes"
    | "documents"
    | "leadscoring"
  >("dashboard");

  // HubSpot Hubs State
  const [tickets, setTickets] = useState<ServiceTicket[]>(initialServiceTickets);
  const [quotes, setQuotes] = useState<SalesQuote[]>(initialSalesQuotes);
  const [sequences, setSequences] = useState<MarketingSequence[]>(initialMarketingSequences);
  const [dataIssues, setDataIssues] = useState<DataHealthIssue[]>(initialDataHealthIssues);

  // New Ticket Modal State
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketContact, setNewTicketContact] = useState("Dr. Elena Rostova");
  const [newTicketCompany, setNewTicketCompany] = useState("Saint Jude Health System");
  const [newTicketPriority, setNewTicketPriority] = useState<"high" | "medium" | "low" | "urgent">("medium");
  const [newTicketCategory, setNewTicketCategory] = useState<"Technical" | "Billing" | "Onboarding" | "Feature Request" | "Bug">("Technical");

  // New Quote Modal State
  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [newQuoteDeal, setNewQuoteDeal] = useState("Enterprise Clinical AI Deployment");
  const [newQuoteCompany, setNewQuoteCompany] = useState("Saint Jude Health System");
  const [newQuoteContact, setNewQuoteContact] = useState("Dr. Elena Rostova");
  const [newQuoteAmount, setNewQuoteAmount] = useState(125000);

  // Scheduler Link Copy Status
  const [copiedSchedulerLink, setCopiedSchedulerLink] = useState(false);

  // Advanced Search & Filter State
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Dedicated Contacts Table Search & Filter State
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState<string>("all");
  const [contactCompanyFilter, setContactCompanyFilter] = useState<string>("all");
  const [contactScoreFilter, setContactScoreFilter] = useState<string>("all");
  const [contactNurtureFilter, setContactNurtureFilter] = useState<string>("all");
  const [selectedNurtureModalContact, setSelectedNurtureModalContact] = useState<Contact | null>(null);

  // Contact Selection & Export Notification State
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [exportNotification, setExportNotification] = useState<{
    message: string;
    count: number;
    filename: string;
  } | null>(null);

  const toggleSelectAllContacts = () => {
    if (selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map((c) => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleNurtureState = (contact: Contact) => {
    const isPaused = contact.tags?.some((t) => t.toLowerCase().includes("paused"));
    let newTags = [...(contact.tags || [])];

    if (isPaused) {
      newTags = newTags.filter((t) => !t.toLowerCase().includes("paused"));
    } else {
      newTags.push("Nurture Paused");
    }

    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: "status_change" as const,
      description: isPaused
        ? "Re-enrolled in active AI-driven nurture sequence."
        : "Paused from active AI-driven nurture sequence.",
    };

    const updatedContact: Contact = {
      ...contact,
      tags: newTags,
      timeline: [newTimelineItem, ...(contact.timeline || [])],
    };

    if (onEditContact) {
      onEditContact(updatedContact);
    }

    if (selectedNurtureModalContact?.id === contact.id) {
      setSelectedNurtureModalContact(updatedContact);
    }
  };

  // Background Lead Score & Status Engine State
  const [isAutoScoringActive, setIsAutoScoringActive] = useState(true);
  const [autoScoreStatusMessage, setAutoScoreStatusMessage] = useState<string | null>(null);
  const [selectedActivityContact, setSelectedActivityContact] = useState<Contact | null>(null);
  const [activityTypeToLog, setActivityTypeToLog] = useState<
    "email_opened" | "link_clicked" | "reply_received" | "meeting_booked" | "whatsapp_sent" | "inactivity_decay"
  >("reply_received");
  const [activityNotesToLog, setActivityNotesToLog] = useState("");
  const [lastAutoScoreRun, setLastAutoScoreRun] = useState<string>(new Date().toLocaleTimeString());

  // Background Function: Automatically calculates Lead Score and Status based on interaction activity
  const runBackgroundLeadScoringPass = React.useCallback(
    (manual = false) => {
      if (!isAutoScoringActive && !manual) return;
      let updatedCount = 0;

      contacts.forEach((contact) => {
        const calc = calculateLeadScoreAndStatus(contact);
        if (calc.scoreChanged || calc.statusChanged) {
          if (onEditContact) {
            onEditContact({
              ...contact,
              leadScore: calc.leadScore,
              scoreGrade: calc.scoreGrade,
              status: calc.status,
            });
            updatedCount++;
          }
        }
      });

      const now = new Date().toLocaleTimeString();
      setLastAutoScoreRun(now);

      if (manual || updatedCount > 0) {
        setAutoScoreStatusMessage(
          `⚡ Background Lead Score Engine: ${updatedCount > 0 ? `Updated ${updatedCount} contact records` : "All contact scores & statuses up to date"} (${now})`
        );
        setTimeout(() => setAutoScoreStatusMessage(null), 4500);
      }
    },
    [contacts, isAutoScoringActive, onEditContact]
  );

  React.useEffect(() => {
    // Initial pass after component mount
    const timer = setTimeout(() => {
      runBackgroundLeadScoringPass();
    }, 1200);

    // Background interval running every 20s
    const interval = setInterval(() => {
      runBackgroundLeadScoringPass();
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [runBackgroundLeadScoringPass]);

  // Handler for logging an activity & auto-scoring a contact
  const handleLogInteractionAndAutoScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityContact) return;

    let desc = activityNotesToLog.trim();
    if (!desc) {
      switch (activityTypeToLog) {
        case "reply_received":
          desc = "Prospect replied to email: Requesting custom enterprise proposal and timeline.";
          break;
        case "link_clicked":
          desc = "Prospect clicked pricing & live demo link in email campaign.";
          break;
        case "email_opened":
          desc = "Prospect opened automated nurture campaign email #2.";
          break;
        case "meeting_booked":
          desc = "Prospect booked 30-min discovery call via interactive calendar widget.";
          break;
        case "whatsapp_sent":
          desc = "Prospect responded to WhatsApp outreach message.";
          break;
        case "inactivity_decay":
          desc = "System applied >30 day inactivity decay penalty (-25 Lead Score).";
          break;
      }
    }

    const typeMapping: any = activityTypeToLog === "inactivity_decay" ? "status_change" : activityTypeToLog;

    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: typeMapping,
      description: desc,
    };

    const updatedTimeline = [newTimelineItem, ...(selectedActivityContact.timeline || [])];
    const tempContact: Contact = {
      ...selectedActivityContact,
      timeline: updatedTimeline,
      lastContacted: new Date().toISOString().split("T")[0],
    };

    const calc = calculateLeadScoreAndStatus(tempContact);

    const finalContact: Contact = {
      ...tempContact,
      leadScore: calc.leadScore,
      scoreGrade: calc.scoreGrade,
      status: calc.status,
    };

    if (onEditContact) {
      onEditContact(finalContact);
    }

    setAutoScoreStatusMessage(
      `⚡ Auto-Scored ${finalContact.name}: New Score ${finalContact.leadScore} (${finalContact.scoreGrade}) | Status: ${finalContact.status.toUpperCase()}`
    );
    setTimeout(() => setAutoScoreStatusMessage(null), 5000);

    setSelectedActivityContact(null);
    setActivityNotesToLog("");
  };

  // Modals
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showImportCsvModal, setShowImportCsvModal] = useState(false);

  // Deal progression notification toast state
  const [dealProgressToast, setDealProgressToast] = useState<{
    dealTitle: string;
    fromStage: string;
    toStage: string;
  } | null>(null);

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

  // Enhanced CSV Export Handler
  const handleExportCSV = (moduleName: string, customList?: any[]) => {
    let headers = "";
    let rows: string[] = [];
    let count = 0;
    let filename = `SalesFlow_CRM_${moduleName}_Export.csv`;

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    if (moduleName === "contacts") {
      let contactsToExport = customList;
      if (!contactsToExport || contactsToExport.length === 0) {
        if (selectedContactIds.length > 0) {
          contactsToExport = contacts.filter((c) => selectedContactIds.includes(c.id));
        } else if (filteredContacts.length > 0) {
          contactsToExport = filteredContacts;
        } else {
          contactsToExport = contacts;
        }
      }

      count = contactsToExport.length;
      filename = `SalesFlow_Contacts_Export_${new Date().toISOString().split("T")[0]}.csv`;

      headers = "ID,Full Name,First Name,Last Name,Email,Phone,Company,Job Title,Country,City,Lead Score,Score Grade,Status,Source,Owner,Tags,Last Contacted,Notes\n";

      rows = contactsToExport.map((c) => {
        const firstName = c.firstName || c.name.split(" ")[0] || "";
        const lastName = c.lastName || c.name.split(" ").slice(1).join(" ") || "";
        const tagsStr = Array.isArray(c.tags) ? c.tags.join("; ") : "";

        return [
          escapeCSV(c.id),
          escapeCSV(c.name),
          escapeCSV(firstName),
          escapeCSV(lastName),
          escapeCSV(c.email),
          escapeCSV(c.phone),
          escapeCSV(c.company),
          escapeCSV(c.role),
          escapeCSV(c.country || "United States"),
          escapeCSV(c.city || ""),
          c.leadScore,
          escapeCSV(c.scoreGrade),
          escapeCSV(c.status),
          escapeCSV(c.source || "SalesFlow CRM"),
          escapeCSV(c.owner || "Alex Rivers"),
          escapeCSV(tagsStr),
          escapeCSV(c.lastContacted),
          escapeCSV(c.notes || "")
        ].join(",");
      });
    } else if (moduleName === "companies") {
      const list = customList || companies;
      count = list.length;
      filename = `SalesFlow_Companies_Export_${new Date().toISOString().split("T")[0]}.csv`;
      headers = "ID,Name,Domain,Industry,Size,DealsCount,Revenue\n";
      rows = list.map((c) =>
        [
          escapeCSV(c.id),
          escapeCSV(c.name),
          escapeCSV(c.domain),
          escapeCSV(c.industry),
          escapeCSV(c.size),
          c.dealsCount,
          c.revenue,
        ].join(",")
      );
    } else if (moduleName === "deals") {
      const list = customList || deals;
      count = list.length;
      filename = `SalesFlow_Deals_Export_${new Date().toISOString().split("T")[0]}.csv`;
      headers = "ID,Title,CompanyName,ContactName,Value,Stage,Probability,ExpectedClose\n";
      rows = list.map((d) =>
        [
          escapeCSV(d.id),
          escapeCSV(d.title),
          escapeCSV(d.companyName),
          escapeCSV(d.contactName),
          d.value,
          escapeCSV(d.stage),
          d.probability,
          escapeCSV(d.expectedClose),
        ].join(",")
      );
    } else {
      const list = customList || tasks;
      count = list.length;
      filename = `SalesFlow_Tasks_Export_${new Date().toISOString().split("T")[0]}.csv`;
      headers = "ID,Title,DueDate,Priority,Completed,Assignee,RelatedTo\n";
      rows = list.map((t) =>
        [
          escapeCSV(t.id),
          escapeCSV(t.title),
          escapeCSV(t.dueDate),
          escapeCSV(t.priority),
          t.completed,
          escapeCSV(t.assignee),
          escapeCSV(t.relatedTo),
        ].join(",")
      );
    }

    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show toast notification
    setExportNotification({
      message: `Exported ${count} record${count === 1 ? "" : "s"} to ${filename}`,
      count,
      filename,
    });
    setTimeout(() => setExportNotification(null), 4500);
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
  const uniqueCompanies = Array.from(new Set(contacts.map((c) => c.company))).filter(Boolean);

  const filteredContacts = contacts.filter((c) => {
    const query = (contactSearchQuery || globalSearch).toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.company.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.status.toLowerCase().includes(query);

    const matchesStatus =
      contactStatusFilter === "all" ||
      c.status.toLowerCase() === contactStatusFilter.toLowerCase();

    const matchesCompany =
      contactCompanyFilter === "all" ||
      c.company.toLowerCase() === contactCompanyFilter.toLowerCase();

    const matchesTag =
      selectedTagFilter === "all" ||
      c.tags.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase());

    const matchesScore =
      contactScoreFilter !== "all"
        ? (contactScoreFilter === "hot" && c.scoreGrade === "Hot") ||
          (contactScoreFilter === "warm" && c.scoreGrade === "Warm") ||
          (contactScoreFilter === "cold" && c.scoreGrade === "Cold")
        : selectedScoreFilter === "all" ||
          (selectedScoreFilter === "hot" && c.scoreGrade === "Hot") ||
          (selectedScoreFilter === "warm" && c.scoreGrade === "Warm") ||
          (selectedScoreFilter === "cold" && c.scoreGrade === "Cold");

    const nurtureInfo = getContactNurtureStatus(c, activeCampaign, activities);
    const matchesNurture =
      contactNurtureFilter === "all" ||
      (contactNurtureFilter === "active" && nurtureInfo.status === "active") ||
      (contactNurtureFilter === "completed" && nurtureInfo.status === "completed") ||
      (contactNurtureFilter === "paused" && nurtureInfo.status === "paused");

    return matchesSearch && matchesStatus && matchesCompany && matchesTag && matchesScore && matchesNurture;
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
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Real-Time Sync Active</span>
            </div>
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
          <button
            onClick={() => runBackgroundLeadScoringPass(true)}
            className="px-3 py-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            title="Force background recalculation of all contacts' Lead Score and Status based on database activity & email responsiveness"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400 animate-pulse" />
            <span>Auto-Score All DB Contacts</span>
          </button>

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

      {/* BACKGROUND LEAD SCORING LIVE NOTIFICATION TOAST */}
      {autoScoreStatusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{autoScoreStatusMessage}</span>
          </div>
          <span className="text-[10px] text-amber-400/70 font-mono">
            DB Sync Active • Last run: {lastAutoScoreRun}
          </span>
        </motion.div>
      )}

      {/* ALL HUBSPOT CRM NAVIGATION MODULE TABS */}
      <div className="flex flex-nowrap overflow-x-auto gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 scrollbar-none backdrop-blur-xl">
        {[
          { id: "dashboard", label: "CRM Overview", count: "Live", icon: TrendingUp },
          { id: "contacts", label: "Contacts", count: contacts.length, icon: Users },
          { id: "companies", label: "Companies", count: companies.length, icon: Building2 },
          { id: "deals", label: "Deals", count: deals.length, icon: DollarSign },
          { id: "pipelines", label: "Pipeline Kanban", count: "Board", icon: Layers },
          { id: "tickets", label: "Service Hub", count: tickets.length, icon: LifeBuoy },
          { id: "quotes", label: "Sales Quotes", count: quotes.length, icon: FileCheck },
          { id: "sequences", label: "Marketing Drips", count: sequences.length, icon: Send },
          { id: "datahealth", label: "Operations Hub", count: dataIssues.length, icon: ShieldCheck },
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

      {/* ANIMATED DEAL PROGRESSION TOAST OVERLAY */}
      <AnimatePresence>
        {exportNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-2 border-cyan-400 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shrink-0">
              <Download className="w-5 h-5 text-slate-950" />
            </div>
            <div className="text-xs min-w-0">
              <p className="font-extrabold text-white text-sm flex items-center gap-1.5">
                <span>CSV Export Ready</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {exportNotification.count} record{exportNotification.count === 1 ? "" : "s"}
                </span>
              </p>
              <p className="text-cyan-200 text-[11px] font-mono mt-0.5 truncate">
                {exportNotification.filename}
              </p>
            </div>
            <button
              onClick={() => setExportNotification(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {dealProgressToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-900 to-slate-900 border-2 border-emerald-400 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shrink-0">
              🚀
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-white text-sm flex items-center gap-1">
                Deal Progressed!
              </p>
              <p className="text-emerald-200 font-semibold mt-0.5">{dealProgressToast.dealTitle}</p>
              <p className="text-slate-300 text-[10px] mt-0.5">
                Advanced from <span className="text-amber-300">{dealProgressToast.fromStage}</span> → <span className="text-emerald-300 font-bold">{dealProgressToast.toStage}</span>
              </p>
            </div>
            <button
              onClick={() => setDealProgressToast(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

          {/* INTERACTIVE VISUAL SALES PIPELINE FUNNEL */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-extrabold text-white">Interactive Visual Sales Pipeline Funnel</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Displays stage conversion rates and enables instant deal progression triggers
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <span>Overall Win Conversion:</span>
                <span className="text-white font-extrabold">
                  {deals.length > 0
                    ? ((deals.filter((d) => d.stage === "closed_won").length / deals.length) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>

            {/* Funnel Visualizer Rows */}
            <div className="space-y-3">
              {[
                { id: "lead", label: "1. Lead Identified", color: "from-slate-800 to-indigo-900", border: "border-indigo-500/30", nextId: "contacted" },
                { id: "contacted", label: "2. Contacted", color: "from-indigo-900 to-indigo-800", border: "border-indigo-500/40", nextId: "meeting" },
                { id: "meeting", label: "3. Meeting Scheduled", color: "from-indigo-800 to-violet-900", border: "border-violet-500/40", nextId: "proposal" },
                { id: "proposal", label: "4. Proposal Sent", color: "from-violet-900 to-cyan-900", border: "border-cyan-500/40", nextId: "closed_won" },
                { id: "closed_won", label: "5. Closed Won", color: "from-emerald-900 to-emerald-800", border: "border-emerald-500/50", nextId: null },
              ].map((stageItem, index, arr) => {
                const stageDeals = deals.filter((d) => d.stage === stageItem.id);
                const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                const nextStageDeals = stageItem.nextId ? deals.filter((d) => d.stage === stageItem.nextId) : [];
                const conversionRate = stageItem.nextId
                  ? stageDeals.length > 0
                    ? Math.round((nextStageDeals.length / stageDeals.length) * 100)
                    : 0
                  : 100;

                const widthPct = Math.max(40, 100 - index * 12);

                return (
                  <div key={stageItem.id} className="space-y-1">
                    <div className="mx-auto transition-all" style={{ width: `${widthPct}%` }}>
                      <div
                        className={`p-3.5 rounded-2xl bg-gradient-to-r ${stageItem.color} border ${stageItem.border} shadow-lg flex items-center justify-between gap-3 text-xs`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{stageItem.label}</span>
                          <span className="px-2 py-0.5 rounded-full bg-black/40 text-slate-300 font-mono text-[11px]">
                            {stageDeals.length} {stageDeals.length === 1 ? "Deal" : "Deals"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-emerald-300 text-sm">
                            ${stageValue.toLocaleString()}
                          </span>

                          {stageItem.nextId && stageDeals.length > 0 && (
                            <button
                              onClick={() => {
                                const dealToAdvance = stageDeals[0];
                                if (dealToAdvance && stageItem.nextId) {
                                  onUpdateDealStage(dealToAdvance.id, stageItem.nextId as any);
                                  setDealProgressToast({
                                    dealTitle: dealToAdvance.title,
                                    fromStage: stageItem.label,
                                    toStage: arr[index + 1].label,
                                  });
                                  setTimeout(() => setDealProgressToast(null), 4000);
                                }
                              }}
                              className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
                            >
                              <Zap className="w-3 h-3 text-emerald-400" />
                              <span>Advance Deal →</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {stageItem.nextId && (
                      <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 my-0.5">
                        <span>Conversion to next stage:</span>
                        <span className={`font-mono font-bold ${conversionRate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
                          {conversionRate}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
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
          {/* REAL-TIME CONTACT SEARCH & FILTER BAR */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search input with instant clear button */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactSearchQuery}
                  onChange={(e) => setContactSearchQuery(e.target.value)}
                  placeholder="Search leads by name, company, or status..."
                  className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                />
                {contactSearchQuery && (
                  <button
                    onClick={() => setContactSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded-full cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-2xl text-xs">
                  <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-400 text-[11px] font-medium shrink-0">Status:</span>
                  <select
                    value={contactStatusFilter}
                    onChange={(e) => setContactStatusFilter(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="all" className="bg-slate-900 text-slate-200">All Statuses</option>
                    <option value="lead" className="bg-slate-900 text-slate-200">🎯 Lead</option>
                    <option value="contacted" className="bg-slate-900 text-slate-200">💬 Contacted</option>
                    <option value="customer" className="bg-slate-900 text-slate-200">🤝 Customer</option>
                    <option value="churned" className="bg-slate-900 text-slate-200">⚠️ Churned</option>
                  </select>
                </div>

                {/* Company Filter */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-2xl text-xs">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-400 text-[11px] font-medium shrink-0">Company:</span>
                  <select
                    value={contactCompanyFilter}
                    onChange={(e) => setContactCompanyFilter(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs max-w-[140px] truncate"
                  >
                    <option value="all" className="bg-slate-900 text-slate-200">All Companies</option>
                    {uniqueCompanies.map((comp) => (
                      <option key={comp} value={comp} className="bg-slate-900 text-slate-200">
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead Grade Filter */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-2xl text-xs">
                  <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="text-slate-400 text-[11px] font-medium shrink-0">Grade:</span>
                  <select
                    value={contactScoreFilter}
                    onChange={(e) => setContactScoreFilter(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="all" className="bg-slate-900 text-slate-200">All Grades</option>
                    <option value="hot" className="bg-slate-900 text-slate-200">🔥 Hot</option>
                    <option value="warm" className="bg-slate-900 text-slate-200">⚡ Warm</option>
                    <option value="cold" className="bg-slate-900 text-slate-200">❄️ Cold</option>
                  </select>
                </div>

                {/* AI Nurture Sequence Filter */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-2xl text-xs">
                  <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 text-[11px] font-medium shrink-0">Nurture:</span>
                  <select
                    value={contactNurtureFilter}
                    onChange={(e) => setContactNurtureFilter(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="all" className="bg-slate-900 text-slate-200">All Nurture States</option>
                    <option value="active" className="bg-slate-900 text-cyan-300">⚡ Active AI Nurture</option>
                    <option value="completed" className="bg-slate-900 text-emerald-300">✓ Converted / Completed</option>
                    <option value="paused" className="bg-slate-900 text-slate-400">⏸️ Paused / Opted Out</option>
                  </select>
                </div>

                {/* Reset Filters button */}
                {(contactSearchQuery ||
                  contactStatusFilter !== "all" ||
                  contactCompanyFilter !== "all" ||
                  contactScoreFilter !== "all" ||
                  contactNurtureFilter !== "all" ||
                  globalSearch) && (
                  <button
                    onClick={() => {
                      setContactSearchQuery("");
                      setContactStatusFilter("all");
                      setContactCompanyFilter("all");
                      setContactScoreFilter("all");
                      setContactNurtureFilter("all");
                      setGlobalSearch("");
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-2xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Status Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Quick Filter:</span>
              {[
                { id: "all", label: "All Leads", count: contacts.length },
                { id: "lead", label: "🎯 Leads", count: contacts.filter((c) => c.status === "lead").length },
                { id: "contacted", label: "💬 Contacted", count: contacts.filter((c) => c.status === "contacted").length },
                { id: "customer", label: "🤝 Customers", count: contacts.filter((c) => c.status === "customer").length },
                { id: "churned", label: "⚠️ Churned", count: contacts.filter((c) => c.status === "churned").length },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setContactStatusFilter(pill.id)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-[11px] ${
                    contactStatusFilter === pill.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-900/80 text-slate-300">
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CONTACTS TABLE CONTAINER */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span>Displaying {filteredContacts.length} of {contacts.length} Contacts</span>
                  {(contactSearchQuery || contactStatusFilter !== "all" || contactCompanyFilter !== "all" || contactScoreFilter !== "all") && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Filtered
                    </span>
                  )}
                </span>

                {selectedContactIds.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 animate-pulse">
                    <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedContactIds.length} Selected</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedContactIds.length > 0 ? (
                  <>
                    <button
                      onClick={() => handleExportCSV("contacts")}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer"
                      title="Export selected contacts to CSV format"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Selected ({selectedContactIds.length}) CSV</span>
                    </button>
                    <button
                      onClick={() => setSelectedContactIds([])}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowAddContactModal(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-950 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Contact</span>
                    </button>
                    <button
                      onClick={() => handleExportCSV("contacts")}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 flex items-center gap-1 border border-slate-700 cursor-pointer transition-all"
                      title="Export current contacts list to CSV format for external CRM interoperability"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Export Contacts CSV</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">No contacts match your filter criteria</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search term or adjusting status and company filters.
                </p>
                <button
                  onClick={() => {
                    setContactSearchQuery("");
                    setContactStatusFilter("all");
                    setContactCompanyFilter("all");
                    setContactScoreFilter("all");
                    setGlobalSearch("");
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer mt-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            filteredContacts.length > 0 &&
                            selectedContactIds.length === filteredContacts.length
                          }
                          onChange={toggleSelectAllContacts}
                          className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer w-4 h-4 accent-cyan-500"
                          title="Select / Deselect All Contacts"
                        />
                      </th>
                      <th className="p-4">Contact Name & Email</th>
                      <th className="p-4">Company & Title</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Lead Score</th>
                      <th className="p-4">AI Nurture Sequence</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Last Contacted</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {filteredContacts.map((c) => (
                      <tr
                        key={c.id}
                        className={`transition-colors ${
                          selectedContactIds.includes(c.id)
                            ? "bg-cyan-950/30 hover:bg-cyan-950/40"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="p-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedContactIds.includes(c.id)}
                            onChange={() => toggleSelectContact(c.id)}
                            className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer w-4 h-4 accent-cyan-500"
                          />
                        </td>
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
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border capitalize ${
                              c.status === "lead"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : c.status === "contacted"
                                ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                                : c.status === "customer"
                                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                                : "bg-slate-700/50 text-slate-300 border-slate-600"
                            }`}
                          >
                            {c.status === "lead"
                              ? "🎯 Lead"
                              : c.status === "contacted"
                              ? "💬 Contacted"
                              : c.status === "customer"
                              ? "🤝 Customer"
                              : "⚠️ Churned"}
                          </span>
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
                        <td className="p-4">
                          {(() => {
                            const nurture = getContactNurtureStatus(c, activeCampaign, activities);
                            return (
                              <div className="flex flex-col gap-1.5">
                                <button
                                  onClick={() => setSelectedNurtureModalContact(c)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${nurture.badgeBg} ${nurture.badgeBorder} ${nurture.badgeText} flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer w-fit shadow-md`}
                                  title={`Click to view AI Nurture Sequence audit for ${c.name}`}
                                >
                                  {nurture.status === "active" ? (
                                    <span className="relative flex h-2 w-2 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                    </span>
                                  ) : nurture.status === "completed" ? (
                                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Pause className="w-3 h-3 text-slate-500 shrink-0" />
                                  )}

                                  <span className="font-black uppercase tracking-wider">
                                    {nurture.status === "active"
                                      ? `⚡ Active • Step ${nurture.stepNumber}`
                                      : nurture.status === "completed"
                                      ? "✓ Converted"
                                      : "⏸️ Paused"}
                                  </span>
                                </button>

                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                  <Bot className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span className="truncate max-w-[150px]" title={nurture.stepTitle}>
                                    {nurture.stepTitle}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
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
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedActivityContact(c);
                                setActivityTypeToLog("reply_received");
                                setActivityNotesToLog("");
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                              title="Log email response or interaction activity to auto-update Lead Score and Status in database"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span>Auto-Score</span>
                            </button>
                            <button
                              onClick={() => setSelectedContact(c)}
                              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Timeline
                            </button>
                            <button
                              onClick={() => setEditingContact(c)}
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                              title="Edit Contact"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleExportCSV("contacts", [c])}
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all cursor-pointer"
                              title={`Export ${c.name} to CSV`}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteContact && onDeleteContact(c.id)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                              title="Delete Contact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                  <span>{comp.dealsCount} Deals Associated • <span className="text-emerald-400 font-extrabold">${comp.revenue.toLocaleString()}</span></span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingCompany(comp)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                      title="Edit Company"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCompany && onDeleteCompany(comp.id)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                      title="Delete Company"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                  <th className="p-4 text-right">Actions</th>
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
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingDeal(d)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                          title="Edit Deal"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDeal && onDeleteDeal(d.id)}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                          title="Delete Deal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
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
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-mono mr-1">{dl.probability}% Win</span>
                            <button
                              onClick={() => setEditingDeal(dl)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                              title="Edit Deal"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteDeal && onDeleteDeal(dl.id)}
                              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                              title="Delete Deal"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
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

      {/* HUBSPOT MODULE A: SERVICE HUB (HELPDESK TICKETS) */}
      {activeModule === "tickets" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Service Hub • Helpdesk & Customer Tickets</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SLA Monitor Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage incoming customer support inquiries, SLA deadlines, ticket routing, and satisfaction ratings.
                </p>
              </div>

              <button
                onClick={() => setShowAddTicketModal(true)}
                className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-950 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Service Ticket</span>
              </button>
            </div>

            {/* Service Hub Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Open Tickets</p>
                <p className="text-xl font-extrabold text-amber-400 mt-0.5">
                  {tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">SLA Compliance Rate</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">98.4%</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg First Response</p>
                <p className="text-xl font-extrabold text-cyan-400 mt-0.5">8.2 Mins</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">CSAT Score</p>
                <p className="text-xl font-extrabold text-indigo-400 mt-0.5">4.9 / 5.0 ⭐</p>
              </div>
            </div>
          </div>

          {/* Tickets Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-xl hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{t.ticketNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          t.priority === "urgent"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : t.priority === "high"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-semibold">
                        {t.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      t.status === "resolved" || t.status === "closed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : t.status === "in_progress"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </div>

                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-300">{t.contactName} ({t.company})</span>
                    <span className="text-[10px] text-slate-500">{t.createdAt}</span>
                  </div>
                  {t.description && <p className="text-[11px] text-slate-400 line-clamp-2">{t.description}</p>}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>SLA: <strong className="text-amber-300">{t.slaDeadline}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status !== "resolved" && (
                      <button
                        onClick={() => {
                          setTickets(
                            tickets.map((item) =>
                              item.id === t.id
                                ? { ...item, status: "resolved", slaDeadline: "Resolved in SLA" }
                                : item
                            )
                          );
                        }}
                        className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Resolve Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HUBSPOT MODULE B: SALES HUB (QUOTES & MEETING LINK SCHEDULER) */}
      {activeModule === "quotes" && (
        <div className="space-y-6">
          {/* MEETING SCHEDULER LINK BOX */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">HubSpot-Style Sales Meeting Scheduling Link</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Live Booking Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Send your personalized meeting scheduling link to contacts for instant 1-click Google Calendar / Outlook booking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://salesflow.ai/book/alex-rivers");
                    setCopiedSchedulerLink(true);
                    setTimeout(() => setCopiedSchedulerLink(false), 3000);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950 cursor-pointer shrink-0"
                >
                  {copiedSchedulerLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSchedulerLink ? "Link Copied!" : "Copy Booking Link"}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300 flex items-center justify-between">
              <span>https://salesflow.ai/book/alex-rivers</span>
              <span className="text-[10px] text-slate-500 font-sans">Synced with Outlook & Google Calendar</span>
            </div>
          </div>

          {/* QUOTES & PROPOSALS HEADER */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Sales Hub • Quotes, Invoices & E-Signatures</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Draft itemized sales quotes, send executable proposals, and track signature statuses.
                </p>
              </div>

              <button
                onClick={() => setShowAddQuoteModal(true)}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Sales Quote</span>
              </button>
            </div>

            {/* Quotes Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quotes.map((q) => (
                <div key={q.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">{q.quoteNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        q.status === "accepted"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{q.dealTitle}</h4>
                    <p className="text-xs text-slate-400">{q.companyName} • {q.contactName}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800/80 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Itemized Line Items</p>
                    {q.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-slate-200">
                        <span className="truncate pr-2">{item.name}</span>
                        <span className="font-bold shrink-0">${item.unitPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-500">Total Value ({q.paymentTerms})</p>
                      <p className="text-lg font-extrabold text-emerald-400">${q.totalAmount.toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => {
                        setExportNotification({
                          message: `Quote PDF Generated & Emailed to ${q.contactName}`,
                          count: 1,
                          filename: `${q.quoteNumber}_Proposal.pdf`,
                        });
                        setTimeout(() => setExportNotification(null), 4500);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PDF Quote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HUBSPOT MODULE C: MARKETING HUB (AUTOMATED SEQUENCES) */}
      {activeModule === "sequences" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Marketing Hub • Automated Outreach Sequences</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Multi-step email drips, automated follow-ups, and segment nurture workflows.
                </p>
              </div>

              <button
                onClick={() => {
                  const newSeq: MarketingSequence = {
                    id: `seq-${Date.now()}`,
                    name: `Q3 Enterprise Healthcare Campaign`,
                    type: `Email Drip`,
                    targetSegment: `CMIOs & IT Directors`,
                    totalSteps: 4,
                    enrolledContacts: 350,
                    openRate: 68.5,
                    clickRate: 31.2,
                    conversionRate: 15.0,
                    status: `active`,
                    createdAt: `Today`,
                  };
                  setSequences([newSeq, ...sequences]);
                }}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Sequence</span>
              </button>
            </div>

            {/* Sequence Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sequences.map((seq) => (
                <div key={seq.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {seq.type}
                    </span>
                    <button
                      onClick={() =>
                        setSequences(
                          sequences.map((s) =>
                            s.id === seq.id
                              ? { ...s, status: s.status === "active" ? "paused" : "active" }
                              : s
                          )
                        )
                      }
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        seq.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {seq.status}
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-base">{seq.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Target: {seq.targetSegment}</p>
                  </div>

                  {/* Flow Steps Preview */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Automated Sequence Flow ({seq.totalSteps} Steps)</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                      <span>Day 1: Cold Intro</span> → <span>Day 3: Demo Pitch</span> → <span>Day 5: Followup</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div className="p-2 bg-slate-900 rounded-xl">
                      <p className="text-[10px] text-slate-400">Enrolled</p>
                      <p className="text-sm font-extrabold text-white">{seq.enrolledContacts}</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl">
                      <p className="text-[10px] text-slate-400">Open Rate</p>
                      <p className="text-sm font-extrabold text-emerald-400">{seq.openRate}%</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl">
                      <p className="text-[10px] text-slate-400">Clicks</p>
                      <p className="text-sm font-extrabold text-cyan-400">{seq.clickRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HUBSPOT MODULE D: OPERATIONS HUB (DATA HEALTH & CLEANSE ENGINE) */}
      {activeModule === "datahealth" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Operations Hub • Data Health & Deduplication Engine</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    94% Clean Rating
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Automated CRM health audit detecting duplicate contact records, missing phone numbers, and stale leads.
                </p>
              </div>

              <button
                onClick={() => {
                  setDataIssues([]);
                  setExportNotification({
                    message: "Operations Hub: Successfully merged 1 duplicate contact & enriched missing fields!",
                    count: 4,
                    filename: "Data_Quality_Cleanse_Report.pdf",
                  });
                  setTimeout(() => setExportNotification(null), 4500);
                }}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Auto-Fix All CRM Data Issues</span>
              </button>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              {dataIssues.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">All Data Quality Issues Resolved!</h4>
                  <p className="text-xs text-slate-400">Your CRM database is 100% deduplicated and formatted cleanly.</p>
                </div>
              ) : (
                dataIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            issue.severity === "high"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {issue.severity} Severity
                        </span>
                        <span className="text-xs font-bold text-white">{issue.affectedRecord}</span>
                      </div>
                      <p className="text-xs text-slate-300">{issue.description}</p>
                      <p className="text-[11px] text-emerald-400 font-mono">Suggested: {issue.suggestedAction}</p>
                    </div>

                    <button
                      onClick={() => setDataIssues(dataIssues.filter((i) => i.id !== issue.id))}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      Apply Auto-Fix
                    </button>
                  </div>
                ))
              )}
            </div>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Predictive Lead Scoring & Status Automation Engine</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time DB Sync</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated background calculation updating Lead Score & Status based on interaction activity and email responsiveness
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoScoringActive(!isAutoScoringActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAutoScoringActive
                    ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isAutoScoringActive ? "text-emerald-400 fill-emerald-400" : ""}`} />
                <span>Engine: {isAutoScoringActive ? "ACTIVE" : "PAUSED"}</span>
              </button>

              <button
                onClick={() => runBackgroundLeadScoringPass(true)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Full DB Recalculation Pass</span>
              </button>
            </div>
          </div>

          {/* Real-time Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>🔥 Hot Leads (Score ≥ 80)</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-rose-400">
                {contacts.filter((c) => c.leadScore >= 80).length}
              </p>
              <p className="text-[10px] text-slate-500">Auto-prioritized for immediate high-intent close</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>⚡ Warm Prospects (50-79)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">
                {contacts.filter((c) => c.leadScore >= 50 && c.leadScore < 80).length}
              </p>
              <p className="text-[10px] text-slate-500">Engaged with active email clicks & opens</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>🎯 Converted Customers</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400">
                {contacts.filter((c) => c.status === "customer").length}
              </p>
              <p className="text-[10px] text-slate-500">Auto-transitioned from email replies & meetings</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>❄️ Cold / At-Risk (&lt; 50)</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-blue-400">
                {contacts.filter((c) => c.leadScore < 50).length}
              </p>
              <p className="text-[10px] text-slate-500">Subject to inactivity decay after 14-30 days</p>
            </div>
          </div>

          {/* Scoring Rules Breakdown Matrix */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Automated Background Lead Scoring & Status Rules Engine</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-emerald-400">+25 Pts • Email Reply</p>
                <p className="text-[11px] text-slate-400">Direct prospect email responsiveness</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-indigo-400">+30 Pts • Meeting Booked</p>
                <p className="text-[11px] text-slate-400">Discovery call scheduled via calendar</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-amber-400">+15 Pts • Link Clicked</p>
                <p className="text-[11px] text-slate-400">Prospect clicked email proposal link</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-blue-400">+10 Pts • Email Opened</p>
                <p className="text-[11px] text-slate-400">Opened campaign nurture sequence</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-purple-400">+12 Pts • High Recency</p>
                <p className="text-[11px] text-slate-400">Interaction within past 3 days</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-rose-400">-25 Pts • Inactivity Decay</p>
                <p className="text-[11px] text-slate-400">No activity logged over 30 days</p>
              </div>
            </div>
          </div>

          {/* High Score Queue & Quick Interaction Tester */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Real-Time Contact Lead Score & Status Feed ({contacts.length} Contacts)
              </h4>
              <span className="text-[11px] text-slate-400">
                Click <span className="text-amber-400 font-bold">Auto-Score</span> on any contact to log email activity & update DB
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((lead) => {
                const calc = calculateLeadScoreAndStatus(lead);
                return (
                  <div key={lead.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{lead.name}</h5>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              lead.status === "customer"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : lead.status === "contacted"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : lead.status === "churned"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}
                          >
                            Status: {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{lead.role} at {lead.company}</p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-xs font-black px-2.5 py-1 rounded-xl border ${
                            lead.scoreGrade === "Hot"
                              ? "text-rose-300 bg-rose-500/20 border-rose-500/30"
                              : lead.scoreGrade === "Warm"
                              ? "text-amber-300 bg-amber-500/20 border-amber-500/30"
                              : "text-blue-300 bg-blue-500/20 border-blue-500/30"
                          }`}
                        >
                          🔥 {lead.leadScore} ({lead.scoreGrade})
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          Timeline: {lead.timeline?.length || 0} events
                        </p>
                      </div>
                    </div>

                    {/* Breakdown Preview */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <p className="font-bold text-slate-300">Automated Scoring Factors:</p>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {calc.breakdown.slice(0, 3).map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {b.event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setSelectedActivityContact(lead);
                          setActivityTypeToLog("reply_received");
                          setActivityNotesToLog("");
                        }}
                        className="flex-1 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Log Interaction & Auto-Score</span>
                      </button>

                      <button
                        onClick={() => setSelectedContact(lead)}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Detail Audit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT TIMELINE DRAWER */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-end p-4">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full rounded-3xl p-6 relative overflow-y-auto shadow-2xl space-y-6">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => handleExportCSV("contacts", [selectedContact])}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title={`Export ${selectedContact.name} to CSV`}
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Contact Profile
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{selectedContact.name}</h2>
              <p className="text-xs text-slate-400">{selectedContact.role} at {selectedContact.company}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-200 font-mono">{selectedContact.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200 font-mono">{selectedContact.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status Tier:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedContact.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lead Score:</span>
                <span className="text-rose-400 font-bold">{selectedContact.leadScore} ({selectedContact.scoreGrade})</span>
              </div>
            </div>

            {/* AUTOMATED LEAD SCORING BREAKDOWN */}
            {(() => {
              const calc = calculateLeadScoreAndStatus(selectedContact);
              return (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Automated Score Breakdown</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      Base: +50
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {calc.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px]"
                      >
                        <span className="text-slate-300">{item.event}</span>
                        <span
                          className={`font-mono font-bold ${
                            item.points > 0 ? "text-emerald-400" : item.points < 0 ? "text-rose-400" : "text-slate-400"
                          }`}
                        >
                          {item.points > 0 ? `+${item.points}` : item.points}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedActivityContact(selectedContact);
                      setSelectedContact(null);
                    }}
                    className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Log Email Interaction & Auto-Score</span>
                  </button>
                </div>
              );
            })()}

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

      {/* EDIT CONTACT MODAL */}
      {editingContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setEditingContact(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Edit Contact</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onEditContact && editingContact) {
                  onEditContact(editingContact);
                }
                setEditingContact(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Company</label>
                <input
                  type="text"
                  value={editingContact.company || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, company: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Role / Job Title</label>
                <input
                  type="text"
                  value={editingContact.role || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingContact.phone || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
              >
                Save Contact Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMPANY MODAL */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setEditingCompany(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Edit Company</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onEditCompany && editingCompany) {
                  onEditCompany(editingCompany);
                }
                setEditingCompany(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Industry</label>
                <input
                  type="text"
                  value={editingCompany.industry || ""}
                  onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Domain / Website</label>
                <input
                  type="text"
                  value={editingCompany.domain || ""}
                  onChange={(e) => setEditingCompany({ ...editingCompany, domain: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Annual Revenue ($)</label>
                <input
                  type="number"
                  value={editingCompany.revenue || 0}
                  onChange={(e) => setEditingCompany({ ...editingCompany, revenue: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
              >
                Save Company Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DEAL MODAL */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setEditingDeal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Edit Deal</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onEditDeal && editingDeal) {
                  onEditDeal(editingDeal);
                }
                setEditingDeal(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={editingDeal.title}
                  onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Value ($)</label>
                <input
                  type="number"
                  required
                  value={editingDeal.value}
                  onChange={(e) => setEditingDeal({ ...editingDeal, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pipeline Stage</label>
                <select
                  value={editingDeal.stage}
                  onChange={(e) => setEditingDeal({ ...editingDeal, stage: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                >
                  <option value="lead">Lead Identified</option>
                  <option value="contacted">Contacted</option>
                  <option value="meeting">Meeting Scheduled</option>
                  <option value="proposal">Proposal Sent</option>
                  <option value="closed_won">Closed Won</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Win Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingDeal.probability}
                  onChange={(e) => setEditingDeal({ ...editingDeal, probability: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
              >
                Save Deal Changes
              </button>
            </form>
          </div>
        </div>
      )}
      {/* LOG INTERACTION ACTIVITY & AUTO-SCORE MODAL */}
      {selectedActivityContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedActivityContact(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Interaction & Auto-Score Lead</h3>
                <p className="text-xs text-slate-400">
                  Record email response or activity to auto-update Lead Score & Status in database
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{selectedActivityContact.name}</p>
                <p className="text-slate-400 text-[11px]">{selectedActivityContact.role} at {selectedActivityContact.company}</p>
              </div>
              <div className="text-right">
                <span className="text-rose-400 font-extrabold">
                  Score: {selectedActivityContact.leadScore} ({selectedActivityContact.scoreGrade})
                </span>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Status: {selectedActivityContact.status}</p>
              </div>
            </div>

            <form onSubmit={handleLogInteractionAndAutoScore} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Interaction / Activity Event Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "reply_received", label: "📩 Email Reply Received", points: "+25 Pts" },
                    { id: "meeting_booked", label: "📅 Demo Meeting Booked", points: "+30 Pts" },
                    { id: "link_clicked", label: "🎯 Email Link Clicked", points: "+15 Pts" },
                    { id: "email_opened", label: "👁️ Email Campaign Opened", points: "+10 Pts" },
                    { id: "whatsapp_sent", label: "💬 WhatsApp Message", points: "+5 Pts" },
                    { id: "inactivity_decay", label: "❄️ >30 Day Inactivity Penalty", points: "-25 Pts" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setActivityTypeToLog(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activityTypeToLog === opt.id
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-[11px]">{opt.label}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400">{opt.points}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Custom Activity Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={activityNotesToLog}
                  onChange={(e) => setActivityNotesToLog(e.target.value)}
                  placeholder="e.g., Prospect confirmed budget approval and requested contract..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Automated Database Calculation Preview:</span>
                </p>
                <p>
                  Submitting this interaction will automatically re-compute the lead's engagement score, recalculate recency bonus, update grade (Hot/Warm/Cold), auto-transition status (e.g., to <span className="text-emerald-400 font-bold">Contacted</span> or <span className="text-emerald-400 font-bold">Customer</span>), and save instantly to Firestore!
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Save Activity & Auto-Update Score & Status</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI NURTURE SEQUENCE AUDIT & CONTROL MODAL */}
      {selectedNurtureModalContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          {(() => {
            const nurture = getContactNurtureStatus(selectedNurtureModalContact, activeCampaign, activities);
            const isPaused = selectedNurtureModalContact.tags?.some((t) => t.toLowerCase().includes("paused"));

            return (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-5">
                <button
                  onClick={() => setSelectedNurtureModalContact(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <Bot className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI-Driven Nurture Sequence</h3>
                    <p className="text-xs text-slate-400">
                      Real-time campaign status & Firestore interaction tracking
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <p className="font-bold text-white text-sm">{selectedNurtureModalContact.name}</p>
                      <p className="text-slate-400 text-[11px]">{selectedNurtureModalContact.role} at {selectedNurtureModalContact.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${nurture.badgeBg} ${nurture.badgeBorder} ${nurture.badgeText} uppercase inline-block`}>
                        {nurture.status === "active" ? "⚡ Active Sequence" : nurture.status === "completed" ? "✓ Converted" : "⏸️ Paused"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Active Campaign:</span>
                      <span className="text-slate-200 font-semibold">{nurture.sequenceName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sequence Channel:</span>
                      <span className="text-cyan-300 font-mono capitalize">{nurture.channel} Drip</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Current Stage:</span>
                      <span className="text-amber-300 font-bold">{nurture.stepTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Last Firestore Event:</span>
                      <span className="text-slate-300 font-mono">{nurture.lastActivityTime || "Recent"}</span>
                    </div>
                  </div>
                </div>

                {/* STEP PROGRESS VISUALIZER */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Nurture Drip Milestones</span>
                    <span className="text-cyan-400 font-mono">Step {nurture.stepNumber} of 4</span>
                  </h4>

                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { step: 1, label: "Pitch Sent" },
                      { step: 2, label: "Engagement" },
                      { step: 3, label: "High Intent" },
                      { step: 4, label: "Converted" },
                    ].map((s) => {
                      const isDone = nurture.stepNumber >= s.step;
                      const isCurrent = nurture.stepNumber === s.step && nurture.status === "active";
                      return (
                        <div
                          key={s.step}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            isCurrent
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold shadow-lg shadow-cyan-950"
                              : isDone
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                              : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}
                        >
                          <p className="text-[10px] font-mono font-bold">0{s.step}</p>
                          <p className="text-[10px] truncate">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RECENT FIRESTORE ACTIVITY TIMELINE */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Recent Firestore Activity Logs
                  </h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 text-xs">
                    {(selectedNurtureModalContact.timeline || []).slice(0, 3).map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-cyan-400 font-bold capitalize">{item.type.replace("_", " ")}</span>
                          <span className="text-slate-500">{item.date}</span>
                        </div>
                        <p className="text-slate-300">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleToggleNurtureState(selectedNurtureModalContact)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isPaused
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPaused ? "Re-Enroll in Sequence" : "Pause Nurture Sequence"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedActivityContact(selectedNurtureModalContact);
                      setSelectedNurtureModalContact(null);
                    }}
                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Log Email Response</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ADD SERVICE TICKET MODAL */}
      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Create Service Support Ticket</h3>
              </div>
              <button onClick={() => setShowAddTicketModal(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Ticket Subject / Title</label>
                <input
                  type="text"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. API Webhook Timeout during Morning Shifts"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Contact Name</label>
                  <input
                    type="text"
                    value={newTicketContact}
                    onChange={(e) => setNewTicketContact(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Company Name</label>
                  <input
                    type="text"
                    value={newTicketCompany}
                    onChange={(e) => setNewTicketCompany(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Priority Level</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="urgent">🚨 Urgent (SLA 2h)</option>
                    <option value="high">🔥 High (SLA 6h)</option>
                    <option value="medium">⚡ Medium (SLA 24h)</option>
                    <option value="low">❄️ Low (SLA 48h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category</label>
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug">Bug Report</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddTicketModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newTicketSubject.trim()) return;
                  const newTkt: ServiceTicket = {
                    id: `tkt-${Date.now()}`,
                    ticketNumber: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
                    subject: newTicketSubject,
                    contactName: newTicketContact,
                    company: newTicketCompany,
                    priority: newTicketPriority,
                    status: "new",
                    category: newTicketCategory,
                    createdAt: "Just now",
                    slaDeadline: newTicketPriority === "urgent" ? "2 hours remaining" : "24 hours remaining",
                    assignedAgent: "Alex Rivers",
                    description: "Submitted via Service Hub Portal",
                  };
                  setTickets([newTkt, ...tickets]);
                  setShowAddTicketModal(false);
                  setNewTicketSubject("");
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md"
              >
                Create Service Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SALES QUOTE MODAL */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Sales Quote & Proposal</h3>
              </div>
              <button onClick={() => setShowAddQuoteModal(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Deal / Proposal Title</label>
                <input
                  type="text"
                  value={newQuoteDeal}
                  onChange={(e) => setNewQuoteDeal(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Company Name</label>
                  <input
                    type="text"
                    value={newQuoteCompany}
                    onChange={(e) => setNewQuoteCompany(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Contact Name</label>
                  <input
                    type="text"
                    value={newQuoteContact}
                    onChange={(e) => setNewQuoteContact(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Quote Total Amount ($)</label>
                <input
                  type="number"
                  value={newQuoteAmount}
                  onChange={(e) => setNewQuoteAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddQuoteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newQ: SalesQuote = {
                    id: `quote-${Date.now()}`,
                    quoteNumber: `QUO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    dealTitle: newQuoteDeal,
                    companyName: newQuoteCompany,
                    contactName: newQuoteContact,
                    items: [
                      { id: `qi-1`, name: `${newQuoteDeal} Enterprise Software License`, quantity: 1, unitPrice: newQuoteAmount },
                    ],
                    subtotal: newQuoteAmount,
                    discountPercent: 5,
                    taxPercent: 0,
                    totalAmount: Math.round(newQuoteAmount * 0.95),
                    status: "sent",
                    createdAt: new Date().toISOString().split("T")[0],
                    validUntil: "In 30 Days",
                    paymentTerms: "Net 30",
                    notes: "Generated via Sales Hub Portal",
                  };
                  setQuotes([newQ, ...quotes]);
                  setShowAddQuoteModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md"
              >
                Generate & Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
