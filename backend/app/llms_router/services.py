import os
from dotenv import load_dotenv, find_dotenv
from operator import itemgetter

from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate
from langchain_core.runnables import RunnableLambda


from config import settings
from .utils.rag import get_vectorestore_from_namespace
from .utils.formatters import (
    format_docs, 
    format_docs_list, 
    get_unique_union, 
    reciprocal_rank_fusion, 
    format_qa_pair)

from .schemas import ChatMessageResponse
from .utils.prompts import prompts, stepback_RAG_prompt_examples

_ = load_dotenv(find_dotenv())

embedding = GoogleGenerativeAIEmbeddings(model=settings.google_embedding_model)
llm = ChatGoogleGenerativeAI(model=settings.google_gemini_model)

async def simple_RAG(
        question: str, 
        chat_id: str
):
    try: 
        prompt = hub.pull("rlm/rag-prompt")
        vectorestore = get_vectorestore_from_namespace(embedding=embedding, namespace=chat_id)
        relevant_docs = vectorestore.similarity_search_with_score(query=question)
        relevant_docs_contents = format_docs_list(relevant_docs)
        formatted_relevant_docs_into_one_long_string = format_docs(relevant_docs)    

        enhanced_prompt = ChatPromptTemplate.from_messages([
            ("system", prompts["formatting_instructions"]),
            *prompt.messages  # Unpack existing messages
        ])
        rag_chain = (
            enhanced_prompt | llm | StrOutputParser()
        )

        chat_response = rag_chain.invoke(
            {"context": formatted_relevant_docs_into_one_long_string, "question": question}
        )

        response = ChatMessageResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response 
    except FileNotFoundError as e:
        raise FileNotFoundError(e)
    except Exception as exception:
        print(f"An error was occured on simple_RAG_service: {exception}")
        raise

async def multi_query_RAG(
        question: str, 
        chat_id: str
):
    try:
        vectorestore = get_vectorestore_from_namespace(embedding=embedding, namespace=chat_id)
        retriever = vectorestore.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": 4, "score_threshold": 0.4}
        )

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

        prompt = ChatPromptTemplate.from_template(prompts["formatting_instructions"] + "\n\n" + prompts["rag_template"])
        final_multi_query_rag_chain = (
            prompt
            | llm 
            | StrOutputParser()
        )
        chat_response = final_multi_query_rag_chain.invoke({"context": formatted_relevant_docs_into_one_long_string,"question": question})
        response = ChatMessageResponse(documents=relevant_docs_contents, chat_response=chat_response)
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

        vectorestore = get_vectorestore_from_namespace(embedding=embedding, namespace=chat_id)
        retriever = vectorestore.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": 4, "score_threshold": 0.4}
        )

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

        prompt = ChatPromptTemplate.from_template(prompts["formatting_instructions"] + "\n\n" + prompts["rag_template"])

        final_fusion_rag_chain = (
            prompt
            | llm
            | StrOutputParser()
        )

        chat_response = final_fusion_rag_chain.invoke({"context": formatted_relevant_docs_into_one_long_string, "question": question})
        response = ChatMessageResponse(documents=relevant_docs_contents, chat_response=chat_response)
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

        decomposition_prompt = ChatPromptTemplate.from_template(prompts["formatting_instructions"] + "\n\n" + prompts["decomposition_rag_template"])

        vectorestore = get_vectorestore_from_namespace(embedding=embedding, namespace=chat_id)
        
        q_a_pairs = ""
        documents_used = []

        for q in generated_questions:
            relevant_docs = vectorestore.similarity_search_with_score(query=question)
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
        
        response = ChatMessageResponse(documents=documents_used, chat_response=answer)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise

async def stepback_RAG(
    question: str,
    chat_id: str
):
    try: 
        example_prompt = ChatPromptTemplate.from_messages(
            [
                ("human", "{input}"),
                ("ai", "{output}")
            ]
        )
        few_shot = FewShotChatMessagePromptTemplate(
            example_prompt=example_prompt,
            examples=stepback_RAG_prompt_examples
        )
        generate_stepback_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", prompts["stepback_rag_generate_query"]),
                few_shot,
                ("user", "{question}")
            ]
        )

        generate_queries_step_back_chain = generate_stepback_prompt | llm | StrOutputParser()
        new_question_from_step_back = generate_queries_step_back_chain.invoke({"question": question})

        vectorestore = get_vectorestore_from_namespace(embedding=embedding, namespace=chat_id)
        relevant_docs_from_original_question = vectorestore.similarity_search_with_score(query=question)
        relevant_docs_from_step_back_question = vectorestore.similarity_search_with_score(query=new_question_from_step_back)

        relevant_docs_contents = format_docs_list(relevant_docs_from_original_question + relevant_docs_from_step_back_question)

        formatted_relevant_docs_into_one_long_string_from_original_question = format_docs(relevant_docs_from_original_question)
        formatted_relevant_docs_into_one_long_string_from_stepback_question = format_docs(relevant_docs_from_step_back_question)

        response_prompt_template = prompts["formatting_instructions"]  + "\n\n" + prompts["stepback_rag_template"]
        response_prompt = ChatPromptTemplate.from_template(response_prompt_template)

        chain = (
            response_prompt
            | llm 
            | StrOutputParser()
        )

        chat_response = chain.invoke({
            "normal_context": formatted_relevant_docs_into_one_long_string_from_original_question,
            "step_back_context": formatted_relevant_docs_into_one_long_string_from_stepback_question,
            "question": question
        })

        response = ChatMessageResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise e
    
# Hypothetical Document RAG
async def hyDe_RAG(
    question: str,
    chat_id: str
):
    try:
        vectorestore = get_vectorestore_from_namespace(embedding=embedding, namespace=chat_id)

        generate_paper_hyde_prompt = ChatPromptTemplate.from_template(prompts["hyDe_RAG_query"])
        generate_docs_for_retrieval_chain = (
            generate_paper_hyde_prompt 
            | llm
            | StrOutputParser()
        )
        generated_paper_ways_from_question = generate_docs_for_retrieval_chain.invoke({"question": question})
        relevant_docs = vectorestore.similarity_search_with_score(query=generated_paper_ways_from_question)
        relevant_docs_contents = format_docs_list(relevant_docs)
        formatted_relevant_docs_into_one_long_string = format_docs(relevant_docs)  

        hyde_prompt_template = prompts["formatting_instructions"]  + "\n\n" + prompts["hyDe_RAG_template"]
        hyde_prompt = ChatPromptTemplate.from_template(hyde_prompt_template)

        hyde_rag_chain = (
            hyde_prompt
            | llm
            | StrOutputParser()
        )
        chat_response = hyde_rag_chain.invoke({"context": formatted_relevant_docs_into_one_long_string, "question": question})
        response = ChatMessageResponse(documents=relevant_docs_contents, chat_response=chat_response)
        return response
    except Exception as e:
        print(f"An error was occured: {e}")
        raise e





        