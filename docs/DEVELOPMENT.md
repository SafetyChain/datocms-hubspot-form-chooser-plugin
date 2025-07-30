# Development Guide

This guide covers the development workflow and architecture of the DatoCMS HubSpot Form Chooser plugin.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   DatoCMS UI    │────▶│  Plugin iframe  │────▶│  Vercel API     │
│                 │     │   (React App)   │     │   Function      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │  HubSpot API    │
                                                 └─────────────────┘
```

## Project Structure

```
datocms-hubspot-form-chooser-plugin/
├── api/
│   └── hubspot-forms.js      # Vercel serverless function
├── docs/
│   ├── DEVELOPMENT.md        # This file
│   └── TROUBLESHOOTING.md    # Common issues and solutions
├── src/
│   ├── index.js              # Plugin entry point
│   ├── index.html            # HTML template
│   ├── HubSpotFormSelector.js # Main form selector component
│   └── ConfigScreen.js       # Plugin configuration UI
├── dist/                     # Build output (gitignored)
├── CLAUDE.md                 # AI assistant context
├── README.md                 # User documentation
├── package.json              # Dependencies and scripts
├── webpack.config.js         # Build configuration
└── vercel.json              # Deployment configuration
```

## Component Details

### Plugin Entry (src/index.js)

Handles plugin initialization and routing:

```javascript
connect({
  renderConfigScreen(ctx) {
    // Renders configuration UI
  },
  manualFieldExtensions(ctx) {
    // Declares available field extensions
  },
  renderFieldExtension(fieldExtensionId, ctx) {
    // Renders the form selector
  }
});
```

### Form Selector (src/HubSpotFormSelector.js)

Main component features:
- Search input with real-time filtering
- Select dropdown with form list
- Selected form details display
- Refresh button for cache bypass
- Loading and error states

Key implementation details:
```javascript
// Field value access pattern
const currentValue = get(ctx.formValues, ctx.fieldPath) || '';

// Update field value
ctx.setFieldValue(ctx.fieldPath, formId);

// API call with authentication
fetch(API_ENDPOINT, {
  headers: {
    'X-HubSpot-API-Key': apiKey
  }
});
```

### Configuration Screen (src/ConfigScreen.js)

Allows users to securely store their HubSpot API key:
```javascript
// Save API key to plugin parameters
await ctx.updatePluginParameters({
  hubspotApiKey: apiKey
});
```

### API Proxy (api/hubspot-forms.js)

Serverless function features:
- CORS handling for browser requests
- HubSpot API pagination (up to 2000 forms)
- 5-minute in-memory cache
- Automatic sorting by creation date
- Error handling and logging

## Development Workflow

### 1. Local Development

```bash
# Install dependencies
npm install

# Create environment file
echo "HUBSPOT_API_KEY=your-test-key" > .env.local

# Start development server
npm start
```

The plugin detects if it's running outside an iframe and provides a mock context for testing.

### 2. Testing Changes

1. Make code changes
2. Build the plugin: `npm run build`
3. Test locally at http://localhost:8080
4. Deploy to Vercel for iframe testing

### 3. Debugging

Use browser DevTools:
- Console for JavaScript errors
- Network tab for API requests
- React DevTools for component state

Common debug points:
```javascript
console.log('Selected form ID:', value);
console.log('Current field value:', currentValue);
console.log('API response:', data);
```

### 4. Building for Production

```bash
# Production build
npm run build

# Files are output to dist/
# - bundle.js (minified)
# - index.html
```

## API Integration

### HubSpot Forms API

Endpoint: `GET https://api.hubapi.com/marketing/v3/forms`

Parameters:
- `limit`: Max 100 per page
- `after`: Pagination cursor

Response structure:
```json
{
  "results": [
    {
      "id": "form-id",
      "name": "Form Name",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "paging": {
    "next": {
      "after": "cursor"
    }
  }
}
```

### Caching Strategy

Simple in-memory cache:
```javascript
let cache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

if (!forceRefresh && cache && (Date.now() - cacheTime < CACHE_DURATION)) {
  return cache;
}
```

## Styling Guidelines

Use DatoCMS React UI components and follow their design system:

```javascript
import { Canvas, Button, TextInput, Spinner } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css';
```

Custom styles should match DatoCMS:
- Colors: Use system colors (#0f172a, #64748b, etc.)
- Spacing: 8px grid system
- Border radius: 4px for inputs, 6px for containers
- Fonts: System fonts, 14px base size

## Performance Considerations

1. **API Calls**: Cached for 5 minutes to reduce load
2. **Pagination**: Fetches up to 2000 forms (20 pages)
3. **Filtering**: Client-side for instant search
4. **Bundle Size**: ~238KB minified

## Security

1. **API Key Storage**: Stored in plugin parameters (server-side)
2. **CORS**: Handled by Vercel proxy function
3. **Input Validation**: API key format validation
4. **Error Messages**: Don't expose sensitive data

## Testing Checklist

- [ ] Form search works correctly
- [ ] Form selection persists on save
- [ ] Selected form shows when editing
- [ ] Refresh button bypasses cache
- [ ] Error states display properly
- [ ] Loading states show spinner
- [ ] API key configuration saves
- [ ] Plugin height is reasonable
- [ ] Styling matches DatoCMS

## Deployment

1. Build the plugin: `npm run build`
2. Deploy to Vercel: `vercel --prod`
3. Set environment variable in Vercel dashboard
4. Copy deployment URL
5. Install in DatoCMS as private plugin

## Common Patterns

### Error Handling
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }
} catch (error) {
  setError(error.message);
}
```

### Loading States
```javascript
{loading ? (
  <Spinner />
) : error ? (
  <ErrorMessage />
) : (
  <Content />
)}
```

### Field Updates
```javascript
const handleSelectForm = (value) => {
  setSelectedForm(value);
  ctx.setFieldValue(ctx.fieldPath, value);
};
```

## Additional Resources

### DatoCMS Plugin Development
- [Plugin SDK Reference](https://www.datocms.com/docs/plugin-sdk)
- [Building Plugins Guide](https://www.datocms.com/docs/building-plugins)
- [Plugin Hooks Documentation](https://www.datocms.com/docs/plugin-sdk/hooks)
- [Plugin Context Object](https://www.datocms.com/docs/plugin-sdk/context-object)

### Example Plugins to Study
- [Star Rating Editor](https://github.com/datocms/plugins/tree/master/star-rating-editor) - Simple field editor
- [Tag Editor](https://github.com/datocms/plugins/tree/master/tag-editor) - Array value handling
- [Table Editor](https://github.com/datocms/plugins/tree/master/table-editor) - Complex UI
- [Color Picker](https://github.com/datocms/plugins/tree/master/color-picker) - Custom input
- [Conditional Fields](https://github.com/datocms/plugins/tree/master/conditional-fields) - Field visibility

### React UI Component Library
- [Component Documentation](https://datocms-react-ui.netlify.app/)
- [GitHub Repository](https://github.com/datocms/datocms-react-ui)
- [Usage Examples](https://github.com/datocms/plugins/search?q=datocms-react-ui)