interface ChatMessageSchema {
    content: string,
    type: "ai_message" | "human_message";
}