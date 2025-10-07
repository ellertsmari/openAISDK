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

// Poll video status until completed
async function pollVideoStatus(videoId, prompt, model) {
    const maxAttempts = 180; // Poll for up to 15 minutes (180 * 5 seconds)
    const pollInterval = 5000; // Poll every 5 seconds
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            showLoading(`Generating video with ${model}...\nChecking status (attempt ${attempt}/${maxAttempts})...`);
            
            const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to check video status');
            }
            
            const data = await response.json();
            
            // Check if video is completed
            if (data.status === 'completed' || data.status === 'succeeded') {
                hideLoading();
                await displayVideo(data, prompt, model);
                showSuccess('videoOutput', 'Video generated successfully!');
                return;
            }
            
            // Check if video generation failed
            if (data.status === 'failed' || data.status === 'error') {
                hideLoading();
                // Handle error message whether it's a string or an object
                const errorMessage = typeof data.error === 'string' 
                    ? data.error 
                    : (data.error?.message || data.error?.error?.message || 'Video generation failed');
                throw new Error(errorMessage);
            }
            
            // If still queued or in_progress, wait before next poll
            if (data.status === 'queued' || data.status === 'in_progress') {
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                continue;
            }
            
            // Unknown status
            hideLoading();
            throw new Error(`Unknown video status: ${data.status}`);
            
        } catch (error) {
            hideLoading();
            throw error;
        }
    }
    
    // Timeout reached
    hideLoading();
    throw new Error('Video generation timed out. Please try again later.');
}

// SORA Video Generation
async function generateVideo() {
    const promptInput = document.getElementById('soraPrompt');
    const prompt = promptInput.value.trim();
    const modelSelect = document.getElementById('soraModel');
    const selectedModel = modelSelect.value;
    
    if (!apiKey) {
        showError('videoOutput', 'Please enter your OpenAI API key first');
        return;
    }
    
    if (!prompt) {
        showError('videoOutput', 'Please enter a video description');
        return;
    }
    
    showLoading(`Generating video with ${selectedModel}...\nThis may take a few moments.`);
    
    try {
        // Call OpenAI SORA API
        // Documentation: https://platform.openai.com/docs/guides/video-generation
        const response = await fetch('https://api.openai.com/v1/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: selectedModel,
                prompt: prompt,
                seconds: "12",           // "4" | "8" | "12"  (default is "4")
                size: "1280x720"        // or "720x1280" (Sora-2 supports these two)
            })
        });
        
        if (!response.ok) {
            hideLoading();
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        
        // Check if video is immediately available (synchronous response)
        if (data.status === 'completed' || data.status === 'succeeded' || data.url) {
            hideLoading();
            await displayVideo(data, prompt, selectedModel);
            showSuccess('videoOutput', 'Video generated successfully!');
        }
        // If video is queued or in progress, poll for completion
        else if (data.status === 'queued' || data.status === 'in_progress') {
            if (!data.id) {
                hideLoading();
                throw new Error('Video ID not provided in response');
            }
            // Poll until video is ready
            await pollVideoStatus(data.id, prompt, selectedModel);
        }
        // Unknown response format
        else {
            hideLoading();
            await displayVideo(data, prompt, selectedModel);
            showSuccess('videoOutput', 'Video request submitted!');
        }
        
    } catch (error) {
        hideLoading();
        console.error('Error generating video:', error);
        
        const videoOutput = document.getElementById('videoOutput');
        videoOutput.innerHTML = `
            <div class="error-message">
                Error: ${error.message}. 
                <br><br>
                Note: SORA API may require special access or beta enrollment. 
                Please check the OpenAI documentation for the latest API details: 
                <a href="https://platform.openai.com/docs/guides/video-generation" target="_blank">Video Generation Guide</a>
            </div>
        `;
    }
}

// Display generated video
async function displayVideo(data, prompt, model = 'sora-2') {
    const videoOutput = document.getElementById('videoOutput');
    videoOutput.classList.add('has-content');
    
    // Handle different possible response formats from the API
    // Check for video URL in various possible locations
    let videoUrl = data.url || data.data?.[0]?.url || data.video_url || data.output?.url;
    
    // For download_url field (some APIs return this)
    if (!videoUrl && data.download_url) {
        videoUrl = data.download_url;
    }
    
    // Check in outputs array
    if (!videoUrl && data.outputs && data.outputs.length > 0) {
        videoUrl = data.outputs[0].url || data.outputs[0].download_url;
    }
    
    // If no URL but video is completed, fetch the video content from the API
    if (!videoUrl && (data.status === 'completed' || data.status === 'succeeded') && data.id) {
        try {
            showLoading('Retrieving completed video...');
            const videoResponse = await fetch(`https://api.openai.com/v1/videos/${data.id}/content`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            hideLoading();
            
            if (!videoResponse.ok) {
                throw new Error('Failed to retrieve video content');
            }
            
            // Get the video as a blob and create an object URL
            const videoBlob = await videoResponse.blob();
            videoUrl = URL.createObjectURL(videoBlob);
        } catch (error) {
            hideLoading();
            console.error('Error retrieving video content:', error);
            videoOutput.innerHTML = `
                <div class="error-message">
                    Error retrieving video content: ${error.message}
                    <br><br>
                    The video generation completed, but the video file could not be retrieved.
                </div>
                <div class="video-info">
                    <p><strong>Prompt:</strong> ${prompt}</p>
                    <p><strong>Model:</strong> ${model}</p>
                    <p><strong>Status:</strong> ${data.status || 'Processing'}</p>
                    ${data.id ? `<p><strong>Video ID:</strong> ${data.id}</p>` : ''}
                    <details style="margin-top: 15px;">
                        <summary style="cursor: pointer; color: #667eea;">Show API Response</summary>
                        <pre style="background: #f8f9fa; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 10px;">${JSON.stringify(data, null, 2)}</pre>
                    </details>
                </div>
            `;
            return;
        }
    }
    
    if (!videoUrl) {
        // If no URL, show data for debugging with helpful message
        videoOutput.innerHTML = `
            <div class="video-info">
                <h3>Video Generation In Progress</h3>
                <p><strong>Prompt:</strong> ${prompt}</p>
                <p><strong>Model:</strong> ${model}</p>
                <p><strong>Status:</strong> ${data.status || 'Processing'}</p>
                ${data.id ? `<p><strong>Video ID:</strong> ${data.id}</p>` : ''}
                <p style="margin-top: 15px;">The video is being generated. This can take several minutes.</p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; color: #667eea;">Show API Response</summary>
                    <pre style="background: #f8f9fa; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 10px;">${JSON.stringify(data, null, 2)}</pre>
                </details>
            </div>
        `;
        return;
    }
    
    // Create video element with better handling
    videoOutput.innerHTML = `
        <video controls autoplay style="max-width: 100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <source src="${videoUrl}" type="video/mp4">
            <source src="${videoUrl}" type="video/webm">
            <source src="${videoUrl}">
            Your browser does not support the video tag.
        </video>
        <div class="video-info">
            <p><strong>Prompt:</strong> ${prompt}</p>
            <p><strong>Model:</strong> ${model}</p>
            ${data.id ? `<p><strong>Video ID:</strong> ${data.id}</p>` : ''}
            ${data.revised_prompt ? `<p><strong>Revised Prompt:</strong> ${data.revised_prompt}</p>` : ''}
            <p style="margin-top: 10px;"><a href="${videoUrl}" target="_blank" download>Download Video</a></p>
        </div>
    `;
    
    // Add error handling for video loading
    const videoElement = videoOutput.querySelector('video');
    if (videoElement) {
        videoElement.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            videoOutput.innerHTML = `
                <div class="error-message">
                    Error loading video. The video URL may be invalid or the video format is not supported.
                    <br><br>
                    <strong>Video URL:</strong> <a href="${videoUrl}" target="_blank">${videoUrl}</a>
                </div>
                <div class="video-info">
                    <p><strong>Prompt:</strong> ${prompt}</p>
                    <p><strong>Model:</strong> ${model}</p>
                    ${data.id ? `<p><strong>Video ID:</strong> ${data.id}</p>` : ''}
                </div>
            `;
        });
        
        videoElement.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });
    }
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
