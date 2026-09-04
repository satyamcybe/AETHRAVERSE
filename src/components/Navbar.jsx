import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, LayoutDashboard, Search, FileText, UserCheck, Activity, LogOut, LogIn } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();

  const studentLinks = [
    { to: '/feedback', label: 'Voice/Text Feedback', icon: Mic },
    { to: '/semester-eval', label: 'Semester Eval', icon: FileText },
    { to: '/tracker', label: 'Action Tracker', icon: Search },
    { to: '/student-dashboard', label: 'My Dashboard', icon: UserCheck },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Command', icon: LayoutDashboard },
    { to: '/pulse', label: 'Analytics Pulse', icon: Activity },
    { to: '/tracker', label: 'Action Tracker', icon: Search },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--primary)' }}>LoopBack</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', border: '1px dashed var(--primary)' }}>INSTITUTE</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
        {links.map(({ to, label, icon: Icon }) => (
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
          <button className="btn-pill btn-ghost" onClick={onLogout} style={{ fontSize: '0.85rem', color: 'var(--danger)', marginLeft: '8px' }}>
            <LogOut size={14} /> Logout ({user.name})
          </button>
        ) : (
          <Link to="/login" className="btn-pill btn-primary" style={{ fontSize: '0.85rem', marginLeft: '8px' }}>
            <LogIn size={14} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}
