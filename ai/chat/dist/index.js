#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const ChatManager_js_1 = require("./chat/ChatManager.js");
const ollama_api_js_1 = require("./utils/ollama-api.js");
const program = new commander_1.Command();
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
    .option("-u, --url <url>", "URL base de Ollama", "http://localhost:11434")
    .action(async (options) => {
    try {
        const config = {
            model: options.model,
            temperature: parseFloat(options.temperature),
            baseUrl: options.url
        };
        const chatManager = new ChatManager_js_1.ChatManager(config);
        await chatManager.startChat();
    }
    catch (error) {
        console.error(chalk_1.default.red("Error al iniciar el chat:"), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
// Comando: verificar estado de Ollama
program
    .command("health")
    .description("Verificar el estado de conexión con Ollama")
    .option("-u, --url <url>", "URL base de Ollama", "http://localhost:11434")
    .action(async (options) => {
    const spinner = (0, ora_1.default)("Verificando conexión con Ollama...").start();
    try {
        const api = new ollama_api_js_1.OllamaAPI(options.url);
        const isHealthy = await api.checkHealth();
        if (isHealthy) {
            spinner.succeed(`Ollama está funcionando correctamente en ${options.url}`);
            console.log(chalk_1.default.green("✅ El servidor está listo para recibir mensajes"));
        }
        else {
            spinner.fail(`No se pudo conectar con Ollama en ${options.url}`);
            console.log(chalk_1.default.yellow("💡 Asegúrate de que Ollama esté ejecutándose:"));
            console.log(chalk_1.default.gray("   ollama serve"));
            process.exit(1);
        }
    }
    catch (error) {
        spinner.fail("Error al verificar la conexión");
        console.error(chalk_1.default.red("Error:"), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
// Comando por defecto: mostrar ayuda
program
    .action(() => {
    console.log(chalk_1.default.blue("🦙 Ollama CLI - Interfaz de línea de comandos para chatear con Ollama\n"));
    program.help();
});
// Manejar errores no capturados
process.on("uncaughtException", (error) => {
    console.error(chalk_1.default.red("Error no manejado:"), error.message);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error(chalk_1.default.red("Promesa rechazada no manejada:"), reason);
    process.exit(1);
});
// Manejar señales de interrupción
process.on("SIGINT", () => {
    console.log(chalk_1.default.yellow("\n👋 ¡Hasta luego!"));
    process.exit(0);
});
process.on("SIGTERM", () => {
    console.log(chalk_1.default.yellow("\n👋 ¡Hasta luego!"));
    process.exit(0);
});
// Parsear argumentos de línea de comandos
program.parse();
//# sourceMappingURL=index.js.map