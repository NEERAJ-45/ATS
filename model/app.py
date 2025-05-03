from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import os

from ats_system import calculate_resume_score
from ats_system import calculate

from config import DATASET_PATH
from config import RESUME_PATH

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DATASET_PATH'] = DATASET_PATH


os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    score = None
    total = None

    if request.method == 'POST':
        if 'resume' not in request.files:
            return 'No file part', 400

        file = request.files['resume']
        if file.filename == '':
            return 'No selected file', 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        score = calculate_resume_score(filepath, app.config['DATASET_PATH'])
        total = score.get('technical', 0) + score.get('soft', 0)

    return render_template('index.html', score=score, total=total)

@app.route('/score', methods=['POST'])
def get_score():
    print("new request")
    if not request.is_json:
        return {"error": "Content-Type must be application/json"}, 400
    
    data = request.get_json()
    pdf_path = data.get('pdf_path')
    
    if not pdf_path:
        return {"error": "pdf_path is required"}, 400
    
    print(pdf_path)
    if not os.path.exists(pdf_path):
        return {"error": "PDF file not found"}, 404

    try:
        score = calculate(pdf_path)
        
        return {
            "message":"success",
            "score": score
        }
    except Exception as e:
        return {"error": str(e)}, 500


if __name__ == '__main__':
    app.run(debug=True)
