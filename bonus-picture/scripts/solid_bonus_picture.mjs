#!/usr/bin/env node

/**
 * SOLID-compliant Bonus Picture Generator
 * Following Single Responsibility Principle, Open/Closed Principle, etc.
 */

import { readdirSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { randomUUID } from 'crypto';

/**
 * Interface for Video Repository
 */
class VideoRepositoryInterface {
  getRandomVideo(directory) {
    throw new Error('Method getRandomVideo must be implemented');
  }
}

/**
 * Concrete implementation of Video Repository
 */
class VideoRepository extends VideoRepositoryInterface {
  getRandomVideo(directory) {
    const files = this._getVideoFiles(directory);
    const danceFiles = files.filter(file => file.toLowerCase().includes('dance') && file.endsWith('.mp4'));

    if (danceFiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * danceFiles.length);
      return danceFiles[randomIndex];
    }

    if (files.length === 0) {
      throw new Error('No video files found in directory');
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    return files[randomIndex];
  }

  _getVideoFiles(directory) {
    return readdirSync(directory).filter(file => file.endsWith('.mp4'));
  }
}

/**
 * Interface for Frame Capture Service
 */
class FrameCaptureServiceInterface {
  captureFrame(videoPath, outputPath) {
    throw new Error('Method captureFrame must be implemented');
  }
}

/**
 * Concrete implementation of Frame Capture Service
 */
class FrameCaptureService extends FrameCaptureServiceInterface {
  captureFrame(videoPath, outputPath) {
    const duration = this._getVideoDuration(videoPath);
    const randomTime = this._generateRandomTime(duration);
    const formattedTime = this._formatTime(randomTime);
    
    const command = `ffmpeg -ss ${formattedTime} -i "${videoPath}" -vframes 1 -q:v 2 "${outputPath}" -y`;
    execSync(command, { stdio: 'pipe' });
    
    return outputPath;
  }

  _getVideoDuration(videoPath) {
    const durationResult = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`, { encoding: 'utf8' });
    return parseFloat(durationResult.trim());
  }

  _generateRandomTime(duration) {
    const startTime = 2;
    const endTime = Math.max(startTime, duration - 2);
    return Math.random() * (endTime - startTime) + startTime;
  }

  _formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${(seconds + (timeInSeconds % 1)).toFixed(3).padStart(6, '0')}`;
  }
}

/**
 * Interface for Media Sender
 */
class MediaSenderInterface {
  sendMedia(chatId, mediaPath, caption) {
    throw new Error('Method sendMedia must be implemented');
  }
}

/**
 * Concrete implementation of Telegram Media Sender
 */
class TelegramMediaSender extends MediaSenderInterface {
  constructor(telegramScriptPath) {
    super();
    this.telegramScriptPath = telegramScriptPath;
  }

  sendMedia(chatId, mediaPath, caption) {
    const sendCommand = `nodejs ${this.telegramScriptPath} ${chatId} "${mediaPath}" "${caption}"`;
    execSync(sendCommand, { stdio: 'inherit' });
    return true;
  }
}

/**
 * Temporary File Manager for cleanup operations
 */
class TempFileManager {
  static ensureDirectoryExists(dirPath) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  static cleanup(filePath) {
    try {
      unlinkSync(filePath);
      console.log(`Cleaned up temporary file: ${filePath}`);
    } catch (cleanupError) {
      console.error(`Failed to clean up temporary file: ${cleanupError.message}`);
    }
  }
}

/**
 * Interface for File System Operations
 */
class FileSystemInterface {
  existsSync(path) {
    throw new Error('Method existsSync must be implemented');
  }
  
  ensureDirectoryExists(dirPath) {
    throw new Error('Method ensureDirectoryExists must be implemented');
  }
}

/**
 * Concrete implementation of File System Operations
 */
class FileSystemManager extends FileSystemInterface {
  existsSync(path) {
    return existsSync(path);
  }
  
  ensureDirectoryExists(dirPath) {
    if (!this.existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }
}

/**
 * Main Bonus Picture Generator Service
 * Following Dependency Inversion Principle by depending on abstractions
 */
class BonusPictureGenerator {
  constructor(videoRepository, frameCaptureService, mediaSender, fileSystemManager = null) {
    this.videoRepository = videoRepository;
    this.frameCaptureService = frameCaptureService;
    this.mediaSender = mediaSender;
    this.fileSystemManager = fileSystemManager || new FileSystemManager();
  }

  generateAndSend(chatId, videoDir = 'assets/video', tempDir = '/tmp/moltbot') {
    try {
      // Ensure temp directory exists
      this.fileSystemManager.ensureDirectoryExists(tempDir);
      
      // Select random video
      const randomVideo = this.videoRepository.getRandomVideo(videoDir);
      const videoPath = join(process.cwd(), videoDir, randomVideo);
      
      // Create random filename for the captured frame
      const randomFilename = `bonus_${randomUUID()}.jpg`;
      const outputPath = join(tempDir, randomFilename);
      
      console.log(`Selecting random video: ${randomVideo}`);
      console.log(`Capturing frame to: ${outputPath}`);
      
      // Capture random frame from video
      this.frameCaptureService.captureFrame(videoPath, outputPath);
      
      if (!this.fileSystemManager.existsSync(outputPath)) {
        throw new Error('Failed to capture frame from video');
      }
      
      console.log(`Successfully captured frame: ${outputPath}`);
      
      // Send via media sender
      const caption = `Bonus nekochan picture! From: ${randomVideo}`;
      this.mediaSender.sendMedia(chatId, outputPath, caption);
      
      console.log('Bonus picture sent successfully!');
      
      // Schedule cleanup of the temporary file after sending
      setTimeout(() => {
        TempFileManager.cleanup(outputPath);
      }, 5000); // Wait 5 seconds before cleaning up
      
      return { success: true, videoUsed: randomVideo, imagePath: outputPath };
    } catch (error) {
      console.error('Error in bonus picture generation:', error.message);
      throw error;
    }
  }
}

/**
 * Factory class to create services with their dependencies
 */
class BonusPictureFactory {
  static createDefaultGenerator(telegramScriptPath = `${process.cwd()}/skills/telegram-media-send/scripts/send_telegram_media.mjs`) {
    const videoRepository = new VideoRepository();
    const frameCaptureService = new FrameCaptureService();
    const mediaSender = new TelegramMediaSender(telegramScriptPath);
    
    return new BonusPictureGenerator(videoRepository, frameCaptureService, mediaSender);
  }
}

// Main execution
console.log('Script executed with args:', process.argv.slice(0, 3));
console.log('Checking if main module:', process.argv[1], 'vs', new URL(import.meta.url).pathname);
console.log('Condition result:', process.argv[1] === new URL(import.meta.url).pathname);

// Fixed condition to handle path differences
const isMain = process.argv[1].endsWith('solid_bonus_picture.mjs');

if (isMain) {
  const [, , chatId] = process.argv;

  if (!chatId) {
    console.log(`
Bonus Picture Generator (SOLID Implementation)

Usage:
  solid_bonus_picture <chat_id>

Examples:
  solid_bonus_picture 8543893239
    `);
    process.exit(1);
  }

  console.log('Starting bonus picture generation with SOLID implementation...');
  console.log('Chat ID:', chatId);

  try {
    const generator = BonusPictureFactory.createDefaultGenerator();
    const result = generator.generateAndSend(chatId);
    console.log('Bonus picture generated and sent successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to generate and send bonus picture:', error.message);
    process.exit(1);
  }
}

// Export classes for testing
export {
  VideoRepository,
  FrameCaptureService,
  TelegramMediaSender,
  BonusPictureGenerator,
  BonusPictureFactory,
  TempFileManager
};