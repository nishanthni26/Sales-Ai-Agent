import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI client
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI with API key", e);
    }
  }

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiEnabled: Boolean(ai) });
  });

  // AI Chat & Campaign Generation API
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction, history, openaiApiKey } = req.body;

      // Check OpenAI API key first if provided
      const apiKeyToUse = openaiApiKey || process.env.OPENAI_API_KEY;
      if (apiKeyToUse) {
        try {
          const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeyToUse}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    systemInstruction ||
                    "You are SalesFlow AI, an elite enterprise sales manager and campaign strategist.",
                },
                ...(history || []).map((h: any) => ({
                  role: h.role === "user" ? "user" : "assistant",
                  content: h.text,
                })),
                { role: "user", content: prompt },
              ],
              temperature: 0.7,
            }),
          });
          if (openAiRes.ok) {
            const openAiData = await openAiRes.json();
            const text = openAiData.choices?.[0]?.message?.content;
            if (text) {
              return res.json({ text, provider: "openai", fallback: false });
            }
          }
        } catch (openAiErr) {
          console.warn("OpenAI API call error, falling back to Gemini:", openAiErr);
        }
      }

      if (!ai) {
        return res.json({
          text: null,
          fallback: true,
          message: "AI service initialized with smart template engine.",
        });
      }

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: prompt || "Generate sales campaign assets" }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction:
            systemInstruction ||
            "You are SalesFlow AI, an elite, hyper-intelligent AI Sales Manager and Campaign Strategist. Provide creative, actionable, structured sales copy and strategy.",
          temperature: 0.7,
        },
      });

      const text = response.text;
      return res.json({ text, provider: "gemini", fallback: false });
    } catch (error: any) {
      console.error("Error calling AI API:", error);
      return res.status(200).json({
        text: null,
        fallback: true,
        error: error.message || "Failed to call AI API",
      });
    }
  });

  // Specialized Structured AI Generation API
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { task, prompt, systemInstruction, openaiApiKey } = req.body;
      const apiKeyToUse = openaiApiKey || process.env.OPENAI_API_KEY;

      let generatedText = "";

      if (apiKeyToUse) {
        try {
          const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeyToUse}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    systemInstruction ||
                    `You are SalesFlow AI. Task: ${task}. Output JSON only when requested or clear structured text.`,
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.7,
            }),
          });
          if (openAiRes.ok) {
            const data = await openAiRes.json();
            generatedText = data.choices?.[0]?.message?.content || "";
          }
        } catch (e) {
          console.warn("OpenAI call error:", e);
        }
      }

      if (!generatedText && ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            systemInstruction: systemInstruction || `You are SalesFlow AI. Task: ${task}.`,
            temperature: 0.7,
          },
        });
        generatedText = response.text || "";
      }

      return res.json({ text: generatedText, task });
    } catch (error: any) {
      console.error("AI Generation error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware for Dev Mode vs Production Static Server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SalesFlow AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
