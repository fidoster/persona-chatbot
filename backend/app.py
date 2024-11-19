from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import openai
import os
from pymongo.errors import PyMongoError
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])

# MongoDB configuration
def get_db():
    # Fetch the MongoDB URI from the .env file
    MONGODB_URI = os.getenv("MONGODB_URI")
    
    # Initialize the MongoClient
    client = MongoClient(MONGODB_URI)
    
    # Specify the database to use
    return client["edubot"]

# Azure OpenAI Configuration
openai.api_type = os.getenv("OPENAI_API_TYPE")
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE")
openai.api_version = os.getenv("OPENAI_API_VERSION")

@app.route('/')
def index():
    return "Backend is running!"

# Route: Ask a Question
@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get("question")
    system_prompt = data.get("system_prompt", "You are a helpful assistant.")

    if not question:
        return jsonify({"error": "Question is missing"}), 400

    try:
        response = openai.ChatCompletion.create(
            engine="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.7,
            max_tokens=300
        )
        answer = response['choices'][0]['message']['content']

        # Store question/answer in MongoDB
        db = get_db()
        db.history.insert_one({
            "question": question,
            "answer": answer,
            "persona": system_prompt
        })

        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"OpenAI API error: {e}"}), 500

# Route: Fetch Chat History
@app.route('/history', methods=['GET'])
def get_history():
    try:
        db = get_db()
        history = list(db.history.find({}, {"_id": 0}))  # Exclude `_id`
        return jsonify(history), 200
    except PyMongoError as e:
        return jsonify({"error": f"Database error: {e}"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
