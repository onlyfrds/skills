---
name: bonus-picture
description: Capture a random video frame from nekochan videos and send to user via Telegram
user-invocable: true
---

# Bonus Picture Skill

A skill for capturing random frames from nekochan videos and sending them via Telegram.

## Description

This skill randomly selects a video with filename contains word `dance` from the assets/video directory, captures a frame from it, saves it to a temporary folder with a random filename, and then sends it to the user via Telegram.

## Implementation

When the user requests a bonus picture:
1. Execute the bonus picture script: `nodejs {baseDir}/scripts/solid_bonus_picture.mjs [USER_CHAT_ID]`
2. The script will:
   - Randomly select a video file from assets/video that contains 'dance' in the filename
   - Use ffmpeg to capture a random frame from the selected video
   - Save the frame to /tmp/moltbot with a random filename
   - Use telegram-media-send skill to send the image to the user
   - Clean up the temporary file after successful sending

## Usage

When the user says "send me a bonus picture", "more bonus pictures", or similar requests:
- Execute: `exec command="nodejs {baseDir}/scripts/solid_bonus_picture.mjs [USER_CHAT_ID]"`
- The script will handle finding video files in assets/video
- Randomly select one video containing 'dance'
- Extract a random frame using ffmpeg
- Send via telegram-media-send skill
- Clean up temporary file after successful send

## Dependencies

- ffmpeg: for extracting frames from videos
- nodejs: to run the bonus picture script
- telegram-media-send skill: for sending images via Telegram
- assets/video/: directory containing dance videos

## Error Handling

- Handle cases where no dance videos are found
- Handle ffmpeg errors during frame extraction
- Handle file permission issues
- Handle Telegram API errors during sending
