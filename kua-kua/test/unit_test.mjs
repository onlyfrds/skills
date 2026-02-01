#!/usr/bin/env node

/**
 * Unit tests for Kua Kua skill
 * Tests the compliment generator functionality
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import { generateCompliment, determineCategory, getFollowUpQuestion } from '../scripts/kua_kua_generator.mjs';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for kua-kua...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check if the script runs without errors
  console.log('Test 1: Script execution without errors');
  totalTests++;
  try {
    // Determine the correct path by checking if we're in a test subdirectory
    // First try relative to this file (when running from project root)
    let scriptPath = join(process.cwd(), 'skills/kua-kua/scripts/kua_kua_generator.mjs');
    
    // If that doesn't work, try relative to this test file's directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/kua_kua_generator.mjs');
    }
    
    const result = spawnSync('node', [scriptPath], { encoding: 'utf8' });
    
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

  // Test 2: Check if the script handles missing arguments properly
  console.log('\nTest 2: Missing arguments handling');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/kua-kua/scripts/kua_kua_generator.mjs');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/kua_kua_generator.mjs');
    }
    
    const result = spawnSync('node', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('夸夸服務')) {
      console.log('  ✅ PASSED: Handles missing arguments properly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Does not handle missing arguments properly');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 3: Check if the script works with 'general' argument
  console.log('\nTest 3: General argument handling');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/kua-kua/scripts/kua_kua_generator.mjs');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/kua_kua_generator.mjs');
    }
    
    const result = spawnSync('node', [scriptPath, 'general'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('夸夸服務')) {
      console.log('  ✅ PASSED: Handles general argument properly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Does not handle general argument properly');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 4: Check if the generateCompliment function works
  console.log('\nTest 4: generateCompliment function');
  totalTests++;
  try {
    const compliment = generateCompliment();
    
    if (typeof compliment === 'string' && compliment.length > 0) {
      console.log('  ✅ PASSED: generateCompliment function works');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: generateCompliment function does not work properly');
      console.log(`  Result: ${compliment}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error in generateCompliment function: ${error.message}`);
  }

  // Test 5: Check if the generateCompliment function works with different categories
  console.log('\nTest 5: generateCompliment function with categories');
  totalTests++;
  try {
    const categories = ['general', 'achievement', 'stress', 'confidence', 'worry'];
    let allWork = true;
    
    for (const category of categories) {
      const compliment = generateCompliment(category);
      if (typeof compliment !== 'string' || compliment.length === 0) {
        allWork = false;
        break;
      }
    }
    
    if (allWork) {
      console.log('  ✅ PASSED: generateCompliment works with all categories');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: generateCompliment does not work with all categories');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error testing generateCompliment with categories: ${error.message}`);
  }

  // Test 6: Check if the determineCategory function works correctly
  console.log('\nTest 6: determineCategory function accuracy');
  totalTests++;
  try {
    // Test different inputs
    const testCases = [
      { input: '我好累', expected: 'stress' },
      { input: 'I am stressed', expected: 'stress' },
      { input: '考試好擔心', expected: 'worry' },
      { input: 'I am worried about the test', expected: 'worry' },
      { input: '我有成就', expected: 'achievement' },
      { input: 'I have an achievement', expected: 'achievement' },
      { input: '一般般', expected: 'general' }
    ];
    
    let allCorrect = true;
    for (const testCase of testCases) {
      const result = determineCategory(testCase.input);
      if (result !== testCase.expected) {
        allCorrect = false;
        console.log(`    Input: "${testCase.input}" -> Expected: "${testCase.expected}", Got: "${result}"`);
        break;
      }
    }
    
    if (allCorrect) {
      console.log('  ✅ PASSED: determineCategory function works correctly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: determineCategory function does not work correctly');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error in determineCategory function: ${error.message}`);
  }

  // Test 7: Check if the getFollowUpQuestion function works
  console.log('\nTest 7: getFollowUpQuestion function');
  totalTests++;
  try {
    const question = getFollowUpQuestion();
    
    if (typeof question === 'string' && question.length > 0) {
      console.log('  ✅ PASSED: getFollowUpQuestion function works');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: getFollowUpQuestion function does not work properly');
      console.log(`  Result: ${question}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error in getFollowUpQuestion function: ${error.message}`);
  }

  // Test 8: Check if the getFollowUpQuestion function works with different categories
  console.log('\nTest 8: getFollowUpQuestion function with categories');
  totalTests++;
  try {
    const categories = ['general', 'stress', 'worry', 'achievement'];
    let allWork = true;
    
    for (const category of categories) {
      const question = getFollowUpQuestion(category);
      if (typeof question !== 'string' || question.length === 0) {
        allWork = false;
        break;
      }
    }
    
    if (allWork) {
      console.log('  ✅ PASSED: getFollowUpQuestion works with all categories');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: getFollowUpQuestion does not work with all categories');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error testing getFollowUpQuestion with categories: ${error.message}`);
  }

  // Test 9: Check if the script generates output with specific categories
  console.log('\nTest 9: Script output with specific inputs');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/kua-kua/scripts/kua_kua_generator.mjs');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/kua_kua_generator.mjs');
    }
    
    const result = spawnSync('node', [scriptPath, '我好累'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('夸夸服務') && result.stdout.includes('累')) {
      console.log('  ✅ PASSED: Script generates appropriate output for specific input');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Script does not generate appropriate output for specific input');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 300)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script with specific input: ${error.message}`);
  }

  // Test 10: Check if the script output contains expected elements
  console.log('\nTest 10: Script output structure validation');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/kua-kua/scripts/kua_kua_generator.mjs');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/kua_kua_generator.mjs');
    }
    
    const result = spawnSync('node', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0) {
      const output = result.stdout;
      const hasCompliment = output.includes('✨');
      const hasFollowUp = output.includes('💬');
      const hasServiceTitle = output.includes('夸夸服務');
      
      if (hasCompliment && hasFollowUp && hasServiceTitle) {
        console.log('  ✅ PASSED: Script output contains expected elements');
        passedTests++;
      } else {
        console.log('  ❌ FAILED: Script output missing expected elements');
        console.log(`  Has compliment: ${hasCompliment}, Has follow-up: ${hasFollowUp}, Has title: ${hasServiceTitle}`);
      }
    } else {
      console.log('  ❌ FAILED: Script did not execute properly');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error validating script output: ${error.message}`);
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