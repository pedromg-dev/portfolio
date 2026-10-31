// Vercel Serverless Function: AI email drafter using Google Gemini REST API
// Uses native Node.js global fetch to eliminate node_modules runtime bundling issues on Vercel.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Missing GEMINI_API_KEY environment variable in Vercel.',
      details: 'GEMINI_API_KEY is not defined in Vercel Project Settings > Environment Variables.'
    });
  }

  const { prompt, language = 'es' } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const langInstruction =
    language === 'en'
      ? 'Write the subject and message in professional, concise English.'
      : 'Escribe el asunto y el mensaje en español profesional, natural y directo.';

  const systemInstructionText = `You are an assistant helping a recruiter, client, or colleague draft a concise, professional contact email to Pedro Antonio Moya García (Senior Full-Stack .NET Developer specializing in C#, .NET 10, Clean Architecture, Microservices, Blazor, Angular, SQL Server, Azure CosmosDB, and Azure/AWS).
${langInstruction}
Keep the tone direct, natural, and free of clichés or filler. Return a valid JSON object with "subject" and "message".`;

  const requestBody = {
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: `Draft a contact email to Pedro based on this note: "${prompt.trim()}"` }]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          subject: {
            type: 'STRING',
            description: 'Concise email subject line'
          },
          message: {
            type: 'STRING',
            description: 'Well-structured email body ready to send'
          }
        },
        required: ['subject', 'message']
      }
    }
  };

  const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        lastError = errorData?.error?.message || `HTTP ${status}`;
        console.warn(`Model ${model} returned ${status}:`, lastError);

        // If it's a 404 (model unavailable for key) or 400 (bad model), try next model
        if (status === 404 || status === 400) {
          continue;
        }
        // If auth failure (401/403) or rate limit (429), break and report immediately
        break;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response from Gemini API');
      }

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON format from model');
        }
      }

      return res.status(200).json({
        subject: parsed.subject || '',
        message: parsed.message || ''
      });
    } catch (err) {
      lastError = err?.message || String(err);
      console.warn(`Error with model ${model}:`, lastError);
    }
  }

  console.error('All Gemini models failed:', lastError);
  return res.status(500).json({
    error: 'Failed to generate email draft with Gemini.',
    details: lastError
  });
}

