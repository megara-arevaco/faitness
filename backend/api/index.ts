import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import database from '../database/connection';
import routes from './routes';

const fastify = Fastify({
  logger: true
});

// Register Swagger
fastify.register(swagger, {
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
fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true
});

// Register CORS plugin
fastify.register(cors, {
  origin: ['http://localhost:5173'], // Vite dev server default port
  credentials: true
});

// Register all API routes
fastify.register(routes);

// Health check route
fastify.get('/health', async (request, reply) => {
  const dbStatus = await database.testConnection();

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
    const result = await database.query('SELECT NOW() as current_time, version() as pg_version');

    return { 
      success: true, 
      data: result.rows[0] 
    };
  } catch (error) {
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

  await database.close();
  await fastify.close();
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const start = async () => {
  try {
    // Test database connection on startup
    await database.testConnection();
    
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();