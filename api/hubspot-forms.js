export default async function handler(req, res) {
  // Enable CORS for the plugin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

  if (!HUBSPOT_API_KEY) {
    return res.status(500).json({ error: 'HubSpot API key not configured' });
  }

  try {
    const response = await fetch(
      'https://api.hubapi.com/marketing/v3/forms?limit=500',
      {
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    const data = await response.json();

    // Sort forms alphabetically
    if (data.results) {
      data.results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('HubSpot API error:', error);
    return res.status(500).json({ error: 'Failed to fetch forms' });
  }
}