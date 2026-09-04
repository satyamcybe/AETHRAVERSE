import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import VoiceFeedbackPage from './pages/VoiceFeedbackPage';
import MyFeedbackPage from './pages/MyFeedbackPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PulsePage from './pages/PulsePage';

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Shared feedback store (mock state for demo)
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      title: 'Lab 304 Computer Performance',
      transcript: 'The computers in Lab 304 are really slow and it becomes difficult to complete our practicals on time.',
      issue: 'Slow computers',
      location: 'Lab 304',
      frequency: 'Almost every time',
      impact: 'High',
      sentiment: 'Negative',
      status: 'IN PROGRESS',
      department: 'IT Infrastructure',
      timestamp: '2026-09-01T10:30:00Z',
      similarCount: 43
    },
    {
      id: 2,
      title: 'Wi-Fi Signal Drops in Library',
      transcript: 'The Wi-Fi keeps dropping on the second floor of the library, especially during peak hours.',
      issue: 'Wi-Fi connectivity',
      location: 'Library 2nd Floor',
      frequency: 'Multiple times daily',
      impact: 'Medium',
      sentiment: 'Negative',
      status: 'UNDER REVIEW',
      department: 'Network Operations',
      timestamp: '2026-09-02T14:15:00Z',
      similarCount: 31
    },
    {
      id: 3,
      title: 'Canteen Cleanliness',
      transcript: 'The canteen tables are not cleaned properly and the water dispenser filter needs replacement.',
      issue: 'Sanitation',
      location: 'Main Canteen',
      frequency: 'Daily',
      impact: 'Medium',
      sentiment: 'Negative',
      status: 'RESOLVED',
      department: 'Campus Facilities',
      timestamp: '2026-08-28T09:00:00Z',
      similarCount: 19
    }
  ]);

  const addFeedback = (newFeedback) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  return (
    <>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feedback" element={<VoiceFeedbackPage onSubmit={addFeedback} />} />
        <Route path="/my-feedback" element={<MyFeedbackPage feedbacks={feedbacks} />} />
        <Route path="/admin" element={<AdminDashboardPage feedbacks={feedbacks} setFeedbacks={setFeedbacks} />} />
        <Route path="/pulse" element={<PulsePage />} />
      </Routes>
    </>
  );
}
