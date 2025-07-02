"user client";

import { Database, FileText } from "lucide-react";
import React from "react";
import { useState } from "react";
import RenderJSONDocument from "./retrieved-json-document";
import RenderViewDocument from "./render-view-document";
import { useAllRagTechnics } from "@/hooks/rag-type-context";
import DocumentLoadingComponent from "@/ui/reusable_component/loading-retrieved-documents";
import { useDocsRetrieved } from "@/hooks/docs-context";

interface RetrievedDocumentsProps {
  documents: RetrievedDocumentResponse[] | undefined;
  humanMessage: HumanMessageResponseSchema | undefined;
}

export default function RetrievedDocuments({ documents, humanMessage }: RetrievedDocumentsProps) {
  const [viewMode, setViewMode] = useState<"plain" | "JSON">("plain");
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null);

  const {
    humanMessageFetchLoading
  } = useDocsRetrieved();

  const toggleExpanded = (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
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
    } catch (e) {
      console.log("Failed to copy to clipboard: ", e);
    }
  }

  const formatUploadTime = (uploadTime?: string) => {
    if (!uploadTime) return "N/A";
    try {
      return new Date(uploadTime).toLocaleDateString();
    } catch (e) {
      return uploadTime;
    }
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  }

  if (!documents || documents.length === 0 || !humanMessage) {
    return (
      <div className="text-center py-8 text-gray-500 w-full h-full flex flex-col items-center justify-center mb-20">
        {
          humanMessageFetchLoading ? (
            <>
              <DocumentLoadingComponent />
            </>
          ) : (
            <>
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No retrieved documents to display</p>
            </>
          )
        }
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="sticky top-0 z-10 bg-white">
        <div className="px-4 pt-3">
          <div className="flex flex-col justify-center mb-6">
            <div className="w-full mb-5">
              <div className="flex flex-col justify-center">
                <div className="text-xl font-bold text-gray-900  ">Related Question</div>
                <div className="text-gray-600 text-sm mt-1 mb-3">Algorithm: <span className="text-gray-700 font-bold">{documents[0].algorithm}</span></div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm font-bold text-gray-600">
                {humanMessage.content}
              </div>
            </div>

            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900">Retrieved Documents</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {documents.length} document{documents.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('plain')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:cursor-pointer ${viewMode === 'plain'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Plain Text
                </button>
                <button
                  onClick={() => setViewMode('JSON')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:cursor-pointer ${viewMode === 'JSON'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Database className="w-4 h-4 inline mr-1" />
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Documents Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pt-4">
          <div className="space-y-4">
            {documents.map((doc, index) =>
              viewMode === 'plain' ? (
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
      </div>
    </div>
  );
}