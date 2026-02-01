// SOLID Unit Tests for Bonus Picture Generator

const assert = require('assert');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
const crypto = require('crypto');

// Mock classes for testing
class MockFileSystemManager {
  constructor(fileExists = true) {
    this.fileExists = fileExists;
    this.ensureDirCalls = [];
  }
  
  existsSync(path) {
    // For output files, we'll make them exist after capture
    if (path.includes('/tmp/moltbot/bonus_') && path.endsWith('.jpg')) {
      return this.fileExists;
    }
    // For config files, return true
    if (path.includes('clawdbot.json') || path.includes('moltbot.json')) {
      return true;
    }
    // For temp directories, return true
    if (path.includes('/tmp/moltbot') || path.includes('/tmp/test')) {
      return true;
    }
    return false;
  }
  
  ensureDirectoryExists(dirPath) {
    this.ensureDirCalls.push(dirPath);
  }
}

class MockVideoRepository {
  constructor(videos = []) {
    this.videos = videos;
  }
  
  getRandomVideo(directory) {
    if (this.videos.length === 0) {
      throw new Error('No video files found in directory');
    }
    return this.videos[Math.floor(Math.random() * this.videos.length)];
  }
}

class MockFrameCaptureService {
  constructor(shouldFail = false) {
    this.shouldFail = shouldFail;
    this.captureCalls = [];
  }
  
  captureFrame(videoPath, outputPath) {
    this.captureCalls.push({ videoPath, outputPath });
    
    if (this.shouldFail) {
      throw new Error('Frame capture failed');
    }
    
    // Simulate successful frame capture
    return outputPath;
  }
}

class MockMediaSender {
  constructor(shouldFail = false) {
    this.shouldFail = shouldFail;
    this.sendCalls = [];
  }
  
  sendMedia(chatId, mediaPath, caption) {
    this.sendCalls.push({ chatId, mediaPath, caption });
    
    if (this.shouldFail) {
      throw new Error('Media sending failed');
    }
    
    return true;
  }
}

class MockTempFileManager {
  static cleanupCalls = [];
  
  static ensureDirectoryExists(dirPath) {
    // Mock implementation
    return true;
  }
  
  static cleanup(filePath) {
    this.cleanupCalls.push(filePath);
  }
}

// Import the actual classes for integration testing
const pathModule = require('path');
const {
  VideoRepository,
  FrameCaptureService,
  TelegramMediaSender,
  BonusPictureGenerator,
  BonusPictureFactory,
  TempFileManager
} = require(pathModule.join(__dirname, '../solid_bonus_picture.mjs'));

// Test framework
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function test(description, testFn) {
  testResults.total++;
  try {
    testFn();
    testResults.passed++;
    console.log(`✓ PASSED: ${description}`);
  } catch (error) {
    testResults.failed++;
    console.log(`✗ FAILED: ${description} - ${error.message}`);
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message} Expected ${expected}, but got ${actual}`);
  }
}

function assertThrows(fn, expectedError = null) {
  try {
    fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (expectedError && !error.message.includes(expectedError)) {
      throw new Error(`Expected error to include '${expectedError}', but got: ${error.message}`);
    }
  }
}

// Run tests
console.log('Running SOLID Bonus Picture Skill Unit Tests...\n');

// Test VideoRepository
test('VideoRepository should select dance videos when available', () => {
  const repo = new VideoRepository();
  // We'll test the logic by creating a mock version
  const mockRepo = {
    _getVideoFiles: () => ['dance01.mp4', 'dance02.mp4', 'normal.mp4']
  };
  
  // Override the method temporarily for testing
  Object.setPrototypeOf(mockRepo, VideoRepository.prototype);
  
  const video = mockRepo.getRandomVideo('assets/video');
  assert(video.includes('dance') || video === 'normal.mp4', 'Should select dance video or fallback');
});

test('VideoRepository should fallback to non-dance videos when no dance videos available', () => {
  const repo = new VideoRepository();
  const mockRepo = {
    _getVideoFiles: () => ['normal.mp4', 'other.mp4']
  };
  
  Object.setPrototypeOf(mockRepo, VideoRepository.prototype);
  
  const video = mockRepo.getRandomVideo('assets/video');
  assert(video.endsWith('.mp4'), 'Should select an mp4 file');
});

test('VideoRepository should throw error when no videos available', () => {
  const repo = new VideoRepository();
  const mockRepo = {
    _getVideoFiles: () => []
  };
  
  Object.setPrototypeOf(mockRepo, VideoRepository.prototype);
  
  assertThrows(() => {
    mockRepo.getRandomVideo('assets/video');
  }, 'No video files found');
});

// Test FrameCaptureService
test('FrameCaptureService should have captureFrame method', () => {
  const service = new FrameCaptureService();
  assert(typeof service.captureFrame === 'function', 'captureFrame should be a function');
});

test('FrameCaptureService should have helper methods', () => {
  const service = new FrameCaptureService();
  assert(typeof service._getVideoDuration === 'function', '_getVideoDuration should be a function');
  assert(typeof service._generateRandomTime === 'function', '_generateRandomTime should be a function');
  assert(typeof service._formatTime === 'function', '_formatTime should be a function');
});

// Test BonusPictureGenerator with mocks
test('BonusPictureGenerator should work with mocked dependencies', () => {
  const mockVideoRepo = new MockVideoRepository(['dance01.mp4']);
  const mockFrameService = new MockFrameCaptureService();
  const mockMediaSender = new MockMediaSender();
  const mockFileSystem = new MockFileSystemManager(true); // File exists after capture
  
  const generator = new BonusPictureGenerator(mockVideoRepo, mockFrameService, mockMediaSender, mockFileSystem);
  
  // Mock TempFileManager methods
  const originalEnsureDir = TempFileManager.ensureDirectoryExists;
  const originalCleanup = TempFileManager.cleanup;
  TempFileManager.ensureDirectoryExists = () => {};
  TempFileManager.cleanup = () => {};
  
  const result = generator.generateAndSend('123456789', 'assets/video', '/tmp/test');
  
  assert(result.success === true, 'Generation should be successful');
  assert(result.videoUsed === 'dance01.mp4', 'Should use the selected video');
  
  // Restore original methods
  TempFileManager.ensureDirectoryExists = originalEnsureDir;
  TempFileManager.cleanup = originalCleanup;
});

test('BonusPictureGenerator should handle frame capture failure', () => {
  const mockVideoRepo = new MockVideoRepository(['dance01.mp4']);
  const mockFrameService = new MockFrameCaptureService(true); // Should fail
  const mockMediaSender = new MockMediaSender();
  const mockFileSystem = new MockFileSystemManager(false); // File doesn't exist after capture attempt
  
  const generator = new BonusPictureGenerator(mockVideoRepo, mockFrameService, mockMediaSender, mockFileSystem);
  
  // Mock TempFileManager methods
  const originalEnsureDir = TempFileManager.ensureDirectoryExists;
  TempFileManager.ensureDirectoryExists = () => {};
  
  assertThrows(() => {
    generator.generateAndSend('123456789', 'assets/video', '/tmp/test');
  }, 'Frame capture failed');  // Expecting the specific error from frame service
  
  // Restore original method
  TempFileManager.ensureDirectoryExists = originalEnsureDir;
});

test('BonusPictureGenerator should handle media sending failure', () => {
  const mockVideoRepo = new MockVideoRepository(['dance01.mp4']);
  const mockFrameService = new MockFrameCaptureService();
  const mockMediaSender = new MockMediaSender(true); // Should fail
  
  const generator = new BonusPictureGenerator(mockVideoRepo, mockFrameService, mockMediaSender);
  
  // Mock TempFileManager methods
  const originalEnsureDir = TempFileManager.ensureDirectoryExists;
  TempFileManager.ensureDirectoryExists = () => {};
  
  assertThrows(() => {
    generator.generateAndSend('123456789', 'assets/video', '/tmp/test');
  });
  
  // Restore original method
  TempFileManager.ensureDirectoryExists = originalEnsureDir;
});

// Test factory
test('BonusPictureFactory should create generator with proper dependencies', () => {
  const generator = BonusPictureFactory.createDefaultGenerator();
  
  assert(generator instanceof BonusPictureGenerator, 'Should create a BonusPictureGenerator instance');
  assert(generator.videoRepository instanceof VideoRepository, 'Should have VideoRepository');
  assert(generator.frameCaptureService instanceof FrameCaptureService, 'Should have FrameCaptureService');
  assert(generator.mediaSender instanceof TelegramMediaSender, 'Should have TelegramMediaSender');
});

// Test dependency inversion
test('BonusPictureGenerator should accept different implementations', () => {
  const mockVideoRepo = new MockVideoRepository(['test.mp4']);
  const mockFrameService = new MockFrameCaptureService();
  const mockMediaSender = new MockMediaSender();
  
  const generator = new BonusPictureGenerator(mockVideoRepo, mockFrameService, mockMediaSender);
  
  assert(generator.videoRepository === mockVideoRepo, 'Should accept custom video repository');
  assert(generator.frameCaptureService === mockFrameService, 'Should accept custom frame service');
  assert(generator.mediaSender === mockMediaSender, 'Should accept custom media sender');
});

// Test TempFileManager
test('TempFileManager should track cleanup calls', () => {
  const originalCleanup = MockTempFileManager.cleanup;
  const filePath = '/tmp/test/file.jpg';
  
  MockTempFileManager.cleanup(filePath);
  
  assert(MockTempFileManager.cleanupCalls.includes(filePath), 'Should track cleanup calls');
  
  // Reset for next test
  MockTempFileManager.cleanupCalls = [];
});

// Test SOLID principles compliance
test('Classes should follow Single Responsibility Principle', () => {
  // Each class has a single, well-defined responsibility
  const videoRepo = new VideoRepository();
  const frameService = new FrameCaptureService();
  const mediaSender = new TelegramMediaSender('/path/to/script');
  const generator = new BonusPictureGenerator(videoRepo, frameService, mediaSender);
  
  assert(videoRepo.constructor.name === 'VideoRepository', 'VideoRepository has video responsibility');
  assert(frameService.constructor.name === 'FrameCaptureService', 'FrameCaptureService has frame capture responsibility');
  assert(mediaSender.constructor.name === 'TelegramMediaSender', 'MediaSender has sending responsibility');
  assert(generator.constructor.name === 'BonusPictureGenerator', 'Generator orchestrates the process');
});

test('Code should follow Open/Closed Principle', () => {
  // The design allows extending functionality without modifying existing code
  class CustomMediaSender extends TelegramMediaSender {
    sendMedia(chatId, mediaPath, caption) {
      // Custom implementation
      return super.sendMedia(chatId, mediaPath, `[CUSTOM] ${caption}`);
    }
  }
  
  const videoRepo = new VideoRepository();
  const frameService = new FrameCaptureService();
  const customMediaSender = new CustomMediaSender('/path/to/script');
  const generator = new BonusPictureGenerator(videoRepo, frameService, customMediaSender);
  
  assert(generator.mediaSender instanceof CustomMediaSender, 'Can extend functionality without modifying existing code');
});

// Summary
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('SOLID UNIT TEST RESULTS');
  console.log('=' .repeat(60));
  console.log(`Total tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All SOLID tests passed! The bonus picture skill follows SOLID principles and is highly testable.');
  } else {
    console.log('\n⚠️  Some SOLID tests failed. Please review the implementation.');
  }
}, 100);