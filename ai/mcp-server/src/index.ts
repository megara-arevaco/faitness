#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Tipos para el wrapper funcional
type ZodSchema = z.ZodObject<any>;
type ToolHandler<T> = (args: T) => Promise<{
  content: Array<{
    type: 'text';
    text: string;
  }>;
}>;

// Estado global para las herramientas
const tools: Tool[] = [];
const handlers = new Map<string, ToolHandler<any>>();
const schemas = new Map<string, ZodSchema>();

// Función para registrar herramientas
function registerTool<T extends Record<string, any>>(
  name: string,
  description: string,
  schema: z.ZodObject<any>,
  handler: ToolHandler<T>
) {
  // Convertir esquema Zod a JSON Schema usando la librería
  const jsonSchema = zodToJsonSchema(schema) as any;
  
  const tool: Tool = {
    name,
    description,
    inputSchema: jsonSchema,
  };

  tools.push(tool);
  handlers.set(name, handler);
  schemas.set(name, schema);
}

// Función para ejecutar herramientas
async function executeHandler(name: string, args: any) {
  const handler = handlers.get(name);
  const schema = schemas.get(name);

  if (!handler || !schema) {
    throw new Error(`Unknown tool: ${name}`);
  }

  // Validar argumentos con Zod
  const validatedArgs = schema.parse(args);
  
  return handler(validatedArgs);
}

// Crear una instancia del servidor
const server = new Server(
  {
    name: 'basic-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Definir esquemas con Zod
const EchoSchema = z.object({
  text: z.string().describe('Text to echo back'),
});

const AddNumbersSchema = z.object({
  a: z.number().describe('First number'),
  b: z.number().describe('Second number'),
});

const GetSystemInfoSchema = z.object({});

// Definir constantes para los nombres de las herramientas
const TOOLS = {
  ECHO: 'echo',
  ADD_NUMBERS: 'add_numbers',
  GET_SYSTEM_INFO: 'get_system_info',
} as const;

// Registrar herramientas usando el enfoque funcional
registerTool(
  TOOLS.ECHO,
  'Echo back the input text',
  EchoSchema,
  async ({ text }) => {
    return {
      content: [
        {
          type: 'text',
          text: `Echo: ${text}`,
        },
      ],
    };
  }
);

registerTool(
  TOOLS.ADD_NUMBERS,
  'Add two numbers together',
  AddNumbersSchema,
  async ({ a, b }) => {
    const sum = a + b;
    return {
      content: [
        {
          type: 'text',
          text: `The sum of ${a} and ${b} is ${sum}`,
        },
      ],
    };
  }
);

registerTool(
  TOOLS.GET_SYSTEM_INFO,
  'Get basic system information',
  GetSystemInfoSchema,
  async () => {
    const systemInfo = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `System Information:\n${JSON.stringify(systemInfo, null, 2)}`,
        },
      ],
    };
  }
);

// Configurar manejadores del servidor
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return executeHandler(name, args);
});

// Función principal para iniciar el servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server started successfully');
}

// Manejo de errores y señales
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.close();
  process.exit(0);
});

// Iniciar el servidor
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});