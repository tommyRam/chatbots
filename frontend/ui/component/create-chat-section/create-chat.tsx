"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, ChevronRight } from 'lucide-react';

import Button from "@/ui/reusable_component/button";
import { createNewChat } from "@/api/chat-api";
import { transformChatResponse } from "@/utils/transformers";
import { useChat } from "@/hooks/chat-context";

export default function CreateChat() {
    const [chatName, setChatName] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<FileList>();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [creatingChatError, setCreatingChatError] = useState<string | null>(null);
    const [showCreatingChatModal, setShowCreatingChatModal] = useState<boolean>(false);
    const [isCreatingNewChatSuccess, setIsCreatingNewChatSuccess] = useState<boolean>(false);
    const router = useRouter();
    const {
        handleChangeCurrentChat,
        setCurrentChatToNull,
        loadChats
    } = useChat();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setChatName(e.target.value);
    };

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files ? e.target.files : new FileList();
        setSelectedFiles(files);
    };

    const handleSubmit = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();
        setIsPending(true);
        setCreatingChatError(null);

        try {
            const user_data = JSON.parse(localStorage.getItem("user_data") || "");
            if (!user_data) router.push("auth/login");

            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                router.push("auth/login");
                throw new Error("Expired credentials");
            }

            const formData = new FormData();
            formData.append("user_id", user_data.id);
            formData.append("chat_name", chatName);

            for (let i = 0; selectedFiles && i < selectedFiles.length; i++) {
                formData.append("uploaded_files", selectedFiles[i]);
            }

            const newChat = await createNewChat(formData, accessToken, "/api/chat/create");
            const newChatFormatted = transformChatResponse(newChat);

            localStorage.setItem("currentChat", JSON.stringify(newChatFormatted));
            handleChangeCurrentChat(newChatFormatted);
            await loadChats(user_data.id, accessToken);

            setIsCreatingNewChatSuccess(true);
            setShowCreatingChatModal(true);

            setTimeout(() => {
                setShowCreatingChatModal(false);
                router.push(`/main/chat/${newChatFormatted.chatId}`);
            }, 3000);
        } catch (e) {
            localStorage.removeItem("currentChat");
            setCurrentChatToNull();
            setCreatingChatError("An error occurred while creating the chat.");
            setIsCreatingNewChatSuccess(false);
            setShowCreatingChatModal(true);

            setTimeout(() => setShowCreatingChatModal(false), 3000);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 px-4 py-12">
            {
                showCreatingChatModal && (
                    isCreatingNewChatSuccess ? (
                        <div className="absolute flex items-center justify-center top-12 left-[50%] px-3.5 py-1.5 h-11 w-[21%] bg-green-400 text-white font-bold rounded-md">Chat created successfully!!!</div>
                    ) : (
                        <div className="absolute flex items-center justify-center top-12 left-[50%] px-3.5 py-1.5 h-11 w-[21%] bg-red-500 text-white font-bold rounded-md">Creating new chat failed!!!</div>
                    )
                )
            }
            <div className="max-w-6xl mx-auto px-4 pb-6">
                <div className="text-center mb-9">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
                    <p className="text-gray-600">Upload documents and chat with your data</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-9">
                    {[
                        {
                            step: "01",
                            title: "Upload Your Data",
                            description: "Import your documents, knowledge base, or custom dataset"
                        },
                        {
                            step: "02",
                            title: "Choose RAG Types",
                            description: "Select from our comprehensive library of RAG implementations"
                        },
                        {
                            step: "03",
                            title: "Test & Compare",
                            description: "Run tests, analyze results, and integrate the best solution"
                        }
                    ].map((item, index) => (
                        <div key={index} className="text-center relative">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                            {index < 2 && (
                                <ChevronRight className="w-6 h-6 text-gray-400 absolute top-8 -right-3 hidden md:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-semibold text-purple-700 mb-6 flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    Create New Chat
                </h3>
                {/* 
                {showCreatingChatModal && (
                    <div className={`mb-4 px-4 py-2 rounded text-white text-sm font-medium ${isCreatingNewChatSuccess ? "bg-green-500" : "bg-red-500"}`}>
                        {isCreatingNewChatSuccess ? "Chat created successfully!" : "Creating chat failed."}
                    </div>
                )} */}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="chat_name" className="block mb-1 text-gray-700">Chat Name</label>
                        <input
                            id="chat_name"
                            type="text"
                            required
                            value={chatName}
                            onChange={handleInputChange}
                            placeholder="e.g. Product FAQ Bot"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="document" className="block mb-1 text-gray-700">Upload Document</label>
                        <input
                            id="document"
                            type="file"
                            required
                            accept=".pdf,.txt,.docx,.doc"
                            onChange={handleUploadFile}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 file:text-purple-700 file:bg-purple-100 file:border-0 file:px-4 file:py-1 file:rounded file:mr-3"
                        />
                    </div>

                    {creatingChatError && (
                        <p className="text-red-500 text-sm">{creatingChatError}</p>
                    )}

                    <Button
                        buttonName="Create Chat"
                        actionName="Creating..."
                        isPending={isPending}
                        action={handleSubmit}
                        style="w-full bg-purple-600 text-white hover:bg-purple-700"
                    />
                </form>
            </div>
        </div>
    );
}
