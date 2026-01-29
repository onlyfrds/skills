# Holland Code (RIASEC) Test Skill

## Description
Implements the Holland Code (RIASEC) career interest test with 48 questions that assess user interests in six career-related themes: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.

## Commands
- `/holland start` - Begin the 48-question test
- `/holland progress` - Check current test progress
- `/holland results` - View completed test results
- `/holland help` - Show help information

## Features
- Asks 48 questions one by one
- Allows users to rate each statement from 1 (dislike) to 5 (enjoy)
- Calculates scores for each of the six RIASEC categories
- Shows personalized career interest profile
- Tracks progress and allows resuming tests

## Files
- `holland-code-test.mjs` - Main implementation
- `holland-code-test-connector.mjs` - Command interface
- `questions.json` - Question bank
- `current-test.json` - Active test state
- `test-data.json` - Historical results (future use)

## Dependencies
None beyond standard Node.js libraries

## Author
Created based on the todo skill structure