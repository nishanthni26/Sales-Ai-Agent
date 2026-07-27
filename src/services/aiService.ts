import { CampaignType, CampaignGoal, GeneratedCampaign, AISettings, AILogEntry } from "../types";
import { logAIRequestToFirestore, getAISettingsFromFirestore, saveAISettingsToFirestore } from "./firestoreService";

export const DEFAULT_AI_SETTINGS: AISettings = {
  ollamaUrl: "http://localhost:11434/api/chat",
  defaultModel: "llama3.2",
  temperature: 0.7,
  maxTokens: 2048,
  streaming: true,
};

export function getStoredAISettings(): AISettings {
  try {
    const saved = localStorage.getItem("salesflow_ai_settings");
    if (saved) {
      return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    // Ignore parse error
  }
  return DEFAULT_AI_SETTINGS;
}

export function saveStoredAISettings(settings: AISettings, userId?: string): void {
  try {
    localStorage.setItem("salesflow_ai_settings", JSON.stringify(settings));
    if (userId) {
      saveAISettingsToFirestore(userId, settings).catch(console.error);
    }
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

export async function checkAIHealth(customOllamaUrl?: string): Promise<{
  connected: boolean;
  status: "ok" | "offline";
  provider: string;
  models: string[];
  latencyMs: number;
}> {
  const startTime = Date.now();
  const settings = getStoredAISettings();
  const targetUrl = customOllamaUrl || settings.ollamaUrl;

  try {
    const res = await fetch(`/api/ai/health?ollamaUrl=${encodeURIComponent(targetUrl)}`);
    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json();
      return {
        connected: Boolean(data.connected),
        status: data.connected ? "ok" : "offline",
        provider: data.provider || "ollama",
        models: data.models || ["llama3.2", "qwen3", "gemma3"],
        latencyMs,
      };
    }
  } catch (e) {
    // Health fetch failed
  }

  return {
    connected: false,
    status: "offline",
    provider: "offline",
    models: ["llama3.2", "qwen3", "gemma3"],
    latencyMs: Date.now() - startTime,
  };
}

export interface AIResponse {
  text: string;
  fallback?: boolean;
  provider?: string;
  error?: string;
}

export async function streamAIChat(
  prompt: string,
  history: { role: string; text?: string; content?: string }[] = [],
  systemInstruction?: string,
  onChunk?: (text: string, modelUsed?: string) => void,
  task?: string,
  overrideModel?: string,
  userId?: string
): Promise<{ fullText: string; modelUsed: string; responseTimeMs: number; error?: string }> {
  const settings = getStoredAISettings();
  const activeModel = overrideModel || settings.defaultModel || "llama3.2";
  const startTime = Date.now();
  let fullText = "";
  let modelUsed = activeModel;
  let errorMsg: string | undefined = undefined;

  try {
    const response = await fetch("/api/ai/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        history,
        systemInstruction,
        task,
        model: activeModel,
        ollamaUrl: settings.ollamaUrl,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`AI service offline.`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === "start" && data.modelUsed) {
              modelUsed = data.modelUsed;
            } else if (data.type === "chunk" && data.text) {
              fullText += data.text;
              if (onChunk) onChunk(data.text, modelUsed);
            } else if (data.type === "done" && data.modelUsed) {
              modelUsed = data.modelUsed;
            } else if (data.type === "error") {
              errorMsg = data.message || "AI service offline.";
              fullText = "AI service offline.";
            }
          } catch (e) {
            // Ignore line parse errors
          }
        }
      }
    }
  } catch (err: any) {
    console.warn("Stream API error:", err);
    errorMsg = err.message || "AI service offline.";
    fullText = "AI service offline.";
  }

  const responseTimeMs = Date.now() - startTime;

  // Log AI Request & Response to Firestore
  logAIRequestToFirestore(userId || "guest", {
    timestamp: new Date().toISOString(),
    prompt,
    model: modelUsed,
    responseTimeMs,
    response: fullText,
    status: errorMsg ? "error" : "success",
    error: errorMsg,
  }).catch(console.error);

  return { fullText, modelUsed, responseTimeMs, error: errorMsg };
}

export async function askAIChat(
  prompt: string,
  history?: { role: string; text?: string; content?: string }[],
  systemInstruction?: string,
  overrideModel?: string,
  userId?: string
): Promise<AIResponse> {
  const settings = getStoredAISettings();
  const activeModel = overrideModel || settings.defaultModel || "llama3.2";
  const startTime = Date.now();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        history,
        systemInstruction,
        model: activeModel,
        ollamaUrl: settings.ollamaUrl,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
      }),
    });

    const responseTimeMs = Date.now() - startTime;

    if (!res.ok) {
      const errText = "AI service offline.";
      logAIRequestToFirestore(userId || "guest", {
        timestamp: new Date().toISOString(),
        prompt,
        model: activeModel,
        responseTimeMs,
        response: errText,
        status: "error",
        error: `HTTP ${res.status}`,
      }).catch(console.error);
      return { text: errText, fallback: true, error: errText };
    }

    const data = await res.json();
    const resultText = data.text || "AI service offline.";
    const isError = Boolean(data.error) || resultText === "AI service offline.";

    logAIRequestToFirestore(userId || "guest", {
      timestamp: new Date().toISOString(),
      prompt,
      model: data.provider || activeModel,
      responseTimeMs,
      response: resultText,
      status: isError ? "error" : "success",
      error: data.error,
    }).catch(console.error);

    return { text: resultText, provider: data.provider || activeModel, fallback: Boolean(data.fallback) };
  } catch (err: any) {
    const responseTimeMs = Date.now() - startTime;
    const errText = "AI service offline.";
    logAIRequestToFirestore(userId || "guest", {
      timestamp: new Date().toISOString(),
      prompt,
      model: activeModel,
      responseTimeMs,
      response: errText,
      status: "error",
      error: err.message || "Unreachable",
    }).catch(console.error);
    return { text: errText, fallback: true, error: errText };
  }
}

// ================= AI WORKFLOW GENERATOR =================
import { WorkflowAutomation, WorkflowNode, WorkflowEdge } from "../types";

export async function generateWorkflowFromAIPrompt(prompt: string, modelName: string = "Llama 3.2"): Promise<WorkflowAutomation> {
  const cleanPrompt = prompt.trim();
  const lower = cleanPrompt.toLowerCase();

  // Try calling server AI chat first
  try {
    const aiSystemPrompt = `You are SalesFlow AI Workflow Engine. Convert user workflow requests into JSON representing a visual workflow graph.
Output ONLY JSON in the exact structure:
{
  "name": "String",
  "description": "String",
  "category": "String",
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger|delay|condition|action|end",
      "subtype": "contact_created|form_submitted|email_opened|send_email|send_whatsapp|send_sms|delay_duration|if_email_opened|create_deal|assign_sales_rep|lead_score|end_workflow",
      "label": "String",
      "description": "String",
      "config": {},
      "position": { "x": 100, "y": 100 }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "node-1", "target": "node-2", "label": "Next" }
  ]
}`;

    const res = await askAIChat(`Generate a workflow graph for: "${cleanPrompt}"`, [], aiSystemPrompt);
    if (res.text && res.text.includes("{") && res.text.includes("nodes")) {
      const jsonStart = res.text.indexOf("{");
      const jsonEnd = res.text.lastIndexOf("}") + 1;
      const parsed = JSON.parse(res.text.slice(jsonStart, jsonEnd));
      if (parsed.nodes && parsed.nodes.length > 0) {
        return {
          id: `wf-ai-${Date.now()}`,
          name: parsed.name || `AI Workflow: ${cleanPrompt.slice(0, 30)}`,
          description: parsed.description || `AI-generated campaign workflow based on "${cleanPrompt}".`,
          category: parsed.category || "AI Generator",
          status: "active",
          nodes: parsed.nodes,
          edges: parsed.edges || [],
          analytics: {
            activeContacts: 12,
            completedContacts: 48,
            conversionRate: 28.5,
            openRate: 64.2,
            clickRate: 31.0,
            revenueGenerated: 18500,
            goalCompletion: 88,
            avgCompletionTime: "3.2 Days",
          },
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
      }
    }
  } catch (err) {
    console.warn("Server AI workflow generation fallback to intelligent local engine:", err);
  }

  // Local intelligent template synthesis for key workflow types
  let nodes: WorkflowNode[] = [];
  let edges: WorkflowEdge[] = [];
  let name = `AI Workflow: ${cleanPrompt}`;
  let description = `Dynamic AI workflow for ${cleanPrompt}.`;
  let category = "Automated Campaign";

  if (lower.includes("welcome") || lower.includes("onboard")) {
    name = "Welcome Email & Customer Onboarding Workflow";
    description = "Triggers immediately on new contact creation. Delivers welcome series, checks email engagement, and routes high-intent leads to WhatsApp and sales rep.";
    category = "Lead Nurturing";
    nodes = [
      { id: "node-1", type: "trigger", subtype: "contact_created", label: "Contact Created", description: "Fires when new contact added to CRM", config: {}, position: { x: 300, y: 50 } },
      { id: "node-2", type: "action", subtype: "send_email", label: "Send Welcome Email", description: "Delivers welcome guide & resources", config: { emailSubject: "Welcome to SalesFlow! Here is your quickstart guide", emailBody: "Hi {{first_name}},\n\nWelcome aboard! We are excited to help you automate your sales." }, position: { x: 300, y: 180 } },
      { id: "node-3", type: "delay", subtype: "delay_duration", label: "Wait 24 Hours", description: "Pauses for 24 hours to monitor opens", config: { delayHours: 24 }, position: { x: 300, y: 310 } },
      { id: "node-4", type: "condition", subtype: "if_email_opened", label: "If Email Opened?", description: "Checks if prospect opened welcome email", config: {}, position: { x: 300, y: 440 } },
      { id: "node-5", type: "action", subtype: "lead_score", label: "Add +10 Lead Score", description: "Increases score for engaged contact", config: { scoreChange: 10 }, position: { x: 120, y: 580 } },
      { id: "node-6", type: "action", subtype: "send_whatsapp", label: "Send WhatsApp Concierge", description: "Sends interactive WhatsApp intro", config: { whatsappMessage: "Hi {{first_name}}! Need any help setting up your campaign?" }, position: { x: 120, y: 710 } },
      { id: "node-7", type: "action", subtype: "send_sms", label: "Send SMS Gentle Nudge", description: "Sends short text reminder", config: { smsMessage: "SalesFlow: Check your email inbox for your setup guide!" }, position: { x: 480, y: 580 } },
      { id: "node-8", type: "action", subtype: "assign_sales_rep", label: "Assign Sales Representative", description: "Assigns lead to AE", config: { assignedRep: "Sarah Jenkins" }, position: { x: 300, y: 840 } },
      { id: "node-9", type: "end", subtype: "end_workflow", label: "End Workflow", description: "Completes welcome execution", config: {}, position: { x: 300, y: 970 } },
    ];
    edges = [
      { id: "e1-2", source: "node-1", target: "node-2", label: "Next" },
      { id: "e2-3", source: "node-2", target: "node-3", label: "Next" },
      { id: "e3-4", source: "node-3", target: "node-4", label: "Next" },
      { id: "e4-5", source: "node-4", target: "node-5", label: "Yes (Opened)" },
      { id: "e4-7", source: "node-4", target: "node-7", label: "No (Not Opened)" },
      { id: "e5-6", source: "node-5", target: "node-6", label: "Next" },
      { id: "e6-8", source: "node-6", target: "node-8", label: "Next" },
      { id: "e7-8", source: "node-7", target: "node-8", label: "Next" },
      { id: "e8-9", source: "node-8", target: "node-9", label: "Complete" },
    ];
  } else if (lower.includes("cart") || lower.includes("abandon")) {
    name = "Abandoned Cart Recovery & Offer Blitz";
    description = "Triggers on incomplete checkout or form abandonment. Sends instant email recovery, 10% discount via WhatsApp, and logs CRM deal.";
    category = "E-Commerce / Conversion";
    nodes = [
      { id: "node-1", type: "trigger", subtype: "form_submitted", label: "Form Submitted / Cart Incomplete", description: "Fires when user leaves checkout page", config: {}, position: { x: 300, y: 50 } },
      { id: "node-2", type: "delay", subtype: "delay_duration", label: "Wait 1 Hour", description: "Allows 1 hour grace period", config: { delayHours: 1 }, position: { x: 300, y: 180 } },
      { id: "node-3", type: "condition", subtype: "if_purchase_completed", label: "If Purchase Completed?", description: "Checks if order was finalized", config: {}, position: { x: 300, y: 310 } },
      { id: "node-4", type: "action", subtype: "send_email", label: "Send Thank You Confirmation", description: "Delivers receipt & onboarding details", config: { emailSubject: "Order Confirmed! Welcome to SalesFlow" }, position: { x: 500, y: 440 } },
      { id: "node-5", type: "action", subtype: "send_email", label: "Send Cart Recovery Email", description: "Sends saved cart link with product summary", config: { emailSubject: "Did you forget your SalesFlow plan? Complete checkout" }, position: { x: 100, y: 440 } },
      { id: "node-6", type: "action", subtype: "send_whatsapp", label: "Send WhatsApp 10% Promo Code", description: "Sends exclusive 10% discount code", config: { whatsappMessage: "Hey {{first_name}}! Use code RECOVER10 to get 10% off your order today." }, position: { x: 100, y: 570 } },
      { id: "node-7", type: "action", subtype: "create_deal", label: "Create Deal in CRM", description: "Creates high-priority deal stage in pipeline", config: { dealValueThreshold: 1200 }, position: { x: 100, y: 700 } },
      { id: "node-8", type: "end", subtype: "end_workflow", label: "End Workflow", description: "Concludes cart recovery flow", config: {}, position: { x: 300, y: 830 } },
    ];
    edges = [
      { id: "e1-2", source: "node-1", target: "node-2", label: "Next" },
      { id: "e2-3", source: "node-2", target: "node-3", label: "Next" },
      { id: "e3-4", source: "node-3", target: "node-4", label: "Yes (Purchased)" },
      { id: "e3-5", source: "node-3", target: "node-5", label: "No (Abandoned)" },
      { id: "e5-6", source: "node-5", target: "node-6", label: "Next" },
      { id: "e6-7", source: "node-6", target: "node-7", label: "Next" },
      { id: "e4-8", source: "node-4", target: "node-8", label: "Complete" },
      { id: "e7-8", source: "node-7", target: "node-8", label: "Complete" },
    ];
  } else if (lower.includes("webinar") || lower.includes("reminder") || lower.includes("event")) {
    name = "Webinar Registration & Attendance Boost Workflow";
    description = "Schedules pre-event SMS and WhatsApp reminders, splits attendees vs no-shows post-event, and delivers proposal links.";
    category = "Event & Webinar";
    nodes = [
      { id: "node-1", type: "trigger", subtype: "landing_page_submitted", label: "Webinar Form Submitted", description: "Fires when user registers on landing page", config: {}, position: { x: 300, y: 50 } },
      { id: "node-2", type: "action", subtype: "send_email", label: "Send Calendar Invite & Confirmation", description: "Delivers calendar ICS link & join details", config: { emailSubject: "You're in! Webinar join link inside" }, position: { x: 300, y: 180 } },
      { id: "node-3", type: "delay", subtype: "wait_until", label: "Wait Until 1 Hour Before Event", description: "Pauses until event countdown", config: { delayHours: 24 }, position: { x: 300, y: 310 } },
      { id: "node-4", type: "action", subtype: "send_sms", label: "Send SMS Direct Join Link", description: "Sends mobile join notification", config: { smsMessage: "Webinar starts in 60 mins! Join live link: https://salesflow.ai/live" }, position: { x: 300, y: 440 } },
      { id: "node-5", type: "condition", subtype: "if_meeting_booked", label: "Attended Live Session?", description: "Checks attendance logs", config: {}, position: { x: 300, y: 570 } },
      { id: "node-6", type: "action", subtype: "generate_proposal", label: "Generate AI Proposal Offer", description: "Drafts tailored post-webinar discount proposal", config: {}, position: { x: 120, y: 700 } },
      { id: "node-7", type: "action", subtype: "send_email", label: "Send Replay & Slide Deck", description: "Delivers recording link to no-shows", config: { emailSubject: "Missed the live webinar? Here is the full replay" }, position: { x: 480, y: 700 } },
      { id: "node-8", type: "end", subtype: "end_workflow", label: "End Workflow", description: "Concludes webinar campaign", config: {}, position: { x: 300, y: 830 } },
    ];
    edges = [
      { id: "e1-2", source: "node-1", target: "node-2", label: "Next" },
      { id: "e2-3", source: "node-2", target: "node-3", label: "Next" },
      { id: "e3-4", source: "node-3", target: "node-4", label: "Next" },
      { id: "e4-5", source: "node-4", target: "node-5", label: "Next" },
      { id: "e5-6", source: "node-5", target: "node-6", label: "Yes (Attended)" },
      { id: "e5-7", source: "node-5", target: "node-7", label: "No (Missed)" },
      { id: "e6-8", source: "node-6", target: "node-8", label: "Complete" },
      { id: "e7-8", source: "node-7", target: "node-8", label: "Complete" },
    ];
  } else {
    // Lead Nurturing / Default Custom Workflow
    name = `Custom Lead Nurturing: ${cleanPrompt}`;
    description = `Multi-step AI automated lead nurturing campaign tailored for "${cleanPrompt}".`;
    category = "Lead Nurturing";
    nodes = [
      { id: "node-1", type: "trigger", subtype: "csv_import", label: "CSV Lead Import / Trigger", description: "Fires when new contacts imported or qualified", config: {}, position: { x: 300, y: 50 } },
      { id: "node-2", type: "action", subtype: "assign_sales_rep", label: "Assign Sales Representative", description: "Assigns contact to account executive", config: { assignedRep: "Marcus Vance" }, position: { x: 300, y: 180 } },
      { id: "node-3", type: "action", subtype: "send_email", label: "Send Intro Outreach Email", description: "Sends AI-personalized cold introduction", config: { emailSubject: `Quick question regarding ${cleanPrompt.slice(0, 30)}` }, position: { x: 300, y: 310 } },
      { id: "node-4", type: "delay", subtype: "delay_duration", label: "Wait 2 Business Days", description: "Allows 2 days for engagement", config: { delayDays: 2 }, position: { x: 300, y: 440 } },
      { id: "node-5", type: "condition", subtype: "if_link_clicked", label: "If Link Clicked?", description: "Checks if prospect clicked value link", config: {}, position: { x: 300, y: 570 } },
      { id: "node-6", type: "action", subtype: "lead_score", label: "Boost Lead Score +25", description: "Marks prospect as High Intent", config: { scoreChange: 25 }, position: { x: 120, y: 700 } },
      { id: "node-7", type: "action", subtype: "create_deal", label: "Create Opportunity Deal in CRM", description: "Moves contact into Active Discovery pipeline", config: { dealValueThreshold: 5000 }, position: { x: 120, y: 830 } },
      { id: "node-8", type: "action", subtype: "generate_ai_followup", label: "Generate AI Follow-up Draft", description: "Generates custom follow-up email", config: {}, position: { x: 480, y: 700 } },
      { id: "node-9", type: "end", subtype: "end_workflow", label: "End Workflow", description: "Concludes nurturing sequence", config: {}, position: { x: 300, y: 960 } },
    ];
    edges = [
      { id: "e1-2", source: "node-1", target: "node-2", label: "Next" },
      { id: "e2-3", source: "node-2", target: "node-3", label: "Next" },
      { id: "e3-4", source: "node-3", target: "node-4", label: "Next" },
      { id: "e4-5", source: "node-4", target: "node-5", label: "Next" },
      { id: "e5-6", source: "node-5", target: "node-6", label: "Yes (Clicked)" },
      { id: "e5-8", source: "node-5", target: "node-8", label: "No (Not Clicked)" },
      { id: "e6-7", source: "node-6", target: "node-7", label: "Next" },
      { id: "e7-9", source: "node-7", target: "node-9", label: "Complete" },
      { id: "e8-9", source: "node-8", target: "node-9", label: "Complete" },
    ];
  }

  return {
    id: `wf-gen-${Date.now()}`,
    name,
    description,
    category,
    status: "active",
    nodes,
    edges,
    analytics: {
      activeContacts: 24,
      completedContacts: 112,
      conversionRate: 34.2,
      openRate: 68.9,
      clickRate: 38.4,
      revenueGenerated: 42500,
      goalCompletion: 92,
      avgCompletionTime: "2.5 Days",
    },
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };
}

export async function generateCampaignWithAI(
  type: CampaignType,
  goal: CampaignGoal,
  brief: {
    product: string;
    audience?: string;
    country?: string;
    budget?: string;
    uploadedAssetNames?: string[];
  }
): Promise<GeneratedCampaign> {
  const cleanBusiness = brief.product.trim() || "B2B SaaS Growth Solution";
  const prompt = `You are a world-class Sales & Marketing Manager. Generate a complete, highly realistic, live campaign JSON for:
Product/Goal: "${cleanBusiness}"
Target Audience: "${brief.audience || "B2B Decision Makers"}"
Target Market: "${brief.country || "Global"}"
Budget: "${brief.budget || "$1,000 - $5,000 / mo"}"

Return ONLY a valid JSON object matching this structure:
{
  "name": "Campaign Title",
  "customerPersona": {
    "title": "Persona Title",
    "demography": "Demographic details",
    "painPoints": ["Point 1", "Point 2", "Point 3"],
    "goals": ["Goal 1", "Goal 2", "Goal 3"]
  },
  "emailContent": {
    "subjectLines": ["Subject 1", "Subject 2", "Subject 3"],
    "preheader": "Preheader text",
    "body": "Email body content with {{first_name}} tag",
    "cta": "Call to action label",
    "followUpEmails": [
      { "step": 1, "delayDays": 3, "subject": "Follow up 1", "body": "Body 1" },
      { "step": 2, "delayDays": 6, "subject": "Follow up 2", "body": "Body 2" }
    ]
  },
  "landingPage": {
    "headline": "Main Headline",
    "subheadline": "Subheadline text",
    "bodyText": "Body copy",
    "ctaText": "Button CTA",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
  },
  "whatsAppMessages": [
    { "step": 1, "text": "WhatsApp message 1" },
    { "step": 2, "text": "WhatsApp message 2" }
  ],
  "socialMediaPosts": [
    { "platform": "LinkedIn", "text": "LinkedIn post", "hashtags": "#Sales #Growth" },
    { "platform": "Twitter / X", "text": "X post", "hashtags": "#AI #SalesFlow" }
  ],
  "callScripts": [
    { "title": "30-Sec Pitch", "script": "Script text", "objectHandling": "Handling text" }
  ]
}`;

  const text = await callAIGenerate("campaign_full_ai", prompt);
  if (text) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.name && parsed.emailContent) {
          const base = synthesizeCampaign(type, goal, cleanBusiness, brief.uploadedAssetNames);
          return {
            ...base,
            name: parsed.name || base.name,
            customerPersona: parsed.customerPersona || base.customerPersona,
            emailContent: parsed.emailContent || base.emailContent,
            landingPage: parsed.landingPage || base.landingPage,
            whatsAppMessages: parsed.whatsAppMessages || base.whatsAppMessages,
            socialMediaPosts: parsed.socialMediaPosts || base.socialMediaPosts,
            callScripts: parsed.callScripts || base.callScripts,
          };
        }
      }
    } catch (e) {
      console.warn("Error parsing Gemini AI generated campaign JSON, using structured fallback:", e);
    }
  }

  // Fallback to synthesizeCampaign
  return synthesizeCampaign(type, goal, cleanBusiness, brief.uploadedAssetNames);
}

export function synthesizeCampaign(
  type: CampaignType,
  goal: CampaignGoal,
  businessDescription: string,
  uploadedAssetNames: string[] = []
): GeneratedCampaign {
  const cleanBusiness = businessDescription.trim() || "B2B Technology Software";
  const assetsMention = uploadedAssetNames.length
    ? `Incorporating assets: ${uploadedAssetNames.join(", ")}`
    : "";

  return {
    id: `cmp-${Date.now()}`,
    name: `${type}: ${cleanBusiness.slice(0, 30)} Campaign`,
    type,
    goal,
    businessDescription: cleanBusiness,
    status: "active",
    customerPersona: {
      title: "VP / Decision Maker Persona",
      demography: "Mid to Senior Executives (30-55 yrs), Tech/B2B Companies, $1M-$20M ARR",
      painPoints: [
        "Inconsistent outbound pipeline and low lead response rates",
        "Manual sales workflows wasting 15+ hours per week",
        "High customer acquisition cost (CAC) across paid channels",
      ],
      goals: [
        `Achieve sustainable ROI and ${goal.toLowerCase()}`,
        "Automate multi-channel prospect engagement without losing personal touch",
        "Predictable monthly sales revenue & pipeline growth",
      ],
    },
    emailContent: {
      subjectLines: [
        `Unlock 3x ROI: ${cleanBusiness.slice(0, 45)}`,
        `How top industry leaders solve their biggest bottleneck with ${cleanBusiness.slice(0, 25)}`,
        `Exclusive invitation: Scale your results with SalesFlow AI`,
        `Are manual processes slowing down your ${goal.toLowerCase()} goal?`,
      ],
      preheader: `Transform your sales strategy with automated workflows tailored for ${cleanBusiness.slice(0, 35)}.`,
      body: `Hi {{first_name}},

When managing operations in your domain, efficiency and conversion speed are everything.

Our solution was engineered specifically for businesses like yours:
${cleanBusiness}

Key Advantages:
• Automate 80% of repetitive outreach & follow-up tasks
• Real-time lead scoring & instant meeting booking
• Native CRM integration with full customer journey visibility

${assetsMention ? `\nNote: We have analyzed your uploaded documentation (${uploadedAssetNames.join(", ")}) to tailor this campaign.` : ""}

Would you be open to a 10-minute preview this week to see how we can help you ${goal.toLowerCase()}?`,
      cta: `Schedule ${goal} Call`,
      followUpEmails: [
        {
          step: 1,
          delayDays: 3,
          subject: `Quick check-in regarding ${cleanBusiness.slice(0, 30)}`,
          body: `Hi {{first_name}},\n\nI wanted to follow up on my previous note. We recently helped a similar organization achieve a 45% increase in conversions.\n\nShould I send over our 3-page case study?`,
        },
        {
          step: 2,
          delayDays: 6,
          subject: `Final invitation for ${goal.toLowerCase()} strategy session`,
          body: `Hi {{first_name}},\n\nI know things get busy. If you're still looking to ${goal.toLowerCase()}, I'm reserving 5 strategic audit slots this month.\n\nLet me know if Tuesday works!`,
        },
      ],
    },
    landingPage: {
      headline: `The Ultimate Platform for ${type}`,
      subheadline: `Empowering businesses focused on "${cleanBusiness.slice(0, 60)}" to ${goal.toLowerCase()} effortlessly.`,
      bodyText: `SalesFlow AI generates high-converting sales pipelines, automated multi-channel messaging, and real-time CRM updates from simple conversation.`,
      ctaText: `Get Started Free Today`,
      features: [
        "AI-Powered Personalization Engine",
        "Multi-Channel Orchestration (Email, WhatsApp, SMS, LinkedIn)",
        "Automated Lead Scoring & CRM Synchronization",
        "Instant ROI & Conversion Analytics",
      ],
    },
    whatsAppMessages: [
      {
        step: 1,
        text: `👋 Hi {{first_name}}! Quick question regarding ${cleanBusiness.slice(0, 30)}: Want to see how our AI automates ${goal.toLowerCase()} in under 48 hours? Check our 1-min demo: https://salesflow.ai/demo`,
      },
      {
        step: 2,
        text: `Hey {{first_name}}, following up on my message. Would you be open for a quick 10-min chat Thursday?`,
      },
    ],
    smsContent: [
      {
        step: 1,
        text: `SalesFlow AI: Ready to ${goal.toLowerCase()}? Reply YES to receive your custom campaign blueprint.`,
      },
      {
        step: 2,
        text: `Reminder: Your custom campaign preview is ready for review. Access link: https://salesflow.ai/preview`,
      },
    ],
    linkedInMessages: [
      {
        step: 1,
        text: `Hi {{first_name}}, came across your profile and loved your focus at {{company}}. We've built an AI system specifically for ${cleanBusiness.slice(0, 40)} that helps teams ${goal.toLowerCase()}. Would love to connect and share insights!`,
      },
    ],
    workflowNodes: [
      { id: "w-1", title: "Target Audience Match", type: "trigger", detail: `Matching contacts for goal: ${goal}` },
      { id: "w-2", title: `Multi-channel ${type}`, type: "action", detail: "Dispatch personalized Email & WhatsApp" },
      { id: "w-3", title: "Track Engagements", type: "condition", detail: "If opened or clicked within 48h" },
      { id: "w-4", title: "AI Lead Score Boost", type: "action", detail: "+25 Lead Score for active clicks" },
      { id: "w-5", title: "Wait 3 Days", type: "delay", detail: "Delay before smart follow-up" },
      { id: "w-6", title: "Deliver Follow-Up", type: "action", detail: "Send email sequence step 2" },
    ],
    audienceSegments: [
      { name: "Primary Ideal Customer Profile (ICP)", count: 1850, criteria: `Matched business domain: ${cleanBusiness.slice(0, 20)}` },
      { name: "High Intent Decision Makers", count: 920, criteria: "VP/C-Level titles in target industry" },
      { name: "Re-engagement Contacts", count: 640, criteria: "Inbound leads with >60 lead score" },
    ],
    socialMediaPosts: [
      {
        platform: "LinkedIn",
        text: `🚀 Stop chasing cold leads. Here is how top B2B leaders automate high-converting outreach for ${cleanBusiness.slice(0, 30)} without losing personalization.`,
        hashtags: "#B2BSales #AIAutomation #SalesFlow #LeadGen",
      },
      {
        platform: "Twitter / X",
        text: `Struggling to ${goal.toLowerCase()}? Our AI campaign engine crafts personalized emails, WhatsApp messages & sales funnels in 60 seconds. ⚡`,
        hashtags: "#SalesTech #GrowthHacking #AI",
      },
    ],
    callScripts: [
      {
        title: "Cold Call Pitch Script (30 Seconds)",
        script: `"Hi {{first_name}}, this is [Your Name] from SalesFlow AI. I noticed your team is working on ${cleanBusiness.slice(0, 35)}. We help companies automate their sales outreach and boost conversions by 3x. Do you have 20 seconds for me to share how?"`,
        objectHandling: `"We already have a tool" -> "Understood! Most of our clients used traditional CRMs before switching to AI-driven multi-channel workflows. How is your team currently handling WhatsApp and LinkedIn follow-ups?"`,
      },
    ],
    meetingBookingPage: {
      title: `${goal} Strategy Session`,
      link: `https://salesflow.ai/book/${Date.now().toString().slice(-6)}`,
      description: `Book a 15-minute 1-on-1 strategy call to review your campaign setup and launch your high-converting pipeline.`,
      duration: "15 Mins",
      availableSlots: ["Tomorrow at 10:00 AM", "Tomorrow at 2:30 PM", "Friday at 11:00 AM"],
    },
    sendSchedule: "AI Optimized Send Time (Tue & Thu 10:00 AM)",
    createdAt: new Date().toISOString().split("T")[0],
    metrics: {
      sent: 2840,
      delivered: 2810,
      openRate: 54.2,
      clickRate: 21.6,
      replies: 114,
      conversions: 31,
      revenue: 96000,
      meetingsBooked: 19,
    },
  };
}

export async function callAIGenerate(task: string, prompt: string, systemInstruction?: string) {
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, prompt, systemInstruction }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text;
    }
  } catch (err) {
    console.warn(`AI generation error for ${task}:`, err);
  }
  return null;
}

export async function generateCampaignStrategyAI(type: CampaignType, goal: CampaignGoal, description: string): Promise<string> {
  const prompt = `Generate a high-converting, strategic sales campaign plan for a ${type} with the goal "${goal}".
Business/Product context: "${description}".
Include key positioning, 3-step value proposition, target buyer triggers, and channel strategy. Keep it compelling and structured.`;
  
  const text = await callAIGenerate("campaign_strategy", prompt);
  if (text) return text;
  
  return `Targeted Strategy for ${type}:
1. Positioning: Position ${description.slice(0, 40)} as the leading solution for achieving ${goal.toLowerCase()}.
2. Value Props: Automate outreach, boost reply rates by 40%, and lower CAC.
3. Multi-channel execution: Integrated Email, WhatsApp, and automated follow-ups.`;
}

export async function generateSubjectLinesAI(product: string, goal: string): Promise<string[]> {
  const prompt = `Generate 5 high-open-rate B2B email subject lines for ${product} aimed at achieving ${goal}. Output only 5 lines, one per line.`;
  const text = await callAIGenerate("subject_lines", prompt);
  if (text) {
    const lines = text.split("\n").map(l => l.replace(/^[0-9\.\-\*\s]+/, "").trim()).filter(Boolean);
    if (lines.length > 0) return lines.slice(0, 5);
  }
  return [
    `Unlock 3x ROI: ${product.slice(0, 30)}`,
    `Quick question regarding your ${goal.toLowerCase()} pipeline`,
    `How top industry leaders solve their bottleneck with ${product.slice(0, 20)}`,
    `Are manual processes slowing down your team?`,
    `Exclusive strategy invite for ${goal.toLowerCase()}`
  ];
}

export async function generateEmailContentAI(product: string, goal: string, audience: string): Promise<{ subject: string; body: string; cta: string }> {
  const prompt = `Write a persuasive, highly personalized cold email for product "${product}" targeting "${audience}" to achieve "${goal}".
Include:
Subject Line
Email Body (3 paragraphs max)
Clear CTA button text`;

  const text = await callAIGenerate("email_content", prompt);
  if (text) {
    return {
      subject: `Accelerate ${goal} with ${product.slice(0, 30)}`,
      body: text,
      cta: `Book 15-Min Strategy Session`,
    };
  }

  return {
    subject: `Accelerate ${goal} with ${product.slice(0, 30)}`,
    body: `Hi {{first_name}},\n\nWhen managing operations at {{company}}, speed and predictable revenue are key.\n\nWe engineered ${product} specifically to help teams like yours achieve ${goal.toLowerCase()} with zero hassle.\n\nWould you be open to a 10-minute preview this week?`,
    cta: `Schedule ${goal} Call`,
  };
}

export async function generateWhatsAppMessagesAI(product: string, goal: string): Promise<{ step: number; text: string }[]> {
  const prompt = `Generate 2 short, engaging WhatsApp outreach messages for product "${product}" targeting "${goal}". Return 2 distinct messages.`;
  const text = await callAIGenerate("whatsapp_messages", prompt);
  if (text) {
    const parts = text.split(/\n\n+/).filter(Boolean);
    return parts.map((t, i) => ({ step: i + 1, text: t.trim() }));
  }
  return [
    { step: 1, text: `👋 Hi {{first_name}}! Quick question: Want to see how ${product.slice(0, 30)} automates ${goal.toLowerCase()} in under 48 hours? Demo: https://salesflow.ai/demo` },
    { step: 2, text: `Hey {{first_name}}, following up on my note! Would you be open for a quick 10-min chat Thursday?` }
  ];
}

export async function generateLandingPageAI(product: string, goal: string): Promise<{ headline: string; subheadline: string; bodyText: string; ctaText: string; features: string[] }> {
  const prompt = `Generate landing page copy for "${product}" designed for "${goal}".
Return JSON object with fields: headline, subheadline, bodyText, ctaText, features (array of 4 string benefits).`;
  
  const text = await callAIGenerate("landing_page", prompt);
  if (text) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.headline) return parsed;
      }
    } catch (e) {
      // Fallthrough
    }
  }

  return {
    headline: `The Ultimate Platform for ${goal}`,
    subheadline: `Empowering businesses using "${product.slice(0, 50)}" to scale revenue effortlessly.`,
    bodyText: `SalesFlow AI generates high-converting sales pipelines, automated multi-channel messaging, and real-time CRM updates from simple conversation.`,
    ctaText: `Get Started Free Today`,
    features: [
      "AI-Powered Personalization Engine",
      "Multi-Channel Orchestration (Email, WhatsApp, SMS, LinkedIn)",
      "Automated Lead Scoring & CRM Synchronization",
      "Instant ROI & Conversion Analytics",
    ],
  };
}

export async function generateFollowUpEmailsAI(product: string, goal: string): Promise<{ step: number; delayDays: number; subject: string; body: string }[]> {
  const prompt = `Generate 2 high-response follow-up cold emails for "${product}" to achieve "${goal}".`;
  const text = await callAIGenerate("follow_up_emails", prompt);
  if (text) {
    return [
      {
        step: 1,
        delayDays: 3,
        subject: `Quick check-in regarding ${product.slice(0, 30)}`,
        body: text.slice(0, 200),
      },
      {
        step: 2,
        delayDays: 6,
        subject: `Final invitation for ${goal.toLowerCase()} session`,
        body: `Hi {{first_name}},\n\nI know things get busy. If you're still looking to ${goal.toLowerCase()}, I'm reserving strategic audit slots this month.`,
      }
    ];
  }
  return [
    {
      step: 1,
      delayDays: 3,
      subject: `Quick check-in regarding ${product.slice(0, 30)}`,
      body: `Hi {{first_name}},\n\nI wanted to follow up on my previous note. We recently helped a similar organization achieve a 45% increase in conversions.\n\nShould I send over our 3-page case study?`,
    },
    {
      step: 2,
      delayDays: 6,
      subject: `Final invitation for ${goal.toLowerCase()} session`,
      body: `Hi {{first_name}},\n\nI know things get busy. If you're still looking to ${goal.toLowerCase()}, I'm reserving 5 strategic audit slots this month.\n\nLet me know if Tuesday works!`,
    },
  ];
}

export async function generateCustomerPersonaAI(product: string, goal: string): Promise<{ title: string; demography: string; painPoints: string[]; goals: string[] }> {
  return {
    title: "VP / Decision Maker Persona",
    demography: "Mid to Senior Executives (30-55 yrs), Tech/B2B Companies, $1M-$20M ARR",
    painPoints: [
      "Inconsistent outbound pipeline and low lead response rates",
      "Manual sales workflows wasting 15+ hours per week",
      "High customer acquisition cost (CAC) across paid channels",
    ],
    goals: [
      `Achieve sustainable ROI and ${goal.toLowerCase()}`,
      "Automate multi-channel prospect engagement without losing personal touch",
      "Predictable monthly sales revenue & pipeline growth",
    ],
  };
}

export async function generateCTAAI(goal: string, product: string): Promise<string> {
  const prompt = `Generate 3 ultra-high converting CTA button labels for "${goal}" with "${product}".`;
  const text = await callAIGenerate("cta", prompt);
  if (text) {
    const lines = text.split("\n").map(l => l.replace(/^[0-9\.\-\*\s]+/, "").trim()).filter(Boolean);
    if (lines.length > 0) return lines[0];
  }
  return `Claim Your Free ${goal} Audit`;
}

export async function generateAIReportAI(contactsCount: number, campaignsCount: number, totalRevenue: number): Promise<string> {
  const prompt = `Generate an executive AI sales intelligence report for a team with ${contactsCount} contacts, ${campaignsCount} active campaigns, and $${totalRevenue.toLocaleString()} in pipeline revenue. Include key recommendations and performance analysis.`;
  const text = await callAIGenerate("report", prompt);
  if (text) return text;
  
  return `### AI Sales Performance & Growth Analysis
  
• **Pipeline Health**: Outstanding activity with ${contactsCount} active contacts in database.
• **Campaign Efficiency**: ${campaignsCount} campaigns currently running across multi-channel sequences.
• **Revenue Velocity**: Current pipeline value stands at **$${totalRevenue.toLocaleString()}**.
• **AI Recommendation**: Focus on WhatsApp automated follow-ups for warm leads to boost response speed by 3x.`;
}
