"""
LoopBack Backend — FastAPI Server
Conversational Feedback Intelligence & Resolution Platform

Endpoints:
  POST /api/feedback          — Submit new voice feedback
  GET  /api/feedback          — List all feedback
  GET  /api/feedback/{id}     — Get single feedback
  POST /api/feedback/{id}/verify — User verifies resolution

  GET  /api/issues            — List clustered issues
  GET  /api/issues/{id}       — Get issue detail
  PATCH /api/issues/{id}/status — Update issue status
  PATCH /api/issues/{id}/assign — Assign issue to department

  GET  /api/analytics/pulse   — Overall experience pulse
  GET  /api/analytics/trending — Trending issues

  GET  /api/health            — Health check
"""

import os
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(
    title="LoopBack API",
    description="Conversational Feedback Intelligence & Resolution Platform",
    version="1.0.0"
)

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory data store (JSON persistence for demo) ──
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)
FEEDBACK_FILE = DATA_DIR / "feedbacks.json"
ISSUES_FILE = DATA_DIR / "issues.json"


def _load_json(filepath: Path, default=None):
    if filepath.exists():
        return json.loads(filepath.read_text(encoding="utf-8"))
    return default or []


def _save_json(filepath: Path, data):
    filepath.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")


# ── Pydantic Models ──

class FeedbackSubmission(BaseModel):
    transcript: str
    issue: Optional[str] = None
    location: Optional[str] = None
    frequency: Optional[str] = None
    impact: Optional[str] = "Medium"
    sentiment: Optional[str] = "Neutral"

class StatusUpdate(BaseModel):
    status: str  # UNDER REVIEW | ASSIGNED | IN PROGRESS | RESOLVED | CLOSED | REOPENED

class AssignmentUpdate(BaseModel):
    department: str
    assignee: Optional[str] = None

class VerificationRequest(BaseModel):
    resolved: bool


# ── Seed Data ──

def _seed_data():
    """Initialize with demo data if stores are empty."""
    feedbacks = _load_json(FEEDBACK_FILE)
    issues = _load_json(ISSUES_FILE)

    if not feedbacks:
        feedbacks = [
            {
                "id": "fb-001",
                "title": "Lab 304 Computer Performance",
                "transcript": "The computers in Lab 304 are really slow and it becomes difficult to complete our practicals on time.",
                "issue": "Slow computers",
                "location": "Lab 304",
                "frequency": "Almost every time",
                "impact": "High",
                "sentiment": "Negative",
                "status": "IN PROGRESS",
                "department": "IT Infrastructure",
                "issueId": "issue-001",
                "timestamp": "2026-09-01T10:30:00Z",
                "verified": None
            },
            {
                "id": "fb-002",
                "title": "Wi-Fi Signal Drops in Library",
                "transcript": "The Wi-Fi keeps dropping on the second floor of the library, especially during peak hours.",
                "issue": "Wi-Fi connectivity",
                "location": "Library 2nd Floor",
                "frequency": "Multiple times daily",
                "impact": "Medium",
                "sentiment": "Negative",
                "status": "UNDER REVIEW",
                "department": "Network Operations",
                "issueId": "issue-002",
                "timestamp": "2026-09-02T14:15:00Z",
                "verified": None
            },
            {
                "id": "fb-003",
                "title": "Canteen Cleanliness",
                "transcript": "The canteen tables are not cleaned properly and the water dispenser filter needs replacement.",
                "issue": "Sanitation",
                "location": "Main Canteen",
                "frequency": "Daily",
                "impact": "Medium",
                "sentiment": "Negative",
                "status": "RESOLVED",
                "department": "Campus Facilities",
                "issueId": "issue-003",
                "timestamp": "2026-08-28T09:00:00Z",
                "verified": None
            }
        ]
        _save_json(FEEDBACK_FILE, feedbacks)

    if not issues:
        issues = [
            {
                "id": "issue-001",
                "title": "Lab 304 Computer Performance & Boot Freezes",
                "priority": "CRITICAL",
                "reportsCount": 43,
                "department": "IT Infrastructure",
                "assignee": None,
                "status": "IN PROGRESS",
                "impactTrend": "+31%",
                "aiSummary": "Students consistently report slow boot times (>5 min), system freezes during practicals, and frequent blue screens.",
                "themes": [
                    {"label": "Slow boot", "pct": 85},
                    {"label": "System freezing", "pct": 62},
                    {"label": "Old hardware", "pct": 45},
                    {"label": "Software issues", "pct": 30}
                ],
                "recommendedAction": "Inspect Lab 304 systems, prioritize RAM upgrades and SSD replacements.",
                "feedbackIds": ["fb-001"],
                "createdAt": "2026-09-01T10:30:00Z",
                "resolvedAt": None,
                "verifiedCount": 0
            },
            {
                "id": "issue-002",
                "title": "Library 2nd Floor Wi-Fi Dead Zones",
                "priority": "HIGH",
                "reportsCount": 31,
                "department": "Network Operations",
                "assignee": None,
                "status": "ASSIGNED",
                "impactTrend": "+18%",
                "aiSummary": "Intermittent signal drops on the 2nd floor prevent students from accessing digital databases during study sessions.",
                "themes": [
                    {"label": "Signal drops", "pct": 78},
                    {"label": "Peak hours", "pct": 55},
                    {"label": "Database access", "pct": 40}
                ],
                "recommendedAction": "Install additional access points on Library 2nd floor, check channel interference.",
                "feedbackIds": ["fb-002"],
                "createdAt": "2026-09-02T14:15:00Z",
                "resolvedAt": None,
                "verifiedCount": 0
            },
            {
                "id": "issue-003",
                "title": "Canteen Sanitation & Water Dispenser Filter",
                "priority": "MEDIUM",
                "reportsCount": 19,
                "department": "Campus Facilities",
                "assignee": None,
                "status": "RESOLVED",
                "impactTrend": "-18%",
                "aiSummary": "Water filters replaced and daily sanitation protocol upgraded.",
                "themes": [
                    {"label": "Table cleanliness", "pct": 70},
                    {"label": "Water quality", "pct": 55}
                ],
                "recommendedAction": "Maintain upgraded daily sanitation protocol.",
                "feedbackIds": ["fb-003"],
                "createdAt": "2026-08-28T09:00:00Z",
                "resolvedAt": "2026-09-03T16:00:00Z",
                "verifiedCount": 19
            }
        ]
        _save_json(ISSUES_FILE, issues)


_seed_data()


# ══════════════════════════════════
# FEEDBACK ENDPOINTS
# ══════════════════════════════════

@app.post("/api/feedback")
async def submit_feedback(body: FeedbackSubmission):
    feedbacks = _load_json(FEEDBACK_FILE)
    new_fb = {
        "id": f"fb-{uuid.uuid4().hex[:8]}",
        "title": body.issue or "Voice Feedback",
        "transcript": body.transcript,
        "issue": body.issue,
        "location": body.location,
        "frequency": body.frequency,
        "impact": body.impact,
        "sentiment": body.sentiment,
        "status": "UNDER REVIEW",
        "department": "Unassigned",
        "issueId": None,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "verified": None
    }
    feedbacks.append(new_fb)
    _save_json(FEEDBACK_FILE, feedbacks)
    return {"success": True, "feedback": new_fb}


@app.get("/api/feedback")
async def list_feedbacks():
    return _load_json(FEEDBACK_FILE)


@app.get("/api/feedback/{feedback_id}")
async def get_feedback(feedback_id: str):
    feedbacks = _load_json(FEEDBACK_FILE)
    fb = next((f for f in feedbacks if f["id"] == feedback_id), None)
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return fb


@app.post("/api/feedback/{feedback_id}/verify")
async def verify_feedback(feedback_id: str, body: VerificationRequest):
    feedbacks = _load_json(FEEDBACK_FILE)
    fb = next((f for f in feedbacks if f["id"] == feedback_id), None)
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")

    fb["verified"] = body.resolved
    if not body.resolved:
        fb["status"] = "REOPENED"
    else:
        fb["status"] = "CLOSED"
    _save_json(FEEDBACK_FILE, feedbacks)

    # Update linked issue
    if fb.get("issueId"):
        issues = _load_json(ISSUES_FILE)
        issue = next((i for i in issues if i["id"] == fb["issueId"]), None)
        if issue:
            if body.resolved:
                issue["verifiedCount"] = issue.get("verifiedCount", 0) + 1
            else:
                issue["status"] = "REOPENED"
            _save_json(ISSUES_FILE, issues)

    return {"success": True, "status": fb["status"]}


# ══════════════════════════════════
# ISSUES ENDPOINTS
# ══════════════════════════════════

@app.get("/api/issues")
async def list_issues():
    return _load_json(ISSUES_FILE)


@app.get("/api/issues/{issue_id}")
async def get_issue(issue_id: str):
    issues = _load_json(ISSUES_FILE)
    issue = next((i for i in issues if i["id"] == issue_id), None)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@app.patch("/api/issues/{issue_id}/status")
async def update_issue_status(issue_id: str, body: StatusUpdate):
    issues = _load_json(ISSUES_FILE)
    issue = next((i for i in issues if i["id"] == issue_id), None)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue["status"] = body.status
    if body.status == "RESOLVED":
        issue["resolvedAt"] = datetime.now(timezone.utc).isoformat()
    _save_json(ISSUES_FILE, issues)
    return {"success": True, "issue": issue}


@app.patch("/api/issues/{issue_id}/assign")
async def assign_issue(issue_id: str, body: AssignmentUpdate):
    issues = _load_json(ISSUES_FILE)
    issue = next((i for i in issues if i["id"] == issue_id), None)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue["department"] = body.department
    issue["assignee"] = body.assignee
    issue["status"] = "ASSIGNED"
    _save_json(ISSUES_FILE, issues)
    return {"success": True, "issue": issue}


# ══════════════════════════════════
# ANALYTICS ENDPOINTS
# ══════════════════════════════════

@app.get("/api/analytics/pulse")
async def get_pulse():
    return {
        "overallScore": 78,
        "categories": [
            {"label": "Teaching", "score": 87},
            {"label": "Infrastructure", "score": 71},
            {"label": "Facilities", "score": 64},
            {"label": "Events", "score": 84},
            {"label": "Administration", "score": 76},
        ],
        "totalFeedback": 428,
        "resolvedCount": 311,
        "verifiedCount": 276,
        "reopenedCount": 35,
    }


@app.get("/api/analytics/trending")
async def get_trending():
    return [
        {"label": "Wi-Fi complaints", "change": "+31%", "rising": True},
        {"label": "Lab equipment issues", "change": "+24%", "rising": True},
        {"label": "Canteen complaints", "change": "-18%", "rising": False},
        {"label": "Parking concerns", "change": "+12%", "rising": True},
        {"label": "Library hours", "change": "-8%", "rising": False},
    ]


# ══════════════════════════════════
# HEALTH
# ══════════════════════════════════

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "loopback-api",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
