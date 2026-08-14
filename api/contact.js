export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Collect incoming form data. Support urlencoded bodies, parsed objects, and raw fallbacks.
    let params;

    const contentType = (req.headers['content-type'] || '').toLowerCase();

    if (contentType.includes('application/x-www-form-urlencoded')) {
      if (typeof req.body === 'string') {
        params = new URLSearchParams(req.body);
      } else if (req.body && Object.keys(req.body).length) {
        params = new URLSearchParams();
        Object.entries(req.body).forEach(([k, v]) => params.append(k, v));
      } else {
        // Read raw body
        const raw = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
          req.on('error', err => reject(err));
        });
        params = new URLSearchParams(raw || '');
      }
    } else if (req.body && Object.keys(req.body).length) {
      params = new URLSearchParams();
      Object.entries(req.body).forEach(([k, v]) => params.append(k, v));
    } else {
      params = new URLSearchParams();
    }

    const key = process.env.WEB3FORMS_KEY || '';
    if (!key) return res.status(500).json({ error: 'Server misconfiguration: missing WEB3FORMS_KEY' });
    params.set('access_key', key);

    const forward = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    const text = await forward.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Upstream returned non-JSON (likely HTML). Log safely and return a structured error.
      console.error('Web3Forms non-JSON response, status:', forward.status);
      return res.status(502).json({
        success: false,
        error: 'Upstream service returned an unexpected response',
        upstream_status: forward.status,
        upstream_body_preview: text.slice(0, 1024)
      });
    }

    return res.status(forward.ok ? 200 : 502).json(parsed);
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}