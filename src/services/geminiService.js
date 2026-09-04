// Gemini AI feedback analysis service for LoopBack
// Uses @google/genai SDK or falls back to mock analysis

const MOCK_DELAY = 1200;

// Offline / mock fallback analysis
const mockAnalyze = async (transcript) => {
  await new Promise(r => setTimeout(r, MOCK_DELAY));

  const lower = transcript.toLowerCase();
  let issue = 'General Feedback';
  let location = 'Unspecified';
  let frequency = 'Occasionally';
  let impact = 'Medium';
  let sentiment = 'Neutral';
  let clarificationQuestion = null;

  // Simple keyword extraction for demo
  if (lower.includes('slow') || lower.includes('freeze') || lower.includes('crash')) {
    issue = 'Performance Issues'; impact = 'High'; sentiment = 'Negative';
  }
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) {
    issue = 'Wi-Fi Connectivity Issues'; impact = 'Medium'; sentiment = 'Negative';
  }
  if (lower.includes('dirty') || lower.includes('clean') || lower.includes('hygiene')) {
    issue = 'Cleanliness & Sanitation'; sentiment = 'Negative';
  }
  if (lower.includes('lab')) location = 'Computer Lab';
  if (lower.includes('library')) location = 'Library';
  if (lower.includes('canteen') || lower.includes('cafeteria')) location = 'Canteen';
  if (lower.includes('every time') || lower.includes('always') || lower.includes('daily')) frequency = 'Almost every time';
  if (lower.includes('sometimes') || lower.includes('occasional')) frequency = 'Occasionally';

  // Match numbers like "lab 304"
  const labMatch = lower.match(/lab\s*(\d+)/);
  if (labMatch) location = `Lab ${labMatch[1]}`;

  if (transcript.length < 30) {
    clarificationQuestion = 'Could you tell me a bit more about what happened?';
  } else if (!lower.includes('every') && !lower.includes('sometimes') && !lower.includes('often')) {
    clarificationQuestion = 'Is this happening every time or only occasionally?';
  }

  return { issue, location, frequency, impact, sentiment, clarificationQuestion };
};

// Live Gemini analysis (when API key is provided)
const geminiAnalyze = async (transcript, apiKey) => {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are LoopBack Feedback AI. Analyze the following spoken user feedback and return a valid JSON object with exactly these keys: "issue" (string, short title), "location" (string), "frequency" (string), "impact" ("High" or "Medium" or "Low"), "sentiment" ("Negative" or "Neutral" or "Positive"), "clarificationQuestion" (string or null — a polite short follow-up question if information is missing, null if enough info).\n\nUser spoken text: "${transcript}"`,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.warn('Gemini API error, using mock:', error);
    return mockAnalyze(transcript);
  }
};

export const analyzeFeedback = async (transcript, apiKey) => {
  if (apiKey) {
    return geminiAnalyze(transcript, apiKey);
  }
  return mockAnalyze(transcript);
};
