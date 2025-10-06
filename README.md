# openAISDK

A web interface for interacting with OpenAI's latest models: **SORA 2 API** for video generation and **GPT5 PRO** for advanced language processing.

**⚠️ Important Note:** This repository contains demonstration interfaces for hypothetical/announced but not yet publicly available OpenAI APIs. The SORA 2 video generation API is not currently available through OpenAI's public API. GPT-5 PRO is also not yet available. This project showcases what such integrations might look like when these APIs become available.

## Features

### 🤖 GPT5 PRO Model
- Advanced language model with enhanced reasoning capabilities
- Chat interface for natural conversations
- Real-time responses with streaming support
- Context-aware conversations

### 🎬 SORA 2 API (Demo Interface)
- Text-to-video generation (when API becomes available)
- Customizable video duration (5-20 seconds)
- Multiple quality options (Standard, HD, 4K)
- Real-time video preview
- **Note:** Currently shows informational message as the API is not yet publicly available

## Getting Started

### Prerequisites
- An OpenAI API key with access to GPT5 PRO and SORA 2 models
- A modern web browser
- A local web server (optional, but recommended)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/ellertsmari/openAISDK.git
cd openAISDK
```

2. Open the website:
   - Option 1: Simply open `index.html` in your web browser
   - Option 2: Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. Enter your OpenAI API key in the provided field

### Usage

#### Using GPT5 PRO:
1. Enter your API key and click "Save Key"
2. Type your prompt in the GPT5 PRO text area
3. Click "Send to GPT5 PRO" or press Enter
4. View the response in the chat interface

#### Using SORA 2:
1. Enter your API key and click "Save Key"
2. Describe the video you want to generate
3. Select duration and quality options
4. Click "Generate Video" or press Enter
5. Wait for the video to be generated and displayed

## API Models

### GPT5 PRO
- **Model ID**: `gpt-5-pro`
- **Capabilities**: Advanced reasoning, complex problem-solving, enhanced context understanding
- **Use Cases**: Code generation, analysis, creative writing, research assistance

### SORA 2 (Not Yet Available)
- **Model ID**: `sora-2` (hypothetical)
- **Status**: ⚠️ Not currently available through OpenAI's public API
- **Capabilities**: Text-to-video generation with advanced understanding of physics and motion (when available)
- **Parameters** (expected):
  - `duration`: Video length in seconds (5-20)
  - `quality`: Output resolution (standard/hd/4k)
  - `prompt`: Text description of the video
- **Note**: This is a demonstration interface showing what the integration might look like when the API becomes available

## Technical Details

### File Structure
```
openAISDK/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── app.js          # JavaScript logic and API integration
└── README.md       # Documentation
```

### API Integration
The application demonstrates integration with OpenAI APIs:
- GPT5 PRO: `https://api.openai.com/v1/chat/completions` (hypothetical endpoint)
- SORA 2: `https://api.openai.com/v1/video/generations` (not yet available)

**Note**: These endpoints are not currently active in OpenAI's public API. The application will display informational messages instead of making actual API calls for unavailable features.

### Security Notes
- API keys are stored in sessionStorage (cleared when browser is closed)
- Never commit API keys to version control
- Consider implementing backend proxy for production use

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License - feel free to use this project for your own purposes.

## Acknowledgments
- Built with OpenAI SDK
- Announced at OpenAI Dev Day
- Supports the latest SORA 2 and GPT5 PRO models

## Troubleshooting

### "API request failed"
- Verify your API key is correct
- Check that you have access to GPT5 PRO and SORA 2 models
- Ensure your API key has sufficient credits

### SORA 2 Not Working
- The SORA 2 API is not yet publicly available through OpenAI
- The interface will show an informational message instead of generating videos
- Check [OpenAI's SORA page](https://openai.com/sora) for updates on availability
- Monitor [OpenAI API documentation](https://platform.openai.com/docs) for when the API is released

### CORS errors (for actual API calls)
- Use a local web server instead of opening the file directly
- Consider implementing a backend proxy for production

## Support
For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/ellertsmari/openAISDK).