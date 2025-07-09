"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutQuerySchema = exports.WorkoutParamsSchema = exports.WorkoutResponseSchema = exports.UpdateWorkoutSchema = exports.CreateWorkoutSchema = void 0;
const zod_1 = require("zod");
exports.CreateWorkoutSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Workout name is required').max(255, 'Workout name must be less than 255 characters'),
    user_id: zod_1.z.number().positive('User ID must be a positive number')
});
exports.UpdateWorkoutSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Workout name is required').max(255, 'Workout name must be less than 255 characters').optional()
});
exports.WorkoutResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    user_id: zod_1.z.number(),
    created_at: zod_1.z.date()
});
exports.WorkoutParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('Workout ID must be a positive number')
});
exports.WorkoutQuerySchema = zod_1.z.object({
    user_id: zod_1.z.coerce.number().positive('User ID must be a positive number').optional()
});
//# sourceMappingURL=workout.schema.js.map