# LOOPBACK
## Technical Requirements Document (TRD)

**Product:** LoopBack  
**Type:** Conversational Feedback Intelligence & Resolution Platform  
**Problem Statement:** Feedback System  
**Primary UX:** Voice-first conversational feedback  
**Core flow:** Speak → Understand → Clarify → Structure → Cluster → Act → Resolve → Confirm

---

# 1. Purpose

This document defines the technical requirements for building LoopBack, a voice-first feedback platform.

The system should allow a user to provide feedback naturally through voice, convert the conversation into structured feedback, allow the user to verify the interpretation, connect similar feedback into issues, provide administrators with an actionable dashboard, and close the loop through resolution confirmation.

---

# 2. Product Scope

## 2.1 In Scope

- User authentication
- User dashboard
- Voice feedback
- Speech-to-text
- Conversational AI
- Contextual follow-up questions
- Feedback summarization
- User confirmation/editing
- Feedback storage
- Similar-feedback grouping
- Issue creation
- Issue prioritization
- Admin dashboard
- Issue assignment
- Issue status tracking
- Resolution recording
- User resolution confirmation
- Issue reopening
- Feedback analytics
- Basic notifications

## 2.2 Out of Scope for MVP

- Complex enterprise integrations
- Advanced predictive analytics
- Full multilingual support
- Advanced workflow automation
- Native mobile applications
- Large-scale external organization integrations

These can be added after the MVP.

---

# 3. Recommended System Architecture

```text
                    CLIENT
                      │
              ┌───────┴────────┐
              │                │
          User Web App     Admin Web App
              │                │
              └───────┬────────┘
                      │
                      ▼
                API / Backend
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
 Authentication   Feedback       Issue Service
                  Service
       │              │              │
       └──────────────┼──────────────┘
                      │
                      ▼
                   Database
                      │
             ┌────────┴────────┐
             ▼                 ▼
        AI Services       Notification
             │                 │
       ┌─────┴─────┐           │
       ▼           ▼           ▼
 Speech-to-Text   LLM       Email / In-App
       │
       ▼
 Voice Input
```

---

# 4. Recommended Technology Stack

The competition rules specify no fixed technology stack and allow AI-assisted development tools, third-party APIs/services and free LLM APIs. The final stack should therefore be selected based on development speed and reliability.

## Frontend

Recommended:

- React / Next.js
- TypeScript
- Tailwind CSS
- Component library such as shadcn/ui
- Web Speech / supported speech APIs where appropriate
- Realtime UI state management

## Backend

Recommended:

- Node.js
- TypeScript
- Express.js or Next.js API routes

Alternative:

- Python + FastAPI

## Database

Recommended:

- PostgreSQL
- Supabase can provide PostgreSQL + authentication + storage

Alternative:

- Firebase
- MongoDB

The competition document explicitly permits databases including Firebase, MongoDB, PostgreSQL, MySQL and Supabase.

## AI

Recommended:

- Gemini API or another permitted LLM
- Speech-to-text service/API
- Embeddings/vector search for similarity detection

## Storage

For audio recordings and attachments:

- Supabase Storage
- Firebase Storage
- Cloud object storage

---

# 5. Functional Requirements

# FR-01 Authentication

The system shall support:

- User login
- User registration
- Admin login
- Session management
- Role-based access

### Roles

```text
USER
ADMIN
MANAGEMENT
```

The MVP can initially implement USER and ADMIN.

---

# FR-02 User Dashboard

The dashboard shall display:

- Welcome message
- Start Feedback CTA
- Recent feedback
- Feedback status
- Number of submitted feedback items
- Number of resolved items
- Updates

Primary CTA:

```text
🎙 Start a conversation
```

---

# FR-03 Voice Feedback

The system shall allow the user to start a voice feedback session.

### Requirements

- Request microphone permission
- Start recording
- Display recording state
- Display waveform/orb
- Capture audio
- Stop recording
- Cancel recording
- Allow retry
- Convert speech to text

### UI states

```text
IDLE
 ↓
LISTENING
 ↓
PROCESSING
 ↓
TRANSCRIBED
```

---

# FR-04 Live Transcription

The system should display the user's speech as text when technically supported.

Example:

```text
"The computers in Lab 304 are really
slow and it is difficult to complete
our practicals."
```

The user must be able to review the transcript.

Actions:

- Edit
- Retry
- Continue

---

# FR-05 Conversational AI

The AI service shall interpret the user's feedback and determine whether additional information is required.

### AI responsibilities

- Understand user intent
- Extract key information
- Identify missing information
- Ask contextual questions
- Avoid unnecessary questions
- Generate a structured feedback summary

### Example

User:

> The computers in Lab 304 are really slow.

AI:

> Is this happening every time you use the lab or only occasionally?

User:

> Almost every time.

AI:

> How much is this affecting your practical work?

---

# FR-06 Conversation State

Each voice feedback session shall maintain conversation state.

Example:

```text
session_id
user_id
conversation_status
messages[]
current_question
extracted_entities
missing_fields[]
```

Possible states:

```text
STARTED
LISTENING
PROCESSING
CLARIFYING
READY_FOR_CONFIRMATION
SUBMITTED
CANCELLED
```

---

# FR-07 Structured Feedback Extraction

The AI shall convert conversation into structured data.

Minimum fields:

```text
title
description
category
location
frequency
impact
sentiment
urgency
```

Example:

```json
{
  "title": "Slow computers in Lab 304",
  "category": "Infrastructure",
  "location": "Lab 304",
  "frequency": "Almost every time",
  "impact": "High",
  "sentiment": "Negative",
  "urgency": "High"
}
```

---

# FR-08 User Confirmation

Before final submission, the system shall display an AI-generated summary.

The user can:

- Confirm
- Edit
- Restart

The system must not silently submit AI-generated information without user confirmation.

---

# FR-09 Feedback Submission

After confirmation:

- Create feedback record
- Save transcript
- Save structured information
- Save timestamp
- Associate feedback with user
- Optionally store audio reference
- Trigger similarity analysis

---

# FR-10 Similar Feedback Detection

The system should identify feedback that describes the same or highly similar issue.

Example:

```text
Feedback 1
"The PCs are very slow."

Feedback 2
"Lab 304 computers take forever to start."

Feedback 3
"The computers freeze during practicals."
```

System:

```text
        LAB 304 PC ISSUE

            43 reports
```

The implementation can use:

- Text embeddings
- Vector similarity
- LLM-assisted classification
- Metadata matching

---

# FR-11 Issue Creation

If similar feedback crosses a configurable threshold, the system should be able to create or associate feedback with an issue.

Example:

```text
Issue ID: ISS-1024

Title:
Lab 304 PC Performance

Reports:
43

Priority:
HIGH

Status:
UNDER REVIEW
```

---

# FR-12 Priority

The system shall assign a priority to issues.

Possible levels:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Priority can consider:

- Severity
- Frequency
- User impact
- Number of affected users
- Trend

The exact scoring formula can be configured later.

---

# FR-13 Admin Dashboard

The admin dashboard shall provide:

- Total feedback
- Negative feedback
- Pending issues
- Resolved issues
- Issues requiring attention
- Trending issues
- Priority indicators

Example:

```text
428 Total
86 Negative
31 Pending
311 Resolved
```

---

# FR-14 Issue Detail

Admin shall be able to open an issue and see:

- Issue title
- Description
- Number of reports
- Sentiment distribution
- Priority
- Affected users
- Similar feedback
- AI summary
- Original transcripts
- Optional voice recordings
- Timeline
- Assigned person/department
- Resolution information

---

# FR-15 Issue Assignment

Admin shall be able to assign an issue to:

- Department
- Responsible person
- Priority
- Deadline

Example:

```text
Department:
IT Infrastructure

Responsible:
Administrator

Priority:
HIGH

Deadline:
12 September
```

---

# FR-16 Issue Status

Supported statuses:

```text
UNDER_REVIEW
ASSIGNED
IN_PROGRESS
RESOLVED
CLOSED
REOPENED
```

Status changes must be stored with timestamps.

---

# FR-17 Resolution

Admin shall be able to record:

- Resolution description
- Resolution date
- Responsible person
- Supporting attachment if required

Example:

```text
Resolution:
Lab systems serviced and RAM upgraded.
```

---

# FR-18 User Resolution Confirmation

When an issue is marked resolved, the affected user should receive an update.

Question:

> Was the issue actually fixed?

Actions:

```text
👍 Yes
👎 No
```

## If YES

```text
Issue → CLOSED
```

## If NO

```text
Issue → REOPENED
```

The user should optionally be able to provide additional voice feedback.

---

# FR-19 Reopening

When a user rejects a resolution:

- Reopen the issue
- Preserve the previous resolution
- Capture the new feedback
- Notify the responsible administrator
- Add a new event to the issue timeline

---

# FR-20 Feedback Timeline

Every issue should maintain an event timeline.

Example:

```text
Feedback Submitted
       ↓
AI Analyzed
       ↓
Issue Identified
       ↓
Assigned
       ↓
In Progress
       ↓
Resolved
       ↓
User Confirmed
       ↓
Closed
```

---

# FR-21 Analytics

The system shall provide basic analytics.

### Experience Pulse

Metrics:

- Overall feedback sentiment
- Category sentiment
- Feedback volume
- Issue volume
- Resolution rate
- Reopen rate
- Trending issues

Example:

```text
Teaching              87%
Infrastructure        71%
Facilities             64%
Events                 84%
```

---

# 6. Database Requirements

## 6.1 Users

```text
users
-----
id
name
email
password_hash / auth_id
role
created_at
updated_at
```

---

## 6.2 Feedback

```text
feedback
--------
id
user_id
issue_id
title
description
category
location
frequency
impact
sentiment
urgency
transcript
audio_url
status
created_at
updated_at
```

---

## 6.3 Conversations

```text
conversations
-------------
id
user_id
feedback_id
status
created_at
updated_at
```

---

## 6.4 Conversation Messages

```text
conversation_messages
---------------------
id
conversation_id
sender
message_text
audio_url
created_at
```

Where:

```text
sender =
USER
AI
```

---

## 6.5 Issues

```text
issues
------
id
title
description
category
location
priority
status
affected_users
assigned_department
assigned_user_id
created_at
updated_at
resolved_at
closed_at
```

---

## 6.6 Issue Events

```text
issue_events
------------
id
issue_id
event_type
description
performed_by
created_at
```

Example event types:

```text
CREATED
ASSIGNED
STATUS_CHANGED
RESOLVED
CONFIRMED
REOPENED
CLOSED
```

---

## 6.7 Resolutions

```text
resolutions
-----------
id
issue_id
admin_id
description
created_at
```

---

## 6.8 Resolution Confirmations

```text
resolution_confirmations
------------------------
id
issue_id
user_id
confirmed
comment
created_at
```

---

# 7. API Requirements

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

## Feedback

```text
POST /feedback
GET  /feedback
GET  /feedback/:id
PATCH /feedback/:id
```

## Conversations

```text
POST /conversations
POST /conversations/:id/message
POST /conversations/:id/audio
GET  /conversations/:id
POST /conversations/:id/complete
```

## AI

```text
POST /ai/transcribe
POST /ai/analyze-feedback
POST /ai/generate-question
POST /ai/summarize
POST /ai/find-similar
```

## Issues

```text
GET  /issues
POST /issues
GET  /issues/:id
PATCH /issues/:id
POST /issues/:id/assign
POST /issues/:id/resolve
POST /issues/:id/reopen
```

## Confirmation

```text
POST /issues/:id/confirm
POST /issues/:id/reject-resolution
```

## Analytics

```text
GET /analytics/overview
GET /analytics/trends
GET /analytics/categories
GET /analytics/resolution
```

---

# 8. AI Requirements

## 8.1 Speech-to-Text

Input:

```text
Audio
```

Output:

```text
Transcript
```

Requirements:

- Handle natural speech
- Preserve meaning
- Return transcript reliably
- Handle pauses
- Provide error fallback

---

## 8.2 LLM Analysis

Input:

```text
Conversation transcript
```

Output:

```text
Structured feedback
```

The model should return predictable structured JSON rather than uncontrolled prose.

---

## 8.3 Question Generation

The AI should determine missing information.

Example:

```text
Known:
Issue = Wi-Fi

Missing:
Location
Frequency
Impact
```

Ask only the most useful next question.

---

## 8.4 Similarity

Feedback should be converted into embeddings where applicable.

Example:

```text
Feedback A → Vector A
Feedback B → Vector B

Similarity(A,B) = 0.91
```

If the similarity exceeds the configured threshold, associate the feedback with the same issue or send it for review.

---

# 9. Frontend Screen Requirements

## User Screens

### Screen 1
Splash / onboarding

### Screen 2
Home dashboard

### Screen 3
Voice feedback

### Screen 4
Live transcription

### Screen 5
AI conversation

### Screen 6
AI understanding

### Screen 7
Feedback confirmation

### Screen 8
Submission success

### Screen 9
Similar experiences

### Screen 10
My feedback

### Screen 11
Issue detail / timeline

### Screen 12
Resolution confirmation

---

## Admin Screens

### Screen 13
Admin command center

### Screen 14
Feedback inbox

### Screen 15
Issue list

### Screen 16
Issue detail

### Screen 17
Assignment

### Screen 18
Resolution

### Screen 19
Analytics / Pulse

### Screen 20
Settings

---

# 10. UI/UX Requirements

## Voice-first

The main user action should be:

```text
🎙 Start a conversation
```

The interface should feel conversational rather than form-driven.

## Accessibility

- Clear typography
- Keyboard navigation
- Accessible contrast
- Visible focus states
- Text alternative to voice
- Manual editing option
- Voice permission error handling

## Responsive Design

The UI should support:

- Desktop
- Tablet
- Mobile browser

The competition demo should be optimized for the device being used.

---

# 11. Error Handling

## Microphone denied

Display:

> Microphone access is required for voice feedback.

Provide:

**Try again**

and:

**Continue with text**

## Speech recognition failure

Display:

> We couldn't understand that recording.

Actions:

**Retry**

**Edit transcript**

**Use text**

## AI failure

Fallback to:

- Save raw transcript
- Allow manual feedback submission
- Retry AI processing

The user should never lose their feedback because an AI service fails.

---

# 12. Security Requirements

- Use authenticated sessions
- Protect admin routes
- Enforce role-based authorization
- Validate all API inputs
- Never expose API keys in frontend code
- Secure audio storage
- Use HTTPS in production
- Sanitize user-generated content
- Apply rate limiting to feedback/AI endpoints
- Restrict access to private feedback

---

# 13. Privacy Requirements

The system should clearly communicate:

- Whether feedback is anonymous
- Whether voice recordings are stored
- Who can access feedback
- How feedback is used

If anonymous feedback is implemented, the UI should make the anonymity state obvious before submission.

---

# 14. Performance Requirements

Target MVP behavior:

- Dashboard should load quickly under normal demo conditions.
- Voice recording should start without noticeable delay.
- Transcript should appear as quickly as the selected speech service permits.
- AI responses should show a loading state rather than freezing the interface.
- Feedback submission should provide immediate confirmation.
- Admin issue updates should reflect without requiring a full page reload where practical.

---

# 15. Realtime Requirements

Realtime behavior is desirable for:

- Voice transcription
- AI conversation
- Issue status updates
- Admin dashboard changes
- User resolution notifications

For MVP, realtime can be implemented selectively.

---

# 16. File / Audio Handling

Audio recordings should:

- Be associated with a feedback or conversation ID.
- Have controlled file size.
- Use supported audio formats.
- Be stored outside the main database.
- Store only the storage reference in the database.

Example:

```text
audio_url
storage_provider
duration
created_at
```

---

# 17. Notification Requirements

Users should receive notifications for:

- Feedback received
- Feedback under review
- Issue assigned
- Issue resolved
- Resolution confirmation required
- Issue reopened

Admins should receive notifications for:

- New high-priority issues
- New assignments
- Reopened issues

For MVP, in-app notifications are sufficient.

---

# 18. Non-Functional Requirements

## Reliability

Core feedback submission should remain functional even if AI processing fails.

## Scalability

Architecture should allow increasing:

- Number of users
- Feedback volume
- AI requests
- Stored audio
- Issues

## Maintainability

- TypeScript where possible
- Modular backend
- Reusable UI components
- Environment-based configuration
- Clear API contracts
- GitHub repository with meaningful commits

The competition rules require every team to create a proper GitHub repository and submit the link. fileciteturn0file0L80-L82

---

# 19. MVP Development Priority

## Phase 1: Foundation

- Project setup
- Authentication
- Database
- User/admin roles
- Basic UI system

## Phase 2: Voice Experience

- Microphone
- Recording
- Speech-to-text
- Transcript UI
- Voice orb
- Conversation UI

## Phase 3: AI

- Feedback extraction
- Contextual questions
- Summary
- Confirmation

## Phase 4: Admin

- Dashboard
- Feedback list
- Issue detail
- Priority
- Assignment
- Status

## Phase 5: Closed Loop

- Resolution
- User confirmation
- Reopen
- Timeline

## Phase 6: Polish

- Similarity clustering
- Analytics
- Animations
- Notifications
- Error states
- Responsive optimization

---

# 20. Suggested Demo Data

Prepare one strong scenario instead of demonstrating random features.

### Example issue

```text
Lab 304 Computer Performance
```

Prepare approximately:

```text
40+ related feedback entries
Multiple voice transcripts
Different sentiment levels
High priority
Assigned department
Existing resolution
```

This makes the UI feel populated and lets the team demonstrate the complete loop.

---

# 21. Demo Flow

```text
User opens LoopBack
        ↓
Start Voice Feedback
        ↓
Speaks naturally
        ↓
Live transcription
        ↓
AI asks follow-up
        ↓
AI summarizes
        ↓
User confirms
        ↓
Feedback submitted
        ↓
43 similar experiences found
        ↓
Admin Command Center
        ↓
Critical issue appears
        ↓
Admin opens issue
        ↓
Reviews AI summary
        ↓
Assigns issue
        ↓
Marks resolved
        ↓
User receives confirmation
        ↓
User says "Still a problem"
        ↓
Issue reopens
        ↓
Admin sees reopened issue
```

---

# 22. Technical Success Criteria

The MVP is successful if a judge can complete the following without manual intervention:

1. Speak feedback.
2. See the transcript.
3. Have a meaningful AI follow-up conversation.
4. See structured feedback.
5. Confirm and submit it.
6. See it associated with a larger issue.
7. Admin can find the issue.
8. Admin can assign it.
9. Admin can mark it resolved.
10. User can confirm or reject the resolution.
11. Rejected resolutions reopen the issue.
12. The complete lifecycle is visible in the UI.

---

# 23. Core Technical Principle

Do not make AI the entire product.

Use AI for the parts where natural language is valuable:

```text
VOICE
  ↓
TRANSCRIPTION
  ↓
UNDERSTANDING
  ↓
STRUCTURING
  ↓
SIMILARITY
  ↓
INSIGHT
```

Use deterministic application logic for:

```text
AUTH
DATABASE
PERMISSIONS
STATUS
ASSIGNMENT
RESOLUTION
CONFIRMATION
```

This makes the system easier to demonstrate and more reliable.

---

# 24. Final Architecture

```text
                         LOOPBACK
                            │
             ┌──────────────┴──────────────┐
             │                             │
         USER APP                      ADMIN APP
             │                             │
             └──────────────┬──────────────┘
                            │
                         API
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
             AUTH       FEEDBACK      ISSUES
                            │           │
                            └─────┬─────┘
                                  │
                                  ▼
                              DATABASE
                                  │
                     ┌────────────┴────────────┐
                     │                         │
                     ▼                         ▼
                AI SERVICES              STORAGE
                     │                         │
              ┌──────┴──────┐                  │
              ▼             ▼                  ▼
         Speech-to-Text     LLM             Audio
              │             │
              └──────┬──────┘
                     ▼
              STRUCTURED DATA
                     │
                     ▼
              SIMILARITY ENGINE
                     │
                     ▼
                   ISSUE
                     │
                     ▼
                  ACTION
                     │
                     ▼
                RESOLUTION
                     │
                     ▼
              USER CONFIRMATION
                     │
               ┌─────┴─────┐
               ▼           ▼
             CLOSED      REOPENED
```

---

# 25. North Star

```text
USER VOICE
    ↓
UNDERSTANDING
    ↓
INSIGHT
    ↓
ACTION
    ↓
RESOLUTION
    ↓
VERIFICATION
    ↓
LOOP CLOSED ✓
```

**LoopBack is technically complete when feedback does not end at "Submit", but continues through the entire resolution lifecycle.**
