"use client";

import { useChat } from "@/hooks/chat-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/ui/reusable_component/profile-menu";
import { clearLocalStorage } from "@/utils/auth";

export default function ChatMessages() {
    const {
        aiMessages,
        humanMessages,
        currentChat,
        loadAIMessagesFromChat,
        loadHumanMessagesFromChat,
        handleChangeCurrentChat,
        setCurrentChatToNull
    } = useChat();
    const router = useRouter();

    useEffect(() => {
        const hanldleReload = async () => {
            const accessToken = localStorage.getItem("access_token");
            try {
                if (!accessToken || accessToken === "") {
                    throw new Error("Not authenticated");
                }

                var currentChatFormatted: ChatSchema | null = null;
                if(currentChat == null) {
                    const currentChatFromLocalStorage = localStorage.getItem("currentChat");

                    if(currentChatFromLocalStorage)
                        currentChatFormatted = JSON.parse(currentChatFromLocalStorage);

                    if(currentChatFormatted)
                        handleChangeCurrentChat(currentChatFormatted);
                }

                if(currentChatFormatted !== null) {
                    await loadAIMessagesFromChat(currentChatFormatted.chatId, accessToken);
                    await loadHumanMessagesFromChat(currentChatFormatted.chatId, accessToken);
                } else if(currentChat !== null) {
                    await loadAIMessagesFromChat(currentChat.chatId, accessToken);
                    await loadHumanMessagesFromChat(currentChat.chatId, accessToken);
                }else {
                    localStorage.removeItem("currentChat");
                    setCurrentChatToNull();
                    router.push("/main/chat/new");
                }
                
            }catch (e) {
                clearLocalStorage();
                router.push("/auth/login");
                console.log(e);
            }
        }

        hanldleReload();
    }, [])

    return (
        <div className="flex-1 flex flex-col items-center justify-start mx-[10%] h-full max-w-2xl px-2">
            {
                humanMessages.length > 0 ? (
                    humanMessages.map((value, index) => {
                        return (
                            <div key={index} className=" h-full mb-6">
                                <div className="flex items-center bg-purple-800 px-4 py-2 font-bold text-gray-200 rounded-xl mb-2.5">
                                    <ProfileMenu username="John" />
                                    <div className="ml-1.5">
                                        {value.content}
                                    </div>
                                </div>
                                <div className="flex justify-center px-6">
                                    {aiMessages[index]?.content}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div>No conversation</div>
                )
            }
        </div>
    )
}