import os
from typing import Dict, List, Optional, Any
from openai import OpenAI
import json
import re
from pydantic import BaseModel

class WordCheckRequest(BaseModel):
    word: str
    context: Optional[str] = None

class WordCheckResponse(BaseModel):
    is_correct: bool
    suggestions: List[str]
    explanation: str
    confidence: float

class SentenceCheckRequest(BaseModel):
    sentence: str
    full_text: Optional[str] = None

class SentenceCheckResponse(BaseModel):
    is_complete: bool
    issues: List[Dict[str, Any]]
    suggestions: List[Dict[str, Any]]
    overall_score: float
    explanation: str

class EnglishChecker:
    def __init__(self):
        pass

    async def check_word(self, request: WordCheckRequest) -> WordCheckResponse:
        pass



english_checker = EnglishChecker()

