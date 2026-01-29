#!/usr/bin/env node

/**
 * Unit tests for kiss skill
 * Tests various kiss message scenarios
 */

import { execSync } from 'child_process';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for kiss skill...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Basic execution
  console.log('Test 1: Basic execution of kiss script');
  totalTests++;
  try {
    const command = `node ${process.cwd()}/kiss/scripts/kiss.mjs`;
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    
    if (result && result.trim().length > 0) {
      console.log('  ✅ PASSED: Script executed and returned a message');
      console.log(`  Output: ${result.trim()}`);
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Script did not return any output');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error in test: ${error.message}`);
  }

  // Test 2: Execution with context
  console.log('\nTest 2: Execution with context parameter');
  totalTests++;
  try {
    const contexts = ['morning', 'night', 'comfort', 'celebration', 'general'];
    let allContextsWorked = true;
    
    for (const context of contexts) {
      try {
        const command = `node ${process.cwd()}/kiss/scripts/kiss.mjs ${context}`;
        const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        
        if (!result || result.trim().length === 0) {
          console.log(`    ❌ FAILED: Context '${context}' did not return any output`);
          allContextsWorked = false;
        }
      } catch (err) {
        console.log(`    ❌ FAILED: Context '${context}' threw error: ${err.message}`);
        allContextsWorked = false;
      }
    }
    
    if (allContextsWorked) {
      console.log('  ✅ PASSED: All context parameters work correctly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Some context parameters did not work');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error in test: ${error.message}`);
  }

  // Test 3: Test the script can be imported as module
  console.log('\nTest 3: Import script as module');
  totalTests++;
  try {
    const { getRandomKissMessage, getKissMessage, kissMessages } = await import(`${process.cwd()}/kiss/scripts/kiss.mjs`);
    
    if (typeof getRandomKissMessage === 'function' && 
        typeof getKissMessage === 'function' &&
        Array.isArray(kissMessages) && 
        kissMessages.length > 0) {
      console.log('  ✅ PASSED: Script can be imported as module with all functions available');
      
      // Test that functions work
      const randomMsg = getRandomKissMessage();
      const generalMsg = getKissMessage('general');
      
      if (randomMsg && randomMsg.length > 0 && generalMsg && generalMsg.length > 0) {
        console.log('  ✅ PASSED: Functions work correctly when imported');
      } else {
        console.log('  ❌ FAILED: Functions did not return expected values when imported');
      }
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Script missing expected functions when imported as module');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error importing script as module: ${error.message}`);
  }

  // Test 4: Test specific contexts return appropriate messages
  console.log('\nTest 4: Specific contexts return appropriate themed messages');
  totalTests++;
  try {
    const { getKissMessage } = await import(`${process.cwd()}/kiss/scripts/kiss.mjs`);
    
    const morningMsg = getKissMessage('morning');
    const nightMsg = getKissMessage('night');
    
    const hasMorningIndicators = morningMsg.toLowerCase().includes('morning') || morningMsg.includes('🌅') || morningMsg.includes('☀️');
    const hasNightIndicators = nightMsg.toLowerCase().includes('night') || nightMsg.includes('🌙') || nightMsg.includes('sleep');
    
    if (hasMorningIndicators && hasNightIndicators) {
      console.log('  ✅ PASSED: Context-specific messages contain appropriate themes');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Context-specific messages do not contain expected themes');
      console.log(`    Morning message: ${morningMsg}`);
      console.log(`    Night message: ${nightMsg}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error testing context-specific messages: ${error.message}`);
  }

  // Summary
  console.log('\n--- Test Results ---');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests/totalTests)*100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
  } else if (passedTests === 0) {
    console.log('💥 All tests failed!');
  } else {
    console.log('⚠️  Some tests failed - review the implementation');
  }
  
  return { passedTests, totalTests };
}

// Run tests if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runTests()
    .then(results => {
      process.exit(results.passedTests === results.totalTests ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite error:', error);
      process.exit(1);
    });
}

export { runTests };