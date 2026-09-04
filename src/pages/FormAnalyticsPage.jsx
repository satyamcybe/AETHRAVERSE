import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart2, PieChart, TrendingUp, Users, Mic, FileText, Download, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function FormAnalyticsPage({ user }) {
  const { formId } = useParams();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [formId]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/forms/${formId || 'FORM-2026-101'}/analytics`);
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.warn('Using fallback analytics');
      setAnalytics({
        form_title: 'Spring 2026 Faculty & Lab Assessment',
        total_responses: 42,
        completion_rate: '94%',
        voice_response_percentage: '76%',
        average_satisfaction: '4.3 / 5',
        anonymous_percentage: '38%',
        department_distribution: [
          { department: 'Computer Engineering', count: 18 },
          { department: 'Information Tech', count: 12 },
          { department: 'Mechanical', count: 8 },
          { department: 'Civil', count: 4 }
        ],
        keywords_cloud: [
          { text: 'Wi-Fi', count: 28 },
          { text: 'Projector', count: 22 },
          { text: 'Lab computers', count: 19 },
          { text: 'Practical sessions', count: 15 },
          { text: 'Library timing', count: 12 },
          { text: 'Canteen hygiene', count: 9 }
        ]
      });
    }
  };

  if (!analytics) return <div className="page-center">Loading Real-Time Supabase Analytics...</div>;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link to="/ai-form-generator" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '4px', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Form Generator
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)' }}>
            {analytics.form_title} — Real-Time Analytics
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-pill btn-secondary" onClick={() => alert('Exporting Analytics to PDF / CSV...')} style={{ fontSize: '0.8rem' }}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Responses', val: analytics.total_responses, icon: Users },
          { label: 'Completion Rate', val: analytics.completion_rate, icon: CheckCircle2 },
          { label: 'Voice Response %', val: analytics.voice_response_percentage, icon: Mic },
          { label: 'Avg Satisfaction', val: analytics.average_satisfaction, icon: TrendingUp },
          { label: 'Anon Participation', val: analytics.anonymous_percentage, icon: FileText }
        ].map((kpi, idx) => (
          <div key={idx} className="metric-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpi.label}</span>
              <kpi.icon size={16} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginTop: '4px' }}>
              {kpi.val}
            </div>
          </div>
        ))}
      </div>

      {/* Infographics & Analytics Panels */}
      <div className="responsive-grid-admin" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Department Participation Breakdown */}
        <div className="sketch-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-4)' }}>
            Department Participation Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {analytics.department_distribution.map((dept, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '2px' }}>
                  <span>{dept.department}</span>
                  <span style={{ fontWeight: 700 }}>{dept.count} responses</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(dept.count / analytics.total_responses) * 100}%`, height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Word Cloud Keywords */}
        <div className="sketch-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-4)' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
              AI Word Cloud & Key Issues
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {analytics.keywords_cloud.map((kw, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 14px',
                  background: 'var(--primary-subtle)',
                  border: '1px dashed var(--primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: `${Math.min(1.3, 0.75 + kw.count / 25)}rem`,
                  fontWeight: 600,
                  color: 'var(--primary)'
                }}
              >
                {kw.text} ({kw.count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
