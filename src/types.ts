export type CampaignType =
  | "Email Marketing"
  | "WhatsApp Campaign"
  | "SMS Campaign"
  | "LinkedIn Outreach"
  | "Cold Email"
  | "Product Launch"
  | "Lead Nurturing"
  | "Webinar"
  | "Event Promotion"
  | "Customer Retention"
  | "Abandoned Cart"
  | "Re-engagement"
  | "Custom Campaign";

export type CampaignGoal =
  | "Generate Leads"
  | "Book Meetings"
  | "Increase Sales"
  | "Collect Registrations"
  | "Promote Offer"
  | "Customer Retention"
  | "Brand Awareness";

export interface UploadedAsset {
  id: string;
  name: string;
  type: "csv" | "logo" | "image" | "video" | "pdf" | "brochure" | "guidelines";
  size: string;
  url?: string;
  uploadedAt: string;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  subtype?: WorkflowSubtype;
  label?: string;
  title?: string;
  detail?: string;
  description?: string;
  config?: WorkflowNodeConfig;
  position?: { x: number; y: number };
}

export interface AudienceSegment {
  name: string;
  count: number;
  criteria: string;
}

export interface GeneratedCampaign {
  id: string;
  name: string;
  type: CampaignType;
  goal: CampaignGoal;
  businessDescription: string;
  status: "draft" | "scheduled" | "active" | "completed";
  customerPersona: {
    title: string;
    demography: string;
    painPoints: string[];
    goals: string[];
  };
  emailContent: {
    subjectLines: string[];
    preheader: string;
    body: string;
    cta: string;
    followUpEmails: { step: number; delayDays: number; subject: string; body: string }[];
  };
  landingPage: {
    headline: string;
    subheadline: string;
    bodyText: string;
    ctaText: string;
    features: string[];
  };
  whatsAppMessages: { step: number; text: string }[];
  smsContent: { step: number; text: string }[];
  linkedInMessages: { step: number; text: string }[];
  workflowNodes: WorkflowNode[];
  audienceSegments: AudienceSegment[];
  socialMediaPosts: { platform: string; text: string; hashtags: string }[];
  callScripts: { title: string; script: string; objectHandling: string }[];
  meetingBookingPage: { title: string; link: string; description: string; duration: string; availableSlots: string[] };
  sendSchedule: string;
  createdAt: string;
  metrics?: {
    sent: number;
    delivered: number;
    openRate: number;
    clickRate: number;
    replies: number;
    conversions: number;
    revenue: number;
    meetingsBooked: number;
  };
}

export interface ContactTimelineItem {
  id: string;
  date: string;
  type: "email_opened" | "link_clicked" | "reply_received" | "meeting_booked" | "note_added" | "whatsapp_sent" | "status_change" | "call_logged" | "task_created" | "file_attached";
  description: string;
  author?: string;
}

export interface ContactCallLog {
  id: string;
  date: string;
  duration: string;
  outcome: "Connected" | "Left Voice Message" | "No Answer" | "Wrong Number" | "Busy";
  notes: string;
  loggedBy: string;
}

export interface ContactEmailLog {
  id: string;
  date: string;
  subject: string;
  body: string;
  status: "Sent" | "Opened" | "Clicked" | "Bounced";
  sender: string;
}

export interface ContactMeetingLog {
  id: string;
  title: string;
  dateTime: string;
  duration: string;
  locationLink?: string;
  organizer: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface ContactAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Contact {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  mobile?: string;
  company: string;
  role: string; // Job Title
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  lifecycleStage?: "Subscriber" | "Lead" | "MQL" | "SQL" | "Opportunity" | "Customer" | "Evangelist";
  leadStatus?: "New" | "Open" | "In Progress" | "Open Deal" | "Unqualified" | "Attempted to Contact";
  leadScore: number;
  scoreGrade: "Hot" | "Warm" | "Cold";
  status: "lead" | "contacted" | "customer" | "churned";
  tags: string[];
  source?: string;
  owner?: string;
  industry?: string;
  annualRevenue?: number;
  notes?: string;
  customProperties?: Record<string, string>;
  createdAt?: string;
  lastContacted: string;
  timeline: ContactTimelineItem[];
  calls?: ContactCallLog[];
  emails?: ContactEmailLog[];
  meetings?: ContactMeetingLog[];
  attachments?: ContactAttachment[];
}

export interface ImportHistoryRecord {
  id: string;
  fileName: string;
  objectType: "Contacts" | "Companies" | "Deals" | "Tickets";
  importedBy: string;
  importDate: string;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  status: "Completed" | "Failed" | "In Progress" | "Cancelled";
  errorLog?: { row: number; error: string; value: string }[];
}

export interface Company {
  id: string;
  name: string;
  domain: string; // Website
  industry: string;
  size: string; // Employees
  revenue: number;
  location?: string;
  owner?: string;
  notes?: string;
  associatedContacts?: string[];
  dealsCount: number;
  createdAt?: string;
}

export type DealStage =
  | "lead" // New Lead
  | "contacted" // Contacted
  | "qualified" // Qualified
  | "meeting" // Meeting Scheduled
  | "proposal" // Proposal Sent
  | "negotiation" // Negotiation
  | "won" // Won
  | "closed_won" // Closed Won
  | "lost"; // Lost

export interface Deal {
  id: string;
  title: string; // Deal Name
  value: number;
  currency?: string;
  pipeline?: string;
  stage: DealStage;
  expectedClose: string;
  probability: number;
  owner?: string;
  companyName: string; // Associated Company
  contactName: string; // Associated Contact
  notes?: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  assignee: string;
  relatedTo: string;
}

export interface Meeting {
  id: string;
  title: string;
  contactName: string;
  company: string;
  dateTime: string;
  duration: string;
  link: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface CRMDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  uploadedAt: string;
}

export interface CRMNote {
  id: string;
  title: string;
  content: string;
  relatedEntityName: string;
  relatedEntityType: "contact" | "company" | "deal";
  tags: string[];
  createdAt: string;
  author: string;
}

export interface CRMActivity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "whatsapp" | "deal_moved";
  title: string;
  description: string;
  performedBy: string;
  relatedTo: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "system" | "user" | "assistant";
  text?: string;
  content?: string;
  options?: string[];
  step?: number;
  payload?: any;
  timestamp: string;
  modelUsed?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
}

// ================= WORKFLOW ENGINE TYPES =================
export type WorkflowNodeType = 'trigger' | 'delay' | 'condition' | 'action' | 'end';

export type WorkflowSubtype =
  // Triggers
  | 'contact_created'
  | 'form_submitted'
  | 'landing_page_submitted'
  | 'email_opened'
  | 'email_clicked'
  | 'deal_created'
  | 'deal_won'
  | 'deal_lost'
  | 'meeting_booked'
  | 'purchase_completed'
  | 'birthday'
  | 'anniversary'
  | 'manual_trigger'
  | 'webhook_trigger'
  | 'csv_import'
  // Delays
  | 'delay_duration'
  | 'wait_until'
  // Conditions
  | 'if_email_opened'
  | 'if_email_not_opened'
  | 'if_link_clicked'
  | 'if_deal_value_gt'
  | 'if_country'
  | 'if_tag_exists'
  | 'if_lead_score_gt'
  | 'if_purchase_completed'
  | 'if_meeting_booked'
  // Actions
  | 'send_email'
  | 'send_whatsapp'
  | 'send_sms'
  | 'push_notification'
  | 'create_deal'
  | 'update_contact'
  | 'assign_sales_rep'
  | 'create_task'
  | 'send_notification'
  | 'generate_ai_followup'
  | 'generate_proposal'
  | 'book_meeting'
  | 'generate_report'
  | 'lead_score'
  | 'webhook'
  | 'api_call'
  // End
  | 'end_workflow';

export interface WorkflowNodeConfig {
  delayHours?: number;
  delayDays?: number;
  emailSubject?: string;
  emailBody?: string;
  whatsappMessage?: string;
  smsMessage?: string;
  dealValueThreshold?: number;
  country?: string;
  tag?: string;
  leadScoreThreshold?: number;
  scoreChange?: number;
  assignedRep?: string;
  taskTitle?: string;
  webhookUrl?: string;
  aiPrompt?: string;
  [key: string]: any;
}

export interface PropertyListing {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: "Single Family" | "Condo" | "Penthouse" | "Commercial" | "Multi-Family" | "Land";
  status: "Active" | "Pending" | "Sold" | "Under Contract";
  images: string[];
  description: string;
  agentName: string;
  valuationEstimate: number;
  roiYield?: number;
  matchingBuyersCount: number;
  featured?: boolean;
  createdAt: string;
}

export type CRMContact = Contact;


export interface WorkflowEdge {
  id: string;
  source: string; // source node ID
  target: string; // target node ID
  label?: string; // e.g. "Yes", "No", "Next"
}

export interface WorkflowAnalytics {
  activeContacts: number;
  completedContacts: number;
  conversionRate: number;
  openRate: number;
  clickRate: number;
  revenueGenerated: number;
  goalCompletion: number;
  avgCompletionTime: string;
}

export interface WorkflowAutomation {
  id: string;
  userId?: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'paused' | 'draft' | 'published';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  analytics: WorkflowAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionLogEntry {
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  status: 'running' | 'completed' | 'failed' | 'waiting';
  currentStepNodeId?: string;
  logs: ExecutionLogEntry[];
  startedAt: string;
  completedAt?: string;
}

// ================= AI BACKEND & CHATBOT TYPES =================
export interface AISettings {
  ollamaUrl: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
}

export interface AILogEntry {
  id?: string;
  userId?: string;
  timestamp: string;
  prompt: string;
  model: string;
  responseTimeMs: number;
  response: string;
  status: 'success' | 'error';
  error?: string;
}


// ================= HUBSPOT HUBS TYPES =================
export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  contactName: string;
  company: string;
  priority: "high" | "medium" | "low" | "urgent";
  status: "new" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
  category: "Technical" | "Billing" | "Onboarding" | "Feature Request" | "Bug";
  createdAt: string;
  slaDeadline: string;
  assignedAgent: string;
  csatRating?: number;
  description?: string;
}

export interface SalesQuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface SalesQuote {
  id: string;
  quoteNumber: string;
  dealTitle: string;
  companyName: string;
  contactName: string;
  items: SalesQuoteItem[];
  subtotal: number;
  discountPercent: number;
  taxPercent: number;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  createdAt: string;
  validUntil: string;
  paymentTerms: string;
  notes?: string;
}

export interface MarketingSequence {
  id: string;
  name: string;
  type: "Email Drip" | "Nurture Sequence" | "Re-engagement" | "Product Launch" | "Onboarding";
  targetSegment: string;
  totalSteps: number;
  enrolledContacts: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  status: "active" | "paused" | "draft";
  createdAt: string;
}

export interface DataHealthIssue {
  id: string;
  type: "duplicate_contact" | "missing_phone" | "invalid_email" | "unassigned_owner" | "stale_lead";
  description: string;
  affectedRecord: string;
  severity: "high" | "medium" | "low";
  suggestedAction: string;
  autoFixable: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  model?: string;
}


