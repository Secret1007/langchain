import getpass
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
# 加载 .env 文件
load_dotenv()

if not os.environ.get("DEEPSEEK_API_KEY"):
  os.environ["DEEPSEEK_API_KEY"] = getpass.getpass("Enter API key for DeepSeek: ")


model = init_chat_model("deepseek-chat", model_provider="deepseek")


system_template = "Translate the following from English into {language}"

prompt_template = ChatPromptTemplate.from_messages(
    [("system", system_template), ("user", "{text}")]
)
prompt = prompt_template.invoke({"language": "Chinese", "text": "It’s perfectly fine to pause when you’re not sure what to say.A short pause can help you organize your thoughts.Remember, silence for a moment is better than rushing your words."})

print("开始翻译...")
for token in model.stream(prompt):
    print(token.content, end="", flush=True)
print("\n翻译完成！")