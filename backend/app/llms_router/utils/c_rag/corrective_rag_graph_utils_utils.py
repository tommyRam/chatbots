from typing import List
from typing_extensions import TypedDict
from langchain.schema import Document

from .corrective_rag_utils import (
    get_generation_chain,
    get_question_re_writer_chain,
    get_retrieval_grader_chain,
    get_tavily_search_tool
)

class GraphState(TypedDict):
    """
    Represents the state of our graph

    Attributes: 
        question: question
        generation: LLM generation
        web_search: whether to add search
        documents: list of documents
    """

    question: str
    generation: str
    web_search: str
    documents: List[str]

def generate_node(state):
    """
    Generate answer

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, generation, that contains LLM generation
    """
    question = state["question"]
    documents = state["documents"]
    rag_chain = get_generation_chain()
    generation = rag_chain.invoke({"context": documents, "question": question})
    return {"documents": documents, "question": question, "generation": generation}

def grade_documents_node(state):
    """
    Determines whether the reterieved documents are relevant to the question.

    Args: 
        state (dict): The current graph state

    Returns: 
        state (dict): Updates documents key with only filtered relevant documents
    """
    question = state["question"]
    documents = state["documents"]

    filtered_docs = []
    retrieval_grader = get_retrieval_grader_chain()
    web_search = "No"
    for d in documents:
        score = retrieval_grader.invoke(
            {"question": question, "document": d[0].page_content}
        )
        grade = score.binary_score
        if grade == "yes":
            filtered_docs.append(d)
        else:
            web_search = "Yes"
            continue
    return {"documents": filtered_docs, "question": question, "web_search": web_search}

def transform_query_node(state):
    """
    Transform the query to produce a better question

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates question key with a re-phrased question
    """
    question = state["question"]
    documents = state["documents"]
    question_rewriter = get_question_re_writer_chain()
    better_question = question_rewriter.invoke({"question": question})
    return {"documents": documents, "question": better_question}

def web_search_node(state):
    """
    Web search based on the re-phrased question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with appended web results
    """
    question = state["question"]
    documents = state["documents"]
    web_search_tool = get_tavily_search_tool()
    docs = web_search_tool.invoke({"query": question})
    web_results = "\n".join([d["content"] for d in docs["results"]])
    web_results = Document(page_content=web_results)
    documents.append(web_results)
    return {"documents": documents, "question": question}

def decide_to_generate_conditional_node(state):
    """
    Determines whether to generate an answer, or re-generate a question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binar decision for next node to call
    """
    state["question"]
    web_search = state["web_search"]
    relevant_documents = state["documents"]

    if web_search == "Yes" and len(relevant_documents) == 0:
        return "transform_query"
    else:
        return "generate"
    
