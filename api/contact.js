export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Expect Vercel/Next to have parsed JSON body already (Content-Type: application/json)
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ success: false, error: 'Missing request body' });
    }

    const key = process.env.WEB3FORMS_KEY;
    if (!key) {
      return res.status(500).json({ success: false, error: 'Missing WEB3FORMS_KEY' });
    }

    // Build payload and include the access key from environment only on the server
    const payload = { ...body, access_key: key };

    const upstream = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Upstream returned non-JSON (likely HTML). Log safely and return a structured error.
      console.error('Upstream returned non-JSON response', { status: upstream.status });
      return res.status(502).json({
        success: false,
        error: 'Upstream returned a non-JSON response',
        upstream_status: upstream.status,
        upstream_body_preview: String(text).slice(0, 1024)
      });
    }

    // Forward upstream JSON with the same HTTP status code
    return res.status(upstream.status).json(parsed);
  } catch (err) {
    console.error('Contact API error:', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, error: 'Unexpected server error' });
  }
}