"user client";

import { Database, FileText } from "lucide-react";
import React from "react";
import { useState } from "react";
import RenderJSONDocument from "./retrieved-json-document";
import RenderViewDocument from "./render-view-document";

interface RetrievedDocumentsProps {
    documents: RetrievedDocumentResponse[] | undefined;
}

export default function RetrievedDocuments ({documents} : RetrievedDocumentsProps) {
    const [viewMode, setViewMode] = useState<"plain" | "JSON">("plain");
    const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
    const [copiedDoc, setCopiedDoc] = useState<string | null>(null);

    const toggleExpanded = (docId: string) => {
        const newExpanded = new Set(expandedDocs);
        if(newExpanded.has(docId)) {
            newExpanded.delete(docId);
        } else {
            newExpanded.add(docId);
        }
        setExpandedDocs(newExpanded);
    }

    const copyToClipBoard = async (content: string, docId: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedDoc(docId);
            setTimeout(() => setCopiedDoc(null), 2000);
        } catch(e) {
            console.log("Failed to copy to clipboard: ", e);
        }
    }

    const formatUploadTime = (uploadTime?: string) => {
        if(!uploadTime) return "N/A";
        try {
            return new Date(uploadTime).toLocaleDateString();
        } catch(e) {
            return uploadTime;
        }
    }

    const truncateContent = (content: string, maxLength: number = 200) => {
        if(content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    }

    if (!documents || documents.length === 0) {
        return (
        <div className="text-center py-8 text-gray-500 w-full h-full flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No retrieved documents to display</p>
        </div>
        );
    }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Retrieved Documents</h2>
          <p className="text-gray-600 text-sm mt-1">
            {documents.length} document{documents.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('plain')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'plain'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1" />
            Plain Text
          </button>
          <button
            onClick={() => setViewMode('JSON')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'JSON'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4 inline mr-1" />
            JSON
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {documents.map((doc, index) => 
          viewMode === 'plain' ?
            (
                <RenderViewDocument 
                    key={index}
                    doc={doc}
                    copiedDoc={copiedDoc}
                    expandedDocs={expandedDocs}
                    formatUploadTime={formatUploadTime}
                    copyToClipBoard={copyToClipBoard}
                    toggleExpanded={toggleExpanded}
                    truncateContent={truncateContent}
                />
            ) : (
                <RenderJSONDocument 
                    key={index}
                    doc={doc}
                    copiedDoc={copiedDoc}
                    copyToClipBoard={copyToClipBoard}
                />
            )
        )}
      </div>
    </div>
  );
}