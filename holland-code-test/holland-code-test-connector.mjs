#!/usr/bin/env node

/**
 * Connector script for the Holland Code (RIASEC) Test skill
 * This script processes commands received from Clawdbot's /holland or /riasec command
 */

import { execSync } from 'child_process';
import { join } from 'path';
import HollandCodeTest from './holland-code-test.mjs';

// Get the command arguments passed from Clawdbot
const [, , userId, command, ...rest] = process.argv;

// Initialize the test manager
const testManager = new HollandCodeTest();

if (!command || command.toLowerCase() === 'help') {
  console.log(`
Holland Code (RIASEC) Career Interest Test

Usage:
  /holland start                    Start the test (48 questions, rate 1-5)
  /holland progress                 Show current progress
  /holland results                  Show your test results
  /holland answer <rating>          Answer the current question with a rating (1-5)
  /holland help                     Show this help message

About:
  This test measures your interest in six career-related themes:
  R - Realistic (hands-on, practical work)
  I - Investigative (research, analysis)
  A - Artistic (creative expression)
  S - Social (helping, teaching)
  E - Enterprising (leadership, sales)
  C - Conventional (organized, systematic work)
  
  Rate each statement from 1 (strongly dislike) to 5 (strongly enjoy)
  `);
  process.exit(0);
}

try {
  const cmd = command.toLowerCase();
  
  switch(cmd) {
    case 'start':
      const question = testManager.startTest(userId);
      if (question) {
        console.log(`Question ${question.current}/${question.total}:`);
        console.log(`"${question.text}"`);
        console.log("");
        console.log("Please rate this statement from 1 (dislike) to 5 (enjoy).");
        console.log("Use: /holland answer <rating>");
      } else {
        console.log("Error starting the test.");
      }
      break;
      
    case 'progress':
      const progress = testManager.getProgress();
      if (progress.isComplete) {
        console.log("✅ Test completed!");
        console.log(`Completed ${progress.totalQuestions}/${progress.totalQuestions} questions.`);
        console.log("Use '/holland results' to see your results.");
      } else if (progress.currentIndex > 0) {
        console.log(`📊 Progress: ${progress.answered}/${progress.totalQuestions} questions answered`);
        console.log(`Current question: ${progress.currentIndex}/${progress.totalQuestions}`);
      } else {
        console.log("No active test in progress. Use '/holland start' to begin.");
      }
      break;
      
    case 'results':
      const results = testManager.getResults();
      if (!results) {
        console.log("No completed test found. Please finish the test first.");
        console.log("Use '/holland progress' to check your current status.");
      } else {
        console.log("🏆 Your Holland Code (RIASEC) Test Results:");
        console.log("");
        
        // Display the top 3 categories
        console.log("Top 3 Categories:");
        results.topThree.forEach((cat, index) => {
          const categoryName = {
            'R': 'Realistic',
            'I': 'Investigative', 
            'A': 'Artistic',
            'S': 'Social',
            'E': 'Enterprising',
            'C': 'Conventional'
          }[cat.category];
          
          console.log(`${index + 1}. ${cat.category} (${categoryName}): ${cat.score} points`);
        });
        
        console.log("");
        console.log("All Category Scores:");
        for (const [category, score] of Object.entries(results.categoryScores)) {
          const categoryName = {
            'R': 'Realistic',
            'I': 'Investigative', 
            'A': 'Artistic',
            'S': 'Social',
            'E': 'Enterprising',
            'C': 'Conventional'
          }[category];
          
          console.log(`${category} (${categoryName}): ${score} points`);
        }
        
        console.log("");
        console.log(`Test completed on: ${new Date(results.completedAt).toLocaleDateString()}`);
      }
      break;
      
    case 'answer':
      // Process an answer to the current question
      if (rest.length === 0) {
        console.log("Please provide a rating from 1 to 5.");
        console.log("Example: /holland answer 3");
        break;
      }
      
      const rating = parseInt(rest[0]);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        console.log("Rating must be a number between 1 and 5.");
        console.log("Example: /holland answer 3");
        break;
      }
      
      // Get the current question ID based on the index
      const currentQuestionId = testManager.getCurrentQuestionNumber(); // This returns the 1-based index
      
      try {
        const nextQuestion = testManager.submitAnswer(currentQuestionId, rating);
        
        if (nextQuestion) {
          // There's another question to ask
          console.log(`✅ Answer recorded!`);
          console.log(`Question ${nextQuestion.current}/${nextQuestion.total}:`);
          console.log(`"${nextQuestion.text}"`);
          console.log("");
          console.log("Please rate this statement from 1 (dislike) to 5 (enjoy).");
          console.log("Use: /holland answer <rating>");
        } else {
          // Test is complete
          console.log("🎉 Congratulations! You've completed the Holland Code (RIASEC) Test!");
          console.log("Use '/holland results' to see your personalized career interest profile.");
        }
      } catch (error) {
        console.log(`Error recording answer: ${error.message}`);
      }
      break;
      
    default:
      console.log(`Unknown command: ${cmd}`);
      console.log("Use '/holland help' for available commands.");
  }

} catch (error) {
  console.error(`Error executing holland code test command: ${error.message}`);
  process.exit(1);
}