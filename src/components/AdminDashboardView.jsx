import React, { useState } from 'react';
import { AlertCircle, Layers, CheckCircle2, ThumbsUp, ThumbsDown, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardView() {
  const [issues, setIssues] = useState([
    {
      id: 'ISSUE-101',
      title: 'Lab 304 Computer Performance & Boot Freezes',
      reportsCount: 43,
      department: 'IT Infrastructure',
      priority: 'HIGH',
      status: 'In Progress',
      impactTrend: '+31% this week',
      summary: 'Students report recurring slow boot times, freezing OS, and lost practical work during computer lab sessions.',
      confirmedByUsers: 28
    },
    {
      id: 'ISSUE-102',
      title: 'Library 2nd Floor Wi-Fi Signal Drops',
      reportsCount: 31,
      department: 'Network Operations',
      priority: 'MEDIUM',
      status: 'Under Review',
      impactTrend: '+18% this week',
      summary: 'Intermittent signal drops preventing access to digital research databases.',
      confirmedByUsers: 14
    },
    {
      id: 'ISSUE-103',
      title: 'Canteen Sanitation & Water Dispenser Filter',
      reportsCount: 19,
      department: 'Campus Facilities',
      priority: 'RESOLVED',
      status: 'Resolved',
      impactTrend: '-18% this week',
      summary: 'Water filters replaced and daily sanitation protocol upgraded.',
      confirmedByUsers: 19
    }
  ]);

  const [selectedIssue, setSelectedIssue] = useState(issues[0]);
  const [reopeningState, setReopeningState] = useState(false);

  const handleResolve = (id) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: 'Resolved' } : i));
    if (selectedIssue.id === id) {
      setSelectedIssue({ ...selectedIssue, status: 'Resolved' });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Voice Submissions</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>428</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>↑ 14% increase</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clustered Issues</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--accent-cyan)' }}>12</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI grouped complaints</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending High Priority</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--status-high)' }}>3</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--status-high)' }}>Requires immediate action</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Resolved Rate</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--accent-emerald)' }}>89%</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Verified by original users</span>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Issues List */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-primary)" />
            Active Issue Clusters
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {issues.map(issue => (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="glass-panel glass-panel-interactive"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderColor: selectedIssue.id === issue.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: selectedIssue.id === issue.id ? 'rgba(30, 41, 59, 0.8)' : 'rgba(19, 27, 46, 0.7)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    background: issue.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: issue.priority === 'HIGH' ? 'var(--status-high)' : 'var(--status-med)'
                  }}>
                    {issue.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{issue.reportsCount} User Voice Reports</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{issue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{issue.department}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Issue Detail & Loop Action */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          {selectedIssue ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{selectedIssue.id}</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>{selectedIssue.title}</h2>
                </div>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 700,
                  background: selectedIssue.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: selectedIssue.status === 'Resolved' ? 'var(--status-resolved)' : 'var(--accent-glow)'
                }}>
                  {selectedIssue.status}
                </span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AI Synthesized Summary</span>
                <p style={{ fontSize: '0.9rem', marginTop: '0.4rem', lineHeight: '1.5' }}>{selectedIssue.summary}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>LoopBack Verification Lifecycle</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <span>Reported & Voice Transcribed (43 voices)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <span>Gemini AI Clustered into Single Issue</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <span>Assigned to {selectedIssue.department}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    {selectedIssue.status === 'Resolved' ? <CheckCircle2 size={16} color="var(--accent-emerald)" /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />}
                    <span>Resolution Verification Sent to Givers</span>
                  </div>
                </div>
              </div>

              {selectedIssue.status !== 'Resolved' ? (
                <button
                  onClick={() => handleResolve(selectedIssue.id)}
                  style={{
                    width: '100%',
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
                  <CheckCircle2 size={18} />
                  Mark Action Resolved & Ask Users to Verify
                </button>
              ) : (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    Resolved! 28 users received verification prompt.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Select an issue to view resolution details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
