from langgraph.graph import StateGraph, START, END

from .corrective_rag_graph_utils_utils import (
    generate_node,
    grade_documents_node,
    transform_query_node,
    web_search_node,
    decide_to_generate_conditional_node,
    GraphState
)

workflow = StateGraph(GraphState)

workflow.add_node("grade_documents", grade_documents_node)
workflow.add_node("generate", generate_node)
workflow.add_node("transform_query", transform_query_node)
workflow.add_node("web_search_node", web_search_node)

workflow.add_edge(START, "grade_documents")
workflow.add_conditional_edges("grade_documents", decide_to_generate_conditional_node,{
    "transform_query": "transform_query",
    "generate": "generate"
})
workflow.add_edge("transform_query", "web_search_node")
workflow.add_edge("web_search_node", "generate")
workflow.add_edge("generate", END)

app = workflow.compile()