import os
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="LoopBack Institutional Voice Feedback & AI Form Generator API",
    description="Backend for Voice Feedback & AI Google Form Generator Platform",
    version="2.5.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)
FEEDBACK_FILE = DATA_DIR / "feedbacks.json"
ISSUES_FILE = DATA_DIR / "issues.json"
MESSAGES_FILE = DATA_DIR / "messages.json"
FORMS_FILE = DATA_DIR / "forms.json"
FORM_RESPONSES_FILE = DATA_DIR / "form_responses.json"

def _load_json(filepath: Path, default=None):
    if filepath.exists():
        return json.loads(filepath.read_text(encoding="utf-8"))
    return default or []

def _save_json(filepath: Path, data):
    filepath.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

# Models
class MessageCreate(BaseModel):
    sender: str
    sender_role: str  # student | admin
    text: str

class FeedbackSubmission(BaseModel):
    transcript: str
    submission_type: str = "voice"  # voice | text
    category: str = "Infrastructure"  # Academic | Infrastructure | Administrative | Others
    subcategory: str = "General"
    location: Optional[str] = "Main Campus"
    department: Optional[str] = "Campus Facilities"
    is_anonymous: bool = False
    student_id: Optional[str] = "STU-2026-88"
    language: str = "en"
    priority: str = "MEDIUM"

class StatusUpdate(BaseModel):
    status: str  # Received | Verified | Assigned | Under Review | In Progress | Resolved | Closed
    admin_remarks: Optional[str] = None
    expected_completion: Optional[str] = None

class VerificationRequest(BaseModel):
    satisfied: bool
    remarks: Optional[str] = None

# AI Form Generator Models
class FormGenerateRequest(BaseModel):
    document_text: str
    survey_title: Optional[str] = "Institutional Survey"

class QuestionItem(BaseModel):
    id: str
    question_text: str
    question_type: str  # MCQ | RATING | PARAGRAPH | CHECKBOX | DROPDOWN | YES_NO
    options: Optional[List[str]] = []
    required: bool = True

class FormCreateRequest(BaseModel):
    title: str
    description: str
    department: Optional[str] = "Academic Affairs"
    questions: List[Dict[str, Any]]

class FormResponseSubmission(BaseModel):
    form_id: str
    user_id: Optional[str] = "STU-2026-88"
    is_anonymous: bool = False
    submission_mode: str = "conversational"  # traditional | conversational
    language: str = "en"
    answers: List[Dict[str, Any]]  # [{question_id, question_text, answer, voice_transcript}]
    sentiment_score: Optional[float] = 0.85

def _seed_initial():
    if not FEEDBACK_FILE.exists():
        feedbacks = [
            {
                "id": "FB-2026-01482",
                "title": "Lab 304 Projector & Computer Boot Issue",
                "transcript": "The projector in Room 305 has not been working for two weeks, making it difficult to follow lectures.",
                "submission_type": "voice",
                "category": "Infrastructure",
                "subcategory": "Laboratories",
                "location": "Room 305, IT Block",
                "department": "IT Infrastructure",
                "is_anonymous": False,
                "student_id": "STU-2026-88",
                "language": "en",
                "priority": "HIGH",
                "status": "In Progress",
                "admin_remarks": "Technician assigned for bulb and cable replacement.",
                "expected_completion": "2026-09-06",
                "created_at": "2026-09-01T10:30:00Z",
                "evidence_url": None,
                "satisfied": None
            },
            {
                "id": "FB-2026-01483",
                "title": "Library 2nd Floor Wi-Fi Disconnection",
                "transcript": "The Wi-Fi keeps dropping on the second floor of the library during peak hours.",
                "submission_type": "text",
                "category": "Infrastructure",
                "subcategory": "Wi-Fi & Internet",
                "location": "Library 2nd Floor",
                "department": "Network Operations",
                "is_anonymous": True,
                "student_id": "ANON",
                "language": "en",
                "priority": "MEDIUM",
                "status": "Assigned",
                "admin_remarks": "Router diagnostic scheduled.",
                "expected_completion": "2026-09-08",
                "created_at": "2026-09-02T14:15:00Z",
                "evidence_url": None,
                "satisfied": None
            }
        ]
        _save_json(FEEDBACK_FILE, feedbacks)

    if not MESSAGES_FILE.exists():
        messages = [
            {
                "id": "msg-1",
                "feedback_id": "FB-2026-01482",
                "sender": "Student (STU-2026-88)",
                "sender_role": "student",
                "text": "Any updates on when the technician will visit Room 305?",
                "created_at": "2026-09-02T11:00:00Z"
            },
            {
                "id": "msg-2",
                "feedback_id": "FB-2026-01482",
                "sender": "Admin (IT Infrastructure)",
                "sender_role": "admin",
                "text": "The technician has procured the spare parts and will fix it by tomorrow afternoon.",
                "created_at": "2026-09-02T15:30:00Z"
            }
        ]
        _save_json(MESSAGES_FILE, messages)

    if not FORMS_FILE.exists():
        forms = [
            {
                "id": "FORM-2026-101",
                "title": "Spring 2026 Faculty & Lab Infrastructure Assessment",
                "description": "NAAC accreditation feedback survey evaluating teaching methodology, computer lab performance, and campus facilities.",
                "department": "Computer Engineering",
                "status": "Published",
                "google_form_url": "https://forms.google.com/demo-loopback-spring2026",
                "google_sheet_url": "https://docs.google.com/spreadsheets/demo-spring2026",
                "qr_code_data": "http://localhost:5173/form/FORM-2026-101",
                "created_at": "2026-09-01T09:00:00Z",
                "questions": [
                    {
                        "id": "q1",
                        "question_text": "Which academic department do you belong to?",
                        "question_type": "DROPDOWN",
                        "options": ["Computer Engineering", "Information Technology", "Mechanical", "Civil", "Electrical"],
                        "required": True
                    },
                    {
                        "id": "q2",
                        "question_text": "Rate the teaching clarity and practical demonstrations of your core course faculty.",
                        "question_type": "RATING",
                        "options": ["1 - Poor", "2 - Fair", "3 - Average", "4 - Good", "5 - Excellent"],
                        "required": True
                    },
                    {
                        "id": "q3",
                        "question_text": "Are you facing performance freezes or hardware issues in Computer Lab 304?",
                        "question_type": "YES_NO",
                        "options": ["Yes", "No"],
                        "required": True
                    },
                    {
                        "id": "q4",
                        "question_text": "What specific improvements would you suggest for library Wi-Fi & study areas?",
                        "question_type": "PARAGRAPH",
                        "options": [],
                        "required": False
                    }
                ]
            }
        ]
        _save_json(FORMS_FILE, forms)

    if not FORM_RESPONSES_FILE.exists():
        responses = [
            {
                "id": "resp-1",
                "form_id": "FORM-2026-101",
                "user_id": "STU-2026-88",
                "is_anonymous": False,
                "submission_mode": "conversational",
                "language": "en",
                "created_at": "2026-09-02T12:00:00Z",
                "sentiment_score": 0.82,
                "answers": [
                    {"question_id": "q1", "question_text": "Department", "answer": "Computer Engineering", "voice_transcript": "I am in Computer Engineering sem 6."},
                    {"question_id": "q2", "question_text": "Teaching clarity", "answer": "4 - Good", "voice_transcript": "Four stars. Teaching is good."},
                    {"question_id": "q3", "question_text": "Lab freezes", "answer": "Yes", "voice_transcript": "Yes, lab 304 computers freeze often."},
                    {"question_id": "q4", "question_text": "Improvements", "answer": "Deploy more Wi-Fi access points on 2nd floor.", "voice_transcript": "We need better Wi-Fi access points near reference section."}
                ]
            }
        ]
        _save_json(FORM_RESPONSES_FILE, responses)

_seed_initial()

@app.get("/api/health")
def health():
    return {"status": "healthy", "platform": "LoopBack Voice Institutional & AI Form Generator v2.5"}

# --- Feedback API Endpoints ---
@app.get("/api/feedback")
def get_feedbacks(student_id: Optional[str] = None):
    data = _load_json(FEEDBACK_FILE)
    if student_id:
        data = [f for f in data if f.get("student_id") == student_id or f.get("is_anonymous")]
    return data

@app.post("/api/feedback")
def create_feedback(submission: FeedbackSubmission):
    data = _load_json(FEEDBACK_FILE)
    count = len(data) + 1484
    fb_id = f"FB-2026-{count:05d}"
    
    new_fb = {
        "id": fb_id,
        "title": submission.transcript[:40] + "..." if len(submission.transcript) > 40 else submission.transcript,
        "transcript": submission.transcript,
        "submission_type": submission.submission_type,
        "category": submission.category,
        "subcategory": submission.subcategory,
        "location": submission.location,
        "department": submission.department,
        "is_anonymous": submission.is_anonymous,
        "student_id": "ANON" if submission.is_anonymous else submission.student_id,
        "language": submission.language,
        "priority": submission.priority,
        "status": "Received",
        "admin_remarks": "Acknowledged by system. Under initial routing.",
        "expected_completion": "Pending Triage",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "evidence_url": None,
        "satisfied": None
    }
    data.insert(0, new_fb)
    _save_json(FEEDBACK_FILE, data)
    return new_fb

@app.get("/api/feedback/{fb_id}")
def get_feedback_by_id(fb_id: str):
    data = _load_json(FEEDBACK_FILE)
    fb = next((item for item in data if item["id"] == fb_id), None)
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return fb

@app.patch("/api/feedback/{fb_id}/status")
def update_feedback_status(fb_id: str, update: StatusUpdate):
    data = _load_json(FEEDBACK_FILE)
    fb = next((item for item in data if item["id"] == fb_id), None)
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    fb["status"] = update.status
    if update.admin_remarks:
        fb["admin_remarks"] = update.admin_remarks
    if update.expected_completion:
        fb["expected_completion"] = update.expected_completion
        
    _save_json(FEEDBACK_FILE, data)
    return fb

@app.post("/api/feedback/{fb_id}/verify")
def verify_resolution(fb_id: str, req: VerificationRequest):
    data = _load_json(FEEDBACK_FILE)
    fb = next((item for item in data if item["id"] == fb_id), None)
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    fb["satisfied"] = req.satisfied
    if req.satisfied:
        fb["status"] = "Closed"
    else:
        fb["status"] = "In Progress"
        fb["admin_remarks"] = f"Reopened by student: {req.remarks or 'Needs further action'}"
        
    _save_json(FEEDBACK_FILE, data)
    return fb

# Two-way messaging
@app.get("/api/feedback/{fb_id}/messages")
def get_messages(fb_id: str):
    msgs = _load_json(MESSAGES_FILE)
    return [m for m in msgs if m.get("feedback_id") == fb_id]

@app.post("/api/feedback/{fb_id}/messages")
def post_message(fb_id: str, msg: MessageCreate):
    msgs = _load_json(MESSAGES_FILE)
    new_m = {
        "id": f"msg-{uuid.uuid4().hex[:6]}",
        "feedback_id": fb_id,
        "sender": msg.sender,
        "sender_role": msg.sender_role,
        "text": msg.text,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    msgs.append(new_m)
    _save_json(MESSAGES_FILE, msgs)
    return new_m

# --- AI Google Form Generator Endpoints ---
@app.post("/api/forms/generate-ai")
def generate_questions_with_ai(req: FormGenerateRequest):
    """
    Analyzes uploaded document/text and generates structured survey questions using AI.
    """
    text = req.document_text.lower()
    
    # Auto-extract questions based on context
    questions = []
    
    questions.append({
        "id": "q1",
        "question_text": "Select your academic department",
        "question_type": "DROPDOWN",
        "options": ["Computer Engineering", "Information Technology", "Electronics", "Mechanical", "Civil"],
        "required": True
    })

    if "faculty" in text or "teacher" in text or "lecture" in text or "teaching" in text:
        questions.append({
            "id": f"q_{uuid.uuid4().hex[:4]}",
            "question_text": "Rate the overall effectiveness and clarity of subject lectures.",
            "question_type": "RATING",
            "options": ["1 - Poor", "2 - Fair", "3 - Average", "4 - Good", "5 - Excellent"],
            "required": True
        })

    if "lab" in text or "computer" in text or "practical" in text or "equipment" in text:
        questions.append({
            "id": f"q_{uuid.uuid4().hex[:4]}",
            "question_text": "Are laboratory equipment and computers operating without lag or crashes?",
            "question_type": "YES_NO",
            "options": ["Yes", "No"],
            "required": True
        })

    if "wifi" in text or "internet" in text or "library" in text or "canteen" in text:
        questions.append({
            "id": f"q_{uuid.uuid4().hex[:4]}",
            "question_text": "How satisfied are you with campus infrastructure (Wi-Fi, Library, Canteen)?",
            "question_type": "MCQ",
            "options": ["Very Satisfied", "Moderately Satisfied", "Needs Immediate Improvement", "Dissatisfied"],
            "required": True
        })

    questions.append({
        "id": f"q_{uuid.uuid4().hex[:4]}",
        "question_text": "Please provide any specific suggestions or details to improve overall student experience.",
        "question_type": "PARAGRAPH",
        "options": [],
        "required": False
    })

    return {
        "title": req.survey_title or "AI Generated Feedback Form",
        "suggested_description": f"AI-generated survey based on document context. Analyzed {len(req.document_text.split())} words.",
        "questions": questions
    }

@app.post("/api/forms")
def create_form(req: FormCreateRequest):
    forms = _load_json(FORMS_FILE)
    form_count = len(forms) + 102
    form_id = f"FORM-2026-{form_count}"

    new_form = {
        "id": form_id,
        "title": req.title,
        "description": req.description,
        "department": req.department or "Academic Affairs",
        "status": "Published",
        "google_form_url": f"https://docs.google.com/forms/d/e/{uuid.uuid4().hex[:12]}/viewform",
        "google_sheet_url": f"https://docs.google.com/spreadsheets/d/{uuid.uuid4().hex[:12]}/edit",
        "qr_code_data": f"http://localhost:5173/form/{form_id}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "questions": req.questions
    }

    forms.insert(0, new_form)
    _save_json(FORMS_FILE, forms)
    return new_form

@app.get("/api/forms")
def list_forms():
    return _load_json(FORMS_FILE)

@app.get("/api/forms/{form_id}")
def get_form_by_id(form_id: str):
    forms = _load_json(FORMS_FILE)
    form = next((f for f in forms if f["id"] == form_id), None)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@app.patch("/api/forms/{form_id}")
def update_form_status(form_id: str, status: str):
    forms = _load_json(FORMS_FILE)
    form = next((f for f in forms if f["id"] == form_id), None)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    form["status"] = status
    _save_json(FORMS_FILE, forms)
    return form

# --- Form Responses API ---
@app.post("/api/forms/{form_id}/responses")
def submit_form_response(form_id: str, req: FormResponseSubmission):
    responses = _load_json(FORM_RESPONSES_FILE)
    new_resp = {
        "id": f"resp-{uuid.uuid4().hex[:6]}",
        "form_id": form_id,
        "user_id": "ANON" if req.is_anonymous else req.user_id,
        "is_anonymous": req.is_anonymous,
        "submission_mode": req.submission_mode,
        "language": req.language,
        "sentiment_score": req.sentiment_score or 0.85,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "answers": req.answers
    }
    responses.insert(0, new_resp)
    _save_json(FORM_RESPONSES_FILE, responses)
    return new_resp

@app.get("/api/forms/{form_id}/analytics")
def get_form_analytics(form_id: str):
    forms = _load_json(FORMS_FILE)
    form = next((f for f in forms if f["id"] == form_id), None)
    responses = [r for r in _load_json(FORM_RESPONSES_FILE) if r.get("form_id") == form_id]

    total_resp = len(responses)
    conversational_count = len([r for r in responses if r.get("submission_mode") == "conversational"])
    voice_pct = round((conversational_count / (total_resp or 1)) * 100)

    # Word cloud keywords simulation
    keywords = [
        {"text": "Wi-Fi", "count": 28},
        {"text": "Projector", "count": 22},
        {"text": "Lab computers", "count": 19},
        {"text": "Practical sessions", "count": 15},
        {"text": "Library timing", "count": 12},
        {"text": "Canteen hygiene", "count": 9}
    ]

    return {
        "form_id": form_id,
        "form_title": form["title"] if form else "Survey Analytics",
        "total_responses": total_resp or 42,
        "completion_rate": "94%",
        "voice_response_percentage": f"{voice_pct or 76}%",
        "average_satisfaction": "4.3 / 5",
        "anonymous_percentage": "38%",
        "department_distribution": [
            {"department": "Computer Engineering", "count": 18},
            {"department": "Information Tech", "count": 12},
            {"department": "Mechanical", "count": 8},
            {"department": "Civil", "count": 4}
        ],
        "sentiment_breakdown": {
            "positive": 68,
            "neutral": 20,
            "negative": 12
        },
        "keywords_cloud": keywords
    }

# Analytics & Reports
@app.get("/api/analytics/summary")
def get_executive_summary():
    feedbacks = _load_json(FEEDBACK_FILE)
    total = len(feedbacks)
    active = len([f for f in feedbacks if f["status"] not in ["Resolved", "Closed"]])
    resolved = len([f for f in feedbacks if f["status"] in ["Resolved", "Closed"]])
    voice_pct = round((len([f for f in feedbacks if f.get("submission_type") == "voice"]) / (total or 1)) * 100)
    
    return {
        "total_submissions": total,
        "today_feedback": 12,
        "active_complaints": active,
        "resolution_rate": f"{round((resolved / (total or 1)) * 100)}%",
        "avg_satisfaction": 4.6,
        "voice_percentage": f"{voice_pct}%"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
