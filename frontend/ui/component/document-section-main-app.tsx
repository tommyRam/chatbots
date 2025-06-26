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
    return (
        <div className="w-full h-[98%] mr-2. bg-white shadow-gray-700 inset-shadow-2xs inset-shadow-indigo-50">
           {documents && documents.length > 0 && documents[0].content}
        </div>
    )
}