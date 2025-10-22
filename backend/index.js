import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 OpenAI setup (new SDK style)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 Prompt builder
function buildPrompt(type, input, level = "basic") {
  const playfulIntros = [
    "Alright, buckle up! Here's the scoop:",
    "Let me break it down like you're five:",
    "Time for a brain-friendly breakdown:",
    "Imagine you're explaining this to a curious cat:",
    "Here’s the lowdown, no jargon allowed:",
  ];
  const intro = playfulIntros[Math.floor(Math.random() * playfulIntros.length)];

  switch (type) {
    case "summarize":
      return `Summarize this clearly and concisely:\n\n${input}`;
    case "explain":
      return `${intro}\nExplain in a ${level} way:\n\n${input}`;
    case "dictionary":
      return `Define this word simply:\n\n${input}`;
    default:
      return null;
  }
}

// 🧠 OpenAI call
async function callOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ modern lightweight model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    return null;
  }
}

// ✅ Health check
app.get("/api/health", (_, res) => {
  res.json({ status: "Backend running ✅" });
});

// 🚀 Main endpoint
app.post("/api/process", async (req, res) => {
  const { type, input, level } = req.body;
  console.log("Incoming:", { type, input, level });

  const prompt = buildPrompt(type, input, level);
  if (!prompt) {
    return res.json({
      result: "❌ Unsupported request type. Please try again.",
    });
  }

  const result = await callOpenAI(prompt);
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