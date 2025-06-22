"use client";

import { ChevronLeft, Menu, MessageSquare, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function SideBarMain () {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toogleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    const menuItems = [
        {icon: MessageSquare, label: "Chat"},
        {icon: Search, label: "Search chat"}
    ]

    return (
        <div
            className={`
                ${isCollapsed ? 'w-16' : 'w-3xs'}
                h-full
                bg-purple-200 transition-all duration-300 ease-in-out
                flex flex-col shadow-sm 
                items-center
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

            <div className="p-4 w-full flex items-center justify-center">
                <button 
                    className={`
                    ${isCollapsed ? 'w-9 h-9 p-0' : 'w-full px-4 py-2'} 
                    bg-purple-900 hover:bg-purple-800 
                    text-white rounded-lg 
                    transition-all duration-200 
                    flex items-center justify-center gap-2
                    font-medium
                    `}
                >
                    <Plus className="h-4 w-4" />
                    {!isCollapsed && <span>New Chat</span>}
            </button>
            </div>                    
        </div>
    )
}