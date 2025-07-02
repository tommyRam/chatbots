import { Loader2, Send } from "lucide-react";
import { ChangeEvent } from "react";

interface ChatInputProps {
    inputValue: string;
    isPending: boolean;
    handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    handleSendQuery: () => void
}

export default function ChatInput({
    inputValue,
    isPending,
    handleInputChange,
    handleSendQuery
}: ChatInputProps) {

    const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendQuery();
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center p-4 pt-0 ">
            <div className="relative w-full max-w-2xl">
                <textarea
                    id="query"
                    className="w-full min-h-[60px] max-h-32 p-4 pr-14 text-gray-700 bg-gray-200 border-2 border-gray-400 rounded-2xl resize-none focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder:text-gray-400 shadow-sm hover:shadow-md"
                    placeholder="Enter your question..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                />
                <button
                    onClick={handleSendQuery}
                    disabled={isPending || !inputValue.trim()}
                    className="absolute right-3 bottom-8 p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    {isPending ? (
                        <Loader2 className="flex justify-center items-center w-6 h-6 animate-spin" />
                    ) : (
                        <Send className="flex justify-center items-center w-6 h-6" />
                    )}
                </button>
            </div>
        </div>
    );
}