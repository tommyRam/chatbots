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
                    <div className="w-full h-[98%] ml-2.5 bg-white rounded-lg shadow-gray-700 inset-shadow-2xs inset-shadow-indigo-50">
                        <CreateChat />
                    </div>
                }
                rightComponent={
                // <DocumentMain 
                //     documents={documents}
                // />
                    <div className="w-full h-[98%] mr-2.5 bg-white rounded-lg shadow-gray-700 inset-shadow-2xs inset-shadow-indigo-50">
                        <div className="w-full h-full flex justify-center items-center">No document</div>
                    </div>
                }
            />
    )
}