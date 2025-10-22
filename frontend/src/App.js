import React, { useState, useEffect } from "react";

const API_URL = "/api";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("⏳ Checking backend...");
  const [mode, setMode] = useState("explain");
  const [level, setLevel] = useState("basic");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("eduwiz-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("❌ Backend not connected"));
  }, []);

  useEffect(() => {
    localStorage.setItem("eduwiz-history", JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: mode, input: question, level }),
      });

      const data = await response.json();
      const result = data.result || "⚠️ No response received.";
      setAnswer(result);
      setHistory((prev) => [...prev, { question, answer: result }]);
    } catch {
      const errorMsg = "⚠️ Failed to connect to backend.";
      setAnswer(errorMsg);
      setHistory((prev) => [...prev, { question, answer: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("eduwiz-history");
  };

  const renderLevelSelector = () =>
    mode === "explain" && (
      <div style={styles.field}>
        <label htmlFor="level" style={styles.label}>
          Explanation Level:
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={styles.select}
        >
          <option value="basic">👶 Beginner</option>
          <option value="intermediate">🧑 Student</option>
          <option value="advanced">🎓 Professional</option>
        </select>
      </div>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>EduWiz AI</h1>
      <p
        style={{
          ...styles.status,
          color: status.includes("❌") ? "#EF4444" : "#10B981",
        }}
      >
        <span style={{ marginRight: "8px" }}>Backend Status:</span>
        <span>{status}</span>
      </p>

      <div style={styles.field}>
        <label htmlFor="mode" style={styles.label}>
          Choose Mode:
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={styles.select}
        >
          <option value="explain">📖 Explain</option>
          <option value="summarize">📝 Summarize</option>
          <option value="dictionary">📚 Dictionary</option>
        </select>
      </div>

      {renderLevelSelector()}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <textarea
          rows="4"
          style={styles.textarea}
          placeholder={
            mode === "dictionary"
              ? "Enter a word to define..."
              : mode === "summarize"
              ? "Paste text to summarize..."
              : "Ask a question or request an explanation..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          aria-label="User input"
        />
        <button
          type="submit"
          disabled={loading}
          style={styles.button(loading)}
          aria-label="Submit question"
        >
          {loading ? (
            <span>
              <span style={styles.spinner} />
              Processing...
            </span>
          ) : (
            "Ask"
          )}
        </button>
      </form>

      {answer && (
        <div style={styles.answerBox}>
          <h3 style={styles.answerTitle}>Answer:</h3>
          <p style={{ margin: 0 }}>{answer}</p>
        </div>
      )}

      {history.length > 0 && (
        <div style={styles.historyPanel}>
          <div style={styles.historyHeader}>
            <h3 style={styles.historyTitle}>History:</h3>
            <button onClick={handleClearHistory} style={styles.clearButton}>
              🗑️ Clear History
            </button>
          </div>
          <ul style={styles.historyList}>
            {history.map((item, index) => (
              <li key={index} style={styles.historyItem}>
                <strong>Q:</strong> {item.question}
                <br />
                <strong>A:</strong> {item.answer}
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Inter, Arial, sans-serif",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    padding: "32px",
  },
  title: {
    fontWeight: 700,
    fontSize: "2rem",
    marginBottom: "8px",
    color: "#2563EB",
  },
  status: {
    marginBottom: "16px",
    fontWeight: 600,
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    fontWeight: 600,
  },
  select: {
    marginLeft: "10px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #E6EAF0",
    fontWeight: 500,
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E6EAF0",
    fontSize: "1rem",
    marginBottom: "10px",
    resize: "vertical",
  },
  button: (loading) => ({
    padding: "10px 24px",
    background: loading ? "#93c5fd" : "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  }),
  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "2px solid #fff",
    borderTop: "2px solid #2563EB",
    borderRadius: "50%",
    marginRight: "8px",
    animation: "spin 1s linear infinite",
    verticalAlign: "middle",
  },
  answerBox: {
    marginTop: "20px",
    padding: "18px",
    background: "#F3F4F6",
    borderRadius: "8px",
    border: "1px solid #E6EAF0",
    fontSize: "1.1rem",
  },
  answerTitle: {
    fontWeight: 600,
    marginBottom: "8px",
    color: "#2563EB",
  },
  historyPanel: {
    marginTop: "30px",
    padding: "20px",
    background: "#FAFAFA",
    borderRadius: "8px",
    border: "1px solid #E6EAF0",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  historyTitle: {
    fontWeight: 600,
    color: "#2563EB",
  },
  clearButton: {
    background: "#EF4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontWeight: 600,
    cursor: "pointer",
  },
    historyList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  historyItem: {
    marginBottom: "16px",
    lineHeight: "1.5",
    background: "#fff",
    padding: "12px",
    borderRadius: "6px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
};
export default App;