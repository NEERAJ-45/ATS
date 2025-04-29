from flask import Flask, request, jsonify
import fitz  # PyMuPDF
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

KEYWORDS = ["react", "node", "express", "mongodb", "javascript", "html", "css", "C","api", "git", "github"]

def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text.lower()

@app.route('/score', methods=['POST'])
def score_resume():
    file = request.files['resume']
    path = f"uploads/{file.filename}"
    file.save(path)
    
    text = extract_text_from_pdf(path)
    score = sum(1 for keyword in KEYWORDS if keyword in text)
    final_score = int((score / len(KEYWORDS)) * 100)

    return jsonify({'score': final_score})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
