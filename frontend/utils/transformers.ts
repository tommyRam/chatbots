export function transformDocumentResponse(backendDoc: BackendRetrievedDocumentResponse): RetrievedDocumentResponse {
    return {
        id: backendDoc.id,
        idFromVectorestore: backendDoc.id_from_vectorestore,
        humanMessageId: backendDoc.human_message_id,
        content: backendDoc.content,
        fileType: backendDoc.file_type,
        page: backendDoc.page,
        pageLabel: backendDoc.page_label,
        title: backendDoc.title,
        uploadTime: backendDoc.upload_time,
        score: backendDoc.score,
        createdAt: backendDoc.created_at,
        algorithm: backendDoc.algorithm
    };
}

export function transformMessageResponse(backendResponse: BackendMessageResponse): MessageResponse {
    return {
        documents: backendResponse.documents.map(transformDocumentResponse),
        chatMessage: backendResponse.chat_response
    };
}

export function transformChatResponse(backendChatResponse: BackendchatSchema): ChatSchema {
    return {
        chatId: backendChatResponse.chat_id,
        userId: backendChatResponse.user_id,
        chatName: backendChatResponse.chat_name,
        // documentId: backendChatResponse.document_id
    };
}

export function transfomAIMessageResponseSchema(backendAIMessageResponseSchema: BackendAIMessageResponseSChema): AIMessageResponseSchema {
    return {
        id: backendAIMessageResponseSchema.id,
        ChatId: backendAIMessageResponseSchema.chat_id,
        content: backendAIMessageResponseSchema.content,
        createdAt: backendAIMessageResponseSchema.created_at
    }
}

export function transfomHumanMessageResponseSchema(backendHumanMessageResponseSchema: BackendHumanMessageResponseSChema): HumanMessageResponseSchema {
    return {
        id: backendHumanMessageResponseSchema.id,
        ChatId: backendHumanMessageResponseSchema.chat_id,
        content: backendHumanMessageResponseSchema.content,
        createdAt: backendHumanMessageResponseSchema.created_at
    }
}

export function capitalizeFirstLetter(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}