# Holland Code (RIASEC) Test Skill

This skill implements the Holland Code (RIASEC) career interest test, which assesses users' interests in six career-related themes:

- **R - Realistic**: Hands-on, practical work involving tools, machines, and physical activity
- **I - Investigative**: Research, analysis, and scientific work requiring intellectual problem-solving
- **A - Artistic**: Creative expression through art, music, writing, and design
- **S - Social**: Helping, teaching, and caring for others
- **E - Enterprising**: Leadership, sales, and business management
- **C - Conventional**: Organized, systematic work with data, records, and procedures

## Usage

```
/holland start     - Begin the 48-question test
/holland progress  - Check your current progress
/holland results   - View your completed test results
/holland help      - Show help information
```

## How It Works

1. The test presents 48 questions, one at a time
2. Users rate each statement from 1 (strongly dislike) to 5 (strongly enjoy)
3. After completing all questions, the system calculates scores for each of the six categories
4. Results show the top three categories that match the user's interests

## Implementation Details

- Questions are stored in `questions.json`
- Current test state is saved in `current-test.json`
- Results are calculated by summing ratings for each category
- The system tracks progress and allows users to resume tests

## File Structure

- `holland-code-test.mjs`: Main class implementation
- `holland-code-test-connector.mjs`: Command connector
- `questions.json`: Question bank with 48 items
- `current-test.json`: Current test state storage
- `test-data.json`: (Future) Historical test results