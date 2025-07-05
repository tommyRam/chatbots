"use client";

import { useAllRagTechnics } from "@/hooks/rag-type-context";
import { Code2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface NotebookCell {
    cell_type: string;
    source: string | string[];
    execution_count?: number | null;
    outputs?: any[];
    metadata?: any;
    id?: string;
}

interface NotebookContent {
    cells: NotebookCell[];
    metadata?: any;
    nbformat?: number;
    nbformat_minor?: number;
}

export default function RAGCode() {
    const [notebookContent, setNotebookContent] = useState<NotebookContent>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentRagTechnic, handleChangeCurrentRagTechnic, allRagTechnics } = useAllRagTechnics();

    useEffect(() => {
        if (currentRagTechnic) {
            fetchNotebook();
        }
    }, [currentRagTechnic]);

    const fetchNotebook = async () => {
        setLoading(true);
        setError(null);

        try {

            const accessToken = localStorage.getItem("access_token");

            if (!accessToken)
                throw new Error("Not authenticated");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/app/api/rag/${currentRagTechnic.notebookName}`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            if (!response.ok)
                throw new Error(`Failed to fetch notebook: ${response.statusText}`);

            const data = await response.json();
            setNotebookContent(JSON.parse(data.content));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.")
        } finally {
            setLoading(false);
        }
    }

    const renderMarkdown = (source: string | string[]) => {
        const content = Array.isArray(source) ? source.join('') : source;
        const lines = content.split('\n');

        return (
            <div className="prose prose-sm max-w-none">
                {lines.map((line, index) => {
                    if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-800">{line.replace('### ', '')}</h3>;
                    } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2 text-gray-800">{line.replace('## ', '')}</h2>;
                    } else if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold mt-4 mb-2 text-gray-800">{line.replace('# ', '')}</h1>;
                    } else if (line.trim() === '') {
                        return <br key={index} />;
                    } else {
                        return <p key={index} className="mb-2 text-gray-700">{line}</p>;
                    }
                })}
            </div>
        );
    };

    const renderCell = (cell: NotebookCell, index: number) => {
        const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;

        if (cell.cell_type === 'markdown') {
            return (
                <div key={index} className="flex-1 mb-6 w-[550px]">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4">
                            {renderMarkdown(source)}
                        </div>
                    </div>
                </div>
            );
        } else if (cell.cell_type === 'code') {
            return (
                <div key={index} className="flex-1 flex mb-6 w-[550px]">
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <SyntaxHighlighter
                            language="python"
                            style={tomorrow}
                            customStyle={{
                                margin: 0,
                                padding: '12px 16px',
                                fontSize: '15px',
                                lineHeight: '1.5',
                                // background: '#fafafa',
                                border: 'none'
                            }}
                            showLineNumbers={false}
                        >
                            {source}
                        </SyntaxHighlighter>
                    </div>
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading notebook...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center rounded-lg p-4">
                <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <h3 className="ml-2 text-red-800 font-medium">Error Loading Notebook</h3>
                </div>
                <p className="text-red-700 mt-2">{error}</p>
                <button
                    onClick={fetchNotebook}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full px-2">
            {
                notebookContent ? (
                    <div className="flex-1 flex flex-col bg-gray-50 p-6 rounded-lg">
                        {notebookContent.cells.map((cell, index) => renderCell(cell, index))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center h-full px-2">
                        <Code2Icon className="font-bold text-gray-400 h-9 w-9" />
                        <div className="text-gray-400 text-xl font-bold">Code</div>
                    </div>
                )
            }
        </div>
    )
}