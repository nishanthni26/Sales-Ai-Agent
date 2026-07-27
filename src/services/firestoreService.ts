import {
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "./firebase";
import { Contact, Company, Deal, Task, GeneratedCampaign, UserProfile, WorkflowAutomation, WorkflowExecutionLog, AISettings, AILogEntry, ChatMessage, ChatSession, ContactTimelineItem } from "../types";
import { calculateLeadScoreAndStatus } from "./leadScoringEngine";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
      const fullName = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || "Unnamed Contact";
      list.push({
        id: docSnap.id,
        name: fullName,
        firstName: d.firstName || fullName.split(" ")[0] || "",
        lastName: d.lastName || fullName.split(" ").slice(1).join(" ") || "",
        email: d.email || "",
        phone: d.phone || "",
        company: d.company || "",
        role: d.role || d.jobTitle || "Prospect",
        country: d.country || "United States",
        city: d.city || "San Francisco",
        leadScore: d.leadScore || 50,
        scoreGrade: d.scoreGrade || "Warm",
        status: d.status || "lead",
        tags: d.tags || ["Inbound"],
        source: d.source || "Website Form",
        owner: d.owner || "Alex Rivers",
        notes: d.notes || "",
        createdAt: d.createdAt || new Date().toISOString(),
        lastContacted: d.lastContacted || "Recently",
        timeline: d.timeline || [],
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching contacts from Firestore:", err);
    try {
      handleFirestoreError(err, OperationType.LIST, "contacts");
    } catch {
      // Return empty array fallback after logging
    }
    return [];
  }
}

export function subscribeToUserContacts(userId: string, callback: (contacts: Contact[]) => void): () => void {
  const q = query(collection(db, "contacts"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const list: Contact[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const fullName = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || "Unnamed Contact";
      list.push({
        id: docSnap.id,
        name: fullName,
        firstName: d.firstName || fullName.split(" ")[0] || "",
        lastName: d.lastName || fullName.split(" ").slice(1).join(" ") || "",
        email: d.email || "",
        phone: d.phone || "",
        company: d.company || "",
        role: d.role || d.jobTitle || "Prospect",
        country: d.country || "United States",
        city: d.city || "San Francisco",
        leadScore: d.leadScore || 50,
        scoreGrade: d.scoreGrade || "Warm",
        status: d.status || "lead",
        tags: d.tags || ["Inbound"],
        source: d.source || "Website Form",
        owner: d.owner || "Alex Rivers",
        notes: d.notes || "",
        createdAt: d.createdAt || new Date().toISOString(),
        lastContacted: d.lastContacted || "Recently",
        timeline: d.timeline || [],
      });
    });
    callback(list);
  }, (err) => {
    console.warn("Real-time contacts sync error:", err);
    try {
      handleFirestoreError(err, OperationType.LIST, "contacts");
    } catch {
      // Ignored after logging
    }
  });
}

export async function addContactToFirestore(userId: string, contactData: Partial<Contact>): Promise<string> {
  const fullName = contactData.name || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim() || "New Contact";
  const ref = await addDoc(collection(db, "contacts"), {
    userId,
    name: fullName,
    firstName: contactData.firstName || fullName.split(" ")[0] || "",
    lastName: contactData.lastName || fullName.split(" ").slice(1).join(" ") || "",
    email: contactData.email || "",
    phone: contactData.phone || "",
    company: contactData.company || "",
    role: contactData.role || "Decision Maker",
    country: contactData.country || "United States",
    city: contactData.city || "",
    leadScore: contactData.leadScore || 60,
    scoreGrade: contactData.scoreGrade || "Warm",
    status: contactData.status || "lead",
    tags: contactData.tags || ["Inbound"],
    source: contactData.source || "Manual Entry",
    owner: contactData.owner || "Alex Rivers",
    notes: contactData.notes || "",
    lastContacted: new Date().toISOString().split("T")[0],
    timeline: contactData.timeline || [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        type: "note_added",
        description: "Contact created in Firestore CRM database.",
      },
    ],
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function saveBulkContactsToFirestore(
  userId: string,
  contacts: Array<Partial<Contact>>
): Promise<number> {
  let count = 0;
  for (const c of contacts) {
    if (!c.email && !c.name) continue;
    const fullName = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || "Contact";
    await addDoc(collection(db, "contacts"), {
      userId,
      name: fullName,
      firstName: c.firstName || fullName.split(" ")[0] || "",
      lastName: c.lastName || fullName.split(" ").slice(1).join(" ") || "",
      email: c.email || "",
      phone: c.phone || "+1 (555) 019-2831",
      company: c.company || "Enterprise Account",
      role: c.role || "Executive",
      country: c.country || "United States",
      city: c.city || "",
      leadScore: c.leadScore || Math.floor(Math.random() * 40) + 50,
      scoreGrade: "Warm",
      status: c.status || "lead",
      tags: c.tags || ["CSV Import"],
      source: c.source || "CSV Import",
      owner: c.owner || "Alex Rivers",
      notes: c.notes || "",
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

/**
 * Background CRM Function: Recalculates Lead Score & Status for all contacts
 * based on interaction activity and email responsiveness, updating Firestore.
 */
export async function recalculateAndSyncAllContactScores(userId: string): Promise<{ updatedCount: number; totalCount: number }> {
  try {
    const contacts = await getUserContacts(userId);
    let updatedCount = 0;

    for (const c of contacts) {
      const { leadScore, scoreGrade, status, scoreChanged, statusChanged } = calculateLeadScoreAndStatus(c);

      if (scoreChanged || statusChanged) {
        await updateContactInFirestore(c.id, {
          leadScore,
          scoreGrade,
          status,
        });
        updatedCount++;
      }
    }

    return { updatedCount, totalCount: contacts.length };
  } catch (err) {
    console.error("Error running background lead score recalculation in Firestore:", err);
    return { updatedCount: 0, totalCount: 0 };
  }
}

/**
 * Adds an interaction (e.g. Email Reply, Email Click, Meeting Booked) to a contact timeline
 * and automatically triggers background Lead Score & Status recalculation in Firestore.
 */
export async function addInteractionAndAutoScore(
  contact: Contact,
  interaction: { type: ContactTimelineItem["type"]; description: string }
): Promise<Contact> {
  const newTimelineItem: ContactTimelineItem = {
    id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    date: new Date().toISOString().split("T")[0],
    type: interaction.type,
    description: interaction.description,
  };

  const updatedTimeline = [newTimelineItem, ...(contact.timeline || [])];
  const updatedContactTemp: Contact = {
    ...contact,
    timeline: updatedTimeline,
    lastContacted: new Date().toISOString().split("T")[0],
  };

  const { leadScore, scoreGrade, status } = calculateLeadScoreAndStatus(updatedContactTemp);

  const finalUpdatedContact: Contact = {
    ...updatedContactTemp,
    leadScore,
    scoreGrade,
    status,
  };

  if (contact.id) {
    await updateContactInFirestore(contact.id, {
      timeline: updatedTimeline,
      lastContacted: finalUpdatedContact.lastContacted,
      leadScore,
      scoreGrade,
      status,
    });
  }

  return finalUpdatedContact;
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
        domain: d.domain || d.website || "example.com",
        industry: d.industry || "Software",
        size: d.size || d.employees || "50-200",
        dealsCount: d.dealsCount || 1,
        revenue: d.revenue || 50000,
        location: d.location || "San Francisco, CA",
        owner: d.owner || "Alex Rivers",
        notes: d.notes || "",
        associatedContacts: d.associatedContacts || [],
        createdAt: d.createdAt || new Date().toISOString(),
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching companies:", err);
    return [];
  }
}

export function subscribeToUserCompanies(userId: string, callback: (companies: Company[]) => void): () => void {
  const q = query(collection(db, "companies"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const list: Company[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        name: d.name || "Company",
        domain: d.domain || d.website || "example.com",
        industry: d.industry || "Software",
        size: d.size || d.employees || "50-200",
        dealsCount: d.dealsCount || 1,
        revenue: d.revenue || 50000,
        location: d.location || "San Francisco, CA",
        owner: d.owner || "Alex Rivers",
        notes: d.notes || "",
        associatedContacts: d.associatedContacts || [],
        createdAt: d.createdAt || new Date().toISOString(),
      });
    });
    callback(list);
  }, (err) => {
    console.warn("Real-time companies sync error:", err);
  });
}

export async function addCompanyToFirestore(userId: string, company: Partial<Company>): Promise<string> {
  const ref = await addDoc(collection(db, "companies"), {
    userId,
    name: company.name || "New Corporation",
    domain: company.domain || "acme.com",
    industry: company.industry || "Technology",
    size: company.size || "100-500",
    revenue: company.revenue || 75000,
    dealsCount: company.dealsCount || 0,
    location: company.location || "United States",
    owner: company.owner || "Alex Rivers",
    notes: company.notes || "",
    associatedContacts: company.associatedContacts || [],
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateCompanyInFirestore(companyId: string, updates: Partial<Company>): Promise<void> {
  const ref = doc(db, "companies", companyId);
  await updateDoc(ref, updates as any);
}

export async function deleteCompanyFromFirestore(companyId: string): Promise<void> {
  const ref = doc(db, "companies", companyId);
  await deleteDoc(ref);
}

// ================= DEALS =================
export async function getUserDeals(userId: string): Promise<Deal[]> {
  try {
    const q = query(collection(db, "deals"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const list: Deal[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        title: d.title || d.name || "Deal Opportunity",
        value: Number(d.value) || 25000,
        currency: d.currency || "USD ($)",
        pipeline: d.pipeline || "Standard Sales Pipeline",
        stage: d.stage || "lead",
        expectedClose: d.expectedClose || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        probability: d.probability !== undefined ? d.probability : 50,
        owner: d.owner || "Alex Rivers",
        companyName: d.companyName || d.associatedCompany || "Enterprise Client",
        contactName: d.contactName || d.associatedContact || "Key Stakeholder",
        notes: d.notes || "",
        createdAt: d.createdAt || new Date().toISOString(),
      });
    });
    return list;
  } catch (err) {
    console.error("Error fetching deals from Firestore:", err);
    return [];
  }
}

export function subscribeToUserDeals(userId: string, callback: (deals: Deal[]) => void): () => void {
  const q = query(collection(db, "deals"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const list: Deal[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        title: d.title || d.name || "Deal Opportunity",
        value: Number(d.value) || 25000,
        currency: d.currency || "USD ($)",
        pipeline: d.pipeline || "Standard Sales Pipeline",
        stage: d.stage || "lead",
        expectedClose: d.expectedClose || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        probability: d.probability !== undefined ? d.probability : 50,
        owner: d.owner || "Alex Rivers",
        companyName: d.companyName || d.associatedCompany || "Enterprise Client",
        contactName: d.contactName || d.associatedContact || "Key Stakeholder",
        notes: d.notes || "",
        createdAt: d.createdAt || new Date().toISOString(),
      });
    });
    callback(list);
  }, (err) => {
    console.warn("Real-time deals sync error:", err);
  });
}

export async function addDealToFirestore(userId: string, deal: Partial<Deal>): Promise<string> {
  const ref = await addDoc(collection(db, "deals"), {
    userId,
    title: deal.title || "New Enterprise Deal",
    value: Number(deal.value) || 50000,
    currency: deal.currency || "USD ($)",
    pipeline: deal.pipeline || "Standard Sales Pipeline",
    stage: deal.stage || "lead",
    expectedClose: deal.expectedClose || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    probability: deal.probability !== undefined ? deal.probability : 50,
    owner: deal.owner || "Alex Rivers",
    companyName: deal.companyName || "Target Account",
    contactName: deal.contactName || "Main Prospect",
    notes: deal.notes || "",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateDealInFirestore(dealId: string, updates: Partial<Deal>): Promise<void> {
  const ref = doc(db, "deals", dealId);
  await updateDoc(ref, updates as any);
}

export async function deleteDealFromFirestore(dealId: string): Promise<void> {
  const ref = doc(db, "deals", dealId);
  await deleteDoc(ref);
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
  const payload = sanitizeFirestorePayload({
    ...campaign,
    userId,
    updatedAt: new Date().toISOString(),
  });
  await setDoc(ref, payload);
  return campaign.id;
}

export async function updateCampaignStatusInFirestore(
  campaignId: string,
  status: "draft" | "scheduled" | "active" | "completed",
  additionalData?: any
): Promise<void> {
  const ref = doc(db, "campaigns", campaignId);
  await updateDoc(ref, {
    status,
    updatedAt: new Date().toISOString(),
    ...(additionalData || {}),
  });
}

export async function duplicateCampaignInFirestore(userId: string, campaign: GeneratedCampaign): Promise<GeneratedCampaign> {
  const newId = `camp-${Date.now()}`;
  const duplicated: GeneratedCampaign = {
    ...campaign,
    id: newId,
    name: `${campaign.name} (Copy)`,
    status: "draft",
    createdAt: new Date().toISOString().split("T")[0],
    metrics: {
      sent: 0,
      delivered: 0,
      openRate: 0,
      clickRate: 0,
      replies: 0,
      conversions: 0,
      revenue: 0,
      meetingsBooked: 0,
    },
  };
  await saveCampaignToFirestore(userId, duplicated);
  await addCampaignEventToFirestore(userId, newId, "Draft Saved", `Campaign duplicated from ${campaign.name}`);
  return duplicated;
}

export async function deleteCampaignFromFirestore(campaignId: string): Promise<void> {
  const ref = doc(db, "campaigns", campaignId);
  await deleteDoc(ref);
}

// ================= CAMPAIGN TIMELINE EVENTS =================
export interface CampaignEvent {
  id: string;
  campaignId: string;
  userId: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export async function addCampaignEventToFirestore(
  userId: string,
  campaignId: string,
  type: string,
  description: string,
  metadata: any = {}
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "campaignEvents"), {
      userId,
      campaignId,
      type,
      description,
      metadata,
      timestamp: new Date().toISOString(),
    });
    return ref.id;
  } catch (err) {
    console.error("Error adding campaign event:", err);
    return "";
  }
}

export async function getCampaignEventsFromFirestore(userId: string, campaignId?: string): Promise<CampaignEvent[]> {
  try {
    let q;
    if (campaignId) {
      q = query(
        collection(db, "campaignEvents"),
        where("userId", "==", userId),
        where("campaignId", "==", campaignId)
      );
    } else {
      q = query(collection(db, "campaignEvents"), where("userId", "==", userId));
    }
    const snap = await getDocs(q);
    const events: CampaignEvent[] = [];
    snap.forEach((docSnap) => {
      const d: any = docSnap.data();
      events.push({
        id: docSnap.id,
        campaignId: d.campaignId,
        userId: d.userId,
        type: d.type || "Event",
        description: d.description || "",
        timestamp: d.timestamp || new Date().toISOString(),
        metadata: d.metadata || {},
      });
    });
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.error("Error fetching campaign events:", err);
    return [];
  }
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

export async function getCampaignEmailsFromFirestore(userId: string, campaignId: string) {
  try {
    const q = query(
      collection(db, "emails"),
      where("userId", "==", userId),
      where("campaignId", "==", campaignId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
}

export async function recordSentEmailInFirestore(
  userId: string,
  campaignId: string,
  recipientEmail: string,
  subject: string,
  body: string,
  status: "sent" | "delivered" | "failed" | "bounced" = "delivered"
) {
  const ref = await addDoc(collection(db, "emails"), {
    userId,
    campaignId,
    recipientEmail,
    subject,
    body,
    status,
    sentAt: new Date().toISOString(),
    deliveredAt: status === "delivered" ? new Date().toISOString() : null,
    opened: false,
    clicked: false,
    converted: false,
  });
  return ref.id;
}

export async function updateEmailStatusInFirestore(
  emailId: string,
  updates: { opened?: boolean; clicked?: boolean; converted?: boolean; status?: string }
) {
  const ref = doc(db, "emails", emailId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
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

export function subscribeToUserTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
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
    callback(list);
  }, (err) => {
    console.warn("Real-time tasks sync error:", err);
  });
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

// ================= CHATS =================
// ================= WORKFLOW ENGINE FIRESTORE FUNCTIONS =================
export async function getUserWorkflows(userId: string): Promise<WorkflowAutomation[]> {
  try {
    const q = query(collection(db, "workflows"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const list: WorkflowAutomation[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as WorkflowAutomation);
    });
    return list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  } catch (err) {
    console.error("Error fetching user workflows:", err);
    return [];
  }
}

export async function saveWorkflowToFirestore(userId: string, workflow: Partial<WorkflowAutomation>): Promise<string> {
  try {
    const workflowId = workflow.id || `wf-${Date.now()}`;
    const ref = doc(db, "workflows", workflowId);
    const payload = {
      ...workflow,
      id: workflowId,
      userId,
      updatedAt: new Date().toISOString(),
      createdAt: workflow.createdAt || new Date().toISOString(),
    };
    await setDoc(ref, payload, { merge: true });
    return workflowId;
  } catch (e) {
    console.error("Error saving workflow to Firestore:", e);
    throw e;
  }
}

export async function updateWorkflowStatusInFirestore(userId: string, workflowId: string, status: 'active' | 'paused' | 'draft' | 'published'): Promise<void> {
  try {
    const ref = doc(db, "workflows", workflowId);
    await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.error("Error updating workflow status in Firestore:", e);
    throw e;
  }
}

export async function deleteWorkflowFromFirestore(workflowId: string): Promise<void> {
  try {
    const ref = doc(db, "workflows", workflowId);
    await deleteDoc(ref);
  } catch (e) {
    console.error("Error deleting workflow from Firestore:", e);
    throw e;
  }
}

export async function saveWorkflowExecutionLogToFirestore(userId: string, log: Partial<WorkflowExecutionLog>): Promise<string> {
  try {
    const logId = log.id || `log-${Date.now()}`;
    const ref = doc(db, "workflow_execution_logs", logId);
    const payload = {
      ...log,
      id: logId,
      userId,
      completedAt: log.completedAt || new Date().toISOString(),
    };
    await setDoc(ref, payload, { merge: true });
    return logId;
  } catch (e) {
    console.error("Error saving execution log to Firestore:", e);
    throw e;
  }
}

export async function getWorkflowExecutionLogsFromFirestore(userId: string, workflowId?: string): Promise<WorkflowExecutionLog[]> {
  try {
    let q = query(collection(db, "workflow_execution_logs"), where("userId", "==", userId));
    if (workflowId) {
      q = query(collection(db, "workflow_execution_logs"), where("userId", "==", userId), where("workflowId", "==", workflowId));
    }
    const snap = await getDocs(q);
    const logs: WorkflowExecutionLog[] = [];
    snap.forEach((d) => {
      logs.push({ id: d.id, ...d.data() } as WorkflowExecutionLog);
    });
    return logs.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
  } catch (e) {
    console.error("Error getting execution logs:", e);
    return [];
  }
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

    // 3. Initial Deals
    const initialDealsData = [
      { title: "Hospital AI Triage System Expansion", companyName: "Saint Jude Health System", contactName: "Dr. Elena Rostova", value: 125000, stage: "proposal" as const, probability: 80, expectedClose: "2026-08-15", owner: "Alex Rivers", notes: "Executive decision pending Board approval." },
      { title: "Supply Chain AI Route Optimizer", companyName: "Apex Global Logistics", contactName: "Marcus Vance", value: 64000, stage: "qualified" as const, probability: 60, expectedClose: "2026-08-28", owner: "Alex Rivers", notes: "Technical discovery meeting scheduled." },
      { title: "Marketing Automation Platform Licenses", companyName: "Nexus Technologies", contactName: "Sarah Chen", value: 32000, stage: "contacted" as const, probability: 40, expectedClose: "2026-09-10", owner: "Alex Rivers", notes: "Pricing sheet sent." },
      { title: "FinTech Compliance AI Engine", companyName: "Sterling Financial", contactName: "David Sterling", value: 120000, stage: "lead" as const, probability: 20, expectedClose: "2026-10-01", owner: "Alex Rivers", notes: "Inbound inquiry from webinar." },
      { title: "Clinic Pilot Program", companyName: "Saint Jude Health System", contactName: "Dr. Elena Rostova", value: 60000, stage: "won" as const, probability: 100, expectedClose: "2026-07-10", owner: "Alex Rivers", notes: "Signed agreement received!" },
    ];
    for (const d of initialDealsData) {
      await addDealToFirestore(userId, d);
    }

    // 4. Initial Tasks
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

// ================= AI SETTINGS =================
export async function getAISettingsFromFirestore(userId: string): Promise<AISettings | null> {
  try {
    const docRef = doc(db, "ai_settings", userId || "default_user");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AISettings;
    }
  } catch (err) {
    console.error("Error getting AI settings from Firestore:", err);
  }
  return null;
}

export async function saveAISettingsToFirestore(userId: string, settings: AISettings): Promise<boolean> {
  try {
    const docRef = doc(db, "ai_settings", userId || "default_user");
    await setDoc(docRef, {
      ...settings,
      userId: userId || "default_user",
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error("Error saving AI settings to Firestore:", err);
    return false;
  }
}

// Helper to strip undefined values which cause Firestore addDoc/setDoc errors
function sanitizeFirestorePayload(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date)) {
        result[key] = sanitizeFirestorePayload(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

// ================= AI LOGS =================
export async function logAIRequestToFirestore(userId: string, logData: AILogEntry): Promise<string> {
  try {
    const payload = sanitizeFirestorePayload({
      ...logData,
      userId: userId || "guest",
      createdAt: new Date().toISOString(),
    });
    const ref = await addDoc(collection(db, "ai_logs"), payload);
    return ref.id;
  } catch (err) {
    console.error("Error logging AI request to Firestore:", err);
    return `log-local-${Date.now()}`;
  }
}

export async function getAILogsFromFirestore(userId: string): Promise<AILogEntry[]> {
  try {
    const q = query(
      collection(db, "ai_logs"),
      where("userId", "==", userId || "guest")
    );
    const snap = await getDocs(q);
    const logs: AILogEntry[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      logs.push({
        id: docSnap.id,
        userId: d.userId,
        timestamp: d.timestamp || d.createdAt || new Date().toISOString(),
        prompt: d.prompt || "",
        model: d.model || "llama3.2",
        responseTimeMs: d.responseTimeMs || 0,
        response: d.response || "",
        status: d.status || "success",
        error: d.error || undefined,
      });
    });
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.error("Error fetching AI logs from Firestore:", err);
    return [];
  }
}

// ================= CHAT HISTORY / CONVERSATIONS =================
export async function getUserChats(userId: string): Promise<ChatSession[]> {
  try {
    const q = query(collection(db, "chat_sessions"), where("userId", "==", userId || "guest"));
    const snap = await getDocs(q);
    const sessions: ChatSession[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      sessions.push({
        id: docSnap.id,
        userId: d.userId,
        title: d.title || "Sales Chat",
        model: d.model || "llama3.2",
        createdAt: d.createdAt || new Date().toISOString(),
        updatedAt: d.updatedAt || new Date().toISOString(),
        messages: d.messages || [],
      });
    });
    return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error("Error fetching chat sessions from Firestore:", err);
    return [];
  }
}

export async function saveChatToFirestore(userId: string, session: ChatSession): Promise<boolean> {
  try {
    const docRef = doc(db, "chat_sessions", session.id);
    const payload = sanitizeFirestorePayload({
      ...session,
      userId: userId || "guest",
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, payload);
    return true;
  } catch (err) {
    console.error("Error saving chat session to Firestore:", err);
    return false;
  }
}

export async function deleteChatFromFirestore(userId: string, sessionId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "chat_sessions", sessionId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Error deleting chat session from Firestore:", err);
    return false;
  }
}
