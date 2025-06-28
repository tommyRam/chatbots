import ChatMain from "@/ui/component/chat-section/chat-main-app";
import CreateChat from "@/ui/component/create-chat-section/create-chat";
import DocumentMain from "@/ui/component/document-section-main-app";
import ResizableLayout from "@/ui/component/resizable-layout";

export default function NewChatMain() {
    return (
          <ResizableLayout
                leftComponent={
                // <ChatMain 
                //     message={message}
                //     setMessage={setMessage}
                //     setDocuments={setDocuments}
                // />
                    <div className="w-full h-full bg-white">
                        <CreateChat />
                    </div>
                }
                rightComponent={
                // <DocumentMain 
                //     documents={documents}
                // />
                    <div className="w-full h-full bg-white">
                        <div className="w-full h-full flex justify-center items-center">No document</div>
                    </div>
                }
            />
    )
}