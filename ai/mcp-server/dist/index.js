#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
// Crear una instancia del servidor
const server = new index_js_1.Server({
    name: 'basic-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Wrapper para proporcionar la funcionalidad server.tool()
class MCPServerWrapper {
    constructor() {
        this.tools = [];
        this.handlers = new Map();
        this.schemas = new Map();
    }
    tool(name, description, schema, handler) {
        // Convertir esquema Zod a JSON Schema usando la librería
        const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema);
        const tool = {
            name,
            description,
            inputSchema: jsonSchema,
        };
        this.tools.push(tool);
        this.handlers.set(name, handler);
        this.schemas.set(name, schema);
    }
    getTools() {
        return this.tools;
    }
    async executeHandler(name, args) {
        const handler = this.handlers.get(name);
        const schema = this.schemas.get(name);
        if (!handler || !schema) {
            throw new Error(`Unknown tool: ${name}`);
        }
        // Validar argumentos con Zod
        const validatedArgs = schema.parse(args);
        return handler(validatedArgs);
    }
}
// Crear instancia del wrapper
const mcpServer = new MCPServerWrapper();
// Definir esquemas con Zod
const EchoSchema = zod_1.z.object({
    text: zod_1.z.string().describe('Text to echo back'),
});
const AddNumbersSchema = zod_1.z.object({
    a: zod_1.z.number().describe('First number'),
    b: zod_1.z.number().describe('Second number'),
});
const GetSystemInfoSchema = zod_1.z.object({});
// Definir constantes para los nombres de las herramientas
const TOOLS = {
    ECHO: 'echo',
    ADD_NUMBERS: 'add_numbers',
    GET_SYSTEM_INFO: 'get_system_info',
};
// Registrar herramientas usando el enfoque que prefieres
mcpServer.tool(TOOLS.ECHO, 'Echo back the input text', EchoSchema, async ({ text }) => {
    return {
        content: [
            {
                type: 'text',
                text: `Echo: ${text}`,
            },
        ],
    };
});
mcpServer.tool(TOOLS.ADD_NUMBERS, 'Add two numbers together', AddNumbersSchema, async ({ a, b }) => {
    const sum = a + b;
    return {
        content: [
            {
                type: 'text',
                text: `The sum of ${a} and ${b} is ${sum}`,
            },
        ],
    };
});
mcpServer.tool(TOOLS.GET_SYSTEM_INFO, 'Get basic system information', GetSystemInfoSchema, async () => {
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
});
// Configurar manejadores del servidor
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: mcpServer.getTools(),
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return mcpServer.executeHandler(name, args);
});
// Función principal para iniciar el servidor
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
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
