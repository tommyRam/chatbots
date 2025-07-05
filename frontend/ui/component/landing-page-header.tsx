import { Database } from "lucide-react";

export default function LandingPageHeader() {
    return (
        <div className="w-full h-16 flex items-center border-b-purple-400 border-b-2 shadow px-4">
            <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    RAnGo
                </span>
            </div>
        </div>
    )
}