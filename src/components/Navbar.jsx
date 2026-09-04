import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, LayoutDashboard, MessageSquare, Activity } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/feedback', label: 'Give Feedback', icon: Mic },
    { to: '/my-feedback', label: 'My Feedback', icon: MessageSquare },
    { to: '/admin', label: 'Admin', icon: LayoutDashboard },
    { to: '/pulse', label: 'Pulse', icon: Activity },
  ];

  return (
    <nav className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--primary)' }}>LoopBack</span>
      </Link>
      <div style={{ display: 'flex', gap: '4px' }}>
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
      </div>
    </nav>
  );
}
