import { FastifyPluginAsync } from 'fastify';
import {
  CreateMealSchema,
  UpdateMealSchema,
  MealParamsSchema,
  MealQuerySchema,
  MealResponseJsonSchema,
  CreateMealJsonSchema,
  UpdateMealJsonSchema,
  MealParamsJsonSchema,
  MealQueryJsonSchema,
  CreateMeal,
  UpdateMeal,
  MealParams,
  MealQuery,
  MealResponse
} from '../schemas';
import database from '../../database/connection';

const mealRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/meals - Get all meals (with optional user filter)
  fastify.get('/api/meals', {
    schema: {
      tags: ['Meals'],
      description: 'Get all meals with optional user filter',
      querystring: MealQueryJsonSchema,
      response: {
        200: {
          type: 'array',
          items: MealResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    const queryParseResult = MealQuerySchema.safeParse(request.query);

    if (!queryParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in query parameters',
        errors: queryParseResult.error.errors,
      });
    }

    const { user_id } = queryParseResult.data;
    
    try {
      let query = 'SELECT id, name, description, user_id, created_at FROM meals';
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
      return { error: 'Failed to fetch meals' };
    }
  });

  // GET /api/meals/:id - Get meal by ID
  fastify.get('/api/meals/:id', {
    schema: {
      tags: ['Meals'],
      description: 'Get meal by ID',
      params: MealParamsJsonSchema,
      response: {
        200: MealResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = MealParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, name, description, user_id, created_at FROM meals WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch meal' };
    }
  });

  // POST /api/meals - Create new meal
  fastify.post('/api/meals', {
    schema: {
      tags: ['Meals'],
      description: 'Create new meal',
      body: CreateMealJsonSchema,
      response: {
        201: MealResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateMealSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { name, description, user_id } = parseResult.data;
    
    try {
      // Check if user exists
      const userExists = await database.query('SELECT id FROM users WHERE id = $1', [user_id]);
      if (userExists.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }
      
      // Insert new meal
      const result = await database.query(
        'INSERT INTO meals (name, description, user_id) VALUES ($1, $2, $3) RETURNING id, name, description, user_id, created_at',
        [name, description, user_id]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create meal' };
    }
  });

  // PUT /api/meals/:id - Update meal
  fastify.put('/api/meals/:id', {
    schema: {
      tags: ['Meals'],
      description: 'Update meal',
      params: MealParamsJsonSchema,
      body: UpdateMealJsonSchema,
      response: {
        200: MealResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = MealParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateMealSchema.safeParse(request.body);

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
      // Check if meal exists
      const mealExists = await database.query('SELECT id FROM meals WHERE id = $1', [id]);
      if (mealExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal not found' };
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE meals SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, description, user_id, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update meal' };
    }
  });

  // DELETE /api/meals/:id - Delete meal
  fastify.delete('/api/meals/:id', {
    schema: {
      tags: ['Meals'],
      description: 'Delete meal',
      params: MealParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = MealParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('DELETE FROM meals WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete meal' };
    }
  });
};

export default mealRoutes;