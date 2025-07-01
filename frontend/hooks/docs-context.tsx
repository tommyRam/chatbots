"use client";

import { getRetrievedDocuments } from "@/api/chat-api";
import { transformDocumentResponse } from "@/utils/transformers";
import React, { createContext, useContext, useState } from "react";

interface RetrievedDocsContextType {
    humanMessageFetchLoading: boolean;
    currentHumanMessageWithRetrievedDocuments: HumanMessageWithRetrievedDocumentSchema | null;
    handleUpdateHumanMessageFetchLoading: (newValue: boolean) => void;
    setCurrentHumanMessageWithRetrievedDocumentsToNull: () => void;
    loadRetrievedDocumentsFromHumanMessageId: (humanMessage: HumanMessageResponseSchema, accessToken: string) => Promise<HumanMessageWithRetrievedDocumentSchema>;
}

const retrievedDocumentsContext = createContext<RetrievedDocsContextType | undefined>(undefined);

export default function RetrievedDocsProvider(
    { children }: { children: React.ReactNode}
) {
    const [humanMessageFetchLoading, setHumanMessageFetchinLoading] = useState<boolean>(false);
    const [currentHumanMessageWithRetrievedDocuments, setCurrentHumanMessageWithRetrievedDocuments] = useState<HumanMessageWithRetrievedDocumentSchema | null>(null);

    const handleUpdateHumanMessageFetchLoading = (newValue: boolean): void => {
        setHumanMessageFetchinLoading(newValue);
    }

    const handleChangeCurrentHumanMessageWithRetrievedDocuments = (newcurrentHumanMessageWithRetrievedDocuments: HumanMessageWithRetrievedDocumentSchema): void => {
        setCurrentHumanMessageWithRetrievedDocuments(newcurrentHumanMessageWithRetrievedDocuments);
    }

    const setCurrentHumanMessageWithRetrievedDocumentsToNull = (): void => {
        setCurrentHumanMessageWithRetrievedDocuments(null);
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
        humanMessageFetchLoading,
        currentHumanMessageWithRetrievedDocuments,
        handleUpdateHumanMessageFetchLoading,
        setCurrentHumanMessageWithRetrievedDocumentsToNull,
        loadRetrievedDocumentsFromHumanMessageId
    }

    return (
        <retrievedDocumentsContext.Provider value={value}>
            {children}
        </retrievedDocumentsContext.Provider>
    );
}

export function useDocsRetrieved() {
    const context = useContext(retrievedDocumentsContext);

    if(context == null) {
        throw new Error("useDocsRetrieved must be used inside a RetrievedDocsProvider");
    }

    return context;
}