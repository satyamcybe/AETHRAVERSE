import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, LayoutDashboard, Search, FileText, UserCheck, Activity, LogOut, LogIn, Home, Sparkles } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();

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

        {/* Mobile Header Right (User badge / Logout) */}
        <div className="mobile-header-user">
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
