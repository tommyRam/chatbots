// Fixed ChatMessages component
"use client";

import { useChat } from "@/hooks/chat-context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/ui/reusable_component/profile-menu";
import { clearLocalStorage } from "@/utils/auth";
import { Bot, MessageSquarePlus, MessageSquarePlusIcon, Sparkles } from "lucide-react";
import HumanMessage from "@/ui/reusable_component/human-message";
import AIMessage from "@/ui/reusable_component/ai-message";
import MessagesLoadingComponent from "@/ui/reusable_component/loading-messages";
import { useDocsRetrieved } from "@/hooks/docs-context";

interface ChatMessagesProps {
    tempHumanMessage: string | null;
    setTempHumanMessageToNull: () => void;
    scrollToBottom: () => void;
    scrollContainer: HTMLElement | null;
    isPending?: boolean;
    errorMessage: string | null;
}

export default function ChatMessages({
    tempHumanMessage,
    setTempHumanMessageToNull,
    scrollToBottom,
    scrollContainer,
    isPending = false,
    errorMessage
}: ChatMessagesProps) {
    const [isLoadingChatsMessages, setIsLoadingChatsMessage] = useState<boolean>(true);
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const {
        aiMessages,
        humanMessages,
        currentChat,
        loadAIMessagesFromChat,
        loadHumanMessagesFromChat,
        handleChangeCurrentChat,
        setCurrentChatToNull
    } = useChat();

    const {
        loadRetrievedDocumentsFromHumanMessageId,
        handleUpdateHumanMessageFetchLoading,
        setCurrentHumanMessageWithRetrievedDocumentsToNull
    } = useDocsRetrieved();

    const router = useRouter();

    const shouldShowTempMessage = useMemo(() => {
        if (!tempHumanMessage) return false;

        const messageExists = humanMessages.some(msg =>
            msg.content?.trim() === tempHumanMessage.trim()
        );

        return !messageExists;
    }, [tempHumanMessage, humanMessages]);

    // Immediate cleanup when real message appears
    const clearTempMessageIfNeeded = useCallback(() => {
        if (tempHumanMessage && !shouldShowTempMessage) {
            setTempHumanMessageToNull();
        }
    }, [tempHumanMessage, shouldShowTempMessage, setTempHumanMessageToNull]);

    useEffect(() => {
        clearTempMessageIfNeeded();
    }, [clearTempMessageIfNeeded]);

    // Auto-scroll effect
    useEffect(() => {
        const currentMessageCount = humanMessages.length + aiMessages.length;

        // Scroll if new messages added, temp message exists, or user hasn't scrolled
        if (currentMessageCount > lastMessageCount || tempHumanMessage || !userHasScrolled) {
            setTimeout(() => scrollToBottom(), 50);
            if (currentMessageCount > lastMessageCount) {
                setUserHasScrolled(false);
            }
        }

        setLastMessageCount(currentMessageCount);
    }, [aiMessages, humanMessages, tempHumanMessage, scrollToBottom, lastMessageCount, userHasScrolled]);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

                if (!isNearBottom) {
                    setUserHasScrolled(true);
                }
            }
        };

        const container = scrollContainer || document.getElementById('chat-container');
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [scrollContainer]);

    // Initial data loading
    useEffect(() => {
        const handleReload = async () => {
            const accessToken = localStorage.getItem("access_token");
            setIsLoadingChatsMessage(true);

            try {
                if (!accessToken || accessToken === "") {
                    throw new Error("Not authenticated");
                }

                var currentChatFormatted: ChatSchema | null = null;
                if (currentChat == null) {
                    const currentChatFromLocalStorage = localStorage.getItem("currentChat");

                    if (currentChatFromLocalStorage)
                        currentChatFormatted = JSON.parse(currentChatFromLocalStorage);

                    if (currentChatFormatted)
                        handleChangeCurrentChat(currentChatFormatted);
                }

                if (currentChatFormatted !== null) {
                    await loadAIMessagesFromChat(currentChatFormatted.chatId, accessToken);
                    await loadHumanMessagesFromChat(currentChatFormatted.chatId, accessToken);
                } else if (currentChat !== null) {
                    await loadAIMessagesFromChat(currentChat.chatId, accessToken);
                    await loadHumanMessagesFromChat(currentChat.chatId, accessToken);
                } else {
                    localStorage.removeItem("currentChat");
                    setCurrentChatToNull();
                    setTempHumanMessageToNull();
                    router.push("/main/chat/new");
                }

                setTempHumanMessageToNull();
            } catch (e) {
                clearLocalStorage();
                router.push("/auth/login");
                console.log(e);
            } finally {
                setIsLoadingChatsMessage(false);
            }
        }

        handleReload();
    }, [])

    const handleClickHumanMessage = async (humanMessage: HumanMessageResponseSchema) => {
        try {
            handleUpdateHumanMessageFetchLoading(true);
            setCurrentHumanMessageWithRetrievedDocumentsToNull();
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken || accessToken === "") {
                throw new Error("Not authenticated");
            }

            await loadRetrievedDocumentsFromHumanMessageId(humanMessage, accessToken);
        } catch (e) {
            clearLocalStorage();
            router.push("/auth/login");
            console.log(e);
        } finally {
            handleUpdateHumanMessageFetchLoading(false);
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start mx-[10%] h-full max-w-2xl px-2">
            {(humanMessages.length > 0 && aiMessages.length > 0) || shouldShowTempMessage ? (
                <div className="w-full space-y-8">
                    {/* Existing messages */}
                    {humanMessages.map((value, index) => (
                        <div key={`message-${value.id || index}`} className="w-full">
                            <HumanMessage humanMessage={value} handleClickHumanMessage={handleClickHumanMessage} />
                            {aiMessages[index] && (
                                <AIMessage aiMessages={aiMessages} index={index} />
                            )}
                            {index < humanMessages.length - 1 && (
                                <div className="flex justify-center my-8">
                                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Temporary message */}
                    {shouldShowTempMessage && (
                        <div className="w-full mb-8">
                            <div className="flex justify-end mb-4">
                                <div className="max-w-[85%] group">
                                    <div className="flex items-start justify-end mb-2">
                                        <div className="mr-3">
                                            <div className="text-xs text-purple-600 font-medium mb-1 text-right">You</div>
                                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-2xl rounded-tr-md shadow-lg opacity-90">
                                                <div className="font-medium leading-relaxed">
                                                    {tempHumanMessage}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center border-white border-2 rounded-full bg-purple-800 text-white w-8 h-8">
                                            {"john".charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isPending && (
                                <div className="flex items-center space-x-2 ml-4 mt-4">
                                    <div className="flex justify-center items-center border-gray-300 border-2 rounded-full bg-white w-8 h-8">
                                        <Bot className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-6 py-4 shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <svg className="animate-spin h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-sm text-gray-600">...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="w-full mb-8">
                            <div className="flex items-center space-x-2 ml-4">
                                <div className="flex justify-center items-center border-red-300 border-2 rounded-full bg-white w-8 h-8">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-md px-6 py-4 shadow-sm max-w-[85%]">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
                                            <p className="text-sm text-red-700 leading-relaxed">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 w-full h-full flex flex-col items-center justify-center">
                    {isLoadingChatsMessages ? (
                        <MessagesLoadingComponent />
                    ) : (
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-100 shadow-sm">
                            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-4 rounded-2xl inline-block mb-4">
                                <MessageSquarePlus className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a Conversation</h3>
                            <p className="text-gray-500 max-w-sm">
                                Ask me anything about the docs you send to me! I'm here to help you with information, analysis...
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    Questions
                                </span>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                    Analysis
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}