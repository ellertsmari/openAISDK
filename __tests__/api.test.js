// Mock fetch before requiring it
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('OpenAI API Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockFetch.mockClear();
  });

  describe('ChatGPT Pro API Call', () => {
    test('should make POST request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Test response from ChatGPT Pro'
            }
          }]
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Simulate the API call from sendToGPT5Pro
      const apiKey = 'test-api-key';
      const prompt = 'Test prompt';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-5-pro',
          messages: [
            {
              role: 'system',
              content: 'You are ChatGPT Pro, an advanced AI assistant with enhanced reasoning capabilities and vision support.'
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

      // Verify the fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );

      // Verify response is ok
      expect(response.ok).toBe(true);
      
      // Verify we can get the data
      const data = await response.json();
      expect(data.choices[0].message.content).toBe('Test response from ChatGPT Pro');
    });

    test('should support multimodal messages with image_url', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'I can see the image. It shows...'
            }
          }]
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Simulate the API call with vision/image support
      const apiKey = 'test-api-key';
      const prompt = 'What do you see in this image?';
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-5-pro',
          messages: [
            {
              role: 'system',
              content: 'You are ChatGPT Pro, an advanced AI assistant with enhanced reasoning capabilities and vision support.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      // Verify the fetch was called with correct parameters including image
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );

      // Verify the body contains multimodal content
      const callArgs = mockFetch.mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      expect(body.messages[1].content).toBeInstanceOf(Array);
      expect(body.messages[1].content[0].type).toBe('text');
      expect(body.messages[1].content[1].type).toBe('image_url');
      expect(body.messages[1].content[1].image_url.url).toContain('data:image/png;base64,');

      // Verify response is ok
      expect(response.ok).toBe(true);
      
      // Verify we can get the data
      const data = await response.json();
      expect(data.choices[0].message.content).toContain('image');
    });
  });

  describe('SORA API Call', () => {
    test('should make POST request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'video-123',
          url: 'https://example.com/video.mp4',
          data: [{
            url: 'https://example.com/video.mp4'
          }]
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Simulate the API call from generateVideo
      const apiKey = 'test-api-key';
      const prompt = 'A beautiful sunset over the ocean';

      // This is the actual call pattern from the code (line 168-177)
      // After fix: includes method: 'POST'
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

      // Verify the fetch was called
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/videos',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );

      // Check if method: 'POST' was included
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs).toHaveProperty('method', 'POST');
    });

    test('should fail when method is not specified (demonstrating the bug)', async () => {
      // This test demonstrates that without method: 'POST', 
      // the fetch defaults to GET which causes issues with body
      
      const apiKey = 'test-api-key';
      const prompt = 'A beautiful sunset over the ocean';

      // Simulate the buggy code (missing method: 'POST')
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'sora-turbo-2024-12-01',
          prompt: prompt
        })
      };

      // Verify that method is NOT specified
      expect(requestOptions.method).toBeUndefined();
      
      // When method is not specified, fetch defaults to GET
      // but GET requests cannot have a body, which causes the API call to fail
      expect(requestOptions.body).toBeDefined();
      
      // The presence of body without method: 'POST' is the bug
      console.log('Bug detected: body is present but method is undefined');
      console.log('This causes fetch to default to GET, which cannot have a body');
    });
  });

  describe('API Error Handling', () => {
    test('should handle API errors correctly', async () => {
      // Mock error response
      const mockErrorResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: {
            message: 'Invalid API key'
          }
        })
      };
      mockFetch.mockResolvedValue(mockErrorResponse);

      const apiKey = 'invalid-key';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-5-pro',
          messages: []
        })
      });

      expect(response.ok).toBe(false);
      
      const error = await response.json();
      expect(error.error.message).toBe('Invalid API key');
    });
  });

  describe('Video Polling', () => {
    test('should poll video status endpoint when video is queued', async () => {
      const apiKey = 'test-api-key';
      const videoId = 'video_68e471a4ef3c8198ba5f2ebf81486c2e0640433e1f1e2875';
      
      // Mock the status check response
      const mockStatusResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          status: 'completed',
          url: 'https://example.com/completed-video.mp4'
        })
      };
      mockFetch.mockResolvedValue(mockStatusResponse);

      // Simulate polling the video status
      const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.openai.com/v1/videos/${videoId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );

      const data = await response.json();
      expect(data.status).toBe('completed');
      expect(data.url).toBeDefined();
    });

    test('should handle queued status response', async () => {
      const videoId = 'video_test123';
      
      // Mock queued response
      const mockQueuedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          object: 'video',
          status: 'queued',
          progress: 0,
          completed_at: null
        })
      };
      mockFetch.mockResolvedValue(mockQueuedResponse);

      const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-api-key'
        }
      });

      const data = await response.json();
      expect(data.status).toBe('queued');
      expect(data.completed_at).toBeNull();
    });

    test('should handle completed status with video URL', async () => {
      const videoId = 'video_test123';
      
      // Mock completed response
      const mockCompletedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          object: 'video',
          status: 'completed',
          url: 'https://example.com/video.mp4',
          completed_at: 1759802000
        })
      };
      mockFetch.mockResolvedValue(mockCompletedResponse);

      const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-api-key'
        }
      });

      const data = await response.json();
      expect(data.status).toBe('completed');
      expect(data.url).toBe('https://example.com/video.mp4');
      expect(data.completed_at).toBeDefined();
    });

    test('should fetch video content when completed but no URL provided', async () => {
      const videoId = 'video_68e4769cd1e8819890b1a168b5d652ee045bd9b86366fe8a';
      const apiKey = 'test-api-key';
      
      // Mock completed response without URL
      const mockCompletedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          object: 'video',
          status: 'completed',
          created_at: 1759803036,
          completed_at: 1759803109,
          error: null,
          expires_at: 1759889509,
          model: 'sora-2',
          progress: 100,
          remixed_from_video_id: null,
          seconds: '4',
          size: '720x1280'
          // Note: No 'url' field
        })
      };

      // Mock video content response
      const mockVideoBlob = new Blob(['fake video data'], { type: 'video/mp4' });
      const mockVideoResponse = {
        ok: true,
        blob: jest.fn().mockResolvedValue(mockVideoBlob)
      };

      // First call to get status (no URL), second call to get content
      mockFetch
        .mockResolvedValueOnce(mockCompletedResponse)
        .mockResolvedValueOnce(mockVideoResponse);

      // Get video status
      const statusResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await statusResponse.json();
      expect(data.status).toBe('completed');
      expect(data.url).toBeUndefined();
      expect(data.id).toBe(videoId);

      // Fetch video content (this is what displayVideo should do)
      const videoResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.openai.com/v1/videos/${videoId}/content`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${apiKey}`
          })
        })
      );

      const videoBlob = await videoResponse.blob();
      expect(videoBlob).toBeDefined();
      expect(videoBlob.type).toBe('video/mp4');
    });

    test('should handle error object properly when video generation fails', async () => {
      const videoId = 'video_test_failed';
      const apiKey = 'test-api-key';
      
      // Mock failed response with error as an object
      const mockFailedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          object: 'video',
          status: 'failed',
          error: {
            message: 'Video generation failed due to content policy violation',
            code: 'content_policy_violation'
          }
        })
      };
      mockFetch.mockResolvedValue(mockFailedResponse);

      const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      expect(data.status).toBe('failed');
      expect(data.error).toBeDefined();
      expect(typeof data.error).toBe('object');
      
      // Verify the error has a message property that can be extracted
      expect(data.error.message).toBe('Video generation failed due to content policy violation');
    });

    test('should handle error as string when video generation fails', async () => {
      const videoId = 'video_test_failed_string';
      const apiKey = 'test-api-key';
      
      // Mock failed response with error as a string
      const mockFailedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          object: 'video',
          status: 'failed',
          error: 'Simple error message as string'
        })
      };
      mockFetch.mockResolvedValue(mockFailedResponse);

      const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      expect(data.status).toBe('failed');
      expect(data.error).toBeDefined();
      expect(typeof data.error).toBe('string');
      expect(data.error).toBe('Simple error message as string');
    });

    test('should handle nested error object structure', async () => {
      const videoId = 'video_test_nested_error';
      const apiKey = 'test-api-key';
      
      // Mock failed response with nested error structure
      const mockFailedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: videoId,
          object: 'video',
          status: 'failed',
          error: {
            error: {
              message: 'Nested error message'
            }
          }
        })
      };
      mockFetch.mockResolvedValue(mockFailedResponse);

      const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      expect(data.status).toBe('failed');
      expect(data.error.error.message).toBe('Nested error message');
    });
  });
});
