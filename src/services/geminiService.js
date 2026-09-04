// Gemini AI feedback analysis & multi-turn follow-up engine for LoopBack

const MOCK_DELAY = 800;

export const getStoredApiKey = () => {
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
         localStorage.getItem('gemini_api_key') ||
         '';
};

/**
 * Evaluates feedback completeness and generates targeted follow-up questions iteratively
 * until ALL required institutional parameters (Location, Frequency, Detail, Impact) are answered.
 */
export const analyzeConversationalFeedback = async (conversationHistory, currentCategory = 'Infrastructure', providedApiKey = null) => {
  const apiKey = providedApiKey || getStoredApiKey();

  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const formattedHistory = conversationHistory.map(item => `${item.role === 'assistant' ? 'AI Assistant' : 'Student'}: "${item.text}"`).join('\n');

      const prompt = `You are LoopBack Institutional AI Assistant. Analyze the following multi-turn feedback conversation between a student and AI.
Category: ${currentCategory}

Conversation History:
${formattedHistory}

Your Goal: Evaluate if ALL 4 necessary institutional parameters are provided by the student:
1. Specific Location (e.g., Room 304, Library 2nd Floor, Main Canteen)
2. Frequency or When it started (e.g., Every lab class, Started 3 days ago)
3. Specific Equipment/System/Faculty (e.g., Projector bulb, PC #12, Dr. Vance's lecture)
4. Observed Impact/Severity (e.g., Halts practical exams, Wi-Fi drops during study)

Calculate a completeness score (0 to 100%).
If ANY parameter is missing, set isComplete = false and provide the exact next targeted follow-up question to ask the student.
Only set isComplete = true and nextQuestion = null when ALL required information is present.

Return ONLY a JSON object with this exact structure:
{
  "completenessScore": number (0-100),
  "isComplete": boolean,
  "nextQuestion": string or null,
  "issueTitle": string,
  "location": string,
  "frequency": string,
  "impact": "High" | "Medium" | "Low",
  "sentiment": "Negative" | "Neutral" | "Positive",
  "extractedDetails": [array of strings]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (response && response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.warn('Gemini API live call notice:', err);
    }
  }

  // Multi-turn Iterative Evaluation Engine (guarantees dynamic follow-up sequence until 100%)
  await new Promise(r => setTimeout(r, MOCK_DELAY));

  const fullText = conversationHistory.map(c => c.text).join(' ').toLowerCase();

  let hasLocation = false;
  let hasFrequency = false;
  let hasDetail = false;
  let hasImpact = false;

  let location = 'Campus Area';
  let frequency = 'Unspecified';
  let impact = 'Medium';
  let sentiment = 'Neutral';

  // 1. Location check
  if (fullText.includes('room') || fullText.includes('lab') || fullText.includes('floor') || fullText.includes('canteen') || fullText.includes('library') || fullText.includes('hostel') || fullText.includes('block') || fullText.includes('hall')) {
    hasLocation = true;
    const match = fullText.match(/(lab\s*\d+|room\s*\d+|library\s*\d*(st|nd|rd|th)?\s*floor|canteen|hostel|auditorium|it block)/i);
    if (match) location = match[0].toUpperCase();
  }

  // 2. Frequency / Timing check
  if (fullText.includes('daily') || fullText.includes('every') || fullText.includes('since') || fullText.includes('always') || fullText.includes('yesterday') || fullText.includes('week') || fullText.includes('days') || fullText.includes('today') || fullText.includes('frequently')) {
    hasFrequency = true;
    if (fullText.includes('every') || fullText.includes('daily')) frequency = 'Recurring daily';
    else if (fullText.includes('since') || fullText.includes('week')) frequency = 'Ongoing since last week';
    else frequency = 'Recently observed';
  }

  // 3. Specific Detail check
  if (fullText.includes('projector') || fullText.includes('pc') || fullText.includes('computer') || fullText.includes('ac') || fullText.includes('fan') || fullText.includes('wifi') || fullText.includes('wi-fi') || fullText.includes('water') || fullText.includes('bench') || fullText.includes('lecture') || fullText.includes('mic') || fullText.includes('speaker')) {
    hasDetail = true;
  }

  // 4. Impact check
  if (fullText.includes('exam') || fullText.includes('freeze') || fullText.includes('stop') || fullText.includes('cannot') || fullText.includes('hard') || fullText.includes('disturb') || fullText.includes('delay') || fullText.includes('affect') || fullText.includes('interrupt') || fullText.includes('slow') || fullText.includes('bad')) {
    hasImpact = true;
    impact = 'High';
    sentiment = 'Negative';
  }

  // Count answered parameters (25% per parameter)
  let count = 0;
  if (hasLocation) count++;
  if (hasFrequency) count++;
  if (hasDetail) count++;
  if (hasImpact) count++;

  let score = Math.max(25, count * 25);
  let nextQuestion = null;
  let isComplete = false;

  // Ask targeted follow-up questions iteratively for any missing parameter
  if (!hasLocation) {
    nextQuestion = "Which specific room number, lab, or floor location is affected?";
  } else if (!hasFrequency) {
    nextQuestion = "When did this start occurring, or how frequently do you experience this issue?";
  } else if (!hasDetail) {
    nextQuestion = "Could you specify which exact equipment, system, or facility is having trouble?";
  } else if (!hasImpact) {
    nextQuestion = "How is this issue impacting your classes, lab practicals, or daily study?";
  } else {
    isComplete = true;
    score = 100;
  }

  // Title extraction
  let issueTitle = `${location} Feedback Ticket`;
  if (fullText.includes('projector')) issueTitle = `${location} Projector Display Issue`;
  else if (fullText.includes('wifi') || fullText.includes('internet')) issueTitle = `${location} Wi-Fi Signal Dropouts`;
  else if (fullText.includes('pc') || fullText.includes('computer') || fullText.includes('freeze')) issueTitle = `${location} System Freezes & Hardware Issue`;
  else if (fullText.includes('water') || fullText.includes('clean')) issueTitle = `${location} Facility Sanitation Issue`;

  return {
    completenessScore: score,
    isComplete,
    nextQuestion,
    issueTitle,
    location,
    frequency,
    impact,
    sentiment,
    extractedDetails: [
      `Location: ${location}`,
      `Timing: ${frequency}`,
      `Severity: ${impact} Impact`,
      `Verified parameters: ${count}/4 complete`
    ]
  };
};

export const analyzeFeedback = async (transcript, apiKey) => {
  return analyzeConversationalFeedback([{ role: 'user', text: transcript }], 'Infrastructure', apiKey);
};
