"use client";

import { useChatStore } from "@/store/chatStore";

import EmptyState from "./EmptyState";
import ChatWindow from "./ChatWindow";

export default function ChatContainer() {

  const { messages, sendMessage } = useChatStore();

  if (messages.length === 0) {

    return (

      <EmptyState
        onPrompt={sendMessage}
      />

    );

  }

  return <ChatWindow />;

} 