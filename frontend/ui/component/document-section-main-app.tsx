"use client";

import { ChangeEvent, FormEvent, useState } from "react";

interface DocumentMainProps {
    documents?: DocMessageResponse[];
}

export default function DocumentMain(
    {
        documents
    }: DocumentMainProps
) {
    const [chatName, setChatName] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<FileList>();
    const [isPending, setIsPending] = useState<boolean>(false);

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
        console.log("submitting...")
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

            const response = await fetch(
                "http://127.0.0.1:8000/api/chat/create",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: formData
                }
            ) 
            console.log("====================\nresponse: " + JSON.stringify(response))
            if(!response.ok){
                const errorResponse = await response.json();
                throw new Error(errorResponse.detail);
            }

        const ans =  await response.json();
        console.log("ans " + JSON.stringify(ans))
        } catch(e){
            console.log("" + JSON.stringify(e))
        }finally {
            setIsPending(false);
        }
    }

    return (
        <div className="w-full h-[98%] mr-2. bg-white shadow-gray-700 inset-shadow-2xs inset-shadow-indigo-50">
            Documents list: 
            <div>
            {
                documents && documents.map((document) => (
                    <div key={document.content.length}>
                        {document.content}
                    </div>
                ))
                // documents
            }
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <label>Chat name</label>
                    <input
                        id="chat_name"
                        value={chatName}
                        type="text"
                        onChange={handleInputChange}
                        placeholder="Chat name"
                    />
                    <label>Document</label>
                    <input 
                        id="document"
                        type="file"
                        accept=".pdf,.txt,.docx, .doc"
                        onChange={handleUploadFile}
                    />
                    <button>{isPending ? "uploading..." : "upload"}</button>

                </form>
            </div>
        </div>
    )
}