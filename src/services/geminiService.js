// Gemini AI feedback analysis & multi-turn follow-up engine for LoopBack

export const getStoredApiKey = () => {
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
         localStorage.getItem('gemini_api_key') ||
         '';
};

/**
 * Evaluates feedback completeness and generates targeted follow-up questions iteratively
 * by sending dialogue history to backend AI API (`/api/feedback/analyze`).
 */
export const analyzeConversationalFeedback = async (conversationHistory, currentCategory = 'Infrastructure', providedApiKey = null) => {
  const apiKey = providedApiKey || getStoredApiKey();

  // Primary: Call Backend FastAPI AI Endpoint
  try {
    const res = await fetch('http://localhost:8000/api/feedback/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_history: conversationHistory,
        category: currentCategory,
        api_key: apiKey || null
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend API feedback analysis fetch notice:', err);
  }

  // Standalone Client Triage (if backend server is offline)
  const fullText = conversationHistory.map(c => c.text).join(' ').toLowerCase();

  const locationMatch = fullText.match(/(lab\s*\d+|room\s*\d+|library\s*\d*(st|nd|rd|th)?\s*floor|canteen|hostel|auditorium|it block|block\s*[a-z0-9]+)/i);
  const foundLocation = locationMatch ? locationMatch[0].toUpperCase() : null;

  const equipmentMatch = fullText.match(/(projector|computer|pc|laptop|wifi|wi-fi|internet|ac|air conditioner|fan|water dispenser|bench|mic|speaker|light)/i);
  const foundEquipment = equipmentMatch ? equipmentMatch[0] : null;

  const timingMatch = fullText.match(/(daily|every\s*\w+|since\s*\w+|yesterday|today|last week|always|frequently|2 days|two weeks|weeks)/i);
  const foundTiming = timingMatch ? timingMatch[0] : null;

  const impactMatch = fullText.match(/(exam|practical|freeze|crash|cannot|disturb|delay|affect|interrupt|slow|stop|hard|lecture)/i);
  const foundImpact = impactMatch ? impactMatch[0] : null;

  const missing = [];
  if (!foundLocation) missing.push('location');
  if (!foundEquipment) missing.push('equipment');
  if (!foundTiming) missing.push('timing');
  if (!foundImpact) missing.push('impact');

  const score = Math.max(25, 100 - (missing.length * 25));
  const isComplete = missing.length === 0;
  let nextQuestion = null;

  if (!isComplete) {
    const nextTarget = missing[0];
    if (nextTarget === 'location') {
      nextQuestion = foundEquipment
        ? `Got it, the issue with the ${foundEquipment} needs attention. Which specific room number, lab, or floor location is this located in?`
        : 'Which specific room number, lab, or floor location is experiencing this issue?';
    } else if (nextTarget === 'equipment') {
      nextQuestion = foundLocation
        ? `Understood, noted location ${foundLocation}. Could you specify which exact equipment, system, or facility in ${foundLocation} is having trouble?`
        : 'Could you specify which exact equipment, computer, or facility is affected?';
    } else if (nextTarget === 'timing') {
      const itemRef = foundEquipment ? `the ${foundEquipment} issue` : 'this issue';
      const locRef = foundLocation ? ` in ${foundLocation}` : '';
      nextQuestion = `When did ${itemRef}${locRef} start happening, or how frequently do you notice it?`;
    } else if (nextTarget === 'impact') {
      const itemRef = foundEquipment ? `the ${foundEquipment}` : 'this problem';
      nextQuestion = `How is ${itemRef} impacting your practical lectures, studying, or lab sessions?`;
    }
  }

  const locName = foundLocation || 'Campus Area';
  const eqName = foundEquipment ? foundEquipment.charAt(0).toUpperCase() + foundEquipment.slice(1) : 'Infrastructure';

  return {
    completenessScore: score,
    isComplete,
    nextQuestion,
    issueTitle: `${locName} ${eqName} Ticket`,
    location: locName,
    frequency: foundTiming || 'Recently reported',
    impact: foundImpact ? 'High' : 'Medium',
    sentiment: (foundImpact || fullText.includes('not working') || fullText.includes('bad')) ? 'Negative' : 'Neutral',
    extractedDetails: [
      `Location: ${locName}`,
      `Equipment: ${eqName}`,
      `Timing: ${foundTiming || 'Unspecified'}`,
      `Impact: ${foundImpact ? 'High Impact' : 'Medium Impact'}`
    ]
  };
};

export const analyzeFeedback = async (transcript, apiKey) => {
  return analyzeConversationalFeedback([{ role: 'user', text: transcript }], 'Infrastructure', apiKey);
};
