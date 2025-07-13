"use client";

import { ChangeEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-message";
import { useChat } from "@/hooks/chat-context";
import { useAllRagTechnics } from "@/hooks/rag-type-context";
import { useDocsRetrieved } from "@/hooks/docs-context";
import { sendUserInputStream } from "@/api/chat-api";

export default function Chat() {
    const [inputValue, setInputValue] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [tempHumanMessage, setTempHumanMessage] = useState<string | null>(null);
    const [tempAIMessage, setTempAIMessage] = useState<string | null>(null);
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
        handleChangeErrorMessageOnQuery,
        handleModifyIsLoadingChatMessage
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
                const response = await sendUserInputStream(inputValue, currentChat.chatId, accessToken);

                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error('Failed to get stream reader');
                }

                const decoder = new TextDecoder();
                let assistantContent = "";

                while (true) {
                    setIsStreaming(true);
                    setIsPending(false);
                    const { done, value } = await reader.read();
                    if (done) break;

                    const lines = decoder.decode(value).split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            try {
                                const data = JSON.parse(line.slice(6));

                                if (data.type === "chunk") {
                                    assistantContent += data.data;
                                    setTempAIMessage(assistantContent);
                                    console.log("From server: " + data.data);
                                } else if (data.type === "complete") {
                                    setTimeout(() => { handleModifyIsLoadingChatMessage(true); }, 300);
                                    setTimeout(async () => {
                                        await Promise.all([
                                            loadLatestAIMessageFromChat(currentChat.chatId, accessToken),
                                            loadLatestHumanMessageFromChat(currentChat.chatId, accessToken).then(humanMessage =>
                                                loadRetrievedDocumentsFromHumanMessageId(humanMessage, accessToken)
                                            )
                                        ]);
                                    }, 500);

                                    setTimeout(() => { handleModifyIsLoadingChatMessage(false); }, 1500);
                                } else if (data.type === "error") {
                                    handleChangeErrorMessageOnQuery(data.data);
                                }
                            } catch (parseError) {
                                console.log("Error parsing data: ", parseError);
                                handleChangeErrorMessageOnQuery("Error when handling your request, please try again");
                            } finally {
                                setIsStreaming(false);
                                break;
                            }
                        }
                    }
                }

            } else {
                console.log("Not authenticated");
                router.push("/auth/login");
            }
        } catch (e) {
            console.log(e);
            const message = (e instanceof Error ? e.message : "Error from server, please try again!") + ". Your last query will be deleted soon!!";
            handleChangeErrorMessageOnQuery(message);
        } finally {
            setIsStreaming(false);
            setIsPending(false);
            setInputValue("");
            setTimeout(() => setTempHumanMessageToNull(), 500);
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

    const setTempAIMessageToNull = (): void => {
        setTempAIMessage(null);
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
                    tempAIMessage={tempAIMessage}
                    setTempAIMessageToNull={setTempAIMessageToNull}
                    scrollToBottom={scrollToBottom}
                    scrollContainer={chatContainer}
                    isPending={isPending}
                    errorMessage={errorMessageOnQuery}
                    isStreaming={isStreaming}
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