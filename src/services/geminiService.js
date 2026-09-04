// Gemini AI feedback analysis & multi-turn follow-up engine for LoopBack

const MOCK_DELAY = 900;

/**
 * Evaluates feedback completeness and generates targeted follow-up questions
 * until all institutional parameters (Location, Frequency/Time, Impact, Specific Details) are gathered.
 */
export const analyzeConversationalFeedback = async (conversationHistory, currentCategory = 'Infrastructure', apiKey = null) => {
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const formattedHistory = conversationHistory.map(item => `${item.role === 'assistant' ? 'AI' : 'Student'}: "${item.text}"`).join('\n');

      const prompt = `You are LoopBack Institutional AI Assistant. Analyze the following feedback conversation between a student and AI.
Category: ${currentCategory}

Conversation History:
${formattedHistory}

Your Goal: Evaluate if all necessary institutional parameters are present to file an actionable report:
1. Specific Location (e.g., Room 304, Library 2nd Floor, Main Canteen)
2. Frequency or When it started (e.g., Every lab class, Started 3 days ago)
3. Specific Equipment/Faculty/Detail (e.g., Projector bulb, PC #12, Dr. Vance's lecture)
4. Observed Impact/Severity (e.g., Halts exams, Wi-Fi drops every 10 min)

Calculate a completeness percentage (0 to 100%).
If completeness is LESS than 100%, formulate the NEXT single polite, concise follow-up question to ask the student. Speak in a helpful institutional tone.
If completeness is 100% (or all key details are clear), set isComplete = true, nextQuestion = null.

Return ONLY a JSON object with this exact structure:
{
  "completenessScore": number (0-100),
  "isComplete": boolean,
  "nextQuestion": string or null,
  "issueTitle": string (short concise title for ticket),
  "location": string,
  "frequency": string,
  "impact": "High" | "Medium" | "Low",
  "sentiment": "Negative" | "Neutral" | "Positive",
  "extractedDetails": [array of bullet point strings]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      return JSON.parse(response.text);
    } catch (err) {
      console.warn('Gemini API error, falling back to rule engine:', err);
    }
  }

  // Smart rule-based fallback for offline / mock demo
  await new Promise(r => setTimeout(r, MOCK_DELAY));

  const fullText = conversationHistory.map(c => c.text).join(' ').toLowerCase();

  let hasLocation = false;
  let hasFrequency = false;
  let hasDetail = false;

  let location = 'Campus';
  let frequency = 'Unspecified';
  let impact = 'Medium';
  let sentiment = 'Neutral';

  // Location checks
  if (fullText.includes('room') || fullText.includes('lab') || fullText.includes('floor') || fullText.includes('canteen') || fullText.includes('library') || fullText.includes('hostel') || fullText.includes('hall')) {
    hasLocation = true;
    const match = fullText.match(/(lab\s*\d+|room\s*\d+|library\s*\d*(st|nd|rd|th)?\s*floor|canteen|hostel|auditorium)/i);
    if (match) location = match[0].toUpperCase();
  }

  // Frequency / Timing checks
  if (fullText.includes('daily') || fullText.includes('every') || fullText.includes('since') || fullText.includes('always') || fullText.includes('yesterday') || fullText.includes('week') || fullText.includes('days')) {
    hasFrequency = true;
    if (fullText.includes('every') || fullText.includes('daily')) frequency = 'Recurring daily';
    else if (fullText.includes('since') || fullText.includes('week')) frequency = 'Ongoing since last week';
  }

  // Specific detail checks
  if (fullText.includes('projector') || fullText.includes('pc') || fullText.includes('computer') || fullText.includes('ac') || fullText.includes('fan') || fullText.includes('wifi') || fullText.includes('water') || fullText.includes('exam') || fullText.includes('bench')) {
    hasDetail = true;
  }

  // Calculate score
  let score = 25; // initial submission base
  if (hasLocation) score += 30;
  if (hasFrequency) score += 25;
  if (hasDetail) score += 20;

  let nextQuestion = null;
  let isComplete = false;

  if (score >= 90) {
    isComplete = true;
    score = 100;
  } else if (!hasLocation) {
    nextQuestion = "Which specific location, floor, or room number does this issue occur in?";
  } else if (!hasFrequency) {
    nextQuestion = "How frequently does this happen, or when did you first notice this problem?";
  } else if (!hasDetail) {
    nextQuestion = "Could you specify which exact equipment, system, or facility is affected?";
  } else {
    isComplete = true;
    score = 100;
  }

  // Extract issue title
  let issueTitle = 'Institutional Feedback Report';
  if (fullText.includes('projector')) issueTitle = `${location} Projector Display Issue`;
  else if (fullText.includes('wifi') || fullText.includes('internet')) issueTitle = `${location} Wi-Fi Signal Dropouts`;
  else if (fullText.includes('pc') || fullText.includes('computer') || fullText.includes('freeze')) issueTitle = `${location} Computer Performance & Boot Issue`;
  else if (fullText.includes('clean') || fullText.includes('water')) issueTitle = `${location} Sanitation & Water Dispenser Report`;

  if (fullText.includes('freeze') || fullText.includes('crash') || fullText.includes('urgent') || fullText.includes('stop')) {
    impact = 'High';
    sentiment = 'Negative';
  }

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
      `Timing/Frequency: ${frequency}`,
      `Severity: ${impact} Impact`,
      `Verified via Student Voice Submissions`
    ]
  };
};

// Legacy support
export const analyzeFeedback = async (transcript, apiKey) => {
  return analyzeConversationalFeedback([{ role: 'user', text: transcript }], 'Infrastructure', apiKey);
};
