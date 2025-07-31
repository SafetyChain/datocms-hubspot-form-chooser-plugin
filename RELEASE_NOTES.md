# Release Notes

## Version 1.2.0 (July 31, 2024)

### 🎉 New Features
- **Configurable Cache Duration**: Set your preferred cache timeout from 1 hour to 1 week directly in the plugin settings
- **Marketplace Ready**: Added proper 1200x630px cover image for DatoCMS marketplace listing

### 📈 Improvements
- Default cache duration increased from 5 minutes to 24 hours for better performance
- Enhanced documentation with marketplace setup guide
- Added comprehensive changelog

### 🔧 Technical Updates
- API endpoint now supports dynamic cache duration via query parameters
- Updated all documentation to reflect new features

---

## Version 1.1.0 (July 30, 2024)

### 🎉 New Features
- **Archive Filter Toggle**: Choose whether to show or hide archived forms
- **Date Display Toggle**: Option to show/hide form creation dates
- **Visual Branding**: Added SafetyChain and HubSpot logos to settings screen
- **Better Feedback**: Cache refresh button now shows visual confirmation

### 📈 Improvements
- Redesigned settings screen with improved typography
- Replaced non-existent SwitchField with custom checkboxes
- Better organization of configuration options

---

## Version 1.0.0 (July 29, 2024)

### 🚀 Initial Release

**Core Features:**
- Search HubSpot forms by name
- Real-time filtering as you type  
- Automatic sorting by newest first
- 5-minute API response caching
- Secure API key storage

**User Experience:**
- Fixed 480px height to prevent layout issues
- Consistent typography matching DatoCMS design
- Automatic filtering of archived forms
- Shows form creation dates

**Technical:**
- React-based plugin using DatoCMS SDK
- Vercel serverless function for API proxy
- HubSpot Marketing API v3 integration
- Supports up to 2000 forms with pagination