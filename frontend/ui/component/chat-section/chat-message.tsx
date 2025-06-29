"use client";

import { useChat } from "@/hooks/chat-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/ui/reusable_component/profile-menu";
import { clearLocalStorage } from "@/utils/auth";
import { Bot, MessageSquarePlus, MessageSquarePlusIcon, Sparkles } from "lucide-react";
import HumanMessage from "@/ui/reusable_component/human-message";
import AIMessage from "@/ui/reusable_component/ai-message";

interface ChatMessagesProps {
  tempHumanMessage: string | null;
  setTempHumanMessageToNull: () => void;
}

export default function ChatMessages({tempHumanMessage, setTempHumanMessageToNull}: ChatMessagesProps) {
    const {
        aiMessages,
        humanMessages,
        currentChat,
        loadAIMessagesFromChat,
        loadHumanMessagesFromChat,
        handleChangeCurrentChat,
        setCurrentChatToNull,
        loadRetrievedDocumentsFromHumanMessageId
    } = useChat();
    const router = useRouter();

    useEffect(() => {
        const hanldleReload = async () => {
            const accessToken = localStorage.getItem("access_token");
            try {
                if (!accessToken || accessToken === "") {
                    throw new Error("Not authenticated");
                }

                var currentChatFormatted: ChatSchema | null = null;
                if(currentChat == null) {
                    const currentChatFromLocalStorage = localStorage.getItem("currentChat");

                    if(currentChatFromLocalStorage)
                        currentChatFormatted = JSON.parse(currentChatFromLocalStorage);

                    if(currentChatFormatted)
                        handleChangeCurrentChat(currentChatFormatted);
                }

                if(currentChatFormatted !== null) {
                    await loadAIMessagesFromChat(currentChatFormatted.chatId, accessToken);
                    await loadHumanMessagesFromChat(currentChatFormatted.chatId, accessToken);
                    setTempHumanMessageToNull();
                } else if(currentChat !== null) {
                    await loadAIMessagesFromChat(currentChat.chatId, accessToken);
                    await loadHumanMessagesFromChat(currentChat.chatId, accessToken);
                    setTempHumanMessageToNull();
                }else {
                    localStorage.removeItem("currentChat");
                    setCurrentChatToNull();
                    setTempHumanMessageToNull();
                    router.push("/main/chat/new");
                }
                
            }catch (e) {
                clearLocalStorage();
                router.push("/auth/login");
                console.log(e);
            }
        }

        hanldleReload();
    }, [])

    const handleClickHumanMessage = async (humanMessage: HumanMessageResponseSchema) => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken || accessToken === "") {
            throw new Error("Not authenticated");
        }

        loadRetrievedDocumentsFromHumanMessageId(humanMessage, accessToken);
      } catch(e) {
        clearLocalStorage();
        router.push("/auth/login");
        console.log(e);
      }
    }

 return (
    <div className="flex-1 flex flex-col items-center justify-start mx-[10%] h-full max-w-2xl px-2">
      {humanMessages.length > 0 ? (
        <div className="w-full space-y-8">
          {humanMessages.map((value, index) => (
            <div key={index} className="w-full">
              {/* Human Message */}
              <HumanMessage humanMessage={value} handleClickHumanMessage={handleClickHumanMessage} />

              {/* AI Response */}
              {aiMessages[index] && (
                <AIMessage aiMessages={aiMessages} index={index} />
              )}

              {/* Separator line for better visual separation */}
              {index < humanMessages.length - 1 && (
                <div className="flex justify-center my-8">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                </div>
              )}
            </div>
          ))}

          {tempHumanMessage && (
              <div className="w-full mb-52">
                <div className="flex justify-end mb-4">
                    <div className="max-w-[85%] group">
                        <div className="flex items-start justify-end mb-2">
                        <div className="mr-3">
                            <div className="text-xs text-purple-600 font-medium mb-1 text-right">You</div>
                            <div 
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-2xl rounded-tr-md shadow-lg hover:shadow-xl transition-all duration-200  hover:cursor-pointer hover:from-purple-700 hover:to-purple-800"
                            >
                            <div className="font-medium leading-relaxed">
                                {tempHumanMessage}
                            </div>
                            </div>
                        </div>
                        <ProfileMenu username="John" style="w-8 h-8"/>
                        </div>
                    </div>
                </div>
                <div>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 w-full h-full flex flex-col items-center justify-center">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-100 shadow-sm">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-4 rounded-2xl inline-block mb-4">
              <MessageSquarePlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a Conversation</h3>
            <p className="text-gray-500 max-w-sm">
              Ask me anything about the docs you send to me! I'm here to help you with information, analysis...
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Questions
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Analysis
              </span>   
            </div>
          </div>
        </div>
      )}
    </div>
  );
}