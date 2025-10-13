const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function askQuestion(question) {
  const res = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  const data = await res.json();
  return data.answer;
}

// 英语检查API
export async function checkWord(word, context = null) {
  const res = await fetch(`${API_BASE_URL}/api/check-word`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, context })
  });
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return await res.json();
}

export async function checkSentence(sentence, fullText = null) {
  const res = await fetch(`${API_BASE_URL}/api/check-sentence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence, full_text: fullText })
  });
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return await res.json();
}

export async function improveText(text) {
  const res = await fetch(`${API_BASE_URL}/api/improve-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text })
  });
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return await res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return await res.json();
}
