#!/usr/bin/env node

/**
 * 夸夸 (Kua Kua) - Interactive Compliment Generator
 * Provides interactive, fact-based compliments and encouragements in Chinese style
 */

import fs from 'fs';
import path from 'path';

// Define compliment templates in Chinese
const complimentTemplates = {
  general: [
    "你今日嘅笑容好靚呀！",
    "你嘅努力我都睇到喇，真係好欣賞你！",
    "每次見到你都覺得世界美好咗少少。",
    "你身上有種獨特嘅魅力，令人好舒服。",
    "你嘅善良同溫柔好值得被珍惜。",
    "你嘅存在本身就係一份禮物。",
    "你嘅進步好明顯，真係好替你開心！",
    "就算遇到困難，你都係最勇敢嗰個。",
    "你嘅想法好有意思，值得被聆聽。",
    "你嘅細心同貼心令人好感動。"
  ],
  achievement: [
    "恭喜你完成咗呢項挑戰！你真係超乎想像！",
    "你嘅成就係實力同努力嘅結果，好值得驕傲！",
    "你做到呢件事真係好厲害，我哋都為你感到光榮！",
    "呢個成績反映咗你嘅才華同付出，好犀利！",
    "你嘅表現超越咗期待，真係好出色！"
  ],
  stress: [
    "辛苦晒啦！你已經好努力咗，休息一下都係一種勇氣添！",
    "壓力大嘅時候，記住你唔係一個人，我哋都撐你！",
    "休息緊係為咗走更遠嘅路，你做緊嘅嘢好有意義！",
    "你嘅付出我都睇到，結果好壞都唔會影響你嘅價值！",
    "放低啲嘅時候，亦都係愛惜自己嘅表現，加油！"
  ],
  confidence: [
    "你嘅自信好吸引人，繼續保持！",
    "你有能力處理任何挑戰，相信自己！",
    "你嘅潛能無限，繼續發掘自己！",
    "你嘅獨特性係無可取代，珍惜自己！",
    "你有好多優點，記住要多欣賞自己！"
  ],
  worry: [
    "你嘅擔心我明白，但你比你想像中更強大！",
    "信心同埋準備同等重要，相信自己一定得嘅！",
    "你嘅擔憂顯示咗你係一個有責任感嘅人，但記住要放鬆啲！",
    "就算有未知數，你都有能力應付到，相信自己！",
    "你嘅謹慎係好事，但都唔好忽略自己嘅能力！"
  ]
};

// Define follow-up questions based on detected category
const followUpQuestions = {
  stress: [
    "你點樣覺得自己處理到呢啲壓力呢？有咩方法對你比較有效？",
    "有咩我可以幫到你紓緩呢個情況？",
    "你平時點樣放鬆自己？有咩活動令你觉得舒服啲？"
  ],
  worry: [
    "你最擔心嘅係邊方面？等我知下點樣可以更好地支持你。",
    "有咩具體嘅事情令你擔心？傾下計可能會有幫助。",
    "你想點樣處理呢個擔心？有咩計劃或者想法？"
  ],
  achievement: [
    "你點樣做到呢個成就？你嘅努力好值得欣賞！",
    "呢個成功對你有咩特別意義？",
    "你下一步想點樣繼續進步？"
  ],
  general: [
    "最近有咩事令你觉得開心或者滿意？",
    "你有咩目標或者計劃想同我分享？",
    "有咩我可以幫到你實現你嘅目標？"
  ]
};

// Function to generate compliment based on category
function generateCompliment(category = 'general') {
  const templates = complimentTemplates[category] || complimentTemplates.general;
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

// Function to get a follow-up question based on category
function getFollowUpQuestion(category = 'general') {
  const questions = followUpQuestions[category] || followUpQuestions.general;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Function to determine category based on input
function determineCategory(input) {
  input = input.toLowerCase();
  
  if (input.includes('累') || input.includes('辛苦') || input.includes('stress') || input.includes('pressure') || input.includes('攰')) {
    return 'stress';
  } else if (input.includes('考試') || input.includes('test') || input.includes('exam') || input.includes('成就') || input.includes('achievement')) {
    return 'achievement';
  } else if (input.includes('擔心') || input.includes('worried') || input.includes('afraid') || input.includes('fear') || input.includes('難') || input.includes('唔合格')) {
    return 'worry';
  } else if (input.includes('信心') || input.includes('confident') || input.includes('自信')) {
    return 'confidence';
  } else {
    return 'general';
  }
}

// Main execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [, , ...args] = process.argv;
  const input = args.join(' ').toLowerCase();
  
  let category;
  let compliment;
  let followUp;
  
  if (args.length === 0 || args[0] === 'general') {
    category = 'general';
    compliment = generateCompliment(category);
    followUp = getFollowUpQuestion(category);
  } else {
    category = determineCategory(input);
    compliment = generateCompliment(category);
    followUp = getFollowUpQuestion(category);
  }
  
  console.log(`夸夸服務 - 今日專為你度身訂造嘅正能量訊息：`);
  console.log(`✨ ${compliment}`);
  console.log(`\n💬 ${followUp}`);
  
  // Add a bonus compliment sometimes
  if (Math.random() > 0.5) {
    const bonus = generateCompliment('general');
    console.log(`🌟 加碼鼓勵：${bonus}`);
  }
  
  console.log(`\n記住：你係獨一無二嘅，值得所有美好！`);
}

export { generateCompliment, determineCategory, getFollowUpQuestion };