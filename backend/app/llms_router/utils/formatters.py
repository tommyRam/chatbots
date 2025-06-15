from langchain.load import dumps, loads

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def format_docs_list(docs):
    return [doc.page_content for doc in docs]

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