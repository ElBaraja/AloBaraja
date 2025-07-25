export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwiGNj0Qd7KqwA3EXIKLENRINV3Yfs2eQs_MziptVzv6ewUSBYLcm1sL5gxmiQqoiIY/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error en el proxy', details: error.message });
  }
}
