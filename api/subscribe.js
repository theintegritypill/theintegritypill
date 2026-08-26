// Vercel serverless function — POST /api/subscribe
//
// Server-side only. Reads MAILERLITE_API_TOKEN from Vercel's environment
// variables and forwards the submitted name/email to MailerLite. The token
// never reaches the browser: this file only ever runs on Vercel's servers,
// and the client only ever sees the JSON response { ok: true|false } below.

const MAILERLITE_GROUP_ID = '196822197533148252'; // "Integrity Pill — Early Access"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const firstname = typeof body.firstname === 'string' ? body.firstname.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!firstname || !email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_input' });
  }

  const token = process.env.MAILERLITE_API_TOKEN;
  if (!token) {
    console.error('subscribe: MAILERLITE_API_TOKEN is not set');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  try {
    // MailerLite upserts subscribers by email — an existing subscriber gets
    // its fields/groups updated rather than causing a duplicate or an error.
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email,
        fields: { name: firstname },
        groups: [MAILERLITE_GROUP_ID]
      })
    });

    if (!mlRes.ok) {
      const errText = await mlRes.text().catch(() => '');
      console.error('subscribe: MailerLite error', mlRes.status, errText);
      return res.status(502).json({ ok: false, error: 'subscribe_failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe: MailerLite request failed', err);
    return res.status(502).json({ ok: false, error: 'subscribe_failed' });
  }
};
