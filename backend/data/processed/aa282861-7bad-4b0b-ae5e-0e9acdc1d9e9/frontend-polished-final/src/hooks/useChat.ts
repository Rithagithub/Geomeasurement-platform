"use client";

import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import chatService from "@/services/chatService";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function send(content: string) {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    const updated = [...messages, newMessage];

    setMessages(updated);
    setLoading(true);

    try {
      const response = await chatService.askAI({ prompt: content });

      setMessages([
        ...updated,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Unable to connect to AI Engine.",
        },
      ]);
    }

    setLoading(false);
  }

  return {
    messages,
    loading,
    send,
  };
}
