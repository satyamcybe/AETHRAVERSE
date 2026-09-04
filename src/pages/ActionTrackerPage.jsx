import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Send, MessageSquare, Shield, AlertCircle, FileText, Image } from 'lucide-react';

const STAGES = [
  'Received',
  'Verified',
  'Assigned',
  'Under Review',
  'In Progress',
  'Resolved',
  'Closed'
];

export default function ActionTrackerPage({ user }) {
  const [searchId, setSearchId] = useState('FB-2026-01482');
  const [activeItem, setActiveItem] = useState({
    id: 'FB-2026-01482',
    title: 'Lab 304 Projector & Computer Boot Issue',
    category: 'Infrastructure (Laboratories)',
    department: 'IT Infrastructure',
    currentStageIndex: 4, // In Progress
    createdAt: '2026-09-01 10:30 AM',
    expectedCompletion: '2026-09-06',
    adminRemarks: 'Spare replacement parts ordered. Technician assigned for physical installation.',
    evidenceUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=400&q=80',
    transcript: 'The projector in Room 305 has not been working for two weeks, making it difficult to follow lectures.',
    messages: [
      { sender: 'Student (STU-2026-88)', role: 'student', text: 'Any updates on when the technician will visit Room 305?', time: 'Sep 2, 11:00 AM' },
      { sender: 'Admin (IT Infrastructure)', role: 'admin', text: 'The technician has procured the spare parts and will fix it by tomorrow afternoon.', time: 'Sep 2, 03:30 PM' }
    ]
  });

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgObj = {
      sender: user?.name || (user?.role === 'admin' ? 'Admin Officer' : 'Student (STU-2026-88)'),
      role: user?.role === 'admin' ? 'admin' : 'student',
      text: newMessage,
      time: 'Just now'
    };

    setActiveItem(prev => ({
      ...prev,
      messages: [...prev.messages, msgObj]
    }));
    setNewMessage('');
  };

  const handleStageChange = (newIndex) => {
    setActiveItem(prev => ({
      ...prev,
      currentStageIndex: newIndex
    }));
  };

  return (
    <div className="page-container">
      {/* Search Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Transparent Action Engine
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: 'var(--space-1)' }}>
          Action Taken Tracker & Two-Way Thread
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 'var(--space-6)' }}>
          Monitor every stage of institutional complaints and communicate directly with resolving department heads.
        </p>

        {/* Tracking ID Search Bar */}
        <div className="sketch-card" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
          <input
            className="sketch-input"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Tracking ID (e.g. FB-2026-01482)"
            style={{ flex: 1 }}
          />
          <button className="btn-pill btn-primary">
            <Search size={16} /> Track Issue
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Left Column: 7-Stage Timeline + Resolution Proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="sketch-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{activeItem.id}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: '2px' }}>{activeItem.title}</h3>
              </div>
              <span className="badge badge-high">{STAGES[activeItem.currentStageIndex]}</span>
            </div>

            {/* Admin Controls to change stage */}
            {user?.role === 'admin' && (
              <div style={{ background: 'var(--primary-subtle)', padding: '8px 12px', borderRadius: '8px', marginBottom: 'var(--space-4)', border: '1px dashed var(--primary)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  ADMIN STAGE CONTROLS:
                </span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {STAGES.map((stg, idx) => (
                    <button
                      key={stg}
                      onClick={() => handleStageChange(idx)}
                      style={{
                        padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px',
                        border: '1px solid var(--primary)',
                        background: activeItem.currentStageIndex === idx ? 'var(--primary)' : 'transparent',
                        color: activeItem.currentStageIndex === idx ? '#fff' : 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 7-Stage Progression Timeline */}
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              7-Stage Progression Lifecycle
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {STAGES.map((stageName, idx) => {
                const isPassed = idx <= activeItem.currentStageIndex;
                const isCurrent = idx === activeItem.currentStageIndex;

                return (
                  <div key={stageName} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: isPassed ? 'var(--primary)' : 'var(--surface)',
                      border: `2px solid ${isPassed ? 'var(--primary)' : 'var(--border-dashed)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isPassed ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                    }}>
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: isCurrent ? 700 : 500, color: isPassed ? 'var(--text)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {stageName}
                        </span>
                        {isCurrent && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)' }}>ACTIVE STAGE</span>
                        )}
                      </div>

                      {isCurrent && (
                        <div style={{ background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginTop: '4px', border: '1px dashed var(--border-dashed)' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <strong>Admin Remarks:</strong> {activeItem.adminRemarks}
                          </p>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            Target Completion: {activeItem.expectedCompletion} · Dept: {activeItem.department}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resolution Evidence Placeholder */}
            {activeItem.currentStageIndex >= 5 && (
              <div style={{ background: 'var(--success-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--success)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  RESOLUTION PROOF & EVIDENCE ATTACHED:
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                  Work order completion certificate and new projector installation photos submitted.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn-pill btn-primary" style={{ fontSize: '0.8rem' }}>Satisfied (Close Issue)</button>
                  <button className="btn-pill btn-danger" style={{ fontSize: '0.8rem' }}>Needs Further Action</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Two-Way Conversation Thread */}
        <div className="sketch-card" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px dashed var(--border-dashed)' }}>
            <MessageSquare size={18} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Two-Way Direct Channel</h3>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: '4px' }}>
            {activeItem.messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'student' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'student' ? 'var(--primary-subtle)' : 'var(--secondary)',
                  border: `1px dashed ${msg.role === 'student' ? 'var(--primary)' : 'var(--border-dashed)'}`,
                  padding: 'var(--space-3)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: msg.role === 'student' ? 'var(--primary)' : 'var(--text)' }}>
                    {msg.sender}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Send message box */}
          <form onSubmit={handleSendMessage} style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
            <input
              className="sketch-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type reply or request progress update..."
            />
            <button type="submit" className="btn-pill btn-primary" style={{ padding: '0 16px' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
