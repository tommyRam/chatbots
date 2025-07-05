"use client";

import { ChangeEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-message";
import { useChat } from "@/hooks/chat-context";
import { useAllRagTechnics } from "@/hooks/rag-type-context";
import { useDocsRetrieved } from "@/hooks/docs-context";

export default function Chat() {
    const [inputValue, setInputValue] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const [tempHumanMessage, setTempHumanMessage] = useState<string | null>(null);
    const router = useRouter();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [chatContainer, setChatContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const container = document.getElementById("chat-container");
        setChatContainer(container);
    }, []);

    const {
        currentChat,
        aiMessages,
        humanMessages,
        errorMessageOnQuery,
        sendMessage,
        loadLatestAIMessageFromChat,
        loadLatestHumanMessageFromChat,
        handleClearErrorMessageOnQuery,
        handleChangeErrorMessageOnQuery
    } = useChat();

    const {
        loadRetrievedDocumentsFromHumanMessageId
    } = useDocsRetrieved();

    const {
        currentRagTechnic
    } = useAllRagTechnics();

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setInputValue(e.target.value);
    }

    const handleSendQuery = async () => {
        if (!inputValue.trim()) {
            return;
        }

        setTempHumanMessage(inputValue);
        setInputValue("");
        handleClearErrorMessageOnQuery();
        const accessToken = localStorage.getItem("access_token") || "";

        if (accessToken === "") {
            router.push("/auth/login");
            setTempHumanMessageToNull();
            return;
        }

        setIsPending(true);

        setTimeout(() => scrollToBottom(), 100);

        try {

            if (currentChat && currentChat.chatId) {
                const response: MessageResponse = await sendMessage(inputValue, currentChat.chatId, accessToken, currentRagTechnic.endpoint);
                if (response.chatMessage) {
                    await Promise.all([
                        loadLatestAIMessageFromChat(currentChat.chatId, accessToken),
                        loadLatestHumanMessageFromChat(currentChat.chatId, accessToken).then(humanMessage =>
                            loadRetrievedDocumentsFromHumanMessageId(humanMessage, accessToken)
                        )
                    ]);
                    setTempHumanMessageToNull();
                }
            } else {
                console.log("Not authenticated");
                router.push("/auth/login");
            }
        } catch (e) {
            console.log(e);
            const message = (e instanceof Error ? e.message : "Error from server, please try again!") + ". Your last query will be deleted soon!!";
            handleChangeErrorMessageOnQuery(message);
            // throw e;
        } finally {
            setIsPending(false);
            setInputValue("");
            setTimeout(() => setTempHumanMessageToNull(), 6000);
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
                id="chat-container"
                ref={messagesContainerRef}
                className="flex-1 flex justify-center pt-0.5 overflow-y-auto pretty-scrollbar-minimal"
            >
                <ChatMessages
                    tempHumanMessage={tempHumanMessage}
                    setTempHumanMessageToNull={setTempHumanMessageToNull}
                    scrollToBottom={scrollToBottom}
                    scrollContainer={chatContainer}
                    isPending={isPending}
                    errorMessage={errorMessageOnQuery}
                />
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