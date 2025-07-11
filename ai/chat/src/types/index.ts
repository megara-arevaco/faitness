export type ChatConfig = {
  model: string;
  temperature?: number;
  baseUrl?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
