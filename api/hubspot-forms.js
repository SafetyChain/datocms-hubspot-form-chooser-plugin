// Simple in-memory cache
let cache = {
  data: null,
  timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

  // Check if we should force refresh
  const forceRefresh = req.query.refresh === 'true';

  // Check cache
  if (!forceRefresh && cache.data && cache.timestamp) {
    const cacheAge = Date.now() - cache.timestamp;
    if (cacheAge < CACHE_DURATION) {
      console.log('Returning cached data, age:', Math.round(cacheAge / 1000), 'seconds');
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Age', Math.round(cacheAge / 1000));
      return res.status(200).json(cache.data);
    }
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

    // Sort forms by creation date (newest first)
    allForms.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA; // Newest first
    });

    const responseData = { 
      results: allForms,
      total: allForms.length 
    };

    // Update cache
    cache.data = responseData;
    cache.timestamp = Date.now();
    
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('HubSpot API error:', error);
    return res.status(500).json({ error: 'Failed to fetch forms' });
  }
}