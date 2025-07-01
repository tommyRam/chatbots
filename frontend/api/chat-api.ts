import { resolve } from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendUserInput = async (
    query: string,
    chatId: string,
    accessToken: string,
    endpoint: string = "/api/RAG/simpleRAG"
): Promise<BackendMessageResponse> => {
    const SIMPLE_RAG_ENPOINT_URL = API_URL + endpoint;
     const queryRequest = {"query": query, "chat_id": chatId};

     try {
            const response = await fetch(
                SIMPLE_RAG_ENPOINT_URL,
                {
                    method: "POST", 
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(queryRequest)
                }
            )

            console.log(response);

            if(!response.ok){
                const errorResponse = await response.json();
                throw new Error(errorResponse.detail);
            }

            const re = await response.json();
            return re;
        }catch (e){
            console.log(e);
            throw e;
        }
}

export const createNewChat = async (
    formData: FormData,
    accessToken: string,
    endpoint: string = "/api/chat/create"
): Promise<BackendchatSchema> => {
    const CREATE_URL_ENDPOINT = API_URL + endpoint;
    try {
        const response = await fetch(
                CREATE_URL_ENDPOINT,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: formData
                }
            ) 
            if(!response.ok){
                const errorResponse = await response.json();
                throw new Error(errorResponse.detail);
            }

        return await response.json();
    }catch(e) {
        throw e;
    }
}

export const getUserChatList = async (
    userId: string,
    accessToken: string,
    endpoint: string = "/api/chat/list/"
): Promise<BackendchatSchema[]> => {
    const USER_CHAT_LIST_API = API_URL + endpoint + userId;
    try {
        const response = await fetch(
            USER_CHAT_LIST_API,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e: unknown) {
        throw e;
    }
}

export const getAIMessageFromChat = async (
    chatId: string,
    accessToken: string,
    endpoint: string = "/api/chat/list/ai-message/"
): Promise<BackendAIMessageResponseSChema[]> => {
    const AI_MESSAGE_LIST_API = API_URL + endpoint + chatId;
    await new Promise((resolve) => setTimeout(resolve, 3000));    
    try {
        const response = await fetch(
            AI_MESSAGE_LIST_API,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e: unknown) {
        throw e;
    }
}

export const getLatestAIMessageFromChat = async (
    chatId: string,
    accessToken: string,
    endpoint: string = "/api/chat/latest/ai-message/"
): Promise<BackendAIMessageResponseSChema> => {
    const LATEST_AI_MESSAGE_API = API_URL + endpoint + chatId;
        await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
        const response = await fetch(
            LATEST_AI_MESSAGE_API,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e: unknown) {
        throw e;
    }
}

export const getHumanMessageFromChat = async (
    chatId: string,
    accessToken: string,
    endpoint: string = "/api/chat/list/human-message/"
): Promise<BackendHumanMessageResponseSChema[]> => {
    const HUMAN_MESSAGE_LIST_API = API_URL + endpoint + chatId;
            await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
        const response = await fetch(
            HUMAN_MESSAGE_LIST_API,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e: unknown) {
        throw e;
    }
}

export const getLatestHumanMessageFromChat = async (
    chatId: string,
    accessToken: string,
    endpoint: string = "/api/chat/latest/human-message/"
): Promise<BackendHumanMessageResponseSChema> => {
    const LATEST_HUMAN_MESSAGE_API = API_URL + endpoint + chatId;
            await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
        const response = await fetch(
            LATEST_HUMAN_MESSAGE_API,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e: unknown) {
        throw e;
    }
}

export const getRetrievedDocuments = async (
    humanMessageId: string, 
    accessToken: string,
    endpoint: string = "/api/chat/list/retrieved-documents/"
): Promise<BackendRetrievedDocumentResponse[]> => {
        const RETRIEVED_DOC_API = API_URL + endpoint + humanMessageId;
                await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
        const response = await fetch(
            RETRIEVED_DOC_API,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e: unknown) {
        throw e;
    }
}

