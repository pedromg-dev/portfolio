// Vercel Serverless Function: AI email drafter using Google Gemini REST API

async function discoverModels(apiKey) {
  for (const apiVersion of ['v1beta', 'v1']) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${apiVersion}/models?key=${apiKey}`);
      if (!res.ok) continue;
      const data = await res.json();
      const models = data?.models || [];
      const usable = models
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''));
      
      if (usable.length > 0) {
        return { apiVersion, models: usable };
      }
    } catch {
      // Continue to next version
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const apiKey = rawKey ? rawKey.trim().replace(/^["']|["']$/g, '') : '';

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
Keep the tone direct, natural, and free of clichés or filler. You must return ONLY a valid JSON object with "subject" and "message" fields. Example: {"subject": "...", "message": "..."}`;

  // 1. Try to discover available models for this specific API key
  const discovered = await discoverModels(apiKey);
  
  const attempts = [];
  if (discovered && discovered.models.length > 0) {
    const sorted = [...discovered.models].sort((a, b) => {
      const score = name => {
        if (name.includes('flash')) return 10;
        if (name.includes('pro')) return 5;
        return 1;
      };
      return score(b) - score(a);
    });
    for (const m of sorted.slice(0, 6)) {
      attempts.push({ apiVersion: discovered.apiVersion, model: m });
    }
  }

  // Fallback candidate list if discovery returned nothing
  const fallbackCandidates = [
    { apiVersion: 'v1beta', model: 'gemini-1.5-flash-latest' },
    { apiVersion: 'v1beta', model: 'gemini-1.5-flash' },
    { apiVersion: 'v1beta', model: 'gemini-2.0-flash' },
    { apiVersion: 'v1beta', model: 'gemini-2.0-flash-exp' },
    { apiVersion: 'v1beta', model: 'gemini-2.5-flash' },
    { apiVersion: 'v1', model: 'gemini-1.5-flash' },
    { apiVersion: 'v1beta', model: 'gemini-1.5-pro' },
    { apiVersion: 'v1', model: 'gemini-pro' }
  ];

  for (const fb of fallbackCandidates) {
    if (!attempts.some(a => a.apiVersion === fb.apiVersion && a.model === fb.model)) {
      attempts.push(fb);
    }
  }

  let lastError = null;

  for (const { apiVersion, model } of attempts) {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

    // Prompt embedding system instructions inside contents to guarantee compatibility across v1beta and v1
    const promptWithInstructions = `${systemInstructionText}\n\nUser note to Pedro: "${prompt.trim()}". Return JSON format: {"subject": "...", "message": "..."}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptWithInstructions }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    // If on v1beta, also include systemInstruction explicitly
    if (apiVersion === 'v1beta') {
      payload.systemInstruction = {
        parts: [{ text: systemInstructionText }]
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const rawErrMsg = errorData?.error?.message || errorData?.error || errorData?.message;
        lastError = typeof rawErrMsg === 'string' ? rawErrMsg : (JSON.stringify(rawErrMsg) || `HTTP ${status}`);
        console.warn(`[Gemini] ${apiVersion}/${model} returned ${status}:`, lastError);

        // If auth failure or quota limit, abort immediately to return exact error to user
        if (status === 401 || status === 403 || status === 429) {
          break;
        }
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        continue;
      }

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = { subject: 'Contact - Pedro Antonio Moya García', message: rawText.trim() };
        }
      }

      return res.status(200).json({
        subject: parsed.subject || '',
        message: parsed.message || ''
      });
    } catch (err) {
      lastError = err?.message || String(err);
      console.warn(`[Gemini] Network error with ${apiVersion}/${model}:`, lastError);
    }
  }

  console.error('All Gemini attempts failed:', lastError);
  return res.status(500).json({
    error: 'Failed to generate email draft with Gemini.',
    details: typeof lastError === 'string' ? lastError : JSON.stringify(lastError)
  });
}
