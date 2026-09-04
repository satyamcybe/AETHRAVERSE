# LOOPBACK
# Design Language & UI Design System

**Product:** LoopBack  
**Positioning:** Conversational Feedback Intelligence & Resolution Platform  
**Design goal:** Make feedback feel effortless for the user and actionable for the organization.

---

# 1. Design Philosophy

LoopBack should feel like a **premium modern SaaS product**, not a college ERP, survey form, or generic AI chatbot.

The interface should communicate three ideas:

1. **Human:** Feedback starts with a person's voice.
2. **Intelligent:** The system understands and organizes what the person says.
3. **Action-oriented:** Feedback turns into visible action and resolution.

### Core design principle

> **Simple for the person speaking. Powerful for the person acting.**

The user experience should be calm, conversational and approachable.

The admin experience should be structured, information-dense and decisive.

---

# 2. Brand Personality

LoopBack should feel:

- Human
- Intelligent
- Calm
- Trustworthy
- Modern
- Premium
- Focused
- Responsive

It should NOT feel:

- Corporate-heavy
- Bureaucratic
- Academic
- Cluttered
- Childish
- Overly futuristic
- Like a generic chatbot

---

# 3. Visual Direction

## Overall style

**Modern SaaS + conversational AI + subtle editorial design**

Reference the visual quality of modern productivity and developer tools rather than traditional institutional dashboards.

### Key characteristics

- Generous whitespace
- Strong typography
- Minimal visual noise
- Subtle borders
- Moderate corner radius
- Soft elevation
- Clear hierarchy
- Restrained use of color
- Purposeful animation

---

# 4. Color System

Use a restrained neutral-first palette.

## Base

```text
Background       #F8F8F6
Surface          #FFFFFF
Surface subtle   #F2F2EF
Border           #E6E6E1
Text primary     #171717
Text secondary   #6B6B68
Text muted       #999994
```

## Brand Accent

Recommended:

```text
Primary          #5B5CE2
Primary hover    #4E4FCB
Primary subtle   #EEEEFF
```

The brand accent should be used for:

- Primary buttons
- Active navigation
- Voice interaction
- Links
- Selected states
- Important highlights

Do not use the accent everywhere.

---

# 5. Semantic Colors

Semantic colors should be used only when they communicate status.

```text
Success
#238636

Success subtle
#EAF7ED

Warning
#C47A00

Warning subtle
#FFF5DE

Danger
#D64545

Danger subtle
#FDECEC

Info
#3478C8

Info subtle
#EAF3FC
```

### Priority mapping

```text
LOW       Neutral
MEDIUM    Warning
HIGH      Orange / strong warning
CRITICAL  Danger
```

Use semantic colors sparingly.

---

# 6. Typography

## Primary Font

Use:

**Inter**

Alternative:

**Geist**

### Typography hierarchy

```text
Display
48–56px
Weight 600–700

Page heading
32–40px
Weight 600

Section heading
20–24px
Weight 600

Card heading
16–18px
Weight 600

Body
14–16px
Weight 400–500

Caption
12–13px
Weight 400–500
```

### Typography principle

Do not make every element large.

Use size and weight to establish hierarchy.

---

# 7. Spacing System

Use a consistent 4px-based spacing system.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Recommended:

- Small component padding: 12–16px
- Card padding: 20–24px
- Section spacing: 32–48px
- Major page sections: 48–80px

---

# 8. Border Radius

Use moderate rounding.

```text
Small controls      8px
Inputs              10px
Cards               14px
Large surfaces      18px
Voice orb           999px
Pills               999px
```

Avoid making every element excessively rounded.

---

# 9. Shadows

Prefer borders over heavy shadows.

### Default card

```text
border: 1px solid #E6E6E1
```

### Elevated component

Use a very subtle shadow.

The interface should feel layered without looking glossy.

---

# 10. Iconography

Use a consistent line-icon system such as **Lucide**.

Characteristics:

- 1.5–2px stroke
- Simple geometry
- No mixed icon styles
- Icons should support text, not replace it

Examples:

```text
Mic
MessageSquare
Check
Clock
AlertCircle
TrendingUp
Users
Search
Filter
ArrowRight
Play
Pause
RotateCcw
```

---

# 11. Layout Philosophy

## User side

Use a **focused, centered layout**.

The user should never feel overwhelmed.

Primary action should always be obvious.

Example:

```text
              What happened?

                    ◉

             Start speaking

       You can speak naturally.
```

## Admin side

Use a **structured dashboard layout**.

```text
┌────────────┬──────────────────────────────┐
│            │                              │
│ Navigation │        Main Content          │
│            │                              │
│            │                              │
└────────────┴──────────────────────────────┘
```

---

# 12. Signature Component: Voice Orb

The Voice Orb is the visual identity of LoopBack.

It should not look like a standard microphone button.

## States

### Idle

```text
       ◉
   Start speaking
```

Small, calm animation.

### Listening

```text
     ~  ◉  ~
   ~    ~    ~
       Listening
```

Orb subtly expands based on audio input.

### Processing

```text
       ◉
   Understanding...
```

Slow rotational/pulsing animation.

### Complete

```text
       ✓
 Feedback understood
```

---

# 13. Voice Interaction Design

The voice experience should feel conversational rather than like recording a voice note.

### Screen hierarchy

```text
AI question
      ↓
Voice Orb
      ↓
Live transcript
      ↓
Secondary controls
```

The AI question should be visually dominant.

Example:

> **What happened?**

Then:

```text
          ◉

"The computers in Lab 304..."
```

---

# 14. Conversation UI

Use a clean conversational interface.

### AI message

```text
┌──────────────────────────────┐
│ Here's what I understood...  │
└──────────────────────────────┘
```

### User message

Keep user messages visually distinct but understated.

Avoid copying the exact look of mainstream messaging apps.

The conversation should feel like a product workflow, not a social chat.

---

# 15. AI Understanding Card

This is one of the most important components.

```text
┌──────────────────────────────────┐
│ Here's what I understood          │
│                                  │
│ Issue       Slow computers       │
│ Location    Lab 304              │
│ Frequency   Almost every time    │
│ Impact      High                 │
│ Sentiment   Negative             │
│                                  │
│        Edit       Looks right ✓  │
└──────────────────────────────────┘
```

### Design rule

Make the extracted information scannable.

Do not show a giant paragraph of AI output.

---

# 16. Feedback Confirmation

The final confirmation should feel trustworthy.

Use:

```text
Your feedback

[Structured summary]

Is this what you meant?

Edit
Submit Feedback →
```

The Submit button should be the strongest visual action.

---

# 17. Success State

Avoid generic:

> "Success!"

Instead:

```text
              ✓

       Feedback received

       Your voice has been heard.

     43 similar experiences found
```

The success screen should smoothly transition the user toward the issue/impact story.

---

# 18. Similarity Visualization

This is a signature visual element.

Represent individual feedback as small nodes converging into an issue.

```text
 ●  ●
   ●   ●
 ●  ●  ●
    \ | /
     \|/
      ↓

  LAB 304 PC ISSUE

       43 reports
```

This creates a visual explanation of how individual voices become a collective issue.

---

# 19. Admin Dashboard Design

The admin dashboard should prioritize **what requires attention**, not simply show statistics.

### Top

```text
Feedback Command Center

428 Feedback       86 Negative
31 Pending         311 Resolved
```

### Main section

```text
Needs Attention
────────────────────────────

🔴 Lab 304 PC Performance
   43 reports · High impact

🟠 Wi-Fi Connectivity
   31 reports · Rising

🟡 Timetable Conflicts
   18 reports · Stable
```

The hierarchy should lead the eye:

**Priority → Issue → Volume → Trend**

---

# 20. Priority Inbox

Treat important issues like an action inbox.

Each row/card should contain:

```text
Priority indicator
Issue title
Number of reports
Impact
Trend
Current status
```

Example:

```text
🔴 Lab 304 PC Performance
43 reports
High impact
↑ 31% this week
In Progress
```

---

# 21. Issue Detail Design

The issue detail page should be one of the strongest screens.

### Header

```text
Lab 304 PC Performance

CRITICAL
43 reports
```

### Then

```text
AI Summary
────────────────────────

Students are consistently reporting
slow boot times, system freezes and
difficulty completing practical sessions.
```

### Then

```text
Common themes

Slow boot          ███████████
System freezing    ████████
Old hardware       ██████
Software issues    ████
```

### Then

Issue timeline and actions.

---

# 22. Issue Timeline

Use a vertical or horizontal timeline.

```text
✓ Reported
│
✓ Analyzed
│
✓ Assigned
│
● In Progress
│
○ Resolved
│
○ Confirmed
```

Use animation when a status changes.

The timeline should make progress instantly understandable.

---

# 23. Audio Feedback Cards

For admins:

```text
┌─────────────────────────────────┐
│ 🎙 Original feedback             │
│                                 │
│ "The PCs take forever to start" │
│                                 │
│ ▶ Play original                 │
└─────────────────────────────────┘
```

Audio should be secondary to transcript and summary.

Do not force administrators to listen to every recording.

---

# 24. Resolution Confirmation

This should be a visually strong user moment.

```text
Your issue was marked as resolved.

Was the problem actually fixed?

       👍 Yes

       👎 No
```

Use large, simple actions.

Do not bury the decision in a menu.

---

# 25. Analytics Design

Avoid dashboard overload.

Prioritize:

1. Overall pulse
2. Major categories
3. Trending issues
4. Resolution effectiveness

### Example

```text
EXPERIENCE PULSE

                 78%

Teaching          87
Infrastructure    71
Facilities         64
Events             84
```

Then:

```text
TRENDING

↑ Wi-Fi             +31%
↑ Lab equipment     +24%
↓ Canteen           -18%
```

---

# 26. Charts

Use charts only when they answer a question.

Good:

- Trend lines
- Horizontal bars
- Progress indicators
- Simple distributions

Avoid:

- Excessive donut charts
- 3D charts
- Decorative charts
- Multiple charts showing the same metric

---

# 27. Empty States

Empty states should feel intentional.

### No feedback

```text
No feedback yet.

Your first conversation
can start a change.

       🎙 Give Feedback
```

### No issues

```text
You're all caught up.

No issues need your attention.
```

---

# 28. Loading States

Never leave users staring at a blank screen.

Use contextual loading messages.

### Voice

> Listening...

### AI

> Understanding your feedback...

### Similarity

> Looking for similar experiences...

### Dashboard

Use skeleton loaders.

---

# 29. Error States

Errors should be human and actionable.

Bad:

> Error 500

Better:

> We couldn't process your voice right now.

Actions:

**Try again**

**Continue with text**

Never make the user lose their feedback because of an AI/API failure.

---

# 30. Motion Design

Animation should communicate state, not decorate the interface.

## Use motion for:

- Voice listening
- AI processing
- Page transitions
- Status changes
- Success confirmation
- Issue resolution
- New feedback appearing
- Reopening

## Avoid:

- Constant floating animations
- Excessive parallax
- Long transitions
- Distracting effects

### Recommended duration

```text
Micro interaction     120–200ms
Component transition  200–300ms
Page transition       300–400ms
Major state change    400–600ms
```

---

# 31. Responsive Design

## Mobile

Voice feedback should be the primary interaction.

```text
┌────────────────────┐
│                    │
│   What happened?   │
│                    │
│        ◉           │
│                    │
│   Listening...     │
│                    │
│ "The Wi-Fi..."     │
│                    │
└────────────────────┘
```

## Desktop

Use more space for:

- Conversation
- AI summary
- Context
- Issue information

Admin desktop should prioritize dashboard density.

---

# 32. Accessibility

The design must support:

- Keyboard navigation
- Visible focus states
- Adequate contrast
- Text alternative to voice
- Manual transcript editing
- Screen-reader-friendly labels
- Clear status indicators
- Non-color-only status communication

Voice must never be the only way to submit feedback.

---

# 33. Design Tokens

Recommended token structure:

```text
--background
--surface
--surface-subtle

--text-primary
--text-secondary
--text-muted

--border
--border-strong

--primary
--primary-hover
--primary-subtle

--success
--warning
--danger
--info

--radius-sm
--radius-md
--radius-lg
--radius-pill

--space-1
--space-2
--space-3
--space-4
--space-6
--space-8
--space-12
--space-16
```

---

# 34. Component Library

Build reusable components before building every page independently.

Required components:

```text
Button
IconButton
Input
Textarea
Select
Badge
StatusBadge
Card
Modal
Drawer
Toast
Tooltip
Avatar
Tabs
Dropdown
Search
Filter
VoiceOrb
Waveform
Transcript
ConversationMessage
UnderstandingCard
FeedbackCard
IssueCard
PriorityBadge
IssueTimeline
AudioPlayer
MetricCard
Chart
EmptyState
Skeleton
```

---

# 35. Button Hierarchy

### Primary

Used for the main action.

```text
Submit Feedback →
Assign Issue →
Resolve Issue ✓
Start Conversation 🎙
```

### Secondary

```text
Edit
Cancel
View Details
```

### Destructive

```text
Delete
Remove
```

Do not make every button visually dominant.

---

# 36. Status Language

Use consistent labels throughout the application.

```text
UNDER REVIEW
ASSIGNED
IN PROGRESS
RESOLVED
CLOSED
REOPENED
```

Do not alternate between:

- "Being handled"
- "Processing"
- "Working"
- "Done"

Consistency is important.

---

# 37. Voice UX Microcopy

Use human language.

### Good

> What happened?

> Tell me a little more.

> Is this happening often?

> Here's what I understood.

> Does this look right?

> You're all set.

### Avoid

> Input query

> Process response

> Submit record

> AI analysis completed successfully

---

# 38. Brand Voice

LoopBack's copy should be:

**Short. Human. Confident. Clear.**

### Examples

> Your voice. Your impact.

> Tell us what happened.

> We'll take it from there.

> Here's what I understood.

> You're not the only one experiencing this.

> This issue needs attention.

> Was it actually fixed?

> Thanks for closing the loop.

---

# 39. Design Do / Don't

## DO

- Make voice the hero interaction.
- Keep user flows short.
- Show AI understanding clearly.
- Use whitespace.
- Make priority visually obvious.
- Make issue progress visible.
- Use animation purposefully.
- Make admin actions obvious.
- Keep the UI consistent.

## DON'T

- Build a generic survey form.
- Make the app look like an ERP.
- Fill every screen with cards.
- Use gradients everywhere.
- Overuse purple/blue AI aesthetics.
- Add a chatbot just for appearance.
- Use charts without purpose.
- Hide important actions.
- Make users answer unnecessary questions.

---

# 40. Signature Experience

The entire design language should reinforce this journey:

```text
              🎙
          SPEAK NATURALLY
                ↓
          🧠 UNDERSTAND
                ↓
          ✨ STRUCTURE
                ↓
          🔗 CONNECT
                ↓
          🎯 PRIORITIZE
                ↓
          ⚙️ ACT
                ↓
          ✓ RESOLVE
                ↓
          👍 VERIFY
                ↓
        LOOP CLOSED
```

---

# 41. Final Design Direction

If the judges see the interface without your explanation, they should immediately understand:

> **This is a modern platform where people can talk about problems and organizations can actually do something about them.**

The visual contrast should be intentional:

**User side:**  
Calm → conversational → human

**AI layer:**  
Intelligent → responsive → transparent

**Admin side:**  
Structured → analytical → action-oriented

**Resolution:**  
Visible → measurable → verified

---

# 42. One Sentence Design Rule

> **Make the complexity disappear for the person giving feedback, while making the intelligence visible to the person acting on it.**
