import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, LayoutDashboard, Search, FileText, UserCheck, Activity, LogOut, LogIn, Home, Sparkles, Key, Check } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const studentLinks = [
    { to: '/', label: 'Home', icon: Home, shortLabel: 'Home' },
    { to: '/feedback', label: 'Voice/Text', icon: Mic, shortLabel: 'Speak' },
    { to: '/tracker', label: 'Action Tracker', icon: Search, shortLabel: 'Tracker' },
    { to: '/semester-eval', label: 'Semester Eval', icon: FileText, shortLabel: 'Eval' },
    { to: '/student-dashboard', label: 'Dashboard', icon: UserCheck, shortLabel: 'Account' },
  ];

  const adminLinks = [
    { to: '/', label: 'Home', icon: Home, shortLabel: 'Home' },
    { to: '/admin', label: 'Admin Command', icon: LayoutDashboard, shortLabel: 'Command' },
    { to: '/ai-form-generator', label: 'AI Form Generator', icon: Sparkles, shortLabel: 'AI Forms' },
    { to: '/tracker', label: 'Action Tracker', icon: Search, shortLabel: 'Tracker' },
    { to: '/pulse', label: 'Analytics Pulse', icon: Activity, shortLabel: 'Pulse' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="nav-container main-nav-top">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--primary)' }}>LoopBack</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', border: '1px dashed var(--primary)' }}>INSTITUTE</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="desktop-nav-links">
          {links.filter(l => l.to !== '/').map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${pathname === to ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}

          {/* Gemini API Key Config */}
          <button
            className="btn-pill btn-secondary"
            onClick={() => setShowKeyModal(true)}
            title="Configure Gemini API Key"
            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
          >
            <Key size={14} color="var(--primary)" /> API Key
          </button>

          {user ? (
            <button className="btn-pill btn-ghost" onClick={onLogout} style={{ fontSize: '0.85rem', color: 'var(--danger)', marginLeft: '4px' }}>
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn-pill btn-primary" style={{ fontSize: '0.85rem', marginLeft: '4px' }}>
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Header Right */}
        <div className="mobile-header-user">
          <button
            className="btn-pill btn-secondary"
            onClick={() => setShowKeyModal(true)}
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            <Key size={14} />
          </button>

          {user ? (
            <button className="btn-pill btn-ghost" onClick={onLogout} style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--danger)' }}>
              <LogOut size={14} />
            </button>
          ) : (
            <Link to="/login" className="btn-pill btn-primary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* API Key Modal */}
      {showKeyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="sketch-card animate-scale-in" style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
              Google Gemini API Key
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Enter your Gemini API key to enable live AI generation & conversational voice follow-up.
            </p>

            <input
              type="password"
              className="sketch-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{ marginBottom: 'var(--space-4)' }}
            />

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn-pill btn-primary" onClick={handleSaveKey} style={{ flex: 2, justifyContent: 'center' }}>
                {savedSuccess ? <><Check size={16} /> Saved!</> : 'Save API Key'}
              </button>
              <button className="btn-pill btn-secondary" onClick={() => setShowKeyModal(false)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {links.map(({ to, shortLabel, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`mobile-tab-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
