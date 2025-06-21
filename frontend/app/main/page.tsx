import ChatMain from "@/ui/component/chat-main-app";
import DocumentMain from "@/ui/component/document-section-main-app";

export default function page() {
    return (
        <div className="flex-1 flex flex-row w-full bg-red-400">
            <ChatMain />
            <DocumentMain />
        </div>
    )
}