/**
 * E2B Clone JavaScript SDK
 * Advanced JavaScript SDK for E2B-like code execution and sandbox management
 */

class E2BCloneClient {
  /**
   * Initialize E2B Clone client
   * @param {string} apiKey - Your API key
   * @param {string} baseUrl - Base URL (default: production)
   */
  constructor(apiKey, baseUrl = 'https://e2b-clone-api-390135557694.europe-west1.run.app') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Check API health status
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) throw new Error(`Health check failed: ${response.statusText}`);
    return await response.json();
  }

  /**
   * Create a new sandbox
   * @param {string} name - Sandbox name
   * @param {string} runtime - Runtime type (python, javascript, react, nextjs, go, rust)
   * @param {string} description - Optional description
   * @returns {Promise<Object>} Sandbox details
   */
  async createSandbox(name, runtime = 'python', description = '') {
    const payload = {
      name,
      runtime,
      description
    };

    const response = await fetch(`${this.baseUrl}/api/sandbox/create`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Sandbox creation failed: ${response.statusText}`);
    
    const data = await response.json();
    return data.sandbox;
  }

  /**
   * List all user sandboxes
   * @returns {Promise<Array>} Array of sandboxes
   */
  async listSandboxes() {
    const response = await fetch(`${this.baseUrl}/api/sandbox/list`, {
      headers: this.headers
    });

    if (!response.ok) throw new Error(`Failed to list sandboxes: ${response.statusText}`);
    
    const data = await response.json();
    return data.sandboxes || [];
  }

  /**
   * Execute code in a sandbox
   * @param {string} sandboxId - Target sandbox ID
   * @param {string} code - Code to execute
   * @param {string} language - Programming language
   * @returns {Promise<Object>} Execution result
   */
  async runCode(sandboxId, code, language = 'python') {
    const payload = {
      code,
      language,
      sandboxId
    };

    const response = await fetch(`${this.baseUrl}/api/sandbox/run-code`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Code execution failed: ${response.statusText}`);
    
    return await response.json();
  }

  /**
   * Stream code execution with real-time output
   * @param {string} sandboxId - Target sandbox ID
   * @param {string} code - Code to execute
   * @param {string} language - Programming language
   * @param {Object} callbacks - Event callbacks
   * @returns {Promise<void>}
   */
  async streamCode(sandboxId, code, language = 'python', callbacks = {}) {
    const payload = {
      code,
      language,
      sandboxId,
      stream: true
    };

    const response = await fetch(`${this.baseUrl}/api/sandbox/stream-code`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Streaming execution failed: ${response.statusText}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix
              
              switch (data.type) {
                case 'start':
                  if (callbacks.onStart) callbacks.onStart(data);
                  break;
                case 'output':
                  if (callbacks.onOutput) callbacks.onOutput(data.data);
                  break;
                case 'error':
                  if (callbacks.onError) callbacks.onError(data.error);
                  break;
                case 'end':
                  if (callbacks.onEnd) callbacks.onEnd(data);
                  break;
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Write file to sandbox
   * @param {string} sandboxId - Target sandbox ID
   * @param {string} filename - File name
   * @param {string} content - File content
   * @param {string} path - File path (default: root)
   * @returns {Promise<Object>} File write result
   */
  async writeFile(sandboxId, filename, content, path = '/') {
    const payload = {
      filename,
      content,
      path
    };

    const response = await fetch(`${this.baseUrl}/api/sandbox/${sandboxId}/write-file`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`File write failed: ${response.statusText}`);
    
    return await response.json();
  }

  /**
   * List files in sandbox
   * @param {string} sandboxId - Target sandbox ID
   * @returns {Promise<Array>} Array of files
   */
  async listFiles(sandboxId) {
    const response = await fetch(`${this.baseUrl}/api/sandbox/${sandboxId}/files`, {
      headers: this.headers
    });

    if (!response.ok) throw new Error(`Failed to list files: ${response.statusText}`);
    
    const data = await response.json();
    return data.files || [];
  }

  /**
   * Upload file to sandbox
   * @param {string} sandboxId - Target sandbox ID
   * @param {File} file - File to upload
   * @returns {Promise<Object>} Upload result
   */
  async uploadFile(sandboxId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/sandbox/${sandboxId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData
    });

    if (!response.ok) throw new Error(`File upload failed: ${response.statusText}`);
    
    return await response.json();
  }

  /**
   * Delete sandbox
   * @param {string} sandboxId - Target sandbox ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteSandbox(sandboxId) {
    const response = await fetch(`${this.baseUrl}/api/sandbox/delete`, {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify({ sandboxId })
    });

    if (!response.ok) throw new Error(`Sandbox deletion failed: ${response.statusText}`);
    
    return await response.json();
  }

  /**
   * Get sandbox preview URL
   * @param {string} sandboxId - Target sandbox ID
   * @returns {string} Preview URL
   */
  getSandboxUrl(sandboxId) {
    return `${this.baseUrl}/preview/${sandboxId}`;
  }

  /**
   * Get sandbox live URL
   * @param {string} sandboxId - Target sandbox ID
   * @param {number} port - Sandbox port
   * @returns {string} Live URL
   */
  getLiveUrl(sandboxId, port) {
    return `${this.baseUrl}/sandbox/${sandboxId}`;
  }

  /**
   * Generate API key
   * @param {string} name - Key name
   * @param {Array} permissions - Key permissions
   * @returns {Promise<Object>} Generated key details
   */
  async generateApiKey(name, permissions = ['sandbox:read', 'sandbox:write', 'code:execute']) {
    const payload = {
      name,
      permissions
    };

    const response = await fetch(`${this.baseUrl}/api/keys/generate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API key generation failed: ${response.statusText}`);
    
    return await response.json();
  }

  /**
   * List API keys
   * @returns {Promise<Array>} Array of API keys
   */
  async listApiKeys() {
    const response = await fetch(`${this.baseUrl}/api/keys/list`, {
      headers: this.headers
    });

    if (!response.ok) throw new Error(`Failed to list API keys: ${response.statusText}`);
    
    const data = await response.json();
    return data.keys || [];
  }
}

// Example usage
async function example() {
  // Initialize client
  const client = new E2BCloneClient('your-api-key-here');
  
  try {
    // Check health
    const health = await client.healthCheck();
    console.log('API Health:', health.status);
    
    // Create Python sandbox
    const sandbox = await client.createSandbox('My Python App', 'python');
    console.log('Created sandbox:', sandbox.id);
    
    // Write Python code
    const pythonCode = `
import requests
import json

def main():
    print("Hello from E2B Clone JavaScript SDK!")
    
    # Make API call
    response = requests.get("https://api.github.com/users/octocat")
    data = response.json()
    print(f"GitHub user: {data['login']}")
    
    return "Execution completed successfully!"

if __name__ == "__main__":
    result = main()
    print(result)
`;
    
    // Execute code
    const result = await client.runCode(sandbox.id, pythonCode, 'python');
    console.log('Execution result:', result.output);
    
    // Stream execution
    await client.streamCode(sandbox.id, pythonCode, 'python', {
      onStart: (data) => console.log('Execution started:', data),
      onOutput: (data) => console.log('Output:', data),
      onError: (error) => console.error('Error:', error),
      onEnd: (data) => console.log('Execution completed in', data.executionTime, 'ms')
    });
    
    // Write file
    await client.writeFile(sandbox.id, 'app.py', pythonCode);
    console.log('File written successfully');
    
    // List files
    const files = await client.listFiles(sandbox.id);
    console.log('Files:', files);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = E2BCloneClient;
} else if (typeof window !== 'undefined') {
  window.E2BCloneClient = E2BCloneClient;
}



