export function transformDocumentResponse(backendDoc: BackendDocResponse): DocMessageResponse {
    return {
        id: backendDoc.id,
        content: backendDoc.content,
        fileType: backendDoc.file_type,
        page: backendDoc.page,
        pageLabel: backendDoc.page_label,
        title: backendDoc.title,
        uploadTime: backendDoc.upload_time,
        score: backendDoc.score
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
        documentId: backendChatResponse.document_id
    };
}

export function capitalizeFirstLetter(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}