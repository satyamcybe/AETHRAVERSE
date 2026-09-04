import os
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="LoopBack Institutional Voice Feedback API",
    description="Backend for Voice Feedback & Action Management System",
    version="2.0.0"
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

_seed_initial()

@app.get("/api/health")
def health():
    return {"status": "healthy", "platform": "LoopBack Voice Institutional Platform v2.0"}

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
