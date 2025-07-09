import { FastifyPluginAsync } from 'fastify';
import {
  CreateMealDaySchema,
  UpdateMealDaySchema,
  MealDayParamsSchema,
  MealDayQuerySchema,
  MealDayResponseJsonSchema,
  CreateMealDayJsonSchema,
  UpdateMealDayJsonSchema,
  MealDayParamsJsonSchema,
  MealDayQueryJsonSchema,
  CreateMealDay,
  UpdateMealDay,
  MealDayParams,
  MealDayQuery,
  MealDayResponse
} from '../schemas';
import database from '../../database/connection';

const mealDayRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/meal-days - Get all meal days (with optional filters)
  fastify.get('/api/meal-days', {
    schema: {
      tags: ['Meal Days'],
      description: 'Get all meal days with optional meal or day filters',
      querystring: MealDayQueryJsonSchema,
      response: {
        200: {
          type: 'array',
          items: MealDayResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    const queryParseResult = MealDayQuerySchema.safeParse(request.query);

    if (!queryParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in query parameters',
        errors: queryParseResult.error.errors,
      });
    }

    const { meal_id, day_of_week } = queryParseResult.data;
    
    try {
      let query = 'SELECT id, meal_id, day_of_week, created_at FROM meal_days';
      const params: any[] = [];
      const conditions: string[] = [];

      if (meal_id) {
        conditions.push(`meal_id = $${params.length + 1}`);
        params.push(meal_id);
      }

      if (day_of_week) {
        conditions.push(`day_of_week = $${params.length + 1}`);
        params.push(day_of_week);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      const result = await database.query(query, params);
      return result.rows;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch meal days' };
    }
  });

  // GET /api/meal-days/:id - Get meal day by ID
  fastify.get('/api/meal-days/:id', {
    schema: {
      tags: ['Meal Days'],
      description: 'Get meal day by ID',
      params: MealDayParamsJsonSchema,
      response: {
        200: MealDayResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = MealDayParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, meal_id, day_of_week, created_at FROM meal_days WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal day not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch meal day' };
    }
  });

  // POST /api/meal-days - Create new meal day
  fastify.post('/api/meal-days', {
    schema: {
      tags: ['Meal Days'],
      description: 'Create new meal day',
      body: CreateMealDayJsonSchema,
      response: {
        201: MealDayResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateMealDaySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { meal_id, day_of_week } = parseResult.data;
    
    try {
      // Check if meal exists
      const mealExists = await database.query('SELECT id FROM meals WHERE id = $1', [meal_id]);
      if (mealExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal not found' };
      }

      // Check if meal day combination already exists
      const existingMealDay = await database.query(
        'SELECT id FROM meal_days WHERE meal_id = $1 AND day_of_week = $2',
        [meal_id, day_of_week]
      );
      if (existingMealDay.rows.length > 0) {
        reply.code(409);
        return { error: 'Meal day combination already exists' };
      }
      
      // Insert new meal day
      const result = await database.query(
        'INSERT INTO meal_days (meal_id, day_of_week) VALUES ($1, $2) RETURNING id, meal_id, day_of_week, created_at',
        [meal_id, day_of_week]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create meal day' };
    }
  });

  // PUT /api/meal-days/:id - Update meal day
  fastify.put('/api/meal-days/:id', {
    schema: {
      tags: ['Meal Days'],
      description: 'Update meal day',
      params: MealDayParamsJsonSchema,
      body: UpdateMealDayJsonSchema,
      response: {
        200: MealDayResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = MealDayParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateMealDaySchema.safeParse(request.body);

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
      // Check if meal day exists
      const mealDayExists = await database.query('SELECT id, meal_id FROM meal_days WHERE id = $1', [id]);
      if (mealDayExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal day not found' };
      }

      // If updating day_of_week, check if new combination already exists
      if (updates.day_of_week) {
        const existingMealDay = await database.query(
          'SELECT id FROM meal_days WHERE meal_id = $1 AND day_of_week = $2 AND id != $3',
          [mealDayExists.rows[0].meal_id, updates.day_of_week, id]
        );
        if (existingMealDay.rows.length > 0) {
          reply.code(409);
          return { error: 'Meal day combination already exists' };
        }
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE meal_days SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, meal_id, day_of_week, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update meal day' };
    }
  });

  // DELETE /api/meal-days/:id - Delete meal day
  fastify.delete('/api/meal-days/:id', {
    schema: {
      tags: ['Meal Days'],
      description: 'Delete meal day',
      params: MealDayParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = MealDayParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('DELETE FROM meal_days WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal day not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete meal day' };
    }
  });
};

export default mealDayRoutes;