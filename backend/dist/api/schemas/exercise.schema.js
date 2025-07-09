"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseQuerySchema = exports.ExerciseParamsSchema = exports.ExerciseResponseSchema = exports.UpdateExerciseSchema = exports.CreateExerciseSchema = void 0;
const zod_1 = require("zod");
exports.CreateExerciseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Exercise name is required').max(255, 'Exercise name must be less than 255 characters'),
    description: zod_1.z.string().optional(),
    workout_id: zod_1.z.number().positive('Workout ID must be a positive number')
});
exports.UpdateExerciseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Exercise name is required').max(255, 'Exercise name must be less than 255 characters').optional(),
    description: zod_1.z.string().optional()
});
exports.ExerciseResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    workout_id: zod_1.z.number(),
    created_at: zod_1.z.date()
});
exports.ExerciseParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('Exercise ID must be a positive number')
});
exports.ExerciseQuerySchema = zod_1.z.object({
    workout_id: zod_1.z.coerce.number().positive('Workout ID must be a positive number').optional()
});
//# sourceMappingURL=exercise.schema.js.map