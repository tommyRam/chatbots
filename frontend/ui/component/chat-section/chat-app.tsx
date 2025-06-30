"use client";

import { ChangeEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-message";
import { useChat } from "@/hooks/chat-context";

export default function Chat() {
    const [inputValue, setInputValue] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [tempHumanMessage, setTempHumanMessage] = useState<string | null>(null);
    const router = useRouter();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    
    const { currentChat, sendMessage, loadLatestAIMessageFromChat, loadLatestHumanMessageFromChat, loadRetrievedDocumentsFromHumanMessageId, aiMessages, humanMessages } = useChat();

    useEffect(() => {
        if (humanMessages.length === 0 && aiMessages.length === 0) {
            setIsLoadingMessages(true);
        } else {
            setIsLoadingMessages(false);
        }
    }, [humanMessages.length, aiMessages.length]);

    // Scroll to bottom when messages are loaded or updated (only after loading is complete)
    useEffect(() => {
        if (!isLoadingMessages && (humanMessages.length > 0 || aiMessages.length > 0)) {
            setTimeout(scrollToBottom, 100); 
        }
    }, [humanMessages, aiMessages, isLoadingMessages]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setInputValue(e.target.value);
    }

    const handleSendQuery = async () => {
        scrollToBottom();
        setTempHumanMessage(inputValue);
        const accessToken = localStorage.getItem("access_token") || "";
        setIsPending(true);
        setIsLoadingMessages(true);
        
        try {
            if(accessToken === "") {
                router.push("/auth/login");
                setTempHumanMessageToNull();
                throw new Error("Missing access token");
            }

            if(currentChat && currentChat.chatId){
                const response: MessageResponse = await sendMessage(inputValue, currentChat.chatId, accessToken);
                if(response.chatMessage) {
                    const humanMessage = await loadLatestHumanMessageFromChat(currentChat.chatId, accessToken);
                    await loadLatestAIMessageFromChat(currentChat.chatId, accessToken);
                    await loadRetrievedDocumentsFromHumanMessageId(humanMessage, accessToken);
                    setInputValue("");
                    setTempHumanMessageToNull();
                }
            }else {
                console.log("Not authenticated");
                router.push("/auth/login");
            }            
        }catch (e){
            console.log(e);
            throw e;
        }finally{
            setIsPending(false);
            setIsLoadingMessages(false);
            setInputValue("");
            setTempHumanMessageToNull();
        }
    }

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo(
                {
                    top: messagesContainerRef.current.scrollHeight,
                    behavior: "smooth"
                }
            )
        }
    };

    const setTempHumanMessageToNull = (): void => {
        setTempHumanMessage(null);
    }

    return (
        <div className="h-full w-full flex flex-col ">   
            <div className="h-12">
                <ChatHeader />
            </div>
            <div 
                ref={messagesContainerRef}
                className="flex-1 flex justify-center pt-0.5 overflow-y-auto pretty-scrollbar-minimal"
            >
                <ChatMessages tempHumanMessage={tempHumanMessage} setTempHumanMessageToNull={setTempHumanMessageToNull}/>
            </div>
            <div className="w-[100%] h-28 flex justify-center items-center ">
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