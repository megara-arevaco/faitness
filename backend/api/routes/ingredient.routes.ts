import { FastifyPluginAsync } from 'fastify';
import {
  CreateIngredientSchema,
  UpdateIngredientSchema,
  IngredientParamsSchema,
  IngredientQuerySchema,
  IngredientResponseJsonSchema,
  CreateIngredientJsonSchema,
  UpdateIngredientJsonSchema,
  IngredientParamsJsonSchema,
  IngredientQueryJsonSchema,
  CreateIngredient,
  UpdateIngredient,
  IngredientParams,
  IngredientQuery,
  IngredientResponse
} from '../schemas';
import database from '../../database/connection';

const ingredientRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/ingredients - Get all ingredients (with optional meal filter)
  fastify.get('/api/ingredients', {
    schema: {
      tags: ['Ingredients'],
      description: 'Get all ingredients with optional meal filter',
      querystring: IngredientQueryJsonSchema,
      response: {
        200: {
          type: 'array',
          items: IngredientResponseJsonSchema
        }
      }
    }
  }, async (request, reply) => {
    const queryParseResult = IngredientQuerySchema.safeParse(request.query);

    if (!queryParseResult.success) {
      return reply.status(400).send({
        message: 'Validation error in query parameters',
        errors: queryParseResult.error.errors,
      });
    }

    const { meal_id } = queryParseResult.data;
    
    try {
      let query = 'SELECT id, name, description, calories, protein, carbs, fat, meal_id, created_at FROM ingredients';
      const params: any[] = [];

      if (meal_id) {
        query += ' WHERE meal_id = $1';
        params.push(meal_id);
      }

      query += ' ORDER BY created_at DESC';

      const result = await database.query(query, params);
      return result.rows;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch ingredients' };
    }
  });

  // GET /api/ingredients/:id - Get ingredient by ID
  fastify.get('/api/ingredients/:id', {
    schema: {
      tags: ['Ingredients'],
      description: 'Get ingredient by ID',
      params: IngredientParamsJsonSchema,
      response: {
        200: IngredientResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = IngredientParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('SELECT id, name, description, calories, protein, carbs, fat, meal_id, created_at FROM ingredients WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Ingredient not found' };
      }
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to fetch ingredient' };
    }
  });

  // POST /api/ingredients - Create new ingredient
  fastify.post('/api/ingredients', {
    schema: {
      tags: ['Ingredients'],
      description: 'Create new ingredient',
      body: CreateIngredientJsonSchema,
      response: {
        201: IngredientResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const parseResult = CreateIngredientSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { name, description, calories, protein, carbs, fat, meal_id } = parseResult.data;
    
    try {
      // Check if meal exists
      const mealExists = await database.query('SELECT id FROM meals WHERE id = $1', [meal_id]);
      if (mealExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Meal not found' };
      }
      
      // Insert new ingredient
      const result = await database.query(
        'INSERT INTO ingredients (name, description, calories, protein, carbs, fat, meal_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, description, calories, protein, carbs, fat, meal_id, created_at',
        [name, description, calories, protein, carbs, fat, meal_id]
      );
      
      reply.code(201);
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create ingredient' };
    }
  });

  // PUT /api/ingredients/:id - Update ingredient
  fastify.put('/api/ingredients/:id', {
    schema: {
      tags: ['Ingredients'],
      description: 'Update ingredient',
      params: IngredientParamsJsonSchema,
      body: UpdateIngredientJsonSchema,
      response: {
        200: IngredientResponseJsonSchema
      }
    }
  }, async (request, reply) => {
    const paramsParseResult = IngredientParamsSchema.safeParse(request.params);
    const bodyParseResult = UpdateIngredientSchema.safeParse(request.body);

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
      // Check if ingredient exists
      const ingredientExists = await database.query('SELECT id FROM ingredients WHERE id = $1', [id]);
      if (ingredientExists.rows.length === 0) {
        reply.code(404);
        return { error: 'Ingredient not found' };
      }
      
      // Build dynamic update query
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await database.query(
        `UPDATE ingredients SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, description, calories, protein, carbs, fat, meal_id, created_at`,
        [...values, id]
      );
      
      return result.rows[0];
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to update ingredient' };
    }
  });

  // DELETE /api/ingredients/:id - Delete ingredient
  fastify.delete('/api/ingredients/:id', {
    schema: {
      tags: ['Ingredients'],
      description: 'Delete ingredient',
      params: IngredientParamsJsonSchema,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const parseResult = IngredientParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    
    try {
      const result = await database.query('DELETE FROM ingredients WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Ingredient not found' };
      }
      
      reply.code(204);
      return null;
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to delete ingredient' };
    }
  });
};

export default ingredientRoutes;