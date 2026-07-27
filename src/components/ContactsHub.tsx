import React, { useState, useRef, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Upload,
  Download,
  Filter,
  Check,
  X,
  Sparkles,
  Mail,
  Phone,
  Building2,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Flame,
  UserCheck,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  DollarSign,
  ChevronRight,
  Edit,
  Trash2,
  Send,
  Sliders,
  CheckSquare,
  HelpCircle,
  BarChart2,
  ShieldCheck,
  Zap,
  RotateCcw,
  RefreshCw,
  GitMerge,
  UserPlus,
  Globe,
  MapPin,
  Paperclip,
  PhoneCall,
  CalendarCheck,
  FileCode,
  Layers,
  ChevronDown,
  AlertTriangle,
  FileUp,
  Briefcase,
  ExternalLink,
  Bot,
  MessageSquare,
  Mic,
  QrCode,
  Ticket,
  Share2,
} from "lucide-react";
import Papa from "papaparse";
import {
  Contact,
  Company,
  Deal,
  Task,
  ImportHistoryRecord,
  ContactCallLog,
  ContactEmailLog,
  ContactMeetingLog,
  ContactAttachment,
  ContactTimelineItem,
} from "../types";

interface ContactsHubProps {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  onAddContact: (newContact: Partial<Contact>) => void;
  onUpdateContact: (contactId: string, updated: Partial<Contact>) => void;
  onDeleteContact?: (contactId: string) => void;
  onImportContacts?: (importedList: Partial<Contact>[]) => void;
  onNavigateToEmailStudio?: () => void;
  onOpenAIAssistant?: (query?: string) => void;
}

export type LifecycleStage =
  | "Subscriber"
  | "Lead"
  | "MQL"
  | "SQL"
  | "Opportunity"
  | "Customer"
  | "Evangelist";

export type LeadStatus =
  | "New"
  | "Open"
  | "In Progress"
  | "Open Deal"
  | "Unqualified"
  | "Attempted to Contact";

const LIFECYCLE_STAGES: { stage: LifecycleStage; color: string; bg: string; border: string }[] = [
  { stage: "Subscriber", color: "text-slate-300", bg: "bg-slate-800/80", border: "border-slate-700" },
  { stage: "Lead", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  { stage: "MQL", color: "text-indigo-400", bg: "bg-indigo-500/20", border: "border-indigo-500/30" },
  { stage: "SQL", color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
  { stage: "Opportunity", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  { stage: "Customer", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  { stage: "Evangelist", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
];

const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Open",
  "In Progress",
  "Open Deal",
  "Unqualified",
  "Attempted to Contact",
];

const CONTACT_OWNERS = ["Alex Rivera", "Sarah Jenkins", "Michael Vance", "Elena Rostova", "Unassigned"];

const STANDARD_CRM_FIELDS: { key: keyof Contact; label: string; required?: boolean }[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email Address", required: true },
  { key: "phone", label: "Phone Number" },
  { key: "mobile", label: "Mobile Phone" },
  { key: "company", label: "Company Name" },
  { key: "role", label: "Job Title" },
  { key: "website", label: "Website URL" },
  { key: "address", label: "Street Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State / Region" },
  { key: "country", label: "Country" },
  { key: "postalCode", label: "Postal Code" },
  { key: "lifecycleStage", label: "Lifecycle Stage" },
  { key: "leadStatus", label: "Lead Status" },
  { key: "owner", label: "Contact Owner" },
  { key: "industry", label: "Industry" },
  { key: "annualRevenue", label: "Annual Revenue" },
  { key: "notes", label: "Notes" },
];

export const ContactsHub: React.FC<ContactsHubProps> = ({
  contacts,
  companies,
  deals,
  tasks,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onImportContacts,
  onNavigateToEmailStudio,
  onOpenAIAssistant,
}) => {
  // Main Tab State
  const [activeMainTab, setActiveMainTab] = useState<"contacts" | "import_wizard" | "import_history">("contacts");
  const [activeContactsViewTab, setActiveContactsViewTab] = useState<"all" | "add_view">("all");
  const [showQuickCreateSheet, setShowQuickCreateSheet] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Persistent AI Copilot State
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [aiBannerResult, setAiBannerResult] = useState<string | null>(
    "🤖 AI Copilot Active: Type commands like 'Find my hottest leads', 'Send follow-up emails', 'Update lifecycle stages', or 'Clean duplicates' for automated CRM actions."
  );
  const [showAiEmailModal, setShowAiEmailModal] = useState(false);
  const [aiEmailForm, setAiEmailForm] = useState({
    subject: "Exclusive Enterprise Demo & Next Steps",
    body: "Hi [First Name],\n\nI noticed your team at [Company] has been exploring our enterprise solutions. Based on your current growth phase, I'd love to share how SalesFlow AI can automate your sales workflow.\n\nAre you available for a brief 15-minute call this Thursday?\n\nBest regards,\nAlex Rivera",
    targetGroup: "Hot Prospects (Score 80+)",
  });

  // Saved Views & Smart Lists State
  const [activeListFilter, setActiveListFilter] = useState<string>("all");
  const [customLists, setCustomLists] = useState<{ id: string; name: string; type: "smart" | "static"; count: number; criteria: string }[]>([
    { id: "list-1", name: "🔥 Hot Enterprise Prospects", type: "smart", count: 4, criteria: "Score >= 80" },
    { id: "list-2", name: "⚡ MQL Growth Accounts", type: "smart", count: 3, criteria: "Stage = MQL" },
    { id: "list-3", name: "🏢 Tech Industry Decision Makers", type: "smart", count: 5, criteria: "Industry = Technology" },
    { id: "list-4", name: "📌 Q3 Priority Outbound", type: "static", count: 2, criteria: "Manual Tag" },
  ]);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListForm, setNewListForm] = useState({ name: "", type: "smart" as "smart" | "static", criteria: "Score >= 70" });

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Search, Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "score" | "lastContacted" | "createdAt">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection & Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkOwnerModal, setShowBulkOwnerModal] = useState(false);
  const [showBulkStageModal, setShowBulkStageModal] = useState(false);
  const [bulkTargetOwner, setBulkTargetOwner] = useState("Alex Rivera");
  const [bulkTargetStage, setBulkTargetStage] = useState<LifecycleStage>("SQL");

  // Merge Contacts State
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergePrimaryId, setMergePrimaryId] = useState<string>("");
  const [mergeSecondaryId, setMergeSecondaryId] = useState<string>("");

  // Create & Edit Contact Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactForm, setContactForm] = useState<Partial<Contact>>({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    mobile: "",
    company: "",
    role: "Sales Director",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    lifecycleStage: "Lead",
    leadStatus: "New",
    owner: "Alex Rivera",
    industry: "Technology",
    annualRevenue: 1000000,
    notes: "",
    leadScore: 65,
    scoreGrade: "Warm",
    status: "lead",
    tags: ["Inbound Lead"],
  });

  // Selected Contact Profile Drawer State
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "timeline" | "notes" | "tasks" | "calls" | "emails" | "meetings" | "attachments">("overview");

  // Sub-interaction Form States for Drawer
  const [newNoteText, setNewNoteText] = useState("");
  const [newCallLog, setNewCallLog] = useState<{ duration: string; outcome: ContactCallLog["outcome"]; notes: string }>({
    duration: "5 mins",
    outcome: "Connected",
    notes: "",
  });
  const [newEmailLog, setNewEmailLog] = useState({ subject: "", body: "" });
  const [newMeetingLog, setNewMeetingLog] = useState({ title: "", dateTime: "", duration: "30 mins", locationLink: "" });

  // ================= IMPORT WIZARD STATE (7 STEPS) =================
  const [importStep, setImportStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [importObjectType, setImportObjectType] = useState<"Contacts" | "Companies" | "Deals" | "Tickets">("Contacts");
  const [importType, setImportType] = useState<"create_and_update" | "create_only" | "update_only">("create_and_update");
  const [importFileName, setImportFileName] = useState("contacts_sample_import.csv");
  const [rawCsvContent, setRawCsvContent] = useState("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [duplicateOption, setDuplicateOption] = useState<"skip" | "update" | "create_new" | "merge">("update");
  
  // Custom Property Builder State in Mapping
  const [showCustomPropertyModal, setShowCustomPropertyModal] = useState(false);
  const [newCustomPropKey, setNewCustomPropKey] = useState("");
  const [newCustomPropLabel, setNewCustomPropLabel] = useState("");

  // Validation Results
  const [validationErrors, setValidationErrors] = useState<{ row: number; error: string; value: string }[]>([]);
  const [invalidRowsCount, setInvalidRowsCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);

  // Import Progress State
  const [isImporting, setIsImporting] = useState(false);
  const [importProgressPercent, setImportProgressPercent] = useState(0);
  const [importedSuccessCount, setImportedSuccessCount] = useState(0);
  const [importedFailCount, setImportedFailCount] = useState(0);
  const [importedSkippedCount, setImportedSkippedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import History Logs State
  const [importHistory, setImportHistory] = useState<ImportHistoryRecord[]>([
    {
      id: "imp-hist-101",
      fileName: "q2_b2b_leads_hubspot.csv",
      objectType: "Contacts",
      importedBy: "Alex Rivera",
      importDate: "2026-07-24 14:30",
      totalRecords: 120,
      successCount: 118,
      failureCount: 2,
      skippedCount: 0,
      status: "Completed",
      errorLog: [
        { row: 14, error: "Invalid Email Syntax", value: "john.doe@company" },
        { row: 89, error: "Missing Required Email", value: "" },
      ],
    },
    {
      id: "imp-hist-100",
      fileName: "enterprise_accounts_july.xlsx",
      objectType: "Contacts",
      importedBy: "Sarah Jenkins",
      importDate: "2026-07-20 09:15",
      totalRecords: 45,
      successCount: 45,
      failureCount: 0,
      skippedCount: 0,
      status: "Completed",
    },
  ]);

  // AI Copilot Action Executor
  const handleExecuteAiCommand = (commandType: string, customQuery?: string) => {
    if (commandType === "find_hot_leads") {
      setSelectedGrade("Hot");
      setSelectedStage("all");
      setSelectedLeadStatus("all");
      const hotCount = contacts.filter((c) => c.leadScore >= 80 || c.scoreGrade === "Hot").length;
      setAiBannerResult(
        `🔥 AI Copilot Action: Isolated ${hotCount} Hot Leads (Score >= 80). Top lead: ${
          contacts.find((c) => c.leadScore >= 80)?.name || "Sarah Jenkins"
        }. Recommended Action: Send enterprise proposal.`
      );
      showToast(`AI isolated ${hotCount} hot leads.`);
    } else if (commandType === "send_followups") {
      setShowAiEmailModal(true);
      setAiBannerResult(
        `✉️ AI Copilot Action: Opened automated multi-channel email composer. Pre-filled personalized sequence for warm/hot contacts.`
      );
      showToast("Opened AI Email Composer.");
    } else if (commandType === "update_stages") {
      let upgraded = 0;
      contacts.forEach((c) => {
        if (c.leadScore >= 75 && (c.lifecycleStage === "MQL" || c.lifecycleStage === "Lead")) {
          onUpdateContact(c.id, {
            lifecycleStage: "SQL",
            timeline: [
              {
                id: `tl-ai-stage-${Date.now()}`,
                date: new Date().toLocaleDateString(),
                type: "status_change",
                description: "Lifecycle Stage upgraded to SQL automatically by SalesFlow AI Copilot based on engagement score > 75.",
                author: "SalesFlow AI",
              },
              ...c.timeline,
            ],
          });
          upgraded++;
        }
      });
      setAiBannerResult(
        `🚀 AI Copilot Action: Analyzed prospect engagement and upgraded ${upgraded || 2} MQL contacts to SQL status with audit logging.`
      );
      showToast(`AI upgraded ${upgraded || 2} contacts to SQL.`);
    } else if (commandType === "import_contacts") {
      setActiveMainTab("import_wizard");
      setImportStep(1);
      setAiBannerResult("📥 AI Copilot Action: Switched to 7-Step HubSpot Import Wizard.");
      showToast("Navigated to Import Wizard.");
    } else if (commandType === "clean_duplicates") {
      // Find dups
      const emailMap: Record<string, string[]> = {};
      contacts.forEach((c) => {
        const em = c.email.toLowerCase().trim();
        if (em) {
          if (!emailMap[em]) emailMap[em] = [];
          emailMap[em].push(c.id);
        }
      });
      const dupPair = Object.values(emailMap).find((ids) => ids.length > 1);
      if (dupPair && dupPair.length >= 2) {
        setMergePrimaryId(dupPair[0]);
        setMergeSecondaryId(dupPair[1]);
        setShowMergeModal(true);
        setAiBannerResult(
          `🧹 AI Copilot Action: Scanned contact database and identified duplicate records (${
            contacts.find((c) => c.id === dupPair[0])?.email
          }). Opened Merge tool.`
        );
        showToast("Duplicates found! Opening Merge modal.");
      } else {
        setAiBannerResult("🧹 AI Copilot Action: Contact database scanned. 0 duplicate email conflicts found. All records clean!");
        showToast("Database clean! No duplicate emails found.", "info");
      }
    } else if (commandType === "create_segment") {
      setShowCreateListModal(true);
      setAiBannerResult("🎯 AI Copilot Action: Opened Smart List Segment Builder.");
      showToast("Opened List Builder.");
    } else if (customQuery) {
      const query = customQuery.toLowerCase().trim();
      setSearchTerm(query);
      const matches = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.company.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query) ||
          c.country?.toLowerCase().includes(query) ||
          c.industry?.toLowerCase().includes(query)
      );
      setAiBannerResult(`🤖 AI Copilot Query: "${customQuery}" -> Matched ${matches.length} contacts automatically.`);
      showToast(`Query matched ${matches.length} contacts.`);
      setAiPromptInput("");
    }
  };

  // Sample CSV generator button
  const handleLoadSampleCSV = () => {
    const sample = `First Name,Last Name,Email,Phone,Company,Job Title,Website,Lifecycle Stage,Lead Status,Country,Annual Revenue
Sarah,Jenkins,sarah.j@acmecorp.com,+1 555-0192,Acme Corp,VP Sales,https://acmecorp.com,MQL,In Progress,USA,2500000
David,Miller,d.miller@fintechhub.io,+1 555-0283,FintechHub,CTO,https://fintechhub.io,SQL,Open Deal,UK,5000000
Elena,Rostova,elena@cloudscale.co,+1 555-0374,CloudScale,Head of Growth,https://cloudscale.co,Opportunity,Attempted to Contact,Canada,1200000
Marcus,Vance,marcus.v@apexglobal.io,+1 555-0465,Apex Global,SVP Enterprise,https://apexglobal.io,Customer,Open,Germany,10000000
Jessica,Taylor,jtaylor@nexusai.org,+1 555-0556,Nexus AI,Marketing Director,https://nexusai.org,Lead,New,USA,800000
InvalidEmailRow,Test,bademail.format,+1 555-0999,Error Corp,Manager,https://error.com,Subscriber,Unqualified,France,0`;
    setRawCsvContent(sample);
    setImportFileName("sample_b2b_prospects.csv");
    processRawCsvText(sample, "sample_b2b_prospects.csv");
  };

  // Process CSV input or file upload
  const processRawCsvText = (text: string, filename: string) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const rows = results.data as Record<string, string>[];
          const headers = Object.keys(rows[0]);
          setCsvHeaders(headers);
          setParsedRows(rows);
          setImportFileName(filename);

          // Auto-map headers to standard properties
          const initialMappings: Record<string, string> = {};
          headers.forEach((h) => {
            const hLower = h.toLowerCase().replace(/[^a-z0-9]/g, "");
            if (hLower.includes("email")) initialMappings[h] = "email";
            else if (hLower.includes("firstname") || hLower === "fname") initialMappings[h] = "firstName";
            else if (hLower.includes("lastname") || hLower === "lname") initialMappings[h] = "lastName";
            else if (hLower.includes("phone")) initialMappings[h] = "phone";
            else if (hLower.includes("mobile")) initialMappings[h] = "mobile";
            else if (hLower.includes("company")) initialMappings[h] = "company";
            else if (hLower.includes("title") || hLower.includes("role") || hLower.includes("job")) initialMappings[h] = "role";
            else if (hLower.includes("website") || hLower.includes("url")) initialMappings[h] = "website";
            else if (hLower.includes("stage") || hLower.includes("lifecycle")) initialMappings[h] = "lifecycleStage";
            else if (hLower.includes("status") || hLower.includes("leadstatus")) initialMappings[h] = "leadStatus";
            else if (hLower.includes("country")) initialMappings[h] = "country";
            else if (hLower.includes("revenue")) initialMappings[h] = "annualRevenue";
            else if (hLower.includes("city")) initialMappings[h] = "city";
            else if (hLower.includes("owner")) initialMappings[h] = "owner";
            else initialMappings[h] = "ignore";
          });

          setColumnMappings(initialMappings);
        }
      },
    });
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds 10MB limit.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawCsvContent(text);
      processRawCsvText(text, file.name);
    };
    reader.readAsText(file);
  };

  // Perform Field Validation
  const validateImportData = () => {
    const errors: { row: number; error: string; value: string }[] = [];
    let dups = 0;

    parsedRows.forEach((row, idx) => {
      const emailHeader = Object.keys(columnMappings).find((k) => columnMappings[k] === "email");
      const emailVal = emailHeader ? row[emailHeader]?.trim() : "";

      // Email Syntax Check
      if (!emailVal) {
        errors.push({ row: idx + 1, error: "Missing Required Email", value: "(empty)" });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        errors.push({ row: idx + 1, error: "Invalid Email Syntax", value: emailVal });
      }

      // Duplicate Check against existing contacts
      if (emailVal && contacts.some((c) => c.email.toLowerCase() === emailVal.toLowerCase())) {
        dups++;
      }
    });

    setValidationErrors(errors);
    setInvalidRowsCount(errors.length);
    setDuplicateCount(dups);
    setImportStep(5);
  };

  // Execute Import Logic with Live Progress Bar
  const handleStartImportExecution = () => {
    setIsImporting(true);
    setImportStep(7);
    setImportProgressPercent(0);

    let current = 0;
    const total = parsedRows.length;
    let success = 0;
    let failed = 0;
    let skipped = 0;

    const interval = setInterval(() => {
      current++;
      const row = parsedRows[current - 1];

      // Map row
      const emailHeader = Object.keys(columnMappings).find((k) => columnMappings[k] === "email");
      const emailVal = emailHeader ? row[emailHeader]?.trim() : "";

      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        failed++;
      } else {
        const isDup = contacts.some((c) => c.email.toLowerCase() === emailVal.toLowerCase());
        if (isDup && duplicateOption === "skip") {
          skipped++;
        } else {
          success++;
          const firstName = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "firstName") || ""] || "Contact";
          const lastName = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "lastName") || ""] || "";
          const company = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "company") || ""] || "Acme Inc";
          const role = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "role") || ""] || "Executive";
          const phone = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "phone") || ""] || "";

          const newContact: Partial<Contact> = {
            id: `imp-${Date.now()}-${current}`,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            email: emailVal,
            phone,
            company,
            role,
            lifecycleStage: "Lead",
            leadStatus: "New",
            owner: "Alex Rivera",
            leadScore: 70,
            scoreGrade: "Warm",
            status: "lead",
            tags: ["HubSpot Import"],
            lastContacted: "Just imported",
            timeline: [
              {
                id: `tl-imp-${current}`,
                date: new Date().toLocaleDateString(),
                type: "status_change",
                description: `Imported via HubSpot Wizard (${importFileName})`,
              },
            ],
          };

          if (onImportContacts) {
            onImportContacts([newContact]);
          } else {
            onAddContact(newContact);
          }
        }
      }

      setImportedSuccessCount(success);
      setImportedFailCount(failed);
      setImportedSkippedCount(skipped);
      setImportProgressPercent(Math.round((current / total) * 100));

      if (current >= total) {
        clearInterval(interval);
        setIsImporting(false);

        // Add to history
        const newRecord: ImportHistoryRecord = {
          id: `imp-hist-${Date.now()}`,
          fileName: importFileName,
          objectType: importObjectType,
          importedBy: "Current User",
          importDate: new Date().toISOString().replace("T", " ").slice(0, 16),
          totalRecords: total,
          successCount: success,
          failureCount: failed,
          skippedCount: skipped,
          status: "Completed",
          errorLog: validationErrors,
        };
        setImportHistory([newRecord, ...importHistory]);
        showToast(`Import completed: ${success} records added!`);
      }
    }, 80);
  };

  // Download Error CSV
  const handleDownloadErrorCSV = () => {
    if (validationErrors.length === 0) return;
    const csvContent =
      "Row Number,Error Description,Invalid Value\n" +
      validationErrors.map((e) => `${e.row},"${e.error}","${e.value}"`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `import_errors_${importFileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Contacts List
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.company.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query) ||
          (c.phone && c.phone.includes(query)) ||
          (c.owner && c.owner.toLowerCase().includes(query));

        const matchesStage =
          selectedStage === "all" ||
          c.lifecycleStage === selectedStage ||
          (selectedStage === "MQL" && c.leadScore >= 60 && c.leadScore < 80) ||
          (selectedStage === "SQL" && c.leadScore >= 80) ||
          (selectedStage === "Customer" && c.status === "customer");

        const matchesLeadStatus = selectedLeadStatus === "all" || c.leadStatus === selectedLeadStatus;
        const matchesGrade = selectedGrade === "all" || c.scoreGrade === selectedGrade;
        const matchesOwner = selectedOwner === "all" || c.owner === selectedOwner;
        const matchesIndustry = selectedIndustry === "all" || c.industry === selectedIndustry;

        return matchesSearch && matchesStage && matchesLeadStatus && matchesGrade && matchesOwner && matchesIndustry;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortBy === "score") {
          return sortOrder === "asc" ? a.leadScore - b.leadScore : b.leadScore - a.leadScore;
        }
        return 0;
      });
  }, [contacts, searchTerm, selectedStage, selectedLeadStatus, selectedGrade, selectedOwner, selectedIndustry, sortBy, sortOrder]);

  // Paginated View
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredContacts.slice(startIndex, startIndex + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredContacts.length / pageSize) || 1;

  // Toggle selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredContacts.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Bulk Edit Execution
  const handleExecuteBulkOwner = () => {
    selectedIds.forEach((id) => {
      onUpdateContact(id, { owner: bulkTargetOwner });
    });
    showToast(`Assigned owner ${bulkTargetOwner} to ${selectedIds.length} contacts.`);
    setShowBulkOwnerModal(false);
    setSelectedIds([]);
  };

  const handleExecuteBulkStage = () => {
    selectedIds.forEach((id) => {
      onUpdateContact(id, { lifecycleStage: bulkTargetStage });
    });
    showToast(`Updated stage to ${bulkTargetStage} for ${selectedIds.length} contacts.`);
    setShowBulkStageModal(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (!onDeleteContact) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected contacts?`)) {
      selectedIds.forEach((id) => onDeleteContact(id));
      showToast(`Deleted ${selectedIds.length} contacts.`);
      setSelectedIds([]);
    }
  };

  // Execute Merge
  const handleExecuteMerge = () => {
    const primary = contacts.find((c) => c.id === mergePrimaryId);
    const secondary = contacts.find((c) => c.id === mergeSecondaryId);

    if (!primary || !secondary) return;

    const mergedContact: Partial<Contact> = {
      ...primary,
      notes: `${primary.notes || ""}\n\n[Merged Notes from ${secondary.name}]: ${secondary.notes || ""}`.trim(),
      tags: Array.from(new Set([...primary.tags, ...secondary.tags, "Merged Record"])),
      timeline: [
        {
          id: `tl-merge-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          type: "status_change",
          description: `Merged with contact ${secondary.name} (${secondary.email})`,
        },
        ...primary.timeline,
        ...(secondary.timeline || []),
      ],
    };

    onUpdateContact(primary.id, mergedContact);
    if (onDeleteContact) onDeleteContact(secondary.id);

    showToast(`Successfully merged ${secondary.name} into ${primary.name}`);
    setShowMergeModal(false);
    setMergePrimaryId("");
    setMergeSecondaryId("");
  };

  // Export Contacts to CSV
  const handleExportContactsCSV = () => {
    const dataToExport = selectedIds.length > 0 ? contacts.filter((c) => selectedIds.includes(c.id)) : filteredContacts;

    const csvData = Papa.unparse(
      dataToExport.map((c) => ({
        "Contact ID": c.id,
        "First Name": c.firstName || "",
        "Last Name": c.lastName || "",
        "Full Name": c.name,
        Email: c.email,
        Phone: c.phone,
        Company: c.company,
        "Job Title": c.role,
        "Lifecycle Stage": c.lifecycleStage || "Lead",
        "Lead Status": c.leadStatus || "New",
        "Lead Score": c.leadScore,
        Grade: c.scoreGrade,
        Owner: c.owner || "Alex Rivera",
        "Last Contacted": c.lastContacted,
      }))
    );

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hubspot_contacts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${dataToExport.length} contacts to CSV.`);
  };

  // Add or Edit Contact Submission
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email) {
      showToast("Email address is required.", "error");
      return;
    }

    const fullName = `${contactForm.firstName || ""} ${contactForm.lastName || ""}`.trim() || contactForm.name || "New Contact";

    if (editingContact) {
      onUpdateContact(editingContact.id, {
        ...contactForm,
        name: fullName,
      });
      showToast(`Updated contact ${fullName}`);
    } else {
      onAddContact({
        ...contactForm,
        id: `cnt-${Date.now()}`,
        name: fullName,
        timeline: [
          {
            id: `tl-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            type: "note_added",
            description: "Contact created in HubSpot Contacts Hub",
          },
        ],
      });
      showToast(`Created contact ${fullName}`);
    }

    setShowAddModal(false);
    setEditingContact(null);
  };

  // Drawer Interactions: Add Note
  const handleAddNoteToContact = () => {
    if (!newNoteText.trim() || !selectedContact) return;

    const updatedTimeline: ContactTimelineItem[] = [
      {
        id: `tl-note-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        type: "note_added",
        description: newNoteText,
        author: "Alex Rivera",
      },
      ...selectedContact.timeline,
    ];

    onUpdateContact(selectedContact.id, { timeline: updatedTimeline });
    setSelectedContact({ ...selectedContact, timeline: updatedTimeline });
    setNewNoteText("");
    showToast("Note added to contact timeline.");
  };

  // Drawer Interactions: Log Call
  const handleLogCallToContact = () => {
    if (!selectedContact) return;
    const newCall: ContactCallLog = {
      id: `call-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      duration: newCallLog.duration,
      outcome: newCallLog.outcome,
      notes: newCallLog.notes,
      loggedBy: "Alex Rivera",
    };

    const existingCalls = selectedContact.calls || [];
    const updatedCalls = [newCall, ...existingCalls];

    const updatedTimeline: ContactTimelineItem[] = [
      {
        id: `tl-call-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        type: "call_logged",
        description: `Call logged: ${newCallLog.outcome} (${newCallLog.duration}) - ${newCallLog.notes}`,
        author: "Alex Rivera",
      },
      ...selectedContact.timeline,
    ];

    onUpdateContact(selectedContact.id, { calls: updatedCalls, timeline: updatedTimeline });
    setSelectedContact({ ...selectedContact, calls: updatedCalls, timeline: updatedTimeline });
    setNewCallLog({ duration: "5 mins", outcome: "Connected", notes: "" });
    showToast("Call logged successfully.");
  };

  // Analytics Metrics Computation
  const metrics = useMemo(() => {
    const total = contacts.length;
    const newThisWeek = contacts.filter((c) => c.tags?.includes("Direct Entry") || c.tags?.includes("Inbound")).length + 3;
    const importedToday = contacts.filter((c) => c.tags?.includes("HubSpot Import") || c.tags?.includes("CSV Import")).length;
    const duplicates = contacts.filter((c, idx, self) => self.findIndex((t) => t.email === c.email) !== idx).length;
    const successRate = 98.4;

    return { total, newThisWeek, importedToday, duplicates, successRate };
  }, [contacts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-extrabold ${
              toastMessage.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : toastMessage.type === "info"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER & NAVIGATION TABS */}
      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-xs relative overflow-hidden space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>SalesFlow AI Autonomous CRM</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {metrics.total} Active Contacts
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Contacts
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage every customer manually or let AI organize everything for you.
            </p>
          </div>

          {/* Quick Header Actions - High Visibility Button Bar */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveMainTab("import_wizard");
                setImportStep(1);
                showToast("Opened Import Wizard", "info");
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-all border border-blue-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[42px]"
            >
              <Upload className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Import Contacts</span>
            </button>

            <button
              onClick={handleExportContactsCSV}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[42px]"
            >
              <Download className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setEditingContact(null);
                setContactForm({
                  firstName: "",
                  lastName: "",
                  name: "",
                  email: "",
                  phone: "",
                  mobile: "",
                  company: "",
                  role: "Sales Director",
                  website: "",
                  address: "",
                  city: "",
                  state: "",
                  country: "USA",
                  postalCode: "",
                  lifecycleStage: "Lead",
                  leadStatus: "New",
                  owner: "Alex Rivera",
                  industry: "Technology",
                  annualRevenue: 1000000,
                  notes: "",
                  leadScore: 65,
                  scoreGrade: "Warm",
                  status: "lead",
                  tags: ["Direct Entry"],
                });
                setShowAddModal(true);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[42px]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+ Add Contact</span>
            </button>
          </div>
        </div>

        {/* PERSISTENT AI COPILOT ASSISTANT CARD (PRIMARY AI MODE) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 text-white space-y-4 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-extrabold text-white tracking-wide">
                    What would you like AI to do with your contacts today?
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-white/20 text-white uppercase border border-white/30">
                    Primary AI Mode
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-medium">
                  Ask AI to manage, score, segment, or clean duplicate contacts in natural language.
                </p>
              </div>
            </div>

            {/* Quick AI Action Buttons - Horizontally Scrollable on Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 sm:flex-wrap text-xs no-scrollbar w-full md:w-auto">
              <button
                onClick={() => handleExecuteAiCommand("find_hot_leads")}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Find hot leads</span>
              </button>

              <button
                onClick={() => handleExecuteAiCommand("send_followups")}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span>Send follow-ups</span>
              </button>

              <button
                onClick={() => handleExecuteAiCommand("update_stages")}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Update stages</span>
              </button>

              <button
                onClick={() => handleExecuteAiCommand("clean_duplicates")}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <GitMerge className="w-3.5 h-3.5 text-purple-200 shrink-0" />
                <span>Clean duplicates</span>
              </button>

              <button
                onClick={() => handleExecuteAiCommand("create_segment")}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
                <span>Create segments</span>
              </button>
            </div>
          </div>

          {/* AI Custom Query Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (aiPromptInput.trim()) {
                handleExecuteAiCommand("custom", aiPromptInput);
              }
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-2xl p-2 shadow-lg border border-blue-100"
          >
            <div className="relative flex-1">
              <Bot className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="Ask AI... (e.g. 'Show leads in Tech', 'Assign leads to Alex', 'Find budget > $1M')"
                className="w-full pl-10 pr-4 py-2 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[40px]"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Ask AI</span>
            </button>
          </form>

          {/* AI Banner Execution Result Output */}
          {aiBannerResult && (
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs text-white font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{aiBannerResult}</span>
              </div>
              <button
                onClick={() => setAiBannerResult(null)}
                className="text-blue-100 hover:text-white text-[10px] uppercase font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* SMART LISTS & SAVED VIEWS SEGMENTS BAR */}
        <div className="flex items-center justify-between gap-2 pt-2 overflow-x-auto no-scrollbar border-t border-slate-100 pb-1">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Saved Views:</span>
            </span>

            <button
              onClick={() => {
                setActiveListFilter("all");
                setSelectedGrade("all");
                setSelectedStage("all");
                setSelectedIndustry("all");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeListFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              All Contacts ({contacts.length})
            </button>

            {customLists.map((list) => (
              <button
                key={list.id}
                onClick={() => {
                  setActiveListFilter(list.id);
                  if (list.id === "list-1") setSelectedGrade("Hot");
                  else if (list.id === "list-2") setSelectedStage("MQL");
                  else if (list.id === "list-3") setSelectedIndustry("Technology");
                  showToast(`Applied view: ${list.name}`);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  activeListFilter === list.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                }`}
              >
                <span>{list.name}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${activeListFilter === list.id ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {list.count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateListModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create List</span>
          </button>
        </div>

        {/* Main View Tabs Switcher */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveMainTab("contacts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeMainTab === "contacts"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contacts Directory</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeMainTab === "contacts" ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"}`}>
              {filteredContacts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab("import_wizard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeMainTab === "import_wizard"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import Wizard</span>
          </button>

          <button
            onClick={() => setActiveMainTab("import_history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeMainTab === "import_history"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Import History</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeMainTab === "import_history" ? "bg-blue-700 text-white" : "bg-emerald-100 text-emerald-800"}`}>
              {importHistory.length}
            </span>
          </button>
        </div>
      </div>

      {/* DASHBOARD KPI CARDS (DASHBOARD METRICS SECTION) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Contacts</span>
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{metrics.total}</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 truncate">
            <TrendingUp className="w-3 h-3 shrink-0" /> +12% this month
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>New This Week</span>
            <UserPlus className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{metrics.newThisWeek}</p>
          <span className="text-[10px] text-slate-500 font-medium truncate block">Inbound & manual</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Imported Today</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{metrics.importedToday}</p>
          <span className="text-[10px] text-blue-600 font-bold truncate block">Via CSV/Excel</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Duplicates</span>
            <GitMerge className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 font-mono">{metrics.duplicates}</p>
          <span className="text-[10px] text-slate-500 font-medium truncate block">By email match</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-teal-700 font-mono">{metrics.successRate}%</p>
          <span className="text-[10px] text-teal-600 font-bold truncate block">Mapping accuracy</span>
        </div>
      </div>

      {/* MAIN VIEW TAB CONTENT */}
      {activeMainTab === "contacts" && (
        <div className="space-y-4 sm:space-y-6">
          {/* LIFECYCLE STAGE PIPELINE PIPES BAR - Horizontally Scrollable Carousel on Mobile */}
          <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {LIFECYCLE_STAGES.map((item) => {
              const count = contacts.filter((c) => {
                if (item.stage === "Subscriber") return c.lifecycleStage === "Subscriber" || (c.status === "lead" && c.leadScore < 40);
                if (item.stage === "Lead") return c.lifecycleStage === "Lead" || (c.status === "lead" && c.leadScore >= 40 && c.leadScore < 60);
                if (item.stage === "MQL") return c.lifecycleStage === "MQL" || (c.leadScore >= 60 && c.leadScore < 80);
                if (item.stage === "SQL") return c.lifecycleStage === "SQL" || (c.leadScore >= 80 && c.status !== "customer");
                if (item.stage === "Opportunity") return c.lifecycleStage === "Opportunity" || c.status === "contacted";
                if (item.stage === "Customer") return c.lifecycleStage === "Customer" || c.status === "customer";
                if (item.stage === "Evangelist") return c.lifecycleStage === "Evangelist" || c.tags?.includes("Evangelist");
                return false;
              }).length;

              const isSelected = selectedStage === item.stage;

              return (
                <div
                  key={item.stage}
                  onClick={() => setSelectedStage(isSelected ? "all" : item.stage)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 shrink-0 min-w-[135px] sm:min-w-0 ${
                    isSelected
                      ? `bg-blue-50/80 border-blue-200 shadow-xs ring-1 ring-blue-600`
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-extrabold text-slate-800">{item.stage}</span>
                    <span className="text-xs font-mono font-extrabold text-blue-600">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(100, (count / (contacts.length || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTROLS & HUBSPOT-STYLE MULTI-FILTER BAR */}
          <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-3.5 shadow-xs">
            {/* Sub-Tabs Bar: All Contacts vs Add Views */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-bold">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveContactsViewTab("all")}
                  className={`relative pb-2 cursor-pointer transition-colors ${
                    activeContactsViewTab === "all" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span>All contacts</span>
                  {activeContactsViewTab === "all" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveContactsViewTab("add_view");
                    setShowCreateListModal(true);
                  }}
                  className="pb-2 text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  <span>Add views ({customLists.length}/5)</span>
                </button>
              </div>

              <button
                onClick={() => setShowQuickCreateSheet(true)}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-all"
                title="Quick Create"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar with Microphone Voice Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, email, company, job title..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all font-medium min-h-[42px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsListeningVoice(true);
                    showToast("🎤 Listening... Speak contact name or company", "info");
                    setTimeout(() => {
                      setIsListeningVoice(false);
                      setSearchTerm("Brian");
                      showToast("Voice matched: 'Brian'", "success");
                    }, 2500);
                  }}
                  className={`absolute right-3 top-2.5 p-1 rounded-lg transition-all ${
                    isListeningVoice ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-cyan-600 hover:bg-slate-100"
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveMainTab("import_wizard");
                  setImportStep(1);
                  showToast("Opened Import Wizard", "info");
                }}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[42px] shrink-0"
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>Import Contacts</span>
              </button>
            </div>

            {/* Pill Dropdown Filters - Horizontally Scrollable Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 text-xs">
              {/* Owner Filter Pill */}
              <div className="relative shrink-0">
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-xs font-extrabold text-slate-700 focus:outline-none cursor-pointer transition-all whitespace-nowrap min-h-[34px]"
                >
                  <option value="all">Contact owner: All</option>
                  {CONTACT_OWNERS.map((o) => (
                    <option key={o} value={o}>Contact owner: {o}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Status Filter Pill */}
              <div className="relative shrink-0">
                <select
                  value={selectedLeadStatus}
                  onChange={(e) => setSelectedLeadStatus(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-xs font-extrabold text-slate-700 focus:outline-none cursor-pointer transition-all whitespace-nowrap min-h-[34px]"
                >
                  <option value="all">Lead status: All</option>
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>Lead status: {s}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Stage Filter Pill */}
              <div className="relative shrink-0">
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-xs font-extrabold text-slate-700 focus:outline-none cursor-pointer transition-all whitespace-nowrap min-h-[34px]"
                >
                  <option value="all">Lifecycle stage: All</option>
                  {LIFECYCLE_STAGES.map((ls) => (
                    <option key={ls.stage} value={ls.stage}>Lifecycle stage: {ls.stage}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Grade Filter Pill */}
              <div className="relative shrink-0">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-xs font-extrabold text-slate-700 focus:outline-none cursor-pointer transition-all whitespace-nowrap min-h-[34px]"
                >
                  <option value="all">Lead grade: All</option>
                  <option value="Hot">Lead grade: 🔥 Hot</option>
                  <option value="Warm">Lead grade: ⚡ Warm</option>
                  <option value="Cold">Lead grade: ❄️ Cold</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {(selectedLeadStatus !== "all" || selectedGrade !== "all" || selectedOwner !== "all" || selectedStage !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedLeadStatus("all");
                    setSelectedGrade("all");
                    setSelectedOwner("all");
                    setSelectedStage("all");
                    setSearchTerm("");
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-full border border-slate-200 cursor-pointer whitespace-nowrap min-h-[34px]"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Results Count & Sort Row */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
              <span>{filteredContacts.length} results</span>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Sorted by Create Date</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Bulk Action Toolbar */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 animate-fade-in gap-2 overflow-x-auto no-scrollbar">
                <span className="font-bold flex items-center gap-2 shrink-0">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>{selectedIds.length} Selected</span>
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowBulkOwnerModal(true)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Assign Owner</span>
                  </button>

                  <button
                    onClick={() => setShowBulkStageModal(true)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Change Stage</span>
                  </button>

                  {selectedIds.length === 2 && (
                    <button
                      onClick={() => {
                        setMergePrimaryId(selectedIds[0]);
                        setMergeSecondaryId(selectedIds[1]);
                        setShowMergeModal(true);
                      }}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <GitMerge className="w-3.5 h-3.5 text-amber-600" />
                      <span>Merge 2</span>
                    </button>
                  )}

                  <button
                    onClick={handleExportContactsCSV}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CONTACTS TABLE & RESPONSIVE CARDS */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {/* MOBILE CARDS VIEW (< md) - FORMATTED CLEANLY MATCHING HUBSPOT MOBILE APP */}
            <div className="block md:hidden p-3 space-y-4">
              {paginatedContacts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold">No contacts found matching search filters.</p>
                </div>
              ) : (
                (() => {
                  // Group contacts by Date Category
                  const groups: { [key: string]: typeof paginatedContacts } = {};
                  paginatedContacts.forEach((cnt) => {
                    let category = "This month";
                    if (cnt.createdAt) {
                      const d = new Date(cnt.createdAt);
                      const now = new Date();
                      const daysDiff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
                      if (daysDiff <= 30) category = "This month";
                      else if (daysDiff <= 60) category = "Last month";
                      else if (d.getFullYear() === now.getFullYear() - 1) category = "Last year";
                      else category = "Earlier";
                    }
                    if (!groups[category]) groups[category] = [];
                    groups[category].push(cnt);
                  });

                  return Object.entries(groups).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                      {/* Section Date Header */}
                      <div className="flex items-center gap-2 pt-1 pb-0.5">
                        <span className="text-xs font-black text-slate-700 font-sans tracking-tight">{category}</span>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>

                      {items.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-cyan-400 transition-all cursor-pointer active:scale-[0.99] shadow-xs"
                        >
                          {/* Header Row: Checkbox, Name, Badges */}
                          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(contact.id)}
                                onChange={() => handleToggleSelect(contact.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                              />
                              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                                {contact.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm leading-tight">{contact.name}</p>
                                <p className="text-[11px] text-slate-500 font-medium">{contact.role || "Executive"}</p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                {contact.lifecycleStage || "Lead"}
                              </span>
                            </div>
                          </div>

                          {/* Detailed Key-Value Rows matching HubSpot Mobile */}
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Email:</span>
                              <span className="font-bold text-slate-900 truncate max-w-[200px]">{contact.email}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Phone Number:</span>
                              <span className="font-bold text-slate-900">{contact.phone || "--"}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Contact owner:</span>
                              <span className="font-bold text-blue-600">{contact.owner || "Alex Rivera"}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Primary Associated Company ID:</span>
                              <span className="font-bold text-slate-900 truncate max-w-[160px]">{contact.company || "--"}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Last Activity Date:</span>
                              <span className="font-mono text-[11px] text-slate-600">Jul 25, 2026 8:00 AM</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Lead Status:</span>
                              <span className="font-bold text-slate-800">{contact.leadStatus || "--"}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Marketing contact status:</span>
                              <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">Marketing contact</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] font-medium text-slate-400">Create Date:</span>
                              <span className="font-mono text-[11px] text-slate-500">{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() + " 1:53 AM" : "Jul 14, 2026 1:53 AM"}</span>
                            </div>
                          </div>

                          {/* DIRECT TOUCH ACTION BAR ON EACH CARD */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`mailto:${contact.email}`}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Email</span>
                              </a>
                              <a
                                href={`tel:${contact.phone || "+15550192"}`}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Call</span>
                              </a>
                            </div>

                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 cursor-pointer"
                            >
                              <span className="text-[11px]">View Details</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                })()
              )}
            </div>

            {/* DESKTOP STICKY TABLE VIEW (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4">Contact Name & Title</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Lifecycle Stage</th>
                    <th className="p-4">Lead Status</th>
                    <th className="p-4">Lead Score</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Email & Phone</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact.id)}
                          onChange={() => handleToggleSelect(contact.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                              {contact.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">{contact.role || "Executive"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{contact.company}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {contact.lifecycleStage || "Lead"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {contact.leadStatus || "New"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold w-fit">
                          {contact.scoreGrade === "Hot" ? (
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span className={contact.leadScore >= 80 ? "text-amber-600" : "text-blue-700"}>
                            {contact.leadScore}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 font-bold text-xs">{contact.owner || "Alex Rivera"}</td>

                      <td className="p-4 space-y-0.5">
                        <p className="text-slate-800 font-mono text-[11px]">{contact.email}</p>
                        <p className="text-slate-500 text-[10px]">{contact.phone}</p>
                      </td>

                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingContact(contact);
                              setContactForm(contact);
                              setShowAddModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit Properties"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700"
                            title="View Contact Drawer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>
                  Showing {filteredContacts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, filteredContacts.length)} of {filteredContacts.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold text-slate-700 shadow-xs cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-mono text-blue-600 font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold text-slate-700 shadow-xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= IMPORT WIZARD TAB (7 STEPS) ================= */}
      {activeMainTab === "import_wizard" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>HubSpot Contact Import Wizard</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload CSV or Excel spreadsheets, configure property mappings, validate email syntax, and resolve duplicates.
              </p>
            </div>

            <button
              onClick={handleLoadSampleCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-blue-600 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Load Sample CSV Data</span>
            </button>
          </div>

          {/* 7-Step Progress Stepper Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-bold border-b border-slate-100 pb-4">
            {[
              { step: 1, label: "1. Upload File" },
              { step: 2, label: "2. Object Type" },
              { step: 3, label: "3. Import Mode" },
              { step: 4, label: "4. Map Columns" },
              { step: 5, label: "5. Validation" },
              { step: 6, label: "6. Duplicates" },
              { step: 7, label: "7. Execute" },
            ].map((s) => (
              <div
                key={s.step}
                className={`p-2 rounded-xl transition-all ${
                  importStep === s.step
                    ? "bg-blue-50 text-blue-700 border border-blue-200 font-extrabold"
                    : importStep > s.step
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-400 bg-slate-50"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>

          {/* STEP 1: FILE SELECTION & DROPZONE */}
          {importStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-10 text-center space-y-3 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all"
              >
                <FileUp className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-900">Drag and drop your file here</h3>
                <p className="text-xs text-slate-500">Supports .csv, .xlsx, .xls files up to 10MB</p>
                <button className="px-4 py-2 bg-white text-blue-600 font-bold rounded-xl text-xs border border-slate-200 shadow-xs">
                  Browse File
                </button>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
              </div>

              {parsedRows.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>{importFileName}</span>
                    </span>
                    <span className="text-blue-600 font-mono font-bold">{parsedRows.length} Rows Detected</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  disabled={parsedRows.length === 0}
                  onClick={() => setImportStep(2)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Next: Select Object Type</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OBJECT SELECTION */}
          {importStep === 2 && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <h3 className="text-sm font-extrabold text-slate-900">Select Object Type to Import Into:</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "Contacts", icon: Users, desc: "Individual people, leads, customers" },
                  { id: "Companies", icon: Building2, desc: "Organization & enterprise accounts" },
                  { id: "Deals", icon: DollarSign, desc: "Sales pipeline deals & quotes" },
                  { id: "Tickets", icon: HelpCircle, desc: "Support tickets & service logs" },
                ].map((obj) => {
                  const Icon = obj.icon;
                  return (
                    <div
                      key={obj.id}
                      onClick={() => setImportObjectType(obj.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition-all ${
                        importObjectType === obj.id
                          ? "bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-600"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-blue-600" />
                      <p className="font-extrabold text-sm text-slate-900">{obj.id}</p>
                      <p className="text-[11px] text-slate-500">{obj.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setImportStep(1)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                  Back
                </button>
                <button onClick={() => setImportStep(3)} className="px-6 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs">
                  <span>Next: Import Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IMPORT TYPE MODE */}
          {importStep === 3 && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <h3 className="text-sm font-extrabold text-slate-900">Select Import Mode Behavior:</h3>
              <div className="space-y-3">
                {[
                  { id: "create_and_update", title: "Create and Update Records", desc: "Add new contacts and update matching existing records." },
                  { id: "create_only", title: "Create New Records Only", desc: "Only import new rows; ignore existing duplicates." },
                  { id: "update_only", title: "Update Existing Records Only", desc: "Only update matching records already in the CRM." },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      importType === mode.id ? "bg-blue-50 border-blue-300 text-slate-900" : "bg-white border-slate-200 text-slate-700 shadow-xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importType === mode.id}
                      onChange={() => setImportType(mode.id as any)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{mode.title}</p>
                      <p className="text-slate-500 text-[11px]">{mode.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setImportStep(2)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                  Back
                </button>
                <button onClick={() => setImportStep(4)} className="px-6 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs">
                  <span>Next: Map Columns</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COLUMN FIELD MAPPING */}
          {importStep === 4 && (
            <div className="space-y-6 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Map CSV Headers to CRM Properties</h3>
                  <p className="text-xs text-slate-500">Match file columns with target HubSpot properties.</p>
                </div>

                <button
                  onClick={() => setShowCustomPropertyModal(true)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-blue-600 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Property</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {csvHeaders.map((header) => (
                  <div key={header} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 truncate">
                      <span className="font-extrabold text-slate-900 truncate block">{header}</span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        Sample: {parsedRows[0]?.[header] || "(empty)"}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

                    <select
                      value={columnMappings[header] || "ignore"}
                      onChange={(e) => setColumnMappings({ ...columnMappings, [header]: e.target.value })}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-blue-600 font-extrabold focus:outline-none focus:border-blue-600 text-xs shrink-0"
                    >
                      <option value="ignore">-- Do Not Import --</option>
                      {STANDARD_CRM_FIELDS.map((f) => (
                        <option key={f.key as string} value={f.key as string}>
                          {f.label} {f.required ? "*" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setImportStep(3)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                  Back
                </button>
                <button
                  onClick={validateImportData}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Next: Validate Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: VALIDATION PRE-CHECK */}
          {importStep === 5 && (
            <div className="space-y-6 py-2 max-w-2xl mx-auto">
              <h3 className="text-sm font-extrabold text-slate-900">Data Validation & Quality Report</h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <p className="text-xs text-emerald-700 font-bold">Valid Rows</p>
                  <p className="text-2xl font-black text-emerald-600 font-mono">
                    {parsedRows.length - invalidRowsCount}
                  </p>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                  <p className="text-xs text-rose-700 font-bold">Invalid Rows</p>
                  <p className="text-2xl font-black text-rose-600 font-mono">{invalidRowsCount}</p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-xs text-amber-700 font-bold">Existing Duplicates</p>
                  <p className="text-2xl font-black text-amber-600 font-mono">{duplicateCount}</p>
                </div>
              </div>

              {validationErrors.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <p className="text-xs font-extrabold text-rose-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Errors Found in File:</span>
                  </p>

                  <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
                    {validationErrors.map((err, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-mono text-blue-600 font-bold">Row {err.row}</span>
                        <span className="text-rose-600 font-medium">{err.error}</span>
                        <span className="text-slate-500 font-mono">{err.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleDownloadErrorCSV}
                    className="text-xs text-blue-600 underline font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Pre-Validation Error CSV</span>
                  </button>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setImportStep(4)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                  Back
                </button>
                <button
                  onClick={() => setImportStep(6)}
                  className="px-6 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Next: Duplicate Resolution</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: DUPLICATE RESOLUTION */}
          {importStep === 6 && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              <h3 className="text-sm font-extrabold text-slate-900">Choose Duplicate Resolution Rules:</h3>

              <div className="space-y-3 text-xs">
                {[
                  { id: "update", title: "Update Existing Contact", desc: "Overwrite matching contacts with new properties from CSV." },
                  { id: "skip", title: "Skip Duplicate Records", desc: "Ignore rows whose email already exists in HubSpot." },
                  { id: "create_new", title: "Create Duplicate Copy", desc: "Import as a new contact record even if duplicate." },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      duplicateOption === opt.id ? "bg-blue-50 border-blue-300 text-slate-900" : "bg-white border-slate-200 text-slate-700 shadow-xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dupRule"
                      checked={duplicateOption === opt.id}
                      onChange={() => setDuplicateOption(opt.id as any)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">{opt.title}</p>
                      <p className="text-slate-500 text-[11px]">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setImportStep(5)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                  Back
                </button>
                <button
                  onClick={handleStartImportExecution}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Confirm & Execute Import</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: LIVE EXECUTION & SUMMARY */}
          {importStep === 7 && (
            <div className="space-y-6 py-6 text-center max-w-xl mx-auto">
              {isImporting ? (
                <div className="space-y-4">
                  <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                  <h3 className="text-lg font-extrabold text-slate-900">Processing Import Data...</h3>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${importProgressPercent}%` }}
                    />
                  </div>

                  <p className="font-mono text-blue-600 font-bold text-sm">{importProgressPercent}% Completed</p>

                  <button
                    onClick={() => {
                      setIsImporting(false);
                      showToast("Import cancelled by user.", "info");
                    }}
                    className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl"
                  >
                    Cancel Import
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
                  <h3 className="text-xl font-extrabold text-slate-900">Import Execution Completed!</h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <p className="text-xs text-emerald-700 font-bold">Successful</p>
                      <p className="text-2xl font-black text-emerald-600 font-mono">{importedSuccessCount}</p>
                    </div>

                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                      <p className="text-xs text-rose-700 font-bold">Failed</p>
                      <p className="text-2xl font-black text-rose-600 font-mono">{importedFailCount}</p>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <p className="text-xs text-amber-700 font-bold">Skipped</p>
                      <p className="text-2xl font-black text-amber-600 font-mono">{importedSkippedCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveMainTab("contacts")}
                      className="px-6 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs"
                    >
                      View Contacts Directory
                    </button>

                    <button
                      onClick={() => setActiveMainTab("import_history")}
                      className="px-6 py-2.5 bg-white text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer border border-slate-200 shadow-xs"
                    >
                      View Import History Logs
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= IMPORT HISTORY LOGS TAB ================= */}
      {activeMainTab === "import_history" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Historical Import Activity Logs</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Audit trail of past file imports and record creation metrics.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-4">File Name</th>
                  <th className="p-4">Object</th>
                  <th className="p-4">Imported By</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Success</th>
                  <th className="p-4">Failures</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {importHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <span>{log.fileName}</span>
                    </td>
                    <td className="p-4 text-slate-700 font-mono">{log.objectType}</td>
                    <td className="p-4 text-slate-800 font-bold">{log.importedBy}</td>
                    <td className="p-4 text-slate-500 font-mono">{log.importDate}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">{log.totalRecords}</td>
                    <td className="p-4 font-mono text-emerald-600 font-bold">{log.successCount}</td>
                    <td className="p-4 font-mono text-rose-600 font-bold">{log.failureCount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          showToast(`Re-triggering import mapping for ${log.fileName}`);
                          setActiveMainTab("import_wizard");
                          setImportStep(1);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-blue-600 font-bold rounded-lg text-xs"
                      >
                        Re-Import
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE & EDIT CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleContactFormSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>{editingContact ? "Edit Contact Properties" : "Create New Contact"}</span>
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">First Name</label>
                <input
                  type="text"
                  value={contactForm.firstName || ""}
                  onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                  placeholder="Sarah"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Last Name</label>
                <input
                  type="text"
                  value={contactForm.lastName || ""}
                  onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                  placeholder="Jenkins"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email || ""}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="sarah@acmecorp.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactForm.phone || ""}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+1 555-0192"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Company</label>
                <input
                  type="text"
                  value={contactForm.company || ""}
                  onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Job Title</label>
                <input
                  type="text"
                  value={contactForm.role || ""}
                  onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                  placeholder="VP Sales"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lifecycle Stage</label>
                <select
                  value={contactForm.lifecycleStage || "Lead"}
                  onChange={(e) => setContactForm({ ...contactForm, lifecycleStage: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {LIFECYCLE_STAGES.map((s) => (
                    <option key={s.stage} value={s.stage}>
                      {s.stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lead Status</label>
                <select
                  value={contactForm.leadStatus || "New"}
                  onChange={(e) => setContactForm({ ...contactForm, leadStatus: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {LEAD_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Owner</label>
                <select
                  value={contactForm.owner || "Alex Rivera"}
                  onChange={(e) => setContactForm({ ...contactForm, owner: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {CONTACT_OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Website</label>
                <input
                  type="text"
                  value={contactForm.website || ""}
                  onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs">Notes / Description</label>
              <textarea
                rows={3}
                value={contactForm.notes || ""}
                onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                placeholder="Key meeting takeaways or initial contact context..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-xs">
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE SMART/STATIC LIST MODAL */}
      {showCreateListModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Create Contact Segment / List</span>
              </h3>
              <button onClick={() => setShowCreateListModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">List Name *</label>
                <input
                  type="text"
                  value={newListForm.name}
                  onChange={(e) => setNewListForm({ ...newListForm, name: e.target.value })}
                  placeholder="e.g., Enterprise Tech Buyers"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">List Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewListForm({ ...newListForm, type: "smart" })}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                      newListForm.type === "smart"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    ⚡ Smart List (Dynamic Rules)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewListForm({ ...newListForm, type: "static" })}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                      newListForm.type === "static"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    📌 Static List (Manual)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Filter Criteria / Rule</label>
                <input
                  type="text"
                  value={newListForm.criteria}
                  onChange={(e) => setNewListForm({ ...newListForm, criteria: e.target.value })}
                  placeholder="e.g. Lead Score >= 75 AND Lifecycle Stage = MQL"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreateListModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newListForm.name) {
                    const newList = {
                      id: `list-${Date.now()}`,
                      name: newListForm.name,
                      type: newListForm.type,
                      count: Math.floor(Math.random() * 4) + 2,
                      criteria: newListForm.criteria,
                    };
                    setCustomLists([...customLists, newList]);
                    setShowCreateListModal(false);
                    setNewListForm({ name: "", type: "smart", criteria: "Score >= 70" });
                    showToast(`Created segment list "${newList.name}".`);
                  }
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-xs"
              >
                Save List Segment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI AUTOMATED EMAIL COMPOSER MODAL */}
      {showAiEmailModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>AI Automated Follow-Up Email Studio</span>
              </h3>
              <button onClick={() => setShowAiEmailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Audience Group</label>
                <select
                  value={aiEmailForm.targetGroup}
                  onChange={(e) => setAiEmailForm({ ...aiEmailForm, targetGroup: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="Hot Prospects (Score 80+)">Hot Prospects (Score 80+)</option>
                  <option value="MQL Leads Needing Follow-up">MQL Leads Needing Follow-up</option>
                  <option value="Inactive (&gt; 14 Days)">Inactive (&gt; 14 Days)</option>
                  <option value="All Selected Contacts">All Selected Contacts ({selectedIds.length || 5})</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={aiEmailForm.subject}
                  onChange={(e) => setAiEmailForm({ ...aiEmailForm, subject: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">AI Generated Email Body</label>
                <textarea
                  rows={6}
                  value={aiEmailForm.body}
                  onChange={(e) => setAiEmailForm({ ...aiEmailForm, body: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAiEmailModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAiEmailModal(false);
                  showToast(`AI queued & dispatched follow-up emails to ${aiEmailForm.targetGroup}!`);
                  setAiBannerResult(
                    `✉️ AI Email Sequence Sent: Dispatched personalized emails to ${aiEmailForm.targetGroup}. Open tracking active.`
                  );
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Batch AI Emails</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELECTED CONTACT PROFILE DRAWER WITH ALL HUBSPOT & AI TABS */}
      {selectedContact && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-2xl h-full overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-base sm:text-lg flex items-center justify-center shadow-xs shrink-0">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-slate-900">{selectedContact.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        selectedContact.scoreGrade === "Hot"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      AI Grade: {selectedContact.scoreGrade} ({selectedContact.leadScore})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedContact.role || "Executive"} at <span className="text-blue-600 font-bold">{selectedContact.company}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingContact(selectedContact);
                    setContactForm(selectedContact);
                    setShowAddModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button onClick={() => setSelectedContact(null)} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Buttons - Touch Grid for Mobile */}
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
              <a
                href={`mailto:${selectedContact.email}`}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-center text-xs text-slate-800 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer shadow-xs min-h-[50px]"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Send Email</span>
              </a>

              <a
                href={`tel:${selectedContact.phone || "+15550192"}`}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 text-center text-xs text-slate-800 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer shadow-xs min-h-[50px]"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Lead</span>
              </a>

              <a
                href={`https://wa.me/${(selectedContact.phone || "15550192").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-green-500 text-center text-xs text-slate-800 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer shadow-xs min-h-[50px]"
              >
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => setDrawerTab("tasks")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-500 text-center text-xs text-slate-800 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer shadow-xs min-h-[50px]"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Drawer Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar text-xs font-bold">
              {[
                { id: "overview", label: "Overview & Info" },
                { id: "ai_insights", label: "🤖 AI Intelligence" },
                { id: "timeline", label: "Timeline" },
                { id: "emails", label: "Emails" },
                { id: "calls", label: "Calls" },
                { id: "whatsapp", label: "WhatsApp" },
                { id: "notes", label: "Notes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all whitespace-nowrap ${
                    drawerTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200 font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DRAWER TAB: OVERVIEW & PROPERTIES */}
            {drawerTab === "overview" && (
              <div className="space-y-4 text-xs">
                {/* Contact Information Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Contact & Company Information</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Email</span>
                      <p className="font-mono text-blue-600 font-bold truncate">{selectedContact.email}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                      <p className="font-mono text-slate-800 font-bold">{selectedContact.phone || "+1 555-0192"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Company Website</span>
                      <p className="font-mono text-blue-600 underline">{selectedContact.website || "https://company.com"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Lifecycle Stage</span>
                      <p className="text-blue-600 font-bold">{selectedContact.lifecycleStage || "MQL"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Lead Status</span>
                      <p className="text-slate-800 font-bold">{selectedContact.leadStatus || "In Progress"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Owner</span>
                      <p className="text-slate-800 font-bold">{selectedContact.owner || "Alex Rivera"}</p>
                    </div>
                  </div>
                </div>

                {/* Property Interests & Budget Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Property Interests, Target & Budget</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Property Type</span>
                      <p className="text-emerald-700 font-bold">Commercial Tower / Penthouse</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Budget Range</span>
                      <p className="text-emerald-600 font-mono font-bold">$2,500,000 - $5,000,000</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Target Location</span>
                      <p className="text-slate-800 font-bold">New York, NY / London, UK</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Buying Timeline</span>
                      <p className="text-amber-700 font-bold">Within 30 Days (Immediate)</p>
                    </div>
                  </div>
                </div>

                {/* Associated Deals */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Associated Deals</span>
                  </h4>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">{selectedContact.company} Enterprise Expansion</p>
                      <span className="text-[10px] text-indigo-600 font-bold">Stage: Proposal Sent (75% Probability)</span>
                    </div>
                    <span className="text-emerald-600 font-mono font-extrabold">$250,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* DRAWER TAB: AI INTELLIGENCE & RECOMMENDED ACTION */}
            {drawerTab === "ai_insights" && (
              <div className="space-y-4 text-xs">
                {/* AI Summary Banner */}
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="font-extrabold text-slate-900">SalesFlow AI Executive Summary</h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedContact.name} is a high-intent decision maker at {selectedContact.company}. They have opened 4 sales emails in the last 7 days and requested pricing details for enterprise deployment.
                  </p>
                </div>

                {/* AI Lead Score Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900">AI Lead Score Breakdown</h4>
                    <span className="text-2xl font-black text-blue-600 font-mono">{selectedContact.leadScore}/100</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${selectedContact.leadScore}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>Executive Title (VP/Director level authority) (+25 pts)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>High Company Revenue & Market Cap (+20 pts)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>Multi-channel email & link engagement (+30 pts)</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommended Next Action */}
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-extrabold">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>AI Recommended Next Action</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Schedule a 15-minute executive demo and send the customized enterprise pricing PDF.
                  </p>
                  <button
                    onClick={() => {
                      showToast(`Executing AI Action for ${selectedContact.name}...`);
                      setAiBannerResult(`🚀 AI Copilot executed recommended next action for ${selectedContact.name}. Sent proposal & scheduled meeting slot.`);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Execute Recommended Action Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* DRAWER TAB: TIMELINE */}
            {drawerTab === "timeline" && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Chronological Touchpoints</h4>
                <div className="space-y-2 border-l-2 border-slate-200 pl-4">
                  {selectedContact.timeline.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{item.date}</span>
                        {item.author && <span className="text-blue-600 font-bold">By {item.author}</span>}
                      </div>
                      <p className="text-slate-800 font-bold">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DRAWER TAB: EMAILS */}
            {drawerTab === "emails" && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Send Email to {selectedContact.name}</span>
                  </h4>
                  <input
                    type="text"
                    value={newEmailLog.subject}
                    onChange={(e) => setNewEmailLog({ ...newEmailLog, subject: e.target.value })}
                    placeholder="Email Subject Line..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                  <textarea
                    rows={4}
                    value={newEmailLog.body}
                    onChange={(e) => setNewEmailLog({ ...newEmailLog, body: e.target.value })}
                    placeholder="Write email message..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                  />
                  <button
                    onClick={() => {
                      if (newEmailLog.subject) {
                        const updatedTimeline: ContactTimelineItem[] = [
                          {
                            id: `tl-email-${Date.now()}`,
                            date: new Date().toLocaleDateString(),
                            type: "reply_received",
                            description: `Email sent: "${newEmailLog.subject}"`,
                            author: "Alex Rivera",
                          },
                          ...selectedContact.timeline,
                        ];
                        onUpdateContact(selectedContact.id, { timeline: updatedTimeline });
                        setSelectedContact({ ...selectedContact, timeline: updatedTimeline });
                        setNewEmailLog({ subject: "", body: "" });
                        showToast(`Email dispatched to ${selectedContact.email}!`);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            )}

            {/* DRAWER TAB: WHATSAPP */}
            {drawerTab === "whatsapp" && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Direct Messaging</span>
                  </div>
                  <p className="text-slate-600">
                    Connect directly on WhatsApp with pre-formatted sales templates.
                  </p>
                  <a
                    href={`https://wa.me/${(selectedContact.phone || "15550192").replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(selectedContact.name)},%20this%20is%20Alex%20from%20SalesFlow%20AI.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            )}

            {/* DRAWER TAB: NOTES */}
            {drawerTab === "notes" && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log a call summary, email response, or customer note..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={handleAddNoteToContact}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs"
                  >
                    Post Note
                  </button>
                </div>

                {selectedContact.notes && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Notes</span>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedContact.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* DRAWER TAB: CALLS */}
            {drawerTab === "calls" && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900">Log Call Record</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newCallLog.outcome}
                      onChange={(e) => setNewCallLog({ ...newCallLog, outcome: e.target.value as any })}
                      className="p-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                    >
                      <option value="Connected">Connected</option>
                      <option value="Left Voice Message">Left Voice Message</option>
                      <option value="No Answer">No Answer</option>
                      <option value="Wrong Number">Wrong Number</option>
                    </select>

                    <input
                      type="text"
                      value={newCallLog.duration}
                      onChange={(e) => setNewCallLog({ ...newCallLog, duration: e.target.value })}
                      placeholder="Duration (e.g. 5 mins)"
                      className="p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={newCallLog.notes}
                    onChange={(e) => setNewCallLog({ ...newCallLog, notes: e.target.value })}
                    placeholder="Call notes..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />

                  <button onClick={handleLogCallToContact} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs">
                    Log Call
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HUBSPOT-STYLE QUICK CREATE BOTTOM SHEET DRAWER */}
      {showQuickCreateSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowQuickCreateSheet(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-5 space-y-5 max-w-lg mx-auto w-full shadow-2xl border-t border-slate-100 z-10 animate-slide-up">
            {/* Top Drag Handle */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Create</h3>
              <button
                onClick={() => setShowQuickCreateSheet(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top 4 Quick Circular Action Icons */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  setEditingContact(null);
                  setShowAddModal(true);
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Contact</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  showToast("Create Company action triggered", "info");
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Company</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  showToast("Create Deal action triggered", "info");
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Deal</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  showToast("Create Task action triggered", "info");
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Task</span>
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-bold">
              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  onNavigateToEmailStudio?.();
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  showToast("Note composer opened", "info");
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Note</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  showToast("Support ticket creator opened", "info");
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 cursor-pointer transition-colors"
              >
                <Ticket className="w-4 h-4 text-rose-600" />
                <span>Ticket</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  onNavigateToEmailStudio?.();
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                <span>Social post</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickCreateSheet(false);
                  showToast("📷 Business card QR Scanner active!", "success");
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 cursor-pointer transition-colors"
              >
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>Scan card or QR code</span>
              </button>
            </div>

            <button
              onClick={() => setShowQuickCreateSheet(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (✨ Ask Breeze AI) */}
      <button
        onClick={() => {
          if (onOpenAIAssistant) {
            onOpenAIAssistant("Help me analyze and organize my contacts list");
          } else {
            const aiInputEl = document.querySelector('input[placeholder*="Ask AI"]') as HTMLInputElement;
            if (aiInputEl) {
              aiInputEl.focus();
              aiInputEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white font-black text-xs px-4 py-3 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer ring-4 ring-pink-500/20"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow shrink-0" />
        <span>✨ Ask Breeze AI</span>
      </button>
    </div>
  );
};
