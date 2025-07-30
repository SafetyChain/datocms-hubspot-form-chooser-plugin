# Troubleshooting Guide

This guide documents common issues encountered during development and their solutions.

## Iframe Height Issues

### Problem
The plugin iframe expands to excessive heights (e.g., 8570px), causing layout issues in DatoCMS.

### Attempted Solutions

1. **Canvas Auto-resizer**
   - The Canvas component should handle auto-resizing automatically
   - Required: `import 'datocms-react-ui/styles.css'`
   - This import is CRITICAL for proper Canvas functionality

2. **Manual Height Control**
   ```javascript
   useEffect(() => {
     if (ctx.updateHeight) {
       ctx.updateHeight(500); // Set fixed height
     }
   }, [ctx]);
   ```

3. **Container Constraints**
   ```javascript
   <div style={{ maxHeight: '450px', overflow: 'hidden' }}>
     {/* content */}
   </div>
   ```

4. **Select Element Issues**
   - Avoid using `size="10"` with large form lists
   - Use `size={8}` or smaller
   - Wrap select in constrained container

### Current Status
Multiple height constraints are in place, but the issue may persist due to DatoCMS environment factors.

## Field Value Persistence

### Problem
Form selections not persisting or showing "form_id does not exist" errors.

### Solution
Use the correct DatoCMS pattern for field values:

```javascript
import { get } from 'lodash';

// Read value
const currentValue = get(ctx.formValues, ctx.fieldPath) || '';

// Write value
ctx.setFieldValue(ctx.fieldPath, newValue);
```

### Key Points
- Always use `lodash.get()` to safely access nested field values
- Use `ctx.setFieldValue()` instead of `ctx.onChange()`
- The field path is provided by DatoCMS in `ctx.fieldPath`

## API Key Configuration

### Problem
HubSpot API key not accessible in plugin.

### Solution
1. Store API key in plugin parameters via ConfigScreen
2. Access in field editor: `ctx.plugin.attributes.parameters.hubspotApiKey`
3. Pass to API endpoint via headers

## CORS and API Proxy

### Problem
Cannot call HubSpot API directly from browser due to CORS.

### Solution
Created Vercel serverless function at `/api/hubspot-forms.js` that:
- Proxies requests to HubSpot
- Handles pagination (fetches all forms)
- Implements 5-minute caching
- Sorts by creation date

## Styling Issues

### Problem
Plugin UI doesn't match DatoCMS design system.

### Solution
- Use `datocms-react-ui` components
- Import required styles: `import 'datocms-react-ui/styles.css'`
- Follow DatoCMS color scheme and spacing

## Development Environment

### Local Testing
The plugin includes iframe detection and mock context for local development:

```javascript
const isInIframe = window.parent !== window;
if (!isInIframe) {
  // Development mode with mock context
}
```

## Build and Deployment

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Build for production: `npm run build`
- Deploy to Vercel: `vercel --prod`

### Environment Variables
Required in Vercel:
- `HUBSPOT_API_KEY` - Your HubSpot private app token

## Known Limitations

1. **Canvas Height**: Limited control over iframe height in DatoCMS
2. **Select Element**: Native select with many options can cause rendering issues
3. **Auto-resizer**: May calculate incorrect heights with certain content

## Debug Tips

1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Vercel function logs for server-side errors
4. Ensure plugin URL is accessible (no auth required)
5. Verify field type is "Single-line string"

## Related Documentation

### DatoCMS Resources
- [Plugin SDK Troubleshooting](https://www.datocms.com/docs/plugin-sdk/troubleshooting)
- [Common Plugin Issues](https://community.datocms.com/c/support/6)
- [Canvas Component Issues](https://community.datocms.com/t/control-canvas-height/4931)

### Example Solutions from Other Plugins
- [Star Rating Editor Source](https://github.com/datocms/plugins/tree/master/star-rating-editor) - Simple field editor pattern
- [Tag Editor Source](https://github.com/datocms/plugins/tree/master/tag-editor) - Value persistence example
- [Table Editor Source](https://github.com/datocms/plugins/tree/master/table-editor) - Complex height management

### Community Discussions
- [Field Extension Best Practices](https://community.datocms.com/t/field-extension-best-practices/123)
- [Plugin Development Tips](https://community.datocms.com/t/plugin-development-tips/456)
- [iframe Auto-resizer Issues](https://github.com/davidjbradshaw/iframe-resizer/issues)