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

        Use the above context and any background question + answer pairs to answer the question: \n {question}""",
    
    "stepback_rag_generate_query": """You are an expert at world knowledge. Your task is to step back and paraphrase a question to a more generic step-back question, which is easier to answer. Here are a few examples:""",

    "stepback_rag_template": """You are an expert of world knowledge. I am going to ask you a question. Your response should be comprehensive and not contradicted with the following context if they are relevant. Otherwise, ignore them if they are not relevant.

    # {normal_context}
    # {step_back_context}

    # Original Question: {question}
    # Answer:""",

    
}

# It is used as an example used as a few shots
stepback_RAG_prompt_examples = [
    {
        "input": "Could the members of The Police perform lawful arrests?",
        "output": "what can the members of The Police do?",
    },
    {
        "input": "Jan Sindel’s was born in what country?",
        "output": "what is Jan Sindel’s personal history?",
    },
]