export declare class OllamaAPI {
    private baseUrl;
    constructor(baseUrl?: string);
    /**
     * Verifica el estado de salud del servidor Ollama
     */
    checkHealth(): Promise<boolean>;
}
export declare const ollamaAPI: OllamaAPI;
