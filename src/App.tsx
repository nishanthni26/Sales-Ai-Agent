import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { AIChatWizard } from "./components/AIChatWizard";
import { Dashboard } from "./components/Dashboard";
import { CRMView } from "./components/CRMView";
import { CampaignPreviewPage } from "./components/CampaignPreviewPage";
import { IntegrationsPage } from "./components/IntegrationsPage";
import { AIMarketplacePage } from "./components/AIMarketplacePage";
import { WorkflowMarketplacePage } from "./components/WorkflowMarketplacePage";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
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
import { CRMNote, CRMActivity } from "./types";

export default function App() {
  // Auth state - default logged in for smooth immediate experience
  const [user, setUser] = useState<UserProfile | null>({
    id: "usr-demo",
    name: "Alex Rivers",
    email: "alex.dev@salesflow.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    company: "SalesFlow AI",
  });

  const [activeTab, setActiveTab] = useState<
    "landing" | "wizard" | "dashboard" | "crm" | "preview" | "integrations" | "aimarketplace" | "workflows" | "settings"
  >("wizard"); // Per prompt: After login, show full-screen AI chat interface!

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

  // Handle Campaign Launch -> Navigates to Analytics Dashboard
  const handleCampaignLaunched = (newCampaign: GeneratedCampaign) => {
    setCampaign(newCampaign);
    setActiveTab("dashboard");
  };

  // Handle CRM State Updates
  const handleAddContact = (newContact: Contact) => {
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleBulkImportContacts = (newContacts: Contact[]) => {
    setContacts((prev) => [...newContacts, ...prev]);
  };

  const handleAddCompany = (newComp: Company) => {
    setCompanies((prev) => [newComp, ...prev]);
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);
  };

  const handleUpdateDealStage = (dealId: string, newStage: Deal["stage"]) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
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
            setActiveTab("landing");
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? (sidebarCollapsed ? "md:pl-16 pl-0" : "md:pl-64 pl-0") : "pl-0"}`}>
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            setUser(null);
            setActiveTab("landing");
          }}
          onOpenAssistant={(query) => {
            if (query) setAssistantInitialQuery(query);
            setIsAssistantOpen(true);
          }}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main View Router */}
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (user ? "-user" : "-anon")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {activeTab === "landing" || !user ? (
                <LandingPage
                  onStartFree={() => {
                    if (!user) setIsAuthOpen(true);
                    else setActiveTab("wizard");
                  }}
                />
              ) : activeTab === "wizard" ? (
                <AIChatWizard
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
                />
              ) : activeTab === "crm" ? (
                <CRMView
                  contacts={contacts}
                  companies={companies}
                  deals={deals}
                  tasks={tasks}
                  meetings={meetings}
                  documents={documents}
                  notes={notes}
                  activities={activities}
                  onAddContact={handleAddContact}
                  onBulkImportContacts={handleBulkImportContacts}
                  onAddCompany={handleAddCompany}
                  onAddDeal={handleAddDeal}
                  onUpdateDealStage={handleUpdateDealStage}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onAddMeeting={handleAddMeeting}
                  onAddDocument={handleAddDocument}
                  onAddNote={handleAddNote}
                  onAddActivity={handleAddActivity}
                />
              ) : activeTab === "preview" ? (
                <CampaignPreviewPage
                  campaign={campaign}
                  onUpdateCampaign={(updated) => setCampaign(updated)}
                  onLaunchCampaign={handleCampaignLaunched}
                  onBackToChat={() => setActiveTab("wizard")}
                />
              ) : activeTab === "integrations" ? (
                <IntegrationsPage />
              ) : activeTab === "aimarketplace" ? (
                <AIMarketplacePage />
              ) : activeTab === "workflows" ? (
                <WorkflowMarketplacePage
                  onCustomizeWithAI={(wfName) => {
                    setActiveTab("wizard");
                    setIsAssistantOpen(true);
                  }}
                />
              ) : (
                <div className="p-8 max-w-4xl mx-auto space-y-6">
                  <h1 className="text-2xl font-bold">Platform Settings</h1>
                  <div className="p-6 rounded-3xl bg-[#2f2f2f] border border-white/10 space-y-4 text-xs">
                    <div>
                      <p className="font-semibold text-slate-200">Connected Account</p>
                      <p className="text-slate-400">{user.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">AI Model Provider</p>
                      <p className="text-emerald-400 font-bold">SalesFlow AI Engine</p>
                    </div>
                  </div>
                </div>
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
          setUser(loggedUser);
          setActiveTab("wizard"); // Directly show full-screen AI chat interface after login
        }}
      />

      {/* Persistent AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialQuery={assistantInitialQuery}
        onExecuteCommand={handleAssistantCommand}
      />

      {/* Asset Preview Modal */}
      <CampaignPreviewModal
        isOpen={previewState.isOpen}
        assetType={previewState.type}
        campaign={campaign}
        onClose={() => setPreviewState({ isOpen: false, type: "landing" })}
      />
    </div>
  );
}
