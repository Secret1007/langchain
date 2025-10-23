const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface CheckWordResponse {
  word: string;
  is_correct: boolean;
  suggestions?: string[];
  explanation?: string;
}

export interface CheckSentenceResponse {
  sentence: string;
  is_correct: boolean;
  suggestions?: string[];
  issues?: Array<{
    type: string;
    message: string;
    suggestion?: string;
  }>;
}

export interface ImproveTextResponse {
  original: string;
  improved: string;
  changes?: string[];
}

export interface HealthResponse {
  status: string;
  message?: string;
}

export async function askQuestion(question: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  const data = await res.json();
  return data.answer;
}

// 英语检查API
export async function checkWord(word: string, context: string | null = null): Promise<CheckWordResponse> {
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

export async function checkSentence(sentence: string, fullText: string | null = null): Promise<CheckSentenceResponse> {
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

export async function improveText(text: string): Promise<ImproveTextResponse> {
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

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return await res.json();
}

