"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaAPI = exports.OllamaAPI = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaAPI {
    constructor(baseUrl = "http://localhost:11434") {
        this.baseUrl = baseUrl;
    }
    /**
     * Verifica el estado de salud del servidor Ollama
     */
    async checkHealth() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api/tags`, {
                timeout: 5000
            });
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
}
exports.OllamaAPI = OllamaAPI;
// Exportar una instancia por defecto
exports.ollamaAPI = new OllamaAPI();
//# sourceMappingURL=ollama-api.js.map