interface ChatMessageSchema {
    content: string;
    type: "ai_message" | "human_message";
}

interface RetrievedDocumentResponse {
    id: string;
    idFromVectorestore: string;
    humanMessageId: string;
    content: string;
    fileType?: string;
    page?: number;
    pageLabel?: string;
    title?: string;
    uploadTime?: string;
    score?: string;
    createdAt: string;
    algorithm: string;
}

interface BackendRetrievedDocumentResponse {
    id: string;
    id_from_vectorestore: string;
    human_message_id: string;
    content: string;
    file_type: string;
    page: number;
    page_label: string;
    title: string;
    upload_time: string;
    score: string;
    created_at: string;
    algorithm: string;
}

interface MessageResponse {
    documents: RetrievedDocumentResponse[];
    chatMessage: string
}

interface BackendMessageResponse {
    documents: BackendRetrievedDocumentResponse[];
    chat_response: string;
}

interface ChatSchema {
    chatId: string; 
    userId: string;
    chatName: string;
    // documentId: string;
}

interface BackendchatSchema {
    chat_id: string;
    user_id: string;
    chat_name: string;
    // document_id: string;
}

interface AIMessageResponseSchema {
    id: string;
    ChatId: string;
    content: string;
    createdAt: string;
}

interface BackendAIMessageResponseSChema {
    id: string;
    chat_id: string;
    content: string;
    created_at: string;
}

interface HumanMessageResponseSchema {
    id?: string;
    ChatId: string;
    content: string;
    createdAt?: string;
}

interface BackendHumanMessageResponseSChema {
    id: string;
    chat_id: string;
    content: string;
    created_at: string;
}

interface HumanMessageWithRetrievedDocumentSchema {
    humanMessage: HumanMessageResponseSchema;
    documents: RetrievedDocumentResponse[];
}
