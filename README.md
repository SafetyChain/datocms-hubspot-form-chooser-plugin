# DatoCMS HubSpot Form Chooser Plugin

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![DatoCMS](https://img.shields.io/badge/DatoCMS-plugin-ff7751.svg)](https://www.datocms.com)

A React-based DatoCMS plugin that allows content editors to select HubSpot forms by name instead of manually copying form IDs.

## Features

- 🔍 **Search forms by name** - Type to filter through your HubSpot forms
- 🎯 **Smart sorting** - Newest forms appear first  
- 🔄 **Real-time updates** - Fetches forms directly from HubSpot API
- 💾 **Configurable cache** - Set cache duration from 1 hour to 1 week
- 🎨 **Native DatoCMS UI** - Uses official React components
- 🔒 **Secure** - API key stored in plugin settings
- 🗂️ **Archive filtering** - Toggle to exclude archived forms
- 📅 **Date display toggle** - Show/hide form creation dates
- 📏 **Optimized height** - Fixed 480px to prevent layout issues

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
npm install
npm run build
vercel --prod
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
4. Enter your plugin URL: `https://your-project.vercel.app`
5. Apply to Single-line string fields that store HubSpot form IDs

## Local Development

```bash
# Clone the repository
git clone https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin.git
cd datocms-hubspot-form-chooser-plugin

# Install dependencies
npm install

# Create .env.local
echo "HUBSPOT_API_KEY=your-token-here" > .env.local

# Run development server
npm start

# Build for production
npm run build
```

## Project Structure

```
├── src/
│   ├── index.js              # Plugin entry point
│   ├── index.html            # HTML template
│   └── HubSpotFormSelector.js # Main React component
├── api/
│   └── hubspot-forms.js      # Vercel serverless function
├── dist/                     # Build output (git ignored)
├── package.json              # Dependencies and scripts
├── webpack.config.js         # Webpack configuration
└── vercel.json              # Vercel deployment config
```

## Usage

1. **Search**: Start typing to filter forms by name
2. **Select**: Click on a form to select it
3. **View details**: See the selected form name and ID
4. **Refresh**: Click the refresh button to fetch latest forms

The plugin automatically:
- Sorts forms by creation date (newest first)
- Shows creation date next to each form (configurable)
- Caches results for the configured duration (default: 24 hours)
- Saves just the form ID to your DatoCMS field

## API Details

The plugin uses HubSpot's Marketing API v3:
- Endpoint: `GET /marketing/v3/forms`
- Pagination: Fetches up to 2000 forms (20 pages)
- Caching: Configurable in-memory cache (1-168 hours)
- Sorting: By creation date, newest first

## Security

- HubSpot API key is stored securely in Vercel environment variables
- API requests are proxied through your Vercel backend
- The API key is never exposed to the frontend
- CORS headers are properly configured

## Documentation

- 📖 [Development Guide](docs/DEVELOPMENT.md) - Architecture, workflow, and patterns
- 🔧 [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions
- ✅ [Best Practices](docs/BEST_PRACTICES.md) - Proper DatoCMS plugin development practices
- 🤖 [Claude Context](CLAUDE.md) - AI assistant documentation

## Quick Troubleshooting

**Forms not loading?**
- Check Vercel function logs for API errors
- Verify HubSpot API key is correct
- Ensure private app has `forms` read scope
- See [full troubleshooting guide](docs/TROUBLESHOOTING.md)

**Plugin not appearing?**
- Verify the plugin URL is accessible
- Check that the field type is "Single-line string"
- See [development guide](docs/DEVELOPMENT.md#testing-checklist)

## Plugin Configuration

### Global Settings
- **HubSpot API Key**: Your private app token (required)
- **Filter Archived Forms**: Toggle to hide forms with [archived] in name
- **Show Creation Dates**: Toggle to display dates in dropdown
- **Cache Duration**: Set cache timeout (1-168 hours)

### Field Settings
Apply this plugin to any Single-line string field that should store a HubSpot form ID.

## Marketplace Setup

To prepare this plugin for the DatoCMS marketplace:

1. **Create Required Images**:
   - `docs/cover.png` - 1200x630px marketplace card
   - `docs/preview.gif` - Demo of plugin in action

2. **See Full Guide**: [Marketplace Setup Guide](docs/MARKETPLACE_SETUP.md)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

### Latest Version: 1.2.0
- Added configurable cache timeout (1-168 hours)
- Improved marketplace setup with proper cover image
- Enhanced documentation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.