// Vercel Serverless Function: Send contact email via EmailJS REST API
// Controlled strictly via private Vercel Environment Variables:
// - EMAILJS_SERVICE_ID
// - EMAILJS_TEMPLATE_ID
// - EMAILJS_PUBLIC_KEY (or EMAILJS_USER_ID)
// - EMAILJS_PRIVATE_KEY (optional, if Access Token is enabled in EmailJS dashboard)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, subject, message, name, phone, company, projectType, budget, timeline } = req.body || {};

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
