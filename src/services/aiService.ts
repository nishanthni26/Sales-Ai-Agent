import { CampaignType, CampaignGoal, GeneratedCampaign } from "../types";

export interface AIResponse {
  text: string;
  fallback?: boolean;
}

export async function askAIChat(
  prompt: string,
  history?: { role: string; text: string }[],
  systemInstruction?: string
): Promise<AIResponse> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, history, systemInstruction }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.text) {
      return { text: data.text, fallback: false };
    }
    return { text: data.message || "Processed locally.", fallback: true };
  } catch (err) {
    console.warn("AI endpoint unreachable, using intelligent local engine:", err);
    return { text: "", fallback: true };
  }
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
