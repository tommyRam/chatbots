interface ChatMessagesProps {
    userMessages?: ChatMessageSchema[],
    aiMessages?: ChatMessageSchema[]
}

export default function ChatMessages(
    {
        userMessages,
        aiMessages
    }: ChatMessagesProps
) {
    return (
        <div className="flex-1 mx-[10%] max-w-2xl px-7">
            Messages
        </div>
    )
}