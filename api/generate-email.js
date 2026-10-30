import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Missing GEMINI_API_KEY environment variable in Vercel.'
    });
  }

  try {
    const { prompt, language = 'es' } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const client = new GoogleGenAI({ apiKey });

    const langInstruction =
      language === 'en'
        ? 'Write the subject and message in professional, concise English.'
        : 'Escribe el asunto y el mensaje en español profesional, natural y directo.';

    const interaction = await client.interactions.create({
      model: 'gemini-3.8-flash',
      system_instruction: `You are an assistant helping a recruiter, client, or colleague draft a concise, professional contact email to Pedro Antonio Moya García (Senior Full-Stack .NET Developer specializing in C#, .NET 10, Clean Architecture, Microservices, Blazor, Angular, SQL Server, Azure CosmosDB, and Azure/AWS).
${langInstruction}
Keep the tone direct, natural, and free of clichés or filler. Return a JSON object with "subject" and "message".`,
      input: `Draft a contact email to Pedro based on this note: "${prompt.trim()}"`,
      response_format: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            description: 'Concise email subject line'
          },
          message: {
            type: 'string',
            description: 'Well-structured email body ready to send'
          }
        },
        required: ['subject', 'message']
      },
      store: false
    });

    const parsed = JSON.parse(interaction.output_text || '{}');
    return res.status(200).json({
      subject: parsed.subject || '',
      message: parsed.message || ''
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Failed to generate email draft with Gemini.'
    });
  }
}
