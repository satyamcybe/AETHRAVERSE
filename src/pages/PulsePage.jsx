import React from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart3, CheckCircle2, Users } from 'lucide-react';

export default function PulsePage() {
  const overallScore = 78;

  const categories = [
    { label: 'Teaching', score: 87, color: 'var(--success)' },
    { label: 'Infrastructure', score: 71, color: 'var(--warning)' },
    { label: 'Facilities', score: 64, color: 'var(--danger)' },
    { label: 'Events', score: 84, color: 'var(--primary)' },
    { label: 'Administration', score: 76, color: 'var(--info)' },
  ];

  const trending = [
    { label: 'Wi-Fi complaints', change: '+31%', up: true },
    { label: 'Lab equipment issues', change: '+24%', up: true },
    { label: 'Canteen complaints', change: '-18%', up: false },
    { label: 'Parking concerns', change: '+12%', up: true },
    { label: 'Library hours', change: '-8%', up: false },
  ];

  const resolution = {
    resolved: 311,
    userConfirmed: 276,
    reopened: 35,
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Analytics
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: 'var(--space-2)' }}>
          Experience Pulse
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          High-level sentiment trends and resolution effectiveness.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Overall Pulse Score */}
        <div className="sketch-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Overall Experience
          </span>

          <div style={{
            width: '160px', height: '160px',
            borderRadius: '50%',
            border: '4px dashed var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: 'var(--space-6) auto',
            background: 'var(--primary-subtle)',
            position: 'relative'
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--primary)' }}>
              {overallScore}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textAlign: 'left', marginTop: 'var(--space-4)' }}>
            {categories.map(({ label, score, color }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '110px', flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: '10px', background: 'var(--secondary)', borderRadius: '5px', border: '1px dashed var(--border-dashed)', overflow: 'hidden' }}>
                  <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '5px', transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color, width: '30px', textAlign: 'right' }}>{score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending + Resolution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Trending */}
          <div className="sketch-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Activity size={18} color="var(--primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Trending</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {trending.map(({ label, change, up }, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-2) 0',
                  borderBottom: i < trending.length - 1 ? '1px dashed var(--border-dashed)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {up ? <TrendingUp size={14} color="var(--danger)" /> : <TrendingDown size={14} color="var(--success)" />}
                    <span style={{ fontSize: '0.9rem' }}>{label}</span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: up ? 'var(--danger)' : 'var(--success)'
                  }}>{change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Analytics */}
          <div className="sketch-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <BarChart3 size={18} color="var(--primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Resolution Effectiveness</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)' }}>
                  {resolution.resolved}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  Resolved
                </span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--success)' }}>
                  {resolution.userConfirmed}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  User Verified
                </span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--danger)' }}>
                  {resolution.reopened}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  Reopened
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--primary-subtle)',
              border: '1px dashed var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              marginTop: 'var(--space-4)',
              textAlign: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                {Math.round(resolution.userConfirmed / resolution.resolved * 100)}% of resolved issues were verified by users
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
