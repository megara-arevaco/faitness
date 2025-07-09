"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const connection_1 = __importDefault(require("../database/connection"));
const routes_1 = __importDefault(require("./routes"));
const fastify = (0, fastify_1.default)({
    logger: true
});
// Register Swagger
fastify.register(swagger_1.default, {
    openapi: {
        info: {
            title: 'Faitness API',
            description: 'API for fitness and meal tracking application',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    }
});
// Register Swagger UI
fastify.register(swagger_ui_1.default, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    staticCSP: true
});
// Register CORS plugin
fastify.register(cors_1.default, {
    origin: ['http://localhost:5173'], // Vite dev server default port
    credentials: true
});
// Register all API routes
fastify.register(routes_1.default);
// Health check route
fastify.get('/health', async (request, reply) => {
    const dbStatus = await connection_1.default.testConnection();
    return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'Connected' : 'Disconnected'
    };
});
// API routes
fastify.get('/api/hello', async (request, reply) => {
    return { message: 'Hello from Fastify!' };
});
// Database test route
fastify.get('/api/db-test', async (request, reply) => {
    try {
        const result = await connection_1.default.query('SELECT NOW() as current_time, version() as pg_version');
        return {
            success: true,
            data: result.rows[0]
        };
    }
    catch (error) {
        reply.code(500);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});
// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    await connection_1.default.close();
    await fastify.close();
    process.exit(0);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Start server
const start = async () => {
    try {
        // Test database connection on startup
        await connection_1.default.testConnection();
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Server listening on http://localhost:3001');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map