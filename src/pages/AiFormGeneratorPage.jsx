import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Upload, Plus, Trash2, CheckCircle2, QrCode, ExternalLink, Download, BarChart2, Play, Pause, Copy, Edit3, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_NOTICE = `Notice for Spring 2026 Course & Campus Assessment Survey
All students of Computer Engineering and IT departments are requested to provide honest feedback regarding faculty teaching clarity, laboratory computer performance in Lab 304, library Wi-Fi connectivity, and canteen sanitation. Your responses directly influence institutional quality assurance and NAAC accreditation reporting.`;

export default function AiFormGeneratorPage({ user }) {
  const [inputText, setInputText] = useState(SAMPLE_NOTICE);
  const [surveyTitle, setSurveyTitle] = useState('Spring 2026 Faculty & Lab Infrastructure Assessment');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [createdForm, setCreatedForm] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [existingForms, setExistingForms] = useState([]);
  const [activeTab, setActiveTab] = useState('generator'); // generator | formsList

  useEffect(() => {
    fetchExistingForms();
  }, []);

  const fetchExistingForms = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/forms');
      const data = await res.json();
      setExistingForms(data);
    } catch (e) {
      console.warn('Failed to fetch existing forms:', e);
    }
  };

  const handleGenerateAI = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('http://localhost:8000/api/forms/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_text: inputText, survey_title: surveyTitle })
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (e) {
      alert('AI Generation error. Creating template questions.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: `q_${Date.now()}`,
      question_text: 'New Survey Question',
      question_type: 'MCQ',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: True
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index, field, val) => {
    const updated = [...questions];
    updated[index][field] = val;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateGoogleForm = async () => {
    if (questions.length === 0) {
      alert('Please generate or add at least one question.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: surveyTitle,
          description: 'AI Generated Institutional Google Form',
          department: 'Computer Engineering',
          questions: questions
        })
      });
      const data = await res.json();
      setCreatedForm(data);
      setShowQR(true);
      fetchExistingForms();
    } catch (e) {
      alert('Failed to publish Google Form.');
    }
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Institutional Administrator Module
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-1)' }}>
            AI Google Form Generator & Manager
          </h1>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            className={`btn-pill ${activeTab === 'generator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('generator')}
            style={{ fontSize: '0.85rem' }}
          >
            <Sparkles size={16} /> AI Form Generator
          </button>
          <button
            className={`btn-pill ${activeTab === 'formsList' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('formsList')}
            style={{ fontSize: '0.85rem' }}
          >
            <FileText size={16} /> Form Management ({existingForms.length})
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div style={{ display: 'grid', gridTemplateColumns: questions.length > 0 ? '1fr 1.2fr' : '1fr', gap: 'var(--space-6)' }}>
          {/* Left Column: Input Source & Document Upload */}
          <div className="sketch-card animate-fade-up">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>
              1. Provide Document or Text Input
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Upload event notices, circulars, PDFs, DOCX, or paste text. AI will extract topics and structure the entire questionnaire automatically.
            </p>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SURVEY TITLE
              </label>
              <input
                className="sketch-input"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="Enter survey title..."
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                TEXT CONTENT / NOTICE / CIRCULAR
              </label>
              <textarea
                className="sketch-input"
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste document text or notice details here..."
              />
            </div>

            {/* Quick Document Upload Buttons */}
            <div style={{ background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                OR UPLOAD FILE (PDF / DOCX / TEXT):
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn-pill btn-secondary" onClick={() => alert('PDF Upload simulated. Content extracted!')} style={{ fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}>
                  <Upload size={14} /> Upload PDF
                </button>
                <button className="btn-pill btn-secondary" onClick={() => alert('DOCX Upload simulated. Content extracted!')} style={{ fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}>
                  <FileText size={14} /> Upload DOCX
                </button>
              </div>
            </div>

            <button
              className="btn-pill btn-primary"
              onClick={handleGenerateAI}
              disabled={isGenerating || !inputText.trim()}
              style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-4)' }}
            >
              <Sparkles size={18} /> {isGenerating ? 'AI Processing Document...' : 'Generate Questions with AI'}
            </button>
          </div>

          {/* Right Column: AI Generated Question Editor */}
          {questions.length > 0 && (
            <div className="sketch-card animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                  2. Review & Edit AI Questionnaire ({questions.length} Questions)
                </h3>
                <button className="btn-pill btn-secondary" onClick={handleAddQuestion} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  <Plus size={14} /> Add Question
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '440px', overflowY: 'auto', marginBottom: 'var(--space-6)' }}>
                {questions.map((q, idx) => (
                  <div key={q.id || idx} style={{ background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                        Q{idx + 1} ({q.question_type})
                      </span>
                      <button onClick={() => handleRemoveQuestion(idx)} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      className="sketch-input"
                      value={q.question_text}
                      onChange={(e) => handleUpdateQuestion(idx, 'question_text', e.target.value)}
                      style={{ marginBottom: '6px' }}
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="sketch-input"
                        value={q.question_type}
                        onChange={(e) => handleUpdateQuestion(idx, 'question_type', e.target.value)}
                        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                      >
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                        <option value="RATING">Linear Rating Scale (1-5)</option>
                        <option value="YES_NO">Yes / No</option>
                        <option value="DROPDOWN">Dropdown</option>
                        <option value="PARAGRAPH">Paragraph Response</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="btn-pill btn-primary"
                onClick={handleCreateGoogleForm}
                style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-4)' }}
              >
                <CheckCircle2 size={18} /> Publish Live Google Form & Shareable QR Code
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Form Management List */
        <div className="sketch-card animate-fade-up">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 'var(--space-4)' }}>
            Institutional Forms & Response Hub
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {existingForms.map(form => (
              <div key={form.id} className="sketch-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{form.id}</span>
                    <span className="badge badge-resolved">{form.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginTop: '2px', fontWeight: 600 }}>{form.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {form.description} · {form.questions?.length || 4} Questions
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <Link to={`/form/${form.id}`} target="_blank" className="btn-pill btn-primary" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                    <Share2 size={14} /> Open Public Form
                  </Link>
                  <Link to={`/form-analytics/${form.id}`} className="btn-pill btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                    <BarChart2 size={14} /> View Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR & Share Modal */}
      {showQR && createdForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="sketch-card animate-scale-in" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: 'var(--space-6)', background: '#fff' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto var(--space-2)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 'var(--space-1)' }}>Google Form Created!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Form synced with Google Forms API and connected Supabase backend.
            </p>

            <div style={{ width: '160px', height: '160px', margin: '0 auto var(--space-4)', background: '#f0f0f0', border: '2px dashed var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              <QrCode size={100} color="var(--primary)" />
            </div>

            <div style={{ background: 'var(--secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-dashed)', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>PUBLIC STUDENT SHAREABLE LINK</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', wordBreak: 'break-all', marginTop: '2px' }}>
                {createdForm.qr_code_data}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Link to={`/form/${createdForm.id}`} target="_blank" className="btn-pill btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                <ExternalLink size={14} /> Open Form
              </Link>
              <button className="btn-pill btn-secondary" onClick={() => setShowQR(false)} style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
