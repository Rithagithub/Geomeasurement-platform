import api from "./api";
import { ChatRequest } from "@/types/chat";

const askAI = async (data: ChatRequest) => {
    const response = await api.post("/chat", data);
    return response.data;
};

export default {
    askAI,
};