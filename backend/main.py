from fastapi import FastAPI
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, Tool
from services.tools import get_weather
from services.rag_builder import query_vectorstore
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

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

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

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
        openai_api_base="https://api.deepseek.com/v1",
        model_name="deepseek-chat",
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
