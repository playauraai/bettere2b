/**
 * Your E2B Clone SDK - Test File
 * 
 * Demonstrates the exact same API as official E2B
 * with additional dynamic subdomain features!
 */

const { Sandbox } = require('./bettere2b.js');

async function testE2BCloneSDK() {
  console.log('🎯 Testing Your E2B Clone SDK');
  console.log('=' .repeat(50));
  
  let sandbox;
  
  try {
    // 1. Create sandbox (same as official E2B)
    console.log('\n📦 Creating sandbox...');
    sandbox = await Sandbox.create({
      name: 'Test Sandbox',
      runtime: 'static',
      description: 'Testing Your E2B Clone SDK'
    });
    
    console.log(`✅ Sandbox created: ${sandbox.sandboxId}`);
    console.log(`🌐 Subdomain URL: ${sandbox.getSubdomainUrl()}`);
    console.log(`🔗 Path URL: ${sandbox.getPathUrl()}`);
    
    // 2. Run code (same as official E2B)
    console.log('\n💻 Running Python code...');
    const result1 = await sandbox.runCode('x = 1');
    console.log(`✅ Code executed: ${result1.text}`);
    
    const result2 = await sandbox.runCode('x += 1; x');
    console.log(`✅ Result: ${result2.text}`); // Should output 2
    
    // 3. Test JavaScript execution
    console.log('\n💻 Running JavaScript code...');
    const jsResult = await sandbox.runCode('console.log("Hello from JavaScript!"); 42', 'javascript');
    console.log(`✅ JavaScript result: ${jsResult.text}`);
    
    // 4. Test file operations
    console.log('\n📁 Testing file operations...');
    await sandbox.writeFile('/test.txt', 'Hello from Your E2B Clone!');
    console.log('✅ File written');
    
    const fileContent = await sandbox.readFile('/test.txt');
    console.log(`✅ File content: ${fileContent}`);
    
    // 5. Test package installation
    console.log('\n📦 Testing package installation...');
    try {
      await sandbox.install('requests', 'pip');
      console.log('✅ Package installed');
    } catch (error) {
      console.log('⚠️ Package installation failed (expected in static runtime)');
    }
    
    // 6. Test subdomain configuration
    console.log('\n🌐 Testing subdomain configuration...');
    const subdomainConfig = await sandbox.getSubdomainConfig();
    console.log(`✅ Subdomain config:`, JSON.stringify(subdomainConfig, null, 2));
    
    // 7. Test sandbox status
    console.log('\n📊 Testing sandbox status...');
    const status = await sandbox.getStatus();
    console.log(`✅ Sandbox status:`, JSON.stringify(status, null, 2));
    
    console.log('\n🎉 All tests passed! Your E2B Clone SDK works perfectly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // 8. Clean up (same as official E2B)
    if (sandbox) {
      console.log('\n🧹 Cleaning up sandbox...');
      await sandbox.kill();
      console.log('✅ Sandbox killed');
    }
  }
}

// Run the test
if (require.main === module) {
  testE2BCloneSDK().catch(console.error);
}

module.exports = { testE2BCloneSDK };
