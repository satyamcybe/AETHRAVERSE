import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, Clock, AlertCircle, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  'UNDER REVIEW': { badge: 'badge-review', label: 'Under Review' },
  'ASSIGNED': { badge: 'badge-medium', label: 'Assigned' },
  'IN PROGRESS': { badge: 'badge-high', label: 'In Progress' },
  'RESOLVED': { badge: 'badge-resolved', label: 'Resolved' },
  'CLOSED': { badge: 'badge-resolved', label: 'Closed' },
  'REOPENED': { badge: 'badge-critical', label: 'Reopened' },
};

export default function MyFeedbackPage({ feedbacks }) {
  const [selected, setSelected] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = (resolved) => {
    setVerifying(false);
    // In real app, would call api.verifyResolution
    alert(resolved ? 'Thanks for closing the loop! ✓' : 'Issue reopened — we\'ll follow up.');
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Feedback Tracking
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: 'var(--space-2)' }}>
          My Feedback
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track every piece of feedback from submission to resolution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: 'var(--space-6)' }}>
        {/* Feedback List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {feedbacks.length === 0 ? (
            <div className="sketch-card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--space-4)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>No feedback yet.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your first conversation can start a change.</p>
            </div>
          ) : (
            feedbacks.map(fb => {
              const cfg = STATUS_CONFIG[fb.status] || STATUS_CONFIG['UNDER REVIEW'];
              return (
                <div
                  key={fb.id}
                  className="sketch-card"
                  onClick={() => setSelected(fb)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selected?.id === fb.id ? 'var(--primary)' : undefined,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{fb.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {fb.department} · {new Date(fb.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Detail */}
        {selected && (
          <div className="sketch-card animate-fade-up" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{selected.title}</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selected.department} · {selected.similarCount} similar reports
                </p>
              </div>
              <span className={`badge ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG['UNDER REVIEW']).badge}`}>
                {(STATUS_CONFIG[selected.status] || STATUS_CONFIG['UNDER REVIEW']).label}
              </span>
            </div>

            {/* Issue Timeline */}
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Issue Lifecycle
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {[
                { label: 'Reported', done: true },
                { label: 'AI Analyzed', done: true },
                { label: 'Issue Identified', done: true },
                { label: 'Assigned', done: ['ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].includes(selected.status) },
                { label: 'In Progress', done: ['IN PROGRESS', 'RESOLVED', 'CLOSED'].includes(selected.status), active: selected.status === 'IN PROGRESS' },
                { label: 'Resolved', done: ['RESOLVED', 'CLOSED'].includes(selected.status), active: selected.status === 'RESOLVED' },
                { label: 'Confirmed', done: selected.status === 'CLOSED' },
              ].map(({ label, done, active }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className={`timeline-dot ${done ? 'completed' : ''} ${active ? 'active' : ''}`}>
                    {done && <CheckCircle2 size={10} color="#fff" style={{ display: 'block', margin: 'auto' }} />}
                  </div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 400,
                    color: done ? 'var(--text)' : 'var(--text-muted)'
                  }}>{label}</span>
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
                Your original voice
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                "{selected.transcript}"
              </p>
            </div>

            {/* Verification prompt (for resolved) */}
            {selected.status === 'RESOLVED' && !verifying && (
              <div className="sketch-card" style={{
                borderColor: 'var(--primary)',
                background: 'var(--primary-subtle)',
                textAlign: 'center',
                padding: 'var(--space-6)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>
                  Was the problem actually fixed?
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
                  Your verification closes the feedback loop.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                  <button className="btn-pill btn-primary" onClick={() => handleVerify(true)} style={{ fontSize: '1.1rem', padding: 'var(--space-3) var(--space-8)' }}>
                    <ThumbsUp size={20} /> Yes
                  </button>
                  <button className="btn-pill btn-secondary" onClick={() => handleVerify(false)} style={{ fontSize: '1.1rem', padding: 'var(--space-3) var(--space-8)' }}>
                    <ThumbsDown size={20} /> No
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
