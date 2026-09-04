import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, Sparkles, CheckCircle2, Users, BarChart3, MessageSquare, Shield } from 'lucide-react';

export default function LandingPage() {
  const orbRef = useRef(null);

  useEffect(() => {
    // Subtle parallax on the hero orb
    const handleMouse = (e) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-4) var(--space-8)',
        borderBottom: '2px dashed var(--border-dashed)'
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary)' }}>LoopBack</span>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <Link to="/admin" className="btn-ghost btn-pill" style={{ fontSize: '0.85rem' }}>Admin</Link>
          <Link to="/feedback" className="btn-pill btn-primary">
            <Mic size={16} /> Start a Conversation
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        textAlign: 'center',
        padding: 'var(--space-16) var(--space-6) var(--space-12)',
        maxWidth: '720px',
        margin: '0 auto'
      }}>
        <div className="animate-fade-up">
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 500,
            display: 'inline-block',
            padding: '4px 14px',
            background: 'var(--primary-subtle)',
            borderRadius: 'var(--radius-pill)',
            border: '1px dashed var(--primary)',
            marginBottom: 'var(--space-6)'
          }}>
            Voice-First Feedback Platform
          </span>
        </div>

        <h1 className="animate-fade-up" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1.1,
          color: 'var(--text)',
          marginBottom: 'var(--space-6)',
          animationDelay: '0.1s'
        }}>
          Your voice.<br />Your impact.
        </h1>

        <p className="animate-fade-up" style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '480px',
          margin: '0 auto var(--space-8)',
          lineHeight: 1.7,
          animationDelay: '0.2s'
        }}>
          Tell us what happened. We'll transcribe it, structure it, route it to the right team, and let you verify when it's fixed.
        </p>

        {/* Hero Orb */}
        <div className="animate-scale-in" style={{ animationDelay: '0.3s', marginBottom: 'var(--space-8)' }}>
          <Link to="/feedback" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div ref={orbRef} className="voice-orb idle" style={{
              width: '160px', height: '160px',
              margin: '0 auto',
              transition: 'transform 0.1s ease-out'
            }}>
              <Mic size={48} color="var(--primary)" />
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-4)'
            }}>
              Tap to start speaking
            </p>
          </Link>
        </div>

        <Link to="/feedback" className="btn-pill btn-primary animate-fade-up" style={{
          fontSize: '1rem',
          padding: 'var(--space-4) var(--space-8)',
          animationDelay: '0.4s'
        }}>
          Start a Conversation <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── How It Works ── */}
      <section style={{
        padding: 'var(--space-12) var(--space-6)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          textAlign: 'center',
          marginBottom: 'var(--space-10)',
          fontSize: '2.5rem'
        }}>
          How it works
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
          {[
            { icon: Mic, title: 'Speak naturally', desc: 'No forms. Just tell us what happened in your own words.' },
            { icon: Sparkles, title: 'AI understands', desc: 'We extract the issue, location, severity, and sentiment automatically.' },
            { icon: Users, title: 'Voices unite', desc: '43 people said the same thing — now it\'s one prioritized issue.' },
            { icon: CheckCircle2, title: 'Verified resolution', desc: 'You get asked: "Was it actually fixed?" — that closes the loop.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="sketch-card animate-fade-up" style={{
              textAlign: 'center',
              animationDelay: `${0.1 * i}s`
            }}>
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '50%',
                border: '2px dashed var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                background: 'var(--primary-subtle)'
              }}>
                <Icon size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 'var(--space-2)' }}>{title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Loop Visual ── */}
      <section style={{
        padding: 'var(--space-12) var(--space-6)',
        maxWidth: '640px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div className="sketch-card" style={{ padding: 'var(--space-8)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 'var(--space-6)' }}>
            The complete feedback loop
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
            {[
              { emoji: '🎙', label: 'Speak naturally' },
              { emoji: '🧠', label: 'AI understands' },
              { emoji: '✨', label: 'Feedback structured' },
              { emoji: '🔗', label: 'Similar voices connected' },
              { emoji: '🎯', label: 'Issue prioritized' },
              { emoji: '⚙️', label: 'Action taken' },
              { emoji: '✓', label: 'Resolution marked' },
              { emoji: '👍', label: 'User verifies — Loop closed' },
            ].map(({ emoji, label }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '1.3rem', width: '28px', textAlign: 'center' }}>{emoji}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section style={{
        padding: 'var(--space-12) var(--space-6)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div className="sketch-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <MessageSquare size={20} color="var(--primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>For feedback givers</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['Speak instead of typing', 'AI clarifies missing info', 'Track your feedback status', 'Verify when issues are fixed'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={14} color="var(--success)" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="sketch-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <BarChart3 size={20} color="var(--primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>For administrators</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['AI-clustered issues, not raw complaints', 'Priority inbox with impact trends', 'One-click assignment & tracking', 'Verified resolution metrics'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={14} color="var(--success)" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        textAlign: 'center',
        padding: 'var(--space-12) var(--space-6) var(--space-16)',
        maxWidth: '640px',
        margin: '0 auto'
      }}>
        <div className="sketch-card" style={{
          padding: 'var(--space-10)',
          borderColor: 'var(--primary)',
          background: 'var(--primary-subtle)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-3)', color: 'var(--text)' }}>
            Ready to close the loop?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: '1rem' }}>
            We didn't build another feedback form. We built a system that resolves feedback.
          </p>
          <Link to="/feedback" className="btn-pill btn-primary" style={{ fontSize: '1rem', padding: 'var(--space-4) var(--space-8)' }}>
            <Mic size={18} /> Start a Conversation <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-6)',
        borderTop: '2px dashed var(--border-dashed)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)'
      }}>
        LoopBack © 2026 · Your voice. Your impact.
      </footer>
    </div>
  );
}
