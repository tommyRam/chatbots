"use client";

import CreateChat from "@/ui/component/create-chat-section/create-chat";
import ResizableLayout from "@/ui/component/resizable-layout";
import { usePathname } from "next/navigation";
import { useChat } from "@/hooks/chat-context";

export default function NewChatMain() {

    return (
        <ResizableLayout
            leftComponent={
                <div className="w-full h-full bg-white">
                    <CreateChat />
                </div>
            }
            rightComponent={
                <div className="w-full h-full bg-white">
                    <div className="w-full h-full flex justify-center items-center">No document</div>
                </div>
            }
        />
    )
}