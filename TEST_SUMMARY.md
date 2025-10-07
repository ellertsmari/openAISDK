# Test Summary for OpenAI SDK

## Issue
The SORA API call in `app.js` was failing with the error:
```
Error: Invalid method for URL (POST /v1/videos/generations)
HTTP Status: 405 Method Not Allowed
```

## Root Cause
The code was using the wrong API endpoint. The OpenAI Sora API uses `/v1/videos` not `/v1/videos/generations`.

**Evidence:**
- `/v1/videos/generations` returns: "Invalid method for URL (POST /v1/videos/generations)" with HTTP 405
- `/v1/videos` accepts POST and returns proper API authentication error (proving the endpoint is correct)

## Fix Applied
Changed the API endpoint URL in the `generateVideo()` function at line 168 in `app.js`:

```javascript
// BEFORE (WRONG):
const response = await fetch('https://api.openai.com/v1/videos/generations', {

// AFTER (CORRECT):
const response = await fetch('https://api.openai.com/v1/videos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: 'sora-turbo-2024-12-01',
        prompt: prompt
    })
});
```

## Test Infrastructure
Created a comprehensive test suite using Jest to verify both API calls:

### Test Files
- `__tests__/api.test.js` - Tests for GPT5 PRO and SORA API calls

### Test Coverage
1. **GPT5 PRO API Call** - Verifies correct POST request with all required parameters
2. **SORA API Call** - Verifies correct POST request with all required parameters
3. **Bug Demonstration** - Shows what happens when method is not specified
4. **Error Handling** - Verifies proper error handling for API failures

## Running Tests
```bash
npm test
```

## Test Results
All 4 tests pass successfully:
- ✓ GPT5 PRO API Call - should make POST request with correct parameters
- ✓ SORA API Call - should make POST request with correct parameters  
- ✓ SORA API Call - should fail when method is not specified (demonstrating the bug)
- ✓ API Error Handling - should handle API errors correctly

## Files Modified
1. `app.js` - Fixed incorrect API endpoint from `/v1/videos/generations` to `/v1/videos`
2. `__tests__/api.test.js` - Updated tests to use correct endpoint
3. `README.md` - Updated documentation with correct endpoint

## Verification
The fix ensures that:
- The SORA API call uses the correct endpoint `/v1/videos`
- The endpoint accepts POST requests (verified by receiving API key error instead of method error)
- All tests pass with the updated endpoint
- Documentation matches the implementation
