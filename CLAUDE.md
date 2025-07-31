# Claude Assistant Context

This file provides context for Claude to better understand and work with this project.

## ⚠️ IMPORTANT: DatoCMS Documentation Corrections

**ALWAYS FOLLOW THESE PATTERNS - The official docs have errors!**

### ✅ CORRECT Patterns

1. **Field Value Access**:
```javascript
// CORRECT - Use lodash get and setFieldValue
import { get } from 'lodash';
const currentValue = get(ctx.formValues, ctx.fieldPath) || '';
ctx.setFieldValue(ctx.fieldPath, newValue);

// WRONG - These don't exist
ctx.onChange(value);  // ❌ NO!
ctx.fieldValue;       // ❌ NO!
```

2. **UI Components**:
```javascript
// CORRECT - Import styles or Canvas breaks!
import { Canvas, Button, TextField } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css';  // CRITICAL!

// WRONG - SwitchField doesn't exist
import { SwitchField } from 'datocms-react-ui';  // ❌ NO!
```

3. **Plugin Configuration**:
```javascript
// CORRECT - Use package.json for metadata
"datoCmsPlugin": {
  "title": "Plugin Name",
  "coverImage": "docs/cover.png",  // PNG only!
  "previewImage": "docs/preview.gif",
  "entryPoint": "dist/index.html"
}

// WRONG - No icon field
"icon": "icon.svg"  // ❌ NO!
```

### 📚 Trust These Sources

1. **Official Plugin Examples** > Documentation
   - [Star Rating Editor](https://github.com/datocms/plugins/tree/master/star-rating-editor)
   - [Tag Editor](https://github.com/datocms/plugins/tree/master/tag-editor)
   - [Conditional Fields](https://github.com/datocms/plugins/tree/master/conditional-fields)

2. **Community Forum** for real-world issues
   - [Canvas Height Issues](https://community.datocms.com/t/control-canvas-height/4931)

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
- Implements configurable caching (1-168 hours)
- Handles pagination
- Filters archived forms based on settings

### 4. Plugin Entry (`src/index.js`)
- Registers field extension
- Handles iframe detection
- Routes to appropriate components

## Critical Patterns (Documentation Corrected)

### Field Value Access
```javascript
// ✅ CORRECT - Always use this pattern
import { get } from 'lodash';
const currentValue = get(ctx.formValues, ctx.fieldPath) || '';
ctx.setFieldValue(ctx.fieldPath, newValue);

// ❌ NEVER use these (docs are wrong):
// ctx.onChange() - doesn't exist
// ctx.fieldValue - doesn't exist
// onChange prop - not provided
```

### Canvas Component
```javascript
// ✅ CORRECT - Must import styles
import { Canvas } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css'; // WITHOUT THIS = 8570px IFRAME!

<Canvas ctx={ctx}>
  {/* content */}
</Canvas>

// ❌ NEVER forget styles.css import
```

### UI Components That Actually Exist
```javascript
// ✅ THESE EXIST:
import { 
  Canvas, Button, TextField, TextInput, 
  Spinner, Dropdown, DropdownMenu, DropdownOption 
} from 'datocms-react-ui';

// ❌ THESE DON'T EXIST (despite docs):
// SwitchField - make custom checkboxes
// Toggle - doesn't exist
// Switch - doesn't exist
```

### Plugin Configuration (Two Files!)
```javascript
// ✅ CORRECT - package.json
{
  "datoCmsPlugin": {
    "title": "Name",
    "coverImage": "docs/cover.png",
    "previewImage": "docs/preview.gif"
  }
}

// ✅ CORRECT - datocms.json
{
  "fieldTypes": ["string"],
  "pluginType": "field_editor",
  "parameters": { ... }
}

// ❌ WRONG - icon field doesn't work
"icon": "anything"  // NO!
```

### API Configuration
```javascript
// Access API key from plugin parameters
const apiKey = ctx.plugin?.attributes?.parameters?.hubspotApiKey;
```

## Common Issues & Solutions

### 1. **Iframe Height = 8570px**
```javascript
// ✅ SOLUTION:
import 'datocms-react-ui/styles.css';  // MUST HAVE!
ctx.updateHeight(480);  // Manual control

// ❌ PROBLEM: Missing styles.css import
```

### 2. **Field Values Not Saving**
```javascript
// ✅ SOLUTION:
import { get } from 'lodash';
const value = get(ctx.formValues, ctx.fieldPath);
ctx.setFieldValue(ctx.fieldPath, newValue);

// ❌ PROBLEM: Using ctx.onChange() or direct assignment
```

### 3. **SwitchField Component Error**
```javascript
// ✅ SOLUTION: Custom checkbox
<input 
  type="checkbox" 
  checked={value} 
  onChange={(e) => setValue(e.target.checked)}
/>

// ❌ PROBLEM: import { SwitchField } - doesn't exist!
```

### 4. **Plugin Icon Not Showing**
```json
// ✅ SOLUTION in package.json:
"datoCmsPlugin": {
  "coverImage": "docs/cover.png"  // PNG only!
}

// ❌ PROBLEM: Using "icon" field - doesn't work!
```

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
2. **In-memory Cache**: Configurable cache duration (1-168 hours) to reduce API calls
3. **React + Webpack**: Required by DatoCMS plugin architecture
4. **Manual Pagination**: HubSpot API requires manual page fetching
5. **Archived Forms Filter**: Toggle to exclude forms with [archived] or [archive] in name
6. **Fixed Height**: Manual 480px height to prevent iframe expansion
7. **Consistent Typography**: System font stack at 14px throughout
8. **Configuration Options**: Archive filtering, date display, and cache duration are all configurable

## Future Improvements

1. Better iframe height handling
2. Keyboard navigation in form list
3. Form preview/details panel
4. Bulk form operations
5. Search filters (by type, status, etc.)

## Key Learnings

### Plugin Configuration
- DatoCMS plugins use TWO config files: `package.json` (with datoCmsPlugin section) and `datocms.json`
- No icon field - use coverImage and previewImage instead
- Always specify entryPoint in package.json

### UI Components
- SwitchField doesn't exist in datocms-react-ui - use custom checkboxes
- Always import 'datocms-react-ui/styles.css' or Canvas height breaks
- Consistent 14px font size with system font stack

### Field Values
- Always use lodash get() to access field values
- Use ctx.setFieldValue() not ctx.onChange()
- Field path is in ctx.fieldPath, value is in ctx.formValues

### When Docs Fail, Check These

1. **Working Examples First**:
   - [Official Plugins Repo](https://github.com/datocms/plugins)
   - Look at package.json in each plugin
   - Copy their patterns exactly

2. **Community Forum**:
   - [Canvas Height Issues](https://community.datocms.com/t/control-canvas-height/4931)
   - Search for your error message

3. **Component Storybook**:
   - [DatoCMS React UI Storybook](https://datocms-react-ui.netlify.app/)
   - Shows what components ACTUALLY exist

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