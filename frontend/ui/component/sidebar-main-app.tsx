"use client";

import { ChevronLeft, Menu, MessageCircleMoreIcon, Plus, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@/hooks/chat-context";
import { capitalizeFirstLetter } from "@/utils/transformers";
import { useDocsRetrieved } from "@/hooks/docs-context";

export default function SideBarMain () {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const {
        chats,
        currentChat,
        handleChangeCurrentChat,
        removeCurrentChat,
        setCurrentChatToNull,
        handleClearAIMessages, 
        handleClearHumanMessages
    } = useChat();

    const {
        setCurrentHumanMessageWithRetrievedDocumentsToNull
    } = useDocsRetrieved();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const currentChatFromStorage = localStorage.getItem("currentChat");
        if(currentChatFromStorage === null)
            setCurrentChatToNull();
    }, [])

    const toogleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    const handleSetCurrentChat = (index: number): void => {
        if(currentChat?.chatId === chats[index].chatId) {
            return;
        }

        router.push(`${chats[index].chatId}`);
        setCurrentHumanMessageWithRetrievedDocumentsToNull();
        handleClearAIMessages();
        handleClearHumanMessages();
        setCurrentChatToNull();
        handleChangeCurrentChat(chats[index]);
        localStorage.setItem("currentChat", JSON.stringify(chats[index]));
    }

    const handleCreateNewChat = (): void => {
        removeCurrentChat();
        setCurrentHumanMessageWithRetrievedDocumentsToNull();
        localStorage.removeItem("currentChat");

        router.push("/main/chat/new");
    }

    return (
        <div
            className={`
                ${isCollapsed ? 'w-16' : 'w-3xs'}
                h-full
                bg-white transition-all duration-300 ease-in-out
                flex flex-col shadow-sm 
                items-center
                border-r-2 border-gray-400
            `}
        >
            <div 
                className="flex items-center justify-between px-3.5 py-5 w-full border-b border-gray-100 h-14"
            >
                {!isCollapsed && (
                        <div className="text-purple-950 font-bold text-3xl">
                            RAnGo
                        </div>
                    )}
                <button
                    onClick={toogleSidebar}
                >
                    {isCollapsed ? (
                            <Menu className="h-7 w-7 text-gray-600" />
                        ) : (
                            <ChevronLeft className="h-8 w-8 text-gray-600" />
                        )}
                </button>
            </div>

            <div className="p-4 w-full h-full flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col">
                    <button 
                        className={`
                        ${isCollapsed ? 'w-9 h-9 p-0' : 'w-full px-4 py-2'} 
                        bg-purple-900 hover:bg-purple-700 
                        text-white rounded-lg 
                        transition-all duration-200 
                        flex items-center justify-center gap-2
                        font-medium
                        hover: cursor-pointer
                        `}
                        onClick={handleCreateNewChat}
                    >
                        <Plus className="h-5 w-5" />
                        {!isCollapsed && <span>New Chat</span>}
                    </button>    
                    <button
                        className={`
                        ${isCollapsed ? 'w-9 h-9 p-0' : 'w-full px-4 py-2'}
                        mt-3.5
                        hover:bg-purple-700
                        text-gray-600 hover:text-white
                        hover:cursor-pointer
                        rounded-lg
                        shadow-inner shadow-purple-100 hover:shadow-none
                        flex items-center justify-center gap-2
                        font-medium
                        `}  
                    >
                        <MessageCircleMoreIcon className="h-5 w-5" />
                        {!isCollapsed && <span>Chats</span>}
                    </button>                
                </div>
                <div className="h-[80%] w-full">
                   {
                    !isCollapsed && 
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 px-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <h3 className="text-sm font-semibold text-gray-700">RECENT CHATS</h3>
                            </div>
                            
                            <div className="space-y-1">
                                {chats?.map((chat, index) => (
                                    <div 
                                        key={chat.chatId}
                                        onClick={() => handleSetCurrentChat(index)}
                                        className={`
                                            group relative flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                                            ${currentChat?.chatId === chat.chatId 
                                                ? "bg-purple-600 text-white shadow-sm" 
                                                : "text-gray-700 hover:bg-purple-50 border border-transparent hover:border-purple-100"
                                            }
                                        `}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`
                                                text-sm font-medium truncate
                                                ${currentChat?.chatId === chat.chatId ? "text-white" : "text-gray-800"}
                                            `}>
                                                {capitalizeFirstLetter(chat.chatName)}
                                            </p>
                                        </div>
                                        
                                        <div className={`
                                            ml-2 transition-opacity duration-200
                                            ${currentChat?.chatId === chat.chatId 
                                                ? "opacity-100" 
                                                : "opacity-0 group-hover:opacity-60"
                                            }
                                        `}>
                                            {currentChat?.chatId === chat.chatId ? (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            ) : (
                                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                   }
                </div>
            </div>                    
        </div>
    )
}