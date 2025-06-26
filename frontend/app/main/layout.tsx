"use client";

import HeaderMain from "@/ui/component/header-main-app";
import SideBarMain from "@/ui/component/sidebar-main-app";
import ChatProvider from "@/hooks/chat-context";

import { useContext, createContext } from "react";

export default function Layout ({children}: {children: React.ReactNode}){
    return (
        <div className="flex flex-row h-screen bg-gray-100">
            <ChatProvider>
                <SideBarMain />
                <div className="flex-1 flex flex-col">
                    <HeaderMain />
                    {children}
                </div>
            </ChatProvider>
        </div>
    )
}