"""
E2B Clone Python SDK
Advanced Python SDK for E2B-like code execution and sandbox management
"""

import requests
import json
import time
import uuid
from typing import Dict, List, Optional, Union, Callable
from dataclasses import dataclass
from enum import Enum

class Runtime(Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    REACT = "react"
    NEXTJS = "nextjs"
    GO = "go"
    RUST = "rust"

@dataclass
class Sandbox:
    id: str
    name: str
    description: str
    runtime: str
    status: str
    port: Optional[int]
    preview_url: Optional[str]
    live_url: Optional[str]
    vite_url: Optional[str]
    created_at: str
    last_used: Optional[str]

@dataclass
class ExecutionResult:
    success: bool
    output: str
    language: str
    execution_time: int
    execution_details: Dict
    sandbox: Dict
    error: Optional[str] = None

class E2BCloneClient:
    """
    E2B Clone Python SDK - Advanced code execution and sandbox management
    """
    
    def __init__(self, api_key: str, base_url: str = "https://e2b-clone-api-390135557694.europe-west1.run.app"):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def health_check(self) -> Dict:
        """Check API health status"""
        response = self.session.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()
    
    def create_sandbox(self, 
                      name: str, 
                      runtime: Runtime = Runtime.PYTHON,
                      description: str = "") -> Sandbox:
        """
        Create a new sandbox with specified runtime
        
        Args:
            name: Sandbox name
            runtime: Runtime type (python, javascript, react, etc.)
            description: Optional description
            
        Returns:
            Sandbox object with details
        """
        payload = {
            "name": name,
            "runtime": runtime.value,
            "description": description
        }
        
        response = self.session.post(f"{self.base_url}/api/sandbox/create", json=payload)
        response.raise_for_status()
        
        data = response.json()
        sandbox_data = data['sandbox']
        
        return Sandbox(
            id=sandbox_data['id'],
            name=sandbox_data['name'],
            description=sandbox_data.get('description', ''),
            runtime=sandbox_data['runtime'],
            status=sandbox_data['status'],
            port=sandbox_data.get('port'),
            preview_url=sandbox_data.get('previewUrl'),
            live_url=sandbox_data.get('liveUrl'),
            vite_url=sandbox_data.get('viteUrl'),
            created_at=sandbox_data.get('created_at', ''),
            last_used=sandbox_data.get('last_used')
        )
    
    def list_sandboxes(self) -> List[Sandbox]:
        """List all user sandboxes"""
        response = self.session.get(f"{self.base_url}/api/sandbox/list")
        response.raise_for_status()
        
        data = response.json()
        sandboxes = []
        
        for sandbox_data in data.get('sandboxes', []):
            sandboxes.append(Sandbox(
                id=sandbox_data['id'],
                name=sandbox_data['name'],
                description=sandbox_data.get('description', ''),
                runtime=sandbox_data['runtime'],
                status=sandbox_data['status'],
                port=sandbox_data.get('port'),
                preview_url=sandbox_data.get('preview_url'),
                live_url=sandbox_data.get('live_url'),
                vite_url=sandbox_data.get('vite_url'),
                created_at=sandbox_data.get('created_at', ''),
                last_used=sandbox_data.get('last_used')
            ))
        
        return sandboxes
    
    def run_code(self, 
                 sandbox_id: str, 
                 code: str, 
                 language: str = "python") -> ExecutionResult:
        """
        Execute code in a sandbox
        
        Args:
            sandbox_id: Target sandbox ID
            code: Code to execute
            language: Programming language
            
        Returns:
            ExecutionResult with output and details
        """
        payload = {
            "code": code,
            "language": language,
            "sandboxId": sandbox_id
        }
        
        response = self.session.post(f"{self.base_url}/api/sandbox/run-code", json=payload)
        response.raise_for_status()
        
        data = response.json()
        
        return ExecutionResult(
            success=data['success'],
            output=data['output'],
            language=data['language'],
            execution_time=data.get('executionTime', 0),
            execution_details=data.get('executionDetails', {}),
            sandbox=data.get('sandbox', {}),
            error=data.get('error')
        )
    
    def stream_code(self, 
                   sandbox_id: str, 
                   code: str, 
                   language: str = "python",
                   on_output: Optional[Callable[[str], None]] = None,
                   on_error: Optional[Callable[[str], None]] = None,
                   on_end: Optional[Callable[[Dict], None]] = None) -> None:
        """
        Stream code execution with real-time output
        
        Args:
            sandbox_id: Target sandbox ID
            code: Code to execute
            language: Programming language
            on_output: Callback for output data
            on_error: Callback for errors
            on_end: Callback for execution end
        """
        payload = {
            "code": code,
            "language": language,
            "sandboxId": sandbox_id,
            "stream": True
        }
        
        response = self.session.post(
            f"{self.base_url}/api/sandbox/stream-code", 
            json=payload,
            stream=True
        )
        response.raise_for_status()
        
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    try:
                        data = json.loads(line_str[6:])  # Remove 'data: ' prefix
                        
                        if data['type'] == 'output' and on_output:
                            on_output(data['data'])
                        elif data['type'] == 'error' and on_error:
                            on_error(data['error'])
                        elif data['type'] == 'end' and on_end:
                            on_end(data)
                    except json.JSONDecodeError:
                        continue
    
    def write_file(self, 
                  sandbox_id: str, 
                  filename: str, 
                  content: str, 
                  path: str = "/") -> Dict:
        """
        Write file to sandbox
        
        Args:
            sandbox_id: Target sandbox ID
            filename: File name
            content: File content
            path: File path (default: root)
            
        Returns:
            File write result
        """
        payload = {
            "filename": filename,
            "content": content,
            "path": path
        }
        
        response = self.session.post(
            f"{self.base_url}/api/sandbox/{sandbox_id}/write-file", 
            json=payload
        )
        response.raise_for_status()
        
        return response.json()
    
    def list_files(self, sandbox_id: str) -> List[Dict]:
        """List files in sandbox"""
        response = self.session.get(f"{self.base_url}/api/sandbox/{sandbox_id}/files")
        response.raise_for_status()
        
        data = response.json()
        return data.get('files', [])
    
    def upload_file(self, sandbox_id: str, file_path: str) -> Dict:
        """Upload file to sandbox"""
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = self.session.post(
                f"{self.base_url}/api/sandbox/{sandbox_id}/upload",
                files=files
            )
        
        response.raise_for_status()
        return response.json()
    
    def delete_sandbox(self, sandbox_id: str) -> Dict:
        """Delete sandbox"""
        response = self.session.delete(f"{self.base_url}/api/sandbox/delete", 
                                     json={"sandboxId": sandbox_id})
        response.raise_for_status()
        return response.json()
    
    def get_sandbox_url(self, sandbox_id: str) -> str:
        """Get sandbox preview URL"""
        return f"{self.base_url}/preview/{sandbox_id}"
    
    def get_live_url(self, sandbox_id: str, port: int) -> str:
        """Get sandbox live URL"""
        return f"{self.base_url}/sandbox/{sandbox_id}"

# Example usage
if __name__ == "__main__":
    # Initialize client
    client = E2BCloneClient("your-api-key-here")
    
    # Check health
    health = client.health_check()
    print(f"API Health: {health['status']}")
    
    # Create Python sandbox
    sandbox = client.create_sandbox("My Python App", Runtime.PYTHON)
    print(f"Created sandbox: {sandbox.id}")
    
    # Write Python code
    python_code = """
import requests
import json

def main():
    print("Hello from E2B Clone Python SDK!")
    
    # Make API call
    response = requests.get("https://api.github.com/users/octocat")
    data = response.json()
    print(f"GitHub user: {data['login']}")
    
    return "Execution completed successfully!"

if __name__ == "__main__":
    result = main()
    print(result)
"""
    
    # Execute code
    result = client.run_code(sandbox.id, python_code, "python")
    print(f"Execution result: {result.output}")
    
    # Stream execution
    def on_output(data):
        print(f"Output: {data}")
    
    def on_error(error):
        print(f"Error: {error}")
    
    def on_end(data):
        print(f"Execution completed in {data.get('executionTime', 0)}ms")
    
    client.stream_code(sandbox.id, python_code, "python", 
                      on_output=on_output, on_error=on_error, on_end=on_end)



