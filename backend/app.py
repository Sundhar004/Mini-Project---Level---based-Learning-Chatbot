import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔑 Gemini setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Use gemini-flash-latest for stability
model = genai.GenerativeModel(
    model_name="gemini-flash-latest",
    system_instruction="You are EduWiz, a friendly and helpful AI learning assistant. Your goal is to explain concepts clearly, summarize text accurately, and provide simple dictionary definitions. Adjust your tone to be encouraging and use clear language based on the requested level (basic, intermediate, advanced). IMPORTANT: Do not use any markdown formatting like hashtags (#) or asterisks (*) in your responses. Provide clean, plain text."
)

def call_gemini(prompt, history=None):
    try:
        # Format history for Python SDK: [{'role': 'user', 'parts': [...]}, {'role': 'model', 'parts': [...]}]
        formatted_history = []
        if history:
            for msg in history:
                role = "model" if msg.get("role") == "assistant" else "user"
                formatted_history.append({"role": role, "parts": [msg.get("content", "")]})
        
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(prompt)
        text = response.text.strip()
        import re
        return re.sub(r'[#*]', '', text)
    except Exception as e:
        print(f"Gemini error: {e}")
        return None

@app.route("/api/process", methods=["POST"])
def process():
    data = request.get_json()
    msg_type = data.get("type", "explain")
    user_input = data.get("input", "")
    level = data.get("level", "intermediate")
    history = data.get("history", [])

    if not user_input.strip():
        return jsonify({"result": "Please enter a question."})

    # Build prompt based on type
    if msg_type == "summarize":
        prompt = f"Summarize this clearly and concisely:\n\n{user_input}"
    elif msg_type == "dictionary":
        prompt = f"Define this word simply:\n\n{user_input}"
    else: # explain
        prompt = f"Explain in an easy-to-understand way (level: {level}):\n\n{user_input}"

    ai_reply = call_gemini(prompt, history)
    reply = ai_reply if ai_reply else "❌ AI could not generate a proper answer. Please try again."

    return jsonify({"result": reply})

@app.route("/api/health")
def health():
    return jsonify({
        "status": "Education Backend (Python) is running ✅",
        "engine": "Gemini Flash"
    })

@app.route("/")
def home():
    return "EduWiz Python Backend is ready."

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, port=port)