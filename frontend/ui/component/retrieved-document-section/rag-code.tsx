import { Code2Icon } from "lucide-react";

export default function RAGCode() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full px-2">
            <Code2Icon className="font-bold text-gray-400 h-9 w-9" />
            <div className="text-gray-400 text-xl font-bold">Code</div>
        </div>)
}