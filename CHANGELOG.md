# Changelog

## [2024-01-07] - ChatGPT Pro Update with Vision Support

### Changed
- **Model Update**: Changed from `gpt-5-pro` (fictional) to `chatgpt-4o-latest` (actual ChatGPT Pro model)
- **Branding Update**: Renamed "GPT5 PRO" to "ChatGPT Pro" throughout the application
- Updated all UI labels, documentation, and test references

### Added
- **File Upload Feature**: Users can now attach image files to prompts
  - New file input UI with attractive styling
  - Support for multiple image uploads
  - File selection status display
  - Base64 encoding for image transmission
  
- **Vision API Integration**: ChatGPT Pro now supports multimodal inputs
  - Images are converted to base64 and sent in proper format
  - Messages support content arrays with `image_url` type
  - Proper error handling for non-image files
  
- **Enhanced Documentation**:
  - Updated README with vision capabilities
  - Added usage instructions for file uploads
  - Documented image file support limits
  
- **Test Coverage**:
  - Added test for multimodal message structure
  - Verified image_url content type handling
  - All 12 tests passing

### Technical Details
- Uses Chat Completions API with base64-encoded images
- Supports JPEG, PNG, GIF, WebP image formats
- File size limit: 20MB per image (API standard)
- Graceful degradation for non-image file types

### Files Modified
- `app.js`: Added file upload handling and vision API integration
- `index.html`: Added file input UI element
- `styles.css`: Added styling for file upload section
- `README.md`: Updated documentation with new features
- `__tests__/api.test.js`: Updated tests and added vision test
