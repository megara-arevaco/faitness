import { FastifyPluginAsync } from 'fastify';
import {
  CreateExerciseSchema,
  UpdateExerciseSchema,
  ExerciseParamsSchema,
  ExerciseQuerySchema,
  ExerciseResponseJsonSchema,
  CreateExerciseJsonSchema,
  UpdateExerciseJsonSchema,
  ExerciseParamsJsonSchema,
  ExerciseQueryJsonSchema,
  CreateExercise,
  UpdateExercise,
  ExerciseParams,
  ExerciseQuery,
  ExerciseResponse
} from '../schemas';
import database from '../../database/connection';


const exerciseRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/exercises - Get all exercises (with optional workout filter)
  fastify.get('/api/exercises', {
    schema: {
      tags: ['Exercises'],
      description: 'Get all exercises with optional workout filter',
      querystring: ExerciseQueryJsonSchema,
      response: {
        200: {
          type: 'array',
          items: ExerciseResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    const queryParseResult = ExerciseQuerySchema.safeParse(request.query);

    if (!queryParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in query parameters',
        errors: queryParseResult.error.errors,
      });
    }

    const { workout_id } = queryParseResult.data;
    
    try {
      let query = 'SELECT id, name, description, workout_id, created_at FROM exercises';
      const params: any[] = [];

      if (workout_id) {
        query += ' WHERE workout_id = $1';
        params.push(workout_id);
      }

      query += ' ORDER BY created_at DESC';

      const result = await database.query(query, params);
      return result.rows;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch exercises' };
    }
  });

  // GET /api/exercises/:id - Get exercise by ID
  fastify.get('/api/exercises/:id', {
    schema: {
      tags: ['Exercises'],
      description: 'Get exercise by ID',
      params: ExerciseParamsJsonSchema,
      response: {
        200: ExerciseResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = ExerciseParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, name, description, workout_id, created_at FROM exercises WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Exercise not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch exercise' };
    }
  });

  // POST /api/exercises - Create new exercise
  fastify.post('/api/exercises', {
    schema: {
      tags: ['Exercises'],
      description: 'Create new exercise',
      body: CreateExerciseJsonSchema,
      response: {
        201: ExerciseResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateExerciseSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { name, description, workout_id } = parseResult.data;
    
    try {
      // Check if workout exists
      const workoutExists = await database.query('SELECT id FROM workouts WHERE id = $1', [workout_id]);
      if (workoutExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Workout not found' };
      }
      
      // Insert new exercise
      const result = await database.query(
        'INSERT INTO exercises (name, description, workout_id) VALUES ($1, $2, $3) RETURNING id, name, description, workout_id, created_at',
        [name, description, workout_id]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create exercise' };
    }
  });

  // PUT /api/exercises/:id - Update exercise
  fastify.put('/api/exercises/:id', {
    schema: {
      tags: ['Exercises'],
      description: 'Update exercise',
      params: ExerciseParamsJsonSchema,
      body: UpdateExerciseJsonSchema,
      response: {
        200: ExerciseResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = ExerciseParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateExerciseSchema.safeParse(request.body);

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
      // Check if exercise exists
      const exerciseExists = await database.query('SELECT id FROM exercises WHERE id = $1', [id]);
      if (exerciseExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Exercise not found' };
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE exercises SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, description, workout_id, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update exercise' };
    }
  });

  // DELETE /api/exercises/:id - Delete exercise
  fastify.delete('/api/exercises/:id', {
    schema: {
      tags: ['Exercises'],
      description: 'Delete exercise',
      params: ExerciseParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = ExerciseParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('DELETE FROM exercises WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Exercise not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete exercise' };
    }
  });
};

export default exerciseRoutes;