"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealQuerySchema = exports.MealParamsSchema = exports.MealResponseSchema = exports.UpdateMealSchema = exports.CreateMealSchema = void 0;
const zod_1 = require("zod");
exports.CreateMealSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Meal name is required').max(255, 'Meal name must be less than 255 characters'),
    description: zod_1.z.string().optional(),
    user_id: zod_1.z.number().positive('User ID must be a positive number')
});
exports.UpdateMealSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Meal name is required').max(255, 'Meal name must be less than 255 characters').optional(),
    description: zod_1.z.string().optional()
});
exports.MealResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    user_id: zod_1.z.number(),
    created_at: zod_1.z.date()
});
exports.MealParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('Meal ID must be a positive number')
});
exports.MealQuerySchema = zod_1.z.object({
    user_id: zod_1.z.coerce.number().positive('User ID must be a positive number').optional()
});
//# sourceMappingURL=meal.schema.js.map