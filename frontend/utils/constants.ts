export const allRagTechnicsConstant: RagTypeSchema[] = [
    {
        displayName: "Simple RAG",
        endpoint: "/api/RAG/simpleRAG",
        notebookName: "simpleRAG"
    },
    {
        displayName: "Multi query RAG",
        endpoint: "/api/RAG/multiQueryRAG",
        notebookName: "multiQueryRAG"
    },
    {
        displayName: "Fusion RAG",
        endpoint: "/api/RAG/fusionRAG",
        notebookName: "fusionRAG"
    },
    {
        displayName: "Decomposition RAG",
        endpoint: "/api/RAG/decompositionRAG",
        notebookName: "decompositionRAG"
    }, 
    {
        displayName: "Stepback RAG",
        endpoint: "/api/RAG/stepbackRAG",
        notebookName: "stepbackRAG"
    },
    {
        displayName: "HyDe RAG",
        endpoint: "/api/RAG/hyDeRAG",
        notebookName: "hyDeRAG"
    },
    {
        displayName: "Corrective RAG",
        endpoint: "/api/RAG/CRAG",
        notebookName: "correctiveRAG"
    }
];

export const documentsHeaderTypes: DocUIHeader[] = [
    {
        name: "Retrieved documents"
    },
    {
        name: "Code"
    }
]