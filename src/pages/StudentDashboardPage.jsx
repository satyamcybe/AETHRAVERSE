import React, { useState } from 'react';
import { User, Bell, Clock, CheckCircle2, AlertCircle, FileText, Bookmark, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboardPage({ user }) {
  const [activeTab, setActiveTab] = useState('active');

  const mySubmissions = [
    {
      id: 'FB-2026-01482',
      title: 'Lab 304 Projector & Boot Freezes',
      category: 'Infrastructure',
      status: 'In Progress',
      date: '2026-09-01',
      dept: 'IT Infrastructure',
      type: 'Active'
    },
    {
      id: 'FB-2026-01483',
      title: 'Library 2nd Floor Wi-Fi Dead Zones',
      category: 'Infrastructure',
      status: 'Assigned',
      date: '2026-09-02',
      dept: 'Network Operations',
      type: 'Active'
    },
    {
      id: 'FB-2026-01300',
      title: 'Canteen Sanitation & Dispenser',
      category: 'Infrastructure',
      status: 'Closed',
      date: '2026-08-28',
      dept: 'Campus Facilities',
      type: 'Resolved'
    }
  ];

  const notifications = [
    { title: 'Status Update on FB-2026-01482', desc: 'IT Dept changed status to In Progress (Technician Assigned)', time: '2 hours ago' },
    { title: 'Admin Replied to direct message', desc: 'Spare parts received. Repair scheduled for tomorrow.', time: 'Yesterday' },
    { title: 'Semester Feedback Published', desc: 'Spring 2026 semester resolution report is now live.', time: '3 days ago' },
  ];

  return (
    <div className="page-container">
      {/* Student Profile Banner */}
      <div className="sketch-card" style={{ marginBottom: 'var(--space-6)', background: 'var(--primary-subtle)', borderColor: 'var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>
              STUDENT PROFILE
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginTop: '2px' }}>
              Welcome back, {user?.name || 'Ayush Giri'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              PRN: {user?.id || 'STU-2026-88'} · Dept of {user?.department || 'Computer Engineering'} (Sem 6)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/feedback" className="btn-pill btn-primary">
              + New Voice/Text Feedback
            </Link>
          </div>
        </div>
      </div>

      <div className="responsive-grid-dashboard">
        {/* Left Column: Submissions History Tabs */}
        <div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            {['active', 'resolved', 'drafts'].map((tab) => (
              <button
                key={tab}
                className={`btn-pill ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab(tab)}
                style={{ fontSize: '0.8rem', textTransform: 'capitalize', padding: '4px 12px' }}
              >
                {tab} Complaints
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {mySubmissions
              .filter(s => activeTab === 'all' || (activeTab === 'active' && s.type === 'Active') || (activeTab === 'resolved' && s.type === 'Resolved'))
              .map(item => (
                <div key={item.id} className="sketch-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>{item.id}</span>
                    <h4 style={{ fontSize: '0.95rem', marginTop: '2px', fontWeight: 600 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.category} · {item.dept} · {item.date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span className={`badge ${item.status === 'Closed' ? 'badge-resolved' : 'badge-high'}`}>{item.status}</span>
                    <Link to="/tracker" className="btn-pill btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      Track
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Column: Notification Center */}
        <div className="sketch-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Notification Center</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {notifications.map((notif, idx) => (
              <div key={idx} style={{ background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{notif.title}</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{notif.desc}</p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{notif.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
