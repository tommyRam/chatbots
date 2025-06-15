def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def format_docs_list(docs):
    return [doc.page_content for doc in docs]