"use client";

import { useState } from "react";

import ChatMain from "@/ui/component/chat-section/chat-main-app";
import DocumentMain from "@/ui/component/document-section-main-app";
import ResizableLayout from "@/ui/component/resizable-layout";


export default function Chat() {
    const [message, setMessage] = useState<string>("");
    const [documents, setDocuments] = useState<DocMessageResponse[]>([]);
    
    return (
        <ResizableLayout
            leftComponent={
                <ChatMain 
                    message={message}
                    setMessage={setMessage}
                    setDocuments={setDocuments}
                />
            }
            rightComponent={
                <DocumentMain 
                    documents={documents}
                />
            }
        />
    )
}