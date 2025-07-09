import { FastifyPluginAsync } from 'fastify';
import {
  CreateWorkoutSchema,
  UpdateWorkoutSchema,
  WorkoutParamsSchema,
  WorkoutQuerySchema,
  WorkoutResponseJsonSchema,
  CreateWorkoutJsonSchema,
  UpdateWorkoutJsonSchema,
  WorkoutParamsJsonSchema,
  WorkoutQueryJsonSchema,
  CreateWorkout,
  UpdateWorkout,
  WorkoutParams,
  WorkoutQuery,
  WorkoutResponse
} from '../schemas';
import database from '../../database/connection';

const workoutRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/workouts - Get all workouts (with optional user filter)
  fastify.get('/api/workouts', {
    schema: {
      tags: ['Workouts'],
      description: 'Get all workouts with optional user filter',
      querystring: WorkoutQueryJsonSchema,
      response: {
        200: {
          type: 'array',
          items: WorkoutResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    const queryParseResult = WorkoutQuerySchema.safeParse(request.query);

    if (!queryParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in query parameters',
        errors: queryParseResult.error.errors,
      });
    }

    const { user_id } = queryParseResult.data;
    
    try {
      let query = 'SELECT id, name, user_id, created_at FROM workouts';
      const params: any[] = [];

      if (user_id) {
        query += ' WHERE user_id = $1';
        params.push(user_id);
      }

      query += ' ORDER BY created_at DESC';

      const result = await database.query(query, params);
      return result.rows;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch workouts' };
    }
  });

  // GET /api/workouts/:id - Get workout by ID
  fastify.get('/api/workouts/:id', {
    schema: {
      tags: ['Workouts'],
      description: 'Get workout by ID',
      params: WorkoutParamsJsonSchema,
      response: {
        200: WorkoutResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = WorkoutParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, name, user_id, created_at FROM workouts WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Workout not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch workout' };
    }
  });

  // POST /api/workouts - Create new workout
  fastify.post('/api/workouts', {
    schema: {
      tags: ['Workouts'],
      description: 'Create new workout',
      body: CreateWorkoutJsonSchema,
      response: {
        201: WorkoutResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateWorkoutSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { name, user_id } = parseResult.data;
    
    try {
      // Check if user exists
      const userExists = await database.query('SELECT id FROM users WHERE id = $1', [user_id]);
      if (userExists.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }
      
      // Insert new workout
      const result = await database.query(
        'INSERT INTO workouts (name, user_id) VALUES ($1, $2) RETURNING id, name, user_id, created_at',
        [name, user_id]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create workout' };
    }
  });

  // PUT /api/workouts/:id - Update workout
  fastify.put('/api/workouts/:id', {
    schema: {
      tags: ['Workouts'],
      description: 'Update workout',
      params: WorkoutParamsJsonSchema,
      body: UpdateWorkoutJsonSchema,
      response: {
        200: WorkoutResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = WorkoutParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateWorkoutSchema.safeParse(request.body);

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
      // Check if workout exists
      const workoutExists = await database.query('SELECT id FROM workouts WHERE id = $1', [id]);
      if (workoutExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Workout not found' };
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE workouts SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, user_id, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update workout' };
    }
  });

  // DELETE /api/workouts/:id - Delete workout
  fastify.delete('/api/workouts/:id', {
    schema: {
      tags: ['Workouts'],
      description: 'Delete workout',
      params: WorkoutParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = WorkoutParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('DELETE FROM workouts WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Workout not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete workout' };
    }
  });
};

export default workoutRoutes;