# Changelog

All notable changes to the DatoCMS HubSpot Form Chooser plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2024-07-31

### Added
- Configurable cache timeout in plugin settings (1-168 hours)
- Cache duration field in configuration screen
- Dynamic cache duration based on user settings

### Changed
- Default cache duration increased from 5 minutes to 24 hours
- Updated API endpoint to support configurable cache

### Documentation
- Added comprehensive marketplace setup guide
- Updated README with configuration options
- Enhanced development documentation

## [1.1.0] - 2024-07-30

### Added
- Configuration switches for archive filtering and date display
- SafetyChain and HubSpot logos in settings screen
- Ability to toggle archived forms visibility
- Option to show/hide form creation dates
- Visual feedback for cache refresh button

### Changed
- Improved settings screen UI with better typography
- Enhanced configuration screen layout

### Fixed
- Cache refresh button now provides proper visual feedback
- Switch components replaced with custom checkboxes

## [1.0.0] - 2024-07-29

### Added
- Initial release of HubSpot Form Chooser plugin
- Search functionality for HubSpot forms
- Real-time form filtering
- Form selection with ID persistence
- Automatic sorting by creation date (newest first)
- 5-minute cache for API responses
- Archive filtering (excludes forms with [archived] in name)
- Configuration screen for HubSpot API key
- Fixed iframe height to prevent layout issues
- Consistent typography matching DatoCMS design

### Technical
- React-based plugin using DatoCMS SDK
- Vercel serverless function for API proxy
- Webpack 5 build configuration
- HubSpot Marketing API v3 integration
- Pagination support (up to 2000 forms)

### Security
- API key stored in plugin parameters
- CORS-compliant API proxy
- No frontend exposure of credentials

## Version History

- `1.2.0` - Configurable cache timeout
- `1.1.0` - Enhanced configuration options
- `1.0.0` - Initial public release

[Unreleased]: https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SafetyChain/datocms-hubspot-form-chooser-plugin/releases/tag/v1.0.0