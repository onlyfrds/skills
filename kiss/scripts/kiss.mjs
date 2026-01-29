#!/usr/bin/env node

/**
 * Script to send virtual kisses to users
 */

// Array of cute kiss messages
const kissMessages = [
  "💋 *flies over and gently kisses your cheek* Here's a sweet kiss for you! 😘",
  "💕 Coming right up! *gives you a warm hug and a gentle kiss on the forehead* You deserve all the love! 💖",
  "💋✨ *lightly pecks your lips* A tender kiss just for you! Hope it brightens your day! 😚",
  "😘 *sends a flying kiss through the screen* Love you lots! ✨",
  "😗 *gives you a gentle smooch* You're amazing and deserve all the affection! 💕",
  "💋 *places a soft kiss on your hand* Feeling loved and appreciated today! 💗",
  "😚 *kisses your nose gently* You're absolutely adorable! 😊💖",
  "😙 *gives you a sweet peck* Hope this makes you smile! 💞",
  "😽 *cat-like affection* Purr... you're totally awesome! 😻💕",
  "💋 *teleports a kiss to you* Across space and time, spreading love! 🌟💖"
];

/**
 * Function to generate a random kiss message
 */
function getRandomKissMessage() {
  const randomIndex = Math.floor(Math.random() * kissMessages.length);
  return kissMessages[randomIndex];
}

/**
 * Function to generate a specific type of kiss based on context
 */
function getKissMessage(context = 'general') {
  switch(context.toLowerCase()) {
    case 'morning':
      return "🌅 Good morning! ☀️ *gives you a sweet morning kiss* Rise and shine, beautiful! 💖";
    case 'night':
      return "🌙 Sweet dreams! 🌜 *gently kisses your forehead* Sleep tight, lovely! 💤💕";
    case 'comfort':
      return "🤗 *wraps you in a warm hug and gives a soothing kiss* Everything will be okay! You're strong! 💪💖";
    case 'celebration':
      return "🎉 Hooray! 🎊 *showered with kisses* Celebrating YOU! So proud of you! 🥳💋";
    default:
      return getRandomKissMessage();
  }
}

// Main execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [, , context] = process.argv;
  const message = getKissMessage(context || 'general');
  console.log(message);
}

export { getRandomKissMessage, getKissMessage, kissMessages };