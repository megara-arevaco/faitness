"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetQuerySchema = exports.SetParamsSchema = exports.SetResponseSchema = exports.UpdateSetSchema = exports.CreateSetSchema = void 0;
const zod_1 = require("zod");
exports.CreateSetSchema = zod_1.z.object({
    exercise_id: zod_1.z.number().positive('Exercise ID must be a positive number'),
    reps: zod_1.z.number().positive('Reps must be a positive number'),
    weight: zod_1.z.number().positive('Weight must be a positive number')
});
exports.UpdateSetSchema = zod_1.z.object({
    reps: zod_1.z.number().positive('Reps must be a positive number').optional(),
    weight: zod_1.z.number().positive('Weight must be a positive number').optional()
});
exports.SetResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    exercise_id: zod_1.z.number(),
    reps: zod_1.z.number(),
    weight: zod_1.z.number(),
    created_at: zod_1.z.date()
});
exports.SetParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('Set ID must be a positive number')
});
exports.SetQuerySchema = zod_1.z.object({
    exercise_id: zod_1.z.coerce.number().positive('Exercise ID must be a positive number').optional()
});
//# sourceMappingURL=set.schema.js.map