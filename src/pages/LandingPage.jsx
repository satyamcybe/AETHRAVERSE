import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, Sparkles, CheckCircle2, Users, BarChart3, MessageSquare, Shield, Globe, Eye, Lock, QrCode } from 'lucide-react';

export default function LandingPage({ user }) {
  const [showQR, setShowQR] = useState(false);
  const [language, setLanguage] = useState('en');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: highContrast ? '#000000' : 'var(--background)',
      color: highContrast ? '#FFFF00' : 'var(--text)',
      transition: 'all 0.3s ease'
    }}>
      {/* ── Top Bar / Header ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: '2px dashed var(--border-dashed)',
        flexWrap: 'wrap', gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--primary)' }}>LoopBack</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'var(--secondary)', padding: '2px 8px', borderRadius: '12px', border: '1px dashed var(--border-dashed)' }}>
            INSTITUTE
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Language selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--surface)', padding: '2px 6px', borderRadius: 'var(--radius-pill)', border: '1px dashed var(--border-dashed)' }}>
            <Globe size={12} color="var(--primary)" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {/* High Contrast Accessibility */}
          <button
            className="btn-pill btn-secondary"
            onClick={() => setHighContrast(!highContrast)}
            style={{ fontSize: '0.75rem', padding: '4px 10px', minHeight: '34px' }}
          >
            <Eye size={12} /> {highContrast ? 'Normal' : 'Contrast'}
          </button>

          {/* QR Code trigger */}
          <button
            className="btn-pill btn-secondary"
            onClick={() => setShowQR(!showQR)}
            style={{ fontSize: '0.75rem', padding: '4px 10px', minHeight: '34px' }}
          >
            <QrCode size={12} /> QR Code
          </button>

          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/student-dashboard'} className="btn-pill btn-primary" style={{ fontSize: '0.8rem', padding: '4px 12px', minHeight: '34px' }}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-pill btn-primary" style={{ fontSize: '0.8rem', padding: '4px 12px', minHeight: '34px' }}>
              <Shield size={14} /> Login
            </Link>
          )}
        </div>
      </nav>

      {/* QR Modal */}
      {showQR && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="sketch-card animate-scale-in" style={{ maxWidth: '320px', width: '100%', textAlign: 'center', padding: 'var(--space-6)', background: '#fff' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Campus Instant Access</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Scan with any phone camera. No app download required.</p>
            <div style={{ width: '160px', height: '160px', margin: '0 auto var(--space-4)', background: '#f0f0f0', border: '2px dashed var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              <QrCode size={100} color="var(--primary)" />
            </div>
            <button className="btn-pill btn-secondary" onClick={() => setShowQR(false)} style={{ width: '100%', justifyContent: 'center' }}>Close</button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-4) var(--space-6)',
        maxWidth: '840px',
        margin: '0 auto'
      }}>
        <div className="animate-fade-up">
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
            display: 'inline-block',
            padding: '4px 12px',
            background: 'var(--primary-subtle)',
            borderRadius: 'var(--radius-pill)',
            border: '1px dashed var(--primary)',
            marginBottom: 'var(--space-4)'
          }}>
            Voice Feedback & Action Tracker
          </span>
        </div>

        <h1 className="animate-fade-up" style={{
          fontFamily: 'var(--font-display)',
          lineHeight: 1.15,
          color: highContrast ? '#FFFF00' : 'var(--text)',
          marginBottom: 'var(--space-4)',
        }}>
          Transform feedback into transparent institutional action.
        </h1>

        <p className="animate-fade-up" style={{
          fontSize: '1rem',
          color: highContrast ? '#FFFFFF' : 'var(--text-secondary)',
          maxWidth: '620px',
          margin: '0 auto var(--space-6)',
          lineHeight: 1.6,
        }}>
          Speak naturally in English, Hindi, or Marathi. AI structures your feedback, routes it to the right department, and keeps you updated until resolution.
        </p>

        {/* Action Callouts */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          <Link to="/feedback" className="btn-pill btn-primary" style={{ fontSize: '0.95rem', padding: 'var(--space-3) var(--space-6)' }}>
            <Mic size={18} /> Speak Your Feedback
          </Link>
          <Link to="/tracker" className="btn-pill btn-secondary" style={{ fontSize: '0.95rem', padding: 'var(--space-3) var(--space-6)' }}>
            Track Status <ArrowRight size={16} />
          </Link>
        </div>

        {/* Confidentiality / Privacy Notice */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--secondary)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', border: '1px dashed var(--border-dashed)' }}>
          <Lock size={12} color="var(--primary)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            100% Anonymous Mode Available · Strictly Confidential
          </span>
        </div>
      </section>

      {/* ── Key Institutional Modules ── */}
      <section style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          Institutional System Features
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>1. Multi-Language Voice AI</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Speech-to-text in English, Hindi, and Marathi with auto-punctuation, background noise reduction, and editable transcripts.
            </p>
          </div>

          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>2. Semester Evaluation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Structured end-of-semester faculty & campus infrastructure feedback with rating scales and reflection prompts.
            </p>
          </div>

          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>3. Action Taken Tracker</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              7-stage public progression timeline: Received → Verified → Assigned → Under Review → In Progress → Resolved → Closed.
            </p>
          </div>

          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>4. Two-Way Thread</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Direct conversation channel between students and department heads for updates, evidence, and clarifications.
            </p>
          </div>

          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>5. AI Clustering & Sentiment</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Automatic merging of duplicate complaints into single issue clusters with urgency ratings and emotional intensity scores.
            </p>
          </div>

          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>6. Accreditation Analytics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              One-click NAAC/NBA documentation exports (PDF, Excel) with demographic and faculty performance breakdowns.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: 'var(--space-6)', borderTop: '2px dashed var(--border-dashed)', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
        LoopBack Institutional Feedback Platform © 2026 · Confidential & Transparent
      </footer>
    </div>
  );
}
