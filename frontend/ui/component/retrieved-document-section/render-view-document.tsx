import { Check, ChevronDown, ChevronUp, Copy, FileText } from "lucide-react";

interface RenderViewDocumentsProps {
    doc: RetrievedDocumentResponse;
    copiedDoc: string | null;
    expandedDocs: Set<string>;
    formatUploadTime: (uploadTime?: string) => string;
    copyToClipBoard: (content: string, docId: string) => Promise<void>;
    toggleExpanded: (docId: string) => void;
    truncateContent: (content: string, maxLength?: number) => string;
}

export default function RenderViewDocument({doc, copiedDoc, expandedDocs, formatUploadTime, copyToClipBoard, toggleExpanded, truncateContent} : RenderViewDocumentsProps) {
    const isExpanded = expandedDocs.has(doc.id);

    return (
        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                    {doc.title || `Document ${doc.id.substring(0, 8)}`}
                </h3>
                {doc.score && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Score: {parseFloat(doc.score).toFixed(3)}
                    </span>
                )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                {doc.fileType && (
                    <span className="flex items-center gap-1">
                    <span className="font-medium">Type:</span> {doc.fileType}
                    </span>
                )}
                {doc.page && (
                    <span className="flex items-center gap-1">
                    <span className="font-medium">Page:</span> {doc.pageLabel || doc.page}
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <span className="font-medium">Uploaded:</span> {formatUploadTime(doc.uploadTime)}
                </span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
                <button
                onClick={() => copyToClipBoard(doc.content, doc.id)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Copy content"
                >
                {copiedDoc === doc.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
                </button>
                <button
                onClick={() => toggleExpanded(doc.id)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
                </button>
            </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-3">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {isExpanded ? doc.content : truncateContent(doc.content, 400)}
            </div>
            {!isExpanded && doc.content.length > 200 && (
                <button
                onClick={() => toggleExpanded(doc.id)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                Show more
                </button>
            )}
            </div>
        </div>
        );
}