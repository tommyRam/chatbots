from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_tavily import TavilySearch

from config import settings
from ..prompts import c_rag_prompts, prompts

llm = ChatGoogleGenerativeAI(model=settings.google_gemini_model)

class GradeDocuments(BaseModel):
    """Binary score for relevance check on retrieved documents"""
    binary_score: str = Field(
        description="Documents are relevant to the question, 'yes' or 'no'"
    )

def get_retrieval_grader_chain():
    structured_llm_grader = llm.with_structured_output(GradeDocuments)
    system = c_rag_prompts["grader_node_system_prompt"]
    grade_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "Retrieved documents: \n\n {document} \n\n User question: {question}")
        ]
    )
    retrieval_grader_chain = grade_prompt | structured_llm_grader
    return retrieval_grader_chain

def get_generation_chain():
    prompt = hub.pull("rlm/rag-prompt")
    genration_prompt = ChatPromptTemplate.from_messages([
            ("system", prompts["formatting_instructions"]),
            *prompt.messages  # Unpack existing messages
        ])
    generation_chain = ({
        "context": (lambda x: x["context"]),
        "question": (lambda x: x["question"])
    }) | genration_prompt | llm | StrOutputParser()

    return generation_chain

def get_question_re_writer_chain():
    system = c_rag_prompts["re_write_user_question_prompt"]
    re_write_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "Here is the initial question: \n\n {question} \n Formulate an improve question.")
        ]
    )
    question_re_writer_chain = re_write_prompt | llm | StrOutputParser()
    return question_re_writer_chain

def get_tavily_search_tool():
    web_search_tool = TavilySearch(
        max_results=5
    )
    return web_search_tool

