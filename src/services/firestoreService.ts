import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "./firebase";
import { Contact, Company, Task, GeneratedCampaign, UserProfile } from "../types";

// ================= USER PROFILE =================
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        name: data.displayName || data.name || "Sales Executive",
        email: data.email || "",
        avatar: data.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        company: data.companyName || "SalesFlow Enterprise",
      };
    }
  } catch (err) {
    console.error("Error getting user profile from Firestore:", err);
  }
  return null;
}

// ================= CONTACTS =================
export async function getUserContacts(userId: string): Promise<Contact[]> {
  try {
    const q = query(collection(db, "contacts"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const list: Contact[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        name: d.name || "Unnamed Contact",
        email: d.email || "",
        phone: d.phone || "",
        company: d.company || "",
        role: d.role || "Prospect",
        leadScore: d.leadScore || 50,
        scoreGrade: d.scoreGrade || "Warm",
        status: d.status || "lead",
        tags: d.tags || ["CSV Upload"],
        lastContacted: d.lastContacted || "Recently",
        timeline: d.timeline || [],
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching contacts from Firestore:", err);
    return [];
  }
}

export async function addContactToFirestore(userId: string, contactData: Partial<Contact>): Promise<string> {
  const ref = await addDoc(collection(db, "contacts"), {
    userId,
    name: contactData.name || "New Contact",
    email: contactData.email || "",
    phone: contactData.phone || "",
    company: contactData.company || "",
    role: contactData.role || "Decision Maker",
    leadScore: contactData.leadScore || 60,
    scoreGrade: contactData.scoreGrade || "Warm",
    status: contactData.status || "lead",
    tags: contactData.tags || ["Inbound"],
    lastContacted: new Date().toISOString().split("T")[0],
    timeline: [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        type: "note_added",
        description: "Contact added to Firestore CRM database.",
      },
    ],
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function saveBulkContactsToFirestore(
  userId: string,
  contacts: Array<{ name: string; email: string; phone?: string; company?: string; role?: string }>
): Promise<number> {
  let count = 0;
  for (const c of contacts) {
    if (!c.email || !c.name) continue;
    await addDoc(collection(db, "contacts"), {
      userId,
      name: c.name,
      email: c.email,
      phone: c.phone || "+1 (555) 019-2831",
      company: c.company || "Enterprise Account",
      role: c.role || "Executive",
      leadScore: Math.floor(Math.random() * 40) + 50,
      scoreGrade: "Warm",
      status: "lead",
      tags: ["CSV Import"],
      lastContacted: "Just imported",
      timeline: [],
      createdAt: new Date().toISOString(),
    });
    count++;
  }
  return count;
}

export async function updateContactInFirestore(contactId: string, updates: Partial<Contact>): Promise<void> {
  const ref = doc(db, "contacts", contactId);
  await updateDoc(ref, updates as any);
}

export async function deleteContactFromFirestore(contactId: string): Promise<void> {
  const ref = doc(db, "contacts", contactId);
  await deleteDoc(ref);
}

// ================= COMPANIES =================
export async function getUserCompanies(userId: string): Promise<Company[]> {
  try {
    const q = query(collection(db, "companies"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const list: Company[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        name: d.name || "Company",
        domain: d.domain || "example.com",
        industry: d.industry || "Software",
        size: d.size || "50-200",
        dealsCount: d.dealsCount || 1,
        revenue: d.revenue || 50000,
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching companies:", err);
    return [];
  }
}

export async function addCompanyToFirestore(userId: string, company: Partial<Company>): Promise<string> {
  const ref = await addDoc(collection(db, "companies"), {
    userId,
    name: company.name || "New Corporation",
    domain: company.domain || "acme.com",
    industry: company.industry || "Technology",
    size: company.size || "100-500",
    dealsCount: company.dealsCount || 1,
    revenue: company.revenue || 75000,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

// ================= CAMPAIGNS =================
export async function getUserCampaigns(userId: string): Promise<GeneratedCampaign[]> {
  try {
    const q = query(collection(db, "campaigns"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const list: GeneratedCampaign[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        name: d.name,
        type: d.type || "Cold Email",
        goal: d.goal || "Generate Leads",
        businessDescription: d.businessDescription || "",
        status: d.status || "active",
        customerPersona: d.customerPersona || {
          title: "Decision Maker Persona",
          demography: "B2B Executives",
          painPoints: ["High CAC", "Manual outreach"],
          goals: ["Automate pipeline", "Increase sales"],
        },
        emailContent: d.emailContent || {
          subjectLines: ["Special invitation for your team"],
          preheader: "Automate sales pipeline",
          body: "Hi {{first_name}},\n\nLet's connect!",
          cta: "Book Meeting",
          followUpEmails: [],
        },
        landingPage: d.landingPage || {
          headline: "Accelerate Your Sales",
          subheadline: "Smart outbound automation",
          bodyText: "Scale revenue effortlessly.",
          ctaText: "Get Started Free",
          features: ["AI Personalization", "CRM Sync"],
        },
        whatsAppMessages: d.whatsAppMessages || [],
        smsContent: d.smsContent || [],
        linkedInMessages: d.linkedInMessages || [],
        workflowNodes: d.workflowNodes || [],
        audienceSegments: d.audienceSegments || [],
        socialMediaPosts: d.socialMediaPosts || [],
        callScripts: d.callScripts || [],
        meetingBookingPage: d.meetingBookingPage || {
          title: "Strategy Session",
          link: "https://salesflow.ai/book/demo",
          description: "15 min call",
          duration: "15 Mins",
          availableSlots: ["Tomorrow 10 AM"],
        },
        sendSchedule: d.sendSchedule || "AI Optimized",
        createdAt: d.createdAt || new Date().toISOString().split("T")[0],
        metrics: d.metrics || {
          sent: 1200,
          delivered: 1180,
          openRate: 52.4,
          clickRate: 24.1,
          replies: 45,
          conversions: 12,
          revenue: 38000,
          meetingsBooked: 8,
        },
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return [];
  }
}

export async function saveCampaignToFirestore(userId: string, campaign: GeneratedCampaign): Promise<string> {
  const ref = doc(db, "campaigns", campaign.id);
  await setDoc(ref, {
    ...campaign,
    userId,
    updatedAt: new Date().toISOString(),
  });
  return campaign.id;
}

export async function updateCampaignStatusInFirestore(campaignId: string, status: "draft" | "scheduled" | "active" | "completed"): Promise<void> {
  const ref = doc(db, "campaigns", campaignId);
  await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
}

// ================= EMAILS =================
export async function getUserEmails(userId: string) {
  try {
    const q = query(collection(db, "emails"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
}

export async function recordSentEmailInFirestore(userId: string, campaignId: string, recipientEmail: string, subject: string, body: string) {
  return addDoc(collection(db, "emails"), {
    userId,
    campaignId,
    recipientEmail,
    subject,
    body,
    status: "sent",
    sentAt: new Date().toISOString(),
    opened: false,
    clicked: false,
  });
}

// ================= LANDING PAGES =================
export async function getUserLandingPages(userId: string) {
  try {
    const q = query(collection(db, "landingPages"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
}

export async function saveLandingPageToFirestore(userId: string, pageData: any) {
  return addDoc(collection(db, "landingPages"), {
    ...pageData,
    userId,
    createdAt: new Date().toISOString(),
  });
}

// ================= WORKFLOWS =================
export async function getUserWorkflows(userId: string) {
  try {
    const q = query(collection(db, "workflows"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
}

export async function saveWorkflowToFirestore(userId: string, workflow: any) {
  return addDoc(collection(db, "workflows"), {
    ...workflow,
    userId,
    createdAt: new Date().toISOString(),
  });
}

// ================= TASKS =================
export async function getUserTasks(userId: string): Promise<Task[]> {
  try {
    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const list: Task[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        title: d.title || "Sales Task",
        dueDate: d.dueDate || "Today",
        priority: d.priority || "medium",
        completed: Boolean(d.completed),
        assignee: d.assignee || "You",
        relatedTo: d.relatedTo || "Enterprise Prospect",
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}

export async function addTaskToFirestore(userId: string, task: Partial<Task>): Promise<string> {
  const ref = await addDoc(collection(db, "tasks"), {
    userId,
    title: task.title || "Follow up call",
    dueDate: task.dueDate || "Today",
    priority: task.priority || "high",
    completed: false,
    assignee: task.assignee || "Current User",
    relatedTo: task.relatedTo || "Target Account",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function toggleTaskCompletionInFirestore(taskId: string, currentStatus: boolean): Promise<void> {
  const ref = doc(db, "tasks", taskId);
  await updateDoc(ref, { completed: !currentStatus });
}

// ================= NOTIFICATIONS =================
export async function getUserNotifications(userId: string) {
  try {
    const q = query(collection(db, "notifications"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
}

export async function addNotificationToFirestore(userId: string, title: string, message: string, type: string = "info") {
  return addDoc(collection(db, "notifications"), {
    userId,
    title,
    message,
    read: false,
    type,
    createdAt: new Date().toISOString(),
  });
}

// ================= SETTINGS =================
export async function getUserSettings(userId: string) {
  try {
    const docRef = doc(db, "settings", userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data();
  } catch (e) {
    console.error("Error getting settings:", e);
  }
  return null;
}

export async function updateUserSettingsInFirestore(userId: string, settings: any) {
  const docRef = doc(db, "settings", userId);
  await setDoc(docRef, { userId, ...settings, updatedAt: new Date().toISOString() }, { merge: true });
}

// ================= INITIALIZE SAMPLE DATA IF NEW USER =================
export async function initializeSampleDataIfEmpty(userId: string): Promise<boolean> {
  try {
    const contacts = await getUserContacts(userId);
    if (contacts.length > 0) return false; // Already populated

    console.log("Initializing rich sample data for new Firestore user:", userId);

    // 1. Initial Contacts
    const initialContacts = [
      { name: "Sarah Jenkins", email: "s.jenkins@apexcloud.io", phone: "+1 (555) 234-5678", company: "Apex Cloud Systems", role: "VP of Sales Operations", leadScore: 92, scoreGrade: "Hot" as const, status: "contacted" as const, tags: ["Enterprise ICP", "High Intent"] },
      { name: "Marcus Vance", email: "m.vance@lumina-tech.com", phone: "+1 (555) 876-5432", company: "Lumina Technology", role: "Chief Revenue Officer", leadScore: 88, scoreGrade: "Hot" as const, status: "lead" as const, tags: ["SaaS Leader", "Inbound"] },
      { name: "Elena Rostova", email: "elena@quantumscale.org", phone: "+1 (555) 432-1098", company: "QuantumScale AI", role: "Head of Growth", leadScore: 74, scoreGrade: "Warm" as const, status: "contacted" as const, tags: ["AI Buyer"] },
      { name: "David Chen", email: "d.chen@nexusdata.co", phone: "+1 (555) 901-2345", company: "Nexus Data Labs", role: "Director of Business Dev", leadScore: 95, scoreGrade: "Hot" as const, status: "customer" as const, tags: ["Closed Won"] },
      { name: "Amanda Hayes", email: "a.hayes@stratagroup.com", phone: "+1 (555) 678-9012", company: "Strata Global Consulting", role: "Managing Director", leadScore: 45, scoreGrade: "Cold" as const, status: "lead" as const, tags: ["Outbound Cold"] },
    ];

    for (const c of initialContacts) {
      await addDoc(collection(db, "contacts"), {
        userId,
        ...c,
        lastContacted: "2 days ago",
        timeline: [
          { id: `t1-${Date.now()}`, date: "2026-07-21", type: "email_opened", description: "Opened subject line: 'Quick question regarding your sales pipeline'" },
          { id: `t2-${Date.now()}`, date: "2026-07-22", type: "link_clicked", description: "Clicked landing page link to schedule meeting" }
        ],
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Initial Companies
    const initialCompanies = [
      { name: "Apex Cloud Systems", domain: "apexcloud.io", industry: "Cloud Software", size: "250-500", dealsCount: 2, revenue: 120000 },
      { name: "Lumina Technology", domain: "lumina-tech.com", industry: "Enterprise SaaS", size: "500-1000", dealsCount: 1, revenue: 85000 },
      { name: "QuantumScale AI", domain: "quantumscale.org", industry: "Artificial Intelligence", size: "50-200", dealsCount: 1, revenue: 45000 },
    ];
    for (const comp of initialCompanies) {
      await addCompanyToFirestore(userId, comp);
    }

    // 3. Initial Tasks
    const initialTasks = [
      { title: "Review custom proposals for Apex Cloud team", dueDate: "Today at 3:00 PM", priority: "high" as const, completed: false, assignee: "Account Manager", relatedTo: "Sarah Jenkins" },
      { title: "Schedule follow-up demo call with Lumina Tech CRO", dueDate: "Tomorrow at 11:00 AM", priority: "high" as const, completed: false, assignee: "Sales Representative", relatedTo: "Marcus Vance" },
      { title: "Send contract draft for QuantumScale AI expansion", dueDate: "Friday at 5:00 PM", priority: "medium" as const, completed: false, assignee: "Legal / RevOps", relatedTo: "Elena Rostova" },
    ];
    for (const t of initialTasks) {
      await addTaskToFirestore(userId, t);
    }

    // 4. Initial Campaign
    const sampleCampaign: GeneratedCampaign = {
      id: `cmp-init-${Date.now()}`,
      name: "Q3 High-Intent B2B Sales Automation",
      type: "Cold Email",
      goal: "Generate Leads",
      businessDescription: "Enterprise AI Sales & Multichannel Outreach Platform",
      status: "active",
      customerPersona: {
        title: "B2B VP of Sales / Chief Revenue Officer",
        demography: "Executives at 100-1000 employee tech companies, $5M-$50M ARR",
        painPoints: [
          "Low email response rates due to generic templates",
          "Lack of automated multi-channel follow ups (Email + WhatsApp)",
          "Data loss between outreach tools and primary CRM"
        ],
        goals: [
          "Double sales meeting output without expanding headcount",
          "Unify outreach across Email, LinkedIn, and WhatsApp",
          "Ensure real-time CRM updates and lead score tracking"
        ]
      },
      emailContent: {
        subjectLines: [
          "Unlock 3x Pipeline Growth: Enterprise Sales AI",
          "How Lumina Tech boosted reply rates by 48% in 30 days",
          "Quick strategy check-in for your Q3 revenue targets",
          "Automate your outbound without losing personal touch"
        ],
        preheader: "Turn cold prospects into booked strategy meetings automatically.",
        body: "Hi {{first_name}},\n\nWhen scaling revenue at {{company}}, outbound efficiency and fast response times are paramount.\n\nSalesFlow AI empowers revenue teams to craft hyper-personalized campaign sequences across Email, WhatsApp, and LinkedIn in seconds.\n\nWould you be open to a 10-minute preview this Thursday?",
        cta: "Schedule Strategy Call",
        followUpEmails: [
          { step: 1, delayDays: 3, subject: "Quick check-in regarding sales automation", body: "Hi {{first_name}},\n\nFollowing up on my previous note. We recently helped a similar enterprise team boost meeting bookings by 3x.\n\nShould I share our 2-page implementation roadmap?" },
          { step: 2, delayDays: 6, subject: "Final invitation for pipeline audit", body: "Hi {{first_name}},\n\nI know schedule fills up quickly. If you're still looking to accelerate your Q3 outbound, I am reserving strategic audit slots this week." }
        ]
      },
      landingPage: {
        headline: "Scale Outbound Revenue With Autonomous AI Campaigns",
        subheadline: "Generate cold email sequences, WhatsApp messages, landing pages, and CRM workflows from a single AI prompt.",
        bodyText: "SalesFlow AI connects directly with your contacts database to orchestrate targeted multi-touch sales sequences with 100% deliverability.",
        ctaText: "Start Free Preview",
        features: [
          "Multi-Channel Orchestration (Email, WhatsApp, LinkedIn)",
          "Automated Lead Scoring & CRM Synchronization",
          "Real-time Analytics & Executive Pipeline Dashboards",
          "Native OpenAI & Gemini AI Engine Integration"
        ]
      },
      whatsAppMessages: [
        { step: 1, text: "👋 Hi {{first_name}}! Quick question: Want to see how SalesFlow AI automates high-converting outreach in under 48 hours? Check our 1-min video: https://salesflow.ai/demo" },
        { step: 2, text: "Hey {{first_name}}, following up on my message. Would you be open for a quick 10-min chat Thursday?" }
      ],
      smsContent: [
        { step: 1, text: "SalesFlow AI: Ready to double your qualified meetings? Reply YES to get your custom campaign plan." }
      ],
      linkedInMessages: [
        { step: 1, text: "Hi {{first_name}}, loved your recent updates at {{company}}. We've built an AI system that helps CROs automate outbound pipeline generation. Would love to connect!" }
      ],
      workflowNodes: [
        { id: "w-1", title: "Target Contact Imported", type: "trigger", detail: "When contact lead score > 60" },
        { id: "w-2", title: "Send Cold Email Step 1", type: "action", detail: "Custom AI email personalized to prospect role" },
        { id: "w-3", title: "Track Engagement", type: "condition", detail: "Check if email opened or link clicked in 48h" },
        { id: "w-4", title: "Send WhatsApp Follow-up", type: "action", detail: "Dispatch WhatsApp message step 1" }
      ],
      audienceSegments: [
        { name: "Tier 1 Enterprise Decision Makers", count: 1420, criteria: "VP/CRO titles in B2B Tech" },
        { name: "Warm Inbound Prospects", count: 680, criteria: "Downloaded case study in last 14 days" }
      ],
      socialMediaPosts: [
        { platform: "LinkedIn", text: "🚀 Outbound sales is evolving. Here is how modern revenue leaders combine AI personalization with multi-channel outreach to double conversion rates.", hashtags: "#SalesAutomation #B2B #AI #RevenueGrowth" }
      ],
      callScripts: [
        { title: "30-Second Elevator Pitch", script: "'Hi {{first_name}}, this is [Your Name] from SalesFlow AI. We help CROs double their qualified meetings using autonomous campaign agents. Do you have 20 seconds?'", objectHandling: "If 'No time': 'Completely understand! Mind if I send a 60-second Loom preview to your email?'" }
      ],
      meetingBookingPage: {
        title: "Q3 Sales Acceleration Session",
        link: "https://salesflow.ai/book/strategy-session",
        description: "15 minute 1-on-1 session to review outbound campaigns and launch your AI sales pipeline.",
        duration: "15 Mins",
        availableSlots: ["Tomorrow at 10:00 AM", "Tomorrow at 2:00 PM", "Friday at 11:30 AM"]
      },
      sendSchedule: "AI Optimized (Mon & Wed 9:30 AM)",
      createdAt: new Date().toISOString().split("T")[0],
      metrics: {
        sent: 3420,
        delivered: 3390,
        openRate: 58.4,
        clickRate: 26.8,
        replies: 148,
        conversions: 42,
        revenue: 145000,
        meetingsBooked: 24,
      }
    };
    await saveCampaignToFirestore(userId, sampleCampaign);

    // 5. Initial Workflows
    const sampleWorkflow = {
      title: "Inbound Lead Instant Response & WhatsApp Nurture",
      description: "Automatically triggers instant email and WhatsApp message when a new lead enters the CRM.",
      category: "Inbound Nurturing",
      trigger: "New Contact Added in Firestore",
      steps: [
        { name: "Verify Email & Calculate Lead Score", type: "condition" },
        { name: "Send Welcome Email with AI Strategy Guide", type: "action" },
        { name: "Wait 24 Hours", type: "delay" },
        { name: "Send WhatsApp Follow-up Message", type: "action" },
        { name: "Update CRM Stage to 'Contacted'", type: "action" }
      ],
      isActive: true,
      executionsCount: 184
    };
    await saveWorkflowToFirestore(userId, sampleWorkflow);

    // 6. Initial Notifications
    await addNotificationToFirestore(userId, "Welcome to SalesFlow AI!", "Your Firestore database and AI engine have been initialized successfully.", "system");
    await addNotificationToFirestore(userId, "New Meeting Booked", "Sarah Jenkins from Apex Cloud booked a strategy meeting for tomorrow.", "meeting");

    return true;
  } catch (err) {
    console.error("Error initializing sample Firestore data:", err);
    return false;
  }
}
