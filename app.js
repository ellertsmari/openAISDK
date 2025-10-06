// Store API key in memory (in production, consider more secure storage)
let apiKey = '';

// Save API key
function saveApiKey() {
    const keyInput = document.getElementById('apiKey');
    const keyStatus = document.getElementById('keyStatus');
    
    apiKey = keyInput.value.trim();
    
    if (apiKey) {
        keyStatus.textContent = '✓ API Key saved';
        keyStatus.className = 'success';
        
        // Store in sessionStorage for convenience
        sessionStorage.setItem('openai_api_key', apiKey);
    } else {
        keyStatus.textContent = '✗ Please enter a valid API key';
        keyStatus.className = 'error';
    }
}

// Load API key on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedKey = sessionStorage.getItem('openai_api_key');
    if (savedKey) {
        apiKey = savedKey;
        document.getElementById('keyStatus').textContent = '✓ API Key loaded';
        document.getElementById('keyStatus').className = 'success';
    }
});

// Show/hide loading overlay
function showLoading(text = 'Processing...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Add message to chat
function addMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    messageDiv.innerHTML = `
        <div class="message-role">${role}</div>
        <div class="message-content">${content}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show error message
function showError(container, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const targetContainer = document.getElementById(container);
    targetContainer.insertBefore(errorDiv, targetContainer.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(container, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const targetContainer = document.getElementById(container);
    targetContainer.insertBefore(successDiv, targetContainer.firstChild);
    
    setTimeout(() => successDiv.remove(), 5000);
}

// GPT5 PRO Integration
async function sendToGPT5Pro() {
    const promptInput = document.getElementById('gptPrompt');
    const prompt = promptInput.value.trim();
    
    if (!apiKey) {
        showError('chatMessages', 'Please enter your OpenAI API key first');
        return;
    }
    
    if (!prompt) {
        showError('chatMessages', 'Please enter a prompt');
        return;
    }
    
    // Add user message to chat
    addMessage('user', prompt);
    promptInput.value = '';
    
    showLoading('GPT5 PRO is thinking...');
    
    try {
        // Call OpenAI API with GPT5 PRO model
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-5-pro', // GPT5 PRO model
                messages: [
                    {
                        role: 'system',
                        content: 'You are GPT5 PRO, an advanced AI assistant with enhanced reasoning capabilities.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        
        hideLoading();
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        
        // Add assistant message to chat
        addMessage('assistant', assistantMessage);
        
    } catch (error) {
        hideLoading();
        console.error('Error calling GPT5 PRO:', error);
        addMessage('assistant', `Error: ${error.message}. Please check your API key and try again.`);
    }
}

// SORA 2 Video Generation
async function generateVideo() {
    const promptInput = document.getElementById('soraPrompt');
    const prompt = promptInput.value.trim();
    const duration = document.getElementById('soraDuration').value;
    const quality = document.getElementById('soraQuality').value;
    
    if (!apiKey) {
        showError('videoOutput', 'Please enter your OpenAI API key first');
        return;
    }
    
    if (!prompt) {
        showError('videoOutput', 'Please enter a video description');
        return;
    }
    
    showLoading(`Generating video with SORA 2 API...\nThis may take a few moments.`);
    
    try {
        // Call OpenAI SORA 2 API
        const response = await fetch('https://api.openai.com/v1/video/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'sora-2', // SORA 2 model
                prompt: prompt,
                duration: parseInt(duration),
                quality: quality,
                size: quality === '4k' ? '3840x2160' : quality === 'hd' ? '1920x1080' : '1280x720'
            })
        });
        
        hideLoading();
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        
        // Display the generated video
        displayVideo(data, prompt, duration, quality);
        
        showSuccess('videoOutput', 'Video generated successfully!');
        
    } catch (error) {
        hideLoading();
        console.error('Error generating video:', error);
        
        const videoOutput = document.getElementById('videoOutput');
        videoOutput.innerHTML = `
            <div class="error-message">
                Error: ${error.message}. 
                <br><br>
                Note: SORA 2 API may require special access or the endpoint might be different. 
                Please check the OpenAI documentation for the latest API details.
            </div>
        `;
    }
}

// Display generated video
function displayVideo(data, prompt, duration, quality) {
    const videoOutput = document.getElementById('videoOutput');
    videoOutput.classList.add('has-content');
    
    // Handle different possible response formats
    let videoUrl = data.url || data.data?.[0]?.url || data.video_url;
    
    if (!videoUrl) {
        // If no URL, show data for debugging
        videoOutput.innerHTML = `
            <div class="video-info">
                <h3>Response Received</h3>
                <p><strong>Prompt:</strong> ${prompt}</p>
                <p><strong>Duration:</strong> ${duration}s</p>
                <p><strong>Quality:</strong> ${quality}</p>
                <p><strong>Status:</strong> Video generation initiated</p>
                <pre style="background: #f8f9fa; padding: 15px; border-radius: 8px; overflow: auto;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        return;
    }
    
    videoOutput.innerHTML = `
        <video controls autoplay>
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="video-info">
            <p><strong>Prompt:</strong> ${prompt}</p>
            <p><strong>Duration:</strong> ${duration} seconds</p>
            <p><strong>Quality:</strong> ${quality.toUpperCase()}</p>
            <p><strong>Model:</strong> SORA 2</p>
            ${data.id ? `<p><strong>Video ID:</strong> ${data.id}</p>` : ''}
        </div>
    `;
}

// Allow Enter key to send in GPT5 PRO textarea (Shift+Enter for new line)
document.getElementById('gptPrompt').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendToGPT5Pro();
    }
});

// Allow Enter key to generate in SORA textarea (Shift+Enter for new line)
document.getElementById('soraPrompt').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateVideo();
    }
});
