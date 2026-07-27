import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  User,
  Sparkles,
  Send,
  UploadCloud,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Smartphone,
  Linkedin,
  Workflow,
  Users,
  Clock,
  Rocket,
  Layers,
  Eye,
  Plus,
  RefreshCw,
  Paperclip,
  ShieldCheck,
  Zap,
  Flame,
  Globe,
  Database,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Compass,
  RotateCcw,
  Building2,
  DollarSign,
  Image as ImageIcon,
  Check,
  X,
  FileSpreadsheet,
  Share2,
  Phone,
  Calendar,
  Edit3,
  Save,
  Trash2,
} from "lucide-react";
import {
  CampaignType,
  CampaignGoal,
  UploadedAsset,
  GeneratedCampaign,
  ChatMessage,
  UserProfile,
} from "../types";
import { askAIChat, streamAIChat, synthesizeCampaign, generateCampaignWithAI } from "../services/aiService";
import { saveCampaignToFirestore, saveChatToFirestore } from "../services/firestoreService";

interface AIChatWizardProps {
  onCampaignLaunched: (campaign: GeneratedCampaign) => void;
  onPreviewAsset: (assetType: string, campaign: GeneratedCampaign) => void;
  appMode?: "demo" | "real";
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
  user?: UserProfile | null;
}

// Exact placeholder examples requested by user
const PLACEHOLDER_EXAMPLES = [
  { label: "Generate 500 leads", icon: "🎯", prompt: "Generate 500 leads for my business" },
  { label: "Launch Email Campaign", icon: "📧", prompt: "Launch an email campaign to cold prospects" },
  { label: "Promote my Webinar", icon: "🎥", prompt: "Promote my webinar and boost signups" },
  { label: "Increase Shopify Sales", icon: "🛍️", prompt: "Increase Shopify sales with automated workflows" },
  { label: "Book Meetings", icon: "📅", prompt: "Book qualified sales meetings with decision makers" },
  { label: "Sell my SaaS", icon: "💻", prompt: "Sell my B2B SaaS product" },
];

// Exact suggestion cards requested by user
const SUGGESTION_CARDS = [
  {
    title: "Generate Leads",
    desc: "Capture target decision makers & build prospect lists",
    icon: Target,
    prompt: "I want to generate B2B leads for my business.",
  },
  {
    title: "Create Campaign",
    desc: "Design multi-channel email, WhatsApp, SMS & LinkedIn campaign",
    icon: Rocket,
    prompt: "Create an end-to-end sales campaign.",
  },
  {
    title: "Build Landing Page",
    desc: "Generate responsive landing page with AI copy",
    icon: Layers,
    prompt: "Build a high-converting sales landing page.",
  },
  {
    title: "Import Contacts",
    desc: "Upload CSV contact lists or connect with CRM",
    icon: UploadCloud,
    action: "step_contacts",
  },
  {
    title: "Analyze CRM",
    desc: "Audit sales pipeline health & deal probability",
    icon: BarChart3,
    prompt: "Analyze my CRM contacts and sales pipeline.",
  },
  {
    title: "Generate Proposal",
    desc: "Draft custom B2B sales proposals & contract terms",
    icon: FileText,
    prompt: "Generate a personalized B2B sales proposal.",
  },
  {
    title: "Create Sales Funnel",
    desc: "Map automated workflow triggers & conversion paths",
    icon: Workflow,
    prompt: "Create a 5-step automated sales funnel.",
  },
  {
    title: "Marketing Strategy",
    desc: "Get an AI growth strategy, segmentation & ROI audit",
    icon: Compass,
    prompt: "Develop a 90-day growth and marketing strategy.",
  },
];

// Step Questions metadata
interface QuestionStepDef {
  step: number;
  key: string;
  question: string;
  subtext?: string;
  chips?: string[];
  isUpload?: boolean;
  uploadType?: "logo" | "images" | "pdf" | "csv" | "crm";
}

const QUESTION_STEPS: QuestionStepDef[] = [
  {
    step: 1,
    key: "product",
    question: "What do you sell?",
    subtext: "Tell me about your product, service, software, or offer.",
    chips: [
      "B2B SaaS Platform",
      "E-commerce & Retail Products",
      "Consulting & Professional Services",
      "Enterprise Software",
      "Digital Courses & Webinars",
      "Agency & Marketing Services",
    ],
  },
  {
    step: 2,
    key: "audience",
    question: "Who is your target audience?",
    subtext: "Specify the ideal decision makers, job titles, or customer segments.",
    chips: [
      "VP of Sales & Marketing",
      "Small & Medium Business Owners",
      "Shopify & E-commerce Founders",
      "Enterprise CTOs & IT Directors",
      "Healthcare & Clinic Directors",
      "Real Estate & Finance Leaders",
    ],
  },
  {
    step: 3,
    key: "country",
    question: "Which country are you targeting?",
    subtext: "Select your primary geographical market or region.",
    chips: [
      "United States & Canada",
      "United Kingdom & Europe",
      "India & Southeast Asia",
      "Australia & New Zealand",
      "Latin America",
      "Global / Worldwide",
    ],
  },
  {
    step: 4,
    key: "budget",
    question: "What's your budget?",
    subtext: "Choose your estimated monthly marketing or campaign budget.",
    chips: [
      "$500 - $1,000 / mo",
      "$1,000 - $5,000 / mo",
      "$5,000 - $15,000 / mo",
      "$15,000+ / mo",
      "Bootstrap ($0 - Conversion based)",
    ],
  },
  {
    step: 5,
    key: "logo",
    question: "Upload your logo.",
    subtext: "Upload your company or brand logo for high-converting campaign branding.",
    isUpload: true,
    uploadType: "logo",
  },
  {
    step: 6,
    key: "productImages",
    question: "Upload product images.",
    subtext: "Provide product photos, screenshots, or visual assets for landing pages & social ads.",
    isUpload: true,
    uploadType: "images",
  },
  {
    step: 7,
    key: "brochure",
    question: "Upload brochure.",
    subtext: "Upload a sales PDF, slide deck, product sheet, or case study document.",
    isUpload: true,
    uploadType: "pdf",
  },
  {
    step: 8,
    key: "contactsCSV",
    question: "Upload contacts CSV.",
    subtext: "Provide your prospect contact list or let AI generate 500 verified B2B leads.",
    isUpload: true,
    uploadType: "csv",
  },
  {
    step: 9,
    key: "crm",
    question: "Connect CRM.",
    subtext: "Link your existing CRM platform or use the built-in SalesFlow AI CRM.",
    isUpload: true,
    uploadType: "crm",
  },
];

const THINKING_STEPS = [
  { text: "Understanding business...", icon: Building2 },
  { text: "Analyzing audience...", icon: Users },
  { text: "Creating customer personas...", icon: Target },
  { text: "Writing campaign...", icon: Sparkles },
  { text: "Generating landing page...", icon: Layers },
  { text: "Creating emails...", icon: Mail },
  { text: "Creating WhatsApp messages...", icon: MessageSquare },
  { text: "Preparing CRM...", icon: Database },
  { text: "Predicting campaign performance...", icon: BarChart3 },
  { text: "Campaign Ready.", icon: CheckCircle2 },
];

export const AIChatWizard: React.FC<AIChatWizardProps> = ({
  onCampaignLaunched,
  onPreviewAsset,
  appMode = "demo",
  selectedModel = "Llama 3.2",
  onSelectModel,
  user,
}) => {
  // Electric Cyan Theme Configuration
  const CYAN_THEME = {
    name: "Electric Cyan",
    gradientText: "from-cyan-400 via-sky-300 to-blue-500",
    borderGlow: "from-cyan-500/60 via-sky-500/40 to-blue-500/60",
    btnBg: "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/60",
    badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    orb1: "bg-cyan-500/25",
    orb2: "bg-blue-500/20",
    iconText: "text-cyan-400",
  };

  // Step tracker: 0 = Home screen, 1..9 = Question steps, 10 = Campaign Generation Complete
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Collected Campaign Brief Data
  const [brief, setBrief] = useState({
    product: "",
    audience: "",
    country: "",
    budget: "",
    logo: null as UploadedAsset | string | null,
    productImages: [] as UploadedAsset[],
    brochure: null as UploadedAsset | string | null,
    contactsCSV: null as UploadedAsset | string | null,
    crm: null as string | null,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [homeInput, setHomeInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isAITyping, setIsAITyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState(0);

  // Generated Campaign State
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
  const [previewTab, setPreviewTab] = useState<
    | "overview"
    | "persona"
    | "segments"
    | "email"
    | "landing"
    | "whatsapp"
    | "sms"
    | "linkedin"
    | "workflow"
    | "social"
    | "scripts"
    | "booking"
  >("overview");

  // Cinematic launch state
  const [isLaunchingCinematic, setIsLaunchingCinematic] = useState(false);
  const [launchStepIndex, setLaunchStepIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping, isThinking, generatedCampaign, currentThinkingStep]);

  // Reset / Start Fresh
  const handleResetHome = () => {
    setCurrentStep(0);
    setBrief({
      product: "",
      audience: "",
      country: "",
      budget: "",
      logo: null,
      productImages: [],
      brochure: null,
      contactsCSV: null,
      crm: null,
    });
    setMessages([]);
    setGeneratedCampaign(null);
    setIsThinking(false);
    setIsAITyping(false);
    setHomeInput("");
    setInputMessage("");
  };

  // Helper to trigger the next question in the sequence
  const askNextQuestion = (
    nextStepIndex: number,
    updatedBrief: typeof brief,
    introText?: string
  ) => {
    if (nextStepIndex > 9) {
      // All 9 questions answered -> Run full AI campaign generation!
      finishInterviewAndGenerate(updatedBrief);
      return;
    }

    setCurrentStep(nextStepIndex);
    const stepDef = QUESTION_STEPS[nextStepIndex - 1];

    setIsAITyping(true);

    setTimeout(() => {
      setIsAITyping(false);

      const botText = `${introText ? introText + "\n\n" : ""}${stepDef.question}\n_${stepDef.subtext || ""}_`;

      const botMsg: ChatMessage = {
        id: `bot-step-${nextStepIndex}-${Date.now()}`,
        role: "assistant",
        text: botText,
        timestamp: "Just now",
        payload: { stepDef, stepNumber: nextStepIndex },
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // User submits initial goal or clicks suggestion/example
  const handleStartInterview = (initialGoal: string) => {
    if (!initialGoal.trim()) return;

    // Reset chat
    setMessages([]);
    setGeneratedCampaign(null);

    // Initial user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: initialGoal,
      timestamp: "Just now",
    };

    setMessages([userMsg]);
    setHomeInput("");
    setInputMessage("");

    // Infer product if contained, or set initial product
    let newBrief = { ...brief };
    const cleanGoal = initialGoal.trim().toLowerCase();
    const isGreeting = ["hi", "hello", "hey", "hola", "start", "test", "demo", "help", "hallo", "yo"].includes(cleanGoal) || cleanGoal.length <= 3;

    if (isGreeting) {
      const ack = `Hello! I'm your AI Sales & Marketing Manager. I am powered by Gemini 3.6 Flash to build, launch, and optimize your complete multi-channel sales campaign in real time.\n\nI will guide you through 9 quick questions step-by-step to customize every detail for your business.`;
      askNextQuestion(1, newBrief, ack);
    } else if (
      cleanGoal.includes("saas") ||
      cleanGoal.includes("product") ||
      cleanGoal.includes("webinar") ||
      cleanGoal.includes("leads") ||
      cleanGoal.includes("shopify") ||
      cleanGoal.includes("agency") ||
      cleanGoal.includes("software") ||
      cleanGoal.includes("service")
    ) {
      newBrief.product = initialGoal;
      setBrief(newBrief);
      const ack = `Hello! I'm your AI Sales & Marketing Manager. Let's build, launch, and optimize your real-time campaign for **"${initialGoal}"**.\n\nGot it! Product/Goal recorded: **${initialGoal}**.`;
      askNextQuestion(2, newBrief, ack);
    } else {
      newBrief.product = initialGoal;
      setBrief(newBrief);
      const ack = `Hello! I'm your AI Sales & Marketing Manager. Let's build, launch, and optimize your real-time campaign for **"${initialGoal}"**.\n\nProduct/Goal recorded: **${initialGoal}**.`;
      askNextQuestion(2, newBrief, ack);
    }
  };

  // Handle user answer to current question
  const handleAnswerStep = (answerValue: string) => {
    if (!answerValue.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: `usr-ans-${currentStep}-${Date.now()}`,
      role: "user",
      text: answerValue,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Update brief
    const updatedBrief = { ...brief };
    if (currentStep === 1) updatedBrief.product = answerValue;
    else if (currentStep === 2) updatedBrief.audience = answerValue;
    else if (currentStep === 3) updatedBrief.country = answerValue;
    else if (currentStep === 4) updatedBrief.budget = answerValue;
    else if (currentStep === 5) updatedBrief.logo = answerValue;
    else if (currentStep === 6) updatedBrief.productImages = [
      { id: "img-1", name: answerValue, type: "image", size: "1.2 MB", uploadedAt: "Just now" },
    ];
    else if (currentStep === 7) updatedBrief.brochure = answerValue;
    else if (currentStep === 8) updatedBrief.contactsCSV = answerValue;
    else if (currentStep === 9) updatedBrief.crm = answerValue;

    setBrief(updatedBrief);

    // Proceed to next question
    const nextStepNum = currentStep + 1;
    let ackMessage = `Got it! Recorded **${answerValue}**.`;

    if (currentStep === 1) ackMessage = `Awesome! Product recorded: **${answerValue}**.`;
    else if (currentStep === 2) ackMessage = `Understood! Target audience: **${answerValue}**.`;
    else if (currentStep === 3) ackMessage = `Target region locked: **${answerValue}**.`;
    else if (currentStep === 4) ackMessage = `Budget noted: **${answerValue}**.`;
    else if (currentStep === 5) ackMessage = `Logo configuration: **${answerValue}**.`;
    else if (currentStep === 6) ackMessage = `Product visuals set: **${answerValue}**.`;
    else if (currentStep === 7) ackMessage = `Sales collateral set: **${answerValue}**.`;
    else if (currentStep === 8) ackMessage = `Contact list configured: **${answerValue}**.`;
    else if (currentStep === 9) ackMessage = `CRM system connected: **${answerValue}**.`;

    askNextQuestion(nextStepNum, updatedBrief, ackMessage);
  };

  // Handle free-form general chat questions after step 9 or in general chat mode
  const handleFreeFormChatMessage = async (text: string) => {
    if (!text.trim() || isAITyping) return;

    const userText = text.trim();
    const userMsg: ChatMessage = {
      id: `usr-chat-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: "Just now",
    };

    const assistantMsgId = `bot-stream-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      text: "",
      timestamp: "Just now",
      modelUsed: selectedModel,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputMessage("");
    setIsAITyping(true);

    const historyForAI = messages.slice(-10).map((m) => ({
      role: m.role,
      text: m.text || "",
    }));

    let fullStreamed = "";

    try {
      const { fullText, modelUsed, error } = await streamAIChat(
        userText,
        historyForAI,
        "You are SalesFlow AI assistant. Help the user optimize campaigns, workflows, copy, and CRM pipelines.",
        (chunk) => {
          fullStreamed += chunk;
          setMessages((prevMsgs) =>
            prevMsgs.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, text: fullStreamed, modelUsed } : msg
            )
          );
        },
        "Chatbot Message",
        selectedModel,
        user?.id
      );

      setMessages((prevMsgs) =>
        prevMsgs.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                text: error || fullText || "AI service offline.",
                modelUsed: modelUsed || selectedModel,
              }
            : msg
        )
      );

      // Save conversation to Firestore
      if (user?.id) {
        saveChatToFirestore(user.id, {
          id: `chat-${Date.now()}`,
          userId: user.id,
          title: userText.slice(0, 30),
          model: selectedModel,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [...messages, userMsg, { ...assistantMsg, text: fullText }],
        }).catch(console.error);
      }
    } catch (e: any) {
      setMessages((prevMsgs) =>
        prevMsgs.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, text: "AI service offline." }
            : msg
        )
      );
    } finally {
      setIsAITyping(false);
    }
  };

  // Handle file uploads for upload steps
  const handleUploadForStep = (e: React.ChangeEvent<HTMLInputElement>, uploadType: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const asset: UploadedAsset = {
      id: `ast-${Date.now()}`,
      name: file.name,
      type: file.name.endsWith(".csv") ? "csv" : file.name.endsWith(".pdf") ? "pdf" : "image",
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: "Just now",
    };

    let valName = `Uploaded File: ${file.name}`;
    handleAnswerStep(valName);
  };

  // Final Synthesis after Step 9
  const finishInterviewAndGenerate = async (finalBrief: typeof brief) => {
    setCurrentStep(10);
    setIsThinking(true);
    setCurrentThinkingStep(0);

    // Run 9 thinking steps
    for (let i = 0; i < THINKING_STEPS.length; i++) {
      await new Promise((res) => setTimeout(res, 450));
      setCurrentThinkingStep(i);
    }

    const campaign = await generateCampaignWithAI(
      "Email Marketing",
      "Generate Leads",
      {
        product: finalBrief.product || "B2B SaaS Sales Engine",
        audience: finalBrief.audience,
        country: finalBrief.country,
        budget: finalBrief.budget,
        uploadedAssetNames: [
          typeof finalBrief.logo === "string" ? finalBrief.logo : "Logo.png",
          typeof finalBrief.brochure === "string" ? finalBrief.brochure : "SalesDeck.pdf",
        ].filter(Boolean),
      }
    );

    // Save to Firestore whenever user is logged in or active
    if (user && user.id) {
      try {
        await saveCampaignToFirestore(user.id, campaign);
        console.log("Live Campaign saved to Firestore successfully");
      } catch (e) {
        console.error("Error saving campaign to Firestore:", e);
      }
    }

    setGeneratedCampaign(campaign);
    setIsThinking(false);

    const summaryText = `✨ **All 9 Steps Complete! Your Campaign is Built & Ready!** ✨\n\n` +
      `📋 **Campaign Brief Summary:**\n` +
      `• **Product/Service:** ${finalBrief.product || "B2B Sales Platform"}\n` +
      `• **Target Audience:** ${finalBrief.audience || "Decision Makers & Executives"}\n` +
      `• **Target Country:** ${finalBrief.country || "Global / USA"}\n` +
      `• **Budget:** ${finalBrief.budget || "$1,000 - $5,000 / mo"}\n` +
      `• **Logo:** ${finalBrief.logo ? "Configured" : "AI Generated Logo"}\n` +
      `• **Product Visuals:** ${finalBrief.productImages.length > 0 ? "Attached" : "AI Stock Visuals"}\n` +
      `• **Brochure / Deck:** ${finalBrief.brochure ? "Attached" : "Auto-Generated One-Pager"}\n` +
      `• **Contact List:** ${finalBrief.contactsCSV ? "Uploaded" : "500 AI Lead Prospects"}\n` +
      `• **CRM Integration:** ${finalBrief.crm || "SalesFlow AI Native CRM"}\n\n` +
      `Review your email sequences, landing page, WhatsApp copy, and workflow below!`;

    const botMsg: ChatMessage = {
      id: `bot-final-${Date.now()}`,
      role: "assistant",
      text: summaryText,
      payload: campaign,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  // Trigger Launch
  const triggerLaunch = () => {
    if (!generatedCampaign) return;
    setIsLaunchingCinematic(true);
    setLaunchStepIndex(0);

    const launchSteps = [
      "Launching Campaign...",
      "Uploading contacts to pipeline...",
      "Creating automated workflows...",
      "Scheduling email & WhatsApp sequences...",
      "Activating real-time analytics...",
      "Campaign Live 🎉",
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < launchSteps.length) {
        setLaunchStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLaunchingCinematic(false);
          onCampaignLaunched({
            ...generatedCampaign,
            status: "active",
            sendSchedule: "AI Optimized Send (Instant)",
          });
        }, 800);
      }
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-55px)] bg-[#0b0f17] text-[#ececec] flex flex-col relative font-sans">
      {/* Top Header Bar (Only shown when active in chat/steps or header reset needed) */}
      {(currentStep > 0 || messages.length > 0) && (
        <div className="border-b border-slate-800/80 px-4 py-2.5 bg-[#0d1117]/90 sticky top-0 z-20 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              SalesFlow AI
            </span>
            {currentStep > 0 && currentStep <= 9 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Step {currentStep} of 9
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 hidden sm:block font-medium">
              Conversational AI Manager
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleResetHome}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                id="btn-reset-ai-home"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FULL-SCREEN AI ASSISTANT HOME SCREEN (When currentStep === 0) */}
      {currentStep === 0 && messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 my-auto relative z-10">
          {/* Animated Ambient Glowing Orbs Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div
              animate={{
                x: [0, 40, -30, 0],
                y: [0, -50, 30, 0],
                scale: [1, 1.25, 0.9, 1],
              }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -top-20 left-1/4 w-96 h-96 ${CYAN_THEME.orb1} rounded-full blur-3xl`}
            />
            <motion.div
              animate={{
                x: [0, -50, 40, 0],
                y: [0, 40, -40, 0],
                scale: [1, 1.2, 0.95, 1],
              }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className={`absolute top-1/3 -right-20 w-80 h-80 ${CYAN_THEME.orb2} rounded-full blur-3xl`}
            />
          </div>

          {/* Heading & Subheading */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-3 mb-6 max-w-2xl"
          >
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${CYAN_THEME.badge} text-xs font-bold mb-1 shadow-sm backdrop-blur-md`}>
              <Sparkles className={`w-3.5 h-3.5 ${CYAN_THEME.iconText}`} />
              <span>AI Sales & Marketing Manager</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r ${CYAN_THEME.gradientText} bg-clip-text text-transparent animate-gradient-text drop-shadow-md`}>
              Welcome to SalesFlow AI
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              I'm your AI Sales & Marketing Manager. Tell me your business goal and I'll build, launch and optimize your campaigns automatically.
            </p>
          </motion.div>

          {/* ONE LARGE PROMPT BOX WITH ANIMATED GLOWING GRADIENT BORDER */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl mb-6"
          >
            <div className={`p-[1.5px] rounded-2xl sm:rounded-3xl bg-gradient-to-r ${CYAN_THEME.borderGlow} shadow-2xl transition-all duration-500`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (homeInput.trim()) {
                    handleStartInterview(homeInput);
                  }
                }}
                className="relative bg-slate-900/95 border border-slate-800/80 rounded-[22px] sm:rounded-[22px] p-4 backdrop-blur-xl"
              >
                <textarea
                  value={homeInput}
                  onChange={(e) => setHomeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (homeInput.trim()) {
                        handleStartInterview(homeInput);
                      }
                    }
                  }}
                  placeholder="Tell me your business goal or what you'd like to sell today..."
                  rows={3}
                  id="ai-home-prompt-textarea"
                  className="w-full bg-transparent text-slate-100 text-sm sm:text-base placeholder-slate-500 focus:outline-none resize-none font-sans"
                />

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Sparkles className={`w-3.5 h-3.5 ${CYAN_THEME.iconText}`} />
                    <span>Guided Manager Flow</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
                      Press Enter ↵
                    </span>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={!homeInput.trim()}
                      id="ai-home-prompt-send-btn"
                      className={`px-5 py-2.5 rounded-xl ${CYAN_THEME.btnBg} disabled:opacity-30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0`}
                    >
                      <span>Start Sales Manager</span>
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* PLACEHOLDER EXAMPLES */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-3xl mb-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">Examples:</span>
              {PLACEHOLDER_EXAMPLES.map((ex, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleStartInterview(ex.prompt)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/90 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  id={`home-example-btn-${idx}`}
                >
                  <span>{ex.icon}</span>
                  <span>{ex.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* SUGGESTION CARDS GRID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-4xl space-y-3"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className={`w-3.5 h-3.5 ${CYAN_THEME.iconText}`} />
              <span>Suggested AI Campaigns</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {SUGGESTION_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03, translateY: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (card.action === "step_contacts") {
                        handleStartInterview("Import contacts CSV and set up sales campaign");
                      } else if (card.prompt) {
                        handleStartInterview(card.prompt);
                      }
                    }}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/90 transition-all text-left flex flex-col justify-between space-y-3 group shadow-md cursor-pointer relative overflow-hidden"
                    id={`home-suggestion-card-${idx}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl ${CYAN_THEME.badge} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        /* CONVERSATIONAL CHATBOT STREAM VIEW (1 Question At A Time Flow) */
        <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-36">
          {/* Active Question Progress Indicator */}
          {currentStep > 0 && currentStep <= 9 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">
                  Question {currentStep} of 9
                </span>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${(currentStep / 9) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isLast = index === messages.length - 1;
              const stepDef: QuestionStepDef | undefined = msg.payload?.stepDef;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg mt-1">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}

                  <div className="max-w-xl w-full space-y-3">
                    <div
                      className={`rounded-3xl p-5 border text-xs sm:text-sm leading-relaxed space-y-3 shadow-xl ${
                        msg.role === "user"
                          ? "bg-emerald-600 border-emerald-500 text-white rounded-tr-none font-medium ml-auto max-w-lg"
                          : "bg-slate-900 border-slate-800 text-slate-100 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    </div>

                    {/* INTERACTIVE QUESTION CONTROLS (Only rendered for Assistant questions at current step) */}
                    {msg.role === "assistant" && isLast && stepDef && currentStep === stepDef.step && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3 shadow-lg"
                      >
                        {/* 1. QUICK CHOICE CHIPS (For questions with chip options) */}
                        {stepDef.chips && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                              Select an answer or type below:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {stepDef.chips.map((chip, cIdx) => (
                                <button
                                  key={cIdx}
                                  onClick={() => handleAnswerStep(chip)}
                                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-700 hover:border-emerald-500 text-xs font-semibold transition-all cursor-pointer shadow-sm text-left"
                                  id={`chip-option-${stepDef.step}-${cIdx}`}
                                >
                                  {chip}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. INLINE UPLOAD CARDS (For file & upload steps) */}
                        {stepDef.isUpload && (
                          <div className="space-y-3">
                            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 text-center space-y-2 transition-all">
                              <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto" />
                              <p className="text-xs font-bold text-slate-200">
                                {stepDef.uploadType === "logo" && "Upload Brand Logo"}
                                {stepDef.uploadType === "images" && "Upload Product Images / Visuals"}
                                {stepDef.uploadType === "pdf" && "Upload Brochure / PDF Deck"}
                                {stepDef.uploadType === "csv" && "Upload Contacts CSV File"}
                                {stepDef.uploadType === "crm" && "Select or Connect CRM"}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Click below or drag and drop your file here
                              </p>

                              {stepDef.uploadType !== "crm" ? (
                                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all">
                                  <Paperclip className="w-3.5 h-3.5" />
                                  <span>Choose File</span>
                                  <input
                                    type="file"
                                    accept={
                                      stepDef.uploadType === "csv"
                                        ? ".csv"
                                        : stepDef.uploadType === "pdf"
                                        ? ".pdf"
                                        : "image/*"
                                    }
                                    onChange={(e) => handleUploadForStep(e, stepDef.uploadType!)}
                                    className="hidden"
                                  />
                                </label>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                                  {["HubSpot", "Salesforce", "Zoho CRM", "Pipedrive"].map((crmName) => (
                                    <button
                                      key={crmName}
                                      onClick={() => handleAnswerStep(`Connected to ${crmName}`)}
                                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                                    >
                                      {crmName}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* SKIP BUTTON */}
                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  if (stepDef.uploadType === "csv") {
                                    handleAnswerStep("Generate 500 AI Lead Prospects");
                                  } else {
                                    handleAnswerStep("Skip for now (Use AI defaults)");
                                  }
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
                              >
                                {stepDef.uploadType === "csv"
                                  ? "⚡ Generate 500 AI Leads"
                                  : "Skip for now"}
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-200 shrink-0 shadow-lg border border-slate-700 mt-1">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* AI TYPING DOTS ANIMATION */}
          {isAITyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-center"
            >
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-slate-400 ml-2 font-medium">SalesFlow AI is typing...</span>
              </div>
            </motion.div>
          )}

          {/* AI THINKING EXPERIENCE (ChatGPT-style reasoning screen) */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-5 shadow-[0_0_50px_rgba(16,185,129,0.12)] backdrop-blur-xl relative overflow-hidden my-4"
            >
              {/* Subtle animated glowing aura backdrop */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

              {/* Header bar with ChatGPT Thought Badge */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Animated glowing AI brain/orb */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md animate-ping" />
                    <div className="w-9 h-9 rounded-2xl bg-slate-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950 relative z-10">
                      <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "6s" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white tracking-tight">
                        SalesFlow AI Manager
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Thinking Process
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Synthesizing campaign parameters & building assets...
                    </p>
                  </div>
                </div>

                {/* Step Counter Badge */}
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/30">
                    Step {Math.min(currentThinkingStep + 1, THINKING_STEPS.length)} / {THINKING_STEPS.length}
                  </span>
                </div>
              </div>

              {/* Smooth Animated Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5 relative z-10">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((currentThinkingStep + 1) / THINKING_STEPS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>

              {/* Step Items Stack with ChatGPT style checkmarks & active glowing state */}
              <div className="space-y-2.5 pt-1 relative z-10">
                {THINKING_STEPS.map((step, idx) => {
                  const isDone = idx < currentThinkingStep;
                  const isActive = idx === currentThinkingStep;
                  const isUpcoming = idx > currentThinkingStep;
                  const StepIcon = step.icon;

                  if (isUpcoming) {
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.35 }}
                        className="flex items-center gap-3 text-xs text-slate-500 px-3 py-2 rounded-xl border border-transparent font-medium"
                      >
                        <div className="w-5 h-5 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        </div>
                        <span>{step.text}</span>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -12, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-between gap-3 text-xs font-medium px-3.5 py-2.5 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-950/50"
                          : "bg-slate-950/60 border-slate-800/80 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 animate-pulse">
                            <StepIcon className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
                          </div>
                        )}

                        <span className={`font-medium ${isActive ? "text-emerald-300 font-semibold" : "text-slate-200"}`}>
                          {step.text}
                        </span>
                      </div>

                      {/* Status Indicator Badge */}
                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Processing
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] font-mono font-medium text-emerald-400/80 shrink-0">
                          Done ✓
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* GENERATED CAMPAIGN PREVIEW, HEALTH SCORES & LAUNCH BAR */}
          {generatedCampaign && !isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl mt-4"
            >
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {generatedCampaign.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Goal: {generatedCampaign.goal}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {generatedCampaign.name}
                  </h3>
                </div>

                <button
                  onClick={() => onPreviewAsset("landing", generatedCampaign)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-md cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Full Landing Page Preview</span>
                </button>
              </div>

              {/* AI CAMPAIGN REVIEW / HEALTH SCORES */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>AI Campaign Audit & Health Review</span>
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Overall Health: 98/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Health Score</p>
                    <p className="text-base font-extrabold text-emerald-400">98%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Spam Risk</p>
                    <p className="text-base font-extrabold text-emerald-400">1.2% Low</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Deliverability</p>
                    <p className="text-base font-extrabold text-emerald-400">99.4%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Personalisation</p>
                    <p className="text-base font-extrabold text-emerald-400">96%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Accessibility</p>
                    <p className="text-base font-extrabold text-emerald-400">100%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Brand Match</p>
                    <p className="text-base font-extrabold text-emerald-400">97%</p>
                  </div>
                </div>
              </div>

              {/* MULTI-CHANNEL ASSET PREVIEW & LIVE EDIT TABS */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>Campaign Asset Preview & Live Editor</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    ⚡ Live Editable Before Launch
                  </span>
                </div>

                <div className="flex flex-nowrap overflow-x-auto gap-1 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 scrollbar-none">
                  {[
                    { id: "overview", label: "Name & Goal", icon: Building2 },
                    { id: "persona", label: "Customer Persona", icon: Target },
                    { id: "segments", label: "Audience Segments", icon: Users },
                    { id: "email", label: "Email Campaign", icon: Mail },
                    { id: "landing", label: "Landing Page", icon: Layers },
                    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                    { id: "sms", label: "SMS", icon: Smartphone },
                    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
                    { id: "workflow", label: "Workflow Graph", icon: Workflow },
                    { id: "social", label: "Social Posts", icon: Share2 },
                    { id: "scripts", label: "Call Scripts", icon: Phone },
                    { id: "booking", label: "Booking Page", icon: Calendar },
                  ].map((tb) => {
                    const Icon = tb.icon;
                    return (
                      <button
                        key={tb.id}
                        onClick={() => setPreviewTab(tb.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                          previewTab === tb.id
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tb.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PREVIEW CONTENT & LIVE EDITORS */}
              <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 text-xs font-sans space-y-4">
                
                {/* 1. OVERVIEW: Campaign Name & Goal */}
                {previewTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Campaign Name</label>
                        <input
                          type="text"
                          value={generatedCampaign.name}
                          onChange={(e) => setGeneratedCampaign({ ...generatedCampaign, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Campaign Goal</label>
                        <input
                          type="text"
                          value={generatedCampaign.goal}
                          onChange={(e) => setGeneratedCampaign({ ...generatedCampaign, goal: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Target Business / Offer Description</label>
                      <textarea
                        rows={3}
                        value={generatedCampaign.businessDescription}
                        onChange={(e) => setGeneratedCampaign({ ...generatedCampaign, businessDescription: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Optimized Sending Schedule</label>
                      <input
                        type="text"
                        value={generatedCampaign.sendSchedule}
                        onChange={(e) => setGeneratedCampaign({ ...generatedCampaign, sendSchedule: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. CUSTOMER PERSONA */}
                {previewTab === "persona" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Persona Title</label>
                        <input
                          type="text"
                          value={generatedCampaign.customerPersona?.title || ""}
                          onChange={(e) =>
                            setGeneratedCampaign({
                              ...generatedCampaign,
                              customerPersona: { ...generatedCampaign.customerPersona, title: e.target.value },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Demographics Profile</label>
                        <input
                          type="text"
                          value={generatedCampaign.customerPersona?.demography || ""}
                          onChange={(e) =>
                            setGeneratedCampaign({
                              ...generatedCampaign,
                              customerPersona: { ...generatedCampaign.customerPersona, demography: e.target.value },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Key Pain Points</label>
                        <div className="space-y-2">
                          {(generatedCampaign.customerPersona?.painPoints || []).map((pp, idx) => (
                            <input
                              key={idx}
                              type="text"
                              value={pp}
                              onChange={(e) => {
                                const updated = [...(generatedCampaign.customerPersona?.painPoints || [])];
                                updated[idx] = e.target.value;
                                setGeneratedCampaign({
                                  ...generatedCampaign,
                                  customerPersona: { ...generatedCampaign.customerPersona, painPoints: updated },
                                });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Core Drivers & Goals</label>
                        <div className="space-y-2">
                          {(generatedCampaign.customerPersona?.goals || []).map((gl, idx) => (
                            <input
                              key={idx}
                              type="text"
                              value={gl}
                              onChange={(e) => {
                                const updated = [...(generatedCampaign.customerPersona?.goals || [])];
                                updated[idx] = e.target.value;
                                setGeneratedCampaign({
                                  ...generatedCampaign,
                                  customerPersona: { ...generatedCampaign.customerPersona, goals: updated },
                                });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. AUDIENCE SEGMENTS */}
                {previewTab === "segments" && (
                  <div className="space-y-3">
                    <label className="text-slate-400 font-bold block">Target Audience Segments</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {generatedCampaign.audienceSegments.map((sg, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={sg.name}
                            onChange={(e) => {
                              const updated = [...generatedCampaign.audienceSegments];
                              updated[i].name = e.target.value;
                              setGeneratedCampaign({ ...generatedCampaign, audienceSegments: updated });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                          />
                          <div>
                            <span className="text-[10px] text-slate-400">Target Contacts:</span>
                            <input
                              type="number"
                              value={sg.count}
                              onChange={(e) => {
                                const updated = [...generatedCampaign.audienceSegments];
                                updated[i].count = parseInt(e.target.value) || 0;
                                setGeneratedCampaign({ ...generatedCampaign, audienceSegments: updated });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-emerald-400 font-extrabold text-xs focus:border-emerald-500 focus:outline-none mt-0.5"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={sg.criteria}
                            onChange={(e) => {
                              const updated = [...generatedCampaign.audienceSegments];
                              updated[i].criteria = e.target.value;
                              setGeneratedCampaign({ ...generatedCampaign, audienceSegments: updated });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-400 text-[11px] focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. EMAIL CAMPAIGN */}
                {previewTab === "email" && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Subject Line Variations:</span>
                      <div className="space-y-1.5">
                        {generatedCampaign.emailContent.subjectLines.map((s, i) => (
                          <input
                            key={i}
                            type="text"
                            value={s}
                            onChange={(e) => {
                              const updated = [...generatedCampaign.emailContent.subjectLines];
                              updated[i] = e.target.value;
                              setGeneratedCampaign({
                                ...generatedCampaign,
                                emailContent: { ...generatedCampaign.emailContent, subjectLines: updated },
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Preheader Copy:</span>
                      <input
                        type="text"
                        value={generatedCampaign.emailContent.preheader}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            emailContent: { ...generatedCampaign.emailContent, preheader: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Email Body Copy:</span>
                      <textarea
                        rows={8}
                        value={generatedCampaign.emailContent.body}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            emailContent: { ...generatedCampaign.emailContent, body: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-sans focus:border-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Call-To-Action (CTA) Button Label:</span>
                      <input
                        type="text"
                        value={generatedCampaign.emailContent.cta}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            emailContent: { ...generatedCampaign.emailContent, cta: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-emerald-400 font-bold text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 5. LANDING PAGE */}
                {previewTab === "landing" && (
                  <div className="p-5 rounded-2xl bg-slate-900 space-y-4 border border-slate-800">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Headline</label>
                      <input
                        type="text"
                        value={generatedCampaign.landingPage.headline}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            landingPage: { ...generatedCampaign.landingPage, headline: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-extrabold text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Subheadline</label>
                      <textarea
                        rows={2}
                        value={generatedCampaign.landingPage.subheadline}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            landingPage: { ...generatedCampaign.landingPage, subheadline: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={generatedCampaign.landingPage.ctaText}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            landingPage: { ...generatedCampaign.landingPage, ctaText: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => onPreviewAsset("landing", generatedCampaign)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Open Interactive Landing Page Preview</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. WHATSAPP CAMPAIGN */}
                {previewTab === "whatsapp" && (
                  <div className="space-y-3">
                    <span className="text-slate-400 font-bold block">WhatsApp Broadcast Sequence:</span>
                    {generatedCampaign.whatsAppMessages.map((msg, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-emerald-400 text-xs">Step {msg.step} Message:</span>
                        <textarea
                          rows={3}
                          value={msg.text}
                          onChange={(e) => {
                            const updated = [...generatedCampaign.whatsAppMessages];
                            updated[i].text = e.target.value;
                            setGeneratedCampaign({ ...generatedCampaign, whatsAppMessages: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. SMS CAMPAIGN */}
                {previewTab === "sms" && (
                  <div className="space-y-3">
                    <span className="text-slate-400 font-bold block">SMS Outreach Sequence:</span>
                    {generatedCampaign.smsContent.map((sms, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-cyan-400 text-xs">Step {sms.step} SMS:</span>
                        <textarea
                          rows={2}
                          value={sms.text}
                          onChange={(e) => {
                            const updated = [...generatedCampaign.smsContent];
                            updated[i].text = e.target.value;
                            setGeneratedCampaign({ ...generatedCampaign, smsContent: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 8. LINKEDIN CAMPAIGN */}
                {previewTab === "linkedin" && (
                  <div className="space-y-3">
                    <span className="text-slate-400 font-bold block">LinkedIn Direct Outreach Sequence:</span>
                    {generatedCampaign.linkedInMessages.map((li, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-blue-400 text-xs">Message Step {li.step}:</span>
                        <textarea
                          rows={4}
                          value={li.text}
                          onChange={(e) => {
                            const updated = [...generatedCampaign.linkedInMessages];
                            updated[i].text = e.target.value;
                            setGeneratedCampaign({ ...generatedCampaign, linkedInMessages: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 9. FOLLOW-UP WORKFLOW */}
                {previewTab === "workflow" && (
                  <div className="space-y-3">
                    <span className="text-slate-400 font-bold block">Automated Workflow Node Sequence:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {generatedCampaign.workflowNodes.map((nd, i) => (
                        <div key={nd.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={nd.title}
                            onChange={(e) => {
                              const updated = [...generatedCampaign.workflowNodes];
                              updated[i].title = e.target.value;
                              setGeneratedCampaign({ ...generatedCampaign, workflowNodes: updated });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={nd.detail}
                            onChange={(e) => {
                              const updated = [...generatedCampaign.workflowNodes];
                              updated[i].detail = e.target.value;
                              setGeneratedCampaign({ ...generatedCampaign, workflowNodes: updated });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-400 text-[11px] focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. SOCIAL MEDIA POSTS */}
                {previewTab === "social" && (
                  <div className="space-y-4">
                    <span className="text-slate-400 font-bold block">Generated Social Media Posts:</span>
                    {(generatedCampaign.socialMediaPosts || []).map((post, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-emerald-400 text-xs">{post.platform} Post:</span>
                        <textarea
                          rows={3}
                          value={post.text}
                          onChange={(e) => {
                            const updated = [...(generatedCampaign.socialMediaPosts || [])];
                            updated[i].text = e.target.value;
                            setGeneratedCampaign({ ...generatedCampaign, socialMediaPosts: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={post.hashtags}
                          onChange={(e) => {
                            const updated = [...(generatedCampaign.socialMediaPosts || [])];
                            updated[i].hashtags = e.target.value;
                            setGeneratedCampaign({ ...generatedCampaign, socialMediaPosts: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-indigo-400 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 11. CALL SCRIPTS */}
                {previewTab === "scripts" && (
                  <div className="space-y-4">
                    <span className="text-slate-400 font-bold block">Cold Call & Outreach Scripts:</span>
                    {(generatedCampaign.callScripts || []).map((scr, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <input
                          type="text"
                          value={scr.title}
                          onChange={(e) => {
                            const updated = [...(generatedCampaign.callScripts || [])];
                            updated[i].title = e.target.value;
                            setGeneratedCampaign({ ...generatedCampaign, callScripts: updated });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                        />
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Script Speech:</label>
                          <textarea
                            rows={4}
                            value={scr.script}
                            onChange={(e) => {
                              const updated = [...(generatedCampaign.callScripts || [])];
                              updated[i].script = e.target.value;
                              setGeneratedCampaign({ ...generatedCampaign, callScripts: updated });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs leading-relaxed focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Objection Handling Response:</label>
                          <textarea
                            rows={2}
                            value={scr.objectHandling}
                            onChange={(e) => {
                              const updated = [...(generatedCampaign.callScripts || [])];
                              updated[i].objectHandling = e.target.value;
                              setGeneratedCampaign({ ...generatedCampaign, callScripts: updated });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 12. MEETING BOOKING PAGE */}
                {previewTab === "booking" && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Booking Page Title</label>
                      <input
                        type="text"
                        value={generatedCampaign.meetingBookingPage?.title || ""}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            meetingBookingPage: { ...generatedCampaign.meetingBookingPage, title: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Custom Link</label>
                      <input
                        type="text"
                        value={generatedCampaign.meetingBookingPage?.link || ""}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            meetingBookingPage: { ...generatedCampaign.meetingBookingPage, link: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Page Description</label>
                      <textarea
                        rows={2}
                        value={generatedCampaign.meetingBookingPage?.description || ""}
                        onChange={(e) =>
                          setGeneratedCampaign({
                            ...generatedCampaign,
                            meetingBookingPage: { ...generatedCampaign.meetingBookingPage, description: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* LAUNCH BUTTON */}
              <div className="pt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={triggerLaunch}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer"
                  id="btn-launch-campaign-main"
                >
                  <Rocket className="w-5 h-5" />
                  <span>🚀 Launch Campaign</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ChatGPT Iconic Bottom Input Bar (Only visible when chat has started) */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0b0f17]/95 border-t border-slate-800 p-3 sm:p-4 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputMessage.trim() && !isAITyping) {
                if (currentStep > 0 && currentStep <= 9) {
                  handleAnswerStep(inputMessage);
                } else {
                  handleFreeFormChatMessage(inputMessage);
                }
              }
            }}
            className="max-w-3xl mx-auto flex flex-col gap-1"
          >
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 shadow-xl focus-within:border-emerald-500/60 transition-all">
              <label className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors mr-1 cursor-pointer">
                <Paperclip className="w-4 h-4 text-emerald-400" />
                <input
                  type="file"
                  onChange={(e) => handleUploadForStep(e, "general")}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  currentStep > 0 && currentStep <= 9
                    ? `Type your answer for question ${currentStep}...`
                    : "Ask SalesFlow AI to refine content, adjust targeting, or change schedule..."
                }
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                id="chat-wizard-bottom-input"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isAITyping || isThinking}
                id="chat-wizard-bottom-send-btn"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-30 transition-all ml-1 shrink-0 shadow-md shadow-emerald-950 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CINEMATIC LAUNCH OVERLAY */}
      <AnimatePresence>
        {isLaunchingCinematic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <Rocket className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <motion.div
              key={launchStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h2 className="text-xl font-bold text-white">Launching Campaign Pipeline</h2>
              <p className="text-sm font-mono text-emerald-400">
                Step {launchStepIndex + 1} of 6
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
