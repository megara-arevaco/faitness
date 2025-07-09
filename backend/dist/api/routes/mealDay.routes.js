"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const connection_1 = __importDefault(require("../../database/connection"));
const mealDayRoutes = async (fastify) => {
    // GET /api/meal-days - Get all meal days (with optional filters)
    fastify.get('/api/meal-days', {
        schema: {
            tags: ['Meal Days'],
            description: 'Get all meal days with optional meal or day filters',
            querystring: schemas_1.MealDayQueryJsonSchema,
            response: {
                200: {
                    type: 'array',
                    items: schemas_1.MealDayResponseJsonSchema
                }
            }
        }
    }, async (request, reply) => {
        const queryParseResult = schemas_1.MealDayQuerySchema.safeParse(request.query);
        if (!queryParseResult.success) {
            return reply.status(400).send({
                message: 'Validation error in query parameters',
                errors: queryParseResult.error.errors,
            });
        }
        const { meal_id, day_of_week } = queryParseResult.data;
        try {
            let query = 'SELECT id, meal_id, day_of_week, created_at FROM meal_days';
            const params = [];
            const conditions = [];
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
            const result = await connection_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch meal days' };
        }
    });
    // GET /api/meal-days/:id - Get meal day by ID
    fastify.get('/api/meal-days/:id', {
        schema: {
            tags: ['Meal Days'],
            description: 'Get meal day by ID',
            params: schemas_1.MealDayParamsJsonSchema,
            response: {
                200: schemas_1.MealDayResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.MealDayParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('SELECT id, meal_id, day_of_week, created_at FROM meal_days WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Meal day not found' };
            }
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch meal day' };
        }
    });
    // POST /api/meal-days - Create new meal day
    fastify.post('/api/meal-days', {
        schema: {
            tags: ['Meal Days'],
            description: 'Create new meal day',
            body: schemas_1.CreateMealDayJsonSchema,
            response: {
                201: schemas_1.MealDayResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.CreateMealDaySchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { meal_id, day_of_week } = parseResult.data;
        try {
            // Check if meal exists
            const mealExists = await connection_1.default.query('SELECT id FROM meals WHERE id = $1', [meal_id]);
            if (mealExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Meal not found' };
            }
            // Check if meal day combination already exists
            const existingMealDay = await connection_1.default.query('SELECT id FROM meal_days WHERE meal_id = $1 AND day_of_week = $2', [meal_id, day_of_week]);
            if (existingMealDay.rows.length > 0) {
                reply.code(409);
                return { error: 'Meal day combination already exists' };
            }
            // Insert new meal day
            const result = await connection_1.default.query('INSERT INTO meal_days (meal_id, day_of_week) VALUES ($1, $2) RETURNING id, meal_id, day_of_week, created_at', [meal_id, day_of_week]);
            reply.code(201);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to create meal day' };
        }
    });
    // PUT /api/meal-days/:id - Update meal day
    fastify.put('/api/meal-days/:id', {
        schema: {
            tags: ['Meal Days'],
            description: 'Update meal day',
            params: schemas_1.MealDayParamsJsonSchema,
            body: schemas_1.UpdateMealDayJsonSchema,
            response: {
                200: schemas_1.MealDayResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const paramsParseResult = schemas_1.MealDayParamsSchema.safeParse(request.params);
        const bodyParseResult = schemas_1.UpdateMealDaySchema.safeParse(request.body);
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
            const mealDayExists = await connection_1.default.query('SELECT id, meal_id FROM meal_days WHERE id = $1', [id]);
            if (mealDayExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Meal day not found' };
            }
            // If updating day_of_week, check if new combination already exists
            if (updates.day_of_week) {
                const existingMealDay = await connection_1.default.query('SELECT id FROM meal_days WHERE meal_id = $1 AND day_of_week = $2 AND id != $3', [mealDayExists.rows[0].meal_id, updates.day_of_week, id]);
                if (existingMealDay.rows.length > 0) {
                    reply.code(409);
                    return { error: 'Meal day combination already exists' };
                }
            }
            // Build dynamic update query
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const result = await connection_1.default.query(`UPDATE meal_days SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, meal_id, day_of_week, created_at`, [...values, id]);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to update meal day' };
        }
    });
    // DELETE /api/meal-days/:id - Delete meal day
    fastify.delete('/api/meal-days/:id', {
        schema: {
            tags: ['Meal Days'],
            description: 'Delete meal day',
            params: schemas_1.MealDayParamsJsonSchema,
            response: {
                204: { type: 'null' }
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.MealDayParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('DELETE FROM meal_days WHERE id = $1 RETURNING id', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Meal day not found' };
            }
            reply.code(204);
            return null;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to delete meal day' };
        }
    });
};
exports.default = mealDayRoutes;
//# sourceMappingURL=mealDay.routes.js.map