import { CodeSquare, File } from "lucide-react";

interface DocHeaderProps {
    showRetrievedDocuments: boolean;
    setShowRetrievedDocuments: (value: boolean) => void;
}

export default function DocHeader({
    showRetrievedDocuments,
    setShowRetrievedDocuments
}: DocHeaderProps) {
    return (
        <div className="h-10 flex justify-start items-center">
            <div
                onClick={() => setShowRetrievedDocuments(true)}
                className={`h-full flex items-center justify-center space-x-1.5  border-y-4 mx-5 border-white hover:cursor-pointer
                         ${showRetrievedDocuments ? "text-purple-800 border-b-purple-900" : ""}`}>
                <File className={`w-4 h-4  ${!showRetrievedDocuments ? "text-purple-800 border-b-purple-900" : ""}`} />
                <span>Retrieved documents</span>
            </div>
            <div
                onClick={() => setShowRetrievedDocuments(false)}
                className={`h-full flex items-center justify-center space-x-1.5 border-y-4 border-white hover:cursor-pointer 
                        ${!showRetrievedDocuments ? "text-purple-800 border-b-purple-900" : ""}`}>
                <CodeSquare className={`w-4 h-4  ${!showRetrievedDocuments ? "text-purple-800 border-b-purple-900" : ""}`} />
                <span>Code</span>
            </div>
        </div>
    )
}