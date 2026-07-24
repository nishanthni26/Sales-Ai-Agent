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
  title: string;
  type: "trigger" | "action" | "condition" | "delay";
  detail: string;
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
  type: "email_opened" | "link_clicked" | "reply_received" | "meeting_booked" | "note_added" | "whatsapp_sent";
  description: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  leadScore: number;
  scoreGrade: "Hot" | "Warm" | "Cold";
  status: "lead" | "contacted" | "customer" | "churned";
  tags: string[];
  lastContacted: string;
  timeline: ContactTimelineItem[];
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  dealsCount: number;
  revenue: number;
}

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  contactName: string;
  value: number;
  stage: "lead" | "contacted" | "meeting" | "proposal" | "closed_won" | "closed_lost";
  probability: number;
  expectedClose: string;
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
  role: "user" | "assistant";
  text: string;
  options?: string[];
  step?: number;
  payload?: any;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
}
