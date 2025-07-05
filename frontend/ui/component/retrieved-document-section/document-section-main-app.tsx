"use client";

import { useState } from "react";
import DocBody from "./doc-body";
import DocHeader from "./doc-header";
import RAGCode from "./rag-code";

export default function DocumentMain() {
    const [showRetrievedDocuments, setShowRetrievedDocuments] = useState<boolean>(true);

    return (
        <div className="h-full w-full flex flex-col ">
            <div className="border-b-gray-100 border-b">
                <DocHeader
                    showRetrievedDocuments={showRetrievedDocuments}
                    setShowRetrievedDocuments={setShowRetrievedDocuments}
                />
            </div>
            <div className="flex-1 flex justify-center pt-0.5 overflow-y-auto pretty-scrollbar-minimal">
                {
                    showRetrievedDocuments ? (
                        <DocBody />
                    ) : (
                        <RAGCode />
                    )
                }
            </div>
        </div>
    )
}