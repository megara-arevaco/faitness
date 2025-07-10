export interface ChatConfig {
  model: string;
  temperature?: number;
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}