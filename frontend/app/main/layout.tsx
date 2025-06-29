"use client";

import HeaderMain from "@/ui/component/header-main-app";
import SideBarMain from "@/ui/component/sidebar-main-app";
import ChatProvider from "@/hooks/chat-context";

import { useContext, createContext } from "react";

export default function Layout ({children}: {children: React.ReactNode}){
    return (
        <ChatProvider>
            <div className="flex flex-row h-screen bg-gray-100">
                <SideBarMain />
                <div className="flex-1 flex flex-col">
                    <div className="bg-blue-700">
                        <HeaderMain />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </ChatProvider>
    )
}