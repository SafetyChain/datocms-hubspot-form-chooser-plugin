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
    let allForms = [];
    let after = undefined;
    let pageCount = 0;
    const maxPages = 20; // Safety limit to prevent infinite loops

    // Fetch all pages of forms
    do {
      const url = new URL('https://api.hubapi.com/marketing/v3/forms');
      url.searchParams.append('limit', '100'); // HubSpot recommends 100 per page
      if (after) {
        url.searchParams.append('after', after);
      }

      console.log(`Fetching page ${pageCount + 1}...`);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results) {
        allForms = allForms.concat(data.results);
      }

      // Check if there are more pages
      after = data.paging?.next?.after;
      pageCount++;

      // Safety check to prevent infinite loops
      if (pageCount >= maxPages) {
        console.warn(`Reached maximum page limit of ${maxPages}`);
        break;
      }

    } while (after);

    console.log(`Fetched ${allForms.length} forms across ${pageCount} pages`);

    // Sort all forms alphabetically
    allForms.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({ 
      results: allForms,
      total: allForms.length 
    });

  } catch (error) {
    console.error('HubSpot API error:', error);
    return res.status(500).json({ error: 'Failed to fetch forms' });
  }
}