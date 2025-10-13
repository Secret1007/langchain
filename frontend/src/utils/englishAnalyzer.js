// 常见拼写错误字典
const SPELLING_CORRECTIONS = {
  'exprience': 'experience',
  'recieve': 'receive',
  'seperate': 'separate',
  'occured': 'occurred',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'acheive': 'achieve',
  'begining': 'beginning',
  'beleive': 'believe',
  'calender': 'calendar',
  'cemetary': 'cemetery',
  'concious': 'conscious',
  'embarass': 'embarrass',
  'existance': 'existence',
  'independant': 'independent',
  'occassion': 'occasion',
  'priviledge': 'privilege',
  'reccomend': 'recommend',
  'rythm': 'rhythm',
  'thier': 'their',
  'untill': 'until',
  'writting': 'writing'
};

// 常见语法规则
const GRAMMAR_RULES = [
  { pattern: /\binformations\b/gi, suggestion: "information", reason: "Uncountable noun: information (no plural)" },
  { pattern: /\bit's means\b/gi, suggestion: "it means", reason: "Remove apostrophe for possessive/verb form confusion" },
  { pattern: /\bvery\s+good\b/gi, suggestion: "great", reason: "Stronger, more natural word choice" },
  { pattern: /\bi am\s+very\s+happy\b/gi, suggestion: "I'm delighted", reason: "Natural, concise tone" },
  { pattern: /\bI have did\b/gi, suggestion: "I have done", reason: "Present perfect: have + past participle" },
  { pattern: /\ba\s+apple\b/gi, suggestion: "an apple", reason: "Use 'an' before vowel sounds" },
  { pattern: /\ban\s+book\b/gi, suggestion: "a book", reason: "Use 'a' before consonant sounds" },
  { pattern: /\bthey is\b/gi, suggestion: "they are", reason: "Subject-verb agreement" },
  { pattern: /\bhe go\b/gi, suggestion: "he goes", reason: "Third person singular verb form" },
  { pattern: /\bdont\b/gi, suggestion: "don't", reason: "Contraction needs apostrophe" },
  { pattern: /\bcant\b/gi, suggestion: "can't", reason: "Contraction needs apostrophe" },
  { pattern: /\bwont\b/gi, suggestion: "won't", reason: "Contraction needs apostrophe" },
];

// --- Pseudo AI revise & inline suggestions (mocked) ---
export function pseudoAnalyze(content) {
  const issues = [];
  
  // 拼写检查
  Object.entries(SPELLING_CORRECTIONS).forEach(([wrong, correct]) => {
    const pattern = new RegExp(`\\b${wrong}\\b`, 'gi');
    let match;
    while ((match = pattern.exec(content)) !== null) {
      issues.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        suggestion: correct,
        reason: `Spelling: ${correct}`,
        type: 'spelling'
      });
    }
  });
  
  // 语法规则检查
  GRAMMAR_RULES.forEach((rule) => {
    let match;
    while ((match = rule.pattern.exec(content)) !== null) {
      issues.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        suggestion: rule.suggestion,
        reason: rule.reason,
        type: 'grammar'
      });
    }
  });
  
  // 双空格检测
  let i = 0;
  while ((i = content.indexOf("  ", i)) !== -1) {
    issues.push({
      start: i,
      end: i + 2,
      text: "  ",
      suggestion: " ",
      reason: "Double space → single space",
      type: 'formatting'
    });
    i = i + 2;
  }
  
  return issues.sort((a, b) => a.start - b.start);
}

export function applySuggestion(content, issue) {
  return content.slice(0, issue.start) + issue.suggestion + content.slice(issue.end);
}

// 实时单词检查 - 检查当前输入的单词
export function checkCurrentWord(content, cursorPosition) {
  const beforeCursor = content.slice(0, cursorPosition);
  const afterCursor = content.slice(cursorPosition);
  
  // 获取当前单词
  const wordMatch = beforeCursor.match(/\b\w+$/);
  const currentWord = wordMatch ? wordMatch[0] : '';
  
  if (!currentWord) return null;
  
  // 检查拼写
  const corrected = SPELLING_CORRECTIONS[currentWord.toLowerCase()];
  if (corrected) {
    return {
      word: currentWord,
      suggestion: corrected,
      reason: `拼写错误：${corrected}`,
      type: 'spelling',
      position: cursorPosition - currentWord.length
    };
  }
  
  return null;
}

// 句子完整性检测 - 当输入标点符号时触发
export function checkSentenceCompleteness(content, cursorPosition) {
  const beforeCursor = content.slice(0, cursorPosition);
  const afterCursor = content.slice(cursorPosition);
  
  // 检测句子结束标点符号
  const sentenceEndings = /[.!?;]$/;
  if (!sentenceEndings.test(beforeCursor.trim())) {
    return null;
  }
  
  // 提取当前句子
  const sentences = beforeCursor.split(/[.!?;]/);
  const currentSentence = sentences[sentences.length - 1].trim();
  
  if (!currentSentence) return null;
  
  const issues = [];
  
  // 检查句子结构
  const words = currentSentence.split(/\s+/).filter(Boolean);
  
  // 检查句子长度
  if (words.length < 2) {
    issues.push({
      type: 'structure',
      message: '句子太短，可能需要更多内容',
      suggestion: '尝试添加更多词汇来完善句子'
    });
  }
  
  // 检查首字母大写
  if (currentSentence && currentSentence[0] !== currentSentence[0].toUpperCase()) {
    issues.push({
      type: 'capitalization',
      message: '句子应该以大写字母开头',
      suggestion: currentSentence[0].toUpperCase() + currentSentence.slice(1)
    });
  }
  
  // 检查常见语法错误
  GRAMMAR_RULES.forEach((rule) => {
    const match = currentSentence.match(rule.pattern);
    if (match) {
      issues.push({
        type: 'grammar',
        message: rule.reason,
        suggestion: currentSentence.replace(rule.pattern, rule.suggestion)
      });
    }
  });
  
  // 检查拼写
  words.forEach((word, index) => {
    const corrected = SPELLING_CORRECTIONS[word.toLowerCase()];
    if (corrected) {
      issues.push({
        type: 'spelling',
        message: `拼写错误：${word}`,
        suggestion: corrected,
        wordIndex: index
      });
    }
  });
  
  return {
    sentence: currentSentence,
    issues: issues,
    wordCount: words.length,
    isComplete: issues.length === 0
  };
}

// 实时输入分析 - 监听输入事件
export function analyzeRealTimeInput(content, cursorPosition, lastChar) {
  const results = {
    wordCheck: null,
    sentenceCheck: null,
    hasChanges: false
  };
  
  // 检查当前单词
  if (lastChar && /\w/.test(lastChar)) {
    results.wordCheck = checkCurrentWord(content, cursorPosition);
    results.hasChanges = true;
  }
  
  // 检查句子完整性（当输入标点符号时）
  if (lastChar && /[.!?;]/.test(lastChar)) {
    results.sentenceCheck = checkSentenceCompleteness(content, cursorPosition);
    results.hasChanges = true;
  }
  
  return results;
}