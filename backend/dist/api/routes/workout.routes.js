"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const connection_1 = __importDefault(require("../../database/connection"));
const workoutRoutes = async (fastify) => {
    // GET /api/workouts - Get all workouts (with optional user filter)
    fastify.get('/api/workouts', {
        schema: {
            tags: ['Workouts'],
            description: 'Get all workouts with optional user filter',
            querystring: schemas_1.WorkoutQueryJsonSchema,
            response: {
                200: {
                    type: 'array',
                    items: schemas_1.WorkoutResponseJsonSchema
                }
            }
        }
    }, async (request, reply) => {
        const queryParseResult = schemas_1.WorkoutQuerySchema.safeParse(request.query);
        if (!queryParseResult.success) {
            return reply.status(400).send({
                message: 'Validation error in query parameters',
                errors: queryParseResult.error.errors,
            });
        }
        const { user_id } = queryParseResult.data;
        try {
            let query = 'SELECT id, name, user_id, created_at FROM workouts';
            const params = [];
            if (user_id) {
                query += ' WHERE user_id = $1';
                params.push(user_id);
            }
            query += ' ORDER BY created_at DESC';
            const result = await connection_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch workouts' };
        }
    });
    // GET /api/workouts/:id - Get workout by ID
    fastify.get('/api/workouts/:id', {
        schema: {
            tags: ['Workouts'],
            description: 'Get workout by ID',
            params: schemas_1.WorkoutParamsJsonSchema,
            response: {
                200: schemas_1.WorkoutResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.WorkoutParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('SELECT id, name, user_id, created_at FROM workouts WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Workout not found' };
            }
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch workout' };
        }
    });
    // POST /api/workouts - Create new workout
    fastify.post('/api/workouts', {
        schema: {
            tags: ['Workouts'],
            description: 'Create new workout',
            body: schemas_1.CreateWorkoutJsonSchema,
            response: {
                201: schemas_1.WorkoutResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.CreateWorkoutSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { name, user_id } = parseResult.data;
        try {
            // Check if user exists
            const userExists = await connection_1.default.query('SELECT id FROM users WHERE id = $1', [user_id]);
            if (userExists.rows.length === 0) {
                reply.code(404);
                return { error: 'User not found' };
            }
            // Insert new workout
            const result = await connection_1.default.query('INSERT INTO workouts (name, user_id) VALUES ($1, $2) RETURNING id, name, user_id, created_at', [name, user_id]);
            reply.code(201);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to create workout' };
        }
    });
    // PUT /api/workouts/:id - Update workout
    fastify.put('/api/workouts/:id', {
        schema: {
            tags: ['Workouts'],
            description: 'Update workout',
            params: schemas_1.WorkoutParamsJsonSchema,
            body: schemas_1.UpdateWorkoutJsonSchema,
            response: {
                200: schemas_1.WorkoutResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const paramsParseResult = schemas_1.WorkoutParamsSchema.safeParse(request.params);
        const bodyParseResult = schemas_1.UpdateWorkoutSchema.safeParse(request.body);
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
            const workoutExists = await connection_1.default.query('SELECT id FROM workouts WHERE id = $1', [id]);
            if (workoutExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Workout not found' };
            }
            // Build dynamic update query
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const result = await connection_1.default.query(`UPDATE workouts SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, user_id, created_at`, [...values, id]);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to update workout' };
        }
    });
    // DELETE /api/workouts/:id - Delete workout
    fastify.delete('/api/workouts/:id', {
        schema: {
            tags: ['Workouts'],
            description: 'Delete workout',
            params: schemas_1.WorkoutParamsJsonSchema,
            response: {
                204: { type: 'null' }
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.WorkoutParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('DELETE FROM workouts WHERE id = $1 RETURNING id', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Workout not found' };
            }
            reply.code(204);
            return null;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to delete workout' };
        }
    });
};
exports.default = workoutRoutes;
//# sourceMappingURL=workout.routes.js.map