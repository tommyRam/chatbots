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