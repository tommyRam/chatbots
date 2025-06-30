prompts = {
    "formatting_instructions": """
        Format your response using clean markdown:
        - Use ## for section headings
        - Use **bold** for key terms
        - Use - for bullet points
        - Use ``` for code blocks
        - Use proper paragraph spacing
        """,
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
        (4 queries):""",

    "generate_queries_for_decomposition_rag_template": """You are a helpful assistant that generates multiple sub-questions related to an input 
        question.\n The goal is to break down the input into a set of sub-problems / sub-questions that can be 
        answers in isolation.\n Generate multiple search queries related to : {question}\n Ouput (3 queries):
        """,

    "decomposition_rag_template": """Here is the question you need to answer:
        \n-----\n {question} \n-----\n

        Here is any available background question + answer pairs: 

        \n-----\n {q_a_pairs} \n-------\n

        Here is additional context relevant to the questions:

        \n-----\n {context} \n--------\n

        Use the above context and any background question + answer pairs to answer the question: \n {question}"""
        
}