from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import re

app = Flask(__name__)
CORS(app)

# Load model and data
model = joblib.load("chat_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
intents_data = joblib.load("intents_data.pkl")

# Clean input
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    corrections = {
        "helo": "hello", "hii": "hi", "gud": "good", "iam": "i am", "bords": "bored",
        "pls": "please", "plz": "please", "tnx": "thanks", "gr8": "great",
        "gn": "good night", "gm": "good morning", "studnt": "student"
    }
    for wrong, right in corrections.items():
        text = text.replace(wrong, right)
    return text.strip()

# Predict intent
def predict_class(user_input):
    X = vectorizer.transform([user_input])
    return model.predict(X)[0]

# ✅ Fixed: Get response using "intent" key
def get_response(tag):
    for intent in intents_data["intents"]:
        if intent.get("intent") == tag:
            return intent["responses"][0] if intent["responses"] else "Hmm, interesting."
    return "Sorry, I didn't understand that."

# API endpoint
@app.route("/chat", methods=["POST"])
def chat():
    raw_input = request.json.get("message", "")
    user_input = clean_text(raw_input)

    tag = predict_class(user_input)
    response = get_response(tag)

    return jsonify({"reply": response})

if __name__ == "__main__":
    app.run(debug=True)
