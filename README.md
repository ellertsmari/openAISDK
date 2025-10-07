# openAISDK

A web interface for interacting with OpenAI's latest models: **SORA API** for video generation and **ChatGPT Pro** for advanced language processing with vision support.

## Features

### 🤖 ChatGPT Pro Model
- Advanced language model with enhanced reasoning capabilities
- Vision support for image analysis and understanding
- File upload capability for multimodal interactions
- Chat interface for natural conversations
- Real-time responses with streaming support
- Context-aware conversations

### 🎬 SORA API
- Text-to-video generation using state-of-the-art AI
- Simple prompt-based interface
- Real-time video preview

## Getting Started

### Prerequisites
- An OpenAI API key with access to ChatGPT Pro and SORA models
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

#### Using ChatGPT Pro:
1. Enter your API key and click "Save Key"
2. Type your prompt in the ChatGPT Pro text area
3. (Optional) Attach image files by clicking "📎 Attach Files" button
4. Click "Send to ChatGPT Pro" or press Enter
5. View the response in the chat interface

**Vision Support**: ChatGPT Pro supports image analysis. You can upload images (JPG, PNG, etc.) along with your prompt to ask questions about the images or get visual analysis.

#### Using SORA:
1. Enter your API key and click "Save Key"
2. Describe the video you want to generate
3. Click "Generate Video" or press Enter
4. Wait for the video to be generated (typically 1-5 minutes)
   - The app will automatically check the generation status every 5 seconds
   - You'll see progress updates in the loading indicator
5. Once complete, the video will be displayed with a download link

## API Models

### ChatGPT Pro
- **Model ID**: `chatgpt-4o-latest`
- **Capabilities**: Advanced reasoning, complex problem-solving, enhanced context understanding, vision and image analysis
- **Vision Support**: Can analyze images, understand visual content, read text from images, and provide detailed descriptions
- **Use Cases**: Code generation, analysis, creative writing, research assistance, image analysis, visual Q&A
- **File Support**: Images (JPEG, PNG, GIF, WebP) up to 20MB per image

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
- ChatGPT Pro: `https://api.openai.com/v1/chat/completions`
  - Supports multimodal input (text + images) via base64 encoding
  - Model: `chatgpt-4o-latest`
- SORA Video Generation: `https://api.openai.com/v1/videos` (POST)
- SORA Status Check: `https://api.openai.com/v1/videos/{video_id}` (GET)
- SORA Video Content: `https://api.openai.com/v1/videos/{video_id}/content` (GET)

#### Video Generation Flow
1. Submit video generation request
2. Receive job ID with status "queued"
3. Poll status endpoint every 5 seconds (max 60 attempts)
4. When status becomes "completed", retrieve video content from `/content` endpoint
5. Display video using blob URL

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
- Supports the latest SORA and ChatGPT Pro models with vision capabilities

## Troubleshooting

### "API request failed"
- Verify your API key is correct
- Check that you have access to ChatGPT Pro and SORA models
- Ensure your API key has sufficient credits
- SORA API may require beta enrollment or special access
- For vision features, ensure your API plan supports multimodal inputs

### Video not displaying
- **Video generation is asynchronous**: The app will automatically poll for completion (up to 5 minutes)
- Watch the loading indicator for status updates during generation
- SORA API may require special access or beta enrollment
- Check the [OpenAI Video Generation Documentation](https://platform.openai.com/docs/guides/video-generation) for the latest details
- Verify the response format matches the expected structure
- Ensure your API key has access to video generation features

### CORS errors
- Use a local web server instead of opening the file directly
- Consider implementing a backend proxy for production

## Support
For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/ellertsmari/openAISDK).