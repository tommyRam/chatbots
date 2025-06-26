const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendUserInput = async (
    query: string,
    accessToken: string,
    endpoint: string = "/api/RAG/simpleRAG"
): Promise<BackendMessageResponse> => {
    const SIMPLE_RAG_ENPOINT_URL = API_URL + endpoint;
     const queryRequest = {"query": query};

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