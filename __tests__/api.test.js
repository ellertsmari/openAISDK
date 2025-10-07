// Mock fetch before requiring it
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('OpenAI API Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockFetch.mockClear();
  });

  describe('GPT5 PRO API Call', () => {
    test('should make POST request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Test response from GPT5 PRO'
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
      expect(data.choices[0].message.content).toBe('Test response from GPT5 PRO');
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
      // NOTE: This test will FAIL because the code is missing method: 'POST'
      const response = await fetch('https://api.openai.com/v1/videos/generations', {
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
        'https://api.openai.com/v1/videos/generations',
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
});
