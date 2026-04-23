import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const API_URL = "/api";

function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("⏳ Connecting...");
  const [mode, setMode] = useState("explain");
  const [level, setLevel] = useState("intermediate");
  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem("eduwiz-chat");
    return saved ? JSON.parse(saved) : [];
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        setStatus(data.status);
      } catch {
        setStatus("❌ Offline");
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    localStorage.setItem("eduwiz-chat", JSON.stringify(chat));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setChat((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      // Prepare history (excluding the very last message we just added)
      const history = chat.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: mode, 
          input: question, 
          level: mode === "explain" ? level : undefined,
          history: history 
        }),
      });

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.result || "⚠️ No response." };
      setChat((prev) => [...prev, aiMessage]);
    } catch (err) {
      setChat((prev) => [...prev, { role: "assistant", content: "❌ Connection failed." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all conversations?")) {
      setChat([]);
      localStorage.removeItem("eduwiz-chat");
    }
  };

  return (
    <div className="app-container">
      <header className="glass-header">
        <div className="logo">
          <span className="sparkle">✨</span> EduWiz AI
        </div>
        <div className={`status-badge ${status.includes("✅") ? "online" : "offline"}`}>
          {status}
        </div>
      </header>

      <main className="chat-area">
        {chat.length === 0 ? (
          <div className="welcome-screen">
            <h1>Hi! I'm your AI Learning Buddy.</h1>
            <p>I can help you explain concepts, summarize text, or define words. Choose a mode to start!</p>
            <div className="quick-actions">
              <button onClick={() => setMode("explain")}>📖 Explain</button>
              <button onClick={() => setMode("summarize")}>📝 Summarize</button>
              <button onClick={() => setMode("dictionary")}>📚 Dictionary</button>
            </div>
          </div>
        ) : (
          <div className="message-list">
            {chat.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className="message-bubble">
                  {(msg.content || "").replace(/[#*]/g, "")}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      <footer className="input-area glass-footer">
        <div className="controls">
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="mode-select">
            <option value="explain">Explain</option>
            <option value="summarize">Summarize</option>
            <option value="dictionary">Dictionary</option>
          </select>

          {mode === "explain" && (
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="level-select">
              <option value="basic">👶 Basic</option>
              <option value="intermediate">🧑 Student</option>
              <option value="advanced">🎓 Professional</option>
            </select>
          )}
          
          <button className="clear-btn" onClick={clearChat} title="Clear Chat">🗑️</button>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={loading ? "Generating..." : "Type your message..."}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !question.trim()}>
            {loading ? <div className="spinner-small" /> : "🚀"}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;