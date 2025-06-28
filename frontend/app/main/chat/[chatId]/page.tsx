import DocumentMain from "@/ui/component/document-section-main-app";
import ResizableLayout from "@/ui/component/resizable-layout";
import Chat from "@/ui/component/chat-section/chat-app";


export default function ChatPage() {
    return (
        <ResizableLayout
            leftComponent={
                <Chat />
            }
            rightComponent={
                <DocumentMain />
            }
        />
    )
}