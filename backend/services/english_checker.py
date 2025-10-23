import os
from typing import Dict, List, Optional, Any
from openai import OpenAI
import json
import re
from pydantic import BaseModel
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

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
        # 初始化OpenAI客户端 - 使用OpenAI API（英文能力更强）
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY is required. Please set it in .env file.")
        
        base_url = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
        
        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
        # 使用gpt-4o-mini，性价比高且英文能力强
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        
    async def check_word(self, request: WordCheckRequest) -> WordCheckResponse:
        """检查单词拼写和用法"""
        prompt = f"""
你是一个专业的英语拼写和语法检查器。请检查以下单词：

单词: "{request.word}"
上下文: "{request.context or '无'}"

请以JSON格式返回检查结果：
{{
    "is_correct": true/false,
    "suggestions": ["建议的正确拼写1", "建议的正确拼写2"],
    "explanation": "解释为什么这个拼写是错误的，以及正确的用法",
    "confidence": 0.95
}}

如果单词拼写正确，请返回：
{{
    "is_correct": true,
    "suggestions": [],
    "explanation": "拼写正确",
    "confidence": 1.0
}}

只返回JSON，不要其他内容。
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的英语拼写检查器。只返回JSON格式的结果。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=300
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # 尝试解析JSON
            try:
                result = json.loads(result_text)
                return WordCheckResponse(**result)
            except json.JSONDecodeError:
                # 如果JSON解析失败，尝试提取JSON部分
                json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
                if json_match:
                    result = json.loads(json_match.group())
                    return WordCheckResponse(**result)
                else:
                    # 降级处理
                    return WordCheckResponse(
                        is_correct=True,
                        suggestions=[],
                        explanation="无法解析AI响应",
                        confidence=0.0
                    )
                    
        except Exception as e:
            print(f"Error checking word: {e}")
            return WordCheckResponse(
                is_correct=True,
                suggestions=[],
                explanation=f"检查服务暂时不可用: {str(e)}",
                confidence=0.0
            )

    async def check_sentence(self, request: SentenceCheckRequest) -> SentenceCheckResponse:
        """检查句子完整性和语法"""
        prompt = f"""
你是一个专业的英语语法和写作检查器。请检查以下句子的完整性和语法：

句子: "{request.sentence}"
完整文本: "{request.full_text or '无'}"

请以JSON格式返回检查结果：
{{
    "is_complete": true/false,
    "issues": [
        {{
            "type": "grammar|spelling|punctuation|structure",
            "position": "错误位置描述",
            "message": "具体错误描述",
            "severity": "high|medium|low"
        }}
    ],
    "suggestions": [
        {{
            "type": "grammar|spelling|punctuation|structure",
            "original": "原始文本",
            "corrected": "修正后的文本",
            "explanation": "修正说明"
        }}
    ],
    "overall_score": 0.85,
    "explanation": "整体评价和建议"
}}

评分标准：
- 0.9-1.0: 优秀，语法正确，表达清晰
- 0.7-0.8: 良好，有少量小错误
- 0.5-0.6: 一般，有明显错误但不影响理解
- 0.0-0.4: 较差，有严重错误

只返回JSON，不要其他内容。
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的英语语法检查器。只返回JSON格式的结果。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # 尝试解析JSON
            try:
                result = json.loads(result_text)
                return SentenceCheckResponse(**result)
            except json.JSONDecodeError:
                # 如果JSON解析失败，尝试提取JSON部分
                json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
                if json_match:
                    result = json.loads(json_match.group())
                    return SentenceCheckResponse(**result)
                else:
                    # 降级处理
                    return SentenceCheckResponse(
                        is_complete=True,
                        issues=[],
                        suggestions=[],
                        overall_score=1.0,
                        explanation="无法解析AI响应"
                    )
                    
        except Exception as e:
            print(f"Error checking sentence: {e}")
            return SentenceCheckResponse(
                is_complete=True,
                issues=[],
                suggestions=[],
                overall_score=1.0,
                explanation=f"检查服务暂时不可用: {str(e)}"
            )

    async def get_improvement_suggestions(self, text: str) -> Dict[str, Any]:
        """获取文本改进建议"""
        prompt = f"""
你是一个专业的英语写作导师。请分析以下文本并提供改进建议：

文本: "{text}"

请以JSON格式返回分析结果：
{{
    "overall_assessment": "整体评价",
    "strengths": ["优点1", "优点2"],
    "areas_for_improvement": ["需要改进的地方1", "需要改进的地方2"],
    "suggestions": [
        {{
            "type": "vocabulary|grammar|style|structure",
            "original": "原始文本",
            "suggestion": "改进建议",
            "explanation": "改进说明"
        }}
    ],
    "level": "beginner|intermediate|advanced",
    "score": 0.85
}}

只返回JSON，不要其他内容。
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的英语写作导师。只返回JSON格式的结果。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=600
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # 尝试解析JSON
            try:
                result = json.loads(result_text)
                return result
            except json.JSONDecodeError:
                # 如果JSON解析失败，尝试提取JSON部分
                json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {
                        "overall_assessment": "无法分析文本",
                        "strengths": [],
                        "areas_for_improvement": [],
                        "suggestions": [],
                        "level": "unknown",
                        "score": 0.0
                    }
                    
        except Exception as e:
            print(f"Error getting improvement suggestions: {e}")
            return {
                "overall_assessment": f"分析服务暂时不可用: {str(e)}",
                "strengths": [],
                "areas_for_improvement": [],
                "suggestions": [],
                "level": "unknown",
                "score": 0.0
            }

# 全局实例
english_checker = EnglishChecker()
