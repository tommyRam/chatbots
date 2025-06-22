"use client";

import { Send } from "lucide-react"
import { ChangeEvent, useState } from "react";
import Button from "../reusable_component/button";

interface QueryRequest {
    query: string;
}

interface ChatResponse {
    documents: [string];
    chatResponse: string;
}

const SIMPLE_RAG_API = "http://127.0.0.1:8000/api/RAG/simpleRAG";

interface ChatMainProps {
    message: string;
    setMessage: (newMessage: string) => void;
    setDocuments: (newDocuments: [string]) => void;
}

export default function ChatMain(
    {
        message,
        setMessage,
        setDocuments
    }: ChatMainProps
) {
    
    const [inputValue, setInputValue] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("here")
        e.preventDefault();
        setInputValue(e.target.value);
        console.log("Input change: " + inputValue);
    }

    const handleSendQuery = async () => {
        const accessToken = localStorage.getItem("access_token");
        const queryRequest = {"query": inputValue};
        setIsPending(true);

        try {
            const response = await fetch(
                SIMPLE_RAG_API,
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
            console.log("================\n" + JSON.stringify(re))
            if(re.chat_response) {
                setMessage(re.chat_response);
                setDocuments(re.documents);
            }
        }catch (e){
            console.log(e);
            throw e;
        }finally{
            setIsPending(false);
        }
    }

    return (
        <div className="flex flex-col w-full h-full bg-gradient-to-r bg-gray-200 rounded-br-lg rounded-tr-lg shadow-inner">
            <div 
                className="flex-1 flex flex-col justify-center items-center "
            >
                <div>Chat space</div>
                <div>{message}</div>
            </div>
            <div
                className="h-28 flex justify-center items-center"
            >
                <div
                    className="w-[100%] h-[60%] flex justify-center items-center"
                >
                    <input 
                        id="query"
                        className="border-2 rounded-md p-3 w-[80%] max-w-xl"
                        placeholder="Enter your question"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Button
                        buttonName="send"
                        actionName="sending..."
                        isPending={isPending}
                        action={handleSendQuery}
                    />
                    {/* <button
                        className="bg-purple-800 rounded-md w-13 h-13 flex justify-center items-center"
                        onClick={handleSendQuery}
                    >
                        <Send className="w-4 h-4" />
                    </button> */}
                </div>
            </div>
        </div>
    )
}