// --- Pseudo AI revise & inline suggestions (mocked) ---
export function pseudoAnalyze(content) {
  // very lightweight demo rules; replace with real API later
  const issues = [];
  const rules = [
    { pattern: /\bexprience\b/gi, suggestion: "experience", reason: "Spelling: experience" },
    { pattern: /\binformations\b/gi, suggestion: "information", reason: "Uncountable noun: information (no plural)" },
    { pattern: /\bit's means\b/gi, suggestion: "it means", reason: "Remove apostrophe for possessive/verb form confusion" },
    { pattern: /\bvery\s+good\b/gi, suggestion: "great", reason: "Stronger, more natural word choice" },
    { pattern: /\bi am\s+very\s+happy\b/gi, suggestion: "I'm delighted", reason: "Natural, concise tone" },
    { pattern: /\bI have did\b/gi, suggestion: "I have done", reason: "Present perfect: have + past participle" },
  ];
  rules.forEach((r) => {
    let m;
    while ((m = r.pattern.exec(content)) !== null) {
      issues.push({ start: m.index, end: m.index + m[0].length, text: m[0], suggestion: r.suggestion, reason: r.reason });
    }
  });
  // simple double-space detection
  let i = 0;
  while ((i = content.indexOf("  ", i)) !== -1) {
    issues.push({ start: i, end: i + 2, text: "  ", suggestion: " ", reason: "Double space → single space" });
    i = i + 2;
  }
  return issues.sort((a, b) => a.start - b.start);
}

export function applySuggestion(content, issue) {
  return content.slice(0, issue.start) + issue.suggestion + content.slice(issue.end);
}