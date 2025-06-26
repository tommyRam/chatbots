"use client";

import { createNewChat, getUserChatList, sendUserInput } from "@/api/chat-api";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transformChatResponse, transformMessageResponse } from "@/utils/transformers";

interface ChatContextType {
    chats: ChatSchema[],
    currentChat: ChatSchema | null,
    handleAddAllChat: (chats: ChatSchema[]) => void;
    handleAddChat: (newChat: ChatSchema) => void;
    handleChangeCurrentChat: (newChat: ChatSchema) => void;
    removeCurrentChat: () => void;
    createChat: (formData: FormData, accessToken: string) => Promise<ChatSchema>,
    sendMessage: (message: string, accessToken: string) => Promise<MessageResponse>
    loadChats: (userId: string, accessToken: string) => Promise<ChatSchema[]>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default function ChatProvider (
    { children } : { children : React.ReactNode }
) {
    const [chats, setChats] = useState<ChatSchema[]>([]);
    const [currentChat, setCurrentChat] = useState<ChatSchema | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (chats.length === 0){
            const user_data = JSON.parse(localStorage.getItem("user_data") || "");
            const accessToken = localStorage.getItem("access_token") || "";

            if (user_data === "" || accessToken === ""){
                router.push("auth/login");
            }
            loadChats(user_data.id, accessToken);
        }

        const currentChatFromLocalStorage = JSON.parse(localStorage.getItem("currentChat") || "");
        if(currentChatFromLocalStorage !== ""){
            handleChangeCurrentChat(currentChatFromLocalStorage);
        }
    }, []);

    const handleAddChat = (newChat: ChatSchema): void => {
        setChats(prev => [...prev, newChat]);
    }

    const handleAddAllChat = (chats: ChatSchema[]): void => {
        setChats(chats);
    }

    const handleChangeCurrentChat = (newChat: ChatSchema): void => {
        setCurrentChat(newChat);
    }

    const removeCurrentChat = (): void => {
        setCurrentChat(null);
    }

    const createChat = async (formData: FormData, accessToken: string): Promise<ChatSchema> => {
        try {
            const createdChat: BackendchatSchema = await createNewChat(formData, accessToken);
            const createdChatFormatted = transformChatResponse(createdChat);
            handleChangeCurrentChat(createdChatFormatted);
            handleAddChat(createdChatFormatted);
            return createdChatFormatted;
        } catch (e) {
            throw new Error("Can't create new chat: " + JSON.stringify(e));
        }
    }

    const sendMessage = async (message: string, accessToken: string): Promise<MessageResponse> => {
        try {
            const newMessageResponse: BackendMessageResponse = await sendUserInput(message, accessToken=accessToken);
            const newMessageResponseFormatted: MessageResponse = transformMessageResponse(newMessageResponse);
            return newMessageResponseFormatted;
        } catch (e) {
            throw new Error("Can't send message" + JSON.stringify(e));
        }
    }

    const loadChats = async (userId: string, accessToken: string): Promise<ChatSchema[]> => {
        try {
            const chatList: BackendchatSchema[] = await getUserChatList(userId, accessToken);
            const chatListFormatted: ChatSchema[] = chatList.map((value: BackendchatSchema) => transformChatResponse(value));
            handleAddAllChat(chatListFormatted);
            return chatListFormatted;
        } catch(e) {
            throw new Error("Can't load user chat lists: " + JSON.stringify(e));
        }
    }

    const value = {
        chats,
        currentChat,
        handleAddAllChat,
        handleAddChat,
        handleChangeCurrentChat,
        removeCurrentChat,
        createChat,
        sendMessage,
        loadChats
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);

    if (context == null) {
        throw new Error("useChat must be used inside a ChatProvider!")
    }

    return context;
}