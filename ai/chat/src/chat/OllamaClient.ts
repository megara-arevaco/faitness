import { ChatConfig, ChatMessage } from "../types/index.ts";
import axios from "axios";

export class OllamaClient {
  private config: ChatConfig;
  private chatHistory: ChatMessage[] = [];

  constructor(config: ChatConfig) {
    this.config = config;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      this.chatHistory.push({
        role: "user",
        content: message,
        timestamp: new Date(),
      });

      const conversationPrompt = this.buildConversationPrompt(message);

      const response = await axios.post(
        `${this.config.baseUrl || "http://localhost:11434"}/api/generate`,
        {
          model: this.config.model,
          prompt: conversationPrompt,
          stream: true,
          options: {
            temperature: this.config.temperature || 0.7,
          },
        },
        { responseType: "stream" }
      );

      let assistantResponse = "";

      // Leer el stream línea a línea
      for await (const chunk of response.data) {
        const lines = chunk.toString().split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.response) {
              assistantResponse += data.response;
            }
          } catch {
            // Ignorar líneas que no sean JSON válidas
          }
        }
      }

      // Eliminar bloques <think>...</think>
      assistantResponse = assistantResponse
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .trim();

      this.chatHistory.push({
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      });

      return assistantResponse;
    } catch (error) {
      throw new Error(
        `Error al enviar mensaje: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  private buildConversationPrompt(currentMessage: string): string {
    let prompt = `
    You are an expert in nutrition and fitness, acting as a personal trainer for the user. You have access to a set of tools that allow you to retrieve, create, update, and delete information about users, workouts, exercises, meals, ingredients, sets, and meal days.

    Whenever the user asks for information, requests an action, or needs data that requires using one of these tools, you must respond by specifying the tool name and the required arguments in JSON format. Do not show your reasoning, only provide the final answer or result. Always answer in Spanish.

    Available tools include:
    - get_users, get_user, create_user, update_user, delete_user
    - get_workouts, get_workout, create_workout, update_workout, delete_workout
    - get_exercises, get_exercise, create_exercise, update_exercise, delete_exercise
    - get_meals, get_meal, create_meal, update_meal, delete_meal
    - get_ingredients, get_ingredient, create_ingredient, update_ingredient, delete_ingredient
    - get_sets, get_set, create_set, update_set, delete_set
    - get_meal_days, get_meal_day, create_meal_day, update_meal_day, delete_meal_day

    When you need to use a tool, respond ONLY with the tool name and the arguments in JSON, for example:
    create_user({"name": "Juan", "email": "juan@email.com", "password": "1234"})
    `.trim();

    const recentHistory = this.chatHistory.slice(-10);

    for (const msg of recentHistory) {
      if (msg.role === "user") {
        prompt += `Humano: ${msg.content}\n`;
      } else {
        prompt += `IA: ${msg.content}\n`;
      }
    }

    prompt += `Humano: ${currentMessage}\nIA:`;

    return prompt;
  }

  async getHistory(): Promise<ChatMessage[]> {
    return [...this.chatHistory];
  }

  async clearHistory(): Promise<void> {
    this.chatHistory = [];
  }

  async switchModel(modelName: string): Promise<void> {
    this.config.model = modelName;
  }

  getCurrentModel(): string {
    return this.config.model;
  }

  getConfig(): ChatConfig {
    return { ...this.config };
  }

  // Método para verificar la conexión con Ollama
  async checkConnection(): Promise<boolean> {
    try {
      await axios.get(
        `${this.config.baseUrl || "http://localhost:11434"}/api/tags`
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
