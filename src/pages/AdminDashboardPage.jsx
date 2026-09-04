import React, { useState } from 'react';
import { LayoutDashboard, AlertCircle, CheckCircle2, Users, TrendingUp, Mic, ArrowUpRight, ChevronRight, Play } from 'lucide-react';

const PRIORITY_BADGE = {
  CRITICAL: 'badge-critical',
  HIGH: 'badge-high',
  MEDIUM: 'badge-medium',
  LOW: 'badge-low',
};

// Pre-clustered issues for demo
const MOCK_ISSUES = [
  {
    id: 'ISSUE-101',
    title: 'Lab 304 Computer Performance & Boot Freezes',
    priority: 'CRITICAL',
    reportsCount: 43,
    department: 'IT Infrastructure',
    status: 'IN PROGRESS',
    impactTrend: '+31%',
    aiSummary: 'Students consistently report slow boot times (>5 min), system freezes during practicals, and frequent blue screens. Multiple labs affected, with Lab 304 being the worst.',
    themes: [
      { label: 'Slow boot', pct: 85 },
      { label: 'System freezing', pct: 62 },
      { label: 'Old hardware', pct: 45 },
      { label: 'Software issues', pct: 30 },
    ],
    sampleVoice: 'The PCs take forever to start and sometimes completely freeze during our practical exams.',
    recommendedAction: 'Inspect Lab 304 systems, prioritize RAM upgrades and SSD replacements.',
  },
  {
    id: 'ISSUE-102',
    title: 'Library 2nd Floor Wi-Fi Dead Zones',
    priority: 'HIGH',
    reportsCount: 31,
    department: 'Network Operations',
    status: 'ASSIGNED',
    impactTrend: '+18%',
    aiSummary: 'Intermittent signal drops on the 2nd floor prevent students from accessing digital databases during study sessions, especially at peak afternoon hours.',
    themes: [
      { label: 'Signal drops', pct: 78 },
      { label: 'Peak hours', pct: 55 },
      { label: 'Database access', pct: 40 },
    ],
    sampleVoice: 'The Wi-Fi keeps dropping when I try to use the library databases for research.',
    recommendedAction: 'Install additional access points on Library 2nd floor, check channel interference.',
  },
  {
    id: 'ISSUE-103',
    title: 'Timetable Scheduling Conflicts',
    priority: 'MEDIUM',
    reportsCount: 18,
    department: 'Academic Affairs',
    status: 'UNDER REVIEW',
    impactTrend: '+8%',
    aiSummary: 'Several students report overlapping lecture and lab slots, causing them to miss one or the other.',
    themes: [
      { label: 'Overlap', pct: 70 },
      { label: 'Lab vs Lecture', pct: 50 },
    ],
    sampleVoice: 'My database lab and operating systems lecture are at the exact same time on Wednesdays.',
    recommendedAction: 'Review Wednesday timetable for CSE 3rd year, resolve slot collision.',
  },
];

export default function AdminDashboardPage({ feedbacks, setFeedbacks }) {
  const [issues] = useState(MOCK_ISSUES);
  const [selected, setSelected] = useState(issues[0]);

  const stats = {
    total: 428,
    negative: 86,
    pending: 31,
    resolved: 311,
    verifiedRate: 89
  };

  const handleResolve = (issueId) => {
    setSelected(prev => prev.id === issueId ? { ...prev, status: 'RESOLVED' } : prev);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Command Center
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: 'var(--space-1)' }}>
          Feedback Command Center
        </h1>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Total Submissions', value: stats.total, icon: Users, color: 'var(--text)' },
          { label: 'Negative Sentiment', value: stats.negative, icon: AlertCircle, color: 'var(--danger)' },
          { label: 'Pending Action', value: stats.pending, icon: TrendingUp, color: 'var(--warning)' },
          { label: 'Resolved Issues', value: stats.resolved, icon: CheckCircle2, color: 'var(--success)' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </span>
              <Icon size={16} color={color} />
            </div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'var(--space-6)' }}>
        {/* Issue List */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <LayoutDashboard size={14} /> Needs Attention
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {issues.map(issue => (
              <div
                key={issue.id}
                className="sketch-card"
                onClick={() => setSelected(issue)}
                style={{
                  cursor: 'pointer',
                  borderColor: selected?.id === issue.id ? 'var(--primary)' : undefined,
                  padding: 'var(--space-4) var(--space-6)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span className={`badge ${PRIORITY_BADGE[issue.priority]}`}>{issue.priority}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {issue.reportsCount} reports
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>{issue.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{issue.department}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: issue.impactTrend.startsWith('+') ? 'var(--danger)' : 'var(--success)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    ↑ {issue.impactTrend} this week
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Detail */}
        {selected && (
          <div className="sketch-card animate-fade-up" style={{ padding: 'var(--space-6)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)' }}>{selected.id}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: '2px' }}>{selected.title}</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selected.reportsCount} reports · {selected.department}
                </p>
              </div>
              <span className={`badge ${PRIORITY_BADGE[selected.priority]}`}>{selected.priority}</span>
            </div>

            {/* AI Summary */}
            <div style={{
              background: 'var(--secondary)',
              border: '1px dashed var(--border-dashed)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Summary
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
                {selected.aiSummary}
              </p>
            </div>

            {/* Common Themes */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                Common Themes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {selected.themes.map(({ label, pct }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '120px', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--secondary)', borderRadius: '4px', border: '1px dashed var(--border-dashed)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', width: '36px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Voice Feedback */}
            <div style={{
              background: 'var(--secondary)',
              border: '1px dashed var(--border-dashed)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-subtle)',
                border: '1px dashed var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Mic size={14} color="var(--primary)" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>ORIGINAL VOICE FEEDBACK</span>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  "{selected.sampleVoice}"
                </p>
                <button className="btn-ghost" style={{ fontSize: '0.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Play size={12} /> Play original
                </button>
              </div>
            </div>

            {/* Recommended Action */}
            <div style={{
              background: 'var(--primary-subtle)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase' }}>
                Recommended Action
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginTop: '4px', fontWeight: 500 }}>
                {selected.recommendedAction}
              </p>
            </div>

            {/* Action Buttons */}
            {selected.status !== 'RESOLVED' ? (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn-pill btn-secondary" style={{ flex: 1 }}>
                  Assign Issue
                </button>
                <button className="btn-pill btn-primary" onClick={() => handleResolve(selected.id)} style={{ flex: 1 }}>
                  <CheckCircle2 size={16} /> Resolve & Verify
                </button>
              </div>
            ) : (
              <div style={{
                background: 'var(--success-subtle)',
                border: '1px dashed var(--success)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-4)',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={20} color="var(--success)" style={{ margin: '0 auto var(--space-2)', display: 'block' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>
                  Resolved — verification sent to {selected.reportsCount} users
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
