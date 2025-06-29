"use client";

import { ChevronLeft, Menu, MessageCircleMoreIcon, Plus, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@/hooks/chat-context";
import { capitalizeFirstLetter } from "@/utils/transformers";

export default function SideBarMain () {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const {
        chats,
        currentChat,
        handleChangeCurrentChat,
        removeCurrentChat,
        setCurrentHumanMessageWithRetrievedDocumentsToNull
    } = useChat();
    const router = useRouter();
    const pathname = usePathname();

    if(pathname === "/main/chat/new") {
        setCurrentHumanMessageWithRetrievedDocumentsToNull();
    }

    const toogleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    const handleSetCurrentChat = (index: number): void => {
        handleChangeCurrentChat(chats[index]);
        setCurrentHumanMessageWithRetrievedDocumentsToNull();
        localStorage.setItem("currentChat", JSON.stringify(chats[index]));

        router.push(`${chats[index].chatId}`);
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
                border-r-4 border-gray-400
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
                        <div className="font-bold text-xs text-gray-700">
                            Recents chat
                        </div>
                        <div className="mt-1">
                            {
                                chats && (
                                    chats.map((value, index) => {
                                        return (
                                            <div 
                                                onClick={() => handleSetCurrentChat(index)}
                                                key={value.chatId} 
                                                className={`flex items-center justify-between my-2 py-1.5 px-1.5 hover:cursor-pointer rounded-lg ${currentChat?.chatId === value.chatId ? "bg-purple-900 hover:bg-purple-800" : "bg-white hover:bg-purple-50 "}`}
                                            >
                                                <div className={`overflow-hidden font-bold  ${currentChat?.chatId === value.chatId ? "text-white" : "text-gray-500"}`}>
                                                    {capitalizeFirstLetter(value.chatName)}
                                                </div>
                                                <div className="flex items-center justify-center rounded-md hover:cursor-pointer hover:border-[0.5px] border-gray-600 w-7 h-7">
                                                    <TrashIcon  className={`hover:text-purple-950 h-4 w-4 hover:h-3.5 hover:w-3.5 ${currentChat?.chatId === value.chatId ? "text-white" : "text-gray-500" }`}/>
                                                </div>                                                               
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    </>
                   }
                </div>
            </div>                    
        </div>
    )
}