# 🎯 BetterE2B SDK

**Drop-in replacement for @e2b/code-interpreter with dynamic subdomain support!**

## 🚀 Features

- ✅ **100% E2B Compatible** - Same API as official E2B
- ✅ **Dynamic Subdomains** - `https://{port}-{id}.yourdomain.com`
- ✅ **Path-based Routing** - `yourdomain.com/{port}-{id}/`
- ✅ **JavaScript/TypeScript SDK** - `bettere2b`
- ✅ **Python SDK** - `bettere2b`
- ✅ **Auto-managed Lifecycle** - Context managers and cleanup
- ✅ **No API Key Required** - Works out of the box

## 📦 Installation

### JavaScript/TypeScript

```bash
npm install bettere2b
```

### Python

```bash
pip install bettere2b
```

## 🎯 Quick Start

### JavaScript/TypeScript

```javascript
import { Sandbox } from 'bettere2b'

const sandbox = await Sandbox.create()
await sandbox.runCode('x = 1')

const execution = await sandbox.runCode('x+=1; x')
console.log(execution.text)  // outputs 2

// Get dynamic subdomain URL
console.log(sandbox.getSubdomainUrl()) // https://8083-uuid.yourdomain.com

await sandbox.kill()
```

### Python

```python
from bettere2b import Sandbox

with Sandbox.create() as sandbox:
    sandbox.run_code("x = 1")
    execution = sandbox.run_code("x+=1; x")
    print(execution.text)  # outputs 2
    
    # Get dynamic subdomain URL
    print(sandbox.get_subdomain_url())  # https://8083-uuid.yourdomain.com
```

## 🔄 Migration from Official E2B

**Replace this:**
```javascript
import { Sandbox } from '@e2b/code-interpreter'
```

**With this:**
```javascript
import { Sandbox } from 'bettere2b'
```

**That's it!** Your existing code will work without any changes.

## 🌐 Dynamic Subdomain Features

### Get Subdomain URL
```javascript
const sandbox = await Sandbox.create()
const subdomainUrl = sandbox.getSubdomainUrl()
// Returns: https://8083-uuid.yourdomain.com
```

### Get Path-based URL
```javascript
const pathUrl = sandbox.getPathUrl()
// Returns: https://yourdomain.com/8083-uuid/
```

### Get Subdomain Configuration
```javascript
const config = await sandbox.getSubdomainConfig()
console.log(config.urls.subdomain)  // Full subdomain URL
console.log(config.urls.path)       // Path-based URL
```

## 📚 API Reference

### Sandbox Methods

| Method | Description | E2B Compatible |
|--------|-------------|----------------|
| `Sandbox.create(options)` | Create new sandbox | ✅ |
| `sandbox.runCode(code, language)` | Execute code | ✅ |
| `sandbox.kill()` | Terminate sandbox | ✅ |
| `sandbox.getHost(port)` | Get host URL | ✅ |
| `sandbox.install(packages, manager)` | Install packages | ✅ |
| `sandbox.writeFile(path, content)` | Write file | ✅ |
| `sandbox.readFile(path)` | Read file | ✅ |
| `sandbox.listFiles(directory)` | List files | ✅ |
| `sandbox.setTimeout(ms)` | Set timeout | ✅ |
| `sandbox.extendTimeout(ms)` | Extend timeout | ✅ |
| `sandbox.getSubdomainUrl()` | Get subdomain URL | 🆕 |
| `sandbox.getPathUrl()` | Get path URL | 🆕 |
| `sandbox.getSubdomainConfig()` | Get subdomain config | 🆕 |

### ExecutionResult

```javascript
const result = await sandbox.runCode('print("Hello")')
console.log(result.text)        // Output text
console.log(result.logs.stdout) // stdout logs
console.log(result.logs.stderr) // stderr logs
console.log(result.error)       // Error message
console.log(result.exitCode)    // Exit code
console.log(result.executionTime) // Execution time
```

## 🔧 Configuration

### Server URL
```javascript
const sandbox = await Sandbox.create({
  serverUrl: 'http://localhost:8083'  // Your E2B clone server
})
```

### API Key (Optional)
```javascript
const sandbox = await Sandbox.create({
  apiKey: 'your-api-key'  // If your server requires authentication
})
```

### Runtime Options
```javascript
const sandbox = await Sandbox.create({
  name: 'My Sandbox',
  runtime: 'react',  // static, react, python, nextjs, etc.
  description: 'My custom sandbox',
  timeout: 60 * 60 * 1000  // 1 hour timeout
})
```

## 🧪 Testing

### JavaScript
```bash
cd server/sdk/javascript
npm test
```

### Python
```bash
cd server/sdk/python
python test.py
```

## 🆚 Comparison with Official E2B

| Feature | Official E2B | BETTER E2B |
|---------|--------------|----------------|
| Sandbox Creation | ✅ | ✅ |
| Code Execution | ✅ | ✅ |
| File Operations | ✅ | ✅ |
| Package Installation | ✅ | ✅ |
| Timeout Management | ✅ | ✅ |
| Dynamic Subdomains | ❌ | ✅ |
| Path-based Routing | ❌ | ✅ |
| Self-hosted | ✅ | ✅ |
| No API Key Required | ❌ | ✅ |
| Free to Use | ❌ | ✅ |

## 🚀 Advanced Features

### Context Manager (Python)
```python
with Sandbox.create() as sandbox:
    result = sandbox.run_code('print("Hello")')
    # Sandbox automatically killed when exiting context
```

### Quick Create Function
```python
from your_e2b_clone import create_sandbox

sandbox = create_sandbox(name='Quick Test')
```

### Multiple Language Support
```javascript
// Python
await sandbox.runCode('print("Hello")', 'python')

// JavaScript
await sandbox.runCode('console.log("Hello")', 'javascript')

// Bash
await sandbox.runCode('echo "Hello"', 'bash')
```

## 🔗 Links

- **Server Repository**: [Your E2B Clone Server](https://github.com/playauraai/bettere2b/)
- **Documentation**: [API Docs](https://a9x11.com/docs)
- **Issues**: [GitHub Issues](https://github.com/playauraai/bettere2b/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

**Made with ❤️ - Your E2B Clone SDK**
