"use client";

import Button from "../../reusable_component/button";
import { ChangeEvent, useState } from "react";
import { sendUserInput } from "@/api/chat-api";
import { useRouter } from "next/navigation";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-message";

interface ChatProps {
    message: string;
    setMessage: (newMessage: string) => void;
    setDocuments: (newDocuments: [string]) => void;
}

export default function Chat(
    {
        message,
        setMessage, 
        setDocuments
    }: ChatProps
) {
    const [parentWidth, setParentWidth] = useState(0);
    const [inputValue, setInputValue] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setInputValue(e.target.value);
    }

    const handleSendQuery = async () => {
        const accessToken = localStorage.getItem("access_token") || "";
        setIsPending(true);

        try {
            if(accessToken === "") {
                router.push("/auth/login");
                throw new Error("Missing access token");
            }

            const response = await sendUserInput(inputValue, accessToken, "/api/RAG/simpleRAG");
            if(response.chat_response) {
                setMessage(response.chat_response);
                setDocuments(response.documents);
            }
        }catch (e){
            console.log(e);
            throw e;
        }finally{
            setIsPending(false);
        }
    }

    return (
        <div className="h-full flex flex-col justify-center">   
            <ChatHeader />
            <div className="flex-1 flex justify-center pt-0.5">
                <ChatMessages />
            </div>
            <div className="w-[100%] h-28 flex justify-center items-center">
                <ChatInput
                    inputValue={inputValue}
                    isPending={isPending}
                    handleInputChange={handleInputChange}
                    handleSendQuery={handleSendQuery}
                />
            </div>
        </div>

    )
}