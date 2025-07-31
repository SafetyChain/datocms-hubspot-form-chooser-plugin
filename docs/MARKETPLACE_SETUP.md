# DatoCMS Plugin Marketplace Setup Guide

This guide explains how to prepare your plugin for the DatoCMS marketplace.

## Required Assets

### 1. Cover Image (Required)
- **File**: `docs/cover.png`
- **Format**: PNG only (not JPG, not SVG)
- **Recommended size**: 1200x630px (2:1 aspect ratio)
- **Purpose**: Main image shown in the plugin marketplace listing
- **Design tips**:
  - Include your plugin name
  - Show the plugin interface or key feature
  - Use your brand colors
  - Make it eye-catching but professional

### 2. Preview Image/Video (Optional but Recommended)
- **File**: `docs/preview.gif` or `docs/preview.mp4`
- **Format**: GIF or MP4
- **Recommended size**: 800x600px or similar
- **Duration**: 10-30 seconds for GIF/video
- **Purpose**: Shows the plugin in action
- **Content ideas**:
  - Demo of selecting a HubSpot form
  - Show the search functionality
  - Display the configuration screen
  - Highlight key features

## Creating the Cover Image

Since you don't have a cover image yet, here's what you need to create:

1. **Design a 1200x630px PNG image** that includes:
   - Plugin name: "HubSpot Form Chooser"
   - SafetyChain and HubSpot logos
   - Visual representation of form selection
   - Clean, professional design

2. **Save it as**: `docs/cover.png`

### Example Cover Image Layout:
```
+----------------------------------+
|     HubSpot Form Chooser         |
|                                  |
|  [SafetyChain Logo] + [HubSpot]  |
|                                  |
|   🔍 Search and select forms     |
|   📝 No more copying IDs         |
|   ⚡ Real-time sync              |
|                                  |
|    For DatoCMS                   |
+----------------------------------+
```

## Creating the Preview GIF/Video

To create a preview showing your plugin in action:

1. **Record a screen capture** showing:
   - Opening the plugin in DatoCMS
   - Searching for a form
   - Selecting a form
   - Showing the selected value
   - (Optional) Configuring the API key

2. **Convert to GIF or MP4**:
   - Keep file size under 10MB
   - 10-30 seconds duration
   - Show the most impressive features

3. **Save as**: `docs/preview.gif` or `docs/preview.mp4`

## Marketplace Metadata

Your plugin already has the basic metadata in `package.json`:

```json
{
  "datoCmsPlugin": {
    "title": "HubSpot Form Chooser",
    "coverImage": "docs/cover.png",
    "previewImage": "docs/preview.gif",
    "entryPoint": "dist/index.html"
  }
}
```

Additional metadata in `datocms.json`:

```json
{
  "name": "HubSpot Form Chooser",
  "description": "Select HubSpot forms by name instead of manually copying form IDs. Features search, caching, and optional archive filtering.",
  "homepage": "https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin",
  "tags": [
    "hubspot",
    "forms",
    "integration",
    "field-editor"
  ]
}
```

## Publishing to Marketplace

### Option 1: Public Plugin (Marketplace)

1. **Prepare your repository**:
   - Ensure it's public on GitHub
   - Add proper README documentation
   - Include LICENSE file
   - Create the required images

2. **Submit to DatoCMS**:
   - Go to [DatoCMS Plugin Submission](https://www.datocms.com/marketplace/plugins/new)
   - Provide your GitHub repository URL
   - Fill in the submission form
   - Wait for approval

### Option 2: Private Plugin (Your Account Only)

1. **Deploy to Vercel** (already done)
2. **In DatoCMS**:
   - Go to Settings → Plugins
   - Click "Add private plugin"
   - Enter your Vercel URL
   - Configure and use

## Marketplace Listing Best Practices

### 1. Clear Description
Write a compelling description that explains:
- What problem it solves
- Key features
- How it works
- Requirements (HubSpot account, API key)

### 2. Documentation
Ensure your README includes:
- Quick start guide
- Configuration steps
- Troubleshooting section
- Screenshots

### 3. Tags
Use relevant tags for discoverability:
- `hubspot`
- `forms`
- `integration`
- `field-editor`
- `marketing`

### 4. Version Management
- Use semantic versioning
- Document changes in a CHANGELOG
- Test thoroughly before releases

## Quick Checklist

Before submitting to marketplace:

- [ ] Create `docs/cover.png` (1200x630px)
- [ ] Create `docs/preview.gif` or `docs/preview.mp4`
- [ ] Update README with clear instructions
- [ ] Add LICENSE file
- [ ] Test plugin thoroughly
- [ ] Ensure repository is public
- [ ] Remove any sensitive data
- [ ] Update version in package.json
- [ ] Build production version
- [ ] Deploy to stable URL

## Design Tools

To create the cover image, you can use:
- **Figma** (free web-based design tool)
- **Canva** (has templates for social media sizes)
- **Adobe Photoshop/Illustrator**
- **Sketch** (Mac only)

For the preview GIF:
- **QuickTime** (Mac) - Screen recording
- **OBS Studio** (Free, cross-platform)
- **ScreenToGif** (Windows)
- **Gifox** (Mac) - Direct to GIF recording
- **CloudConvert** - Convert MP4 to GIF online

## Next Steps

1. Create the cover image (`docs/cover.png`)
2. Record and create the preview (`docs/preview.gif`)
3. Test the plugin one more time
4. Submit to marketplace or keep as private plugin

Remember: The cover image is the first thing users see, so make it professional and informative!