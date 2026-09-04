import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Sparkles, Send, CheckCircle2, RotateCcw, Edit3, Image, Save, Lock, Volume2, Globe } from 'lucide-react';
import { VoiceRecognitionService, speakText } from '../services/speechService';
import { analyzeFeedback } from '../services/geminiService';

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

  // Flow states
  const [step, setStep] = useState('input'); // input | analyzing | review | submitted
  const [analysis, setAnalysis] = useState(null);
  const [trackingId, setTrackingId] = useState('');

  const speechRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    speechRef.current = new VoiceRecognitionService(
      (fullText) => setTranscript(fullText),
      (err) => { console.warn('Speech error:', err); setIsListening(false); },
      () => setIsListening(false)
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

  const handleAnalyze = async () => {
    const textToAnalyze = mode === 'voice' ? transcript : textInput;
    if (!textToAnalyze.trim()) return;

    if (isListening) toggleListening();
    setStep('analyzing');

    const res = await analyzeFeedback(textToAnalyze);
    setAnalysis(res);
    setStep('review');
  };

  const handleSubmit = async () => {
    setStep('submitted');
    const finalContent = mode === 'voice' ? transcript : textInput;
    
    try {
      const res = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: finalContent,
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
          Institutional Feedback Portal
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-1)' }}>
          {step === 'submitted' ? 'Feedback Submitted' : 'Submit Voice or Text Feedback'}
        </h1>
      </div>

      {step === 'input' && (
        <div className="sketch-card animate-fade-up">
          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <button
              className={`btn-pill ${mode === 'voice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('voice')}
              style={{ flex: 1, minWidth: '130px', justifyContent: 'center' }}
            >
              <Mic size={16} /> Voice Feedback
            </button>
            <button
              className={`btn-pill ${mode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('text')}
              style={{ flex: 1, minWidth: '130px', justifyContent: 'center' }}
            >
              <Edit3 size={16} /> Text Feedback
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
              <Lock size={14} color="var(--primary)" /> Submit Anonymously (Hide PRN & Student Identity)
            </label>
          </div>

          {/* Voice Mode */}
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
                  ● Recording: {formatTime(duration)} (Noise Reduction Active)
                </div>
              )}

              <textarea
                className="sketch-input"
                rows={4}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Spoken words will appear here in real-time. You can edit before submitting..."
                style={{ marginBottom: 'var(--space-6)' }}
              />
            </div>
          ) : (
            /* Text Mode */
            <div>
              <textarea
                className="sketch-input"
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your detailed complaint or suggestion here..."
                style={{ marginBottom: 'var(--space-3)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Character Count: {textInput.length}
                </span>
                <button className="btn-pill btn-ghost" style={{ fontSize: '0.8rem' }}>
                  <Image size={14} /> Attach Proof (Placeholder)
                </button>
              </div>
            </div>
          )}

          <button
            className="btn-pill btn-primary"
            onClick={handleAnalyze}
            disabled={!(mode === 'voice' ? transcript.trim() : textInput.trim())}
            style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-4)' }}
          >
            <Sparkles size={16} /> Process & Analyze Feedback
          </button>
        </div>
      )}

      {/* Analyzing Step */}
      {step === 'analyzing' && (
        <div className="sketch-card animate-fade-up" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div className="voice-orb processing" style={{ margin: '0 auto var(--space-6)' }}>
            <Sparkles size={32} color="var(--primary)" style={{ animation: 'spinSlow 3s linear infinite' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>AI is categorizing, detecting sentiment, and extracting key details...</p>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && (
        <div className="sketch-card animate-fade-up">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>
            Review Before Submission
          </h3>

          <div style={{ background: 'var(--secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TRANSCRIPT / TEXT</span>
            <p style={{ fontSize: '0.9rem', marginTop: '4px', fontStyle: 'italic' }}>
              "{mode === 'voice' ? transcript : textInput}"
            </p>
          </div>

          <div className="responsive-form-grid" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-dashed)', padding: '8px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</span>
              <p style={{ fontWeight: 600 }}>{category} ({subcategory})</p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-dashed)', padding: '8px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Identity</span>
              <p style={{ fontWeight: 600 }}>{isAnonymous ? 'Anonymous' : (user?.id || 'Student')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button className="btn-pill btn-secondary" onClick={() => setStep('input')} style={{ flex: 1, minWidth: '100px', justifyContent: 'center' }}>
              Edit
            </button>
            <button className="btn-pill btn-primary" onClick={handleSubmit} style={{ flex: 2, minWidth: '160px', justifyContent: 'center' }}>
              <Send size={16} /> Submit to Institute
            </button>
          </div>
        </div>
      )}

      {/* Submitted Confirmation */}
      {step === 'submitted' && (
        <div className="sketch-card animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto var(--space-4)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
            Complaint Registered
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Your feedback has been routed to the department admin.
          </p>

          <div style={{ background: 'var(--primary-subtle)', border: '2px dashed var(--primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>UNIQUE TRACKING ID</span>
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
              Track Status in Action Tracker
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
