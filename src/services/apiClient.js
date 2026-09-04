// API client for LoopBack backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiFetch = async (path, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  } catch (error) {
    console.warn(`API call to ${path} failed, using local state:`, error);
    return null;
  }
};

export const api = {
  // Feedback endpoints
  submitFeedback: (data) => apiFetch('/api/feedback', { method: 'POST', body: JSON.stringify(data) }),
  getFeedbacks: () => apiFetch('/api/feedback'),
  getFeedback: (id) => apiFetch(`/api/feedback/${id}`),

  // Issues endpoints
  getIssues: () => apiFetch('/api/issues'),
  getIssue: (id) => apiFetch(`/api/issues/${id}`),
  updateIssueStatus: (id, status) => apiFetch(`/api/issues/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  assignIssue: (id, department, assignee) => apiFetch(`/api/issues/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ department, assignee }) }),

  // Analytics endpoints
  getPulse: () => apiFetch('/api/analytics/pulse'),
  getTrending: () => apiFetch('/api/analytics/trending'),

  // Verification
  verifyResolution: (feedbackId, resolved) => apiFetch(`/api/feedback/${feedbackId}/verify`, { method: 'POST', body: JSON.stringify({ resolved }) }),

  // Health
  health: () => apiFetch('/api/health'),
};
