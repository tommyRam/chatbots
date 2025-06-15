import os
from dotenv import load_dotenv, find_dotenv

from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import ChatPromptTemplate

from config import settings
from .utils.rag import create_retriever
from .utils.formatters import format_docs, format_docs_list, get_unique_union
from .schemas import ChatResponse
from .utils.prompts import prompts

_ = load_dotenv(find_dotenv())

embedding = GoogleGenerativeAIEmbeddings(model=settings.google_embedding_model)
llm = ChatGoogleGenerativeAI(model=settings.google_gemini_model)

async def simple_RAG(question):
    try: 
        prompt = hub.pull("rlm/rag-prompt")
        retriever = create_retriever(embedding=embedding)

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

async def multi_query_RAG(question):
    try:
        retriever = create_retriever(embedding=embedding)

        prompts_perpectives = ChatPromptTemplate.from_template(prompts["multi_query_rag_template"])

        generate_queries_chain = (
            prompts_perpectives
            | llm 
            | StrOutputParser()
            | (lambda x: x.split("\n"))
        )

        retrieval_chain = generate_queries_chain | retriever.map() | get_unique_union
        relevant_docs = retrieval_chain.invoke({"question": question})
        relevant_docs_contents = format_docs_list(relevant_docs)
        formatted_relevant_docs = format_docs(relevant_docs)

        prompt = ChatPromptTemplate.from_template(prompts["rag_template"])
        final_multi_query_rag_chain = (
            prompt
            | llm 
            | StrOutputParser()
        )
        chat_response = final_multi_query_rag_chain.invoke({"context": formatted_relevant_docs,"question": question})
        response = ChatResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise
