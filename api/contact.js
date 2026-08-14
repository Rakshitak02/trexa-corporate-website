export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Aggregate incoming form data. Vercel may parse urlencoded bodies into req.body
    let params;

    if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
      if (typeof req.body === 'string') {
        params = new URLSearchParams(req.body);
      } else if (req.body && Object.keys(req.body).length) {
        params = new URLSearchParams();
        Object.entries(req.body).forEach(([k, v]) => params.append(k, v));
      } else {
        // Fallback: read raw body
        const buf = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
          req.on('error', err => reject(err));
        });
        params = new URLSearchParams(buf || '');
      }
    } else if (req.body && Object.keys(req.body).length) {
      params = new URLSearchParams();
      Object.entries(req.body).forEach(([k, v]) => params.append(k, v));
    } else {
      // If nothing found, initialize empty
      params = new URLSearchParams();
    }

    // Attach the server-side Web3Forms key from Vercel environment
    const key = process.env.WEB3FORMS_KEY || '';
    if (!key) return res.status(500).json({ error: 'Server misconfiguration: missing WEB3FORMS_KEY' });
    params.set('access_key', key);

    // Forward to Web3Forms as urlencoded form data
    const forward = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    const json = await forward.json();
    return res.status(forward.ok ? 200 : 502).json(json);
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}