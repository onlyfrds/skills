#!/usr/bin/env node

/**
 * Unit tests for CFA Study skill
 * Tests the Python script functionality
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for cfa-study...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check if the script runs without errors
  console.log('Test 1: Script execution without errors');
  totalTests++;
  try {
    // Determine the correct path by checking if we're in a test subdirectory
    // First try relative to this file (when running from project root)
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    
    // If that doesn't work, try relative to this test file's directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 0 || result.status === 1) { // Status 1 is expected when no arguments provided
      console.log('  ✅ PASSED: Script executed without critical errors');
      passedTests++;
    } else {
      console.log(`  ❌ FAILED: Script exited with code ${result.status}`);
      console.log(`  stderr: ${result.stderr}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 2: Check if script handles missing command properly
  console.log('\nTest 2: Missing command handling');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath], { encoding: 'utf8' });
    
    if (result.status === 1) { // Should exit with code 1 when no command provided
      console.log('  ✅ PASSED: Properly handles missing command');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Does not handle missing command properly');
      console.log(`  stdout: ${result.stdout}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 3: Check if script shows help when run with --help
  console.log('\nTest 3: Help command execution');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'profile'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('CFA Study Profile')) {
      console.log('  ✅ PASSED: Profile command works correctly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Profile command does not work as expected');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 4: Check if set-level command works with valid input
  console.log('\nTest 4: Set level command with valid input');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'set-level', '2'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Current level set to: 2')) {
      console.log('  ✅ PASSED: Set level command works with valid input');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Set level command does not work with valid input');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 5: Check if set-level command handles invalid input properly
  console.log('\nTest 5: Set level command with invalid input');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'set-level', '5'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Invalid level')) {
      console.log('  ✅ PASSED: Set level command properly rejects invalid input');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Set level command does not handle invalid input properly');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 6: Check if set-target-date command handles valid date format
  console.log('\nTest 6: Set target date command with valid format');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'set-target-date', '2026-06-01'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Target exam date set to')) {
      console.log('  ✅ PASSED: Set target date command works with valid format');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Set target date command does not work with valid format');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 7: Check if set-target-date command handles invalid date format
  console.log('\nTest 7: Set target date command with invalid format');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'set-target-date', 'invalid-date'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Invalid date format')) {
      console.log('  ✅ PASSED: Set target date command properly rejects invalid format');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Set target date command does not handle invalid format properly');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 8: Check if log-study command handles valid input
  console.log('\nTest 8: Log study command with valid input');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'log-study', '2.5', 'Ethics'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Study session logged')) {
      console.log('  ✅ PASSED: Log study command works with valid input');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Log study command does not work with valid input');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 9: Check if topics command executes properly
  console.log('\nTest 9: Topics command execution');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'topics'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Topic Progress')) {
      console.log('  ✅ PASSED: Topics command executes properly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Topics command does not execute properly');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error running script: ${error.message}`);
  }

  // Test 10: Check if practice command works with valid inputs
  console.log('\nTest 10: Practice command with valid inputs');
  totalTests++;
  try {
    let scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), '../scripts/cfa_study.py');
    }
    
    // Also try the relative path from test directory
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'scripts/cfa_study.py');
    }
    
    // Final fallback for GitHub Actions environment
    if (!existsSync(scriptPath)) {
      scriptPath = join(process.cwd(), 'skills/cfa-study/scripts/cfa_study.py');
    }
    
    // Last resort: try absolute path from root
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/neo/skills/cfa-study/scripts/cfa_study.py';
    }
    
    // For the GitHub Actions environment where tests run from different base
    if (!existsSync(scriptPath)) {
      scriptPath = '/home/runner/work/skills/skills/cfa-study/scripts/cfa_study.py';
    }
    
    const result = spawnSync('python3', [scriptPath, 'practice', 'Ethics', '1', '2'], { encoding: 'utf8' });
    
    if (result.status === 0 && result.stdout.includes('Practice Questions')) {
      console.log('  ✅ PASSED: Practice command works with valid inputs');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Practice command does not work with valid inputs');
      console.log(`  status: ${result.status}, stdout: ${result.stdout.substring(0, 300)}`);
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