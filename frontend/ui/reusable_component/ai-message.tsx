import { Bot, Sparkles } from "lucide-react";

interface AIMessageProps {
    aiMessages: AIMessageResponseSchema[];
    index: number;
}

export default function AIMessage({aiMessages, index}: AIMessageProps) {
    return (
        <div className="flex justify-start mb-6">
            <div className="max-w-[85%] group">
            <div className="flex items-start mb-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white mr-3 shadow-sm">
                <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                <div className="text-xs text-purple-600 font-medium mb-1 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Assistant
                </div>
                <div className="bg-white border border-purple-100 px-6 py-4 rounded-2xl rounded-tl-md shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {aiMessages[index].content}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}