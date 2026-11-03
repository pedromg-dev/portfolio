// Vercel Serverless Function: Send contact email via EmailJS REST API
// Multi-layer Anti-Bot & Anti-Spam protection:
// 1. Honeypot trap (catches crawlers that autofill all input fields)
// 2. Time-trap verification (catches bots that submit in < 2.5 seconds)
// 3. Origin & Referer validation
// 4. In-memory IP rate limiting (max 3 emails per 10 minutes per IP)

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

function isValidOrigin(req) {
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';

  // Allow localhost (development), pedromg.dev and any subdomains
  const allowedHostRegex = /^(https?:\/\/(www\.)?pedromg\.dev|http:\/\/localhost(:\d+)?)/i;

  if (origin && !allowedHostRegex.test(origin)) {
    return false;
  }
  if (referer && !allowedHostRegex.test(referer)) {
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    email,
    subject,
    message,
    name,
    phone,
    company,
    projectType,
    budget,
    timeline,
    website,
    _gotcha,
    _timestamp
  } = req.body || {};

  // 1. Honeypot trap: if a bot filled the invisible website or _gotcha field
  if ((website && String(website).trim() !== '') || (_gotcha && String(_gotcha).trim() !== '')) {
    console.warn('[AntiBot] Honeypot triggered. Silently discarding spam submission.');
    // Return fake 200 so bot believes it succeeded and does not retry
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  }

  // 2. Time-trap: humans take at least 2.5 seconds to fill and submit
  if (_timestamp) {
    const elapsed = Date.now() - Number(_timestamp);
    if (elapsed < 2500) {
      console.warn(`[AntiBot] Time-trap triggered (${elapsed}ms). Silently discarding spam submission.`);
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
  }

  // 3. Origin check: prevent direct curl/foreign site POST abuse
  if (!isValidOrigin(req)) {
    console.warn('[AntiBot] Rejected request with invalid origin/referer:', req.headers.origin, req.headers.referer);
    return res.status(403).json({ error: 'Forbidden: Invalid request origin' });
  }

  // 4. Rate limiting per IP
  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                   req.headers['x-real-ip'] ||
                   req.socket?.remoteAddress ||
                   'unknown';

  if (clientIp !== 'unknown' && isRateLimited(clientIp)) {
    console.warn(`[AntiBot] Rate limit exceeded for IP: ${clientIp}`);
    return res.status(429).json({
      error: 'Has enviado demasiados mensajes recientemente. Por favor, inténtalo de nuevo en unos minutos.'
    });
  }

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: email, subject, message' });
  }

  const serviceId = (process.env.EMAILJS_SERVICE_ID || '').trim();
  const templateId = (process.env.EMAILJS_TEMPLATE_ID || '').trim();
  const publicKey = (process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID || '').trim();
  const privateKey = (process.env.EMAILJS_PRIVATE_KEY || process.env.EMAILJS_ACCESS_TOKEN || '').trim();

  if (!serviceId || !templateId || !publicKey) {
    return res.status(500).json({
      error: 'Missing EmailJS configuration in Vercel.',
      details: 'EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY must be configured in Vercel Project Settings > Environment Variables.'
    });
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      email,
      user_email: email,
      from_email: email,
      from_name: name || email,
      name: name || '',
      phone: phone || '',
      company: company || '',
      project_type: projectType || '',
      budget: budget || '',
      timeline: timeline || '',
      reply_to: email,
      subject,
      message
    }
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  try {
    const origin = req.headers.origin || 'https://www.pedromg.dev';

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': origin,
        'Referer': `${origin}/`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'EmailJS API Error');
      console.error('[EmailJS Backend Error]:', response.status, errorText);
      return res.status(response.status >= 400 && response.status < 500 ? 400 : 502).json({
        error: 'Failed to send email via EmailJS',
        details: errorText || `HTTP ${response.status}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('[EmailJS Network Error]:', error);
    return res.status(500).json({
      error: 'Network error connecting to EmailJS',
      details: error?.message || String(error)
    });
  }
}
