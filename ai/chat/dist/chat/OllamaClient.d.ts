import { ChatConfig, ChatMessage } from "../types/index.js";
export declare class OllamaClient {
    private config;
    private chatHistory;
    constructor(config: ChatConfig);
    sendMessage(message: string): Promise<string>;
    private buildConversationPrompt;
    getHistory(): Promise<ChatMessage[]>;
    clearHistory(): Promise<void>;
    switchModel(modelName: string): Promise<void>;
    getCurrentModel(): string;
    getConfig(): ChatConfig;
    checkConnection(): Promise<boolean>;
}
