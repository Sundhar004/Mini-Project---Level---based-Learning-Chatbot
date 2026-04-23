import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  systemInstruction: "You are EduWiz, a friendly and helpful AI learning assistant. Your goal is to explain concepts clearly, summarize text accurately, and provide simple dictionary definitions. Adjust your tone to be encouraging and use clear language based on the requested level (basic, intermediate, advanced). If you're using chat history, ensure you maintain context of the previous conversation. IMPORTANT: Do not use any markdown formatting like hashtags (#) or asterisks (*) in your responses. Provide the answer in clean, plain text without these symbols."
});

// 🧠 Prompt builder
function buildPrompt(type, input, level = "basic") {
  const playfulIntros = [
    "Alright, buckle up! Here's the scoop:",
    "Let me break it down clearly:",
    "Time for a brain-friendly breakdown:",
    "Here's the lowdown:",
    "Let me explain this for you:",
  ];
  const intro = playfulIntros[Math.floor(Math.random() * playfulIntros.length)];

  switch (type) {
    case "summarize":
      return `Summarize this clearly and concisely:\n\n${input}`;
    case "explain":
      return `${intro}\nExplain in an easy-to-understand way (level: ${level}):\n\n${input}`;
    case "dictionary":
      return `Define this word simply:\n\n${input}`;
    case "chat":
      return input;
    default:
      return null;
  }
}

// 🧠 Gemini call with history support
async function callGemini(prompt, history = []) {
  try {
    // Format history for Gemini: { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedHistory = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Empty response from Gemini");
    // Remove markdown symbols as requested by the user
    const cleanedText = text.replace(/[#*]/g, "").trim();
    return cleanedText;
  } catch (err) {
    console.error("Gemini Error:", err.message);
    if (err.message.includes("quota") || err.message.includes("429")) {
      return "⚠️ AI Quota reached. Please wait a moment or check your API key.";
    }
    if (err.message.includes("API_KEY_INVALID")) {
      return "❌ Invalid API Key. Please check your .env file.";
    }
    return `❌ Error: ${err.message}`;
  }
}

// ✅ Health check
app.get("/api/health", (_, res) => {
  res.json({ status: "Backend running ✅", engine: "Gemini 1.5 Flash" });
});

// 🚀 Main endpoint
app.post("/api/process", async (req, res) => {
  const { type, input, level, history } = req.body;
  console.log("Incoming Request:", { type, level, hasHistory: !!history });

  const prompt = buildPrompt(type, input, level);
  if (!prompt) {
    return res.json({
      result: "❌ Unsupported request type. Please try again.",
    });
  }

  const result = await callGemini(prompt, history || []);
  if (!result) {
    return res.json({
      result: "❌ AI could not generate a proper answer. Please try again.",
    });
  }

  res.json({ result });
});

// 🔊 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});