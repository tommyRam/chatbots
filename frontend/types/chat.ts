interface ChatMessageSchema {
    content: string;
    type: "ai_message" | "human_message";
}

interface DocMessageResponse {
    id: string;
    content: string;
    fileType: string;
    page: number;
    pageLabel: string;
    title: string;
    uploadTime: string;
    score: string
}

interface BackendDocResponse {
    id: string;
    content: string;
    file_type: string;
    page: number;
    page_label: string;
    title: string;
    upload_time: string;
    score: string;
}

interface MessageResponse {
    documents: DocMessageResponse[],
    chatMessage: string
}

interface BackendMessageResponse {
    documents: BackendDocResponse[];
    chat_response: string;
}

interface ChatSchema {
    chatId: string, 
    userId: string,
    chatName: string,
    documentId: string,
}

interface BackendchatSchema {
    chat_id: string,
    user_id: string,
    chat_name: string,
    document_id: string
}
