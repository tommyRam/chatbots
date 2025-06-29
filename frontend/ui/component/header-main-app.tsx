"use client";

import { Menu, MoreHorizontal } from "lucide-react";
import ProfileMenu from "../reusable_component/profile-menu";
import { useEffect, useState } from "react";
import { useChat } from "@/hooks/chat-context";
import { capitalizeFirstLetter } from "@/utils/transformers";

export default function HeaderMain() {
    const [username, setUsername] = useState<string>("");
    const {
        currentChat,
    } = useChat();

    useEffect(() => {
        const username = localStorage.getItem("user_data");
        if(username){
            setUsername(JSON.parse(username).username);
        }

        () => {
            setUsername("");
        }
    }, [username, setUsername])

    return (
        <div className="flex items-center justify-between w-full bg-gradient-to-b h-14 bg-white px-7 border-b-2 border-purple-800">
            <div></div>
           {
            currentChat && (
                <div className="flex items-center bg-gray-200 rounded-3xl text-2xs shadow-gray-300 shadow-inner h-[70%] text-gray-600 px-5">
                   {capitalizeFirstLetter(currentChat.chatName)}
                </div>
            )
           }
            <div 
                className="flex items-center justify-between w-21 h-full"    
            >
                <div className="flex items-center justify-center hover:bg-purple-300 hover:cursor-pointer w-9 h-9 rounded-md">
                    <MoreHorizontal />
                </div>
                <div className="flex items-center">
                    <ProfileMenu username={username}/>
                </div>
            </div>
        </div>
    )
}