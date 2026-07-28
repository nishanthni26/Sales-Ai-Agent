import React, { useState, useMemo } from "react";
import {
  Users, Search, Plus, Upload, Download, Filter, Check, X,
  Mail, Phone, Building2, Tag, Clock, CheckCircle2, AlertCircle,
  FileSpreadsheet, Flame, UserCheck, ArrowRight, TrendingUp, FileText,
  Calendar, DollarSign, ChevronRight, Edit, Trash2, Send, Sliders,
  CheckSquare, BarChart2, ShieldCheck, Zap, RotateCw, GitMerge, UserPlus,
  Globe, MapPin, PhoneCall, CalendarCheck, Layers, ChevronDown, Briefcase,
  ExternalLink, MessageSquare, Award, Activity, Bell, Eye, ListChecks, Repeat,
} from "lucide-react";
import Papa from "papaparse";
import {
  Contact, Company, Deal, Task, ImportHistoryRecord,
  ContactCallLog, ContactTimelineItem,
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

type LifecycleStage = "Subscriber" | "Lead" | "MQL" | "SQL" | "Opportunity" | "Customer" | "Evangelist";
type LeadStatus = "New" | "Open" | "In Progress" | "Open Deal" | "Unqualified" | "Attempted to Contact";

const LIFECYCLE_STAGES: { stage: LifecycleStage; color: string }[] = [
  { stage: "Subscriber", color: "text-slate-600" },
  { stage: "Lead", color: "text-blue-600" },
  { stage: "MQL", color: "text-indigo-600" },
  { stage: "SQL", color: "text-cyan-600" },
  { stage: "Opportunity", color: "text-amber-600" },
  { stage: "Customer", color: "text-emerald-600" },
  { stage: "Evangelist", color: "text-rose-600" },
];

const LEAD_STATUSES: LeadStatus[] = ["New", "Open", "In Progress", "Open Deal", "Unqualified", "Attempted to Contact"];
const CONTACT_OWNERS = ["Alex Rivera", "Sarah Jenkins", "Michael Vance", "Elena Rostova", "Unassigned"];

const STANDARD_CRM_FIELDS: { key: string; label: string; required?: boolean }[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email Address", required: true },
  { key: "phone", label: "Phone Number" },
  { key: "company", label: "Company Name" },
  { key: "role", label: "Job Title" },
  { key: "website", label: "Website URL" },
  { key: "city", label: "City" },
  { key: "state", label: "State / Region" },
  { key: "country", label: "Country" },
  { key: "lifecycleStage", label: "Lifecycle Stage" },
  { key: "leadStatus", label: "Lead Status" },
  { key: "owner", label: "Contact Owner" },
  { key: "industry", label: "Industry" },
  { key: "annualRevenue", label: "Annual Revenue" },
  { key: "notes", label: "Notes" },
];

export const ContactsHub: React.FC<ContactsHubProps> = ({
  contacts, companies, deals, tasks,
  onAddContact, onUpdateContact, onDeleteContact, onImportContacts,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<"contacts" | "import_wizard" | "import_history">("contacts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "score">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkOwnerModal, setShowBulkOwnerModal] = useState(false);
  const [showBulkStageModal, setShowBulkStageModal] = useState(false);
  const [bulkTargetOwner, setBulkTargetOwner] = useState("Alex Rivera");
  const [bulkTargetStage, setBulkTargetStage] = useState<LifecycleStage>("SQL");
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergePrimaryId, setMergePrimaryId] = useState("");
  const [mergeSecondaryId, setMergeSecondaryId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "timeline" | "notes" | "tasks" | "calls" | "emails" | "meetings">("overview");
  const [newNoteText, setNewNoteText] = useState("");
  const [newCallLog, setNewCallLog] = useState<{ duration: string; outcome: ContactCallLog["outcome"]; notes: string }>({ duration: "5 mins", outcome: "Connected", notes: "" });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListForm, setNewListForm] = useState({ name: "", type: "smart" as "smart" | "static", criteria: "Score >= 70" });
  const [customLists, setCustomLists] = useState<{ id: string; name: string; type: "smart" | "static"; count: number; criteria: string }[]>([
    { id: "list-1", name: "Hot Enterprise Prospects", type: "smart", count: 4, criteria: "Score >= 80" },
    { id: "list-2", name: "MQL Growth Accounts", type: "smart", count: 3, criteria: "Stage = MQL" },
    { id: "list-3", name: "Tech Industry Decision Makers", type: "smart", count: 5, criteria: "Industry = Technology" },
    { id: "list-4", name: "Q3 Priority Outbound", type: "static", count: 2, criteria: "Manual Tag" },
  ]);

  const [importStep, setImportStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [importObjectType, setImportObjectType] = useState<"Contacts" | "Companies" | "Deals" | "Tickets">("Contacts");
  const [importType, setImportType] = useState<"create_and_update" | "create_only" | "update_only">("create_and_update");
  const [importFileName, setImportFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [duplicateOption, setDuplicateOption] = useState<"skip" | "update" | "create_new" | "merge">("update");
  const [validationErrors, setValidationErrors] = useState<{ row: number; error: string; value: string }[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgressPercent, setImportProgressPercent] = useState(0);
  const [importedSuccessCount, setImportedSuccessCount] = useState(0);
  const [importedFailCount, setImportedFailCount] = useState(0);
  const [importedSkippedCount, setImportedSkippedCount] = useState(0);
  const [importHistory, setImportHistory] = useState<ImportHistoryRecord[]>([
    { id: "imp-101", fileName: "q2_b2b_leads.csv", objectType: "Contacts", importedBy: "Alex Rivera", importDate: "2026-07-24 14:30", totalRecords: 120, successCount: 118, failureCount: 2, skippedCount: 0, status: "Completed", errorLog: [{ row: 14, error: "Invalid Email", value: "john@company" }] },
    { id: "imp-100", fileName: "enterprise_accounts.xlsx", objectType: "Contacts", importedBy: "Sarah Jenkins", importDate: "2026-07-20 09:15", totalRecords: 45, successCount: 45, failureCount: 0, skippedCount: 0, status: "Completed" },
  ]);

  const [contactForm, setContactForm] = useState<Partial<Contact>>({
    firstName: "", lastName: "", name: "", email: "", phone: "", company: "",
    role: "Sales Director", website: "", city: "", state: "", country: "USA",
    lifecycleStage: "Lead", leadStatus: "New", owner: "Alex Rivera",
    industry: "Technology", annualRevenue: 1000000, notes: "", leadScore: 65,
    scoreGrade: "Warm", status: "lead", tags: ["Inbound Lead"],
  });

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const triggerRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
      const matchStage = selectedStage === "all" || c.lifecycleStage === selectedStage || (selectedStage === "MQL" && c.leadScore >= 60 && c.leadScore < 80) || (selectedStage === "SQL" && c.leadScore >= 80);
      const matchStatus = selectedLeadStatus === "all" || c.leadStatus === selectedLeadStatus;
      const matchGrade = selectedGrade === "all" || c.scoreGrade === selectedGrade;
      const matchOwner = selectedOwner === "all" || c.owner === selectedOwner;
      return matchSearch && matchStage && matchStatus && matchGrade && matchOwner;
    }).sort((a, b) => {
      if (sortBy === "name") return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return sortOrder === "asc" ? a.leadScore - b.leadScore : b.leadScore - a.leadScore;
    });
  }, [contacts, searchTerm, selectedStage, selectedLeadStatus, selectedGrade, selectedOwner, sortBy, sortOrder]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredContacts.length / pageSize) || 1;

  const handleToggleSelect = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? setSelectedIds(filteredContacts.map((c) => c.id)) : setSelectedIds([]);

  const handleBulkOwner = () => {
    selectedIds.forEach((id) => onUpdateContact(id, { owner: bulkTargetOwner }));
    showToast(`Assigned ${bulkTargetOwner} to ${selectedIds.length} contacts.`);
    setShowBulkOwnerModal(false); setSelectedIds([]);
  };
  const handleBulkStage = () => {
    selectedIds.forEach((id) => onUpdateContact(id, { lifecycleStage: bulkTargetStage }));
    showToast(`Updated stage to ${bulkTargetStage} for ${selectedIds.length} contacts.`);
    setShowBulkStageModal(false); setSelectedIds([]);
  };
  const handleBulkDelete = () => {
    if (!onDeleteContact) return;
    if (window.confirm(`Delete ${selectedIds.length} contacts?`)) {
      selectedIds.forEach((id) => onDeleteContact(id));
      showToast(`Deleted ${selectedIds.length} contacts.`);
      setSelectedIds([]);
    }
  };

  const handleExecuteMerge = () => {
    const primary = contacts.find((c) => c.id === mergePrimaryId);
    const secondary = contacts.find((c) => c.id === mergeSecondaryId);
    if (!primary || !secondary) return;
    onUpdateContact(primary.id, {
      ...primary,
      tags: Array.from(new Set([...primary.tags, ...secondary.tags, "Merged"])),
      timeline: [{ id: `tl-merge-${Date.now()}`, date: new Date().toLocaleDateString(), type: "status_change", description: `Merged with ${secondary.name}` }, ...primary.timeline, ...(secondary.timeline || [])],
    });
    if (onDeleteContact) onDeleteContact(secondary.id);
    showToast(`Merged ${secondary.name} into ${primary.name}`);
    setShowMergeModal(false); setMergePrimaryId(""); setMergeSecondaryId("");
  };

  const handleExportCSV = () => {
    const data = selectedIds.length > 0 ? contacts.filter((c) => selectedIds.includes(c.id)) : filteredContacts;
    const csv = Papa.unparse(data.map((c) => ({ Name: c.name, Email: c.email, Phone: c.phone, Company: c.company, Title: c.role, Stage: c.lifecycleStage || "Lead", Status: c.leadStatus || "New", Score: c.leadScore, Grade: c.scoreGrade, Owner: c.owner || "Alex Rivera" })));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.setAttribute("download", `contacts_export_${Date.now()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast(`Exported ${data.length} contacts.`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email) { showToast("Email is required.", "error"); return; }
    const fullName = `${contactForm.firstName || ""} ${contactForm.lastName || ""}`.trim() || contactForm.name || "New Contact";
    if (editingContact) {
      onUpdateContact(editingContact.id, { ...contactForm, name: fullName });
      showToast(`Updated ${fullName}`);
    } else {
      onAddContact({ ...contactForm, id: `cnt-${Date.now()}`, name: fullName, timeline: [{ id: `tl-${Date.now()}`, date: new Date().toLocaleDateString(), type: "note_added", description: "Contact created" }] });
      showToast(`Created ${fullName}`);
    }
    setShowAddModal(false); setEditingContact(null);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedContact) return;
    const updated = [{ id: `tl-${Date.now()}`, date: new Date().toLocaleDateString(), type: "note_added" as const, description: newNoteText, author: "Alex Rivera" }, ...selectedContact.timeline];
    onUpdateContact(selectedContact.id, { timeline: updated });
    setSelectedContact({ ...selectedContact, timeline: updated });
    setNewNoteText(""); showToast("Note added.");
  };

  const handleLogCall = () => {
    if (!selectedContact) return;
    const newCall: ContactCallLog = { id: `call-${Date.now()}`, date: new Date().toLocaleDateString(), duration: newCallLog.duration, outcome: newCallLog.outcome, notes: newCallLog.notes, loggedBy: "Alex Rivera" };
    const updatedCalls = [newCall, ...(selectedContact.calls || [])];
    const updatedTimeline = [{ id: `tl-call-${Date.now()}`, date: new Date().toLocaleDateString(), type: "call_logged" as const, description: `Call: ${newCallLog.outcome} (${newCallLog.duration})`, author: "Alex Rivera" }, ...selectedContact.timeline];
    onUpdateContact(selectedContact.id, { calls: updatedCalls, timeline: updatedTimeline });
    setSelectedContact({ ...selectedContact, calls: updatedCalls, timeline: updatedTimeline });
    setNewCallLog({ duration: "5 mins", outcome: "Connected", notes: "" });
    showToast("Call logged.");
  };

  const processCsv = (text: string, filename: string) => {
    Papa.parse(text, { header: true, skipEmptyLines: true, complete: (results) => {
      if (results.data && results.data.length > 0) {
        const rows = results.data as Record<string, string>[];
        const headers = Object.keys(rows[0]);
        setCsvHeaders(headers); setParsedRows(rows); setImportFileName(filename);
        const mappings: Record<string, string> = {};
        headers.forEach((h) => {
          const hl = h.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (hl.includes("email")) mappings[h] = "email";
          else if (hl.includes("firstname") || hl === "fname") mappings[h] = "firstName";
          else if (hl.includes("lastname") || hl === "lname") mappings[h] = "lastName";
          else if (hl.includes("phone")) mappings[h] = "phone";
          else if (hl.includes("company")) mappings[h] = "company";
          else if (hl.includes("title") || hl.includes("role") || hl.includes("job")) mappings[h] = "role";
          else if (hl.includes("stage") || hl.includes("lifecycle")) mappings[h] = "lifecycleStage";
          else if (hl.includes("status")) mappings[h] = "leadStatus";
          else if (hl.includes("country")) mappings[h] = "country";
          else if (hl.includes("city")) mappings[h] = "city";
          else if (hl.includes("owner")) mappings[h] = "owner";
          else mappings[h] = "ignore";
        });
        setColumnMappings(mappings);
      }
    }});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 10 * 1024 * 1024) { showToast("File exceeds 10MB.", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { const text = ev.target?.result as string; processCsv(text, file.name); };
    reader.readAsText(file);
  };

  const loadSampleCsv = () => {
    const sample = `First Name,Last Name,Email,Phone,Company,Job Title,Lifecycle Stage,Lead Status,Country\nSarah,Jenkins,sarah.j@acme.com,+1 555-0192,Acme Corp,VP Sales,MQL,In Progress,USA\nDavid,Miller,d.miller@fintech.io,+1 555-0283,FintechHub,CTO,SQL,Open Deal,UK\nElena,Rostova,elena@cloudscale.co,+1 555-0374,CloudScale,Head of Growth,Opportunity,Attempted to Contact,Canada\nMarcus,Vance,marcus.v@apex.io,+1 555-0465,Apex Global,SVP Enterprise,Customer,Open,Germany`;
    processCsv(sample, "sample_prospects.csv");
  };

  const validateData = () => {
    const errors: { row: number; error: string; value: string }[] = [];
    parsedRows.forEach((row, idx) => {
      const emailHeader = Object.keys(columnMappings).find((k) => columnMappings[k] === "email");
      const emailVal = emailHeader ? row[emailHeader]?.trim() : "";
      if (!emailVal) errors.push({ row: idx + 1, error: "Missing Email", value: "(empty)" });
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) errors.push({ row: idx + 1, error: "Invalid Email", value: emailVal });
    });
    setValidationErrors(errors); setImportStep(5);
  };

  const executeImport = () => {
    setIsImporting(true); setImportStep(7); setImportProgressPercent(0);
    let current = 0; const total = parsedRows.length;
    let success = 0, failed = 0, skipped = 0;
    const interval = setInterval(() => {
      current++; const row = parsedRows[current - 1];
      const emailHeader = Object.keys(columnMappings).find((k) => columnMappings[k] === "email");
      const emailVal = emailHeader ? row[emailHeader]?.trim() : "";
      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { failed++; }
      else {
        const isDup = contacts.some((c) => c.email.toLowerCase() === emailVal.toLowerCase());
        if (isDup && duplicateOption === "skip") { skipped++; }
        else {
          success++;
          const firstName = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "firstName") || ""] || "Contact";
          const lastName = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "lastName") || ""] || "";
          const company = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "company") || ""] || "Acme Inc";
          const role = row[Object.keys(columnMappings).find((k) => columnMappings[k] === "role") || ""] || "Executive";
          const newContact: Partial<Contact> = { id: `imp-${Date.now()}-${current}`, firstName, lastName, name: `${firstName} ${lastName}`.trim(), email: emailVal, company, role, lifecycleStage: "Lead", leadStatus: "New", owner: "Alex Rivera", leadScore: 70, scoreGrade: "Warm", status: "lead", tags: ["CSV Import"], lastContacted: "Just imported", timeline: [{ id: `tl-imp-${current}`, date: new Date().toLocaleDateString(), type: "status_change", description: `Imported via CSV (${importFileName})` }] };
          if (onImportContacts) onImportContacts([newContact]); else onAddContact(newContact);
        }
      }
      setImportedSuccessCount(success); setImportedFailCount(failed); setImportedSkippedCount(skipped);
      setImportProgressPercent(Math.round((current / total) * 100));
      if (current >= total) {
        clearInterval(interval); setIsImporting(false);
        setImportHistory([{ id: `imp-${Date.now()}`, fileName: importFileName, objectType: importObjectType, importedBy: "Current User", importDate: new Date().toISOString().slice(0, 16).replace("T", " "), totalRecords: total, successCount: success, failureCount: failed, skippedCount: skipped, status: "Completed" }, ...importHistory]);
        showToast(`Import complete: ${success} records added!`);
      }
    }, 80);
  };

  const metrics = useMemo(() => ({
    total: contacts.length,
    newThisWeek: contacts.filter((c) => c.tags?.includes("Inbound") || c.tags?.includes("Direct Entry")).length + 3,
    importedToday: contacts.filter((c) => c.tags?.includes("CSV Import")).length,
    duplicates: contacts.filter((c, idx, self) => self.findIndex((t) => t.email === c.email) !== idx).length,
    successRate: 98.4,
  }), [contacts]);

  const featureCards = [
    { id: "contact_mgmt", title: "Contact Management", icon: Users, description: "Centralized contact database with custom properties and field mapping.", tags: ["Custom Properties", "Field Mapping", "Contact Records", "Duplicate Detection", "Merge Contacts", "Bulk Edit", "Contact Timeline", "Activity Logging"], metrics: ["Contacts: " + metrics.total, "Properties: 16", "Duplicates: " + metrics.duplicates], actionLabel: "Manage Contacts" },
    { id: "lifecycle", title: "Lifecycle Stages", icon: TrendingUp, description: "Track contacts through lifecycle stages from Subscriber to Evangelist.", tags: ["Subscriber", "Lead", "MQL", "SQL", "Opportunity", "Customer", "Evangelist", "Stage Transitions"], metrics: ["Stages: 7", "MQLs: 3", "Customers: 2"], actionLabel: "View Lifecycle" },
    { id: "lead_scoring", title: "Lead Scoring", icon: Award, description: "Behavioral and demographic scoring with Hot/Warm/Cold grading.", tags: ["Behavioral Scoring", "Demographic Scoring", "Score Thresholds", "Hot/Warm/Cold", "Grade Models", "Score Decay", "Custom Score Fields", "Score Reports"], metrics: ["Hot: 4", "Warm: 5", "Cold: 2"], actionLabel: "Configure Scoring" },
    { id: "smart_lists", title: "Smart Lists & Segmentation", icon: Filter, description: "Dynamic smart lists and static lists with behavioral and demographic filters.", tags: ["Smart Lists", "Static Lists", "Behavioral Filters", "Demographic Filters", "List Combos", "Suppression Lists", "Saved Views", "Seed Lists"], metrics: ["Smart Lists: 4", "Segments: " + metrics.total, "Saved Views: 5"], actionLabel: "Manage Segments" },
    { id: "import_wizard", title: "Import Wizard", icon: Upload, description: "7-step CSV/Excel import with column mapping, validation, and duplicate handling.", tags: ["CSV Import", "Excel Import", "Column Mapping", "Email Validation", "Duplicate Handling", "Bulk Create", "Import History", "Error Reports"], metrics: ["Imports: 2", "Success: 98.4%", "Records: 165"], actionLabel: "Open Import Wizard" },
    { id: "companies", title: "Company Records", icon: Building2, description: "Account-level company records with associated contacts and deals.", tags: ["Company Profiles", "Domain Lookup", "Industry Tags", "Revenue Tracking", "Associated Contacts", "Deal Association", "Account Hierarchy", "Company Timeline"], metrics: ["Companies: " + companies.length, "Industries: 6", "Deals: " + deals.length], actionLabel: "View Companies" },
    { id: "contact_timeline", title: "Contact Timeline", icon: Activity, description: "Full activity timeline with notes, calls, emails, and meetings logging.", tags: ["Activity Feed", "Notes", "Call Logs", "Email Logs", "Meeting Logs", "File Attachments", "Status Changes", "Task Creation"], metrics: ["Activities: 420", "Notes: 84", "Calls: 120"], actionLabel: "View Timeline" },
    { id: "bulk_actions", title: "Bulk Actions", icon: CheckSquare, description: "Mass update owner, lifecycle stage, and delete with audit trail.", tags: ["Bulk Assign Owner", "Bulk Stage Update", "Bulk Delete", "Bulk Export", "Selection Tools", "Bulk Merge", "Mass Tags", "Batch Operations"], metrics: ["Selected: " + selectedIds.length, "Actions: 4", "Export: CSV"], actionLabel: "Bulk Actions" },
    { id: "merge_contacts", title: "Merge Duplicates", icon: GitMerge, description: "Identify and merge duplicate contacts with primary record selection.", tags: ["Duplicate Detection", "Primary Record", "Merge Fields", "Timeline Merge", "Tag Merge", "Notes Merge", "Audit Log", "Auto-Dedup"], metrics: ["Duplicates: " + metrics.duplicates, "Merged: 0", "Auto-Detect: On"], actionLabel: "Merge Contacts" },
    { id: "contact_owners", title: "Contact Ownership", icon: UserCheck, description: "Assign and manage contact owners with round-robin distribution rules.", tags: ["Owner Assignment", "Round Robin", "Workload Balance", "Owner Transfer", "Assignment Rules", "Auto-Assign", "Owner Reports", "Territory Rules"], metrics: ["Owners: 5", "Unassigned: 0", "Balance: 92%"], actionLabel: "Manage Owners" },
    { id: "export_data", title: "Export & Backup", icon: Download, description: "Export contacts to CSV with field selection and filter support.", tags: ["CSV Export", "Field Selection", "Filter Export", "Selected Export", "Full Backup", "Scheduled Export", "API Access", "Data Portability"], metrics: ["Exports: 12", "Format: CSV", "Fields: 10"], actionLabel: "Export Data" },
    { id: "notifications", title: "Contact Notifications", icon: Bell, description: "Real-time alerts for new contacts, stage changes, and engagement events.", tags: ["New Contact Alerts", "Stage Change Alerts", "Engagement Alerts", "Task Reminders", "Digest Emails", "Mobile Push", "Custom Triggers", "Notification Rules"], metrics: ["Alerts Today: 8", "Ack Rate: 94%", "Channels: 3"], actionLabel: "Configure Alerts" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-extrabold ${toastMessage.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : toastMessage.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
            {toastMessage.type === "error" ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Contacts</h1>
          <div className="flex items-center gap-3">
            <button onClick={triggerRefresh} className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"><RotateCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} /></button>
            <button onClick={() => { setEditingContact(null); setContactForm({ firstName: "", lastName: "", name: "", email: "", phone: "", company: "", role: "Sales Director", lifecycleStage: "Lead", leadStatus: "New", owner: "Alex Rivera", industry: "Technology", leadScore: 65, scoreGrade: "Warm", status: "lead", tags: ["Direct Entry"] }); setShowAddModal(true); }} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Contact</span><span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Manage contacts, lifecycle stages, segments, and import data.</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: "Total Contacts", value: metrics.total, icon: Users, color: "text-cyan-600" },
            { label: "New This Week", value: metrics.newThisWeek, icon: UserPlus, color: "text-emerald-600" },
            { label: "Imported Today", value: metrics.importedToday, icon: FileSpreadsheet, color: "text-indigo-600" },
            { label: "Duplicates", value: metrics.duplicates, icon: GitMerge, color: "text-amber-600" },
            { label: "Success Rate", value: `${metrics.successRate}%`, icon: ShieldCheck, color: "text-teal-600" },
          ].map((s, i) => { const Icon = s.icon; return (
            <div key={i} className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center gap-3 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200"><Icon className={`w-5 h-5 ${s.color}`} /></div>
              <div className="min-w-0"><p className="text-xl font-black text-slate-900 truncate">{s.value}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{s.label}</p></div>
            </div>
          ); })}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "contacts" as const, label: "Contacts Directory", icon: Users, count: filteredContacts.length },
            { id: "import_wizard" as const, label: "Import Wizard", icon: Upload, count: null },
            { id: "import_history" as const, label: "Import History", icon: Clock, count: importHistory.length },
          ].map((t) => { const Icon = t.icon; return (
            <button key={t.id} onClick={() => setActiveMainTab(t.id)} className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeMainTab === t.id ? "bg-cyan-500 text-slate-950 border border-cyan-400" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"}`}>
              <Icon className="w-3.5 h-3.5" /><span>{t.label}</span>
              {t.count !== null && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeMainTab === t.id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400"}`}>{t.count}</span>}
            </button>
          ); })}
        </div>
      </div>
      {activeMainTab === "contacts" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          <div className="flex sm:grid sm:grid-cols-7 gap-2.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
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
                <div key={item.stage} onClick={() => setSelectedStage(isSelected ? "all" : item.stage)} className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 shrink-0 min-w-[120px] sm:min-w-0 ${isSelected ? "bg-cyan-50 border-cyan-200 shadow-md ring-1 ring-cyan-500" : "bg-white border-slate-200/80 hover:border-slate-300 shadow-md"}`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[11px] font-extrabold ${item.color}`}>{item.stage}</span>
                    <span className="text-xs font-mono font-extrabold text-cyan-600">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (count / (contacts.length || 1)) * 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
          <div className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search name, email, company..." className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500 min-h-[42px]" />
              </div>
              <button onClick={() => { setActiveMainTab("import_wizard"); setImportStep(1); }} className="px-3.5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] shrink-0"><Upload className="w-4 h-4" /><span>Import</span></button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              {[
                { val: selectedOwner, set: setSelectedOwner, label: "Contact owner", options: CONTACT_OWNERS },
                { val: selectedLeadStatus, set: setSelectedLeadStatus, label: "Lead status", options: LEAD_STATUSES },
                { val: selectedStage, set: setSelectedStage, label: "Lifecycle stage", options: LIFECYCLE_STAGES.map((l) => l.stage) },
                { val: selectedGrade, set: setSelectedGrade, label: "Lead grade", options: ["Hot", "Warm", "Cold"] },
              ].map((f, fi) => (
                <div key={fi} className="relative shrink-0">
                  <select value={f.val} onChange={(e) => f.set(e.target.value)} className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-extrabold text-slate-700 focus:outline-none cursor-pointer whitespace-nowrap min-h-[34px]">
                    <option value="all">{f.label}: All</option>
                    {f.options.map((o) => <option key={o} value={o}>{f.label}: {o}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              ))}
              {(selectedLeadStatus !== "all" || selectedGrade !== "all" || selectedOwner !== "all" || selectedStage !== "all" || searchTerm) && (
                <button onClick={() => { setSelectedLeadStatus("all"); setSelectedGrade("all"); setSelectedOwner("all"); setSelectedStage("all"); setSearchTerm(""); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 cursor-pointer whitespace-nowrap">Reset</button>
              )}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
              <span>{filteredContacts.length} results</span>
              <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"><span>Sorted by Lead Score</span><ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} /></button>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 gap-2 overflow-x-auto no-scrollbar">
                <span className="font-bold flex items-center gap-2 shrink-0"><CheckSquare className="w-4 h-4 text-cyan-600" />{selectedIds.length} Selected</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setShowBulkOwnerModal(true)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"><UserCheck className="w-3.5 h-3.5 text-cyan-600" /><span>Assign Owner</span></button>
                  <button onClick={() => setShowBulkStageModal(true)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"><Layers className="w-3.5 h-3.5 text-indigo-600" /><span>Change Stage</span></button>
                  {selectedIds.length === 2 && <button onClick={() => { setMergePrimaryId(selectedIds[0]); setMergeSecondaryId(selectedIds[1]); setShowMergeModal(true); }} className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"><GitMerge className="w-3.5 h-3.5 text-amber-600" /><span>Merge 2</span></button>}
                  <button onClick={handleExportCSV} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"><Download className="w-3.5 h-3.5 text-emerald-600" /><span>Export</span></button>
                  <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"><Trash2 className="w-3.5 h-3.5 text-rose-600" /><span>Delete</span></button>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
            <div className="block md:hidden p-3 space-y-3">
              {paginatedContacts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs"><Users className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="font-bold">No contacts found.</p></div>
              ) : paginatedContacts.map((c) => (
                <div key={c.id} onClick={() => setSelectedContact(c)} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-cyan-400 transition-all cursor-pointer shadow-md">
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => handleToggleSelect(c.id)} onClick={(e) => e.stopPropagation()} className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 shrink-0" />
                      <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white font-black flex items-center justify-center text-sm shrink-0">{c.name.charAt(0)}</div>
                      <div><p className="font-black text-slate-900 text-sm">{c.name}</p><p className="text-[11px] text-slate-500">{c.role || "Executive"}</p></div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-50 text-cyan-700 border border-cyan-200 shrink-0">{c.lifecycleStage || "Lead"}</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-[11px]">Email:</span><span className="font-bold text-slate-900 truncate max-w-[200px]">{c.email}</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-[11px]">Phone:</span><span className="font-bold text-slate-900">{c.phone || "--"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-[11px]">Owner:</span><span className="font-bold text-cyan-600">{c.owner || "Alex Rivera"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-[11px]">Company:</span><span className="font-bold text-slate-900 truncate max-w-[160px]">{c.company}</span></div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <a href={`mailto:${c.email}`} className="px-2.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /><span className="text-[11px]">Email</span></a>
                      <a href={`tel:${c.phone}`} className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /><span className="text-[11px]">Call</span></a>
                    </div>
                    <button onClick={() => setSelectedContact(c)} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 cursor-pointer"><span className="text-[11px]">Details</span><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-10"><input type="checkbox" checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0} onChange={handleSelectAll} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" /></th>
                    <th className="p-4">Name & Title</th><th className="p-4">Company</th><th className="p-4">Stage</th><th className="p-4">Status</th><th className="p-4">Score</th><th className="p-4">Owner</th><th className="p-4">Email & Phone</th><th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedContacts.map((c) => (
                    <tr key={c.id} onClick={() => setSelectedContact(c)} className="hover:bg-cyan-50/40 transition-colors group cursor-pointer">
                      <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => handleToggleSelect(c.id)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" /></td>
                      <td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0">{c.name.charAt(0)}</div><div><p className="font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors">{c.name}</p><p className="text-[11px] text-slate-500">{c.role || "Executive"}</p></div></div></td>
                      <td className="p-4"><span className="font-bold text-slate-800 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" />{c.company}</span></td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">{c.lifecycleStage || "Lead"}</span></td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{c.leadStatus || "New"}</span></td>
                      <td className="p-4"><div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold w-fit">{c.scoreGrade === "Hot" ? <Flame className="w-3.5 h-3.5 text-amber-500" /> : <Zap className="w-3.5 h-3.5 text-cyan-600" />}<span className={c.leadScore >= 80 ? "text-amber-600" : "text-cyan-700"}>{c.leadScore}</span></div></td>
                      <td className="p-4 text-slate-700 font-bold text-xs">{c.owner || "Alex Rivera"}</td>
                      <td className="p-4 space-y-0.5"><p className="text-slate-800 font-mono text-[11px]">{c.email}</p><p className="text-slate-500 text-[10px]">{c.phone}</p></td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-end gap-1"><button onClick={() => { setEditingContact(c); setContactForm(c); setShowAddModal(true); }} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"><Edit className="w-3.5 h-3.5" /></button><button onClick={() => setSelectedContact(c)} className="p-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700"><ChevronRight className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2"><span>Rows per page:</span><select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><span>Showing {filteredContacts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredContacts.length)} of {filteredContacts.length}</span></div>
              <div className="flex items-center gap-2"><button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold text-slate-700 cursor-pointer">Previous</button><span className="font-mono text-cyan-600 font-bold">Page {currentPage} of {totalPages}</span><button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 font-bold text-slate-700 cursor-pointer">Next</button></div>
            </div>
          </div>
        </div>
      )}
      {activeMainTab === "import_wizard" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200/80 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div><h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Upload className="w-5 h-5 text-cyan-600" /><span>Contact Import Wizard</span></h2><p className="text-xs text-slate-500 mt-0.5">Upload CSV, map columns, validate, and handle duplicates.</p></div>
              <button onClick={loadSampleCsv} className="px-3.5 py-2 bg-slate-50 text-cyan-600 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer"><FileSpreadsheet className="w-4 h-4 text-emerald-600" /><span>Load Sample</span></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-bold border-b border-slate-100 pb-4">
              {[{s:1,l:"1. Upload"},{s:2,l:"2. Object"},{s:3,l:"3. Mode"},{s:4,l:"4. Map"},{s:5,l:"5. Validate"},{s:6,l:"6. Duplicates"},{s:7,l:"7. Execute"}].map((s) => (
                <div key={s.s} className={`p-2 rounded-xl ${importStep === s.s ? "bg-cyan-50 text-cyan-700 border border-cyan-200 font-extrabold" : importStep > s.s ? "text-emerald-700 bg-emerald-50" : "text-slate-400 bg-slate-50"}`}>{s.l}</div>
              ))}
            </div>
            {importStep === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto py-4">
                <div onClick={() => document.getElementById("file-input")?.click()} className="border-2 border-dashed border-slate-200 hover:border-cyan-500 rounded-2xl p-10 text-center space-y-3 cursor-pointer bg-slate-50/50 hover:bg-cyan-50/20 transition-all">
                  <Upload className="w-12 h-12 text-cyan-600 mx-auto" /><h3 className="text-base font-extrabold text-slate-900">Drag and drop your file here</h3><p className="text-xs text-slate-500">Supports .csv, .xlsx, .xls up to 10MB</p>
                  <input id="file-input" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                </div>
                {parsedRows.length > 0 && <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"><span className="font-bold text-slate-900 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-600" />{importFileName}</span><span className="text-cyan-600 font-mono font-bold">{parsedRows.length} Rows</span></div>}
                <div className="flex justify-end"><button disabled={parsedRows.length === 0} onClick={() => setImportStep(2)} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"><span>Next</span><ArrowRight className="w-4 h-4" /></button></div>
              </div>
            )}
            {importStep === 2 && (
              <div className="space-y-6 max-w-xl mx-auto py-4">
                <h3 className="text-sm font-extrabold text-slate-900">Select Object Type:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[{id:"Contacts",icon:Users,desc:"People, leads, customers"},{id:"Companies",icon:Building2,desc:"Organizations"},{id:"Deals",icon:DollarSign,desc:"Pipeline deals"},{id:"Tickets",icon:Tag,desc:"Support tickets"}].map((o) => { const Icon = o.icon; return (
                    <div key={o.id} onClick={() => setImportObjectType(o.id as any)} className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition-all ${importObjectType === o.id ? "bg-cyan-50 border-cyan-300 ring-1 ring-cyan-500" : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"}`}><Icon className="w-6 h-6 text-cyan-600" /><p className="font-extrabold text-sm text-slate-900">{o.id}</p><p className="text-[11px] text-slate-500">{o.desc}</p></div>
                  ); })}
                </div>
                <div className="flex justify-between pt-4"><button onClick={() => setImportStep(1)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Back</button><button onClick={() => setImportStep(3)} className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"><span>Next</span><ArrowRight className="w-4 h-4" /></button></div>
              </div>
            )}
            {importStep === 3 && (
              <div className="space-y-6 max-w-xl mx-auto py-4">
                <h3 className="text-sm font-extrabold text-slate-900">Select Import Mode:</h3>
                <div className="space-y-3">
                  {[{id:"create_and_update",t:"Create and Update",d:"Add new and update existing"},{id:"create_only",t:"Create New Only",d:"Only new rows"},{id:"update_only",t:"Update Existing Only",d:"Only matching records"}].map((m) => (
                    <label key={m.id} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${importType === m.id ? "bg-cyan-50 border-cyan-300" : "bg-white border-slate-200 shadow-xs"}`}><input type="radio" name="importMode" checked={importType === m.id} onChange={() => setImportType(m.id as any)} className="mt-1 text-cyan-600 focus:ring-cyan-500" /><div><p className="font-extrabold text-xs text-slate-900">{m.t}</p><p className="text-[11px] text-slate-500">{m.d}</p></div></label>
                  ))}
                </div>
                <div className="flex justify-between pt-4"><button onClick={() => setImportStep(2)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Back</button><button onClick={() => setImportStep(4)} className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"><span>Next</span><ArrowRight className="w-4 h-4" /></button></div>
              </div>
            )}
            {importStep === 4 && (
              <div className="space-y-6 max-w-2xl mx-auto py-4">
                <h3 className="text-sm font-extrabold text-slate-900">Map CSV Columns to Properties:</h3>
                <div className="space-y-2">
                  {csvHeaders.map((header) => (
                    <div key={header} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex-1"><p className="text-xs font-bold text-slate-900">{header}</p><p className="text-[10px] text-slate-500 font-mono">Sample: {parsedRows[0]?.[header] || "--"}</p></div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <select value={columnMappings[header] || "ignore"} onChange={(e) => setColumnMappings({ ...columnMappings, [header]: e.target.value })} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"><option value="ignore">-- Ignore --</option>{STANDARD_CRM_FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}{f.required ? " *" : ""}</option>)}</select>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4"><button onClick={() => setImportStep(3)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Back</button><button onClick={validateData} className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"><span>Next: Validate</span><ArrowRight className="w-4 h-4" /></button></div>
              </div>
            )}
            {importStep === 5 && (
              <div className="space-y-6 max-w-2xl mx-auto py-4">
                <h3 className="text-sm font-extrabold text-slate-900">Validation Results:</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center"><p className="text-2xl font-black text-emerald-700">{parsedRows.length - validationErrors.length}</p><p className="text-[10px] text-emerald-600 font-bold uppercase">Valid</p></div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center"><p className="text-2xl font-black text-rose-700">{validationErrors.length}</p><p className="text-[10px] text-rose-600 font-bold uppercase">Invalid</p></div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center"><p className="text-2xl font-black text-amber-700">0</p><p className="text-[10px] text-amber-600 font-bold uppercase">Duplicates</p></div>
                </div>
                {validationErrors.length > 0 && <div className="space-y-1.5 max-h-48 overflow-y-auto">{validationErrors.map((err, i) => <div key={i} className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" /><span className="font-bold text-rose-800">Row {err.row}:</span><span className="text-rose-700">{err.error}</span><span className="text-rose-500 font-mono truncate">"{err.value}"</span></div>)}</div>}
                <div className="flex justify-between pt-4"><button onClick={() => setImportStep(4)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Back</button><button onClick={() => setImportStep(6)} className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"><span>Next: Duplicates</span><ArrowRight className="w-4 h-4" /></button></div>
              </div>
            )}
            {importStep === 6 && (
              <div className="space-y-6 max-w-xl mx-auto py-4">
                <h3 className="text-sm font-extrabold text-slate-900">How should duplicates be handled?</h3>
                <div className="space-y-3">
                  {[{id:"skip",t:"Skip Duplicates",d:"Don't import matching rows"},{id:"update",t:"Update Existing",d:"Overwrite with new data"},{id:"create_new",t:"Create New Records",d:"Create separate contacts"},{id:"merge",t:"Merge Records",d:"Merge into existing timeline"}].map((o) => (
                    <label key={o.id} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${duplicateOption === o.id ? "bg-cyan-50 border-cyan-300" : "bg-white border-slate-200 shadow-xs"}`}><input type="radio" name="dup" checked={duplicateOption === o.id} onChange={() => setDuplicateOption(o.id as any)} className="mt-1 text-cyan-600 focus:ring-cyan-500" /><div><p className="font-extrabold text-xs text-slate-900">{o.t}</p><p className="text-[11px] text-slate-500">{o.d}</p></div></label>
                  ))}
                </div>
                <div className="flex justify-between pt-4"><button onClick={() => setImportStep(5)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Back</button><button onClick={() => setImportStep(7)} className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"><span>Next: Execute</span><ArrowRight className="w-4 h-4" /></button></div>
              </div>
            )}
            {importStep === 7 && (
              <div className="space-y-6 max-w-xl mx-auto py-4 text-center">
                {!isImporting && importProgressPercent === 0 ? (
                  <>
                    <h3 className="text-sm font-extrabold text-slate-900">Ready to Import</h3>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-left">
                      <div className="flex justify-between"><span className="text-slate-500">File:</span><span className="font-bold text-slate-900">{importFileName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Object:</span><span className="font-bold text-slate-900">{importObjectType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Rows:</span><span className="font-bold text-slate-900">{parsedRows.length}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Duplicates:</span><span className="font-bold text-slate-900">{duplicateOption}</span></div>
                    </div>
                    <div className="flex justify-between pt-4"><button onClick={() => setImportStep(6)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Back</button><button onClick={executeImport} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"><Zap className="w-5 h-5" /><span>Execute Import</span></button></div>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-extrabold text-slate-900">Importing...</h3>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200"><div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${importProgressPercent}%` }} /></div>
                    <p className="text-2xl font-black text-cyan-600">{importProgressPercent}%</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200"><p className="text-xl font-black text-emerald-700">{importedSuccessCount}</p><p className="text-[10px] text-emerald-600 font-bold uppercase">Success</p></div>
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200"><p className="text-xl font-black text-rose-700">{importedFailCount}</p><p className="text-[10px] text-rose-600 font-bold uppercase">Failed</p></div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200"><p className="text-xl font-black text-amber-700">{importedSkippedCount}</p><p className="text-[10px] text-amber-600 font-bold uppercase">Skipped</p></div>
                    </div>
                    {!isImporting && importProgressPercent === 100 && <button onClick={() => { setActiveMainTab("contacts"); setImportStep(1); setParsedRows([]); }} className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Done - View Contacts</button>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {activeMainTab === "import_history" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
          {importHistory.map((rec) => (
            <div key={rec.id} className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200/80 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div><h4 className="font-black text-slate-900 text-sm flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-600" />{rec.fileName}</h4><p className="text-[11px] text-slate-500">{rec.importDate} - by {rec.importedBy}</p></div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${rec.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{rec.status}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100"><p className="font-black text-slate-900 text-lg">{rec.totalRecords}</p><p className="text-[10px] text-slate-500 font-bold uppercase">Total</p></div>
                <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-100"><p className="font-black text-emerald-700 text-lg">{rec.successCount}</p><p className="text-[10px] text-emerald-600 font-bold uppercase">Success</p></div>
                <div className="text-center p-2 bg-rose-50 rounded-lg border border-rose-100"><p className="font-black text-rose-700 text-lg">{rec.failureCount}</p><p className="text-[10px] text-rose-600 font-bold uppercase">Failed</p></div>
                <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100"><p className="font-black text-amber-700 text-lg">{rec.skippedCount}</p><p className="text-[10px] text-amber-600 font-bold uppercase">Skipped</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6"><div className="border-b border-slate-800 pb-3"><h2 className="text-lg font-black text-white tracking-tight">Contact Tools</h2><p className="text-[11px] text-slate-500">{featureCards.length} modules for contact management</p></div></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {featureCards.map((card) => { const Icon = card.icon; return (
          <div key={card.id} className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md hover:border-cyan-200 transition-all">
            <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0 border border-slate-200"><Icon className="w-5 h-5" /></div><div className="min-w-0 flex-1"><h3 className="font-black text-slate-900 text-sm">{card.title}</h3><p className="text-[11px] text-slate-500 mt-0.5">{card.description}</p></div></div>
            <div className="flex flex-wrap gap-1.5">{card.tags.map((tag, idx) => <span key={idx} className="text-[10px] font-semibold bg-slate-50 text-slate-700 px-2 py-1 rounded-lg border border-slate-100">{tag}</span>)}</div>
            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100"><div className="flex items-center gap-3 flex-wrap">{card.metrics.map((m, idx) => <span key={idx} className="text-[10px] text-slate-500 font-semibold">{m}</span>)}</div><button onClick={() => alert(`Opening ${card.title}...`)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"><span>{card.actionLabel}</span><ArrowRight className="w-3.5 h-3.5" /></button></div>
          </div>
        ); })}
      </div>
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white font-black flex items-center justify-center text-lg shadow-md">{selectedContact.name.charAt(0)}</div>
                  <div><h2 className="font-black text-slate-900 text-base">{selectedContact.name}</h2><p className="text-xs text-slate-500">{selectedContact.role} at {selectedContact.company}</p><div className="flex items-center gap-1.5 mt-1"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">{selectedContact.lifecycleStage || "Lead"}</span><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{selectedContact.leadStatus || "New"}</span></div></div>
                </div>
                <button onClick={() => setSelectedContact(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar">
                {[{id:"overview"as const,l:"Overview",i:Eye},{id:"timeline"as const,l:"Timeline",i:Activity},{id:"notes"as const,l:"Notes",i:FileText},{id:"tasks"as const,l:"Tasks",i:CheckSquare},{id:"calls"as const,l:"Calls",i:PhoneCall},{id:"emails"as const,l:"Emails",i:Mail},{id:"meetings"as const,l:"Meetings",i:Calendar}].map((t) => { const Icon = t.i; return (
                  <button key={t.id} onClick={() => setDrawerTab(t.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${drawerTab === t.id ? "bg-cyan-500 text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}><Icon className="w-3.5 h-3.5" /><span>{t.l}</span></button>
                ); })}
              </div>
            </div>
            <div className="p-5 space-y-4">
              {drawerTab === "overview" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[{l:"Email",v:selectedContact.email,i:Mail},{l:"Phone",v:selectedContact.phone,i:Phone},{l:"Company",v:selectedContact.company,i:Building2},{l:"Owner",v:selectedContact.owner||"Alex Rivera",i:UserCheck},{l:"Lead Score",v:`${selectedContact.leadScore} (${selectedContact.scoreGrade})`,i:Award},{l:"Source",v:selectedContact.source||"Direct Entry",i:Tag},{l:"Industry",v:selectedContact.industry||"Technology",i:Briefcase},{l:"Last Contacted",v:selectedContact.lastContacted,i:Clock}].map((f,i) => { const Icon = f.i; return (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-1.5 text-slate-500 mb-1"><Icon className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase">{f.l}</span></div><p className="font-bold text-slate-900 text-xs">{f.v}</p></div>
                  ); })}
                  {selectedContact.tags?.length > 0 && <div className="col-span-2 pt-2"><p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tags</p><div className="flex flex-wrap gap-1.5">{selectedContact.tags.map((t,i) => <span key={i} className="px-2 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-lg text-[10px] font-bold">{t}</span>)}</div></div>}
                </div>
              )}
              {drawerTab === "timeline" && (
                <div className="space-y-2">
                  {(selectedContact.timeline||[]).map((item,i) => <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" /><div className="flex-1"><p className="text-xs font-bold text-slate-900">{item.description}</p><p className="text-[10px] text-slate-500">{item.date}{item.author ? ` - ${item.author}` : ""}</p></div></div>)}
                  {(!selectedContact.timeline||selectedContact.timeline.length===0) && <p className="text-xs text-slate-500 text-center py-4">No timeline events yet.</p>}
                </div>
              )}
              {drawerTab === "notes" && (
                <div className="space-y-3">
                  <div className="flex gap-2"><input type="text" value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Add a note..." className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /><button onClick={handleAddNote} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer">Add</button></div>
                  <div className="space-y-2">{(selectedContact.timeline||[]).filter((t) => t.type === "note_added").map((item,i) => <div key={i} className="p-3 bg-amber-50 rounded-xl border border-amber-100"><p className="text-xs font-bold text-slate-900">{item.description}</p><p className="text-[10px] text-slate-500">{item.date} - {item.author || "Alex Rivera"}</p></div>)}</div>
                </div>
              )}
              {drawerTab === "calls" && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select value={newCallLog.outcome} onChange={(e) => setNewCallLog({ ...newCallLog, outcome: e.target.value as any })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"><option>Connected</option><option>Left Voice Message</option><option>No Answer</option><option>Wrong Number</option><option>Busy</option></select>
                      <select value={newCallLog.duration} onChange={(e) => setNewCallLog({ ...newCallLog, duration: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"><option>5 mins</option><option>10 mins</option><option>15 mins</option><option>30 mins</option></select>
                    </div>
                    <input type="text" value={newCallLog.notes} onChange={(e) => setNewCallLog({ ...newCallLog, notes: e.target.value })} placeholder="Call notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-cyan-500" />
                    <button onClick={handleLogCall} className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer">Log Call</button>
                  </div>
                  <div className="space-y-2">{(selectedContact.calls||[]).map((call,i) => <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-900">{call.outcome}</span><span className="text-[10px] text-slate-500">{call.duration}</span></div>{call.notes && <p className="text-[11px] text-slate-600 mt-1">{call.notes}</p>}<p className="text-[10px] text-slate-500 mt-0.5">{call.date} - {call.loggedBy}</p></div>)}</div>
                </div>
              )}
              {drawerTab === "tasks" && (
                <div className="space-y-2">
                  {tasks.filter((t) => t.relatedTo === selectedContact.name || t.relatedTo === selectedContact.company).map((task,i) => <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2"><CheckSquare className={`w-4 h-4 ${task.completed ? "text-emerald-600" : "text-slate-400"}`} /><div className="flex-1"><p className={`text-xs font-bold ${task.completed ? "text-slate-500 line-through" : "text-slate-900"}`}>{task.title}</p><p className="text-[10px] text-slate-500">Due: {task.dueDate} - {task.assignee}</p></div></div>)}
                  {tasks.filter((t) => t.relatedTo === selectedContact.name || t.relatedTo === selectedContact.company).length === 0 && <p className="text-xs text-slate-500 text-center py-4">No tasks for this contact.</p>}
                </div>
              )}
              {drawerTab === "emails" && (
                <div className="space-y-2">
                  {(selectedContact.emails||[]).map((email,i) => <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-900">{email.subject}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${email.status === "Opened" ? "bg-emerald-50 text-emerald-700" : email.status === "Clicked" ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-600"}`}>{email.status}</span></div><p className="text-[11px] text-slate-600 mt-1">{email.body?.slice(0,100)}...</p><p className="text-[10px] text-slate-500 mt-0.5">{email.date}</p></div>)}
                  {(!selectedContact.emails||selectedContact.emails.length===0) && <p className="text-xs text-slate-500 text-center py-4">No emails logged.</p>}
                </div>
              )}
              {drawerTab === "meetings" && (
                <div className="space-y-2">
                  {(selectedContact.meetings||[]).map((m,i) => <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-900">{m.title}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.status === "Scheduled" ? "bg-cyan-50 text-cyan-700" : m.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{m.status}</span></div><p className="text-[10px] text-slate-500 mt-0.5">{m.dateTime} - {m.duration}</p></div>)}
                  {(!selectedContact.meetings||selectedContact.meetings.length===0) && <p className="text-xs text-slate-500 text-center py-4">No meetings scheduled.</p>}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex items-center gap-2 sticky bottom-0 bg-white">
              <a href={`mailto:${selectedContact.email}`} className="flex-1 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"><Mail className="w-4 h-4" /><span>Email</span></a>
              <a href={`tel:${selectedContact.phone}`} className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"><Phone className="w-4 h-4" /><span>Call</span></a>
              <button onClick={() => { setEditingContact(selectedContact); setContactForm(selectedContact); setShowAddModal(true); }} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"><Edit className="w-4 h-4" /><span>Edit</span></button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => { setShowAddModal(false); setEditingContact(null); }}>
          <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-base">{editingContact ? "Edit Contact" : "Add New Contact"}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingContact(null); }} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label><input type="text" value={contactForm.firstName || ""} onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label><input type="text" value={contactForm.lastName || ""} onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
              </div>
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">Email Address *</label><input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Phone</label><input type="text" value={contactForm.phone || ""} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Company</label><input type="text" value={contactForm.company || ""} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Job Title</label><input type="text" value={contactForm.role || ""} onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Industry</label><input type="text" value={contactForm.industry || ""} onChange={(e) => setContactForm({ ...contactForm, industry: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Lifecycle Stage</label><select value={contactForm.lifecycleStage || "Lead"} onChange={(e) => setContactForm({ ...contactForm, lifecycleStage: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs cursor-pointer">{LIFECYCLE_STAGES.map((ls) => <option key={ls.stage} value={ls.stage}>{ls.stage}</option>)}</select></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Lead Status</label><select value={contactForm.leadStatus || "New"} onChange={(e) => setContactForm({ ...contactForm, leadStatus: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs cursor-pointer">{LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Contact Owner</label><select value={contactForm.owner || "Alex Rivera"} onChange={(e) => setContactForm({ ...contactForm, owner: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs cursor-pointer">{CONTACT_OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Lead Score (0-100)</label><input type="number" min={0} max={100} value={contactForm.leadScore || 0} onChange={(e) => setContactForm({ ...contactForm, leadScore: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
              </div>
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">Notes</label><textarea value={contactForm.notes || ""} onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500 resize-none" /></div>
              <div className="flex gap-2 pt-2"><button type="button" onClick={() => { setShowAddModal(false); setEditingContact(null); }} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer">{editingContact ? "Save Changes" : "Create Contact"}</button></div>
            </form>
          </div>
        </div>
      )}
      {showBulkOwnerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowBulkOwnerModal(false)}>
          <div className="bg-white text-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 text-sm mb-3">Assign Owner to {selectedIds.length} Contacts</h3>
            <select value={bulkTargetOwner} onChange={(e) => setBulkTargetOwner(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer mb-4">{CONTACT_OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}</select>
            <div className="flex gap-2"><button onClick={() => setShowBulkOwnerModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">Cancel</button><button onClick={handleBulkOwner} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Assign</button></div>
          </div>
        </div>
      )}
      {showBulkStageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowBulkStageModal(false)}>
          <div className="bg-white text-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 text-sm mb-3">Change Stage for {selectedIds.length} Contacts</h3>
            <select value={bulkTargetStage} onChange={(e) => setBulkTargetStage(e.target.value as LifecycleStage)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer mb-4">{LIFECYCLE_STAGES.map((ls) => <option key={ls.stage} value={ls.stage}>{ls.stage}</option>)}</select>
            <div className="flex gap-2"><button onClick={() => setShowBulkStageModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">Cancel</button><button onClick={handleBulkStage} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Update</button></div>
          </div>
        </div>
      )}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMergeModal(false)}>
          <div className="bg-white text-slate-900 rounded-2xl p-5 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-2"><GitMerge className="w-4 h-4 text-amber-600" /><span>Merge Duplicate Contacts</span></h3>
            <p className="text-[11px] text-slate-500 mb-4">Select primary record. Secondary will be deleted and data merged.</p>
            <div className="space-y-2 mb-4">
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">Primary (keep)</label><select value={mergePrimaryId} onChange={(e) => setMergePrimaryId(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"><option value="">Select primary...</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.email}</option>)}</select></div>
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">Secondary (merge & delete)</label><select value={mergeSecondaryId} onChange={(e) => setMergeSecondaryId(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"><option value="">Select secondary...</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.email}</option>)}</select></div>
            </div>
            <div className="flex gap-2"><button onClick={() => setShowMergeModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">Cancel</button><button onClick={handleExecuteMerge} disabled={!mergePrimaryId || !mergeSecondaryId} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Merge</button></div>
          </div>
        </div>
      )}
      {showCreateListModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCreateListModal(false)}>
          <div className="bg-white text-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 text-sm mb-3">Create New List</h3>
            <div className="space-y-3 mb-4">
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">List Name</label><input type="text" value={newListForm.name} onChange={(e) => setNewListForm({ ...newListForm, name: e.target.value })} placeholder="e.g. Enterprise Prospects" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">List Type</label><select value={newListForm.type} onChange={(e) => setNewListForm({ ...newListForm, type: e.target.value as any })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"><option value="smart">Smart List (auto-updating)</option><option value="static">Static List (manual)</option></select></div>
              <div><label className="text-[10px] font-bold text-slate-500 uppercase">Criteria</label><input type="text" value={newListForm.criteria} onChange={(e) => setNewListForm({ ...newListForm, criteria: e.target.value })} placeholder="e.g. Score >= 70" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500" /></div>
            </div>
            <div className="flex gap-2"><button onClick={() => setShowCreateListModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">Cancel</button><button onClick={() => { if (newListForm.name) { setCustomLists([...customLists, { id: `list-${Date.now()}`, name: newListForm.name, type: newListForm.type, count: 0, criteria: newListForm.criteria }]); showToast(`Created list: ${newListForm.name}`); setShowCreateListModal(false); setNewListForm({ name: "", type: "smart", criteria: "Score >= 70" }); } }} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer">Create</button></div>
          </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-6 pb-6"><p className="text-xs text-slate-400 font-semibold">Account time zone</p><p className="text-xs font-bold text-slate-300">GMT-04:00</p></div>
    </div>
  );
};
