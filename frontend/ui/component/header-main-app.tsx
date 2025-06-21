"use client";

import { Menu, MoreHorizontal } from "lucide-react";
import ProfileMenu from "../reusable_component/profile-menu";
import { useEffect, useState } from "react";

export default function HeaderMain() {
    const [username, setUsername] = useState<string>("");

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
        <div className="flex items-center justify-between w-full h-14 bg-gradient-to-b bg-gray-200 px-7">
            <div></div>
            <div
                className="flex items-center bg-gray-200 rounded-3xl shadow-gray-300 shadow-inner h-[70%] text-purple-950 font-bold px-3.5"
            >
                Actual chat name
            </div>
            <div 
                className="flex item-center justify-between w-21 h-[70%]"    
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