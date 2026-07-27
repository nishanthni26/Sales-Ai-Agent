import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  CheckCircle2,
  Cpu,
  RefreshCw,
  AlertCircle,
  History,
  Plus,
  Trash2,
} from "lucide-react";
import { streamAIChat } from "../services/aiService";
import { getUserChats, saveChatToFirestore, deleteChatFromFirestore } from "../services/firestoreService";
import { ChatSession } from "../types";
import { auth } from "../services/firebase";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onExecuteCommand: (command: string) => void;
}

const QUICK_COMMANDS = [
  "Create campaign strategy",
  "Generate email sequence",
  "Write WhatsApp messages",
  "Show campaign report",
  "Import contacts CSV",
  "Create landing page copy",
  "Analyze CRM leads",
  "Generate meeting agenda",
];

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  initialQuery,
  onExecuteCommand,
}) => {
  const [selectedModel, setSelectedModel] = useState<string>("llama3.2");
  const [currentChatId, setCurrentChatId] = useState<string>(`chat-${Date.now()}`);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; text: string; actionApplied?: string; modelUsed?: string }[]
  >([
    {
      id: "a-welcome",
      role: "assistant",
      text: "👋 Hello! I'm your Sales & Marketing Manager powered by live AI intelligence. Ask me to create campaigns, draft high-converting emails, analyze CRM leads, or generate strategic growth reports!",
      modelUsed: "gemini-3.6-flash",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentModel, setCurrentModel] = useState<string>("llama3.2");
  const [showHistory, setShowHistory] = useState(false);
  const [savedChats, setSavedChats] = useState<ChatSession[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const userId = auth.currentUser?.uid || "guest";

  useEffect(() => {
    if (isOpen && userId !== "guest") {
      loadHistory();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleRunCommand(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const loadHistory = async () => {
    if (!userId || userId === "guest") return;
    const chats = await getUserChats(userId);
    setSavedChats(chats);
  };

  if (!isOpen) return null;

  const handleRunCommand = async (cmdText: string) => {
    if (!cmdText.trim()) return;
    setErrorMsg("");
    const userMsg = { id: `a-usr-${Date.now()}`, role: "user" as const, text: cmdText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsProcessing(true);
    setStreamingText("");

    let actionLabel = "";
    const lower = cmdText.toLowerCase();

    if (lower.includes("campaign") && (lower.includes("create") || lower.includes("new") || lower.includes("strategy"))) {
      actionLabel = "Navigated to Campaign Wizard";
      onExecuteCommand("nav:wizard");
    } else if (lower.includes("report") || lower.includes("analytics")) {
      actionLabel = "Opened Analytics Dashboard";
      onExecuteCommand("nav:dashboard");
    } else if (lower.includes("crm") || lower.includes("contact") || lower.includes("lead")) {
      actionLabel = "Opened CRM Hub";
      onExecuteCommand("nav:crm");
    } else if (lower.includes("landing page")) {
      actionLabel = "Generated Landing Page Preview";
      onExecuteCommand("preview:landing");
    } else if (lower.includes("whatsapp")) {
      actionLabel = "Generated WhatsApp Sequence";
      onExecuteCommand("preview:whatsapp");
    } else if (lower.includes("meeting") || lower.includes("book") || lower.includes("agenda")) {
      actionLabel = "Opened Meetings Calendar";
      onExecuteCommand("nav:crm:meetings");
    }

    // Format History for AI Memory
    const historyPayload = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      text: m.text,
    }));

    try {
      const { fullText, modelUsed } = await streamAIChat(
        cmdText,
        historyPayload,
        "You are SalesFlow AI, an elite B2B sales automation strategist.",
        (chunk, model) => {
          setStreamingText((prev) => prev + chunk);
          if (model) setCurrentModel(model);
        },
        cmdText
      );

      setCurrentModel(modelUsed);

      const botMsg = {
        id: `a-bot-${Date.now()}`,
        role: "assistant" as const,
        text: fullText || "I've processed your command and updated your sales pipeline.",
        actionApplied: actionLabel,
        modelUsed,
      };

      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);
      setStreamingText("");

      // Persist to Firestore if user logged in
      if (userId && userId !== "guest") {
        const title = messages.length > 1 ? messages[1].text.slice(0, 30) : cmdText.slice(0, 30);
        await saveChatToFirestore(userId, {
          id: currentChatId,
          userId,
          title: title || "Sales AI Session",
          model: selectedModel,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: finalMessages.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            text: m.text,
            timestamp: new Date().toISOString(),
            modelUsed: m.modelUsed,
          })),
        });
        loadHistory();
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      setErrorMsg("Failed to connect to AI engine. Click 'Retry' to attempt again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartNewChat = () => {
    setCurrentChatId(`chat-${Date.now()}`);
    setMessages([
      {
        id: "a-welcome",
        role: "assistant",
        text: "👋 Ready for a new sales session. What would you like to build or analyze?",
        modelUsed: "llama3.2",
      },
    ]);
    setShowHistory(false);
  };

  const handleSelectChat = (chat: ChatSession) => {
    setCurrentChatId(chat.id);
    setMessages(
      chat.messages.map((m) => ({
        id: m.id,
        role: m.role || "assistant",
        text: m.text || "",
        modelUsed: m.modelUsed,
      }))
    );
    setShowHistory(false);
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const userId = auth.currentUser?.uid || "guest";
    await deleteChatFromFirestore(userId, chatId);
    if (chatId === currentChatId) handleStartNewChat();
    loadHistory();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isProcessing) return;
    handleRunCommand(inputQuery);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full flex flex-col relative shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm">Sales & Marketing Manager</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  {currentModel}
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">Live Campaign & CRM Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs px-2.5 font-medium"
              title="Chat History"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>

            <button
              onClick={handleStartNewChat}
              className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1 text-xs px-2 font-medium"
              title="New Chat"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History Overlay Panel */}
        {showHistory && (
          <div className="absolute top-16 inset-x-0 bottom-0 bg-slate-900/95 backdrop-blur-md z-40 p-4 overflow-y-auto border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Saved AI Conversations</h4>
              <button onClick={() => setShowHistory(false)} className="text-xs text-indigo-400 hover:underline">
                Close
              </button>
            </div>

            {savedChats.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No previous chats stored in Firestore.</p>
            ) : (
              savedChats.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectChat(c)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    c.id === currentChatId
                      ? "bg-indigo-600/20 border-indigo-500/50 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold truncate max-w-[280px]">{c.title}</p>
                    <p className="text-[10px] text-slate-500">{new Date(c.updatedAt).toLocaleDateString()} • {c.messages.length} msgs</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(e, c.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Quick Command Chips */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5">
          {QUICK_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              disabled={isProcessing}
              onClick={() => handleRunCommand(cmd)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700/60 text-indigo-300 transition-all disabled:opacity-50"
            >
              &gt; {cmd}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="m-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-red-300 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => handleRunCommand(messages[messages.length - 1]?.text || "Retry")}
              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-[10px] font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-md p-3.5 rounded-2xl ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none font-medium shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                {m.modelUsed && m.role === "assistant" && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono">Model: {m.modelUsed}</span>
                    {m.actionApplied && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {m.actionApplied}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live Streaming Word-by-Word View */}
          {isProcessing && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-md p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 text-slate-200 rounded-tl-none space-y-2">
                {streamingText ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{streamingText}<span className="inline-block w-2 h-3 bg-indigo-400 ml-1 animate-pulse" /></p>
                ) : (
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold py-1">
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Routing to {currentModel}...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isProcessing}
            placeholder="Type your message e.g. 'Generate email campaign strategy'..."
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputQuery.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
