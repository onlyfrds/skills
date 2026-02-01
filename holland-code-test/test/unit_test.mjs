#!/usr/bin/env node

/**
 * Unit tests for Holland Code Test skill
 * Tests the JavaScript module functionality
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import HollandCodeTest from '../holland-code-test.mjs';

// Test function
async function runTests() {
  console.log('🧪 Running unit tests for holland-code-test...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check if the module can be imported and instantiated
  console.log('Test 1: Module import and instantiation');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    if (testInstance && typeof testInstance.startTest === 'function') {
      console.log('  ✅ PASSED: Module imported and instantiated successfully');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Module did not instantiate properly');
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error importing or instantiating module: ${error.message}`);
  }

  // Test 2: Check if the test can be started
  console.log('\nTest 2: Starting a new test');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    const question = testInstance.startTest('test-user-123');
    
    if (question && question.id === 1) {
      console.log('  ✅ PASSED: Test started successfully with first question');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Test did not start properly');
      console.log(`  Question: ${JSON.stringify(question)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error starting test: ${error.message}`);
  }

  // Test 3: Check if questions are returned with proper structure
  console.log('\nTest 3: Question structure validation');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-456');
    const question = testInstance.getNextQuestion();
    
    if (question && 
        question.hasOwnProperty('id') && 
        question.hasOwnProperty('text') && 
        question.hasOwnProperty('current') &&
        question.hasOwnProperty('total')) {
      console.log('  ✅ PASSED: Question has proper structure');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Question does not have proper structure');
      console.log(`  Question: ${JSON.stringify(question)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error getting question: ${error.message}`);
  }

  // Test 4: Check if answers can be submitted with valid ratings
  console.log('\nTest 4: Submitting valid answer');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-789');
    const initialQuestion = testInstance.getNextQuestion();
    
    // Submit an answer
    const nextQuestion = testInstance.submitAnswer(initialQuestion.id, 4);
    
    if (testInstance.currentTest.answers[initialQuestion.id] === 4) {
      console.log('  ✅ PASSED: Answer submitted successfully');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Answer was not recorded properly');
      console.log(`  Recorded answers: ${JSON.stringify(testInstance.currentTest.answers)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error submitting answer: ${error.message}`);
  }

  // Test 5: Check if invalid ratings are properly rejected
  console.log('\nTest 5: Invalid rating rejection');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-000');
    const initialQuestion = testInstance.getNextQuestion();
    
    try {
      testInstance.submitAnswer(initialQuestion.id, 6); // Invalid rating
      console.log('  ❌ FAILED: Invalid rating (6) was accepted');
    } catch (error) {
      if (error.message.includes('Rating must be an integer between 1 and 5')) {
        console.log('  ✅ PASSED: Invalid rating properly rejected');
        passedTests++;
      } else {
        console.log(`  ❌ FAILED: Wrong error message for invalid rating: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Unexpected error during test: ${error.message}`);
  }

  // Test 6: Check if invalid question IDs are properly handled
  console.log('\nTest 6: Invalid question ID handling');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-001');
    
    try {
      testInstance.submitAnswer(999, 3); // Invalid question ID
      console.log('  ❌ FAILED: Invalid question ID was accepted');
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log('  ✅ PASSED: Invalid question ID properly rejected');
        passedTests++;
      } else {
        console.log(`  ❌ FAILED: Wrong error message for invalid question ID: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Unexpected error during test: ${error.message}`);
  }

  // Test 7: Check if test progress tracking works
  console.log('\nTest 7: Progress tracking');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-002');
    
    // Submit a few answers
    const q1 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q1.id, 3);
    
    const q2 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q2.id, 5);
    
    const progress = testInstance.getProgress();
    
    if (progress.answered === 2 && progress.currentIndex === 2) {
      console.log('  ✅ PASSED: Progress tracking works correctly');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Progress tracking is incorrect');
      console.log(`  Progress: ${JSON.stringify(progress)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during progress tracking test: ${error.message}`);
  }

  // Test 8: Check if results calculation works after completing some answers
  console.log('\nTest 8: Results calculation');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-003');
    
    // Submit answers for the first few questions to test scoring
    const q1 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q1.id, 5);
    
    const q2 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q2.id, 4);
    
    const q3 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q3.id, 3);
    
    const results = testInstance.calculateResults();
    
    if (results && results.categoryScores) {
      console.log('  ✅ PASSED: Results calculation works');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Results calculation failed');
      console.log(`  Results: ${JSON.stringify(results)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during results calculation test: ${error.message}`);
  }

  // Test 9: Check if category scores are calculated properly
  console.log('\nTest 9: Category score accuracy');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-004');
    
    // Submit answers for the first 3 questions which should all be in the 'R' (Realistic) category
    for (let i = 0; i < 3; i++) {
      const q = testInstance.getNextQuestion();
      if (q) {
        testInstance.submitAnswer(q.id, 4); // Answer with 4 points each
      }
    }
    
    const results = testInstance.calculateResults();
    
    // The first 3 questions are all in 'R' category, so R should have at least 12 points (3*4)
    if (results && results.categoryScores.R >= 12) {
      console.log('  ✅ PASSED: Category scores calculated accurately');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Category scores are inaccurate');
      console.log(`  Category scores: ${JSON.stringify(results.categoryScores)}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during category score test: ${error.message}`);
  }

  // Test 10: Check if test completion works properly
  console.log('\nTest 10: Test completion');
  totalTests++;
  try {
    const testInstance = new HollandCodeTest();
    testInstance.startTest('test-user-005');
    
    // Submit answers for the first few questions
    const q1 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q1.id, 3);
    
    const q2 = testInstance.getNextQuestion();
    testInstance.submitAnswer(q2.id, 4);
    
    // Manually mark test as complete for this test
    testInstance.completeTest();
    
    if (testInstance.currentTest.isComplete === true) {
      console.log('  ✅ PASSED: Test completion works');
      passedTests++;
    } else {
      console.log('  ❌ FAILED: Test completion failed');
      console.log(`  Is complete: ${testInstance.currentTest.isComplete}`);
    }
  } catch (error) {
    console.log(`  ❌ FAILED: Error during test completion: ${error.message}`);
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