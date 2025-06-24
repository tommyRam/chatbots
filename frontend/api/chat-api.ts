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