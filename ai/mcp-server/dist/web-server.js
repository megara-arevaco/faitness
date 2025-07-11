"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpServer = createHttpServer;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
async function createHttpServer(port = 3002, tools, handlers = new Map(), schemas = new Map(), executeHandler) {
    const app = (0, fastify_1.default)({ logger: true });
    // Registrar CORS con plugin oficial
    await app.register(cors_1.default, { origin: true });
    // Endpoint raíz con info básica
    app.get("/", async () => ({
        name: "basic-mcp-server",
        version: "1.0.0",
        mode: "http",
        toolsCount: tools.length,
        endpoints: ["/tools", "/tools/:toolName", "/health", "/info"],
    }));
    // Endpoint para listar tools
    app.get("/tools", async () => ({ tools }));
    // Endpoint para ejecutar tools
    app.post("/tools/:toolName", async (request, reply) => {
        const { toolName } = request.params;
        const args = request.body;
        // Validar existencia de la tool
        if (!handlers.has(toolName)) {
            reply.code(404).send({ error: `Tool not found: ${toolName}` });
            return;
        }
        // Validar argumentos con Zod
        try {
            const schema = schemas.get(toolName);
            if (!schema)
                throw new Error("Schema not found for tool");
            schema.parse(args);
        }
        catch (err) {
            reply.code(400).send({ error: "Invalid arguments", details: err });
            return;
        }
        // Ejecutar la tool
        try {
            const result = await executeHandler(toolName, args);
            reply.send(result);
        }
        catch (err) {
            reply.code(500).send({
                error: err instanceof Error ? err.message : "Internal server error",
            });
        }
    });
    // Endpoint de health check
    app.get("/health", async () => ({
        status: "ok",
        timestamp: new Date().toISOString(),
    }));
    // Endpoint para obtener información del servidor
    app.get("/info", async () => ({
        name: "basic-mcp-server",
        version: "1.0.0",
        mode: "http",
        toolsCount: tools.length,
    }));
    return app;
}
