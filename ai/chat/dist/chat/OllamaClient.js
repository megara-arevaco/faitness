"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaClient = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaClient {
    constructor(config) {
        this.chatHistory = [];
        this.config = config;
    }
    async sendMessage(message) {
        try {
            // Agregar mensaje del usuario al historial
            this.chatHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });
            // Crear prompt con contexto de conversación
            const conversationPrompt = this.buildConversationPrompt(message);
            const response = await axios_1.default.post(`${this.config.baseUrl || "http://localhost:11434"}/api/generate`, {
                model: this.config.model || "llama2",
                prompt: conversationPrompt,
                stream: false,
                options: {
                    temperature: this.config.temperature || 0.7,
                },
            });
            const assistantResponse = response.data.response;
            // Agregar respuesta del asistente al historial
            this.chatHistory.push({
                role: 'assistant',
                content: assistantResponse,
                timestamp: new Date()
            });
            return assistantResponse;
        }
        catch (error) {
            throw new Error(`Error al enviar mensaje: ${error instanceof Error ? error.message : error}`);
        }
    }
    buildConversationPrompt(currentMessage) {
        let prompt = "La siguiente es una conversación amigable entre un humano y una IA asistente.\nLa IA es útil, creativa, inteligente y muy amigable.\n\n";
        // Agregar historial de conversación (últimos 10 mensajes para no sobrecargar)
        const recentHistory = this.chatHistory.slice(-10);
        for (const msg of recentHistory) {
            if (msg.role === 'user') {
                prompt += `Humano: ${msg.content}\n`;
            }
            else {
                prompt += `IA: ${msg.content}\n`;
            }
        }
        prompt += `Humano: ${currentMessage}\nIA:`;
        return prompt;
    }
    async getHistory() {
        return [...this.chatHistory];
    }
    async clearHistory() {
        this.chatHistory = [];
    }
    async switchModel(modelName) {
        this.config.model = modelName;
    }
    getCurrentModel() {
        return this.config.model;
    }
    getConfig() {
        return { ...this.config };
    }
    // Método para verificar la conexión con Ollama
    async checkConnection() {
        try {
            await axios_1.default.get(`${this.config.baseUrl || "http://localhost:11434"}/api/tags`);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.OllamaClient = OllamaClient;
//# sourceMappingURL=OllamaClient.js.map