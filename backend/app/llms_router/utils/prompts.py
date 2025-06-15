prompts = {
    "rag_template": """Answer the followng question based on this context

        {context}

        Question: {question}
        """,
    "multi_query_rag_template": """You are an AI language model assistant. Your task is to generate five different
            versions of te given user question to retrieve relevant documents from a vector database.
            By generating multiple perpectives on the user question, your goal is to help the user overcome
            some of the limitations of the distance-based similarity search. Provide these alternative questions
            separated by newlines. Original question: {question}
            """,
    "fusion_rag_template": """You are a helpful assistant that generates multiple search queries based on
        single input query.\nGenerate multiple search queries related to: {question}\n Output 
        (4 queries):"""
}