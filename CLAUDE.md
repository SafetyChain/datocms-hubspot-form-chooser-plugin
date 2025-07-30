# Claude Assistant Context

This file provides context for Claude to better understand and work with this project.

## Project Overview

**Purpose**: A DatoCMS plugin that allows content editors to select HubSpot forms by name instead of manually copying form IDs.

**Tech Stack**:
- React 18 with Webpack 5
- DatoCMS Plugin SDK
- DatoCMS React UI components
- Vercel serverless functions
- HubSpot Marketing API v3

## Key Components

### 1. Field Editor (`src/HubSpotFormSelector.js`)
- Main UI for selecting forms
- Search functionality
- Shows selected form details
- Handles value persistence

### 2. Configuration Screen (`src/ConfigScreen.js`)
- Allows users to enter HubSpot API key
- Stored in plugin parameters

### 3. API Proxy (`api/hubspot-forms.js`)
- Vercel serverless function
- Fetches forms from HubSpot API
- Implements caching (5 minutes)
- Handles pagination

### 4. Plugin Entry (`src/index.js`)
- Registers field extension
- Handles iframe detection
- Routes to appropriate components

## Critical Patterns

### Field Value Access
```javascript
// Always use this pattern for field values
import { get } from 'lodash';
const currentValue = get(ctx.formValues, ctx.fieldPath) || '';
ctx.setFieldValue(ctx.fieldPath, newValue);
```

### Canvas Component
```javascript
// Always wrap content in Canvas
import { Canvas } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css'; // CRITICAL!

<Canvas ctx={ctx}>
  {/* content */}
</Canvas>
```

### API Configuration
```javascript
// Access API key from plugin parameters
const apiKey = ctx.plugin?.attributes?.parameters?.hubspotApiKey;
```

## Common Issues

1. **Iframe Height**: Plugin iframe may expand to excessive heights (8570px)
   - Multiple constraints in place but issue persists
   - Related to DatoCMS Canvas auto-resizer

2. **Field Persistence**: Must use correct field value pattern
   - Use `lodash.get()` and `ctx.setFieldValue()`

3. **Styling**: Must import datocms-react-ui styles

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Testing Approach

1. Local development with mock context (outside iframe)
2. Build and deploy to Vercel
3. Install in DatoCMS as private plugin
4. Test on actual content models

## Important Files

- `/api/hubspot-forms.js` - API endpoint
- `/src/HubSpotFormSelector.js` - Main form selector
- `/src/ConfigScreen.js` - Plugin configuration
- `/src/index.js` - Plugin entry point
- `/docs/TROUBLESHOOTING.md` - Known issues and solutions

## Environment Variables

**Vercel Production**:
- `HUBSPOT_API_KEY` - HubSpot private app token

**Local Development**:
- Create `.env.local` with same variable

## Design Decisions

1. **Vercel Serverless**: Chosen for easy deployment and CORS handling
2. **In-memory Cache**: Simple 5-minute cache to reduce API calls
3. **React + Webpack**: Required by DatoCMS plugin architecture
4. **Manual Pagination**: HubSpot API requires manual page fetching

## Future Improvements

1. Better iframe height handling
2. Keyboard navigation in form list
3. Form preview/details panel
4. Bulk form operations
5. Search filters (by type, status, etc.)

## Helpful Resources

### DatoCMS Documentation
- [DatoCMS Plugin SDK Docs](https://www.datocms.com/docs/plugin-sdk)
- [Field Extensions](https://www.datocms.com/docs/plugin-sdk/field-extensions)
- [Plugin Configuration Screen](https://www.datocms.com/docs/plugin-sdk/configuration-screen)
- [Plugin Parameters](https://www.datocms.com/docs/plugin-sdk/plugin-parameters)
- [DatoCMS React UI](https://github.com/datocms/react-ui)
- [DatoCMS React UI Storybook](https://datocms-react-ui.netlify.app/)

### DatoCMS Plugin Examples
- [Official Plugins Repository](https://github.com/datocms/plugins)
- [Star Rating Editor Plugin](https://github.com/datocms/plugins/tree/master/star-rating-editor)
- [Tag Editor Plugin](https://github.com/datocms/plugins/tree/master/tag-editor)
- [Table Editor Plugin](https://github.com/datocms/plugins/tree/master/table-editor)
- [Todo List Plugin](https://github.com/datocms/plugins/tree/master/todo-list)
- [Lorem Ipsum Plugin](https://github.com/datocms/plugins/tree/master/lorem-ipsum)

### Community Resources
- [DatoCMS Community Forum](https://community.datocms.com/)
- [Canvas Height Control Discussion](https://community.datocms.com/t/control-canvas-height/4931)

### External APIs
- [HubSpot Forms API](https://developers.hubspot.com/docs/api/marketing/forms)
- [HubSpot API Authentication](https://developers.hubspot.com/docs/api/private-apps)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)