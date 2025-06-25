"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Upload, Plus } from 'lucide-react';
import Button from "@/ui/reusable_component/button";
import { createNewChat } from "@/api/chat-api";

export default function CreateChat() {
    const [chatName, setChatName] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<FileList>();
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setChatName(e.target.value);
        console.log("chat name:" + chatName);
    }

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files ? e.target.files : new FileList();

        setSelectedFiles(files);
        console.log("selected files:" + selectedFiles);
    }
        
    const handleSubmit = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();
        setIsPending(true);
        try {
            const user_data = JSON.parse(localStorage.getItem("user_data") || "");
            const accessToken = localStorage.getItem("access_token");
            const formData = new FormData();
            formData.append("user_id", user_data.id);
            formData.append("chat_name", chatName);

            for (let i = 0;selectedFiles && i < selectedFiles.length; i++) {
                formData.append("uploaded_files", selectedFiles[i]);
            }

            if (!accessToken) {
                router.push("auth/login");
                throw new Error("Expired credentials");
            }
            const response = await createNewChat(formData, accessToken, "/api/chat/create");
        } catch(e){
            console.log("" + JSON.stringify(e))
        }finally {
            setIsPending(false);
        }
    }

    
    return (
        <div className="h-full flex justify-center items-center">
            <div className="flex flex-col items-center max-w-lg w-[60%] h-[45%] rounded-lg bg-purple-50 p-2.5">
                <div className="flex items-center justify-center text-2xl font-bold text-gray-600">
                    <Plus className="h-7 w-7 mx-2 border-purple-500 border-2 bg-purple-400 text-white rounded-full" /> 
                    Create new chat
                </div>
                <div className="flex-1 flex justify-center w-full h-full pt-5">
                    <form 
                        className="ml-14"
                        onSubmit={handleSubmit}>
                        <div className="flex flex-col justify-center items-start py-2.5">
                            <label className="text-gray-600">
                                Chat name
                            </label>
                            <input
                                id="chat_name"
                                value={chatName}
                                type="text"
                                onChange={handleInputChange}
                                placeholder="Chat name"
                                className="bg-white border-2 border-gray-400 focus:outline-none focus:border-purple-700 w-[80%] h-10 rounded-md px-3 py-0.5"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-start py-2.5">
                            <label className="text-gray-600">Document</label>
                            <div className="relative w-[80%]">
                                <input 
                                    id="document"
                                    type="file"
                                    accept=".pdf,.txt,.docx, .doc"
                                    onChange={handleUploadFile}
                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 transition-all duration-300 ease-in-out hover:border-purple-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-purple-700 hover:file:bg-purple-200 file:opacity-0 file:w-0"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                                    <div className="flex justify-center items-center bg-purple-100 hover:bg-purple-900 hover:cursor-pointer px-2.5 py-2.5 rounded">
                                    <Upload className="w-4 h-4 text-purple-700" />
                                    {/* <span className="text-sm font-medium text-purple-700">Choose File</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>                 
                        <div className="py-5">
                            <Button 
                                buttonName="Upload"
                                actionName="Uploading..."
                                isPending={isPending}
                                style={"w-[80%]"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}