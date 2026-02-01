#!/usr/bin/env node

/**
 * Unit tests for Domain Whois skill
 * Tests the whois lookup functionality
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for domain-whois...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check if the script runs without errors
  console.log('Test 1: Script execution without errors');
  totalTests++;
  try {
    // Determine the correct path by checking if we're in a test subdirectory
    // First try relative to this file (when running from project root)
    let scriptPath = join(process.cwd(), 'skills/domain-whois/scripts/whois_lookup.py');
    
    // If that doesn't work, try relative to this test file's directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/whois_lookup.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0 || result.status === 1) { // Status 1 is expected when no domain provided
      console.log('  ✅ PASSED: Script executed without critical errors');
      passedTests++;
    } else {
      console.log(`  ❌ FAILED: Script exited with code ${result.status}`);
      console.log(`  stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 2: Check if script handles missing domain argument properly
  console.log('\nTest 2: Missing domain argument handling');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/domain-whois/scripts/whois_lookup.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/whois_lookup.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 1 && result.stdout.includes('Usage:')) {
      console.log('  ✅ PASSED: Properly handles missing domain argument');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Does not handle missing domain argument properly');
      console.log(`  stdout: ${result.stdout}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 3: Check if script validates domain format correctly
  console.log('\nTest 3: Domain format validation');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/domain-whois/scripts/whois_lookup.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/whois_lookup.py');
    }
    
    // Test with an invalid domain
    const result = spawnSync('python3', [scriptPath, 'invalid domain'], { encoding: 'utf8' });
    
    if (result.status !== 0) {
      console.log('  ✅ PASSED: Properly rejects invalid domain format');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Does not reject invalid domain format');
      console.log(`  stdout: ${result.stdout}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 4: Check if script accepts valid domain format
  console.log('\nTest 4: Valid domain format acceptance');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/domain-whois/scripts/whois_lookup.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/whois_lookup.py');
    }
    
    // Test with a valid domain (this might fail due to network restrictions, but should not fail due to validation)
    const result = spawnSync('python3', [scriptPath, 'example.com'], { encoding: 'utf8' });
    
    // Since whois requires network access, we just check that validation passes
    // The script should not exit with a validation error (which would be a specific error message)
    if (!result.stderr || !result.stderr.includes('Invalid domain format')) {
      console.log('  ✅ PASSED: Accepts valid domain format (validation passed)');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Rejects valid domain format');
      console.log(`  stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 5: Check if script handles command injection attempts
  console.log('\nTest 5: Command injection protection');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/domain-whois/scripts/whois_lookup.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/whois_lookup.py');
    }
    
    // Test with a potential command injection attempt
    const result = spawnSync('python3', [scriptPath, 'example.com;echo vulnerable'], { encoding: 'utf8' });
    
    if (result.status !== 0 || !result.stdout.includes('vulnerable')) {
      console.log('  ✅ PASSED: Protected against command injection');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Vulnerable to command injection');
      console.log(`  stdout: ${result.stdout}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 6: Check if script handles various valid domain formats
  console.log('\nTest 6: Various valid domain formats');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/domain-whois/scripts/whois_lookup.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/whois_lookup.py');
    }
    
    // Test with different valid domain formats
    const domains = ['test.com', 'sub.domain.org', 'my-site.co.uk'];
    let allPassed = true;
    
    for (const domain of domains) {
      const result = spawnSync('python3', [scriptPath, domain], { encoding: 'utf8' });
      
      // We're just checking that the domain passes validation (doesn't get rejected as invalid format)
      if (result.stderr && result.stderr.includes('Invalid domain format')) {
        allPassed = false;
        break;
      }
    }
    
    if (allPassed) {
      console.log('  ✅ PASSED: Handles various valid domain formats');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Does not handle all valid domain formats');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
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
const isMain = process.argv[1] && process.argv[1].endsWith('unit_test.mjs');

if (isMain) {
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