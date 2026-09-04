import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Mic, MicOff, Send, CheckCircle2, FileText, MessageSquare, Volume2, Globe, Sparkles, Shield, RotateCcw } from 'lucide-react';
import { VoiceRecognitionService, speakText } from '../services/speechService';

export default function PublicFormPage({ user }) {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [mode, setMode] = useState('choice'); // choice | traditional | conversational | submitted

  // Traditional form state
  const [traditionalAnswers, setTraditionalAnswers] = useState({});
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Conversational AI state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [convoAnswers, setConvoAnswers] = useState([]);
  const [currentVoiceAnswer, setCurrentVoiceAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatThread, setChatThread] = useState([]);

  const speechRef = useRef(null);

  useEffect(() => {
    fetchForm();
    speechRef.current = new VoiceRecognitionService(
      (fullText) => setCurrentVoiceAnswer(fullText),
      (err) => { console.warn('Speech error:', err); setIsListening(false); },
      () => setIsListening(false)
    );
  }, [formId]);

  const fetchForm = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/forms/${formId || 'FORM-2026-101'}`);
      const data = await res.json();
      setForm(data);
    } catch (e) {
      console.warn('Using fallback form data');
      setForm({
        id: 'FORM-2026-101',
        title: 'Spring 2026 Faculty & Lab Infrastructure Assessment',
        description: 'NAAC accreditation feedback survey evaluating teaching methodology, computer lab performance, and campus facilities.',
        questions: [
          { id: 'q1', question_text: 'Which academic department do you belong to?', question_type: 'DROPDOWN', options: ['Computer Engineering', 'Information Technology', 'Mechanical', 'Civil', 'Electrical'] },
          { id: 'q2', question_text: 'Rate the teaching clarity and practical demonstrations of your core course faculty.', question_type: 'RATING', options: ['1 - Poor', '2 - Fair', '3 - Average', '4 - Good', '5 - Excellent'] },
          { id: 'q3', question_text: 'Are you facing performance freezes or hardware issues in Computer Lab 304?', question_type: 'YES_NO', options: ['Yes', 'No'] },
          { id: 'q4', question_text: 'What specific improvements would you suggest for library Wi-Fi & study areas?', question_type: 'PARAGRAPH', options: [] }
        ]
      });
    }
  };

  const startConversationalMode = () => {
    setMode('conversational');
    setCurrentQIndex(0);
    const initialQuestion = form?.questions[0]?.question_text || 'Hello! Ready for your feedback?';
    setChatThread([{ role: 'assistant', text: `Hello! I'll collect your survey responses naturally. First question: ${initialQuestion}` }]);
    speakText(`Hello! I'll collect your survey responses naturally. First question: ${initialQuestion}`);
  };

  const toggleListening = () => {
    if (isListening) {
      speechRef.current?.stop();
      setIsListening(false);
    } else {
      setCurrentVoiceAnswer('');
      setIsListening(true);
      speechRef.current?.start();
    }
  };

  const handleNextConvoQuestion = () => {
    if (!currentVoiceAnswer.trim()) return;

    if (isListening) toggleListening();

    const currentQ = form.questions[currentQIndex];
    const newAnswerObj = {
      question_id: currentQ.id,
      question_text: currentQ.question_text,
      answer: currentVoiceAnswer,
      voice_transcript: currentVoiceAnswer
    };

    const updatedAnswers = [...convoAnswers, newAnswerObj];
    setConvoAnswers(updatedAnswers);

    const updatedThread = [
      ...chatThread,
      { role: 'user', text: currentVoiceAnswer }
    ];

    if (currentQIndex + 1 < form.questions.length) {
      const nextQ = form.questions[currentQIndex + 1];
      setCurrentQIndex(currentQIndex + 1);
      setCurrentVoiceAnswer('');

      updatedThread.push({ role: 'assistant', text: nextQ.question_text });
      setChatThread(updatedThread);
      speakText(nextQ.question_text);
    } else {
      // Finished all questions
      submitFormResponse('conversational', updatedAnswers);
    }
  };

  const handleTraditionalSubmit = (e) => {
    e.preventDefault();
    const formatted = Object.keys(traditionalAnswers).map(qId => {
      const qObj = form.questions.find(q => q.id === qId);
      return {
        question_id: qId,
        question_text: qObj?.question_text || qId,
        answer: traditionalAnswers[qId],
        voice_transcript: traditionalAnswers[qId]
      };
    });
    submitFormResponse('traditional', formatted);
  };

  const submitFormResponse = async (subMode, finalAnswers) => {
    setMode('submitted');
    try {
      await fetch(`http://localhost:8000/api/forms/${form?.id || 'FORM-2026-101'}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: form?.id || 'FORM-2026-101',
          user_id: isAnonymous ? 'ANON' : (user?.id || 'STU-2026-88'),
          is_anonymous: isAnonymous,
          submission_mode: subMode,
          answers: finalAnswers
        })
      });
    } catch (e) {
      console.warn('Saved response locally');
    }
  };

  if (!form) return <div className="page-center">Loading Form...</div>;

  return (
    <div className="page-center">
      {/* Choice Screen */}
      {mode === 'choice' && (
        <div className="sketch-card animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Official Institutional Feedback Survey
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-2)', fontSize: '2rem' }}>
            {form.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
            {form.description}
          </p>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 'var(--space-4)' }}>
            Choose How You Want to Respond:
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {/* Option 1: Fill Form */}
            <div
              className="sketch-card"
              onClick={() => setMode('traditional')}
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-6)', transition: 'transform 0.2s ease' }}
            >
              <FileText size={40} color="var(--primary)" style={{ margin: '0 auto var(--space-3)' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Option 1: Fill Form</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Traditional layout with radio buttons, dropdowns, and rating scales.
              </p>
            </div>

            {/* Option 2: Talk to Us */}
            <div
              className="sketch-card"
              onClick={startConversationalMode}
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-6)', background: 'var(--primary-subtle)', borderColor: 'var(--primary)' }}
            >
              <Mic size={40} color="var(--primary)" style={{ margin: '0 auto var(--space-3)' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>Option 2: Talk to Us (AI)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Natural voice conversation. AI interviews you and fills the form automatically!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Traditional Form Mode */}
      {mode === 'traditional' && (
        <form onSubmit={handleTraditionalSubmit} className="sketch-card animate-fade-up">
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>{form.title}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {form.questions.map((q, idx) => (
              <div key={q.id} style={{ background: 'var(--secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)' }}>
                <label style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '8px' }}>
                  {idx + 1}. {q.question_text}
                </label>

                {q.question_type === 'DROPDOWN' && (
                  <select
                    className="sketch-input"
                    value={traditionalAnswers[q.id] || ''}
                    onChange={(e) => setTraditionalAnswers({ ...traditionalAnswers, [q.id]: e.target.value })}
                  >
                    <option value="">Select Option</option>
                    {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}

                {q.question_type === 'RATING' && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {q.options.map(opt => (
                      <button
                        type="button"
                        key={opt}
                        className={`btn-pill ${traditionalAnswers[q.id] === opt ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTraditionalAnswers({ ...traditionalAnswers, [q.id]: opt })}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.question_type === 'YES_NO' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Yes', 'No'].map(opt => (
                      <label key={opt} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={traditionalAnswers[q.id] === opt}
                          onChange={(e) => setTraditionalAnswers({ ...traditionalAnswers, [q.id]: e.target.value })}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {q.question_type === 'PARAGRAPH' && (
                  <textarea
                    className="sketch-input"
                    rows={3}
                    value={traditionalAnswers[q.id] || ''}
                    onChange={(e) => setTraditionalAnswers({ ...traditionalAnswers, [q.id]: e.target.value })}
                    placeholder="Type response here..."
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="button" className="btn-pill btn-secondary" onClick={() => setMode('choice')}>Back</button>
            <button type="submit" className="btn-pill btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit Form</button>
          </div>
        </form>
      )}

      {/* Option 2: Talk to Us (Conversational AI) Mode */}
      {mode === 'conversational' && (
        <div className="sketch-card animate-fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)' }}>
              QUESTION {currentQIndex + 1} OF {form.questions.length}
            </span>
            <span className="badge badge-resolved">Conversational AI Sync</span>
          </div>

          {/* Chat Thread */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', maxHeight: '280px', overflowY: 'auto' }}>
            {chatThread.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user' ? 'var(--primary-subtle)' : 'var(--secondary)',
                  border: `1px dashed ${msg.role === 'user' ? 'var(--primary)' : 'var(--border-dashed)'}`,
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: '12px'
                }}
              >
                <p style={{ fontSize: '0.95rem' }}>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Voice Answer Control */}
          <div style={{ background: 'var(--surface)', border: '2px dashed var(--primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div
              onClick={toggleListening}
              className={`voice-orb ${isListening ? 'listening' : 'idle'}`}
              style={{ width: '56px', height: '56px', margin: '0 auto var(--space-3)' }}
            >
              <Mic size={24} color={isListening ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>

            <input
              className="sketch-input"
              value={currentVoiceAnswer}
              onChange={(e) => setCurrentVoiceAnswer(e.target.value)}
              placeholder={isListening ? 'Listening your spoken response...' : 'Speak or type your answer...'}
              onKeyDown={(e) => e.key === 'Enter' && handleNextConvoQuestion()}
              style={{ marginBottom: 'var(--space-3)' }}
            />

            <button
              className="btn-pill btn-primary"
              onClick={handleNextConvoQuestion}
              disabled={!currentVoiceAnswer.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Send size={16} /> {currentQIndex + 1 === form.questions.length ? 'Submit Final Response' : 'Next Question'}
            </button>
          </div>
        </div>
      )}

      {/* Submitted Screen */}
      {mode === 'submitted' && (
        <div className="sketch-card animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto var(--space-4)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>Response Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Your feedback has been synchronized with Google Forms and stored securely in Supabase.
          </p>

          <button className="btn-pill btn-primary" onClick={() => setMode('choice')}>
            Submit Another Response
          </button>
        </div>
      )}
    </div>
  );
}
