import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper for Gemini AI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Check if AI is available
app.get('/api/ai/status', (_req, res) => {
  const isAvailable = Boolean(process.env.GEMINI_API_KEY);
  res.json({ available: isAvailable });
});

// Explain finding endpoint
app.post('/api/ai/explain', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment secrets.',
      });
    }

    const { subject, sender, score, verdict, findings, emailExcerpt } = req.body;

    const prompt = `You are a cybersecurity expert speaking to an undergraduate college student at a campus cybersecurity hackathon.
The student is analyzing a potentially suspicious email using the rule-based scanner "PhishGuard".
DO NOT calculate a new score or change the verdict. The verdict is already fixed at:
- Verdict: ${verdict}
- Risk Score: ${score}/100
- Email Subject: "${subject || 'Unknown'}"
- Sender: "${sender || 'Unknown'}"

Detected Rule-Based Findings:
${JSON.stringify(findings, null, 2)}

Email Excerpt:
"""
${(emailExcerpt || '').slice(0, 1500)}
"""

Provide a concise, crystal-clear explanation (max 3 short paragraphs or 4 clear bullet points) answering:
1. The "Big Picture": What this email is trying to achieve (e.g. credential harvesting, gift card scam, impersonation, or legitimate academic notice).
2. The Key Clues: The top 2-3 most telling signs a student should remember for their everyday digital life.
3. Plain-English Takeaway: Exactly what the student should do next in this exact scenario.

Keep your tone professional, encouraging, and educational. Avoid heavy cybersecurity jargon without explaining it.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const explanation = response.text || 'Unable to generate explanation at this time.';
    res.json({ explanation });
  } catch (error: any) {
    console.error('Gemini explanation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate AI explanation.',
    });
  }
});

// Setup dev server with Vite or static production files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PhishGuard server running on port ${PORT} (prod=${isProd})`);
  });
}

startServer();
