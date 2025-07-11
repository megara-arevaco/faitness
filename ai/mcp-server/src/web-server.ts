import fastify from "fastify";
import fastifyCors from "@fastify/cors";

export async function createHttpServer(
  port: number = 3002,
  tools: any,
  handlers: Map<string, Function> = new Map(),
  schemas: Map<string, any> = new Map(),
  executeHandler: any
) {
  const app = fastify({ logger: true });

  // Registrar CORS con plugin oficial
  await app.register(fastifyCors, { origin: true });

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
    const { toolName } = request.params as { toolName: string };
    const args = request.body as any;

    // Validar existencia de la tool
    if (!handlers.has(toolName)) {
      reply.code(404).send({ error: `Tool not found: ${toolName}` });
      return;
    }

    // Validar argumentos con Zod
    try {
      const schema = schemas.get(toolName);
      if (!schema) throw new Error("Schema not found for tool");
      schema.parse(args);
    } catch (err) {
      reply.code(400).send({ error: "Invalid arguments", details: err });
      return;
    }

    // Ejecutar la tool
    try {
      const result = await executeHandler(toolName, args);
      reply.send(result);
    } catch (err) {
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
