from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import openai
import os
from werkzeug.utils import secure_filename
import PyPDF2
from pymongo.errors import PyMongoError
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

# Flask app setup
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# MongoDB configuration
def get_db():
    # Fetch the MongoDB URI from the .env file
    MONGODB_URI = os.getenv("MONGODB_URI")
    
    # Initialize the MongoClient
    client = MongoClient(MONGODB_URI)
    
    # Specify the database to use
    return client["edubot"]
# Azure OpenAI Configuration
openai.api_type = "azure"
openai.api_key = "3sTRPbHgK5gGUNWgWf7ixVwNvYHdF2eFYkww76yargG21AZXEBWlJQQJ99AKAC5RqLJXJ3w3AAABACOG6CLP"
openai.api_base = "https://myai-chatbot.openai.azure.com/"
openai.api_version = "2023-05-15"  # Use the correct API version

# Extract text from uploaded PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, "rb") as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

# Route: Upload PDF
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file_path)

    if not extracted_text.strip():
        os.remove(file_path)  # Clean up the uploaded file if extraction fails
        return jsonify({"error": "Failed to extract text from the PDF"}), 400

    # Store context in MongoDB
    db = get_db()
    result = db.contexts.insert_one({"content": extracted_text, "filename": filename})
    context_id = str(result.inserted_id)

    os.remove(file_path)  # Clean up the uploaded file
    return jsonify({"message": "File uploaded successfully", "context_id": context_id})

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
    app.run(debug=True)