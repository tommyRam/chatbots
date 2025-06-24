"use client";

import ChatMain from "@/ui/component/chat-section/chat-main-app";
import DocumentMain from "@/ui/component/document-section-main-app";
import ResizableLayout from "@/ui/component/resizable-layout";
import { useState } from "react";

export default function page() {
    const [message, setMessage] = useState<string>("");
    const [documents, setDocuments] = useState<[string]>([""]);

    return (
        <div className="flex-1 flex">
            <ResizableLayout
                leftComponent={
                <ChatMain 
                    message={message}
                    setMessage={setMessage}
                    setDocuments={setDocuments}
                />}
                rightComponent={
                <DocumentMain 
                    documents={documents}
                />}
            />
        </div>
    )
}