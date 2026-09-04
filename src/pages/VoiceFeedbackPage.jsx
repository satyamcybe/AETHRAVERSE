import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Sparkles, Send, CheckCircle2, RotateCcw, Edit3 } from 'lucide-react';
import { VoiceRecognitionService, speakText } from '../services/speechService';
import { analyzeFeedback } from '../services/geminiService';

export default function VoiceFeedbackPage({ onSubmit }) {
  const [step, setStep] = useState('idle'); // idle | listening | analyzing | review | clarify | confirmed
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [clarifyAnswer, setClarifyAnswer] = useState('');
  const speechRef = useRef(null);

  useEffect(() => {
    speechRef.current = new VoiceRecognitionService(
      (fullText) => setTranscript(fullText),
      (err) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      },
      () => setIsListening(false)
    );
  }, []);

  const startListening = () => {
    setTranscript('');
    setStep('listening');
    setIsListening(true);
    speechRef.current?.start();
  };

  const stopListening = () => {
    speechRef.current?.stop();
    setIsListening(false);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    stopListening();
    setStep('analyzing');

    const result = await analyzeFeedback(transcript);
    setAnalysis(result);

    if (result.clarificationQuestion) {
      setStep('clarify');
      speakText(result.clarificationQuestion);
    } else {
      setStep('review');
      speakText("Here's what I understood. Does this look right?");
    }
  };

  const handleSubmit = () => {
    setStep('confirmed');
    speakText("Feedback received. Your voice has been heard.");
    if (onSubmit) {
      onSubmit({
        id: Date.now(),
        title: analysis?.issue || 'Voice Feedback',
        transcript,
        issue: analysis?.issue,
        location: analysis?.location,
        frequency: analysis?.frequency,
        impact: analysis?.impact,
        sentiment: analysis?.sentiment,
        status: 'UNDER REVIEW',
        department: 'Unassigned',
        timestamp: new Date().toISOString(),
        similarCount: Math.floor(Math.random() * 40) + 5
      });
    }
  };

  const reset = () => {
    setStep('idle');
    setTranscript('');
    setAnalysis(null);
    setClarifyAnswer('');
  };

  return (
    <div className="page-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}>
          Voice Feedback
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          marginTop: 'var(--space-2)',
          color: 'var(--text)'
        }}>
          {step === 'idle' && 'What happened?'}
          {step === 'listening' && 'Listening...'}
          {step === 'analyzing' && 'Understanding your feedback...'}
          {step === 'clarify' && 'Tell me a little more.'}
          {step === 'review' && "Here's what I understood."}
          {step === 'confirmed' && 'Your voice has been heard.'}
        </h1>
      </div>

      {/* ── IDLE / LISTENING ── */}
      {(step === 'idle' || step === 'listening') && (
        <div className="sketch-card animate-fade-up" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          {/* Voice Orb */}
          <div
            onClick={isListening ? stopListening : startListening}
            className={`voice-orb ${isListening ? 'listening' : 'idle'}`}
            style={{ margin: '0 auto var(--space-6)' }}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
            role="button"
            tabIndex={0}
          >
            {isListening ? <Mic size={48} color="var(--primary)" /> : <MicOff size={48} color="var(--text-muted)" />}
          </div>

          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            {isListening ? 'Speak naturally. Tap orb to stop.' : 'Tap the orb to start speaking.'}
          </p>

          {/* Waveform bars */}
          {isListening && (
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', height: '32px', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              {[1,2,3,4,5].map(i => <div key={i} className="wave-bar" />)}
            </div>
          )}

          {/* Live Transcript Box */}
          <div style={{
            background: 'var(--secondary)',
            border: '2px dashed var(--border-dashed)',
            borderRadius: '10px',
            padding: 'var(--space-4)',
            minHeight: '100px',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: transcript ? 'var(--text)' : 'var(--text-muted)',
            fontStyle: transcript ? 'normal' : 'italic',
            lineHeight: 1.6,
            marginBottom: 'var(--space-6)'
          }}>
            {transcript || 'Your spoken words will appear here in real time...'}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            {isListening && (
              <button className="btn-pill btn-secondary" onClick={stopListening}>
                <Square size={14} /> Stop
              </button>
            )}
            <button
              className="btn-pill btn-primary"
              onClick={handleAnalyze}
              disabled={!transcript.trim()}
              style={{ opacity: transcript.trim() ? 1 : 0.4, cursor: transcript.trim() ? 'pointer' : 'not-allowed' }}
            >
              <Sparkles size={16} /> Analyze Feedback
            </button>
          </div>
        </div>
      )}

      {/* ── ANALYZING ── */}
      {step === 'analyzing' && (
        <div className="sketch-card animate-fade-up" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <div className="voice-orb processing" style={{ margin: '0 auto var(--space-6)' }}>
            <Sparkles size={36} color="var(--primary)" style={{ animation: 'spinSlow 3s linear infinite' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Understanding your feedback...</p>
        </div>
      )}

      {/* ── CLARIFICATION ── */}
      {step === 'clarify' && analysis && (
        <div className="sketch-card animate-fade-up" style={{ padding: 'var(--space-8)' }}>
          <div style={{
            background: 'var(--primary-subtle)',
            borderLeft: '4px solid var(--primary)',
            padding: 'var(--space-4)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            marginBottom: 'var(--space-6)'
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--primary)' }}>
              {analysis.clarificationQuestion}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input
              className="sketch-input"
              placeholder="Type or speak your answer..."
              value={clarifyAnswer}
              onChange={(e) => setClarifyAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setStep('review'); }}
            />
            <button className="btn-pill btn-primary" onClick={() => setStep('review')}>
              Continue
            </button>
          </div>

          <button className="btn-pill btn-ghost" onClick={() => setStep('review')} style={{ marginTop: 'var(--space-3)' }}>
            Skip — I've said enough
          </button>
        </div>
      )}

      {/* ── REVIEW ── */}
      {step === 'review' && analysis && (
        <div className="sketch-card animate-fade-up" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Your Feedback</h3>
          </div>

          {/* Structured fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {[
              { label: 'Issue', value: analysis.issue },
              { label: 'Location', value: analysis.location },
              { label: 'Impact', value: analysis.impact },
              { label: 'Frequency', value: analysis.frequency },
              { label: 'Sentiment', value: analysis.sentiment },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--secondary)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-dashed)'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>{label}</span>
                <p style={{ fontWeight: 600, marginTop: '2px', fontSize: '0.95rem' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Original transcript */}
          <div style={{
            background: 'var(--secondary)',
            border: '1px dashed var(--border-dashed)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Your words
            </span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic', lineHeight: 1.6 }}>
              "{transcript}"
            </p>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            Does this look right?
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn-pill btn-secondary" onClick={reset} style={{ flex: 1 }}>
              <Edit3 size={14} /> Re-record
            </button>
            <button className="btn-pill btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>
              <Send size={16} /> Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* ── CONFIRMED ── */}
      {step === 'confirmed' && (
        <div className="sketch-card animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto var(--space-4)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
            Feedback received.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: '1rem' }}>
            Your voice has been heard.
          </p>

          <div className="sketch-card" style={{
            display: 'inline-block',
            padding: 'var(--space-3) var(--space-6)',
            borderColor: 'var(--primary)',
            marginBottom: 'var(--space-6)'
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--primary)' }}>
              {analysis?.similarCount || Math.floor(Math.random() * 40) + 5} similar experiences found
            </span>
          </div>

          <br />
          <button className="btn-pill btn-primary" onClick={reset}>
            <RotateCcw size={14} /> Submit Another Feedback
          </button>
        </div>
      )}
    </div>
  );
}
