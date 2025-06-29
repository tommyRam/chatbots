"use client";

import { useChat } from "@/hooks/chat-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearLocalStorage } from "@/utils/auth";
import RetrievedDocuments from "./retrieved-documents";

export default function DocBody() {
    const { 
        currentChat, 
        currentHumanMessageWithRetrievedDocuments, 
        humanMessages, 
        loadHumanMessagesFromChat, 
        handleChangeCurrentChat,
        loadRetrievedDocumentsFromHumanMessageId,
        setCurrentChatToNull
    } = useChat();
    const router = useRouter();

    useEffect(() => {
        const handleReload = async () => {
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
            }
        }

        handleReload();
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-start mx-[3%] h-full max-w-2xl px-2">
            {
                currentHumanMessageWithRetrievedDocuments ? (
                    <div className="w-full mb-5">
                        <div className="text-xl font-bold text-gray-900"> Related question</div>
                        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm font-bold text-gray-600">{currentHumanMessageWithRetrievedDocuments?.humanMessage.content}</div>
                    </div>
                ) : (<div></div>)
            }
            <RetrievedDocuments documents={currentHumanMessageWithRetrievedDocuments?.documents} />
        </div>
    )
}