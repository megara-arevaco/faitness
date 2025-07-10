#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ChatManager } from "./chat/ChatManager";
import { OllamaAPI } from "./utils/ollama-api";
import { ChatConfig } from "./types/index";

const program = new Command();
const defaultBaseUrl = "http://172.27.240.1:11434"; // Cambia esto según tu configuración

program
  .name("ollama-cli")
  .description("CLI para chatear con Ollama usando LangChain")
  .version("1.0.0");

// Comando principal: chat interactivo
program
  .command("chat")
  .description("Iniciar una sesión de chat interactiva con Ollama")
  .option("-m, --model <model>", "Modelo a utilizar", "deepseek-r1")
  .option("-t, --temperature <temp>", "Temperatura para la generación (0.0-1.0)", "0.7")
  .option("-u, --url <url>", "URL base de Ollama", defaultBaseUrl)
  .action(async (options) => {
    try {
      const config: ChatConfig = {
        model: options.model,
        temperature: parseFloat(options.temperature),
        baseUrl: options.url
      };

      const chatManager = new ChatManager(config);
      await chatManager.startChat();
    } catch (error) {
      console.error(chalk.red("Error al iniciar el chat:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  console.error(chalk.red("Error no manejado:"), error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red("Promesa rechazada no manejada:"), reason);
  process.exit(1);
});

// Manejar señales de interrupción
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n👋 ¡Hasta luego!"));
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("\n👋 ¡Hasta luego!"));
  process.exit(0);
});

// Parsear argumentos de línea de comandos
program.parse();