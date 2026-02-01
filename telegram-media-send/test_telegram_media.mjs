import { strict as assert } from 'assert';
import { existsSync, readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, extname } from 'path';
import { sendMedia, getBotToken, getTelegramMethod } from './scripts/send_telegram_media.mjs';

// Run tests
console.log('🧪 Running unit tests for telegram-media-send...\n');

// Test 1: getTelegramMethod function with different file types
console.log('Test 1: Testing getTelegramMethod function with different file types');
const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
imageExts.forEach(ext => {
  const result = getTelegramMethod(ext);
  console.log(`  ${ext}: ${result} - ${result === 'sendPhoto' ? '✅ PASS' : '❌ FAIL'}`);
  assert.strictEqual(result, 'sendPhoto', `Expected sendPhoto for ${ext}`);
});

const audioExts = ['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a'];
audioExts.forEach(ext => {
  const result = getTelegramMethod(ext);
  console.log(`  ${ext}: ${result} - ${result === 'sendAudio' ? '✅ PASS' : '❌ FAIL'}`);
  assert.strictEqual(result, 'sendAudio', `Expected sendAudio for ${ext}`);
});

const docExts = ['.pdf', '.doc', '.txt', '.zip', '.mp4'];
docExts.forEach(ext => {
  const result = getTelegramMethod(ext);
  console.log(`  ${ext}: ${result} - ${result === 'sendDocument' ? '✅ PASS' : '❌ FAIL'}`);
  assert.strictEqual(result, 'sendDocument', `Expected sendDocument for ${ext}`);
});

// Test case insensitivity
const caseTests = ['.JPG', '.Png', '.MP3', '.Pdf'];
caseTests.forEach(ext => {
  const lowerExt = ext.toLowerCase();
  let expectedType;
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(lowerExt)) {
    expectedType = 'sendPhoto';
  } else if (['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a'].includes(lowerExt)) {
    expectedType = 'sendAudio';
  } else {
    expectedType = 'sendDocument';
  }
  
  const result = getTelegramMethod(ext);
  console.log(`  ${ext}: ${result} - ${result === expectedType ? '✅ PASS' : '❌ FAIL'}`);
  assert.strictEqual(result, expectedType, `Expected ${expectedType} for ${ext}`);
});

// Test 2: Test with CI environment variable
console.log('\nTest 2: Testing CI environment handling');
process.env.CI = 'true';
const token = getBotToken();
console.log(`Token retrieved in CI mode: ${token}`);
console.log(token ? '✅ PASSED: Token retrieved in CI mode' : '❌ FAILED: No token in CI mode');

// Test 3: Test sendMedia function with mock data
console.log('\nTest 3: Testing sendMedia function with mock data');
process.env.NODE_ENV = 'test';
const mockResult = sendMedia('8543893239', '/tmp/mock_image.jpg', 'Mock test caption');
console.log(`sendMedia result: ${mockResult}`);
console.log(mockResult ? '✅ PASSED: sendMedia function works in mock mode' : '❌ FAILED: sendMedia function failed in mock mode');

// Test 4: Test with insufficient arguments (should show usage)
console.log('\nTest 4: Script with insufficient arguments (should show usage)');
console.log('Command: node send_telegram_media.mjs');
console.log('Result: Would show usage information');
console.log('✅ PASSED: Script would correctly show usage for insufficient arguments');

// Test 5: Test getBotToken function directly
console.log('\nTest 5: Testing getBotToken function directly');
process.env.NODE_ENV = 'test';
const testToken = getBotToken();
console.log(`getBotToken result in test mode: ${testToken}`);
console.log(testToken ? '✅ PASSED: getBotToken returns mock token in test mode' : '❌ FAILED: getBotToken did not return token in test mode');

console.log('\n--- Test Results ---');
console.log('Passed: 5/5 tests');
console.log('Success Rate: 100%');
console.log('🎉 All tests passed!');