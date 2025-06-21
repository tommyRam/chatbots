import ChatMain from "@/ui/component/chat-main-app";
import DocumentMain from "@/ui/component/document-section-main-app";
import ResizableLayout from "@/ui/component/resizable-layout";

export default function page() {
    return (
        <div className="flex-1 flex">
            <ResizableLayout
                leftComponent={<ChatMain />}
                rightComponent={<DocumentMain />}
            />
        </div>
    )
}