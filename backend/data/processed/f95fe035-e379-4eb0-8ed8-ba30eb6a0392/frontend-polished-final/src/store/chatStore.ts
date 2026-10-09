import { create } from "zustand";
import chatService from "@/services/chatService";
import { ChatMessage } from "@/types/chat";

const STORAGE_KEY = "learning-agency-chat";

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;

  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  sendMessage: (prompt: string) => Promise<void>;
  regenerateLastResponse: () => Promise<void>;
}

const loadMessages = (): ChatMessage[] => {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: ChatMessage[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(messages)
  );
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: loadMessages(),

  loading: false,

  addMessage: (message) =>
    set((state) => {
      const updated = [...state.messages, message];
      saveMessages(updated);
      return { messages: updated };
    }),

  clearChat: () => {
    localStorage.removeItem(STORAGE_KEY);

    set({
      messages: [],
    });
  },

  sendMessage: async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
    };

    const updatedMessages = [...get().messages, userMessage];

    saveMessages(updatedMessages);

    set({
      messages: updatedMessages,
      loading: true,
    });

    try {
      const response = await chatService.askAI({
        prompt,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
      };

      const finalMessages = [...get().messages, aiMessage];

      saveMessages(finalMessages);

      set({
        messages: finalMessages,
        loading: false,
      });
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Sorry, I couldn't generate a response.",
      };

      const finalMessages = [...get().messages, errorMessage];

      saveMessages(finalMessages);

      set({
        messages: finalMessages,
        loading: false,
      });
    }
  },

  regenerateLastResponse: async () => {
    const messages = get().messages;

    const lastUser = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUser) return;

    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");

    const remaining = lastAssistant
      ? messages.filter((m) => m.id !== lastAssistant.id)
      : messages;

    saveMessages(remaining);

    set({
      messages: remaining,
      loading: true,
    });

    try {
      const response = await chatService.askAI({
        prompt: lastUser.content,
      });

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.answer,
      };

      const finalMessages = [...get().messages, aiMessage];

      saveMessages(finalMessages);

      set({
        messages: finalMessages,
        loading: false,
      });
    } catch {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Unable to regenerate the response.",
      };

      const finalMessages = [...get().messages, errorMessage];

      saveMessages(finalMessages);

      set({
        messages: finalMessages,
        loading: false,
      });
    }
  },
}));