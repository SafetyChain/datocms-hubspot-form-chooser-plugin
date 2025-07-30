# DatoCMS HubSpot Form Chooser Plugin

A DatoCMS plugin that allows content editors to select HubSpot forms by name instead of manually copying form IDs.

## Features

- 🔍 **Search forms by name** - Type to filter through your HubSpot forms
- ⌨️ **Keyboard navigation** - Use arrow keys and Enter for quick selection
- 🔄 **Real-time updates** - Fetches forms directly from HubSpot API
- 🎨 **Clean UI** - Matches DatoCMS design patterns
- 🔒 **Secure** - API key never exposed to frontend

## Setup

### 1. HubSpot Private App

1. Log into HubSpot
2. Go to Settings → Integrations → Private Apps
3. Create a new private app with these scopes:
   - `forms` (read)
4. Copy the access token

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin)

Or manually:

```bash
git clone https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin.git
cd datocms-hubspot-form-chooser-plugin
vercel
```

### 3. Configure Environment Variables

In Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add: `HUBSPOT_API_KEY` = `your-private-app-token`

### 4. Install in DatoCMS

1. Go to your DatoCMS project
2. Navigate to Settings → Plugins
3. Click "Add private plugin"
4. Enter your plugin URL: `https://your-project.vercel.app/index-api.html`
5. Configure plugin settings if needed
6. Apply to fields that store HubSpot form IDs

## Local Development

```bash
# Clone the repository
git clone https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin.git
cd datocms-hubspot-form-chooser-plugin

# Create .env.local
echo "HUBSPOT_API_KEY=your-token-here" > .env.local

# Run locally
vercel dev

# Test the plugin
open http://localhost:3000/test.html
```

## Files

- `index.html` - Main plugin file with hardcoded forms (for testing)
- `index-api.html` - Production plugin that fetches from API
- `test.html` - Standalone test page
- `api/hubspot-forms.js` - Vercel serverless function
- `.env.local` - Local environment variables (git ignored)

## Usage

1. **Search**: Start typing to filter forms
2. **Navigate**: Use ↑↓ arrow keys to move through results
3. **Select**: Press Enter or click to select a form
4. **View**: Selected form ID is saved to DatoCMS field

## Security

- HubSpot API key is stored securely in Vercel environment variables
- API requests are proxied through your backend
- CORS headers are configured for DatoCMS only

## Troubleshooting

**Forms not loading?**
- Check Vercel logs for API errors
- Verify HubSpot API key is correct
- Ensure private app has `forms` read scope

**Plugin not appearing in DatoCMS?**
- Verify plugin URL is accessible
- Check browser console for errors
- Ensure field type is set to "string"

## License

Private plugin for SafetyChain use only.