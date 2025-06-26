from langchain.load import dumps, loads
from llms_router.schemas import DocumentSchema

def format_docs(docs):
    if isinstance(docs[0], tuple):
        return "\n\n".join(doc[0].page_content for doc in docs)
    return "\n\n".join(doc.page_content for doc in docs)

def format_docs_list(docs):
    print("format list")
    docs_schemas = []
    for doc in docs:
        score = None
        if isinstance(doc, tuple):
            doc, score = doc

        doc_schema = DocumentSchema(
            id=doc.id,
            content=doc.page_content,
            file_type=doc.metadata["file_type"],
            page=doc.metadata["page"],
            page_label=doc.metadata["page_label"],
            title=doc.metadata["title"],
            upload_time=doc.metadata["upload_time"],
        )

        if score:
            doc_schema.score = score

        docs_schemas.append(doc_schema)
    return docs_schemas

def get_unique_union(documents: list[list]):
    """Unique union of retrieved docs"""
    flattened_docs = [dumps(doc) for sublist in documents for doc in sublist]
    unique_docs = list(set(flattened_docs))
    return [loads(doc) for doc in unique_docs]

def reciprocal_rank_fusion(results: list[list], k=60):
    """ Reciprocal_rank_fusion that takes multiple lists of ranked documents
        and an optioan parameter k used in the RRF formula"""
    fused_scores = {}

    for docs in results:
        for rank, doc in enumerate(docs):
            doc_str = dumps(doc)
            if doc_str not in fused_scores:
                fused_scores[doc_str] = 0
            previous_score = fused_scores[doc_str]
            fused_scores[doc_str] += 1 / (rank + k)
    reranked_results = [
        loads(doc)
        for doc, score in sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
    ]

    return reranked_results

def format_qa_pair(question, answer):
    """Format Q and A pair"""
    formatted_string = ""
    formatted_string += f"Question: {question}\nAnswer: {answer}\n\n"
    return formatted_string.strip()