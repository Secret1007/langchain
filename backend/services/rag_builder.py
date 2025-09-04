from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

def build_vectorstore():
    with open("docs/physics.txt", "r", encoding="utf-8") as f:
        text = f.read()

    # 切分文本
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = splitter.create_documents([text])

    # 生成向量
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embeddings)

    # 保存
    vectorstore.save_local("vectorstore/physics")

def query_vectorstore(query: str) -> str:
    """Searches the vector store for a query and returns the most relevant document."""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.load_local("vectorstore/physics", embeddings, allow_dangerous_deserialization=True)
    docs = vectorstore.similarity_search(query)
    return docs[0].page_content if docs else "No relevant document found."


if __name__ == "__main__":
    build_vectorstore()
