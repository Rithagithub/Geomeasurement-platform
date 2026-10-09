export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  mastery: number;
}

export interface DashboardStats {
  totalSessions: number;
  learningTime: number;
  conceptsMastered: number;
  agencyScore: number;
}