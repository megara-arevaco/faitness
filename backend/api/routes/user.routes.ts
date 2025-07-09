import { FastifyPluginAsync } from 'fastify';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserParamsSchema,
  UserResponseJsonSchema,
  CreateUserJsonSchema,
  UpdateUserJsonSchema,
  UserParamsJsonSchema,
  CreateUser,
  UpdateUser,
  UserParams,
  UserResponse
} from '../schemas';
import database from '../../database/connection';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/users - Get all users
  fastify.get('/api/users', {
    schema: {
      tags: ['Users'],
      description: 'Get all users',
      response: {
        200: {
          type: 'array',
          items: UserResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    try {
      const result = await database.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch users' };
    }
  });

  // GET /api/users/:id - Get user by ID
  fastify.get('/api/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Get user by ID',
      params: UserParamsJsonSchema,
      response: {
        200: UserResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = UserParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch user' };
    }
  });

  // POST /api/users - Create new user
  fastify.post('/api/users', {
    schema: {
      tags: ['Users'],
      description: 'Create new user',
      body: CreateUserJsonSchema,
      response: {
        201: UserResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateUserSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { name, email, password } = parseResult.data;
    
    try {
      
      // Check if user already exists
      const existingUser = await database.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        reply.code(409);
        return { error: 'User with this email already exists' };
      }
      
      // Insert new user
      const result = await database.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, password]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create user' };
    }
  });

  // PUT /api/users/:id - Update user
  fastify.put('/api/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Update user',
      params: UserParamsJsonSchema,
      body: UpdateUserJsonSchema,
      response: {
        200: UserResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = UserParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateUserSchema.safeParse(request.body);

    if (!paramsParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in params',
        errors: paramsParseResult.error.errors,
      });
    }

    if (!bodyParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in body',
        errors: bodyParseResult.error.errors,
      });
    }

    const { id } = paramsParseResult.data;
    const updates = bodyParseResult.data;
    
    try {
      
      // Check if user exists
      const userExists = await database.query('SELECT id FROM users WHERE id = $1', [id]);
      if (userExists.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, email, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update user' };
    }
  });

  // DELETE /api/users/:id - Delete user
  fastify.delete('/api/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Delete user',
      params: UserParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = UserParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      
      const result = await database.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete user' };
    }
  });
};

export default userRoutes;