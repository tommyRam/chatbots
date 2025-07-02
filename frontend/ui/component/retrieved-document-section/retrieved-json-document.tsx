import { Check, Copy, Database } from "lucide-react";

interface RenderJSONDocumentProps {
  doc: RetrievedDocumentResponse;
  copiedDoc: string | null;
  copyToClipBoard: (content: string, docId: string) => Promise<void>;
}

export default function RenderJSONDocument({ doc, copyToClipBoard, copiedDoc }: RenderJSONDocumentProps) {
  const jsonString = JSON.stringify(doc, null, 2);

  return (
    <div key={doc.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-gray-900">
            {doc.title || `Document ${doc.id.substring(0, 8)}`}
          </span>
        </div>
        <button
          onClick={() => copyToClipBoard(jsonString, doc.id)}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          title="Copy JSON"
        >
          {copiedDoc === doc.id ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="p-4 flex">
        <pre className="text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-600 whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};