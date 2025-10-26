from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, Tool
from services.tools import get_weather
from services.rag_builder import query_vectorstore
from services.english_checker import english_checker, WordCheckRequest, WordCheckResponse, SentenceCheckRequest, SentenceCheckResponse
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import json
import re
from typing import Dict, List

load_dotenv()

app = FastAPI()

# CORS middleware
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY") or os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_BASE = os.getenv("DEEPSEEK_API_BASE", "https://api.openai.com/v1")

# 初始化记忆
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# 请求体
class Query(BaseModel):
    question: str

# 工具列表
tools = [
    Tool(
        name="Weather",
        func=get_weather,
        description="获取指定城市的实时天气信息，输入城市名即可，比如：北京、上海"
    ),
    Tool(
        name="PhysicsQA",
        func=query_vectorstore,
        description="用于查询和物理学相关的专有名词，例如LHC、BESIII、LHAASO等。当用户的问题包含这些词语时，优先使用此工具。"
    )
]

@app.post("/ask")
async def ask(query: Query):
    llm = ChatOpenAI(
        openai_api_key=DEEPSEEK_API_KEY,
        openai_api_base=DEEPSEEK_API_BASE,
        model_name="gpt-4o-mini",
        temperature=0.7
    )
    
    system_template = """你是一个聪明又幽默的 AI 助手。
    - 如果用户聊天，就幽默机智地回复。
    - 如果用户提到天气，你可以调用 Weather 工具。
    - 如果用户的问题涉及物理学，特别是关于LHC、BESIII、LHAASO等实验或概念，请务必优先使用 PhysicsQA 工具来获取最准确的定义和信息。
    - 保持对话上下文，记住用户说过的内容。
    聊天记录：
    {chat_history}
    """
    prompt = PromptTemplate(
        template=system_template + "用户的问题：{input}",
        input_variables=["chat_history", "input"]
    )

    # 初始化 Agent
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent="conversational-react-description",
        memory=memory,
        verbose=True,
        return_intermediate_steps=True,
        handle_parsing_errors=True
    )

    # 执行
    result = agent(query.question)

    # 整理工具调用日志
    steps_log = []
    for step in result["intermediate_steps"]:
        action, observation = step
        steps_log.append({
            "tool": action.tool,
            "tool_input": str(action.tool_input),
            "observation": str(observation)
        })

    # 构造决策树风格的可视化日志
    decision_log = {
        "question": query.question,
        "decision": "调用工具" if steps_log else "直接回答",
        "tool_used": steps_log[0]["tool"] if steps_log else None,
        "steps": steps_log,
        "final_answer": result["output"]
    }

    return {
        "answer": result["output"],
        "decision_log": decision_log,
        "history": [
            {"role": msg.type, "content": msg.content}
            for msg in memory.chat_memory.messages
        ]
    }

# 英语检查相关API端点

@app.post("/api/check-word", response_model=WordCheckResponse)
async def check_word(request: WordCheckRequest):
    """检查单词拼写"""
    return await english_checker.check_word(request)

@app.post("/api/check-sentence", response_model=SentenceCheckResponse)
async def check_sentence(request: SentenceCheckRequest):
    """检查句子完整性和语法"""
    return await english_checker.check_sentence(request)

@app.post("/api/improve-text")
async def improve_text(request: Query):
    """获取文本改进建议"""
    result = await english_checker.get_improvement_suggestions(request.question)
    return result

@app.get("/api/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "service": "english-checker"}

# WebSocket连接管理
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_contexts: Dict[str, Dict] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.user_contexts[client_id] = {
            "current_text": "",
            "last_sentence": "",
            "session_started": False
        }

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.user_contexts:
            del self.user_contexts[client_id]

    async def send_message(self, message: dict, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(json.dumps(message))

manager = ConnectionManager()

def detect_sentence_end(text: str) -> List[str]:
    """检测文本中完整的句子"""
    # 简单的句子分割，基于标点符号
    sentences = re.split(r'([.!?。！？]+)', text)
    complete_sentences = []
    
    for i in range(0, len(sentences) - 1, 2):
        if i + 1 < len(sentences):
            sentence = (sentences[i] + sentences[i + 1]).strip()
            if sentence:
                complete_sentences.append(sentence)
    
    return complete_sentences

@app.websocket("/ws/writing-assistant/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket端点用于实时写作辅助"""
    await manager.connect(websocket, client_id)
    
    try:
        # 发送欢迎消息
        await manager.send_message({
            "type": "connected",
            "message": "✅ AI写作助手已连接！开始输入，我会在每句话完成后帮你检查语法和表达。"
        }, client_id)
        
        while True:
            # 接收消息
            data = await websocket.receive_text()
            message = json.loads(data)
            
            msg_type = message.get("type")
            context = manager.user_contexts[client_id]
            
            if msg_type == "start_session":
                # 开始写作会话
                context["session_started"] = True
                await manager.send_message({
                    "type": "session_started",
                    "message": "🖊️ 开始写日记吧！我会在每句话结束后给你反馈。"
                }, client_id)
            
            elif msg_type == "text_update":
                # 文本更新
                current_text = message.get("text", "")
                context["current_text"] = current_text
                
                # 检测完整的句子
                sentences = detect_sentence_end(current_text)
                
                if sentences:
                    last_sentence = sentences[-1]
                    
                    # 如果是新句子，进行检查
                    if last_sentence != context["last_sentence"]:
                        context["last_sentence"] = last_sentence
                        
                        # 发送正在分析的状态
                        await manager.send_message({
                            "type": "analyzing",
                            "sentence": last_sentence
                        }, client_id)
                        
                        # 调用英语检查器
                        try:
                            sentence_check = await english_checker.check_sentence(
                                SentenceCheckRequest(
                                    sentence=last_sentence,
                                    full_text=current_text
                                )
                            )
                            
                            # 发送检查结果
                            await manager.send_message({
                                "type": "feedback",
                                "sentence": last_sentence,
                                "is_complete": sentence_check.is_complete,
                                "issues": sentence_check.issues,
                                "suggestions": sentence_check.suggestions,
                                "score": sentence_check.overall_score,
                                "explanation": sentence_check.explanation,
                                "polished_sentence": sentence_check.polished_sentence,
                                "polished_explanation": sentence_check.polished_explanation
                            }, client_id)
                            
                        except Exception as e:
                            await manager.send_message({
                                "type": "error",
                                "message": f"检查时出错: {str(e)}"
                            }, client_id)
            
            elif msg_type == "request_improvement":
                # 请求全文改进建议
                text = message.get("text", "")
                try:
                    improvement = await english_checker.get_improvement_suggestions(text)
                    await manager.send_message({
                        "type": "improvement",
                        "data": improvement
                    }, client_id)
                except Exception as e:
                    await manager.send_message({
                        "type": "error",
                        "message": f"获取改进建议时出错: {str(e)}"
                    }, client_id)
            
            elif msg_type == "ping":
                # 心跳检测
                await manager.send_message({
                    "type": "pong"
                }, client_id)
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        print(f"WebSocket error for client {client_id}: {e}")
        manager.disconnect(client_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
