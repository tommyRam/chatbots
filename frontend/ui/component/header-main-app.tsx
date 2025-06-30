"use client";

import { Menu, MoreHorizontal } from "lucide-react";
import ProfileMenu from "../reusable_component/profile-menu";
import { useEffect, useState } from "react";
import { useChat } from "@/hooks/chat-context";
import { capitalizeFirstLetter } from "@/utils/transformers";
import { UserResponse } from "@/types/auth";
import { clearLocalStorage } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function HeaderMain() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const {
        currentChat,
    } = useChat();
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            const userDataFromLocalsStorage: string | null = localStorage.getItem("user_data");
            if(userDataFromLocalsStorage){
                setUser(JSON.parse(userDataFromLocalsStorage));
            } else {
                console.log("Not authenticated")
                clearLocalStorage();
                router.push("/auth/login");
            }
        }, 500);

        () => {
            setUser(null);
        }
    }, [])

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
                    <ProfileMenu userData={user}/>
                </div>
            </div>
        </div>
    )
}