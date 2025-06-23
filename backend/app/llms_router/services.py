import os
from dotenv import load_dotenv, find_dotenv
from operator import itemgetter

from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from fastapi import UploadFile
from typing import List

from config import settings
from .utils.rag import create_retriever, get_retriever_from_namespace
from .utils.formatters import (
    format_docs, 
    format_docs_list, 
    get_unique_union, 
    reciprocal_rank_fusion, 
    format_qa_pair)

from .schemas import ChatResponse
from .utils.prompts import prompts

_ = load_dotenv(find_dotenv())

embedding = GoogleGenerativeAIEmbeddings(model=settings.google_embedding_model)
llm = ChatGoogleGenerativeAI(model=settings.google_gemini_model)

async def simple_RAG(
        question: str, 
        chat_id: str
):
    try: 
        prompt = hub.pull("rlm/rag-prompt")
        # retriever = create_retriever(
        #     embedding=embedding, 
        #     uploaded_files=uploaded_files, 
        #     namespace=chat_id)
        retriever = get_retriever_from_namespace(embedding=embedding, namespace=chat_id)

        relevant_docs = retriever.invoke(input=question)
        relevant_docs_contents = format_docs_list(relevant_docs)
        formatted_relevant_docs_into_one_long_string = format_docs(relevant_docs)    

        rag_chain = (
            prompt | llm | StrOutputParser()
        )

        chat_response = rag_chain.invoke(
            {"context": formatted_relevant_docs_into_one_long_string, "question": question}
        )

        response = ChatResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response 
    except FileNotFoundError as e:
        raise FileNotFoundError(e)
    except Exception as exception:
        print(f"An error was occured: {exception}")
        raise

async def multi_query_RAG(
        question: str, 
        chat_id: str
):
    try:
        # retriever = create_retriever(
        #     embedding=embedding, 
        #     uploaded_files=uploaded_files, 
        #     namespace=chat_id)
        retriever = get_retriever_from_namespace(embedding=embedding, namespace=chat_id)

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
        formatted_relevant_docs_into_one_long_string = format_docs(relevant_docs)

        prompt = ChatPromptTemplate.from_template(prompts["rag_template"])
        final_multi_query_rag_chain = (
            prompt
            | llm 
            | StrOutputParser()
        )
        chat_response = final_multi_query_rag_chain.invoke({"context": formatted_relevant_docs_into_one_long_string,"question": question})
        response = ChatResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise

async def fusion_RAG(
        question: str, 
        chat_id: str
):
    try:
        fusion_prompt_template = prompts["fusion_rag_template"]
        prompt_rag_fusion = ChatPromptTemplate.from_template(fusion_prompt_template)

        # retriever = create_retriever(
        #     embedding=embedding, 
        #     uploaded_files=uploaded_files, 
        #     namespace=chat_id)
        retriever = get_retriever_from_namespace(embedding=embedding, namespace=chat_id)

        generative_queries_chain = (
            prompt_rag_fusion
            | llm
            | StrOutputParser()
            | (lambda x: x.split("\n"))
        )

        retrieval_chain_rag_fusion = (
            generative_queries_chain | retriever.map() | reciprocal_rank_fusion
        )

        relevant_docs = retrieval_chain_rag_fusion.invoke({"question": question})
        relevant_docs_contents = format_docs_list(relevant_docs)
        formatted_relevant_docs_into_one_long_string = format_docs(relevant_docs)

        prompt = ChatPromptTemplate.from_template(prompts["rag_template"])

        final_fusion_rag_chain = (
            prompt
            | llm
            | StrOutputParser()
        )

        chat_response = final_fusion_rag_chain.invoke({"context": formatted_relevant_docs_into_one_long_string, "question": question})
        response = ChatResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise

async def decomposition_RAG(
        question: str, 
        chat_id: str
): 
    try:
        generate_queries_for_prompt_decomposition_template = prompts["generate_queries_for_decomposition_rag_template"]
        generate_queries_for_prompt_decomposition = ChatPromptTemplate.from_template(generate_queries_for_prompt_decomposition_template)

        generate_queries_decomposition_chain = (
            generate_queries_for_prompt_decomposition 
            | llm
            | StrOutputParser()
            | (lambda x: x.split("\n"))
        )

        generated_questions = generate_queries_decomposition_chain.invoke({"question": question})
        generated_questions = generated_questions[2:]

        decomposition_prompt = ChatPromptTemplate.from_template(prompts["decomposition_rag_template"])

        # retriever = create_retriever(
        #     embedding=embedding, 
        #     uploaded_files=uploaded_files, 
        #     namespace=chat_id)
        retriever = get_retriever_from_namespace(embedding=embedding, namespace=chat_id)

        q_a_pairs = ""
        documents_used = []

        for q in generated_questions:
            relevant_docs = retriever.invoke(input=q)
            relevant_docs_contents = format_docs_list(relevant_docs)
            formatted_relevant_docs_into_one_long_string = format_docs(relevant_docs)   

            documents_used += relevant_docs_contents

            rag_chain = (
                {"context": itemgetter("context"),
                 "question": itemgetter("question"),
                 "q_a_pairs": itemgetter("q_a_pairs")}
                | decomposition_prompt
                | llm 
                | StrOutputParser()
            )

            answer = rag_chain.invoke({"context": formatted_relevant_docs_into_one_long_string,"question": q, "q_a_pairs": q_a_pairs})
            q_a_pair = format_qa_pair(q, answer)
            q_a_pairs = q_a_pairs + "\n ---- \n" + q_a_pair
        
        response = ChatResponse(documents=documents_used, chat_response=answer)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise




        