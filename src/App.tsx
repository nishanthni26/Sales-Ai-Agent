import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Users, Mail, BarChart3, Menu, Bot, Layers, Building2, Megaphone, Briefcase } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { AIChatWizard } from "./components/AIChatWizard";
import { Dashboard } from "./components/Dashboard";
import { MarketingHub } from "./components/MarketingHub";
import { SalesHub } from "./components/SalesHub";
import { PropertyListings } from "./components/PropertyListings";
import { AIAutomation } from "./components/AIAutomation";
import { CRMView } from "./components/CRMView";
import { CampaignPreviewPage } from "./components/CampaignPreviewPage";
import { EmailMarketingStudio } from "./components/EmailMarketingStudio";
import { IntegrationsPage } from "./components/IntegrationsPage";
import { AIMarketplacePage } from "./components/AIMarketplacePage";
import { WorkflowMarketplacePage } from "./components/WorkflowMarketplacePage";
import { WorkflowAutomationEngine } from "./components/WorkflowAutomationEngine";
import { TestAIPage } from "./components/TestAIPage";
import { AISettingsPage } from "./components/AISettingsPage";
import { ContactsHub } from "./components/ContactsHub";
import { CampaignPreviewModal } from "./components/CampaignPreviewModal";
import {
  UserProfile,
  GeneratedCampaign,
  Contact,
  Company,
  Deal,
  Task,
  Meeting,
  CRMDocument,
  CRMNote,
  CRMActivity,
} from "./types";
import {
  defaultActiveCampaign,
  initialContacts,
  initialCompanies,
  initialDeals,
  initialTasks,
  initialMeetings,
  initialDocuments,
  initialNotes,
  initialActivities,
} from "./data/mockData";
import {
  getUserContacts,
  subscribeToUserContacts,
  addContactToFirestore,
  updateContactInFirestore,
  deleteContactFromFirestore,
  saveBulkContactsToFirestore,
  getUserCompanies,
  subscribeToUserCompanies,
  addCompanyToFirestore,
  updateCompanyInFirestore,
  deleteCompanyFromFirestore,
  getUserDeals,
  subscribeToUserDeals,
  addDealToFirestore,
  updateDealInFirestore,
  deleteDealFromFirestore,
  getUserTasks,
  subscribeToUserTasks,
  addTaskToFirestore,
  toggleTaskCompletionInFirestore,
  initializeSampleDataIfEmpty,
} from "./services/firestoreService";
import { auth, onAuthStateChanged, signInAnonymously } from "./services/firebase";

const DEFAULT_USER: UserProfile = {
  id: "usr-default",
  name: "Alex Rivers",
  email: "alex@salesflow.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  company: "SalesFlow Corp",
};

export default function App() {
  // Mode state: 'real' by default
  const [appMode, setAppMode] = useState<"demo" | "real">("real");
  const [selectedModel, setSelectedModel] = useState<string>("Llama 3.2");

  // Auth state - default active user
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [realUser, setRealUser] = useState<UserProfile | null>(null);

  const [activeTab, setActiveTab] = useState<any>("dashboard");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // App Data State
  const [campaign, setCampaign] = useState<GeneratedCampaign>(defaultActiveCampaign);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [documents, setDocuments] = useState<CRMDocument[]>(initialDocuments);
  const [notes, setNotes] = useState<CRMNote[]>(initialNotes);
  const [activities, setActivities] = useState<CRMActivity[]>(initialActivities);

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState("");
  const [previewState, setPreviewState] = useState<{ isOpen: boolean; type: string }>({
    isOpen: false,
    type: "landing",
  });

  // Switch between Demo Mode and Real AI Mode
  const handleSwitchMode = (newMode: "demo" | "real") => {
    setAppMode(newMode);
    if (newMode === "demo") {
      setUser(DEFAULT_USER);
      setContacts(initialContacts);
      setCompanies(initialCompanies);
      setDeals(initialDeals);
      setTasks(initialTasks);
    } else {
      // Real AI Mode
      if (realUser) {
        setUser(realUser);
      } else {
        setUser(null);
        setIsAuthOpen(true);
      }
    }
  };

  // Listen for Firebase Auth state changes or auto-sign-in anonymously
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const loggedUser: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "Alex Rivers",
          email: fbUser.email || "alex@salesflow.ai",
          avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          company: "SalesFlow Corp",
        };
        setRealUser(loggedUser);
        setUser((prev) => (prev?.id === loggedUser.id ? prev : loggedUser));
      } else {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.warn("Anonymous auth sign-in notice:", e);
        }
      }
    });

    return () => unsub();
  }, []);

  // Real-time Firestore CRM listeners
  useEffect(() => {
    if (!user) return;

    let unsubContacts: (() => void) | null = null;
    let unsubCompanies: (() => void) | null = null;
    let unsubDeals: (() => void) | null = null;
    let unsubTasks: (() => void) | null = null;

    async function setupRealtimeCRM() {
      try {
        await initializeSampleDataIfEmpty(user!.id);

        unsubContacts = subscribeToUserContacts(user!.id, (list) => {
          if (list.length > 0) setContacts(list);
        });

        unsubCompanies = subscribeToUserCompanies(user!.id, (list) => {
          if (list.length > 0) setCompanies(list);
        });

        unsubDeals = subscribeToUserDeals(user!.id, (list) => {
          if (list.length > 0) setDeals(list);
        });

        unsubTasks = subscribeToUserTasks(user!.id, (list) => {
          if (list.length > 0) setTasks(list);
        });
      } catch (err) {
        console.error("Error setting up real-time CRM subscriptions:", err);
      }
    }

    setupRealtimeCRM();

    return () => {
      if (unsubContacts) unsubContacts();
      if (unsubCompanies) unsubCompanies();
      if (unsubDeals) unsubDeals();
      if (unsubTasks) unsubTasks();
    };
  }, [user, appMode]);

  // Handle Campaign Launch -> Navigates to Analytics Dashboard
  const handleCampaignLaunched = (newCampaign: GeneratedCampaign) => {
    setCampaign(newCampaign);
    setActiveTab("dashboard");
  };

  // Handle CRM State Updates with Firestore Persistence
  const handleAddContact = async (newContact: Partial<Contact>) => {
    let docId = newContact.id;
    if (user) {
      try {
        docId = await addContactToFirestore(user.id, newContact);
      } catch (e) {
        console.error("Error adding contact to Firestore:", e);
      }
    }
    const createdContact: Contact = {
      id: docId || `c-${Date.now()}`,
      name: newContact.name || `${newContact.firstName || ''} ${newContact.lastName || ''}`.trim() || "New Contact",
      firstName: newContact.firstName || "",
      lastName: newContact.lastName || "",
      email: newContact.email || "",
      phone: newContact.phone || "+1 (555) 000-1122",
      company: newContact.company || "Independent",
      role: newContact.role || "Executive",
      country: newContact.country || "United States",
      city: newContact.city || "",
      leadScore: newContact.leadScore || 85,
      scoreGrade: newContact.scoreGrade || "Hot",
      status: newContact.status || "lead",
      tags: newContact.tags || ["Manual Entry"],
      source: newContact.source || "Manual Entry",
      owner: newContact.owner || "Alex Rivers",
      notes: newContact.notes || "",
      lastContacted: newContact.lastContacted || "Just now",
      timeline: newContact.timeline || [
        {
          id: `t-${Date.now()}`,
          date: "Today",
          type: "note_added",
          description: "Contact created in SalesFlow CRM",
        },
      ],
    };
    setContacts((prev) => [createdContact, ...prev]);
  };

  const handleEditContact = async (updated: Contact) => {
    if (user && updated.id) {
      try {
        await updateContactInFirestore(updated.id, updated);
      } catch (e) {
        console.error("Error updating contact in Firestore:", e);
      }
    }
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteContact = async (contactId: string) => {
    if (user) {
      try {
        await deleteContactFromFirestore(contactId);
      } catch (e) {
        console.error("Error deleting contact from Firestore:", e);
      }
    }
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const handleBulkImportContacts = async (newContacts: Contact[]) => {
    if (user) {
      try {
        await saveBulkContactsToFirestore(user.id, newContacts);
        const refreshed = await getUserContacts(user.id);
        if (refreshed.length > 0) {
          setContacts(refreshed);
          return;
        }
      } catch (e) {
        console.error("Error saving bulk contacts to Firestore:", e);
      }
    }
    setContacts((prev) => [...newContacts, ...prev]);
  };

  const handleAddCompany = async (newComp: Partial<Company>) => {
    let docId = newComp.id;
    if (user) {
      try {
        docId = await addCompanyToFirestore(user.id, newComp);
      } catch (e) {
        console.error("Error adding company to Firestore:", e);
      }
    }
    const createdCompany: Company = {
      id: docId || `comp-${Date.now()}`,
      name: newComp.name || "New Corporation",
      domain: newComp.domain || "example.com",
      industry: newComp.industry || "Technology",
      size: newComp.size || "100-500 employees",
      revenue: newComp.revenue || 0,
      dealsCount: newComp.dealsCount || 0,
      location: newComp.location || "San Francisco, CA",
      owner: newComp.owner || "Alex Rivers",
      notes: newComp.notes || "",
      associatedContacts: newComp.associatedContacts || [],
    };
    setCompanies((prev) => [createdCompany, ...prev]);
  };

  const handleEditCompany = async (updated: Company) => {
    if (user && updated.id) {
      try {
        await updateCompanyInFirestore(updated.id, updated);
      } catch (e) {
        console.error("Error updating company in Firestore:", e);
      }
    }
    setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (user) {
      try {
        await deleteCompanyFromFirestore(companyId);
      } catch (e) {
        console.error("Error deleting company from Firestore:", e);
      }
    }
    setCompanies((prev) => prev.filter((c) => c.id !== companyId));
  };

  const handleAddDeal = async (newDeal: Partial<Deal>) => {
    let docId = newDeal.id;
    if (user) {
      try {
        docId = await addDealToFirestore(user.id, newDeal);
      } catch (e) {
        console.error("Error adding deal to Firestore:", e);
      }
    }
    const createdDeal: Deal = {
      id: docId || `d-${Date.now()}`,
      title: newDeal.title || "New Enterprise Opportunity",
      companyName: newDeal.companyName || "Target Account",
      contactName: newDeal.contactName || "Key Stakeholder",
      value: newDeal.value || 50000,
      currency: newDeal.currency || "USD ($)",
      pipeline: newDeal.pipeline || "Standard Sales Pipeline",
      stage: newDeal.stage || "lead",
      probability: newDeal.probability !== undefined ? newDeal.probability : 50,
      expectedClose: newDeal.expectedClose || "2026-08-30",
      owner: newDeal.owner || "Alex Rivers",
      notes: newDeal.notes || "",
    };
    setDeals((prev) => [createdDeal, ...prev]);
  };

  const handleUpdateDealStage = async (dealId: string, newStage: Deal["stage"]) => {
    if (user) {
      try {
        await updateDealInFirestore(dealId, { stage: newStage });
      } catch (e) {
        console.error("Error updating deal stage in Firestore:", e);
      }
    }
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  const handleEditDeal = async (updated: Deal) => {
    if (user && updated.id) {
      try {
        await updateDealInFirestore(updated.id, updated);
      } catch (e) {
        console.error("Error updating deal in Firestore:", e);
      }
    }
    setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (user) {
      try {
        await deleteDealFromFirestore(dealId);
      } catch (e) {
        console.error("Error deleting deal from Firestore:", e);
      }
    }
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
  };

  const handleAddTask = async (newTask: Partial<Task>) => {
    let docId = newTask.id;
    if (user) {
      try {
        docId = await addTaskToFirestore(user.id, newTask);
      } catch (e) {
        console.error("Error adding task to Firestore:", e);
      }
    }
    const createdTask: Task = {
      id: docId || `tk-${Date.now()}`,
      title: newTask.title || "New Outreach Action",
      dueDate: newTask.dueDate || "2026-07-30",
      priority: newTask.priority || "high",
      completed: false,
      assignee: newTask.assignee || "Sales AI Agent",
      relatedTo: newTask.relatedTo || "General Outreach",
    };
    setTasks((prev) => [createdTask, ...prev]);
  };

  const handleToggleTask = async (taskId: string) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (existing && user) {
      try {
        await toggleTaskCompletionInFirestore(taskId, existing.completed);
      } catch (e) {
        console.error("Error toggling task in Firestore:", e);
      }
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
  };

  const handleAddDocument = (newDoc: CRMDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleAddNote = (newNote: CRMNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleAddActivity = (newAct: CRMActivity) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  // Handle Assistant Commands
  const handleAssistantCommand = (cmd: string) => {
    if (cmd === "nav:wizard") setActiveTab("wizard");
    else if (cmd === "nav:dashboard") setActiveTab("dashboard");
    else if (cmd === "nav:crm") setActiveTab("crm");
    else if (cmd === "preview:landing") setPreviewState({ isOpen: true, type: "landing" });
    else if (cmd === "preview:whatsapp") setPreviewState({ isOpen: true, type: "whatsapp" });
    else if (cmd === "nav:crm:meetings") setActiveTab("crm");
  };

  const showSidebar = !!user && activeTab !== "landing";

  return (
    <div className="min-h-screen bg-[#0b0f17] bg-radial-gradient font-sans text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Sidebar for logged in application view */}
      {showSidebar && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onNewCampaign={() => {
            setActiveTab("wizard");
          }}
          onSelectCampaignThread={(c) => {
            setCampaign(c);
            setActiveTab("wizard");
          }}
          activeCampaign={campaign}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            setUser(null);
            setRealUser(null);
            setActiveTab("landing");
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 pb-16 md:pb-0 ${showSidebar ? (sidebarCollapsed ? "md:pl-16 pl-0" : "md:pl-64 pl-0") : "pl-0"}`}>
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          appMode={appMode}
          onSwitchMode={handleSwitchMode}
          selectedModel={selectedModel}
          onSelectModel={(m) => setSelectedModel(m)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            setUser(null);
            setRealUser(null);
            setActiveTab("landing");
          }}
          onOpenAssistant={(query) => {
            if (query) setAssistantInitialQuery(query);
            setIsAssistantOpen(true);
          }}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main View Router */}
        <main className="flex-1 flex flex-col pb-20 md:pb-0 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + appMode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {activeTab === "landing" || (!user && appMode === "real") ? (
                <LandingPage
                  appMode={appMode}
                  onSwitchMode={handleSwitchMode}
                  onStartFree={() => {
                    if (appMode === "real" && !user) setIsAuthOpen(true);
                    else setActiveTab("wizard");
                  }}
                />
              ) : activeTab === "wizard" ? (
                <AIChatWizard
                  appMode={appMode}
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                  user={user}
                  onCampaignLaunched={handleCampaignLaunched}
                  onPreviewAsset={(assetType) => setPreviewState({ isOpen: true, type: assetType })}
                />
              ) : activeTab === "dashboard" ? (
                <Dashboard
                  campaign={campaign}
                  onOpenAssistant={(q) => {
                    if (q) setAssistantInitialQuery(q);
                    setIsAssistantOpen(true);
                  }}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              ) : activeTab === "marketing" || activeTab === "email_marketing" ? (
                <MarketingHub />
              ) : activeTab === "sales" || activeTab === "crm" ? (
                <SalesHub />
              ) : activeTab === "contacts" ? (
                <ContactsHub
                  contacts={contacts}
                  companies={companies}
                  deals={deals}
                  tasks={tasks}
                  onAddContact={handleAddContact}
                  onUpdateContact={(id, updated) => {
                    const existing = contacts.find((c) => c.id === id);
                    if (existing) {
                      handleEditContact({ ...existing, ...updated });
                    }
                  }}
                  onDeleteContact={handleDeleteContact}
                  onImportContacts={(imported) => {
                    imported.forEach((cnt) => handleAddContact(cnt));
                  }}
                  onNavigateToEmailStudio={() => setActiveTab("marketing")}
                  onOpenAIAssistant={(query) => {
                    if (query) setAssistantInitialQuery(query);
                    setIsAssistantOpen(true);
                  }}
                />
              ) : activeTab === "ai_automation" || activeTab === "workflows" ? (
                <AIAutomation />
              ) : activeTab === "properties" ? (
                <PropertyListings />
              ) : activeTab === "preview" ? (
                <CampaignPreviewPage
                  campaign={campaign}
                  user={user}
                  onUpdateCampaign={(updated) => setCampaign(updated)}
                  onLaunchCampaign={handleCampaignLaunched}
                  onBackToChat={() => setActiveTab("wizard")}
                />
              ) : activeTab === "integrations" ? (
                <IntegrationsPage />
              ) : activeTab === "aimarketplace" ? (
                <AIMarketplacePage />
              ) : activeTab === "test_ai" ? (
                <TestAIPage user={user} defaultModel={selectedModel} />
              ) : (
                <AISettingsPage />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setRealUser(loggedUser);
          setUser(loggedUser);
          setAppMode("real");
          setActiveTab("wizard"); // Directly show full-screen AI chat interface after login
        }}
      />

      {/* Asset Preview Modal */}
      <CampaignPreviewModal
        isOpen={previewState.isOpen}
        assetType={previewState.type}
        campaign={campaign}
        onClose={() => setPreviewState({ isOpen: false, type: "landing" })}
      />

      {/* MOBILE FLOATING BOTTOM NAVIGATION DOCK (< md breakpoint) */}
      {showSidebar && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 md:hidden flex items-center justify-around shadow-2xl text-slate-300">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "text-cyan-300 font-extrabold bg-cyan-500/10 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("marketing")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "marketing"
                ? "text-purple-300 font-extrabold bg-purple-500/10 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Megaphone className="w-5 h-5" />
            <span className="text-[10px] font-bold">Marketing</span>
          </button>

          <button
            onClick={() => setActiveTab("sales")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "sales"
                ? "text-emerald-300 font-extrabold bg-emerald-500/10 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] font-bold">Sales Hub</span>
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "contacts"
                ? "text-cyan-300 font-extrabold bg-cyan-500/10 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold">Contacts</span>
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold">Menu</span>
          </button>
        </nav>
      )}
    </div>
  );
}
