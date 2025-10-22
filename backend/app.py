import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODEL = "gpt-3.5-turbo"  # or "gpt-4" if you have access

def call_openai(prompt):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": OPENAI_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    response = requests.post(OPENAI_URL, headers=headers, json=payload)
    if response.ok:
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    return None

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_message = data.get("message", "")

    if user_message.strip() == "":
        reply = "Please enter a question."
    else:
        ai_reply = call_openai(f"Explain: {user_message}")
        reply = ai_reply if ai_reply else "❌ AI could not generate a proper answer. Please try again."

    return jsonify({"reply": reply})

@app.route("/")
def home():
    return "Backend is running! Use /ask with POST to interact."

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)