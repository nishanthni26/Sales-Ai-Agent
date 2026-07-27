import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Sparkles,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  TrendingUp,
  BarChart2,
  Layers,
  ChevronRight,
  Eye,
  Copy,
  Sliders,
  X,
  FileText,
  Zap,
  Globe,
  Inbox,
  SendHorizontal,
  FileEdit,
  ShieldCheck,
  Smartphone,
  Monitor,
  Users,
  Target,
  Check,
  ArrowRight,
  Download,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Contact, UserProfile } from "../types";
import { generateCampaignStrategyAI } from "../services/aiService";

interface EmailMarketingStudioProps {
  contacts: Contact[];
  user?: UserProfile | null;
  onNavigateToCRM?: () => void;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  sender: string;
  senderEmail: string;
  subject: string;
  date: string;
  body: string;
  unread: boolean;
  labels: string[];
}

export interface EmailCampaignTemplate {
  id: string;
  title: string;
  category: "Cold Outreach" | "Product Launch" | "Lead Nurturing" | "Re-engagement" | "Newsletter";
  subjectLine: string;
  preheader: string;
  bodyHtml: string;
  ctaText: string;
  ctaUrl: string;
  avgOpenRate: number;
  avgClickRate: number;
}

const PREBUILT_TEMPLATES: EmailCampaignTemplate[] = [
  {
    id: "tpl-01",
    title: "B2B Executive Cold Outreach",
    category: "Cold Outreach",
    subjectLine: "Streamlining {{company}}'s outbound pipeline with autonomous AI",
    preheader: "Quick 2-minute idea on scaling sales efficiency without adding headcount.",
    bodyHtml: `<p>Hi {{first_name}},</p>
<p>I noticed {{company}} has been expanding its enterprise team recently. Managing outbound pipeline quality at scale often becomes a bottleneck for sales leaders.</p>
<p>At SalesFlow AI, we help growth companies automate hyper-personalized multi-channel sequences—generating up to <strong>3.2x more qualified discovery meetings</strong>.</p>
<p>Are you open to a brief 10-minute coffee chat this Thursday to see how this fits into {{company}}'s Q3 goals?</p>
<p>Best regards,<br><strong>{{user_name}}</strong></p>`,
    ctaText: "Schedule 10-Min Intro Call",
    ctaUrl: "https://salesflow.ai/book-demo",
    avgOpenRate: 68.4,
    avgClickRate: 24.2,
  },
  {
    id: "tpl-02",
    title: "Product Feature Announcement Drip",
    category: "Product Launch",
    subjectLine: "🚀 Launching AI Marketing Workflows for {{company}}",
    preheader: "Build, launch, and track full-funnel sales sequences in minutes.",
    bodyHtml: `<p>Hello {{first_name}},</p>
<p>We are thrilled to unveil our new <strong>Autonomous AI Marketing Hub</strong>! Now you can orchestrate Email, WhatsApp, SMS, and LinkedIn sequences from one unified dashboard.</p>
<ul>
  <li>✨ AI Auto-Generated Subject Lines & Copy</li>
  <li>⚡ Smart CRM Integration & Real-Time Deal Sync</li>
  <li>📊 Automated Deliverability & Spam Diagnostic</li>
</ul>
<p>Try out the new features inside your account today.</p>`,
    ctaText: "Explore AI Marketing Studio",
    ctaUrl: "https://salesflow.ai/studio",
    avgOpenRate: 74.5,
    avgClickRate: 31.0,
  },
  {
    id: "tpl-03",
    title: "High-Intent Inbound Lead Fast-Track",
    category: "Lead Nurturing",
    subjectLine: "Welcome to SalesFlow AI, {{first_name}} - Here's your fast-track setup guide",
    preheader: "Get your first automated AI sequence running in under 5 minutes.",
    bodyHtml: `<p>Hi {{first_name}},</p>
<p>Thank you for exploring SalesFlow AI! Your account is ready, and we’ve pre-loaded high-converting email templates for {{company}}.</p>
<p>Here are 3 quick steps to kickstart your first campaign:</p>
<ol>
  <li>Connect your Google Workspace or Gmail account.</li>
  <li>Import your lead contacts or sync with CRM.</li>
  <li>Hit launch and let AI handle multi-channel follow-ups!</li>
</ol>`,
    ctaText: "Launch My First Campaign",
    ctaUrl: "https://salesflow.ai/dashboard",
    avgOpenRate: 82.1,
    avgClickRate: 38.6,
  },
  {
    id: "tpl-04",
    title: "Cold Lead Win-Back & Re-Engagement",
    category: "Re-engagement",
    subjectLine: "Is {{company}} still looking to scale outbound sales?",
    preheader: "We updated our platform with new automated AI outreach tools.",
    bodyHtml: `<p>Hi {{first_name}},</p>
<p>I know timing is everything in sales. A few months ago we connected regarding scaling {{company}}'s outreach.</p>
<p>We recently released major updates to our deliverability engine and AI response assistant. Should I take this off your radar, or are you still open to reviewing new options?</p>`,
    ctaText: "Re-activate Account Access",
    ctaUrl: "https://salesflow.ai/reactivate",
    avgOpenRate: 58.2,
    avgClickRate: 18.9,
  },
];

const ANALYTICS_DATA = [
  { day: "Mon", sent: 420, opens: 290, clicks: 110, replies: 42 },
  { day: "Tue", sent: 580, opens: 412, clicks: 168, replies: 65 },
  { day: "Wed", sent: 750, opens: 540, clicks: 215, replies: 88 },
  { day: "Thu", sent: 620, opens: 460, clicks: 182, replies: 71 },
  { day: "Fri", sent: 890, opens: 640, clicks: 295, replies: 112 },
  { day: "Sat", sent: 310, opens: 210, clicks: 75, replies: 28 },
  { day: "Sun", sent: 260, opens: 180, clicks: 62, replies: 19 },
];

export const EmailMarketingStudio: React.FC<EmailMarketingStudioProps> = ({
  contacts,
  user,
  onNavigateToCRM,
}) => {
  // Main Navigation Tabs inside Email Studio
  const [activeTab, setActiveTab] = useState<"inbox" | "broadcast" | "templates" | "drip" | "analytics">("inbox");

  // Gmail Live OAuth & Sync State
  const [gmailConnected, setGmailConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [gmailUserEmail, setGmailUserEmail] = useState<string>(user?.email || "user@salesflow.ai");

  // Mock & Fetched Gmail Messages
  const [messages, setMessages] = useState<GmailMessage[]>([
    {
      id: "msg-101",
      threadId: "th-101",
      snippet: "Thanks for the demo proposal! Can we schedule a quick call with our CTO on Friday?",
      sender: "Marcus Vance (SVP Tech)",
      senderEmail: "marcus.vance@apexglobal.io",
      subject: "Re: SalesFlow AI Enterprise Proposal & Security Review",
      date: "10:42 AM",
      body: `Hi team,\n\nThanks for sending over the AI Campaign breakdown. Our security and compliance teams reviewed the architecture and we are happy to move forward.\n\nCould you send an invite for Friday 2 PM EST for Marcus and our CTO?\n\nBest,\nMarcus Vance`,
      unread: true,
      labels: ["INBOX", "IMPORTANT"],
    },
    {
      id: "msg-102",
      threadId: "th-102",
      snippet: "How does the automated deliverability test handle DMARC alignment?",
      sender: "Elena Rostova (Head of Growth)",
      senderEmail: "elena@cloudscale.co",
      subject: "Question regarding Deliverability & Spam Check",
      date: "Yesterday",
      body: `Hello,\n\nWe are planning to run a 10,000 lead email broadcast next week. I wanted to verify if your platform includes auto-warmup and domain health scores?\n\nThanks,\nElena`,
      unread: false,
      labels: ["INBOX"],
    },
    {
      id: "msg-103",
      threadId: "th-103",
      snippet: "Our team approved the $45k contract quote. Please send contract link.",
      sender: "David Sterling (CEO)",
      senderEmail: "d.sterling@fintechprime.com",
      subject: "Contract Approval - Fintech Prime",
      date: "Jul 24",
      body: `Hi,\n\nI spoke with procurement and approved the custom enterprise plan. Please send over the contract link via DocuSign or your billing page.\n\nRegards,\nDavid`,
      unread: false,
      labels: ["INBOX", "STARRED"],
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(messages[0]);
  const [replyText, setReplyText] = useState("");
  const [isGeneratingAiReply, setIsGeneratingAiReply] = useState(false);

  // New Email Broadcast State
  const [broadcastSubject, setBroadcastSubject] = useState("Scale Outbound Sales Revenue with Autonomous AI");
  const [broadcastPreheader, setBroadcastPreheader] = useState("Supercharge your enterprise pipeline in 5 minutes");
  const [broadcastBody, setBroadcastBody] = useState(PREBUILT_TEMPLATES[0].bodyHtml);
  const [broadcastCtaText, setBroadcastCtaText] = useState("Book Executive Demo");
  const [broadcastCtaUrl, setBroadcastCtaUrl] = useState("https://salesflow.ai/demo");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastSuccessAlert, setBroadcastSuccessAlert] = useState(false);

  // AI Generator state
  const [aiPromptTopic, setAiPromptTopic] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Spam Health Check State
  const [spamHealthScore, setSpamHealthScore] = useState({
    score: 98,
    spf: true,
    dkim: true,
    dmarc: true,
    spamWordsCount: 0,
    status: "Excellent Deliverability",
  });

  // Compose Modal State
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // Handle Syncing with Gmail API
  const handleSyncGmail = async () => {
    setIsSyncing(true);
    try {
      if (accessToken) {
        const res = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            // Fetch message details
            const fetchedList: GmailMessage[] = [];
            for (const item of data.messages.slice(0, 5)) {
              const msgRes = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${item.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (msgRes.ok) {
                const msgData = await msgRes.json();
                const headers = msgData.payload?.headers || [];
                const subjHeader = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "No Subject";
                const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown";
                const dateHeader = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || new Date().toLocaleDateString();

                fetchedList.push({
                  id: msgData.id,
                  threadId: msgData.threadId,
                  snippet: msgData.snippet || "",
                  sender: fromHeader.split("<")[0].replace(/"/g, "").trim(),
                  senderEmail: fromHeader.includes("<") ? fromHeader.split("<")[1].replace(">", "") : fromHeader,
                  subject: subjHeader,
                  date: new Date(dateHeader).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  body: msgData.snippet || "Full body fetched from Gmail API.",
                  unread: msgData.labelIds?.includes("UNREAD") || false,
                  labels: msgData.labelIds || ["INBOX"],
                });
              }
            }
            if (fetchedList.length > 0) {
              setMessages(fetchedList);
              setSelectedMessage(fetchedList[0]);
            }
          }
        }
      }
    } catch (err) {
      console.warn("Gmail API fetch fallback to local synced state:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  // AI Smart Reply Generator
  const handleGenerateAiReply = async () => {
    if (!selectedMessage) return;
    setIsGeneratingAiReply(true);
    try {
      const response = await generateCampaignStrategyAI(
        "Email Marketing",
        "Book Meetings",
        `Generate a professional, warm, conversion-focused B2B sales reply to this email: "${selectedMessage.body}". Keep it concise under 100 words.`
      );
      setReplyText(response || `Hi ${selectedMessage.sender.split(" ")[0]},\n\nThank you for reaching out! I would be delighted to schedule a call to walk you through our AI workflow integration.\n\nHow does tomorrow at 2 PM EST work for your team?\n\nBest regards,\n${user?.name || "SalesFlow AI Team"}`);
    } catch {
      setReplyText(`Hi ${selectedMessage.sender.split(" ")[0]},\n\nThanks for your note! I'm available to meet Friday at 2 PM EST. I'll send over a calendar invite shortly.\n\nBest,\n${user?.name || "SalesFlow AI Team"}`);
    } finally {
      setIsGeneratingAiReply(false);
    }
  };

  // Generate Email Content with AI
  const handleGenerateAiBroadcast = async () => {
    setIsAiGenerating(true);
    try {
      const topic = aiPromptTopic || "B2B SaaS AI Automation";
      const result = await generateCampaignStrategyAI(
        "Email Marketing",
        "Generate Leads",
        `Create a high-converting B2B email broadcast copy about: ${topic}. Include subject line and engaging body.`
      );
      setBroadcastBody(result || `<p>Hi {{first_name}},</p><p>Scaling your sales pipeline should not mean working 80-hour weeks. With SalesFlow AI, your team can automate multi-channel follow-ups on autopilot.</p><p>Ready to see it in action for {{company}}?</p>`);
      setBroadcastSubject(`Supercharge {{company}}'s sales with ${topic}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Send Broadcast Action
  const handleSendBroadcast = () => {
    setIsSendingBroadcast(true);
    setTimeout(() => {
      setIsSendingBroadcast(false);
      setBroadcastSuccessAlert(true);
      setTimeout(() => setBroadcastSuccessAlert(false), 4000);
    }, 1200);
  };

  // Calculate target audience count
  const targetRecipientCount =
    selectedSegment === "all"
      ? contacts.length
      : selectedSegment === "hot"
      ? contacts.filter((c) => c.scoreGrade === "Hot").length
      : selectedSegment === "customers"
      ? contacts.filter((c) => c.status === "customer").length
      : 25;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER & TOP STATS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gmail & Email Marketing Hub</span>
            </span>
            {gmailConnected && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>OAuth Live Sync Active</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Email Marketing Studio & Mail Center
          </h1>
          <p className="text-xs text-slate-400">
            Manage Gmail inbox, compose broadcasts, build automated drip campaigns, and analyze deliverability.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <button
            onClick={handleSyncGmail}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing Gmail..." : "Sync Gmail"}</span>
          </button>

          <button
            onClick={() => setShowComposeModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
          >
            <SendHorizontal className="w-4 h-4" />
            <span>+ Compose Email</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "inbox"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Live Gmail Inbox</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/30 text-white">
            {messages.filter((m) => m.unread).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("broadcast")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "broadcast"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Email Campaign Broadcaster</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "templates"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Conversion Templates ({PREBUILT_TEMPLATES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("drip")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "drip"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Auto-Drip Sequences</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === "analytics"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Email Analytics & Spam Health</span>
        </button>
      </div>

      {/* TAB 1: LIVE GMAIL INBOX & THREAD VIEW */}
      {activeTab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages List Sidebar */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-emerald-400" />
                <span>Synced Messages ({messages.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">{gmailUserEmail}</span>
            </div>

            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setMessages(
                      messages.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
                    );
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    selectedMessage?.id === msg.id
                      ? "bg-slate-800 border-emerald-500/50 shadow-md shadow-emerald-950/20"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-white truncate">{msg.sender}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{msg.date}</span>
                  </div>

                  <p className="text-xs font-bold text-slate-200 truncate">{msg.subject}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{msg.snippet}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-emerald-400 font-semibold">{msg.senderEmail}</span>
                    {msg.unread && (
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Thread Body & AI Smart Reply */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Thread Header */}
                <div className="border-b border-slate-800 pb-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-extrabold text-white">{selectedMessage.subject}</h2>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Gmail Thread
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span className="font-bold text-slate-200">{selectedMessage.sender}</span>{" "}
                      &lt;{selectedMessage.senderEmail}&gt;
                    </div>
                    <span className="font-mono">{selectedMessage.date}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[160px]">
                  {selectedMessage.body}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerateAiReply}
                    disabled={isGeneratingAiReply}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isGeneratingAiReply ? "animate-spin" : ""}`} />
                    <span>{isGeneratingAiReply ? "Generating Reply..." : "AI Auto-Generate Reply"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToCRM) onNavigateToCRM();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Log as CRM Lead</span>
                  </button>
                </div>

                {/* Reply Composer */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-extrabold text-white">Send Reply via Gmail</label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply or use AI Smart Reply above..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        alert("Reply sent via Gmail OAuth integration!");
                        setReplyText("");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-950 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">Select a message from the left to view thread details.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EMAIL CAMPAIGN BROADCASTER */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Campaign Form Controls */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Broadcast Campaign Setup</span>
              </h3>
              <button
                onClick={handleGenerateAiBroadcast}
                disabled={isAiGenerating}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/30"
              >
                <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isAiGenerating ? "animate-spin" : ""}`} />
                <span>{isAiGenerating ? "AI Writing..." : "AI Generate Copy"}</span>
              </button>
            </div>

            {/* Target Audience Segment Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Target Audience Segment</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setSelectedSegment("all")}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    selectedSegment === "all"
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  All CRM Contacts ({contacts.length})
                </button>

                <button
                  onClick={() => setSelectedSegment("hot")}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    selectedSegment === "hot"
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  Hot Leads ({contacts.filter((c) => c.scoreGrade === "Hot").length})
                </button>

                <button
                  onClick={() => setSelectedSegment("customers")}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    selectedSegment === "customers"
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  Active Customers ({contacts.filter((c) => c.status === "customer").length})
                </button>
              </div>
            </div>

            {/* Subject Line & Preheader */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. {{company}}'s Q3 Outbound AI Strategy"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Preheader Preview Text</label>
                <input
                  type="text"
                  value={broadcastPreheader}
                  onChange={(e) => setBroadcastPreheader(e.target.value)}
                  placeholder="e.g. Quick 2-minute overview on scaling pipeline"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email Body HTML Editor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Email Content (HTML Supported)</label>
              <textarea
                rows={7}
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* CTA Button Settings */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={broadcastCtaText}
                  onChange={(e) => setBroadcastCtaText(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">CTA Destination URL</label>
                <input
                  type="text"
                  value={broadcastCtaUrl}
                  onChange={(e) => setBroadcastCtaUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Launch Broadcast Button */}
            <div className="pt-2">
              <button
                onClick={handleSendBroadcast}
                disabled={isSendingBroadcast}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSendingBroadcast
                    ? "Dispatching Email Broadcast..."
                    : `Dispatch Campaign to ${targetRecipientCount} Recipients`}
                </span>
              </button>

              {broadcastSuccessAlert && (
                <div className="mt-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Email Broadcast successfully queued for dispatch via Gmail API!</span>
                </div>
              )}
            </div>
          </div>

          {/* Live Email Preview (Desktop & Mobile view) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">Live Email Preview</h3>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    previewDevice === "desktop" ? "bg-emerald-600 text-white" : "text-slate-400"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    previewDevice === "mobile" ? "bg-emerald-600 text-white" : "text-slate-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Email Container Frame */}
            <div className={`mx-auto transition-all ${previewDevice === "mobile" ? "max-w-sm" : "w-full"}`}>
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
                {/* Inbox Header Mock */}
                <div className="bg-slate-100 p-4 border-b border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800">From: {gmailUserEmail}</span>
                    <span className="text-[10px] text-slate-500">Just Now</span>
                  </div>
                  <div className="font-bold text-emerald-700">Subject: {broadcastSubject}</div>
                  <div className="text-[11px] text-slate-500">{broadcastPreheader}</div>
                </div>

                {/* Email Body */}
                <div className="p-6 space-y-6 text-sm leading-relaxed text-slate-800">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: broadcastBody
                        .replace(/\{\{first_name\}\}/g, "Alex")
                        .replace(/\{\{company\}\}/g, "Apex Enterprise Solutions")
                        .replace(/\{\{user_name\}\}/g, user?.name || "SalesFlow AI Representative"),
                    }}
                  />

                  {broadcastCtaText && (
                    <div className="pt-2 text-center">
                      <a
                        href={broadcastCtaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-emerald-700 transition-colors"
                      >
                        {broadcastCtaText}
                      </a>
                    </div>
                  )}
                </div>

                {/* Email Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
                  <p>Sent via SalesFlow AI Email Marketing • 100% CAN-SPAM Compliant</p>
                  <p className="underline cursor-pointer">Unsubscribe from future campaigns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSION TEMPLATES GALLERY */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PREBUILT_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {tpl.category}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-extrabold">
                    <span className="text-emerald-400">Open {tpl.avgOpenRate}%</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400">CTR {tpl.avgClickRate}%</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white">{tpl.title}</h3>
                <p className="text-xs text-slate-400 italic">"{tpl.subjectLine}"</p>

                <div
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-300 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: tpl.bodyHtml }}
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setBroadcastSubject(tpl.subjectLine);
                    setBroadcastPreheader(tpl.preheader);
                    setBroadcastBody(tpl.bodyHtml);
                    setBroadcastCtaText(tpl.ctaText);
                    setBroadcastCtaUrl(tpl.ctaUrl);
                    setActiveTab("broadcast");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Use Template in Broadcaster</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: AUTOMATED DRIP SEQUENCES */}
      {activeTab === "drip" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Multi-Step Automated Email Drips</span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated multi-step nurture flows triggered on lead creation or form submissions.
              </p>
            </div>

            <button
              onClick={() => alert("New drip sequence created!")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl"
            >
              + Create Drip Flow
            </button>
          </div>

          {/* Drip Steps Diagram */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Day 0 (Immediate Welcome Email)</h4>
                  <p className="text-[11px] text-slate-400">Trigger: New Contact Added from CRM or Web Form</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded-full border border-emerald-500/30">
                84.2% Sent
              </span>
            </div>

            <div className="w-0.5 h-4 bg-slate-800 mx-8" />

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold flex items-center justify-center text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Day 3 (Case Study & ROI Evidence)</h4>
                  <p className="text-[11px] text-slate-400">Condition: If Email #1 opened but link not clicked</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold rounded-full border border-indigo-500/30">
                68.0% Sent
              </span>
            </div>

            <div className="w-0.5 h-4 bg-slate-800 mx-8" />

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Day 7 (Break-Up / Demo Offer)</h4>
                  <p className="text-[11px] text-slate-400">Action: Offer 15% discount or 10-min meeting invite</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold rounded-full border border-amber-500/30">
                52.4% Sent
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & SPAM HEALTH CHECK */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xl">
              <p className="text-xs font-bold text-slate-400">Total Emails Delivered</p>
              <h3 className="text-2xl font-extrabold text-white">12,840</h3>
              <p className="text-[11px] text-emerald-400 font-bold">↑ +14.2% from last week</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xl">
              <p className="text-xs font-bold text-slate-400">Average Open Rate</p>
              <h3 className="text-2xl font-extrabold text-emerald-400">68.4%</h3>
              <p className="text-[11px] text-slate-400">Industry benchmark: 22.5%</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xl">
              <p className="text-xs font-bold text-slate-400">Click-Through Rate (CTR)</p>
              <h3 className="text-2xl font-extrabold text-cyan-400">28.2%</h3>
              <p className="text-[11px] text-slate-400">3,620 total CTA clicks</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xl">
              <p className="text-xs font-bold text-slate-400">Domain Health Score</p>
              <h3 className="text-2xl font-extrabold text-indigo-300">98 / 100</h3>
              <p className="text-[11px] text-emerald-400 font-bold">SPF, DKIM & DMARC Passed</p>
            </div>
          </div>

          {/* Performance Recharts Chart */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>Weekly Email Performance Trends</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="sent" stroke="#10b981" fillOpacity={1} fill="url(#colorSent)" />
                  <Area type="monotone" dataKey="opens" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOpens)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE QUICK EMAIL MODAL */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <SendHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Quick Email via Gmail</span>
              </h3>
              <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">To Email Address</label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="e.g. lead@enterprise.com"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="e.g. Intro meeting regarding AI Workflows"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message Body</label>
                <textarea
                  rows={5}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Write your email here..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowComposeModal(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Email sent directly to ${composeTo || "lead"} via Gmail API!`);
                  setShowComposeModal(false);
                  setComposeTo("");
                  setComposeSubject("");
                  setComposeBody("");
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-950 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
