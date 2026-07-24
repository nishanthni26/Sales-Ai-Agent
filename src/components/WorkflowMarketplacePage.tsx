import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  Check,
  Plus,
  Heart,
  Eye,
  Zap,
  Star,
  Download,
  ArrowRight,
  TrendingUp,
  Mail,
  MessageSquare,
  Globe,
  FileText,
  Clock,
  Layers,
  Sliders,
  CheckCircle2,
  X,
  Play,
  Share2,
  Bot,
  Users,
  Target,
  ShoppingCart,
  Calendar,
  Gift,
  Award,
  BarChart3,
  RefreshCw,
  LucideIcon,
  ChevronRight,
  ShieldCheck,
  Send,
  SlidersHorizontal,
} from "lucide-react";

export type WorkflowCategory =
  | "all"
  | "lead_gen"
  | "email_mkt"
  | "whatsapp_mkt"
  | "sales_auto"
  | "cust_onboard"
  | "cust_retention"
  | "product_launch"
  | "webinar_camp"
  | "abandoned_cart"
  | "reengagement"
  | "event_promo"
  | "feedback_coll"
  | "referral_camp"
  | "upsell_camp"
  | "cross_sell";

export interface WorkflowCategoryItem {
  id: WorkflowCategory;
  name: string;
  iconName: string;
  count: number;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  type: "trigger" | "email" | "whatsapp" | "condition" | "delay" | "action";
  description: string;
}

export interface EmailTemplate {
  title: string;
  subjectLine: string;
  previewText: string;
}

export interface LandingPageTemplate {
  title: string;
  purpose: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: WorkflowCategory;
  categoryLabel: string;
  description: string;
  estimatedResults: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  channels: ("Email" | "WhatsApp" | "LinkedIn" | "Landing Page" | "CRM" | "SMS" | "Ads")[];
  rating: number;
  reviewsCount: number;
  downloads: number;
  aiRecommendationBadge?: string;
  installed: boolean;
  isFavorite: boolean;
  estimatedConversionRate: string;
  expectedDuration: string;
  workflowSteps: WorkflowStep[];
  emailsIncluded: EmailTemplate[];
  landingPages: LandingPageTemplate[];
  automationRules: string[];
}

export const WORKFLOW_CATEGORIES: WorkflowCategoryItem[] = [
  { id: "all", name: "All Workflows", iconName: "Layers", count: 18 },
  { id: "lead_gen", name: "Lead Generation", iconName: "Target", count: 3 },
  { id: "email_mkt", name: "Email Marketing", iconName: "Mail", count: 2 },
  { id: "whatsapp_mkt", name: "WhatsApp Marketing", iconName: "MessageSquare", count: 2 },
  { id: "sales_auto", name: "Sales Automation", iconName: "Zap", count: 2 },
  { id: "cust_onboard", name: "Customer Onboarding", iconName: "Users", count: 1 },
  { id: "cust_retention", name: "Customer Retention", iconName: "ShieldCheck", count: 1 },
  { id: "product_launch", name: "Product Launch", iconName: "Sparkles", count: 1 },
  { id: "webinar_camp", name: "Webinar Campaign", iconName: "Globe", count: 1 },
  { id: "abandoned_cart", name: "Abandoned Cart Recovery", iconName: "ShoppingCart", count: 1 },
  { id: "reengagement", name: "Re-engagement", iconName: "RefreshCw", count: 1 },
  { id: "event_promo", name: "Event Promotion", iconName: "Calendar", count: 1 },
  { id: "feedback_coll", name: "Feedback Collection", iconName: "BarChart3", count: 1 },
  { id: "referral_camp", name: "Referral Campaign", iconName: "Gift", count: 1 },
  { id: "upsell_camp", name: "Upsell Campaign", iconName: "TrendingUp", count: 1 },
  { id: "cross_sell", name: "Cross-sell Campaign", iconName: "Award", count: 1 },
];

export const INITIAL_WORKFLOWS: WorkflowTemplate[] = [
  {
    id: "wf-01",
    name: "Outbound B2B Hyper-Targeted Lead Engine",
    category: "lead_gen",
    categoryLabel: "Lead Generation",
    description: "Multi-channel prospecting engine linking intent data, AI custom intro lines, and multi-step follow-ups.",
    estimatedResults: "+38% Response Rate",
    difficulty: "Intermediate",
    channels: ["Email", "LinkedIn", "CRM"],
    rating: 4.9,
    reviewsCount: 312,
    downloads: 14800,
    aiRecommendationBadge: "AI Hot Choice",
    installed: true,
    isFavorite: true,
    estimatedConversionRate: "18.6%",
    expectedDuration: "14 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Intent Signal Trigger", type: "trigger", description: "Fires when target decision maker visits pricing page or hiring signals appear." },
      { stepNumber: 2, title: "AI Hyper-Personalized Email #1", type: "email", description: "Drafts email citing recent company milestone or tech stack." },
      { stepNumber: 3, title: "Wait 3 Business Days", type: "delay", description: "Monitors open & click engagements." },
      { stepNumber: 4, title: "LinkedIn Profile View & Connection", type: "action", description: "Automates soft LinkedIn touchpoint." },
      { stepNumber: 5, title: "WhatsApp Quick Check-in", type: "whatsapp", description: "If phone verified, sends friendly short update." },
      { stepNumber: 6, title: "Auto CRM Deal Creation", type: "action", description: "Moves replied prospect into Active Discovery stage in CRM." }
    ],
    emailsIncluded: [
      { title: "Intro Cold Touch", subjectLine: "Quick question regarding {{company}}'s Q3 growth strategy", previewText: "Hi {{firstName}}, noticed your team is expanding sales operations..." },
      { title: "Value Add Case Study", subjectLine: "How {{competitor}} scaled outbound leads by 3.4x", previewText: "Thought you'd find this breakdown interesting..." },
      { title: "Breakup / Soft Ask", subjectLine: "Closing the loop for now?", previewText: "Should I check back next quarter, {{firstName}}?" }
    ],
    landingPages: [
      { title: "B2B Sales Co-Pilot Demo Landing Page", purpose: "High-converting interactive interactive video demo page." }
    ],
    automationRules: [
      "Stop campaign immediately if prospect replies or books meeting.",
      "If lead score is > 85, auto-assign to Enterprise AE.",
      "Exclude existing open deal contacts."
    ]
  },
  {
    id: "wf-02",
    name: "Autonomous High-Intent Cold Email Sequence",
    category: "email_mkt",
    categoryLabel: "Email Marketing",
    description: "Spintax-rotated cold email drip with dynamic ROI calculators and automated meeting link injection.",
    estimatedResults: "3.2x Meetings Booked",
    difficulty: "Beginner",
    channels: ["Email", "CRM"],
    rating: 4.8,
    reviewsCount: 245,
    downloads: 18900,
    aiRecommendationBadge: "Top Rated",
    installed: true,
    isFavorite: false,
    estimatedConversionRate: "22.4%",
    expectedDuration: "10 Days",
    workflowSteps: [
      { stepNumber: 1, title: "New CSV Import or CRM Lead", type: "trigger", description: "Triggers on newly qualified status." },
      { stepNumber: 2, title: "Deliverability Warmup & Spintax Email", type: "email", description: "Uses inbox rotation to ensure 99% inbox placement." },
      { stepNumber: 3, title: "Condition: Opened Email?", type: "condition", description: "If opened within 24 hrs, branch to High Interest nurture." },
      { stepNumber: 4, title: "Follow-up #2 with Dynamic Case Study", type: "email", description: "Sends tailored industry case study." }
    ],
    emailsIncluded: [
      { title: "Problem Hook", subjectLine: "Automating {{company}}'s lead pipeline", previewText: "Most sales leaders spend 14 hours/week on manual CRM entry..." },
      { title: "Social Proof", subjectLine: "Result breakdown for {{industry}} teams", previewText: "Here is how 400+ teams solved pipeline leakage..." }
    ],
    landingPages: [
      { title: "ROI Calculator Page", purpose: "Interactive calculator showing potential revenue lift." }
    ],
    automationRules: [
      "Throttle sending rate to max 50 emails per sender domain per day.",
      "Automatically scrub unverified email addresses."
    ]
  },
  {
    id: "wf-03",
    name: "Instant WhatsApp Conversational Broadcast & Bot",
    category: "whatsapp_mkt",
    categoryLabel: "WhatsApp Marketing",
    description: "High-converting WhatsApp campaign with interactive buttons, instant AI Q&A, and calendar booking.",
    estimatedResults: "94% Open Rate",
    difficulty: "Beginner",
    channels: ["WhatsApp", "CRM", "SMS"],
    rating: 4.9,
    reviewsCount: 188,
    downloads: 12300,
    aiRecommendationBadge: "High Conversion",
    installed: false,
    isFavorite: true,
    estimatedConversionRate: "31.0%",
    expectedDuration: "3 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Broadcast Trigger", type: "trigger", description: "Sends approved WhatsApp template message." },
      { stepNumber: 2, title: "Interactive Quick Reply Buttons", type: "whatsapp", description: "Options: [Book Demo] [Pricing] [Talk to Agent]" },
      { stepNumber: 3, title: "AI WhatsApp Assistant Auto-Reply", type: "action", description: "Gemini AI answers product queries in under 5 seconds." },
      { stepNumber: 4, title: "Calendar Booking Link Delivery", type: "whatsapp", description: "Sends personalized single-click Google Meet invite." }
    ],
    emailsIncluded: [],
    landingPages: [
      { title: "WhatsApp Direct VIP Booking Page", purpose: "Mobile-optimized frictionless calendar booking page." }
    ],
    automationRules: [
      "Respect WhatsApp opt-out 'STOP' commands automatically.",
      "Sync all chat transcript directly into CRM lead timeline."
    ]
  },
  {
    id: "wf-04",
    name: "Inbound Lead Speed-to-Lead Instant Response",
    category: "sales_auto",
    categoryLabel: "Sales Automation",
    description: "Responds to website lead forms within 60 seconds via SMS, WhatsApp, and auto-calendar assignment.",
    estimatedResults: "7x Contact Rate",
    difficulty: "Intermediate",
    channels: ["Email", "WhatsApp", "SMS", "CRM"],
    rating: 4.9,
    reviewsCount: 410,
    downloads: 21500,
    aiRecommendationBadge: "Recommended B2B",
    installed: true,
    isFavorite: true,
    estimatedConversionRate: "41.2%",
    expectedDuration: "1 Hour",
    workflowSteps: [
      { stepNumber: 1, title: "Form Submission Trigger", type: "trigger", description: "Fires when prospect submits Demo Request form." },
      { stepNumber: 2, title: "Instant SMS & Email Acknowledgement", type: "email", description: "Sends instant confirmation with AE calendar." },
      { stepNumber: 3, title: "WhatsApp Instant Voice Note / Message", type: "whatsapp", description: "Welcomes lead directly on WhatsApp." },
      { stepNumber: 4, title: "Round-Robin Sales Rep Notification", type: "action", description: "Pings rep on Slack/Teams with lead profile." }
    ],
    emailsIncluded: [
      { title: "Instant Form Reply", subjectLine: "Thanks for reaching out, {{firstName}}! Let's connect", previewText: "We received your request. Select a time below that works best for you..." }
    ],
    landingPages: [
      { title: "Thank You & Calendar Booking Page", purpose: "Embeds calendar picker immediately post-submit." }
    ],
    automationRules: [
      "Execute initial SMS within 45 seconds of form fill.",
      "Re-route lead if assigned rep does not respond within 5 minutes."
    ]
  },
  {
    id: "wf-05",
    name: "SaaS VIP Customer Onboarding & Product Adoption",
    category: "cust_onboard",
    categoryLabel: "Customer Onboarding",
    description: "Guides new signups through key feature milestones, triggering celebratory messages and proactive CS outreach.",
    estimatedResults: "+45% Activation",
    difficulty: "Intermediate",
    channels: ["Email", "CRM", "Landing Page"],
    rating: 4.7,
    reviewsCount: 129,
    downloads: 9400,
    installed: false,
    isFavorite: false,
    estimatedConversionRate: "58.0%",
    expectedDuration: "21 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Account Created Trigger", type: "trigger", description: "Fires on new workspace activation." },
      { stepNumber: 2, title: "Day 1 Welcome & Setup Guide", type: "email", description: "Sends interactive 3-step setup video." },
      { stepNumber: 3, title: "Milestone Check: First Campaign Launched?", type: "condition", description: "If no, send troubleshooting guide on Day 3." },
      { stepNumber: 4, title: "CS Manager Intro Call Invite", type: "email", description: "Invites account owner to 1-on-1 strategy session." }
    ],
    emailsIncluded: [
      { title: "Welcome to SalesFlow", subjectLine: "Welcome aboard! Here's your 5-minute quickstart guide", previewText: "We're thrilled to have you! Let's set up your first AI agent..." },
      { title: "Feature Nudge", subjectLine: "Did you know you can connect WhatsApp in 1 click?", previewText: "Here is how to unlock WhatsApp automation..." }
    ],
    landingPages: [
      { title: "Product Onboarding Hub", purpose: "Interactive checklist and video library for new users." }
    ],
    automationRules: [
      "Alert Customer Success manager if key activation milestone missed by Day 5.",
      "Gradually increase product tips based on user activity logs."
    ]
  },
  {
    id: "wf-06",
    name: "Proactive Churn Prevention & Account Health Guard",
    category: "cust_retention",
    categoryLabel: "Customer Retention",
    description: "Monitors declining usage metrics and automatically triggers retention offers and executive check-ins.",
    estimatedResults: "-28% Churn Risk",
    difficulty: "Advanced",
    channels: ["Email", "CRM", "WhatsApp"],
    rating: 4.8,
    reviewsCount: 96,
    downloads: 7200,
    installed: false,
    isFavorite: false,
    estimatedConversionRate: "34.5%",
    expectedDuration: "30 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Health Score Drops < 50", type: "trigger", description: "Triggers when account login frequency drops 50% MoM." },
      { stepNumber: 2, title: "Exec Check-in Email from Founder/VP", type: "email", description: "Sends high-priority personal check-in." },
      { stepNumber: 3, title: "Task: CS Audit Account Usage", type: "action", description: "Assigns urgent review task to CSM." },
      { stepNumber: 4, title: "VIP Strategy Session Offer", type: "whatsapp", description: "Offers free training or feature unlock." }
    ],
    emailsIncluded: [
      { title: "Executive Check-in", subjectLine: "How are things going with {{company}}'s SalesFlow setup?", previewText: "Noticed activity has slowed down recently and wanted to reach out directly..." }
    ],
    landingPages: [
      { title: "VIP Strategy Booking Page", purpose: "Direct calendar access for executive consultation." }
    ],
    automationRules: [
      "Flag account as High Risk in CRM dashboard.",
      "Pause automated upgrade emails while account is unhealthy."
    ]
  },
  {
    id: "wf-07",
    name: "Product Launch Buzz & VIP Early Access Blitz",
    category: "product_launch",
    categoryLabel: "Product Launch",
    description: "3-phase launch campaign building waitlist hype, teaser content, live launch event, and limited-time offer.",
    estimatedResults: "$120k Launch Pipeline",
    difficulty: "Intermediate",
    channels: ["Email", "WhatsApp", "LinkedIn", "Landing Page", "Ads"],
    rating: 4.9,
    reviewsCount: 280,
    downloads: 16100,
    aiRecommendationBadge: "Viral Hype",
    installed: false,
    isFavorite: true,
    estimatedConversionRate: "28.9%",
    expectedDuration: "14 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Teaser Reveal Email & Waitlist Form", type: "email", description: "Announces upcoming release with exclusive countdown timer." },
      { stepNumber: 2, title: "WhatsApp VIP Access Code", type: "whatsapp", description: "Sends early unlock code 24 hours prior to public launch." },
      { stepNumber: 3, title: "Launch Day Announcement Blitz", type: "email", description: "Full feature breakdown email with live demo video." },
      { stepNumber: 4, title: "48-Hour Urgency Closing Reminder", type: "email", description: "Reminds prospects of early-bird pricing expiry." }
    ],
    emailsIncluded: [
      { title: "Teaser", subjectLine: "Something massive is coming to sales automation...", previewText: "Be the first to get early access before the public release..." },
      { title: "Official Launch", subjectLine: "It's live! Meet SalesFlow AI Marketplace", previewText: "Deploy 11 autonomous sales agents with one click..." }
    ],
    landingPages: [
      { title: "Product Launch VIP Waitlist Page", purpose: "Countdown timer and instant referral link generator." },
      { title: "Feature Showcase Landing Page", purpose: "Interactive feature comparison and launch pricing tiers." }
    ],
    automationRules: [
      "Auto-tag waitlist subscribers with 'VIP Launch'."
    ]
  },
  {
    id: "wf-08",
    name: "Webinar Registration, Attendance Boost & Sales Follow-up",
    category: "webinar_camp",
    categoryLabel: "Webinar Campaign",
    description: "Complete lifecycle for webinars: landing page conversion, SMS reminders, post-event replay, and proposal outreach.",
    estimatedResults: "62% Attendance Rate",
    difficulty: "Intermediate",
    channels: ["Email", "WhatsApp", "SMS", "Landing Page"],
    rating: 4.8,
    reviewsCount: 154,
    downloads: 11400,
    installed: false,
    isFavorite: false,
    estimatedConversionRate: "25.1%",
    expectedDuration: "7 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Webinar Registration Trigger", type: "trigger", description: "Generates unique calendar ICS link." },
      { stepNumber: 2, title: "24-Hour & 1-Hour SMS Reminder", type: "action", description: "Sends direct join link to mobile." },
      { stepNumber: 3, title: "Attended vs Missed Branch", type: "condition", description: "Splits attendees vs no-shows automatically." },
      { stepNumber: 4, title: "Replay & Pitch Offer Sequence", type: "email", description: "Sends recording + special webinar discount offer." }
    ],
    emailsIncluded: [
      { title: "Registration Confirmation", subjectLine: "You're in! Webinar details inside", previewText: "Add this event to your calendar..." },
      { title: "Post-Webinar Replay", subjectLine: "Webinar replay + slide deck attached", previewText: "In case you missed any part of today's live session..." }
    ],
    landingPages: [
      { title: "High-Converting Webinar Registration Page", purpose: "Speaker bios, agenda, and 1-click registration." }
    ],
    automationRules: [
      "Sync zoom/webinar attendee logs into CRM timeline."
    ]
  },
  {
    id: "wf-09",
    name: "High-Yield Abandoned Cart & Checkout Recovery",
    category: "abandoned_cart",
    categoryLabel: "Abandoned Cart Recovery",
    description: "Recovers lost deals by sending timely multi-channel nudges with personalized discount codes and live support.",
    estimatedResults: "36% Cart Recovery",
    difficulty: "Beginner",
    channels: ["Email", "WhatsApp", "SMS"],
    rating: 4.9,
    reviewsCount: 340,
    downloads: 19800,
    aiRecommendationBadge: "Revenue Saver",
    installed: true,
    isFavorite: true,
    estimatedConversionRate: "36.2%",
    expectedDuration: "48 Hours",
    workflowSteps: [
      { stepNumber: 1, title: "Checkout Initiated but Incomplete", type: "trigger", description: "Triggers 15 mins post abandonment." },
      { stepNumber: 2, title: "Email #1: Friendly Reminder + Saved Cart", type: "email", description: "Highlights saved items with direct resume checkout button." },
      { stepNumber: 3, title: "WhatsApp Message with 10% Coupon", type: "whatsapp", description: "Offers instant chat support & limited discount." },
      { stepNumber: 4, title: "SMS Final Call before Cart Expires", type: "action", description: "Sends final 4-hour expiration notice." }
    ],
    emailsIncluded: [
      { title: "Did you forget something?", subjectLine: "Your SalesFlow plan is waiting for you", previewText: "Complete your checkout in under 60 seconds..." }
    ],
    landingPages: [
      { title: "Pre-filled Checkout Page", purpose: "Direct 1-click checkout recovery." }
    ],
    automationRules: [
      "Cancel sequence immediately upon successful transaction."
    ]
  },
  {
    id: "wf-10",
    name: "Cold Lead Re-engagement & Pipeline Reactivation",
    category: "reengagement",
    categoryLabel: "Re-engagement",
    description: "Wakes up dormant leads (>90 days inactive) with new feature announcements and zero-friction poll questions.",
    estimatedResults: "19% Reactivated",
    difficulty: "Intermediate",
    channels: ["Email", "LinkedIn", "CRM"],
    rating: 4.6,
    reviewsCount: 112,
    downloads: 8700,
    installed: false,
    isFavorite: false,
    estimatedConversionRate: "19.4%",
    expectedDuration: "14 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Dormant Lead Filter Trigger", type: "trigger", description: "Target leads inactive > 90 days." },
      { stepNumber: 2, title: "9-Word Short Email Pattern", type: "email", description: "Asks simple 'Are you still looking to solve X?'" },
      { stepNumber: 3, title: "Product Update Announcement", type: "email", description: "Highlights new AI Marketplace features." }
    ],
    emailsIncluded: [
      { title: "Short Check-in", subjectLine: "{{firstName}} - still interested in scaling outreach?", previewText: "Quick check-in to see if this is still on your radar..." }
    ],
    landingPages: [],
    automationRules: [
      "Update contact status to 'Re-engaged' upon reply."
    ]
  },
  {
    id: "wf-11",
    name: "VIP Event Promotion & Attendee Concierge",
    category: "event_promo",
    categoryLabel: "Event Promotion",
    description: "Drives ticket sales and VIP attendance for industry summits, dinners, and conferences.",
    estimatedResults: "92% Ticket Sold",
    difficulty: "Intermediate",
    channels: ["Email", "LinkedIn", "WhatsApp", "Landing Page"],
    rating: 4.7,
    reviewsCount: 88,
    downloads: 6300,
    installed: false,
    isFavorite: false,
    estimatedConversionRate: "27.0%",
    expectedDuration: "30 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Target Executive Invite", type: "email", description: "Sends personalized VIP dinner/summit invite." },
      { stepNumber: 2, title: "WhatsApp Ticket Delivery", type: "whatsapp", description: "Sends QR code mobile ticket." }
    ],
    emailsIncluded: [
      { title: "VIP Invitation", subjectLine: "Exclusive Invitation: Sales Executive Summit 2026", previewText: "We saved a seat for {{company}}..." }
    ],
    landingPages: [
      { title: "Summit Registration & Speaker Agenda", purpose: "VIP event microsite." }
    ],
    automationRules: [
      "Cap registrations at maximum venue capacity."
    ]
  },
  {
    id: "wf-12",
    name: "Automated NPS, CSAT & Feedback Collection Engine",
    category: "feedback_coll",
    categoryLabel: "Feedback Collection",
    description: "Collects customer feedback post-purchase or post-call, routing promoters to review sites and detractors to support.",
    estimatedResults: "4.8 Star Reviews Lift",
    difficulty: "Beginner",
    channels: ["Email", "WhatsApp", "CRM"],
    rating: 4.8,
    reviewsCount: 175,
    downloads: 10900,
    installed: true,
    isFavorite: false,
    estimatedConversionRate: "44.0%",
    expectedDuration: "5 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Deal Won or Call Ended Trigger", type: "trigger", description: "Fires 24 hrs post key milestone." },
      { stepNumber: 2, title: "1-Click Star Rating Survey", type: "email", description: "Embeds 1-5 rating buttons inside email." },
      { stepNumber: 3, title: "Promoter vs Detractor Branch", type: "condition", description: "Scores 4-5 go to G2/Trustpilot; 1-3 alert CS." }
    ],
    emailsIncluded: [
      { title: "Quick Survey", subjectLine: "How was your experience with SalesFlow, {{firstName}}?", previewText: "It takes 10 seconds to share your thoughts..." }
    ],
    landingPages: [
      { title: "Thank You & Review Redirect Page", purpose: "Directs satisfied clients to review platforms." }
    ],
    automationRules: [
      "Automatically log NPS score onto contact record."
    ]
  },
  {
    id: "wf-13",
    name: "Viral Referral & Partner Reward Campaign",
    category: "referral_camp",
    categoryLabel: "Referral Campaign",
    description: "Turns happy customers into brand ambassadors with auto-generated referral links and instant commission payouts.",
    estimatedResults: "+22% New Organic Leads",
    difficulty: "Intermediate",
    channels: ["Email", "WhatsApp", "Landing Page"],
    rating: 4.9,
    reviewsCount: 210,
    downloads: 13500,
    aiRecommendationBadge: "Growth Booster",
    installed: false,
    isFavorite: true,
    estimatedConversionRate: "33.8%",
    expectedDuration: "Ongoing",
    workflowSteps: [
      { stepNumber: 1, title: "NPS Promoter Trigger", type: "trigger", description: "Fires when customer gives 9+ NPS." },
      { stepNumber: 2, title: "Unique Referral Link Delivery", type: "email", description: "Provides personalized link giving $100 reward." }
    ],
    emailsIncluded: [
      { title: "Give $100, Get $100", subjectLine: "Share SalesFlow with a colleague and earn rewards", previewText: "Here is your custom referral link..." }
    ],
    landingPages: [
      { title: "Referral Partner Portal Page", purpose: "Tracks successful referrals and payout status." }
    ],
    automationRules: [
      "Trigger instant Stripe payout when referred account pays."
    ]
  },
  {
    id: "wf-14",
    name: "Proactive SaaS Tier Upsell & Expansion Engine",
    category: "upsell_camp",
    categoryLabel: "Upsell Campaign",
    description: "Identifies accounts nearing usage limits (e.g. contact cap, seat limit) and prompts seamless upgrade.",
    estimatedResults: "+31% Expansion ARR",
    difficulty: "Intermediate",
    channels: ["Email", "CRM", "WhatsApp"],
    rating: 4.8,
    reviewsCount: 160,
    downloads: 11800,
    installed: true,
    isFavorite: false,
    estimatedConversionRate: "26.4%",
    expectedDuration: "7 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Usage Hits 85% of Quota", type: "trigger", description: "Triggers on high usage detection." },
      { stepNumber: 2, title: "Proactive Upgrade Offer Email", type: "email", description: "Shows Pro vs Enterprise feature comparison." }
    ],
    emailsIncluded: [
      { title: "Quota Warning & Upgrade", subjectLine: "Your team is approaching monthly lead limits", previewText: "Upgrade to Enterprise for unlimited AI executions..." }
    ],
    landingPages: [
      { title: "1-Click Plan Upgrade Page", purpose: "Pre-selected account expansion checkout." }
    ],
    automationRules: [
      "Auto-apply 15% annual upgrade discount."
    ]
  },
  {
    id: "wf-15",
    name: "Cross-Sell Module & Complementary Add-On Blitz",
    category: "cross_sell",
    categoryLabel: "Cross-sell Campaign",
    description: "Recommends relevant add-ons (e.g. WhatsApp Agent for Email users) based on current product usage stack.",
    estimatedResults: "+18% ARPU Lift",
    difficulty: "Beginner",
    channels: ["Email", "WhatsApp"],
    rating: 4.7,
    reviewsCount: 95,
    downloads: 8200,
    installed: false,
    isFavorite: false,
    estimatedConversionRate: "21.0%",
    expectedDuration: "10 Days",
    workflowSteps: [
      { stepNumber: 1, title: "Active Email User (No WhatsApp Agent)", type: "trigger", description: "Filters accounts using Email but missing WhatsApp." },
      { stepNumber: 2, title: "WhatsApp Integration Teaser", type: "email", description: "Shows how WhatsApp increases response rate by 3x." }
    ],
    emailsIncluded: [
      { title: "Add WhatsApp to SalesFlow", subjectLine: "Double your reply rates with WhatsApp Agent", previewText: "Activate WhatsApp outreach in 1 click..." }
    ],
    landingPages: [
      { title: "WhatsApp Add-on Showcase", purpose: "Live interactive demo of WhatsApp bot." }
    ],
    automationRules: [
      "Offer 14-day free trial of cross-sold module."
    ]
  }
];

interface WorkflowMarketplacePageProps {
  onCustomizeWithAI?: (workflowName: string) => void;
}

export const WorkflowMarketplacePage: React.FC<WorkflowMarketplacePageProps> = ({
  onCustomizeWithAI,
}) => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(INITIAL_WORKFLOWS);
  const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"downloads" | "rating" | "conversion">("downloads");
  const [showInstalledOnly, setShowInstalledOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Preview Drawer Modal
  const [previewWorkflow, setPreviewWorkflow] = useState<WorkflowTemplate | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"steps" | "emails" | "landing" | "rules">("steps");

  // Installed feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const handleToggleInstall = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newStatus = !w.installed;
          showToast(
            newStatus
              ? `Installed "${w.name}" into your SalesFlow workspace!`
              : `Uninstalled "${w.name}".`
          );
          return { ...w, installed: newStatus };
        }
        return w;
      })
    );
  };

  // Filter & Sort Logic
  const filteredWorkflows = workflows
    .filter((w) => {
      const matchesCategory = selectedCategory === "all" || w.category === selectedCategory;
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.estimatedResults.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === "all" || w.difficulty === difficultyFilter;
      const matchesInstalled = !showInstalledOnly || w.installed;
      const matchesFav = !showFavoritesOnly || w.isFavorite;

      return matchesCategory && matchesSearch && matchesDiff && matchesInstalled && matchesFav;
    })
    .sort((a, b) => {
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "conversion") return parseFloat(b.estimatedConversionRate) - parseFloat(a.estimatedConversionRate);
      return 0;
    });

  const getChannelBadgeColor = (channel: string) => {
    switch (channel) {
      case "Email":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      case "WhatsApp":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "LinkedIn":
        return "bg-sky-500/10 text-sky-300 border-sky-500/30";
      case "Landing Page":
        return "bg-violet-500/10 text-violet-300 border-violet-500/30";
      case "CRM":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "SMS":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Intermediate":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "Advanced":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#ececec] p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HERO BANNER - HubSpot Marketplace x ChatGPT aesthetic */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">
              SalesFlow AI Workflow Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ready-To-Deploy Revenue & Marketing Workflows
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Browse 15+ verified, pre-built automation campaigns across Lead Gen, WhatsApp, Email, Cart Recovery, Onboarding, and Sales Pipelines.
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-3 gap-3 shrink-0 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Templates</p>
            <p className="text-xl font-black text-indigo-400">15+</p>
            <p className="text-[9px] text-slate-500">HubSpot & ChatGPT style</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Installed</p>
            <p className="text-xl font-black text-emerald-400">
              {workflows.filter((w) => w.installed).length}
            </p>
            <p className="text-[9px] text-emerald-500 font-bold">Active in CRM</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Conversion</p>
            <p className="text-xl font-black text-amber-400">28.4%</p>
            <p className="text-[9px] text-amber-500 font-bold">Verified ROI</p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: SIDEBAR CATEGORIES + WORKFLOW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: ALL 15 CATEGORIES & QUICK FILTERS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>Categories</span>
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">15 Types</span>
            </div>

            {/* Quick Toggle Switches */}
            <div className="space-y-2 pt-1 border-b border-slate-800/80 pb-3">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  showFavoritesOnly
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "text-slate-400 hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>My Favorites</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-300">
                  {workflows.filter((w) => w.isFavorite).length}
                </span>
              </button>

              <button
                onClick={() => setShowInstalledOnly(!showInstalledOnly)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  showInstalledOnly
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Installed Workflows</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-300">
                  {workflows.filter((w) => w.installed).length}
                </span>
              </button>
            </div>

            {/* Category List */}
            <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
              {WORKFLOW_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    id={`workflow-cat-${cat.id}`}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive ? "bg-indigo-700 text-white" : "bg-slate-950 text-slate-500"
                      }`}
                    >
                      {cat.id === "all"
                        ? workflows.length
                        : workflows.filter((w) => w.category === cat.id).length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase block">Difficulty Level</span>
              <div className="grid grid-cols-2 gap-1.5">
                {["all", "Beginner", "Intermediate", "Advanced"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-center transition-all cursor-pointer capitalize ${
                      difficultyFilter === diff
                        ? "bg-slate-700 text-white border border-slate-600"
                        : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA: SEARCH TOOLBAR + WORKFLOW CARDS GRID */}
        <div className="lg:col-span-9 space-y-4">
          {/* SEARCH & SORT TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workflows by name, channels, or target results..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Sort & Category Indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="downloads">Most Installed</option>
                <option value="rating">Highest Rating</option>
                <option value="conversion">Highest Conversion %</option>
              </select>
            </div>
          </div>

          {/* ACTIVE CATEGORY BANNER */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredWorkflows.length}</strong> workflow templates
              {selectedCategory !== "all" && (
                <>
                  {" "}
                  in <strong className="text-indigo-400">{WORKFLOW_CATEGORIES.find((c) => c.id === selectedCategory)?.name}</strong>
                </>
              )}
            </span>
            {(selectedCategory !== "all" || searchQuery || difficultyFilter !== "all" || showInstalledOnly || showFavoritesOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setDifficultyFilter("all");
                  setShowInstalledOnly(false);
                  setShowFavoritesOnly(false);
                }}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>

          {/* WORKFLOW CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredWorkflows.map((wf) => (
              <div
                key={wf.id}
                id={`workflow-card-${wf.id}`}
                onClick={() => {
                  setPreviewWorkflow(wf);
                  setActivePreviewTab("steps");
                }}
                className="group p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/30 cursor-pointer relative"
              >
                <div className="space-y-3">
                  {/* Top Badges & Favorite Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {wf.aiRecommendationBadge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>{wf.aiRecommendationBadge}</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
                        {wf.categoryLabel}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleToggleFavorite(wf.id, e)}
                      id={`btn-fav-${wf.id}`}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        wf.isFavorite
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800"
                      }`}
                      title={wf.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${wf.isFavorite ? "fill-rose-400" : ""}`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {wf.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2">
                      {wf.description}
                    </p>
                  </div>

                  {/* Estimated Results Box & Difficulty */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Estimated Impact</span>
                      <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{wf.estimatedResults}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Difficulty</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                          wf.difficulty
                        )}`}
                      >
                        {wf.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Channels Badges */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Channels Used</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {wf.channels.map((ch) => (
                        <span
                          key={ch}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${getChannelBadgeColor(
                            ch
                          )}`}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{wf.rating}</span>
                        <span className="text-slate-500 text-[10px]">({wf.reviewsCount})</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Download className="w-3 h-3 text-slate-500" />
                        <span>{wf.downloads.toLocaleString()}</span>
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-indigo-400">
                      Conv: <strong>{wf.estimatedConversionRate}</strong>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewWorkflow(wf);
                        setActivePreviewTab("steps");
                      }}
                      id={`btn-preview-${wf.id}`}
                      className="flex-1 py-2 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Preview Flow</span>
                    </button>

                    <button
                      onClick={(e) => handleToggleInstall(wf.id, e)}
                      id={`btn-install-wf-${wf.id}`}
                      className={`py-2 px-4 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        wf.installed
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950"
                      }`}
                    >
                      {wf.installed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Installed</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Install</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Workflows Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No templates matched your filter or search query. Try switching categories or clearing search keywords.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED WORKFLOW PREVIEW DRAWER / MODAL */}
      {previewWorkflow && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setPreviewWorkflow(null)}
              className="absolute top-5 right-5 p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {previewWorkflow.aiRecommendationBadge && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{previewWorkflow.aiRecommendationBadge}</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950 text-slate-300 border border-slate-800">
                  {previewWorkflow.categoryLabel}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getDifficultyColor(
                    previewWorkflow.difficulty
                  )}`}
                >
                  {previewWorkflow.difficulty}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">{previewWorkflow.name}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {previewWorkflow.description}
              </p>
            </div>

            {/* Key Metrics Dashboard Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Impact</span>
                <p className="text-sm font-extrabold text-emerald-400">{previewWorkflow.estimatedResults}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Avg Conv. Rate</span>
                <p className="text-sm font-extrabold text-indigo-400">{previewWorkflow.estimatedConversionRate}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Campaign Duration</span>
                <p className="text-sm font-extrabold text-amber-400">{previewWorkflow.expectedDuration}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Downloads</span>
                <p className="text-sm font-extrabold text-slate-200">{previewWorkflow.downloads.toLocaleString()}</p>
              </div>
            </div>

            {/* TAB NAVIGATION FOR PREVIEW CONTENT */}
            <div className="flex border-b border-slate-800 gap-2">
              {[
                { id: "steps", label: `Workflow Steps (${previewWorkflow.workflowSteps.length})` },
                { id: "emails", label: `Emails Included (${previewWorkflow.emailsIncluded.length})` },
                { id: "landing", label: `Landing Pages (${previewWorkflow.landingPages.length})` },
                { id: "rules", label: `Automation Rules (${previewWorkflow.automationRules.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activePreviewTab === tab.id
                      ? "border-indigo-500 text-indigo-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT DETAILS */}
            <div className="space-y-4 min-h-[220px]">
              {/* TAB 1: WORKFLOW STEPS VISUAL TIMELINE */}
              {activePreviewTab === "steps" && (
                <div className="space-y-3 relative pl-4 border-l-2 border-indigo-500/30 my-2">
                  {previewWorkflow.workflowSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-slate-900" />
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-white">
                            Step {step.stepNumber}: {step.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-400 uppercase">
                            {step.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: EMAILS INCLUDED */}
              {activePreviewTab === "emails" && (
                <div className="space-y-3">
                  {previewWorkflow.emailsIncluded.length > 0 ? (
                    previewWorkflow.emailsIncluded.map((em, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-400">{em.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Email Template #{idx + 1}</span>
                        </div>
                        <p className="text-xs font-bold text-white">Subject: {em.subjectLine}</p>
                        <p className="text-xs text-slate-400 italic">"{em.previewText}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 p-4 text-center">No email templates required for this workflow.</p>
                  )}
                </div>
              )}

              {/* TAB 3: LANDING PAGES */}
              {activePreviewTab === "landing" && (
                <div className="space-y-3">
                  {previewWorkflow.landingPages.length > 0 ? (
                    previewWorkflow.landingPages.map((lp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-white">{lp.title}</span>
                        <p className="text-xs text-slate-400">{lp.purpose}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 p-4 text-center">No standalone landing pages included.</p>
                  )}
                </div>
              )}

              {/* TAB 4: AUTOMATION RULES */}
              {activePreviewTab === "rules" && (
                <div className="space-y-2">
                  {previewWorkflow.automationRules.map((rule, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-300">{rule}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM MODAL ACTION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  if (onCustomizeWithAI) {
                    onCustomizeWithAI(previewWorkflow.name);
                  }
                  setPreviewWorkflow(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-extrabold text-xs transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Customize with AI Assistant</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setPreviewWorkflow(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={(e) => {
                    handleToggleInstall(previewWorkflow.id, e);
                    setPreviewWorkflow(null);
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-extrabold shadow-xl cursor-pointer flex items-center justify-center gap-2 ${
                    previewWorkflow.installed
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{previewWorkflow.installed ? "Installed in Workspace" : "One-Click Install Workflow"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
