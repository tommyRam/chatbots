"use client";

import { useAllRagTechnics } from "@/hooks/rag-type-context";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ChatHeader() {
    const [showAllRAGModals, setShowAllRAGModal] = useState<boolean>(false);
    const [currentAction, setCurrentAction] = useState<"testRAG" | "evaluateRAG">("testRAG");
    const ragTypeRef = useRef<HTMLDivElement>(null);
    const { currentRagTechnic, handleChangeCurrentRagTechnic, allRagTechnics} = useAllRagTechnics();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ragTypeRef.current && !ragTypeRef.current.contains(event.target as Node)) {
                setShowAllRAGModal(false);
            }
        }

        if (showAllRAGModals) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAllRAGModals]);

    const handleChangeCurrentRagTechnicClick = (index: number): void => {
        handleChangeCurrentRagTechnic(index);
        setShowAllRAGModal(false);
    }

    return (
        <div className="h-10 flex justify-between items-center px-2 border-b-gray-100 border-b">
            <div className="flex space-x-2 text-gray-600 h-full items-center">
                <div onClick={() => setCurrentAction("testRAG")} className={`h-full flex items-center justify-center border-y-4 px-1 border-white hover:cursor-pointer ${currentAction === "testRAG" ? "text-gray-800 border-b-purple-900" : ""}`}>Test RAG</div>
                <div onClick={() => setCurrentAction("evaluateRAG")} className={`h-full flex items-center justify-center border-y-4 border-white px-1 hover:cursor-pointer ${currentAction !== "testRAG" ? "text-gray-800 border-b-purple-900" : ""}`}>Evaluate RAG</div>
            </div>
            <div className="relative w-52" ref={ragTypeRef}>
                <div 
                    onClick={() => setShowAllRAGModal(!showAllRAGModals)} 
                    className="flex items-center justify-between space-x-1.5 border border-gray-500 rounded-md pl-3 px-2.5 hover:cursor-pointer"
                >
                    <div className="font-medium leading-relaxed w-[90%] truncate" title={currentRagTechnic.displayName}>
                        {currentRagTechnic.displayName}
                    </div>
                    { !showAllRAGModals ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </div>  
                
                {showAllRAGModals && (
                    <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-xl shadow-lg py-2 min-w-full z-50">
                        {allRagTechnics.length > 0 && allRagTechnics.map((value, index) => {
                            return (
                                <div 
                                    key={index}
                                    onClick={() => handleChangeCurrentRagTechnicClick(index)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-500"
                                >
                                    {value.displayName}
                                </div>
                            )
                        })}
                    </div> 
                )}                           
            </div>
        </div>
    )
}