"use client";

import CreateChat from "../create-chat-section/create-chat";
import Chat from "./chat-app";

interface ChatMainProps {
    message: string;
    setMessage: (newMessage: string) => void;
    setDocuments: (newDocuments: DocMessageResponse[]) => void;
}

export default function ChatMain(
    {
        message,
        setMessage,
        setDocuments
    }: ChatMainProps
) {
    return (
        <div className="w-full h-[98%] ml-2.5 bg-white rounded-lg shadow-gray-700 inset-shadow-2xs inset-shadow-indigo-50">
            <Chat
                message={message}
                setMessage={setMessage}
                setDocuments={setDocuments}
            />
        </div>
    )
}