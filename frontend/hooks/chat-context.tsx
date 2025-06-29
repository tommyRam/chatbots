"use client";

import { 
    createNewChat, 
    getAIMessageFromChat, 
    getHumanMessageFromChat, 
    getUserChatList, 
    sendUserInput,
    getLatestAIMessageFromChat,
    getLatestHumanMessageFromChat,
    getRetrievedDocuments
} from "@/api/chat-api";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    transfomAIMessageResponseSchema, 
    transformChatResponse, 
    transformMessageResponse, 
    transfomHumanMessageResponseSchema ,
    transformDocumentResponse
} from "@/utils/transformers";
import { clearLocalStorage } from "@/utils/auth";

interface ChatContextType {
    chats: ChatSchema[],
    aiMessages: AIMessageResponseSchema[],
    humanMessages: HumanMessageResponseSchema[],
    currentChat: ChatSchema | null;
    currentHumanMessageWithRetrievedDocuments: HumanMessageWithRetrievedDocumentSchema | null;
    handleAddChat: (newChat: ChatSchema) => void;
    handleAddAllChat: (chats: ChatSchema[]) => void;
    handleAddAIMessage: (newAIMessage: AIMessageResponseSchema) => void;
    handleAddAllAIMessages: (allAIMessages: AIMessageResponseSchema[]) => void;
    handleAddHumanMessage: (newHumanMessage: HumanMessageResponseSchema) => void;
    handleAddAllHumanMessages: (allHumanMessages: HumanMessageResponseSchema[]) => void;  
    handleChangeCurrentChat: (newChat: ChatSchema) => void;
    setCurrentChatToNull: () => void;
    removeCurrentChat: () => void;
    createChat: (formData: FormData, accessToken: string) => Promise<ChatSchema>,
    sendMessage: (message: string, chatId: string, accessToken: string) => Promise<MessageResponse>;
    loadChats: (userId: string, accessToken: string) => Promise<ChatSchema[]>;
    loadAIMessagesFromChat: (chatId: string, accessToken: string) => Promise<AIMessageResponseSchema[]>;
    loadHumanMessagesFromChat: (chatId: string, accessToken: string) => Promise<HumanMessageResponseSchema[]>;
    loadLatestAIMessageFromChat: (chatId: string, accessToken: string) => Promise<AIMessageResponseSchema>;
    loadLatestHumanMessageFromChat: (chatId: string, accessToken: string) => Promise<HumanMessageResponseSchema>;
    loadRetrievedDocumentsFromHumanMessageId: (humanMessage: HumanMessageResponseSchema, accessToken: string) => Promise<HumanMessageWithRetrievedDocumentSchema>;
    setCurrentHumanMessageWithRetrievedDocumentsToNull: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default function ChatProvider (
    { children } : { children : React.ReactNode }
) {
    const [chats, setChats] = useState<ChatSchema[]>([]);
    const [aiMessages, setAIMessages] = useState<AIMessageResponseSchema[]>([]);
    const [humanMessages, setHumanMessages] = useState<HumanMessageResponseSchema[]>([]);
    const [currentChat, setCurrentChat] = useState<ChatSchema | null>(null);
    const [currentHumanMessageWithRetrievedDocuments, setCurrentHumanMessageWithRetrievedDocuments] = useState<HumanMessageWithRetrievedDocumentSchema | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            if (chats.length === 0){
                const userDataString = localStorage.getItem("user_data");
                const accessToken = localStorage.getItem("access_token");

                if (userDataString === "" || userDataString === null || accessToken === null){
                    throw new Error("User not authenticated")
                }

                const userDataFormatted = JSON.parse(userDataString);
                loadChats(userDataFormatted.id, accessToken);
            }

            const currentChat = localStorage.getItem("currentChat");

            if (currentChat) {
                const currentChatFromLocalStorage = JSON.parse(currentChat);
                handleChangeCurrentChat(currentChatFromLocalStorage);
            }
        } catch(e) {
            console.log(e);
            clearLocalStorage();
            router.push("/auth/login");
        }
    }, []);

    const handleAddChat = (newChat: ChatSchema): void => {
        setChats(prev => [...prev, newChat]);
    }

    const handleAddAllChat = (chats: ChatSchema[]): void => {
        setChats(chats);
    }

    const handleAddAIMessage = (newAIMessage: AIMessageResponseSchema): void => {
        setAIMessages(prev => [...prev, newAIMessage]);
    }

    const handleAddAllAIMessages = (allAIMessages: AIMessageResponseSchema[]): void => {
        setAIMessages(allAIMessages);
    }

    const handleAddHumanMessage = (newHumanMessage: HumanMessageResponseSchema): void => {
        setHumanMessages(prev => [...prev, newHumanMessage]);
    }

    const handleAddAllHumanMessages = (allHumanMessages: HumanMessageResponseSchema[]): void => {
        setHumanMessages(allHumanMessages);
    }

    const handleChangeCurrentChat = (newChat: ChatSchema): void => {
        setCurrentChat(newChat);
    }

    const setCurrentChatToNull = (): void => {
        setCurrentChat(null);
    }

    const handleChangeCurrentHumanMessageWithRetrievedDocuments = (newcurrentHumanMessageWithRetrievedDocuments: HumanMessageWithRetrievedDocumentSchema): void => {
        setCurrentHumanMessageWithRetrievedDocuments(newcurrentHumanMessageWithRetrievedDocuments);
    }

    const setCurrentHumanMessageWithRetrievedDocumentsToNull = (): void => {
        setCurrentHumanMessageWithRetrievedDocuments(null);
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
            throw new Error("Can't create new chat: " + e);
        }
    }

    const sendMessage = async (message: string, chatId: string, accessToken: string): Promise<MessageResponse> => {
        try {
            const newMessageResponse: BackendMessageResponse = await sendUserInput(message, chatId, accessToken=accessToken);
            const newMessageResponseFormatted: MessageResponse = transformMessageResponse(newMessageResponse);
            return newMessageResponseFormatted;
        } catch (e) {
            throw new Error("Can't send message" + e);
        }
    }

    const loadChats = async (userId: string, accessToken: string): Promise<ChatSchema[]> => {
        try {
            const chatList: BackendchatSchema[] = await getUserChatList(userId, accessToken);
            const chatListFormatted: ChatSchema[] = chatList.map((value: BackendchatSchema) => transformChatResponse(value));
            handleAddAllChat(chatListFormatted);
            return chatListFormatted;
        } catch(e) {
            throw new Error("Can't load user chat lists: " + e);
        }
    }

    const loadAIMessagesFromChat = async (chatId: string, accessToken: string): Promise<AIMessageResponseSchema[]> => {
        try {
            const aiMessageList: BackendAIMessageResponseSChema[] = await getAIMessageFromChat(chatId, accessToken);
            const aiMessageFormatted: AIMessageResponseSchema[] = aiMessageList.map((value: BackendAIMessageResponseSChema) => transfomAIMessageResponseSchema(value));
            handleAddAllAIMessages(aiMessageFormatted);
            return aiMessageFormatted;
        } catch(e) {
            throw new Error("Can't load AI messages responses: " + e);
        }
    }

    const loadHumanMessagesFromChat = async (chatId: string, accessToken: string): Promise<HumanMessageResponseSchema[]>  => {
        try {
            const humanMessageList: BackendHumanMessageResponseSChema[] = await getHumanMessageFromChat(chatId, accessToken);
            const humanMessageFormatted: HumanMessageResponseSchema[] = humanMessageList.map((value: BackendHumanMessageResponseSChema) => transfomHumanMessageResponseSchema(value));
            handleAddAllHumanMessages(humanMessageFormatted);
            return humanMessageFormatted;
        } catch(e) {
            throw new Error("Can't load Human messages query: " + e);
        }
    }

    const loadLatestAIMessageFromChat = async (chatId: string, accessToken: string): Promise<AIMessageResponseSchema> => {
        try {
            const latestAIMessage: BackendAIMessageResponseSChema = await getLatestAIMessageFromChat(chatId, accessToken);
            const latestAIMessageFormatted: AIMessageResponseSchema = transfomAIMessageResponseSchema(latestAIMessage);
            handleAddAIMessage(latestAIMessageFormatted);
            return latestAIMessageFormatted;
        } catch(e) {
            throw new Error("Can't load latest ai response: " + e);
        }
    }

    const loadLatestHumanMessageFromChat = async (chatId: string, accessToken: string): Promise<HumanMessageResponseSchema> => {
        try {
            const latestHumanMessage: BackendHumanMessageResponseSChema = await getLatestHumanMessageFromChat(chatId, accessToken);
            const latestHumanMessageFormatted: HumanMessageResponseSchema = transfomHumanMessageResponseSchema(latestHumanMessage);
            handleAddHumanMessage(latestHumanMessageFormatted);
            return latestHumanMessageFormatted;
        } catch(e) {
            throw new Error("Can't load latest human message query: " + e);
        }
    }

    const loadRetrievedDocumentsFromHumanMessageId = async (humanMessage: HumanMessageResponseSchema, accessToken: string): Promise<HumanMessageWithRetrievedDocumentSchema> => {
        try {
            if(!humanMessage.id){
                throw new Error("The id of the humman message is required before retrieving the related documents!")
            }

            const retrievedDocuments: BackendRetrievedDocumentResponse[] = await getRetrievedDocuments(humanMessage.id, accessToken);
            const retrievedDocumentsFormatted: RetrievedDocumentResponse[] = retrievedDocuments.map((value: BackendRetrievedDocumentResponse) => transformDocumentResponse(value));
            const humanMessageWithRetrievedDocument: HumanMessageWithRetrievedDocumentSchema = {
                humanMessage:humanMessage,
                documents:retrievedDocumentsFormatted
            }
            handleChangeCurrentHumanMessageWithRetrievedDocuments(humanMessageWithRetrievedDocument);
            return humanMessageWithRetrievedDocument
        } catch(e) {
            throw new Error("Can't load retrieved documents from human message: " + e);
        }
    }

    const value = {
        chats,
        aiMessages,
        humanMessages,
        currentChat,
        currentHumanMessageWithRetrievedDocuments,
        handleAddAllChat,
        handleAddChat,
        handleAddAIMessage,
        handleAddAllAIMessages,
        handleAddHumanMessage,
        handleAddAllHumanMessages,
        handleChangeCurrentChat,
        setCurrentChatToNull,
        removeCurrentChat,
        createChat,
        sendMessage,
        loadChats,
        loadAIMessagesFromChat,
        loadHumanMessagesFromChat,
        loadLatestAIMessageFromChat,
        loadLatestHumanMessageFromChat,
        loadRetrievedDocumentsFromHumanMessageId,
        setCurrentHumanMessageWithRetrievedDocumentsToNull
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