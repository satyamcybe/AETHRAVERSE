import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { VoiceRecognitionService, speakText } from '../services/speechService';
import { analyzeFeedbackWithGemini } from '../services/geminiService';

export default function VoiceFeedbackView({ onFeedbackSubmitted }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [step, setStep] = useState('record'); // record | review | confirmed

  useEffect(() => {
    const speechService = new VoiceRecognitionService(
      (newText) => setTranscript(newText),
      (err) => console.log(err),
      () => setIsListening(false)
    );
    window._speechService = speechService;
  }, []);

  const toggleListen = () => {
    if (isListening) {
      window._speechService?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      window._speechService?.start();
      setIsListening(true);
    }
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    window._speechService?.stop();
    setIsListening(false);
    setAnalyzing(true);

    const result = await analyzeFeedbackWithGemini(transcript);
    setAiAnalysis(result);
    setAnalyzing(false);
    setStep('review');

    if (result.clarificationQuestion) {
      speakText(result.clarificationQuestion);
    } else {
      speakText("I've summarized your feedback. Please review it before submitting.");
    }
  };

  const handleSubmit = () => {
    setStep('confirmed');
    speakText("Thank you! Your feedback has been recorded and grouped for resolution.");
    if (onFeedbackSubmitted) {
      onFeedbackSubmitted({
        id: Date.now(),
        transcript,
        analysis: aiAnalysis,
        status: 'In Progress',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-glow)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
          Conversational Voice Input
        </span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your voice. Your impact.
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Speak naturally instead of filling tedious forms. We'll transcribe, structure, and route it.
        </p>
      </div>

      {step === 'record' && (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative' }}>
          {/* Voice Orb */}
          <div 
            onClick={toggleListen}
            className={isListening ? 'voice-orb-active' : ''}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: isListening 
                ? 'radial-gradient(circle, var(--accent-cyan) 0%, var(--accent-primary) 100%)' 
                : 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)',
              border: '2px solid var(--accent-primary)',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isListening ? <Mic size={48} color="#fff" /> : <MicOff size={48} color="var(--text-dim)" />}
          </div>

          <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {isListening ? 'Listening to your speech...' : 'Tap the Orb to Speak'}
          </p>

          {isListening && (
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', height: '32px', alignItems: 'center', margin: '1rem 0' }}>
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>
          )}

          {/* Realtime transcript preview box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            minHeight: '100px',
            marginTop: '1.5rem',
            textAlign: 'left',
            color: transcript ? 'var(--text-main)' : 'var(--text-dim)',
            fontStyle: transcript ? 'normal' : 'italic'
          }}>
            {transcript || 'Your spoken words will appear here in real time...'}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!transcript.trim() || analyzing}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: transcript.trim() ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))' : '#1e293b',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              cursor: transcript.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={18} />
            {analyzing ? 'Analyzing with Gemini...' : 'Analyze Feedback'}
          </button>
        </div>
      )}

      {step === 'review' && aiAnalysis && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Sparkles color="var(--accent-cyan)" size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Structured Feedback</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Identified Issue</span>
              <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>{aiAnalysis.issue}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location / Context</span>
              <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>{aiAnalysis.location}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Impact Severity</span>
              <p style={{ fontWeight: 700, color: 'var(--status-high)', marginTop: '0.2rem' }}>{aiAnalysis.impact}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frequency</span>
              <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>{aiAnalysis.frequency}</p>
            </div>
          </div>

          {aiAnalysis.clarificationQuestion && (
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--accent-primary)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-glow)', fontWeight: 600 }}>Clarification Prompt:</p>
              <p style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>{aiAnalysis.clarificationQuestion}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setStep('record')}
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Re-record
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 2,
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-emerald), #059669)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Send size={18} />
              Confirm & Submit
            </button>
          </div>
        </div>
      )}

      {step === 'confirmed' && (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Feedback Recorded!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            43 similar experiences were clustered together. Your issue is assigned to IT Infrastructure for resolution.
          </p>
          <button
            onClick={() => { setStep('record'); setTranscript(''); setAiAnalysis(null); }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Submit Another Feedback
          </button>
        </div>
      )}
    </div>
  );
}
