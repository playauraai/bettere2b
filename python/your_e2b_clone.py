"""
Your E2B Clone SDK - Python

Drop-in replacement for e2b-code-interpreter
with dynamic subdomain support!

Usage:
    from your_e2b_clone import Sandbox
    
    with Sandbox.create() as sandbox:
        sandbox.run_code("x = 1")
        result = sandbox.run_code("x += 1; x")
        print(result.text)  # outputs 2
"""

import requests
import json
import time
from typing import Optional, List, Union, Dict, Any
from dataclasses import dataclass


@dataclass
class ExecutionResult:
    """Result of code execution"""
    text: str
    logs: Dict[str, List[str]]
    error: Optional[str] = None
    exit_code: int = 0
    execution_time: float = 0.0


class Sandbox:
    """
    Your E2B Clone Sandbox - Python SDK
    
    Provides the same interface as the official E2B SDK
    with additional dynamic subdomain features.
    """
    
    def __init__(self, sandbox_id: str, server_url: str, options: Dict[str, Any] = None):
        self.sandbox_id = sandbox_id
        self.server_url = server_url.rstrip('/')
        self.options = options or {}
        self.timeout = self.options.get('timeout', 60 * 60 * 1000)  # 1 hour default
        self.created_at = time.time()
        self._headers = {}
        
        if self.options.get('api_key'):
            self._headers['Authorization'] = f"Bearer {self.options['api_key']}"
    
    @classmethod
    def create(cls, **options) -> 'Sandbox':
        """
        Create a new sandbox
        
        Args:
            name: Sandbox name
            runtime: Runtime type (static, react, python, etc.)
            description: Sandbox description
            timeout: Timeout in milliseconds
            server_url: Server URL (default: http://localhost:8083)
            api_key: API key for authentication
            
        Returns:
            Sandbox: New sandbox instance
        """
        server_url = options.get('server_url', 'http://localhost:8083')
        
        try:
            headers = {'Content-Type': 'application/json'}
            if options.get('api_key'):
                headers['Authorization'] = f"Bearer {options['api_key']}"
            
            payload = {
                'name': options.get('name', 'E2B Clone Sandbox'),
                'runtime': options.get('runtime', 'static'),
                'description': options.get('description', 'Created with Your E2B Clone SDK')
            }
            
            response = requests.post(
                f"{server_url}/api/sandbox/create",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                raise Exception(data.get('error', 'Failed to create sandbox'))
            
            sandbox = cls(data['sandboxId'], server_url, options)
            
            # Store dynamic subdomain info
            sandbox.dynamic_subdomain = data.get('dynamicSubdomain')
            sandbox.urls = data.get('urls', {})
            
            print(f"✅ Sandbox created: {data['sandboxId']}")
            if sandbox.urls.get('subdomain'):
                print(f"🌐 Subdomain: {sandbox.urls['subdomain']}")
            
            return sandbox
            
        except requests.RequestException as e:
            print(f"❌ Failed to create sandbox: {e}")
            raise
        except Exception as e:
            print(f"❌ Failed to create sandbox: {e}")
            raise
    
    def run_code(self, code: str, language: str = 'python') -> ExecutionResult:
        """
        Execute code in the sandbox
        
        Args:
            code: Code to execute
            language: Programming language (python, javascript, bash)
            
        Returns:
            ExecutionResult: Execution result
        """
        try:
            headers = {'Content-Type': 'application/json', **self._headers}
            
            payload = {
                'sandboxId': self.sandbox_id,
                'code': code,
                'language': language
            }
            
            response = requests.post(
                f"{self.server_url}/api/sandbox/run-code",
                headers=headers,
                json=payload,
                timeout=60
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                raise Exception(data.get('error', 'Code execution failed'))
            
            return ExecutionResult(
                text=data['result'].get('text', ''),
                logs=data['result'].get('logs', {'stdout': [], 'stderr': []}),
                error=data['result'].get('error'),
                exit_code=data['result'].get('exitCode', 0),
                execution_time=data['result'].get('executionTime', 0)
            )
            
        except requests.RequestException as e:
            print(f"❌ Code execution failed: {e}")
            raise
        except Exception as e:
            print(f"❌ Code execution failed: {e}")
            raise
    
    def get_host(self, port: Optional[int] = None) -> str:
        """
        Get sandbox host URL (equivalent to E2B's getHost)
        
        Args:
            port: Port number (optional)
            
        Returns:
            str: Host URL
        """
        if self.urls.get('subdomain'):
            return self.urls['subdomain']
        
        if port:
            return f"{self.server_url.replace('http://localhost', f'http://localhost:{port}')}"
        
        return f"{self.server_url}/preview/{self.sandbox_id}"
    
    def get_subdomain_url(self) -> Optional[str]:
        """
        Get dynamic subdomain URL
        
        Returns:
            str: Dynamic subdomain URL or None
        """
        return self.urls.get('subdomain')
    
    def get_path_url(self) -> Optional[str]:
        """
        Get path-based URL
        
        Returns:
            str: Path-based URL or None
        """
        return self.urls.get('path')
    
    def set_timeout(self, timeout_ms: int) -> None:
        """
        Set sandbox timeout
        
        Args:
            timeout_ms: Timeout in milliseconds
        """
        self.timeout = timeout_ms
        print(f"⏰ Sandbox timeout set to {timeout_ms}ms")
    
    def extend_timeout(self, extension_ms: int) -> None:
        """
        Extend sandbox timeout
        
        Args:
            extension_ms: Extension in milliseconds
        """
        self.timeout += extension_ms
        print(f"⏰ Sandbox timeout extended by {extension_ms}ms")
    
    def install(self, packages: Union[str, List[str]], manager: str = 'pip') -> Dict[str, Any]:
        """
        Install packages in the sandbox
        
        Args:
            packages: Package name(s) to install
            manager: Package manager (pip, npm, yarn)
            
        Returns:
            Dict: Installation result
        """
        package_list = packages if isinstance(packages, list) else [packages]
        
        try:
            headers = {'Content-Type': 'application/json', **self._headers}
            
            payload = {
                'packages': package_list,
                'manager': manager
            }
            
            response = requests.post(
                f"{self.server_url}/api/sandbox/{self.sandbox_id}/install-packages",
                headers=headers,
                json=payload,
                timeout=120
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                raise Exception(data.get('error', 'Package installation failed'))
            
            print(f"✅ Packages installed: {', '.join(package_list)}")
            return data
            
        except requests.RequestException as e:
            print(f"❌ Package installation failed: {e}")
            raise
        except Exception as e:
            print(f"❌ Package installation failed: {e}")
            raise
    
    def write_file(self, file_path: str, content: str) -> Dict[str, Any]:
        """
        Write file to sandbox
        
        Args:
            file_path: File path
            content: File content
            
        Returns:
            Dict: Write result
        """
        try:
            headers = {'Content-Type': 'application/json', **self._headers}
            
            payload = {
                'filePath': file_path,
                'content': content
            }
            
            response = requests.post(
                f"{self.server_url}/api/sandbox/{self.sandbox_id}/write-file",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                raise Exception(data.get('error', 'File write failed'))
            
            print(f"✅ File written: {file_path}")
            return data
            
        except requests.RequestException as e:
            print(f"❌ File write failed: {e}")
            raise
        except Exception as e:
            print(f"❌ File write failed: {e}")
            raise
    
    def read_file(self, file_path: str) -> str:
        """
        Read file from sandbox
        
        Args:
            file_path: File path
            
        Returns:
            str: File content
        """
        try:
            response = requests.get(
                f"{self.server_url}/api/sandbox/{self.sandbox_id}/files/{file_path}",
                headers=self._headers,
                timeout=30
            )
            
            response.raise_for_status()
            content = response.text
            
            print(f"✅ File read: {file_path}")
            return content
            
        except requests.RequestException as e:
            print(f"❌ File read failed: {e}")
            raise
        except Exception as e:
            print(f"❌ File read failed: {e}")
            raise
    
    def list_files(self, directory: str = '/') -> List[Dict[str, Any]]:
        """
        List files in sandbox
        
        Args:
            directory: Directory path (optional)
            
        Returns:
            List[Dict]: File list
        """
        try:
            response = requests.get(
                f"{self.server_url}/api/sandbox/{self.sandbox_id}/files",
                params={'directory': directory},
                headers=self._headers,
                timeout=30
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                raise Exception(data.get('error', 'File listing failed'))
            
            print(f"✅ Files listed in: {directory}")
            return data.get('files', [])
            
        except requests.RequestException as e:
            print(f"❌ File listing failed: {e}")
            raise
        except Exception as e:
            print(f"❌ File listing failed: {e}")
            raise
    
    def kill(self) -> Dict[str, Any]:
        """
        Kill/terminate the sandbox
        
        Returns:
            Dict: Kill result
        """
        try:
            response = requests.delete(
                f"{self.server_url}/api/sandbox/delete/{self.sandbox_id}",
                headers=self._headers,
                timeout=30
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                raise Exception(data.get('error', 'Sandbox kill failed'))
            
            print(f"✅ Sandbox killed: {self.sandbox_id}")
            return data
            
        except requests.RequestException as e:
            print(f"❌ Sandbox kill failed: {e}")
            raise
        except Exception as e:
            print(f"❌ Sandbox kill failed: {e}")
            raise
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get sandbox status
        
        Returns:
            Dict: Sandbox status
        """
        try:
            response = requests.get(
                f"{self.server_url}/api/sandbox/{self.sandbox_id}/state",
                headers=self._headers,
                timeout=30
            )
            
            response.raise_for_status()
            return response.json()
            
        except requests.RequestException as e:
            print(f"❌ Status check failed: {e}")
            raise
        except Exception as e:
            print(f"❌ Status check failed: {e}")
            raise
    
    def get_subdomain_config(self) -> Dict[str, Any]:
        """
        Get dynamic subdomain configuration
        
        Returns:
            Dict: Subdomain configuration
        """
        try:
            response = requests.get(
                f"{self.server_url}/api/subdomain/dynamic/{self.sandbox_id}",
                headers=self._headers,
                timeout=30
            )
            
            response.raise_for_status()
            return response.json()
            
        except requests.RequestException as e:
            print(f"❌ Subdomain config failed: {e}")
            raise
        except Exception as e:
            print(f"❌ Subdomain config failed: {e}")
            raise
    
    def __enter__(self):
        """Context manager entry"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit - auto-kill sandbox"""
        try:
            self.kill()
        except Exception as e:
            print(f"⚠️ Failed to auto-kill sandbox: {e}")
    
    def __repr__(self):
        return f"Sandbox(id='{self.sandbox_id}', server='{self.server_url}')"


# Convenience function for quick sandbox creation
def create_sandbox(**options) -> Sandbox:
    """
    Quick sandbox creation function
    
    Args:
        **options: Sandbox options
        
    Returns:
        Sandbox: New sandbox instance
    """
    return Sandbox.create(**options)


# Export main classes
__all__ = ['Sandbox', 'ExecutionResult', 'create_sandbox']
