from pydantic import BaseModel, Field
from typing import Optional
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import getpass
import os



load_dotenv()

if not os.environ.get("DEEPSEEK_API_KEY"):
  os.environ["DEEPSEEK_API_KEY"] = getpass.getpass("Enter API key for DeepSeek: ")
llm = init_chat_model("deepseek-chat", model_provider="deepseek")

class Person(BaseModel):
    name: str = Field(default=None, description="The name of the person")
    hair_color: str = Field(default=None, description="The color of the person's hair if known")
    height_in_meters: Optional[str] = Field(
        default=None, description="Height measured in meters"
    )   



prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert extraction algorithm. "
            "Only extract relevant information from the text. "
            "If you do not know the value of an attribute asked to extract, "
            "return null for the attribute's value.",
        ),
        ("human", "{text}"),
    ]
)

structured_llm = llm.with_structured_output(schema=Person)

text = "Alan Smith is 6 feet tall and has blond hair."
prompt = prompt_template.invoke({"text": text})
print(structured_llm.invoke(prompt))