"use client";

import { useChat } from "@/hooks/chat-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearLocalStorage } from "@/utils/auth";
import RetrievedDocuments from "./retrieved-documents";
import { useDocsRetrieved } from "@/hooks/docs-context";

export default function DocBody() {
    const { 
        currentChat, 
        humanMessages, 
        loadHumanMessagesFromChat, 
        handleChangeCurrentChat,
        setCurrentChatToNull
    } = useChat();

    const {
        currentHumanMessageWithRetrievedDocuments,
        handleUpdateHumanMessageFetchLoading,
        loadRetrievedDocumentsFromHumanMessageId
    } = useDocsRetrieved();

    const router = useRouter();

    useEffect(() => {
        const handleReload = async () => {
            handleUpdateHumanMessageFetchLoading(true);
            try {
                const accessToken = localStorage.getItem("access_token");
                if(accessToken === null || accessToken === "") {
                    throw new Error("You're not authenticated");
                }

                var currentChatFormatted: ChatSchema | null = null;
                var humanMessageResponse: HumanMessageResponseSchema[] = [];
                if(currentChat == null) {
                    const currentChatFromLocalStorage = localStorage.getItem("currentChat");

                    if(currentChatFromLocalStorage)
                        currentChatFormatted = JSON.parse(currentChatFromLocalStorage);

                    if(currentChatFormatted)
                        handleChangeCurrentChat(currentChatFormatted);
                }

                if(currentChatFormatted) {
                    humanMessageResponse = await loadHumanMessagesFromChat(currentChatFormatted.chatId, accessToken);
                } else if(currentChat) {
                    humanMessageResponse = await loadHumanMessagesFromChat(currentChat.chatId, accessToken);
                } else {
                    localStorage.removeItem("currentChat");
                    setCurrentChatToNull();
                    router.push("/main/chat/new");
                }

                if(humanMessageResponse.length > 0)
                    await loadRetrievedDocumentsFromHumanMessageId(humanMessageResponse[humanMessageResponse.length - 1], accessToken);
            } catch(e) {
                clearLocalStorage();
                router.push("/auth/login");
                console.log(e);
            } finally {
                handleUpdateHumanMessageFetchLoading(false);
            }
        }

        handleReload();
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full px-2">
            <RetrievedDocuments documents={currentHumanMessageWithRetrievedDocuments?.documents} humanMessage={currentHumanMessageWithRetrievedDocuments?.humanMessage} />
        </div>
    )
}