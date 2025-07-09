import { FastifyPluginAsync } from 'fastify';
import {
  CreateSetSchema,
  UpdateSetSchema,
  SetParamsSchema,
  SetQuerySchema,
  SetResponseJsonSchema,
  CreateSetJsonSchema,
  UpdateSetJsonSchema,
  SetParamsJsonSchema,
  SetQueryJsonSchema,
  CreateSet,
  UpdateSet,
  SetParams,
  SetQuery,
  SetResponse
} from '../schemas';
import database from '../../database/connection';

const setRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/sets - Get all sets (with optional exercise filter)
  fastify.get('/api/sets', {
    schema: {
      tags: ['Sets'],
      description: 'Get all sets with optional exercise filter',
      querystring: SetQueryJsonSchema,
      response: {
        200: {
          type: 'array',
          items: SetResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    const queryParseResult = SetQuerySchema.safeParse(request.query);

    if (!queryParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in query parameters',
        errors: queryParseResult.error.errors,
      });
    }

    const { exercise_id } = queryParseResult.data;
    
    try {
      let query = 'SELECT id, exercise_id, reps, weight, created_at FROM sets';
      const params: any[] = [];

      if (exercise_id) {
        query += ' WHERE exercise_id = $1';
        params.push(exercise_id);
      }

      query += ' ORDER BY created_at DESC';

      const result = await database.query(query, params);
      return result.rows;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch sets' };
    }
  });

  // GET /api/sets/:id - Get set by ID
  fastify.get('/api/sets/:id', {
    schema: {
      tags: ['Sets'],
      description: 'Get set by ID',
      params: SetParamsJsonSchema,
      response: {
        200: SetResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = SetParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, exercise_id, reps, weight, created_at FROM sets WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Set not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch set' };
    }
  });

  // POST /api/sets - Create new set
  fastify.post('/api/sets', {
    schema: {
      tags: ['Sets'],
      description: 'Create new set',
      body: CreateSetJsonSchema,
      response: {
        201: SetResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateSetSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { exercise_id, reps, weight } = parseResult.data;
    
    try {
      // Check if exercise exists
      const exerciseExists = await database.query('SELECT id FROM exercises WHERE id = $1', [exercise_id]);
      if (exerciseExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Exercise not found' };
      }
      
      // Insert new set
      const result = await database.query(
        'INSERT INTO sets (exercise_id, reps, weight) VALUES ($1, $2, $3) RETURNING id, exercise_id, reps, weight, created_at',
        [exercise_id, reps, weight]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create set' };
    }
  });

  // PUT /api/sets/:id - Update set
  fastify.put('/api/sets/:id', {
    schema: {
      tags: ['Sets'],
      description: 'Update set',
      params: SetParamsJsonSchema,
      body: UpdateSetJsonSchema,
      response: {
        200: SetResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = SetParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateSetSchema.safeParse(request.body);

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
      // Check if set exists
      const setExists = await database.query('SELECT id FROM sets WHERE id = $1', [id]);
      if (setExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Set not found' };
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE sets SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, exercise_id, reps, weight, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update set' };
    }
  });

  // DELETE /api/sets/:id - Delete set
  fastify.delete('/api/sets/:id', {
    schema: {
      tags: ['Sets'],
      description: 'Delete set',
      params: SetParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = SetParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('DELETE FROM sets WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Set not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete set' };
    }
  });
};

export default setRoutes;