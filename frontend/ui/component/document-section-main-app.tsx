"use client";

import { useChat } from "@/hooks/chat-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearLocalStorage } from "@/utils/auth";

export default function DocumentMain() {
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
        <div className="w-full h-full mr-2. bg-white shadow-gray-700 inset-shadow-2xs inset-shadow-indigo-50">
           {
            currentHumanMessageWithRetrievedDocuments ? 
                (
                    <div className="flex flex-col items-center">
                        <div className="flex-1 flex flex-col items-center">
                            <div>Human query</div>
                            <div>{currentHumanMessageWithRetrievedDocuments.humanMessage.content}</div>
                            <div>{currentHumanMessageWithRetrievedDocuments.documents.length}</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <div>Documents</div>
                            <div className="flex-1 flex flex-col items-center">
                                {
                                    currentHumanMessageWithRetrievedDocuments.documents.map((value, index) => {
                                        console.log(value);
                                        return (
                                            <div key={index} className="py-2.5">
                                                {value.content}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>No documents</div>
                )
           }
        </div>
    )
}