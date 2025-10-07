# openAISDK

A web interface for interacting with OpenAI's latest models: **SORA API** for video generation and **GPT5 PRO** for advanced language processing.

## Features

### 🤖 GPT5 PRO Model
- Advanced language model with enhanced reasoning capabilities
- Chat interface for natural conversations
- Real-time responses with streaming support
- Context-aware conversations

### 🎬 SORA API
- Text-to-video generation using state-of-the-art AI
- Simple prompt-based interface
- Real-time video preview

## Getting Started

### Prerequisites
- An OpenAI API key with access to GPT5 PRO and SORA models
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

#### Using SORA:
1. Enter your API key and click "Save Key"
2. Describe the video you want to generate
3. Click "Generate Video" or press Enter
4. Wait for the video to be generated and displayed

## API Models

### GPT5 PRO
- **Model ID**: `gpt-5-pro`
- **Capabilities**: Advanced reasoning, complex problem-solving, enhanced context understanding
- **Use Cases**: Code generation, analysis, creative writing, research assistance

### SORA
- **Model ID**: `sora-turbo-2024-12-01`
- **Capabilities**: Text-to-video generation with advanced understanding of physics and motion
- **Parameters**:
  - `model`: The model identifier (required)
  - `prompt`: Text description of the video (required)
- **Documentation**: [Video Generation Guide](https://platform.openai.com/docs/guides/video-generation)

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
The application uses the OpenAI SDK through direct REST API calls:
- GPT5 PRO: `https://api.openai.com/v1/chat/completions`
- SORA: `https://api.openai.com/v1/video/generations`

For more details, see the [OpenAI Video Generation Documentation](https://platform.openai.com/docs/guides/video-generation).

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
- Supports the latest SORA and GPT5 PRO models

## Troubleshooting

### "API request failed"
- Verify your API key is correct
- Check that you have access to GPT5 PRO and SORA models
- Ensure your API key has sufficient credits
- SORA API may require beta enrollment or special access

### Video not displaying
- SORA API may require special access or beta enrollment
- Check the [OpenAI Video Generation Documentation](https://platform.openai.com/docs/guides/video-generation) for the latest details
- Verify the response format matches the expected structure
- Ensure your API key has access to video generation features

### CORS errors
- Use a local web server instead of opening the file directly
- Consider implementing a backend proxy for production

## Support
For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/ellertsmari/openAISDK).