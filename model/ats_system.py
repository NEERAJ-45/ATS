import pandas as pd
import pdfplumber
import re

from config import DATASET_PATH
from config import RESUME_PATH

df = pd.read_excel(DATASET_PATH)

columns_to_drop = [
    'year', 'email_id', 'current course', 'challenges ', 'support required',
    'method', 'unnamed: 13', ' Projects', 'Career Interest', 'Challenges ',
    'Support required', 'Unnamed: 13', ' Method'
]
df.drop(columns=columns_to_drop, inplace=True, errors='ignore')

df.fillna(method='ffill', inplace=True)

print(df.columns)

def extract_unique_skills(df):
    def split_and_clean(column):
        skills = []
        for entry in df[column].dropna():
            skills += [skill.strip().lower() for skill in str(entry).split(',')]
        return set(skills)

    tech_skills = split_and_clean('Technical Skills')
    prog_langs = split_and_clean('     Programming Languages')  
    soft_skills = split_and_clean('Soft Skills')

    return tech_skills.union(prog_langs), soft_skills

technical_skills, soft_skills = extract_unique_skills(df)

def extract_text_from_pdf(pdf_path):
    text = ''
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + ' '
    return text.lower()

def calculate(resume_path):
    resume_text = extract_text_from_pdf(resume_path)
    score = calculate_resume_score(resume_text, technical_skills, soft_skills)
    # return technical score + softskills score
    return round(score['technical'] + score['soft'], 2)


def calculate_resume_score(resume_text, tech_skills, soft_skills):
    text = re.sub(r'[^a-zA-Z\s]', '', resume_text.lower())
    
    # Calculate raw scores
    technical_score = sum(1 for skill in tech_skills if skill in text)
    soft_score = sum(1 for skill in soft_skills if skill in text)
    
    # Normalize scores to a scale of 100
    max_technical_score = len(tech_skills)
    max_soft_score = len(soft_skills)
    
    score = {
        'technical': (technical_score / max_technical_score) * 100 if max_technical_score > 0 else 0,
        'soft': (soft_score / max_soft_score) * 100 if max_soft_score > 0 else 0
    }
    return score

resume_pdf_path = RESUME_PATH

resume_text = extract_text_from_pdf(resume_pdf_path)
score = calculate_resume_score(resume_text, technical_skills, soft_skills)


print("\nResume Analysis Score:")
print(f"Technical Skills Matched: {score['technical']}")
print(f"Soft Skills Matched: {score['soft']}")
print(f"Total Score: {score['technical'] + score['soft']}")
