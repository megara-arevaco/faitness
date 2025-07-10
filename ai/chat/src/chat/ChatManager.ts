import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { OllamaClient } from "./OllamaClient";
import { ChatConfig } from "../types/index";

export class ChatManager {
  private client: OllamaClient;
  private isRunning: boolean = false;

  constructor(config: ChatConfig) {
    this.client = new OllamaClient(config);
  }

  async startChat(): Promise<void> {
    console.log(chalk.blue("🦙 Bienvenido al CLI de Faitness"));
    console.log(chalk.gray("Escribe '/help' para ver los comandos disponibles"));
    console.log(chalk.gray("Escribe '/exit' para salir\n"));

    // Verificar conexión con Ollama
    const spinner = ora("Verificando conexión con Ollama...").start();
    const isConnected = await this.client.checkConnection();
    
    if (!isConnected) {
      spinner.fail("No se pudo conectar con Ollama. Asegúrate de que esté ejecutándose en http://localhost:11434");
      return;
    }
    
    spinner.succeed(`Conectado exitosamente. Modelo actual: ${chalk.green(this.client.getCurrentModel())}`);

    this.isRunning = true;
    await this.chatLoop();
  }

  private async chatLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        const { message } = await inquirer.prompt([
          {
            type: "input",
            name: "message",
            message: chalk.cyan("Tú:"),
            validate: (input: string) => {
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
        const spinner = ora("Pensando...").start();
        
        try {
          const response = await this.client.sendMessage(message);
          spinner.stop();
          
          console.log(chalk.green(`🦙 ${this.client.getCurrentModel()}:`), response);
          console.log(); // Línea en blanco para separar mensajes
        } catch (error) {
          spinner.fail(`Error: ${error instanceof Error ? error.message : error}`);
        }

      } catch (error) {
        if (error instanceof Error && error.message.includes("User force closed")) {
          // Usuario presionó Ctrl+C
          this.isRunning = false;
          console.log(chalk.yellow("\n¡Hasta luego!"));
        } else {
          console.error(chalk.red("Error inesperado:"), error);
        }
      }
    }
  }

  private async handleCommand(command: string): Promise<void> {
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
        console.log(chalk.yellow("¡Hasta luego!"));
        break;

      default:
        console.log(chalk.red(`Comando desconocido: ${command}`));
        console.log(chalk.gray("Escribe '/help' para ver los comandos disponibles"));
    }
  }

  private showHelp(): void {
    console.log(chalk.blue("\n📖 Comandos disponibles:"));
    console.log(chalk.cyan("/help") + " - Muestra esta ayuda");
    console.log(chalk.cyan("/clear") + " - Limpia el historial de conversación");
    console.log(chalk.cyan("/history") + " - Muestra el historial de conversación");
    console.log(chalk.cyan("/exit") + " - Salir del chat");
    console.log();
  }

  private async clearHistory(): Promise<void> {
    await this.client.clearHistory();
    console.log(chalk.green("✅ Historial de conversación limpiado"));
  }

  private async showHistory(): Promise<void> {
    const history = await this.client.getHistory();
    
    if (history.length === 0) {
      console.log(chalk.gray("📝 No hay historial de conversación"));
      return;
    }

    console.log(chalk.blue("\n📝 Historial de conversación:"));
    console.log(chalk.gray("─".repeat(50)));
    
    for (const msg of history) {
      const time = msg.timestamp.toLocaleTimeString();
      const role = msg.role === 'user' ? 'Tú' : '🦙';
      const color = msg.role === 'user' ? chalk.cyan : chalk.green;
      
      console.log(color(`[${time}] ${role}: ${msg.content}`));
    }
    
    console.log(chalk.gray("─".repeat(50)));
    console.log();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }
}