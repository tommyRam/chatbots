const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendUserInput = async (
    query: string,
    accessToken: string,
    endpoint: string
) => {
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
    endpoint: string
) => {
    const CREATE_URL_ENDPOINT = API_URL + endpoint;
    try {
        const response = await fetch(
                "http://127.0.0.1:8000/api/chat/create",
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