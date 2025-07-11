import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPToolCall {
  name: string;
  arguments: any;
}

export interface MCPToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private serverProcess: ChildProcess | null = null;
  private tools: MCPTool[] = [];
  private connected: boolean = false;
  private request: any = null;

  async connect(): Promise<void> {
    try {
      // Ruta al servidor MCP
      const serverPath = path.join(
        process.cwd(),
        "..",
        "mcp-server",
        "src",
        "index.ts"
      );

      // Iniciar el proceso del servidor MCP
      this.serverProcess = spawn("npx", ["ts-node", serverPath], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: path.dirname(serverPath),
      });

      if (!this.serverProcess.stdin || !this.serverProcess.stdout) {
        throw new Error("Failed to create server process streams");
      }

      this.transport = new StdioClientTransport({
        command: "npx",
        args: ["ts-node", serverPath],
        cwd: path.dirname(serverPath),
      });

      this.client = new Client(
        {
          name: "faitness-mcp-client",
          version: "1.0.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      await this.client.connect(this.transport);

      await this.loadTools();

      this.connected = true;
      console.error("MCP Client connected successfully");
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      throw error;
    }
  }

  private async loadTools(): Promise<void> {
    if (!this.client) {
      throw new Error("Client not connected");
    }

    try {
      const request = await this.client.listTools();

      this.tools = request.tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema || {},
      }));

      console.error(`Loaded ${this.tools.length} MCP tools`);
    } catch (error) {
      console.error("Failed to load tools:", this.request);
      // No rethrow - continuar sin herramientas
      this.tools = [];
    }
  }

  async callTool(name: string, args: any): Promise<any> {
    if (!this.client || !this.connected) {
      throw new Error("Client not connected");
    }

    try {
      const result = await this.client.callTool({
        name,
        arguments: args,
      });

      return result;
    } catch (error) {
      console.error(`Failed to call tool ${name}:`, error);
      throw error;
    }
  }

  getAvailableTools(): MCPTool[] {
    return [...this.tools];
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }

      if (this.serverProcess) {
        this.serverProcess.kill();
        this.serverProcess = null;
      }

      this.connected = false;
      console.error("MCP Client disconnected");
    } catch (error) {
      console.error("Error disconnecting MCP client:", error);
    }
  }

  // Generar prompt con herramientas disponibles para el modelo
  getToolsPrompt(): string {
    if (this.tools.length === 0) {
      return "";
    }

    let prompt = "\n\nHerramientas disponibles:\n";

    for (const tool of this.tools) {
      prompt += `- ${tool.name}: ${tool.description}\n`;

      // Añadir esquema de entrada si está disponible
      if (tool.inputSchema && tool.inputSchema.properties) {
        const params = Object.keys(tool.inputSchema.properties).join(", ");
        prompt += `  Parámetros: ${params}\n`;
      }
    }

    prompt += "\nPara usar una herramienta, responde con el formato:\n";
    prompt += 'TOOL_CALL: {"name": "nombre_herramienta", "arguments": {...}}\n';

    return prompt;
  }

  // Detectar si la respuesta contiene una llamada a herramienta
  parseToolCall(response: string): MCPToolCall | null {
    const toolCallMatch = response.match(/TOOL_CALL:\s*({.*})/);

    if (toolCallMatch) {
      try {
        const toolCall = JSON.parse(toolCallMatch[1]);
        if (toolCall.name && typeof toolCall.arguments === "object") {
          return toolCall;
        }
      } catch (error) {
        console.error("Failed to parse tool call:", error);
      }
    }

    return null;
  }
}
