/**
 * Your E2B Clone SDK - JavaScript/TypeScript
 * 
 * Drop-in replacement for @e2b/code-interpreter
 * with dynamic subdomain support!
 * 
 * Usage:
 * import { Sandbox } from './your-e2b-clone.js'
 * 
 * const sandbox = await Sandbox.create()
 * await sandbox.runCode('x = 1')
 * const result = await sandbox.runCode('x += 1; x')
 * console.log(result.text) // outputs 2
 */

class ExecutionResult {
  constructor(data) {
    this.text = data.text || '';
    this.logs = data.logs || { stdout: [], stderr: [] };
    this.error = data.error || null;
    this.exitCode = data.exitCode || 0;
    this.executionTime = data.executionTime || 0;
  }
}

class Sandbox {
  constructor(sandboxId, serverUrl, options = {}) {
    this.sandboxId = sandboxId;
    this.serverUrl = serverUrl;
    this.options = options;
    this.timeout = options.timeout || 60 * 60 * 1000; // 1 hour default
    this.createdAt = Date.now();
  }

  /**
   * Create a new sandbox
   * @param {Object} options - Sandbox options
   * @param {string} options.name - Sandbox name
   * @param {string} options.runtime - Runtime type (static, react, python, etc.)
   * @param {string} options.description - Sandbox description
   * @param {number} options.timeout - Timeout in milliseconds
   * @returns {Promise<Sandbox>} New sandbox instance
   */
  static async create(options = {}) {
    const serverUrl = options.serverUrl || 'http://localhost:8083';
    
    try {
      const response = await fetch(`${serverUrl}/api/sandbox/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options.apiKey && { 'Authorization': `Bearer ${options.apiKey}` })
        },
        body: JSON.stringify({
          name: options.name || 'E2B Clone Sandbox',
          runtime: options.runtime || 'static',
          description: options.description || 'Created with Your E2B Clone SDK'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create sandbox: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create sandbox');
      }

      const sandbox = new Sandbox(data.sandboxId, serverUrl, options);
      
      // Store dynamic subdomain info
      sandbox.dynamicSubdomain = data.dynamicSubdomain;
      sandbox.urls = data.urls;
      
      console.log(`✅ Sandbox created: ${data.sandboxId}`);
      console.log(`🌐 Subdomain: ${data.urls?.subdomain || 'N/A'}`);
      
      return sandbox;
    } catch (error) {
      console.error('❌ Failed to create sandbox:', error);
      throw error;
    }
  }

  /**
   * Execute code in the sandbox
   * @param {string} code - Code to execute
   * @param {string} language - Programming language (python, javascript, bash)
   * @returns {Promise<ExecutionResult>} Execution result
   */
  async runCode(code, language = 'python') {
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/run-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        },
        body: JSON.stringify({
          sandboxId: this.sandboxId,
          code: code,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to execute code: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Code execution failed');
      }

      return new ExecutionResult(data.result);
    } catch (error) {
      console.error('❌ Code execution failed:', error);
      throw error;
    }
  }

  /**
   * Get sandbox host URL (equivalent to E2B's getHost)
   * @param {number} port - Port number (optional)
   * @returns {string} Host URL
   */
  getHost(port = null) {
    if (this.urls?.subdomain) {
      return this.urls.subdomain;
    }
    
    if (port) {
      return `${this.serverUrl.replace('http://localhost', `http://localhost:${port}`)}`;
    }
    
    return `${this.serverUrl}/preview/${this.sandboxId}`;
  }

  /**
   * Get dynamic subdomain URL
   * @returns {string} Dynamic subdomain URL
   */
  getSubdomainUrl() {
    return this.urls?.subdomain || null;
  }

  /**
   * Get path-based URL
   * @returns {string} Path-based URL
   */
  getPathUrl() {
    return this.urls?.path || null;
  }

  /**
   * Set sandbox timeout
   * @param {number} timeoutMs - Timeout in milliseconds
   */
  setTimeout(timeoutMs) {
    this.timeout = timeoutMs;
    console.log(`⏰ Sandbox timeout set to ${timeoutMs}ms`);
  }

  /**
   * Extend sandbox timeout
   * @param {number} extensionMs - Extension in milliseconds
   */
  async extendTimeout(extensionMs) {
    this.timeout += extensionMs;
    console.log(`⏰ Sandbox timeout extended by ${extensionMs}ms`);
  }

  /**
   * Install packages in the sandbox
   * @param {string|Array} packages - Package name(s) to install
   * @param {string} manager - Package manager (pip, npm, yarn)
   * @returns {Promise<Object>} Installation result
   */
  async install(packages, manager = 'pip') {
    const packageList = Array.isArray(packages) ? packages : [packages];
    
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/${this.sandboxId}/install-packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        },
        body: JSON.stringify({
          packages: packageList,
          manager: manager
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to install packages: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Package installation failed');
      }

      console.log(`✅ Packages installed: ${packageList.join(', ')}`);
      return data;
    } catch (error) {
      console.error('❌ Package installation failed:', error);
      throw error;
    }
  }

  /**
   * Write file to sandbox
   * @param {string} filePath - File path
   * @param {string} content - File content
   * @returns {Promise<Object>} Write result
   */
  async writeFile(filePath, content) {
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/${this.sandboxId}/write-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        },
        body: JSON.stringify({
          filePath: filePath,
          content: content
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to write file: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'File write failed');
      }

      console.log(`✅ File written: ${filePath}`);
      return data;
    } catch (error) {
      console.error('❌ File write failed:', error);
      throw error;
    }
  }

  /**
   * Read file from sandbox
   * @param {string} filePath - File path
   * @returns {Promise<string>} File content
   */
  async readFile(filePath) {
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/${this.sandboxId}/files/${filePath}`, {
        headers: {
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to read file: ${response.statusText}`);
      }

      const content = await response.text();
      console.log(`✅ File read: ${filePath}`);
      return content;
    } catch (error) {
      console.error('❌ File read failed:', error);
      throw error;
    }
  }

  /**
   * List files in sandbox
   * @param {string} directory - Directory path (optional)
   * @returns {Promise<Array>} File list
   */
  async listFiles(directory = '/') {
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/${this.sandboxId}/files?directory=${encodeURIComponent(directory)}`, {
        headers: {
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'File listing failed');
      }

      console.log(`✅ Files listed in: ${directory}`);
      return data.files;
    } catch (error) {
      console.error('❌ File listing failed:', error);
      throw error;
    }
  }

  /**
   * Kill/terminate the sandbox
   * @returns {Promise<Object>} Kill result
   */
  async kill() {
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/delete/${this.sandboxId}`, {
        method: 'DELETE',
        headers: {
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to kill sandbox: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Sandbox kill failed');
      }

      console.log(`✅ Sandbox killed: ${this.sandboxId}`);
      return data;
    } catch (error) {
      console.error('❌ Sandbox kill failed:', error);
      throw error;
    }
  }

  /**
   * Get sandbox status
   * @returns {Promise<Object>} Sandbox status
   */
  async getStatus() {
    try {
      const response = await fetch(`${this.serverUrl}/api/sandbox/${this.sandboxId}/state`, {
        headers: {
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get status: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Status check failed:', error);
      throw error;
    }
  }

  /**
   * Get dynamic subdomain configuration
   * @returns {Promise<Object>} Subdomain configuration
   */
  async getSubdomainConfig() {
    try {
      const response = await fetch(`${this.serverUrl}/api/subdomain/dynamic/${this.sandboxId}`, {
        headers: {
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get subdomain config: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Subdomain config failed:', error);
      throw error;
    }
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Sandbox, ExecutionResult };
} else if (typeof window !== 'undefined') {
  window.YourE2BClone = { Sandbox, ExecutionResult };
}

// ES module export
export { Sandbox, ExecutionResult };
