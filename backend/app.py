import PyPDF2
from flask import Flask, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import json


def create_cards():
    json = ""
    text = ""
    with open("./uploads/file.pdf", "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    cot = '[{"card_name": "Photosynthesis Fact","rarity": "Common","dmg": 2,"puzzle_type": "True_or_False","question": "Photosynthesis occurs in the mitochondria of plant cells.","options": ["True","False"],"correct_answer": "False"},{"card_name": "Basic Addition","rarity": "Common","dmg": 2,"puzzle_type": "Multiple Choice","question": "What is 7 + 5?","options": ["11","12","13","14"],"correct_answer": "12"},{"card_name": "Pythagoras Check","rarity": "Rare","dmg": 3,"puzzle_type": "True_or_False","question": "In a right triangle with legs 3 and 4, the hypotenuse is 5.","options": ["True","False"],"correct_answer": "True"},{"card_name": "Algebra Application","rarity": "Rare","dmg": 3,"puzzle_type": "Multiple Choice","question": "Solve for x: 2x + 3 = 11","options": ["3","4","5","6"],"correct_answer": "4"},{"card_name": "Sorting Strategy","rarity": "Epic","dmg": 4,"puzzle_type": "Multiple Choice","question": "Which sorting algorithm is most efficient on large datasets on average?","options": ["Bubble Sort","Merge Sort","Insertion Sort","Selection Sort"],"correct_answer": "Merge Sort"},{"card_name": "Pointer Precision","rarity": "Epic","dmg": 4,"puzzle_type": "Multiple Choice","question": "Which of the following prevents a pointer from modifying the value it points to?","options": ["int *ptr;","const int *ptr;","int *const ptr;","int const ptr;"],"correct_answer": "const int *ptr;"},{"card_name": "Genetic Translation Test","rarity": "Epic","dmg": 4,"puzzle_type": "Multiple Choice","question": "Which process converts RNA into a sequence of amino acids?","options": ["Transcription","Translation","Replication","Translocation"],"correct_answer": "Translation"},{"card_name": "Cell Division Fact","rarity": "Rare","dmg": 3,"puzzle_type": "True_or_False","question": "Mitosis results in two identical daughter cells.","options": ["True","False"],"correct_answer": "True"}]'
    prompt = "Parsing the TXT, identify topics and create json 10representatives of flashcards for the topic. If the “question” is returning more than 15 words, DO NOT USE THIS, summarize further. Use the above templates as a base for creating flashcards on the TXT. return JSON code in template above."
    full_prompt = (
        "TXT: " + text + "\n" + "TEMPLATE: " + cot + "\n" + "ACTION: " + prompt
    )

    load_dotenv()
    api_key = os.getenv("API_KEY")
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=full_prompt
    )

    return response.text[8 : len(response.text) - 3]


# Initializing flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
UPLOAD_FOLDER = "uploads"  # Directory to save uploaded files
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return "No file part in the request", 400

    file = request.files["file"]
    if file.filename == "":
        return "No selected file", 400

    if file:
        filename = secure_filename("file.pdf")
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    cards = create_cards()
    data = json.loads(cards)

    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)
