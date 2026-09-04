import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Sparkles, Send, CheckCircle2, RotateCcw, Edit3, Image, Save, Lock, Volume2, Globe, MessageSquare, ArrowRight, HelpCircle } from 'lucide-react';
import { VoiceRecognitionService, speakText } from '../services/speechService';
import { analyzeConversationalFeedback } from '../services/geminiService';

const CATEGORIES = {
  Academic: ['Faculty performance', 'Teaching methodology', 'Subject understanding', 'Practical sessions', 'Course materials'],
  Infrastructure: ['Classrooms', 'Laboratories', 'Library', 'Wi-Fi & Internet', 'Washrooms', 'Sports facilities', 'Hostel', 'Canteen', 'Transport'],
  Administrative: ['Examination', 'Fees', 'Office support', 'Documentation', 'Student services'],
  Others: ['Suggestions', 'Innovation ideas', 'Complaints', 'Emergency reports']
};

export default function VoiceFeedbackPage({ user }) {
  const [mode, setMode] = useState('voice'); // voice | text
  const [language, setLanguage] = useState('en'); // en | hi | mr
  const [category, setCategory] = useState('Infrastructure');
  const [subcategory, setSubcategory] = useState('Laboratories');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [priority, setPriority] = useState('MEDIUM');

  // Input states
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [duration, setDuration] = useState(0);

  // Conversational AI Follow-up states
  const [step, setStep] = useState('input'); // input | analyzing | followup | review | submitted
  const [conversationHistory, setConversationHistory] = useState([]);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isFollowUpListening, setIsFollowUpListening] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [trackingId, setTrackingId] = useState('');

  const speechRef = useRef(null);
  const followUpSpeechRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    speechRef.current = new VoiceRecognitionService(
      (fullText) => setTranscript(fullText),
      (err) => { console.warn('Speech error:', err); setIsListening(false); },
      () => setIsListening(false)
    );

    followUpSpeechRef.current = new VoiceRecognitionService(
      (fullText) => setFollowUpAnswer(fullText),
      (err) => { console.warn('Speech error:', err); setIsFollowUpListening(false); },
      () => setIsFollowUpListening(false)
    );
  }, []);

  const toggleListening = () => {
    if (isListening) {
      speechRef.current?.stop();
      setIsListening(false);
      clearInterval(timerRef.current);
    } else {
      setTranscript('');
      setDuration(0);
      setIsListening(true);
      speechRef.current?.start();
      timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
    }
  };

  const toggleFollowUpListening = () => {
    if (isFollowUpListening) {
      followUpSpeechRef.current?.stop();
      setIsFollowUpListening(false);
    } else {
      setFollowUpAnswer('');
      setIsFollowUpListening(true);
      followUpSpeechRef.current?.start();
    }
  };

  // Step 1: Submit initial voice/text to AI
  const handleInitialSubmit = async () => {
    const initialText = mode === 'voice' ? transcript : textInput;
    if (!initialText.trim()) return;

    if (isListening) toggleListening();
    setStep('analyzing');

    const history = [{ role: 'user', text: initialText }];
    setConversationHistory(history);

    const res = await analyzeConversationalFeedback(history, category);
    setAnalysis(res);

    if (!res.isComplete && res.nextQuestion) {
      // Append AI question to conversation
      const updatedHistory = [
        ...history,
        { role: 'assistant', text: res.nextQuestion }
      ];
      setConversationHistory(updatedHistory);
      setStep('followup');

      // Optionally speak out the question
      speakText(res.nextQuestion, language);
    } else {
      setStep('review');
    }
  };

  // Step 2: Submit follow-up answer to AI
  const handleAnswerFollowUp = async () => {
    if (!followUpAnswer.trim()) return;

    if (isFollowUpListening) toggleFollowUpListening();
    setStep('analyzing');

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', text: followUpAnswer }
    ];
    setConversationHistory(updatedHistory);
    setFollowUpAnswer('');

    const res = await analyzeConversationalFeedback(updatedHistory, category);
    setAnalysis(res);

    if (!res.isComplete && res.nextQuestion) {
      const nextHistory = [
        ...updatedHistory,
        { role: 'assistant', text: res.nextQuestion }
      ];
      setConversationHistory(nextHistory);
      setStep('followup');

      // Speak out next question
      speakText(res.nextQuestion, language);
    } else {
      setStep('review');
    }
  };

  // Final submit to FastAPI backend
  const handleSubmitFinal = async () => {
    setStep('submitted');
    const fullTranscript = conversationHistory.map(c => `${c.role === 'user' ? 'Student' : 'AI'}: ${c.text}`).join('\n');
    
    try {
      const res = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: fullTranscript,
          submission_type: mode,
          category,
          subcategory,
          location: analysis?.location || 'Campus',
          department: category === 'Infrastructure' ? 'Campus Facilities' : 'Academic Affairs',
          is_anonymous: isAnonymous,
          student_id: isAnonymous ? 'ANON' : (user?.id || 'STU-2026-88'),
          language,
          priority
        })
      });
      const data = await res.json();
      setTrackingId(data.id || `FB-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    } catch (e) {
      setTrackingId(`FB-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="page-center">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Institutional AI Voice Assistant
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-1)' }}>
          {step === 'submitted' ? 'Feedback Registered' : step === 'followup' ? 'AI Dynamic Follow-Up' : 'Submit Voice or Text Feedback'}
        </h1>
      </div>

      {/* Step 1: Initial Input */}
      {step === 'input' && (
        <div className="sketch-card animate-fade-up">
          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <button
              className={`btn-pill ${mode === 'voice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('voice')}
              style={{ flex: 1, minWidth: '130px', justifyContent: 'center' }}
            >
              <Mic size={16} /> Voice Mode
            </button>
            <button
              className={`btn-pill ${mode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('text')}
              style={{ flex: 1, minWidth: '130px', justifyContent: 'center' }}
            >
              <Edit3 size={16} /> Text Mode
            </button>
          </div>

          {/* Configuration Options */}
          <div className="responsive-form-grid" style={{ marginBottom: 'var(--space-6)' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                PREFERRED LANGUAGE
              </label>
              <select className="sketch-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                PRIORITY LEVEL
              </label>
              <select className="sketch-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High / Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                CATEGORY
              </label>
              <select className="sketch-input" value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(CATEGORIES[e.target.value][0]); }}>
                {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SUBCATEGORY
              </label>
              <select className="sketch-input" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                {CATEGORIES[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>

          {/* Anonymous Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-6)', background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)' }}>
            <input type="checkbox" id="anon" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
            <label htmlFor="anon" style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="var(--primary)" /> Submit Anonymously (Hide Identity)
            </label>
          </div>

          {/* Voice Input */}
          {mode === 'voice' ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
              <div
                onClick={toggleListening}
                className={`voice-orb ${isListening ? 'listening' : 'idle'}`}
                style={{ margin: '0 auto var(--space-4)' }}
              >
                {isListening ? <Mic size={40} color="var(--primary)" /> : <MicOff size={40} color="var(--text-muted)" />}
              </div>

              {isListening && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: 'var(--space-4)' }}>
                  ● Recording: {formatTime(duration)}
                </div>
              )}

              <textarea
                className="sketch-input"
                rows={4}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Speak naturally about your problem or suggestion..."
                style={{ marginBottom: 'var(--space-6)' }}
              />
            </div>
          ) : (
            <div>
              <textarea
                className="sketch-input"
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your detailed complaint or suggestion here..."
                style={{ marginBottom: 'var(--space-6)' }}
              />
            </div>
          )}

          <button
            className="btn-pill btn-primary"
            onClick={handleInitialSubmit}
            disabled={!(mode === 'voice' ? transcript.trim() : textInput.trim())}
            style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-4)' }}
          >
            <Sparkles size={16} /> Process & Talk to AI
          </button>
        </div>
      )}

      {/* Analyzing Step */}
      {step === 'analyzing' && (
        <div className="sketch-card animate-fade-up" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div className="voice-orb processing" style={{ margin: '0 auto var(--space-6)' }}>
            <Sparkles size={32} color="var(--primary)" style={{ animation: 'spinSlow 3s linear infinite' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>AI is assessing completeness and preparing target follow-up questions...</p>
        </div>
      )}

      {/* Step 2: Dynamic AI Follow-up Conversation */}
      {step === 'followup' && analysis && (
        <div className="sketch-card animate-fade-up">
          {/* Completeness Bar */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                REPORT COMPLETENESS: {analysis.completenessScore}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                AI is gathering missing details
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px dashed var(--border-dashed)' }}>
              <div style={{ width: `${analysis.completenessScore}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Chat History Thread */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', maxHeight: '280px', overflowY: 'auto' }}>
            {conversationHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: item.role === 'user' ? 'var(--primary-subtle)' : 'var(--secondary)',
                  border: `1px dashed ${item.role === 'user' ? 'var(--primary)' : 'var(--border-dashed)'}`,
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: '12px'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: item.role === 'user' ? 'var(--primary)' : 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  {item.role === 'user' ? 'Your Answer' : 'LoopBack Institutional AI'}
                </span>
                <p style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Speak / Type Follow-up Answer */}
          <div style={{ background: 'var(--surface)', border: '2px dashed var(--primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>
              RESPOND TO AI FOLLOW-UP (SPEAK OR TYPE):
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div
                onClick={toggleFollowUpListening}
                className={`voice-orb ${isFollowUpListening ? 'listening' : 'idle'}`}
                style={{ width: '48px', height: '48px', flexShrink: 0 }}
              >
                <Mic size={20} color={isFollowUpListening ? 'var(--primary)' : 'var(--text-muted)'} />
              </div>
              <input
                className="sketch-input"
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                placeholder={isFollowUpListening ? 'Listening...' : 'Type or speak your answer...'}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswerFollowUp()}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                className="btn-pill btn-primary"
                onClick={handleAnswerFollowUp}
                disabled={!followUpAnswer.trim()}
                style={{ flex: 2, justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <Send size={14} /> Send Answer to AI
              </button>
              <button
                className="btn-pill btn-secondary"
                onClick={() => setStep('review')}
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
              >
                Skip & Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Verified Final Review */}
      {step === 'review' && analysis && (
        <div className="sketch-card animate-fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Verified AI Report</h3>
            <span className="badge badge-resolved">100% Complete</span>
          </div>

          <div style={{ background: 'var(--secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase' }}>TICKET TITLE</span>
            <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>{analysis.issueTitle}</p>
          </div>

          <div className="responsive-form-grid" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-dashed)', padding: '8px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</span>
              <p style={{ fontWeight: 600 }}>{analysis.location}</p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-dashed)', padding: '8px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timing / Frequency</span>
              <p style={{ fontWeight: 600 }}>{analysis.frequency}</p>
            </div>
          </div>

          <div style={{ background: 'var(--primary-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--primary)', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)' }}>EXTRACTED INSIGHTS</span>
            <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', marginTop: '4px' }}>
              {analysis.extractedDetails.map((det, i) => <li key={i}>{det}</li>)}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn-pill btn-secondary" onClick={() => setStep('input')} style={{ flex: 1, justifyContent: 'center' }}>
              Start Over
            </button>
            <button className="btn-pill btn-primary" onClick={handleSubmitFinal} style={{ flex: 2, justifyContent: 'center' }}>
              <Send size={16} /> Submit Verified Complaint
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Submitted Confirmation */}
      {step === 'submitted' && (
        <div className="sketch-card animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto var(--space-4)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
            Complaint Filed & Routed
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            AI has categorized your verified voice report and assigned it to department administrators.
          </p>

          <div style={{ background: 'var(--primary-subtle)', border: '2px dashed var(--primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>TRACKING TICKET ID</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {trackingId}
            </div>
          </div>

          <br />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-pill btn-secondary" onClick={() => setStep('input')}>
              <RotateCcw size={14} /> Submit Another
            </button>
            <a href="/tracker" className="btn-pill btn-primary">
              Track Status in 7-Stage Tracker
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
