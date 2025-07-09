"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const connection_1 = __importDefault(require("../../database/connection"));
const exerciseRoutes = async (fastify) => {
    // GET /api/exercises - Get all exercises (with optional workout filter)
    fastify.get('/api/exercises', {
        schema: {
            tags: ['Exercises'],
            description: 'Get all exercises with optional workout filter',
            querystring: schemas_1.ExerciseQueryJsonSchema,
            response: {
                200: {
                    type: 'array',
                    items: schemas_1.ExerciseResponseJsonSchema
                }
            }
        }
    }, async (request, reply) => {
        const queryParseResult = schemas_1.ExerciseQuerySchema.safeParse(request.query);
        if (!queryParseResult.success) {
            return reply.status(400).send({
                message: 'Validation error in query parameters',
                errors: queryParseResult.error.errors,
            });
        }
        const { workout_id } = queryParseResult.data;
        try {
            let query = 'SELECT id, name, description, workout_id, created_at FROM exercises';
            const params = [];
            if (workout_id) {
                query += ' WHERE workout_id = $1';
                params.push(workout_id);
            }
            query += ' ORDER BY created_at DESC';
            const result = await connection_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch exercises' };
        }
    });
    // GET /api/exercises/:id - Get exercise by ID
    fastify.get('/api/exercises/:id', {
        schema: {
            tags: ['Exercises'],
            description: 'Get exercise by ID',
            params: schemas_1.ExerciseParamsJsonSchema,
            response: {
                200: schemas_1.ExerciseResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.ExerciseParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('SELECT id, name, description, workout_id, created_at FROM exercises WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Exercise not found' };
            }
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to fetch exercise' };
        }
    });
    // POST /api/exercises - Create new exercise
    fastify.post('/api/exercises', {
        schema: {
            tags: ['Exercises'],
            description: 'Create new exercise',
            body: schemas_1.CreateExerciseJsonSchema,
            response: {
                201: schemas_1.ExerciseResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.CreateExerciseSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { name, description, workout_id } = parseResult.data;
        try {
            // Check if workout exists
            const workoutExists = await connection_1.default.query('SELECT id FROM workouts WHERE id = $1', [workout_id]);
            if (workoutExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Workout not found' };
            }
            // Insert new exercise
            const result = await connection_1.default.query('INSERT INTO exercises (name, description, workout_id) VALUES ($1, $2, $3) RETURNING id, name, description, workout_id, created_at', [name, description, workout_id]);
            reply.code(201);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to create exercise' };
        }
    });
    // PUT /api/exercises/:id - Update exercise
    fastify.put('/api/exercises/:id', {
        schema: {
            tags: ['Exercises'],
            description: 'Update exercise',
            params: schemas_1.ExerciseParamsJsonSchema,
            body: schemas_1.UpdateExerciseJsonSchema,
            response: {
                200: schemas_1.ExerciseResponseJsonSchema
            }
        }
    }, async (request, reply) => {
        const paramsParseResult = schemas_1.ExerciseParamsSchema.safeParse(request.params);
        const bodyParseResult = schemas_1.UpdateExerciseSchema.safeParse(request.body);
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
            const exerciseExists = await connection_1.default.query('SELECT id FROM exercises WHERE id = $1', [id]);
            if (exerciseExists.rows.length === 0) {
                reply.code(404);
                return { error: 'Exercise not found' };
            }
            // Build dynamic update query
            const fields = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            const result = await connection_1.default.query(`UPDATE exercises SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, description, workout_id, created_at`, [...values, id]);
            return result.rows[0];
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to update exercise' };
        }
    });
    // DELETE /api/exercises/:id - Delete exercise
    fastify.delete('/api/exercises/:id', {
        schema: {
            tags: ['Exercises'],
            description: 'Delete exercise',
            params: schemas_1.ExerciseParamsJsonSchema,
            response: {
                204: { type: 'null' }
            }
        }
    }, async (request, reply) => {
        const parseResult = schemas_1.ExerciseParamsSchema.safeParse(request.params);
        if (!parseResult.success) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
        }
        const { id } = parseResult.data;
        try {
            const result = await connection_1.default.query('DELETE FROM exercises WHERE id = $1 RETURNING id', [id]);
            if (result.rows.length === 0) {
                reply.code(404);
                return { error: 'Exercise not found' };
            }
            reply.code(204);
            return null;
        }
        catch (error) {
            reply.code(500);
            return { error: 'Failed to delete exercise' };
        }
    });
};
exports.default = exerciseRoutes;
//# sourceMappingURL=exercise.routes.js.map