# 🎓 EduWiz AI — Level-Based Learning Chatbot

<div align="center">

![EduWiz AI](https://img.shields.io/badge/EduWiz-AI%20Powered-6C63FF?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini%201.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)

**An AI-powered educational chatbot that explains, summarizes, and defines concepts at your chosen complexity level.**

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)
- [Future Scope](#-future-scope)
- [License](#-license)

---

## 🧠 Overview

**EduWiz AI** is a full-stack, AI-driven educational chatbot that bridges the gap between complex topics and user comprehension. Unlike traditional chatbots that give generic answers, EduWiz allows users to select a **difficulty level** (Basic, Intermediate, Advanced) so that responses are always tailored to their current understanding.

It supports three core learning modes:
- 💬 **Explain** — Get a pedagogically clear explanation of any concept
- 📝 **Summarize** — Condense any block of text into a concise summary
- 📖 **Dictionary** — Look up simple, plain-English definitions

> **Mini-Project:** Final Year – B.E. Computer Science | III CSE C

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎚️ **Level-Based Responses** | Toggle between Basic, Intermediate, and Advanced explanations |
| 🤖 **AI-Powered Engine** | Backed by Google Gemini 1.5 Flash for fast, intelligent responses |
| 💬 **Multi-Mode Chatbot** | Explain, Summarize, and Dictionary modes in one interface |
| 🔁 **Conversation History** | Context-aware responses using chat history sent to the AI |
| 💾 **Persistent Sessions** | Chat history saved to `localStorage` — survives page refreshes |
| 🧹 **Clean Text Output** | Dual-layer sanitization strips all Markdown symbols for readability |
| ⚡ **Dual-Run Dev Server** | Frontend and Backend start simultaneously with a single command |
| 🎨 **Glassmorphism UI** | Modern, premium interface built with Vanilla CSS |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (v18+) |
| **Styling** | Vanilla CSS with Glassmorphism design |
| **Backend (Primary)** | Node.js + Express |
| **Backend (Alternative)** | Python + Flask (`app.py`) |
| **AI Engine** | Google Gemini 1.5 Flash (`gemini-flash-latest`) |
| **State Management** | React Hooks (`useState`, `useEffect`) + `localStorage` |
| **Communication** | REST API (HTTP/JSON) |
| **Dev Tooling** | Nodemon, Concurrently |

---

## 🏗️ Architecture

The system follows a classic **Client-Server Architecture**:

```
User ──► React Frontend ──► POST /api/process ──► Express Backend
                                                         │
                                              Google Gemini 1.5 Flash
                                                         │
User ◄── Chat Bubble ◄── Cleaned Response ◄─────────────┘
               │
          localStorage (persistence)
```

### Request Flow

1. **User** selects a mode (Explain/Summarize/Define) and level (Basic/Intermediate/Advanced)
2. **Frontend** sends a `POST /api/process` request with the query, mode, level, and chat history
3. **Backend** constructs a tailored prompt using the `buildPrompt()` function
4. **Gemini AI** processes the prompt with full conversation context
5. **Backend** sanitizes the response (removes `#` and `*` characters)
6. **Frontend** renders the clean response in a chat bubble and saves to `localStorage`

---

## 📁 Project Structure

```
Mini-Project---Level---based-Learning-Chatbot/
│
├── package.json              # Root: runs both frontend & backend via concurrently
│
├── frontend/
│   └── src/
│       ├── App.js            # Main React component: chat logic & state management
│       ├── App.css           # Glassmorphism UI styling
│       └── index.js          # React entry point
│
└── backend/
    ├── index.js              # Primary Node.js/Express server + Gemini integration
    ├── app.py                # Alternative Flask/Python backend
    ├── .env                  # Environment variables (GEMINI_API_KEY)
    └── package.json          # Backend dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A valid **Google Gemini API Key** — get one at [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Sundhar004/Mini-Project---Level---based-Learning-Chatbot.git
cd Mini-Project---Level---based-Learning-Chatbot
```

### 2. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```bash
# backend/.env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Run the Application

```bash
# Start both frontend and backend simultaneously
npm start
```

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:5000 |
| **Health Check** | http://localhost:5000/api/health |

---

## 📡 API Reference

### `GET /api/health`

Returns the current status of the backend server.

**Response:**
```json
{
  "status": "Backend running ✅",
  "engine": "Gemini 1.5 Flash"
}
```

---

### `POST /api/process`

Processes a user query through the Gemini AI.

**Request Body:**
```json
{
  "type": "explain",
  "input": "How do black holes work?",
  "level": "basic",
  "history": [
    { "role": "user", "content": "What is gravity?" },
    { "role": "assistant", "content": "Gravity is a force that pulls objects together..." }
  ]
}
```

| Field | Type | Values |
|---|---|---|
| `type` | `string` | `explain`, `summarize`, `dictionary`, `chat` |
| `input` | `string` | The user's query or text |
| `level` | `string` | `basic`, `intermediate`, `advanced` |
| `history` | `array` | Previous chat messages for context |

**Response:**
```json
{
  "result": "Alright, buckle up! Here's the scoop: A black hole is a region in space where gravity is so strong that nothing, not even light, can escape from it..."
}
```

---

## ⚙️ How It Works

### Level-Based Prompt Engineering

The backend dynamically builds prompts based on the selected mode and level:

| Mode | Prompt Strategy |
|---|---|
| **Explain** | Injects level into prompt: `"Explain in an easy-to-understand way (level: basic)"` |
| **Summarize** | `"Summarize this clearly and concisely"` |
| **Dictionary** | `"Define this word simply"` |

**Difficulty Levels:**
- 🟢 **Basic** — Simple analogies, everyday language (ideal for beginners/kids)
- 🟡 **Intermediate** — Standard student-level explanation
- 🔴 **Advanced** — Technical terminology for professionals

### Conversation Context

The backend is **stateless** — the frontend sends the full conversation `history` array with every request. The backend maps it to Gemini's expected format:

```js
// assistant → model (Gemini format)
{ role: msg.role === "assistant" ? "model" : "user", parts: [{ text: msg.content }] }
```

### Response Sanitization

A two-layer cleaning process ensures plain-text output:

```js
// Backend
const cleanedText = text.replace(/[#*]/g, "").trim();
```

---

## 🔭 Future Scope

- 🎙️ **Voice Integration** — Web Speech API for voice-based queries
- 📄 **PDF Summarization** — Upload lecture notes for instant summaries
- 🌍 **Multi-lingual Support** — Expand to regional languages
- 🗄️ **Database Integration** — MongoDB for persistent cross-device history
- 🔐 **User Authentication** — Secure, personalized learning profiles
- ⚡ **Rate Limiting** — Redis-based caching for high-traffic scaling

---

## 📄 License

This project is developed as an academic mini-project and is open for educational use.

---

<div align="center">
  Made with ❤️ by <strong>Batch 40 | III CSE C</strong>
  <br/>
  Powered by <strong>Google Gemini AI</strong>
</div>
