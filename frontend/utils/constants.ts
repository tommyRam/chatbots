export const allRagTechnicsConstant: RagTypeSchema[] = [
    {
        displayName: "Simple RAG",
        enpoint: "/api/RAG/simpleRAG"
    },
    {
        displayName: "Multi query RAG",
        enpoint: "/api/RAG/multiQueryRAG"
    },
    {
        displayName: "Fusion RAG",
        enpoint: "/api/RAG/fusionRAG"
    },
    {
        displayName: "Decomposition RAG",
        enpoint: "/api/RAG/decompositionRAG"
    }, 
    {
        displayName: "Corrective RAG",
        enpoint: "/api/RAG/CRAG"
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