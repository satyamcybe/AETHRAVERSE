import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, Shield, Key, ArrowRight, User } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('STU-2026-88');
  const [password, setPassword] = useState('password123');

  const fillStudent = () => {
    setRole('student');
    setUsername('STU-2026-88');
    setPassword('student123');
  };

  const fillAdmin = () => {
    setRole('admin');
    setUsername('ADMIN-DEAN-IT');
    setPassword('admin123');
  };

  const fillAnonymous = () => {
    onLogin({
      id: 'ANON',
      name: 'Anonymous Student',
      role: 'student',
      isAnonymous: true,
      department: 'Computer Engineering',
      semester: 'Semester 6'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      onLogin({
        id: 'ADM-001',
        name: 'Dr. Sarah Jenkins (Dean Academics)',
        role: 'admin',
        department: 'Academic & Admin Control'
      });
    } else {
      onLogin({
        id: username || 'STU-2026-88',
        name: 'Ayush Giri (Computer Eng.)',
        role: 'student',
        isAnonymous: false,
        department: 'Computer Engineering',
        semester: 'Semester 6'
      });
    }
  };

  return (
    <div className="page-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="sketch-card animate-fade-up" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Institutional Portal
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: 'var(--space-1)', color: 'var(--text)' }}>
            Welcome to LoopBack
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to access your feedback tracker or admin command center.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Buttons */}
        <div style={{ background: 'var(--primary-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--primary)', marginBottom: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-2)' }}>
            ⚡ Instant Demo Login Buttons:
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button type="button" className="btn-pill btn-secondary" onClick={fillStudent} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <User size={12} /> Student Demo
            </button>
            <button type="button" className="btn-pill btn-secondary" onClick={fillAdmin} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <Shield size={12} /> Admin Demo
            </button>
            <button type="button" className="btn-pill btn-primary" onClick={fillAnonymous} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Incognito / Anon
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              ACCOUNT TYPE
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                type="button"
                className={`btn-pill ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('student')}
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
              >
                Student
              </button>
              <button
                type="button"
                className={`btn-pill ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('admin')}
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
              >
                Administrator
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              USER ID / PRN NUMBER
            </label>
            <input
              className="sketch-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. STU-2026-88"
              required
            />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              PASSWORD
            </label>
            <input
              className="sketch-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-pill btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)', padding: 'var(--space-4)' }}>
            Sign In to Portal <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
