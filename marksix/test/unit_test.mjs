#!/usr/bin/env node

/**
 * Unit tests for MarkSix number generator
 * Tests the Python script functionality
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for marksix...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check if the script runs without errors
  console.log('Test 1: Script execution without errors');
  totalTests++;
  try {
    // Determine the correct path by checking if we're in a test subdirectory
    // First try relative to this file (when running from project root)
    let scriptPath = join(process.cwd(), 'skills/marksix/scripts/generate_numbers.py');
    
    // If that doesn't work, try relative to this test file's directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/generate_numbers.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0) {
      console.log('  ✅ PASSED: Script executed without errors');
      passedTests++;
    } else {
      console.log(`  ❌ FAILED: Script exited with code ${result.status}`);
      console.log(`  stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 2: Check if output contains expected format
  console.log('\nTest 2: Output format validation');
  totalTests++;
  try {
    // Same path resolution logic
    let scriptPath = join(process.cwd(), 'skills/marksix/scripts/generate_numbers.py');
    if (!require('fs').existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/generate_numbers.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Your Mark Six numbers are:')) {
      console.log('  ✅ PASSED: Output contains expected format');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Output does not match expected format');
      console.log(`  stdout: ${result.stdout}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 3: Check if output contains 6 numbers
  console.log('\nTest 3: Output contains exactly 6 numbers');
  totalTests++;
  try {
    // Same path resolution logic
    let scriptPath = join(process.cwd(), 'skills/marksix/scripts/generate_numbers.py');
    if (!require('fs').existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/generate_numbers.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0) {
      const output = result.stdout;
      // Extract numbers from the output
      const numberMatches = output.match(/\d+/g);
      if (numberMatches && numberMatches.length === 6) {
        console.log('  ✅ PASSED: Output contains exactly 6 numbers');
        passedTests++;
      } else {
        console.log(`  ❌ FAILED: Output contains ${numberMatches ? numberMatches.length : 0} numbers, expected 6`);
        console.log(`  Numbers found: ${numberMatches ? numberMatches.join(', ') : 'none'}`);
      }
    } else {
      console.log('  ❌ FAILED: Script did not execute properly');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 4: Check if all numbers are in range 1-49
  console.log('\nTest 4: All numbers in valid range (1-49)');
  totalTests++;
  try {
    // Same path resolution logic
    let scriptPath = join(process.cwd(), 'skills/marksix/scripts/generate_numbers.py');
    if (!require('fs').existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/generate_numbers.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0) {
      const output = result.stdout;
      const numberMatches = output.match(/\d+/g);
      
      if (numberMatches && numberMatches.length === 6) {
        const numbers = numberMatches.map(Number);
        const allInRange = numbers.every(num => num >= 1 && num <= 49);
        
        if (allInRange) {
          console.log('  ✅ PASSED: All numbers are in the valid range (1-49)');
          passedTests++;
        } else {
          console.log(`  ❌ FAILED: Some numbers are outside the valid range (1-49)`);
          console.log(`  Numbers: ${numbers.join(', ')}`);
        }
      } else {
        console.log('  ❌ FAILED: Could not extract 6 numbers from output');
      }
    } else {
      console.log('  ❌ FAILED: Script did not execute properly');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 5: Check if all numbers are unique
  console.log('\nTest 5: All numbers are unique (no duplicates)');
  totalTests++;
  try {
    // Same path resolution logic
    let scriptPath = join(process.cwd(), 'skills/marksix/scripts/generate_numbers.py');
    if (!require('fs').existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/generate_numbers.py');
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0) {
      const output = result.stdout;
      const numberMatches = output.match(/\d+/g);
      
      if (numberMatches && numberMatches.length === 6) {
        const numbers = numberMatches.map(Number);
        const uniqueNumbers = [...new Set(numbers)];
        
        if (uniqueNumbers.length === numbers.length) {
          console.log('  ✅ PASSED: All numbers are unique (no duplicates)');
          passedTests++;
        } else {
          console.log(`  ❌ FAILED: Found duplicate numbers`);
          console.log(`  Original: ${numbers.join(', ')}`);
          console.log(`  Unique: ${uniqueNumbers.join(', ')}`);
        }
      } else {
        console.log('  ❌ FAILED: Could not extract 6 numbers from output');
      }
    } else {
      console.log('  ❌ FAILED: Script did not execute properly');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 6: Run the script multiple times to ensure randomness
  console.log('\nTest 6: Multiple executions show different results (randomness)');
  totalTests++;
  try {
    // Same path resolution logic
    let scriptPath = join(process.cwd(), 'skills/marksix/scripts/generate_numbers.py');
    if (!require('fs').existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/generate_numbers.py');
    }
    
    const results = [];
    
    // Run the script 3 times
    for (let i = 0; i < 3; i++) {
      const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
      if (result.status === 0) {
        const output = result.stdout;
        const numberMatches = output.match(/\d+/g);
        if (numberMatches && numberMatches.length === 6) {
          results.push(numberMatches.map(Number));
        }
      }
    }
    
    // Check if at least some of the results are different (indicating randomness)
    const allSame = results.length >= 2 && results.every(arr => {
      return arr.every((val, idx) => val === results[0][idx]);
    });
    
    if (results.length >= 2 && !allSame) {
      console.log('  ✅ PASSED: Multiple executions produced different results (randomness)');
      passedTests++;
    } else if (results.length < 2) {
      console.log('  ❌ FAILED: Could not run script multiple times successfully');
    } else {
      console.log('  ❌ FAILED: Multiple executions produced identical results (not random)');
      console.log(`  Results: ${JSON.stringify(results)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script multiple times: ${error.message}`);
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