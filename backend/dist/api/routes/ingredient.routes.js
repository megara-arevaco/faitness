"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const connection_1 = __importDefault(require("../../database/connection"));
const ingredientRoutes = async (fastify) => {
    // GET /api/ingredients - Get all ingredients (with optional meal filter)
    fastify.get('/api/ingredients', {
        schema: {
            tags: ['Ingredients'],
            description: 'Get all ingredients with optional meal filter',
            querystring: schemas_1.IngredientQueryJsonSchema,
            response: {
                200: {
                    type: 'array',
                    items: schemas_1.IngredientResponseJsonSchema
                }
            }
        }
    }, async (request, reply) => {
        const queryParseResult = schemas_1.IngredientQuerySchema.safeParse(request.query);
        if (!queryParseResult.success) {
            return reply.status(400).send({
                message: 'Validation error in query parameters',
                errors: queryParseResult.error.errors,
            });
        }
        const { meal_id } = queryParseResult.data;
        try {
            let query = 'SELECT id, name, description, calories, protein, carbs, fat, meal_id, created_at FROM ingredients';
            const params = [];
            if (meal_id) {
                query += ' WHERE meal_id = $1';
                params.push(meal_id);
            }
            query += ' ORDER BY created_at DESC';
            const result = await connection_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch ingredients' };
        }
    });
    // GET /api/ingredients/:id - Get ingredient by ID
    fastify.get('/api/ingredients/:id', {
        schema: {
            tags: ['Ingredients'],
            description: 'Get ingredient by ID',
            params: schemas_1.IngredientParamsJsonSchema,
            response: {
                200: schemas_1.IngredientResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.IngredientParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('SELECT id, name, description, calories, protein, carbs, fat, meal_id, created_at FROM ingredients WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Ingredient not found' };
            }
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch ingredient' };
        }
    });
    // POST /api/ingredients - Create new ingredient
    fastify.post('/api/ingredients', {
        schema: {
            tags: ['Ingredients'],
            description: 'Create new ingredient',
            body: schemas_1.CreateIngredientJsonSchema,
            response: {
                201: schemas_1.IngredientResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.CreateIngredientSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { name, description, calories, protein, carbs, fat, meal_id } = parseResult.data;
        try {
            // Check if meal exists
            const mealExists = await connection_1.default.query('SELECT id FROM meals WHERE id = $1', [meal_id]);
            if (mealExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Meal not found' };
            }
            // Insert new ingredient
            const result = await connection_1.default.query('INSERT INTO ingredients (name, description, calories, protein, carbs, fat, meal_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, description, calories, protein, carbs, fat, meal_id, created_at', [name, description, calories, protein, carbs, fat, meal_id]);
            reply.code(201);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to create ingredient' };
        }
    });
    // PUT /api/ingredients/:id - Update ingredient
    fastify.put('/api/ingredients/:id', {
        schema: {
            tags: ['Ingredients'],
            description: 'Update ingredient',
            params: schemas_1.IngredientParamsJsonSchema,
            body: schemas_1.UpdateIngredientJsonSchema,
            response: {
                200: schemas_1.IngredientResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const paramsParseResult = schemas_1.IngredientParamsSchema.safeParse(request.params);
        const bodyParseResult = schemas_1.UpdateIngredientSchema.safeParse(request.body);
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
            const ingredientExists = await connection_1.default.query('SELECT id FROM ingredients WHERE id = $1', [id]);
            if (ingredientExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Ingredient not found' };
            }
            // Build dynamic update query
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const result = await connection_1.default.query(`UPDATE ingredients SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, description, calories, protein, carbs, fat, meal_id, created_at`, [...values, id]);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to update ingredient' };
        }
    });
    // DELETE /api/ingredients/:id - Delete ingredient
    fastify.delete('/api/ingredients/:id', {
        schema: {
            tags: ['Ingredients'],
            description: 'Delete ingredient',
            params: schemas_1.IngredientParamsJsonSchema,
            response: {
                204: { type: 'null' }
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.IngredientParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('DELETE FROM ingredients WHERE id = $1 RETURNING id', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Ingredient not found' };
            }
            reply.code(204);
            return null;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to delete ingredient' };
        }
    });
};
exports.default = ingredientRoutes;
//# sourceMappingURL=ingredient.routes.js.map