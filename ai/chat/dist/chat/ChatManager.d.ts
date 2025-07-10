import { ChatConfig } from "../types/index.js";
export declare class ChatManager {
    private client;
    private isRunning;
    constructor(config: ChatConfig);
    startChat(): Promise<void>;
    private chatLoop;
    private handleCommand;
    private showHelp;
    private clearHistory;
    private showHistory;
    stop(): Promise<void>;
}
