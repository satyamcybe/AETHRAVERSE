import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import VoiceFeedbackPage from './pages/VoiceFeedbackPage';
import SemesterEvaluationPage from './pages/SemesterEvaluationPage';
import ActionTrackerPage from './pages/ActionTrackerPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PulsePage from './pages/PulsePage';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingOrLogin = location.pathname === '/' || location.pathname === '/login';

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('loopback_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('loopback_user', JSON.stringify(userInfo));
    if (userInfo.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loopback_user');
    navigate('/');
  };

  return (
    <>
      {!isLandingOrLogin && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/feedback" element={<VoiceFeedbackPage user={user} />} />
        <Route path="/semester-eval" element={<SemesterEvaluationPage user={user} />} />
        <Route path="/tracker" element={<ActionTrackerPage user={user} />} />
        <Route path="/student-dashboard" element={<StudentDashboardPage user={user} />} />
        <Route path="/admin" element={<AdminDashboardPage user={user} />} />
        <Route path="/pulse" element={<PulsePage user={user} />} />
      </Routes>
    </>
  );
}
