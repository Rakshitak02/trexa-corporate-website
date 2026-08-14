module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    if (!process.env.WEB3FORMS_KEY) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    const form = new URLSearchParams();

    Object.entries(req.body || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, String(value));
      }
    });

    form.set("access_key", process.env.WEB3FORMS_KEY);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: form.toString()
    });

    const data = await response.json();

    return res.status(response.ok ? 200 : 502).json(data);
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit the contact form"
    });
  }
};