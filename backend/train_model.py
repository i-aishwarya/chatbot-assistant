import json
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Load intents.json
try:
    with open("intents.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    print("✅ intents.json loaded successfully!")
except Exception as e:
    print("❌ Failed to load intents.json:", e)
    exit()

patterns = []
tags = []

# Extract patterns and intent tags from Kaggle-style format
for intent in data["intents"]:
    intent_tag = intent["intent"]
    for pattern in intent["text"]:
        pattern = pattern.strip()
        if pattern:
            patterns.append(pattern)
            tags.append(intent_tag)

print("📦 Total patterns:", len(patterns))
print("🔖 Unique tags:", len(set(tags)))

# Vectorize text
try:
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(patterns)
except ValueError as ve:
    print("❌ Vectorization failed:", ve)
    exit()

# Train model
model = MultinomialNB()
model.fit(X, tags)

# Save everything
joblib.dump(model, "chat_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(data, "intents_data.pkl")

print("✅ Model trained and saved!")
