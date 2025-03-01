import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
from fastapi import FastAPI, Form, Request, UploadFile, File, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import Optional, List, Dict
from google.generativeai import configure, GenerativeModel
from PyPDF2 import PdfReader
import logging
import re
import os
from dotenv import load_dotenv
import uvicorn
import time
import threading
# from src.utils.firebase_config import verify_token
from src.utils.user_profile import save_user_data
from models.user import create_user, get_user_by_google_id
from src.utils.database import initialize_db
from src.routes import auth, questions
from fastapi.middleware.cors import CORSMiddleware
import sqlite3


logging.basicConfig(level=logging.INFO)
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initializing the gemini API
configure(api_key="AIzaSyBMZzk2Z7li96wEQBvVoOh_hl2uLbq9q0E")
model = GenerativeModel("gemini-2.0-flash")

# API ka rate limit
MAX_RPM = 15  # Max requests per minute
MAX_RPD = 1500  # Max requests per day
MAX_TPM = 1_000_000  # Max tokens per minute

#tracking the API use
request_count_minute = 0
request_count_day = 0
token_count_minute = 0
lock = threading.Lock()  

def reset_minute_count():
    global request_count_minute, token_count_minute
    while True:
        time.sleep(60)
        with lock:
            request_count_minute = 0
            token_count_minute = 0

def reset_daily_count():
    global request_count_day
    while True:
        time.sleep(24 * 60 * 60)
        with lock:
            request_count_day = 0

# counter starting
threading.Thread(target=reset_minute_count, daemon=True).start()
threading.Thread(target=reset_daily_count, daemon=True).start()

# Api ke rate limit ke saath call
def call_gemini_api(input_data, model):
    global request_count_minute, request_count_day, token_count_minute

    # Estimate tokens 
    estimated_tokens = len(input_data.split()) * 2  # output size ke liye

    with lock:
        if request_count_minute >= MAX_RPM:
            print("Rate limit reached: Waiting for 1 minute.")
            time.sleep(60)  #1 minute ka wait
        if request_count_day >= MAX_RPD:
            raise Exception("Daily rate limit reached.")
        if token_count_minute + estimated_tokens > MAX_TPM:
            print("Token limit reached: Waiting for 1 minute.")
            time.sleep(60) #1 minute ka wait

        # Update counters
        request_count_minute += 1
        request_count_day += 1
        token_count_minute += estimated_tokens
        
    try:
        response = model.generate_content(input_data)
        return response
    except Exception as e:
        print(f"API Error: {e}")
        return None


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Utility to verify the current user
def get_current_user(request: Request):
    # token = request.cookies.get("token")
    # if token:
    #     user = verify_token(token)
    #     if user:
    #         return user
    # return None
    pass

@app.post("/summarize-pdf")
async def summarize_pdf(pdfFile: UploadFile = File(...)):
    try:
        pdf_reader = PdfReader(pdfFile.file)
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text()
            
        extracted_text = re.sub(r'\s+', ' ', extracted_text.strip())
        prompt = (
            "Summarize the following content in a concise and clear manner: "
            + extracted_text
        )
        summary = model.generate_content(prompt)
        return JSONResponse(content={"summary": summary.text}, status_code=200)
    except Exception as e:
        print("Error:", e)
        return JSONResponse(content={"error": "Failed to summarize the PDF"}, status_code=500)
    
@app.post("/askQuestion") 
async def ask_question(
    pdf_file: UploadFile = File(...),
    question: str = Form(...),
    word_limit: int = Form(...),
):
    try:
        temp_dir = "uploads"
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, pdf_file.filename)
        with open(file_path, "wb") as f:
            f.write(await pdf_file.read())

        pdf_reader = PdfReader(file_path)
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text()

        extracted_text = re.sub(r'\s+', ' ', extracted_text.strip())
        if not extracted_text:
            raise logging.error(f"Failed to extract text from the PDF.")
        
        try:
            response = call_gemini_api(f"""Give the answer of question {question} by analyzing the {extracted_text}.
                                       Limit the answer to {word_limit} words.""", model)
            answer = response.text.strip()
        except Exception as e:
            raise logging.error(f"Failed to generate an answer: {e}")

        os.remove(file_path)

        return {"answer": answer}

    except Exception as e:
        return {"error": str(e)}

    except Exception as e:
        logging.error(f"Error answering question: {e}")
        return JSONResponse(content={"error": "Error processing the question."}, status_code=500)

@app.post("/analyze")
async def analyze(
    pdf_file: UploadFile = File(...),
    topic: str = Form(...),
    difficulty: str = Form(...),
    question_type: str = Form(...),
    total_marks: int = Form(...),
    marks_per_question: Optional[int] = Form(None),
):
    try:
        #check if file uploaded
        if not pdf_file:
            return {"error": "No file uploaded."}

        temp_dir = "uploads"
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, pdf_file.filename)
        with open(file_path, "wb") as f:
            f.write(await pdf_file.read())

        pdf_reader = PdfReader(file_path)
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text()

        extracted_text = re.sub(r'\s+', ' ', extracted_text.strip())

        #calling API
        topic_text_response = call_gemini_api(
            f"Extract the text related to '{topic}' from the following content: {extracted_text}", 
            model
        )
        
        if not topic_text_response or not hasattr(topic_text_response, "text") or not topic_text_response.text.strip():
            return {"error": "Failed to extract topic-related content using the Gemini model."}

        topic_text = topic_text_response.text.strip()

        questions = []

        if question_type.lower() == "mcq":
            num_questions = total_marks // (marks_per_question or 1)

            for i in range(num_questions):
                try:
                    question_response = call_gemini_api(
                        f"""
                        Generate a {marks_per_question}-mark multiple-choice question on the topic '{topic}' at '{difficulty}' difficulty level.
                        Provide 4 answer options, one of which is correct. Clearly indicate the correct answer. make sure the options of the contain
                        one correct option out of 4 option. Also the question generated must be different from previous ones.
                        Base it on the following content:\n\n{topic_text}.
                        """,
                        model
                    )


                    question_response_text = question_response.text.strip()
                    question_lines = question_response_text.split('\n')
                    
                    correct_option = call_gemini_api(f"extract line which contain correct word from {question_lines}", model)
                    # check whether question structure is right or wrong
                    if len(question_lines) < 5:
                        logging.warning(f"Insufficient lines in question response: {question_response_text}")
                        continue

                    question = question_lines[0]
                    options = question_lines[1:5]  # Expecting exactly 4 options
                    correct_answer_lines = correct_option.text.strip()
                    
                    correct_answer = correct_answer_lines[0]

                    # Add the question to the list
                    questions.append({
                        "question": question_response.text.strip(),
                        "marks": marks_per_question 
                    })
                except Exception as e:
                    logging.error(f"Error generating MCQ: {e}")
                    continue

            # use the web search if it is needed
            while len(questions) < num_questions:
                try:
                    web_question_response = call_gemini_api(
                        f"""
                        Search the web for content on the topic '{topic}' at '{difficulty}' difficulty level.
                        Generate a {marks_per_question}-mark multiple-choice question. 
                        Provide 4 answer options, one of which is correct. Clearly indicate the correct answer.
                        make sure the options of the question must contain one correct option out of 4 option
                        also the question generated must be different from the previous ones.
                        """,
                        model
                    )

                    if not web_question_response or not hasattr(web_question_response, "text") or not web_question_response.text.strip():
                        logging.warning("Failed to generate MCQ via web search.")
                        break

                    web_question_response_text = web_question_response.text.strip()
                    question_lines = web_question_response_text.split('\n')
                    correct_option = call_gemini_api(f"extract line which contain correct word from {question_lines}", model)
                    # check the question structure
                    if len(question_lines) < 5:
                        logging.warning(f"Insufficient lines in web question response: {web_question_response_text}")
                        continue

                    question = question_lines[0]
                    options = question_lines[1:5]
                    correct_answer_lines = correct_option.text.strip()
                    correct_answer = correct_answer_lines[0]

                    questions.append({
                        "question": web_question_response.text.strip(),
                        "marks": marks_per_question
                    })
                except Exception as e:
                    logging.error(f"Error generating fallback MCQ: {e}")
                    break

        elif question_type.lower() == "theory":
            marks_distribution = [
                 (4, 150),  # 4-mark questions, 150 words
                 (8, 250),  # 8-mark questions, 250 words
                 (2, 60),    # 2-mark questions, 60 words
                 (1, 30),    # 2-mark questions, 60 words
            ]
            remaining_marks = total_marks
            for marks, word_limit in marks_distribution:
                num_questions = remaining_marks // marks
                remaining_marks -= num_questions * marks

                for _ in range(num_questions):
                    try:
                        response = call_gemini_api(f"""
                            Generate a theory question worth {marks} marks with a word limit of {word_limit} words.
                            Topic: {topic}, Difficulty: {difficulty} and don't generate the marking scheme, also make 
                            sure the question is different from previous one. ALso make the generated question concise.
                        """, model)
                        if response and response.text.strip():
                            questions.append({
                                "question": response.text.strip(),
                                "marks": marks,
                                "word_limit": word_limit
                            })
                    except Exception as e:
                        logging.warning(f"Error generating theory question: {e}")

        os.remove(file_path)
        return {"questions": questions}

    except Exception as e:
        logging.error(f"Error during analysis: {e}")
        return {"error": str(e)}

# Define request model
class MockTestRequest(BaseModel):
    exam: str
    difficulty: str
    negative_marking: bool

# Define response model
class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correctAnswer: int


@app.post("/generate_mock_test")
async def generate_mock_test(request: MockTestRequest):
    """API Endpoint to generate mock test questions using Gemini AI"""
    try:
        if not request.exam or not request.difficulty:
            raise HTTPException(status_code=400, detail="Missing required fields in request.")

        prompt = f"""
        Generate 10 multiple-choice questions for the {request.exam} exam with {request.difficulty} difficulty.
        Each question should have 4 options (A, B, C, D), and only one correct answer.
        Consider the negative marking scheme: {request.negative_marking}.
        
        Return output in this format (do NOT include JSON format tags in the response):

        Question: What is AI?
        A) Artificial Intelligence
        B) Automated Integration
        C) Advanced Internet
        D) Autonomous Input
        Correct Answer: A
        """

        # Call Gemini AI
        response = call_gemini_api(prompt, model)
        response_text = response.text.strip()

        print(f"AI Response:\n{response_text}")

        # Regex pattern to extract question blocks
        question_blocks = re.split(r"\n\s*\n", response_text)  # Splitting by blank lines

        questions = []
        for block in question_blocks:
            lines = block.split("\n")
            if len(lines) < 6:
                logging.warning(f"Skipping invalid question block: {block}")
                continue

            try:
                question_text = lines[0].replace("Question:", "").strip()
                options = []
                for i in range(1, 5):
                    parts = lines[i].split(") ", 1)
                    if len(parts) == 2:
                        options.append(parts[1].strip())
                else:
                    logging.warning(f"Skipping malformed option in block: {block}")
                    continue
                
                correct_answer_letter = lines[5].replace("Correct Answer:", "").strip()
                correct_answer_index = {"A": 0, "B": 1, "C": 2, "D": 3}.get(correct_answer_letter)

                if correct_answer_index is None:
                    logging.warning(f"Skipping question due to invalid correct answer: {block}")
                    continue

                questions.append({
                    "question": question_text,
                    "options": options,  # Now stored as a list
                    "correctAnswer": correct_answer_index,  # Now stored as an index
                    "negativeMarking": request.negative_marking,
                })

            except Exception as parse_error:
                logging.warning(f"Error parsing question block: {block}. Error: {parse_error}")
                continue

        if not questions:
            raise ValueError("No valid questions generated.")

        return {"questions": questions}

    except Exception as e:
        logging.error(f"Error generating mock test: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate mock test.")

if __name__ == "__main__":
    # init_db()
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
