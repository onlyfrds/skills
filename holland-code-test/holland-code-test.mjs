import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

class HollandCodeTest {
  constructor(workspaceDir = '/home/neo/bot-nekochan') {
    this.workspaceDir = workspaceDir;
    this.testDataFile = join(workspaceDir, 'skills', 'holland-code-test', 'test-data.json');
    this.questionsFile = join(workspaceDir, 'skills', 'holland-code-test', 'questions.json');
    this.currentTestFile = join(workspaceDir, 'skills', 'holland-code-test', 'current-test.json');
    
    // Load questions and initialize
    this.loadQuestions();
    this.loadCurrentTestState();
  }

  loadQuestions() {
    if (existsSync(this.questionsFile)) {
      try {
        const data = readFileSync(this.questionsFile, 'utf8');
        this.questions = JSON.parse(data);
      } catch (error) {
        console.error('Error loading questions:', error.message);
        this.initializeDefaultQuestions();
      }
    } else {
      this.initializeDefaultQuestions();
    }
  }

  initializeDefaultQuestions() {
    // Define the 48 RIASEC questions
    this.questions = [
      // Realistic (R) - 8 questions
      { id: 1, text: "I would enjoy working with tools and machines.", category: "R" },
      { id: 2, text: "I would enjoy building or fixing things.", category: "R" },
      { id: 3, text: "I would enjoy outdoor work.", category: "R" },
      { id: 4, text: "I would enjoy working with my hands.", category: "R" },
      { id: 5, text: "I would enjoy working with animals.", category: "R" },
      { id: 6, text: "I would enjoy working with plants or crops.", category: "R" },
      { id: 7, text: "I would enjoy operating mechanical equipment.", category: "R" },
      { id: 8, text: "I would enjoy working in construction.", category: "R" },
      
      // Investigative (I) - 8 questions
      { id: 9, text: "I would enjoy conducting scientific experiments.", category: "I" },
      { id: 10, text: "I would enjoy researching new ideas.", category: "I" },
      { id: 11, text: "I would enjoy analyzing data or statistics.", category: "I" },
      { id: 12, text: "I would enjoy solving complex problems.", category: "I" },
      { id: 13, text: "I would enjoy studying how things work.", category: "I" },
      { id: 14, text: "I would enjoy working in a laboratory.", category: "I" },
      { id: 15, text: "I would enjoy writing research reports.", category: "I" },
      { id: 16, text: "I would enjoy working with numbers and calculations.", category: "I" },
      
      // Artistic (A) - 8 questions
      { id: 17, text: "I would enjoy creating artwork.", category: "A" },
      { id: 18, text: "I would enjoy writing creative stories or poems.", category: "A" },
      { id: 19, text: "I would enjoy designing clothing or fashion.", category: "A" },
      { id: 20, text: "I would enjoy playing a musical instrument.", category: "A" },
      { id: 21, text: "I would enjoy directing plays or films.", category: "A" },
      { id: 22, text: "I would enjoy interior design.", category: "A" },
      { id: 23, text: "I would enjoy photography.", category: "A" },
      { id: 24, text: "I would enjoy working in theater or drama.", category: "A" },
      
      // Social (S) - 8 questions
      { id: 25, text: "I would enjoy teaching others.", category: "S" },
      { id: 26, text: "I would enjoy counseling people with personal problems.", category: "S" },
      { id: 27, text: "I would enjoy working with children.", category: "S" },
      { id: 28, text: "I would enjoy helping people improve their lives.", category: "S" },
      { id: 29, text: "I would enjoy working in healthcare.", category: "S" },
      { id: 30, text: "I would enjoy training others in new skills.", category: "S" },
      { id: 31, text: "I would enjoy working with elderly people.", category: "S" },
      { id: 32, text: "I would enjoy working in social services.", category: "S" },
      
      // Enterprising (E) - 8 questions
      { id: 33, text: "I would enjoy selling products or services.", category: "E" },
      { id: 34, text: "I would enjoy managing a business.", category: "E" },
      { id: 35, text: "I would enjoy persuading others to do something.", category: "E" },
      { id: 36, text: "I would enjoy negotiating business deals.", category: "E" },
      { id: 37, text: "I would enjoy promoting new ideas or products.", category: "E" },
      { id: 38, text: "I would enjoy leading a team or organization.", category: "E" },
      { id: 39, text: "I would enjoy working in marketing.", category: "E" },
      { id: 40, text: "I would enjoy working in politics or government.", category: "E" },
      
      // Conventional (C) - 8 questions
      { id: 41, text: "I would enjoy working with numbers and records.", category: "C" },
      { id: 42, text: "I would enjoy organizing files and records.", category: "C" },
      { id: 43, text: "I would enjoy following established procedures.", category: "C" },
      { id: 44, text: "I would enjoy working with computers for data processing.", category: "C" },
      { id: 45, text: "I would enjoy bookkeeping or accounting.", category: "C" },
      { id: 46, text: "I would enjoy working in an office setting.", category: "C" },
      { id: 47, text: "I would enjoy working with forms and paperwork.", category: "C" },
      { id: 48, text: "I would enjoy scheduling and planning activities.", category: "C" }
    ];
    
    // Save questions to file
    this.saveQuestions();
  }

  saveQuestions() {
    try {
      writeFileSync(this.questionsFile, JSON.stringify(this.questions, null, 2));
    } catch (error) {
      console.error('Error saving questions:', error.message);
      throw error;
    }
  }

  loadCurrentTestState() {
    if (existsSync(this.currentTestFile)) {
      try {
        const data = readFileSync(this.currentTestFile, 'utf8');
        this.currentTest = JSON.parse(data);
      } catch (error) {
        console.error('Error loading current test state:', error.message);
        this.resetCurrentTest();
      }
    } else {
      this.resetCurrentTest();
    }
  }

  resetCurrentTest() {
    this.currentTest = {
      userId: null,
      answers: {},
      currentIndex: 0,
      isComplete: false,
      startedAt: null,
      completedAt: null
    };
  }

  saveCurrentTest() {
    try {
      writeFileSync(this.currentTestFile, JSON.stringify(this.currentTest, null, 2));
    } catch (error) {
      console.error('Error saving current test state:', error.message);
      throw error;
    }
  }

  startTest(userId) {
    this.currentTest = {
      userId: userId,
      answers: {},
      currentIndex: 0,
      isComplete: false,
      startedAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.saveCurrentTest();
    
    return this.getNextQuestion();
  }

  getNextQuestion() {
    if (this.currentTest.isComplete) {
      return null;
    }
    
    if (this.currentTest.currentIndex >= this.questions.length) {
      this.completeTest();
      return null;
    }
    
    const question = this.questions[this.currentTest.currentIndex];
    
    return {
      id: question.id,
      text: question.text,
      current: this.currentTest.currentIndex + 1,
      total: this.questions.length,
      answered: Object.keys(this.currentTest.answers).length
    };
  }

  submitAnswer(questionId, rating) {
    // Validate rating (should be between 1 and 5)
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error("Rating must be an integer between 1 and 5");
    }
    
    // Validate question ID exists
    const questionExists = this.questions.some(q => q.id === questionId);
    if (!questionExists) {
      throw new Error(`Question with ID ${questionId} does not exist`);
    }
    
    // Store the answer
    this.currentTest.answers[questionId] = rating;
    
    // Move to next question
    this.currentTest.currentIndex++;
    
    // Check if test is complete
    if (this.currentTest.currentIndex >= this.questions.length) {
      this.completeTest();
    }
    
    this.saveCurrentTest();
    
    return this.getNextQuestion();
  }

  completeTest() {
    this.currentTest.isComplete = true;
    this.currentTest.completedAt = new Date().toISOString();
    
    // Save to historical data
    this.saveToHistory();
    
    this.saveCurrentTest();
  }

  saveToHistory() {
    // Load existing historical data
    let historicalTests = [];
    if (existsSync(this.testDataFile)) {
      try {
        const data = readFileSync(this.testDataFile, 'utf8');
        historicalTests = JSON.parse(data);
      } catch (error) {
        console.error('Error loading historical test data:', error.message);
      }
    }
    
    // Add current test to historical data
    const completedTest = {
      ...this.currentTest,
      id: Date.now(), // Unique identifier for this test instance
      userId: this.currentTest.userId,
      results: this.calculateResults()
    };
    
    historicalTests.push(completedTest);
    
    // Save updated historical data
    try {
      writeFileSync(this.testDataFile, JSON.stringify(historicalTests, null, 2));
    } catch (error) {
      console.error('Error saving historical test data:', error.message);
    }
  }

  getResults() {
    if (!this.currentTest.isComplete) {
      return null;
    }
    
    return this.calculateResults();
  }

  calculateResults() {
    // Calculate scores for each category
    const categoryScores = {
      R: 0, // Realistic
      I: 0, // Investigative
      A: 0, // Artistic
      S: 0, // Social
      E: 0, // Enterprising
      C: 0  // Conventional
    };
    
    // Sum up ratings for each category
    for (const [questionId, rating] of Object.entries(this.currentTest.answers)) {
      const question = this.questions.find(q => q.id === parseInt(questionId));
      if (question) {
        categoryScores[question.category] += rating;
      }
    }
    
    // Sort categories by score (descending)
    const sortedCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .map(([category, score]) => ({ category, score }));
    
    return {
      overallScore: Object.values(categoryScores),
      categoryScores: categoryScores,
      sortedCategories: sortedCategories,
      topThree: sortedCategories.slice(0, 3),
      startedAt: this.currentTest.startedAt,
      completedAt: this.currentTest.completedAt
    };
  }

  getProgress() {
    return {
      currentIndex: this.currentTest.currentIndex,
      totalQuestions: this.questions.length,
      answered: Object.keys(this.currentTest.answers).length,
      isComplete: this.currentTest.isComplete
    };
  }

  getCurrentQuestionNumber() {
    return this.currentTest.currentIndex + 1;
  }

  isTestInProgress() {
    return this.currentTest.currentIndex > 0 && !this.currentTest.isComplete;
  }
}

// Export the class for use in other modules
export default HollandCodeTest;