"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const OllamaClient_js_1 = require("./OllamaClient.js");
class ChatManager {
    constructor(config) {
        this.isRunning = false;
        this.client = new OllamaClient_js_1.OllamaClient(config);
    }
    async startChat() {
        console.log(chalk_1.default.blue("🦙 Bienvenido al CLI de Ollama"));
        console.log(chalk_1.default.gray("Escribe '/help' para ver los comandos disponibles"));
        console.log(chalk_1.default.gray("Escribe '/exit' para salir\n"));
        // Verificar conexión con Ollama
        const spinner = (0, ora_1.default)("Verificando conexión con Ollama...").start();
        const isConnected = await this.client.checkConnection();
        if (!isConnected) {
            spinner.fail("No se pudo conectar con Ollama. Asegúrate de que esté ejecutándose en http://localhost:11434");
            return;
        }
        spinner.succeed(`Conectado exitosamente. Modelo actual: ${chalk_1.default.green(this.client.getCurrentModel())}`);
        this.isRunning = true;
        await this.chatLoop();
    }
    async chatLoop() {
        while (this.isRunning) {
            try {
                const { message } = await inquirer_1.default.prompt([
                    {
                        type: "input",
                        name: "message",
                        message: chalk_1.default.cyan("Tú:"),
                        validate: (input) => {
                            if (!input.trim()) {
                                return "Por favor ingresa un mensaje";
                            }
                            return true;
                        }
                    }
                ]);
                // Verificar si es un comando
                if (message.startsWith("/")) {
                    await this.handleCommand(message);
                    continue;
                }
                // Enviar mensaje al modelo
                const spinner = (0, ora_1.default)("Pensando...").start();
                try {
                    const response = await this.client.sendMessage(message);
                    spinner.stop();
                    console.log(chalk_1.default.green(`🦙 ${this.client.getCurrentModel()}:`), response);
                    console.log(); // Línea en blanco para separar mensajes
                }
                catch (error) {
                    spinner.fail(`Error: ${error instanceof Error ? error.message : error}`);
                }
            }
            catch (error) {
                if (error instanceof Error && error.message.includes("User force closed")) {
                    // Usuario presionó Ctrl+C
                    this.isRunning = false;
                    console.log(chalk_1.default.yellow("\n¡Hasta luego!"));
                }
                else {
                    console.error(chalk_1.default.red("Error inesperado:"), error);
                }
            }
        }
    }
    async handleCommand(command) {
        const cmd = command.toLowerCase().trim();
        switch (cmd) {
            case "/help":
                this.showHelp();
                break;
            case "/clear":
                await this.clearHistory();
                break;
            case "/history":
                await this.showHistory();
                break;
            case "/exit":
                this.isRunning = false;
                console.log(chalk_1.default.yellow("¡Hasta luego!"));
                break;
            default:
                console.log(chalk_1.default.red(`Comando desconocido: ${command}`));
                console.log(chalk_1.default.gray("Escribe '/help' para ver los comandos disponibles"));
        }
    }
    showHelp() {
        console.log(chalk_1.default.blue("\n📖 Comandos disponibles:"));
        console.log(chalk_1.default.cyan("/help") + " - Muestra esta ayuda");
        console.log(chalk_1.default.cyan("/clear") + " - Limpia el historial de conversación");
        console.log(chalk_1.default.cyan("/history") + " - Muestra el historial de conversación");
        console.log(chalk_1.default.cyan("/model") + " - Cambiar el modelo de IA");
        console.log(chalk_1.default.cyan("/exit") + " - Salir del chat");
        console.log();
    }
    async clearHistory() {
        await this.client.clearHistory();
        console.log(chalk_1.default.green("✅ Historial de conversación limpiado"));
    }
    async showHistory() {
        const history = await this.client.getHistory();
        if (history.length === 0) {
            console.log(chalk_1.default.gray("📝 No hay historial de conversación"));
            return;
        }
        console.log(chalk_1.default.blue("\n📝 Historial de conversación:"));
        console.log(chalk_1.default.gray("─".repeat(50)));
        for (const msg of history) {
            const time = msg.timestamp.toLocaleTimeString();
            const role = msg.role === 'user' ? 'Tú' : '🦙';
            const color = msg.role === 'user' ? chalk_1.default.cyan : chalk_1.default.green;
            console.log(color(`[${time}] ${role}: ${msg.content}`));
        }
        console.log(chalk_1.default.gray("─".repeat(50)));
        console.log();
    }
    async stop() {
        this.isRunning = false;
    }
}
exports.ChatManager = ChatManager;
//# sourceMappingURL=ChatManager.js.map