from langchain import hub
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv, find_dotenv

import os
from pathlib import Path

from config import settings
from .utils.rag import create_retriever
from .utils.formatters import format_docs, format_docs_list
from .schemas import ChatResponse

_ = load_dotenv(find_dotenv())

current_dir = os.path.dirname(os.path.abspath(__file__))
doc_path = os.path.join(current_dir, "dev_data_api", "Be_Good.pdf")

embedding = GoogleGenerativeAIEmbeddings(model=settings.google_embedding_model)
llm = ChatGoogleGenerativeAI(model=settings.google_gemini_model)

async def simple_RAG(question):
    try: 
        prompt = hub.pull("rlm/rag-prompt")
        retriever = create_retriever(doc_path=doc_path, embedding=embedding)

        relevant_docs = retriever.invoke(input=question)
        relevant_docs_contents = format_docs_list(relevant_docs)
        formatted_relevant_docs = format_docs(relevant_docs)    

        rag_chain = (
            prompt | llm | StrOutputParser()
        )

        chat_response = rag_chain.invoke(
            {"context": formatted_relevant_docs, "question": question}
        )

        response = ChatResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response 
    except FileNotFoundError as e:
        raise FileNotFoundError(e)
    except:
        raise
