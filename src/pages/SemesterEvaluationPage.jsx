import React, { useState } from 'react';
import { Star, CheckCircle2, Send, Award, BookOpen, Building2 } from 'lucide-react';

export default function SemesterEvaluationPage({ user }) {
  const [submitted, setSubmitted] = useState(false);
  const [facultyRatings, setFacultyRatings] = useState({
    teachingQuality: 4,
    conceptClarity: 5,
    communication: 4,
    punctuality: 5,
    practicalKnowledge: 4,
    studentInteraction: 4
  });

  const [infraRatings, setInfraRatings] = useState({
    classroomQuality: 3,
    labEquipment: 2,
    libraryResources: 4,
    internetConnectivity: 2,
    campusCleanliness: 4,
    overallFacilities: 3
  });

  const [reflections, setReflections] = useState({
    nextSemesterImprovement: 'Upgrade RAM in IT Lab 304 and add more access points on 2nd floor library.',
    bestLearningExperience: 'Hands-on practical sessions in Web Development.',
    curriculumSuggestions: 'Include more modern cloud deployment modules.'
  });

  const handleRatingChange = (section, key, val) => {
    if (section === 'faculty') {
      setFacultyRatings(prev => ({ ...prev, [key]: val }));
    } else {
      setInfraRatings(prev => ({ ...prev, [key]: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Academic Governance
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: 'var(--space-1)' }}>
          Semester Evaluation (Spring 2026)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Structured institutional survey for faculty, laboratory, and campus infrastructure assessment.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Section 1: Faculty Evaluation */}
          <div className="sketch-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              <BookOpen size={20} color="var(--primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>1. Faculty & Academic Performance</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { key: 'teachingQuality', label: 'Overall Teaching Quality & Depth' },
                { key: 'conceptClarity', label: 'Concept Clarity & Explanation' },
                { key: 'communication', label: 'Language & Communication Skills' },
                { key: 'punctuality', label: 'Punctuality & Lecture Timings' },
                { key: 'practicalKnowledge', label: 'Practical / Lab Demonstration Skills' },
                { key: 'studentInteraction', label: 'Doubt Clearance & Student Interaction' },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{label}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingChange('faculty', key, star)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star size={20} fill={star <= facultyRatings[key] ? '#D97706' : 'transparent'} color="#D97706" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Infrastructure Evaluation */}
          <div className="sketch-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              <Building2 size={20} color="var(--primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>2. Campus Infrastructure</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { key: 'classroomQuality', label: 'Classroom Projectors & Seating Comfort' },
                { key: 'labEquipment', label: 'Laboratory Computers & Equipment' },
                { key: 'libraryResources', label: 'Library Books & Digital Access' },
                { key: 'internetConnectivity', label: 'Campus Wi-Fi Speed & Coverage' },
                { key: 'campusCleanliness', label: 'Campus & Washroom Cleanliness' },
                { key: 'overallFacilities', label: 'Overall Infrastructure Satisfaction' },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{label}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingChange('infra', key, star)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star size={20} fill={star <= infraRatings[key] ? '#D97706' : 'transparent'} color="#D97706" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Additional Reflections */}
          <div className="sketch-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 'var(--space-4)' }}>
              3. Student Reflection & Suggestions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  WHAT SHOULD IMPROVE NEXT SEMESTER?
                </label>
                <textarea
                  className="sketch-input"
                  rows={3}
                  value={reflections.nextSemesterImprovement}
                  onChange={(e) => setReflections({ ...reflections, nextSemesterImprovement: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  BEST LEARNING EXPERIENCE THIS SEMESTER
                </label>
                <input
                  className="sketch-input"
                  value={reflections.bestLearningExperience}
                  onChange={(e) => setReflections({ ...reflections, bestLearningExperience: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  SUGGESTIONS FOR CURRICULUM OR CAMPUS LIFE
                </label>
                <input
                  className="sketch-input"
                  value={reflections.curriculumSuggestions}
                  onChange={(e) => setReflections({ ...reflections, curriculumSuggestions: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-pill btn-primary" style={{ justifyContent: 'center', padding: 'var(--space-4)', fontSize: '1.1rem' }}>
            <Send size={18} /> Submit Semester Evaluation
          </button>
        </form>
      ) : (
        <div className="sketch-card animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <Award size={64} color="var(--success)" style={{ margin: '0 auto var(--space-4)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 'var(--space-2)' }}>
            Evaluation Recorded
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Thank you for helping us improve institutional quality for Spring 2026.
          </p>
          <button className="btn-pill btn-primary" onClick={() => setSubmitted(false)}>
            Review Submitted Form
          </button>
        </div>
      )}
    </div>
  );
}
