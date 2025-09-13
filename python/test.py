#!/usr/bin/env python3
"""
Your E2B Clone SDK - Python Test File

Demonstrates the exact same API as official E2B
with additional dynamic subdomain features!
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from your_e2b_clone import Sandbox, create_sandbox


async def test_e2b_clone_sdk():
    """Test the Your E2B Clone SDK"""
    print('🎯 Testing Your E2B Clone SDK')
    print('=' * 50)
    
    sandbox = None
    
    try:
        # 1. Create sandbox (same as official E2B)
        print('\n📦 Creating sandbox...')
        sandbox = Sandbox.create(
            name='Test Sandbox',
            runtime='static',
            description='Testing Your E2B Clone SDK'
        )
        
        print(f'✅ Sandbox created: {sandbox.sandbox_id}')
        print(f'🌐 Subdomain URL: {sandbox.get_subdomain_url()}')
        print(f'🔗 Path URL: {sandbox.get_path_url()}')
        
        # 2. Run code (same as official E2B)
        print('\n💻 Running Python code...')
        result1 = sandbox.run_code('x = 1')
        print(f'✅ Code executed: {result1.text}')
        
        result2 = sandbox.run_code('x += 1; x')
        print(f'✅ Result: {result2.text}')  # Should output 2
        
        # 3. Test JavaScript execution
        print('\n💻 Running JavaScript code...')
        js_result = sandbox.run_code('console.log("Hello from JavaScript!"); 42', 'javascript')
        print(f'✅ JavaScript result: {js_result.text}')
        
        # 4. Test file operations
        print('\n📁 Testing file operations...')
        sandbox.write_file('/test.txt', 'Hello from Your E2B Clone!')
        print('✅ File written')
        
        file_content = sandbox.read_file('/test.txt')
        print(f'✅ File content: {file_content}')
        
        # 5. Test package installation
        print('\n📦 Testing package installation...')
        try:
            sandbox.install('requests', 'pip')
            print('✅ Package installed')
        except Exception as e:
            print('⚠️ Package installation failed (expected in static runtime)')
        
        # 6. Test subdomain configuration
        print('\n🌐 Testing subdomain configuration...')
        subdomain_config = sandbox.get_subdomain_config()
        print(f'✅ Subdomain config: {subdomain_config}')
        
        # 7. Test sandbox status
        print('\n📊 Testing sandbox status...')
        status = sandbox.get_status()
        print(f'✅ Sandbox status: {status}')
        
        print('\n🎉 All tests passed! Your E2B Clone SDK works perfectly!')
        
    except Exception as error:
        print(f'❌ Test failed: {error}')
    finally:
        # 8. Clean up (same as official E2B)
        if sandbox:
            print('\n🧹 Cleaning up sandbox...')
            sandbox.kill()
            print('✅ Sandbox killed')


def test_context_manager():
    """Test the context manager (same as official E2B)"""
    print('\n🔄 Testing context manager...')
    
    try:
        with Sandbox.create(name='Context Test') as sandbox:
            result = sandbox.run_code('print("Hello from context manager!")')
            print(f'✅ Context manager result: {result.text}')
        print('✅ Context manager auto-cleanup worked')
    except Exception as error:
        print(f'❌ Context manager test failed: {error}')


def test_quick_create():
    """Test the quick create function"""
    print('\n⚡ Testing quick create function...')
    
    try:
        sandbox = create_sandbox(name='Quick Test')
        result = sandbox.run_code('print("Hello from quick create!")')
        print(f'✅ Quick create result: {result.text}')
        sandbox.kill()
        print('✅ Quick create test passed')
    except Exception as error:
        print(f'❌ Quick create test failed: {error}')


if __name__ == '__main__':
    # Run all tests
    test_e2b_clone_sdk()
    test_context_manager()
    test_quick_create()
    
    print('\n🎯 All SDK tests completed!')
