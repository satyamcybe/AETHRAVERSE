import React, { useState } from 'react';
import { LayoutDashboard, AlertCircle, CheckCircle2, Users, TrendingUp, Mic, ArrowUpRight, ChevronRight, Play, Download, Sparkles, PieChart, Shield, FileSpreadsheet, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_CLUSTERS = [
  {
    id: 'CLUST-101',
    title: 'Lab 304 Computer Performance & Boot Freezes',
    priority: 'CRITICAL',
    reportsCount: 43,
    department: 'IT Infrastructure',
    status: 'In Progress',
    sentiment: 'Negative',
    emotionalIntensity: 'High (8.4/10)',
    urgencyScore: 'Urgent (92%)',
    aiSummary: 'Students consistently report slow boot times (>5 min), system freezes during practicals, and projector bulb outages in Room 305.',
    recommendedAction: 'Inspect Lab 304 systems, replace projector lamp, upgrade RAM to 16GB.',
    sampleVoices: [
      'The projector in Room 305 has not been working for two weeks, making it difficult to follow lectures.',
      'Computers freeze halfway through practical exams.'
    ]
  },
  {
    id: 'CLUST-102',
    title: 'Library 2nd Floor Wi-Fi Signal Dropouts',
    priority: 'HIGH',
    reportsCount: 31,
    department: 'Network Operations',
    status: 'Assigned',
    sentiment: 'Negative',
    emotionalIntensity: 'Medium (6.2/10)',
    urgencyScore: 'High (78%)',
    aiSummary: 'Signal drops regularly on 2nd floor during afternoon study hours.',
    recommendedAction: 'Deploy two additional Wi-Fi access points on 2nd floor ceiling.',
    sampleVoices: ['Wi-Fi keeps disconnecting every 10 minutes near the reference section.']
  }
];

export default function AdminDashboardPage({ user }) {
  const [selectedCluster, setSelectedCluster] = useState(MOCK_CLUSTERS[0]);

  const stats = {
    total: 428,
    today: 12,
    activeComplaints: 31,
    resolutionRate: '87%',
    avgSatisfaction: '4.6 / 5',
    voicePercentage: '74%'
  };

  const facultyAnalytics = [
    { name: 'Dr. Robert Vance (CS)', rating: '4.8', trend: '↑ +0.3', summary: 'Appreciated for practical examples, students note slightly fast pace.' },
    { name: 'Prof. Ananya Sharma (Math)', rating: '4.2', trend: '↑ +0.1', summary: 'Clear concepts, high punctuality scores.' }
  ];

  const exportReport = (format) => {
    alert(`Exporting ${format} institutional report for Accreditation (NAAC/NBA ready)...`);
  };

  return (
    <div className="page-container">
      {/* Executive Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Executive Command Center
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-1)' }}>
            Institutional Feedback Intelligence
          </h1>
        </div>

        {/* NAAC/NBA Export & AI Form Generator Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Link to="/ai-form-generator" className="btn-pill btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Sparkles size={14} /> AI Google Form Generator
          </Link>
          <button className="btn-pill btn-secondary" onClick={() => exportReport('PDF')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Download size={14} /> PDF Report
          </button>
          <button className="btn-pill btn-secondary" onClick={() => exportReport('Excel')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <FileSpreadsheet size={14} /> NAAC Excel Export
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Submissions', val: stats.total },
          { label: "Today's Feedback", val: stats.today },
          { label: 'Active Complaints', val: stats.activeComplaints },
          { label: 'Resolution Rate', val: stats.resolutionRate },
          { label: 'Avg Satisfaction', val: stats.avgSatisfaction },
          { label: 'Voice Feedback %', val: stats.voicePercentage },
        ].map((kpi, idx) => (
          <div key={idx} className="metric-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              {kpi.label}
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>
              {kpi.val}
            </div>
          </div>
        ))}
      </div>

      {/* AI Smart Categorization & Issues List */}
      <div className="responsive-grid-admin" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Left: AI Merged Clusters */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-3)' }}>
            <Sparkles size={16} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>AI Merged Issue Clusters</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {MOCK_CLUSTERS.map(c => (
              <div
                key={c.id}
                className="sketch-card"
                onClick={() => setSelectedCluster(c)}
                style={{
                  cursor: 'pointer',
                  borderColor: selectedCluster?.id === c.id ? 'var(--primary)' : undefined,
                  padding: 'var(--space-4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                  <span className="badge badge-critical">{c.priority}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--danger)' }}>
                    {c.urgencyScore}
                  </span>
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {c.reportsCount} merged reports · {c.department}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Cluster AI Insights */}
        {selectedCluster && (
          <div className="sketch-card animate-fade-up">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)' }}>{selectedCluster.id}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginTop: '2px' }}>{selectedCluster.title}</h3>

            <div style={{ background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)', margin: 'var(--space-4) 0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase' }}>AI EXECUTIVE SUMMARY</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '2px' }}>{selectedCluster.aiSummary}</p>
            </div>

            <div className="responsive-form-grid" style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-dashed)', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sentiment Score</span>
                <p style={{ fontWeight: 700, color: 'var(--danger)' }}>{selectedCluster.sentiment}</p>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-dashed)', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Emotional Intensity</span>
                <p style={{ fontWeight: 700 }}>{selectedCluster.emotionalIntensity}</p>
              </div>
            </div>

            <div style={{ background: 'var(--primary-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--primary)', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)' }}>RECOMMENDED ADMINISTRATIVE ACTION</span>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{selectedCluster.recommendedAction}</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <a href="/tracker" className="btn-pill btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                Open 7-Stage Tracker
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Faculty Performance Analytics */}
      <div className="sketch-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>
          Faculty Performance & Engagement Analytics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          {facultyAnalytics.map((fac, i) => (
            <div key={i} style={{ background: 'var(--secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fac.name}</h4>
                <span className="badge badge-resolved">{fac.rating} ★</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{fac.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
