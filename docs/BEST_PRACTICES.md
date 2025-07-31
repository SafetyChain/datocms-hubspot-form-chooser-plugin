# DatoCMS Plugin Development Best Practices

This document outlines the proper ways to develop DatoCMS plugins based on lessons learned during the development of the HubSpot Form Chooser plugin.

## Table of Contents
- [Plugin Configuration](#plugin-configuration)
- [Field Value Management](#field-value-management)
- [UI Components and Styling](#ui-components-and-styling)
- [Plugin Branding](#plugin-branding)
- [API Integration](#api-integration)
- [Common Pitfalls](#common-pitfalls)

## Plugin Configuration

### ✅ Proper Plugin Metadata

DatoCMS plugins use **two configuration files**:

1. **`package.json`** - Contains the `datoCmsPlugin` section:
```json
{
  "datoCmsPlugin": {
    "title": "Your Plugin Name",
    "coverImage": "docs/cover.png",
    "previewImage": "docs/preview.gif",
    "entryPoint": "dist/index.html"
  }
}
```

2. **`datocms.json`** - Contains plugin parameters and field types:
```json
{
  "name": "Plugin Name",
  "description": "Plugin description",
  "version": "1.0.0",
  "fieldTypes": ["string"],
  "pluginType": "field_editor",
  "parameters": {
    "global": [...],
    "instance": [...]
  }
}
```

### ❌ Common Mistakes
- Don't use an `icon` field - DatoCMS uses `coverImage` and `previewImage`
- Don't forget the `entryPoint` in package.json
- Don't mix configuration between the two files

## Field Value Management

### ✅ Proper Field Value Access

Always use the DatoCMS-recommended pattern:

```javascript
import { get } from 'lodash';

// Read field value
const currentValue = get(ctx.formValues, ctx.fieldPath) || '';

// Update field value
ctx.setFieldValue(ctx.fieldPath, newValue);
```

### ❌ Common Mistakes
```javascript
// DON'T do this
ctx.onChange(value); // This method doesn't exist

// DON'T access values directly
const value = ctx.fieldPath; // This is just the path, not the value
```

## UI Components and Styling

### ✅ Proper Component Usage

1. **Always import required styles**:
```javascript
import { Canvas, Button, TextField } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css'; // CRITICAL!
```

2. **Wrap content in Canvas**:
```javascript
return (
  <Canvas ctx={ctx}>
    {/* Your content here */}
  </Canvas>
);
```

3. **Use consistent typography**:
```javascript
const baseStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: '14px',
  color: '#333'
};
```

### ❌ Common Mistakes
- Missing the styles.css import causes Canvas height issues
- Using SwitchField component (doesn't exist) - use custom checkboxes
- Inconsistent font sizes and families

## Plugin Branding

### ✅ Proper Image Assets

1. **Cover Image** (required):
   - Format: PNG
   - Recommended size: 1200x630px
   - Location: `docs/cover.png`
   - Shows in plugin marketplace

2. **Preview Image** (optional):
   - Format: GIF or MP4
   - Shows plugin in action
   - Location: `docs/preview.gif` or `docs/preview.mp4`

3. **Internal Images**:
   - Store in `public/images/`
   - Copy to dist with webpack:
   ```javascript
   new CopyWebpackPlugin({
     patterns: [{ from: 'public', to: '' }]
   })
   ```

### ❌ Common Mistakes
- Using SVG for coverImage (must be PNG)
- Trying to use an icon field
- Wrong image paths in production

## API Integration

### ✅ Proper API Proxy Setup

1. **Use serverless functions** for API calls:
```javascript
// api/your-endpoint.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Your API logic here
}
```

2. **Handle configuration properly**:
```javascript
// Get settings from plugin parameters
const apiKey = ctx.plugin?.attributes?.parameters?.apiKey;
const filterEnabled = ctx.plugin?.attributes?.parameters?.filterEnabled !== false;
```

3. **Implement caching** for better performance:
```javascript
// Configurable cache duration
const cacheHours = parseInt(req.query.cacheHours) || 24;
const CACHE_DURATION = cacheHours * 60 * 60 * 1000;
let cache = { data: null, timestamp: null };
```

### ❌ Common Mistakes
- Making API calls directly from the browser (CORS issues)
- Exposing API keys in frontend code
- Not implementing error handling

## Common Pitfalls

### 1. Iframe Height Issues

**Problem**: Plugin iframe expands to excessive heights (e.g., 8570px)

**Solution**:
```javascript
// Use manual height control
useEffect(() => {
  if (ctx.updateHeight) {
    ctx.updateHeight(480); // Set appropriate height
  }
}, [ctx]);
```

### 2. Configuration Not Saving

**Problem**: Plugin parameters not persisting

**Solution**:
```javascript
// Use proper parameter update method
await ctx.updatePluginParameters({
  apiKey: value,
  otherSetting: otherValue
});
```

### 3. Development vs Production URLs

**Problem**: API endpoints fail in production

**Solution**:
```javascript
const API_ENDPOINT = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/endpoint'
  : '/api/endpoint';
```

### 4. Component Import Errors

**Problem**: DatoCMS React UI components not found

**Solution**: Check component names in the official storybook:
- ✅ `TextField`, `Button`, `Canvas`, `Spinner`
- ❌ `SwitchField` (doesn't exist - use custom implementation)

## Testing Checklist

Before deploying your plugin:

- [ ] Test in iframe context (not just local development)
- [ ] Verify all images load in production
- [ ] Check field value persistence
- [ ] Test with different field types
- [ ] Verify configuration saves properly
- [ ] Test error states and loading states
- [ ] Check responsive behavior
- [ ] Validate CORS headers for API calls

## Resources

- [DatoCMS Plugin SDK](https://www.datocms.com/docs/plugin-sdk)
- [React UI Storybook](https://datocms-react-ui.netlify.app/)
- [Official Plugin Examples](https://github.com/datocms/plugins)
- [Community Forum](https://community.datocms.com/)

## Documentation Discrepancies Found

### Issues with Official DatoCMS Documentation

1. **Missing Component Documentation**
   - The docs reference components that don't exist in `datocms-react-ui`
   - `SwitchField` is mentioned but not available - you must create custom checkboxes
   - No clear list of available components (had to check Storybook)

2. **Incomplete Field Value Patterns**
   - Documentation suggests `ctx.onChange()` exists, but it doesn't
   - The correct pattern using `ctx.setFieldValue()` is not prominently documented
   - Field value access pattern with `lodash.get()` is not clearly explained

3. **Plugin Configuration Confusion**
   - Documentation doesn't clearly explain the two-file system (`package.json` vs `datocms.json`)
   - The `icon` field is mentioned in some places but doesn't actually work
   - Proper use of `coverImage` and `previewImage` is not well documented

4. **Canvas Component Requirements**
   - Critical requirement to import styles.css is not emphasized
   - Without styles import, Canvas auto-resizer fails catastrophically (8570px iframe)
   - This is a common issue based on community forum posts

## Helpful Plugin Examples

These official DatoCMS plugins provided the most insight:

### 1. **Star Rating Editor** ([GitHub](https://github.com/datocms/plugins/tree/master/star-rating-editor))
- Simple field editor pattern
- Proper Canvas usage
- Clear value handling

### 2. **Tag Editor** ([GitHub](https://github.com/datocms/plugins/tree/master/tag-editor))
- Array value persistence
- Good example of field value management
- Clean UI implementation

### 3. **Conditional Fields** ([GitHub](https://github.com/datocms/plugins/tree/master/conditional-fields))
- Complex field interactions
- Proper use of plugin parameters
- Good configuration screen example

### 4. **Todo List** ([GitHub](https://github.com/datocms/plugins/tree/master/todo-list))
- JSON field handling
- Interactive UI elements
- State management patterns

### Key Discoveries from Plugin Analysis

1. **All plugins use `package.json` for metadata**:
   ```json
   "datoCmsPlugin": {
     "title": "Plugin Name",
     "coverImage": "docs/cover.png",
     "previewImage": "docs/demo.gif"
   }
   ```

2. **No plugin uses an `icon` field** - they all use coverImage/previewImage

3. **Consistent patterns** for field value access using lodash

4. **All wrap content in Canvas** with proper style imports

## Community Resources That Helped

1. **Canvas Height Control Discussion** ([Link](https://community.datocms.com/t/control-canvas-height/4931))
   - Revealed the 20px minimum height limitation
   - Showed others struggling with iframe height issues
   - Led to discovery of manual height control solution

2. **DatoCMS Plugins Repository** ([GitHub](https://github.com/datocms/plugins))
   - Real-world examples that work
   - Showed proper configuration patterns
   - Revealed undocumented conventions

## Summary

Building DatoCMS plugins requires understanding their specific patterns and conventions. Key takeaways:

1. Use two config files (`package.json` and `datocms.json`)
2. Always use Canvas and import styles
3. Follow the field value access pattern with lodash
4. Use serverless functions for API integration
5. Implement proper error handling and loading states
6. Test thoroughly in the actual DatoCMS environment
7. **Trust the official plugin examples more than the documentation**
8. **Check community forums for common issues**

By following these practices and learning from existing plugins, you'll avoid common pitfalls and create plugins that integrate seamlessly with DatoCMS.