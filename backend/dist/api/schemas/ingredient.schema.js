"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientQuerySchema = exports.IngredientParamsSchema = exports.IngredientResponseSchema = exports.UpdateIngredientSchema = exports.CreateIngredientSchema = void 0;
const zod_1 = require("zod");
exports.CreateIngredientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Ingredient name is required').max(255, 'Ingredient name must be less than 255 characters'),
    description: zod_1.z.string().optional(),
    calories: zod_1.z.number().min(0, 'Calories must be a non-negative number'),
    protein: zod_1.z.number().min(0, 'Protein must be a non-negative number'),
    carbs: zod_1.z.number().min(0, 'Carbs must be a non-negative number'),
    fat: zod_1.z.number().min(0, 'Fat must be a non-negative number'),
    meal_id: zod_1.z.number().positive('Meal ID must be a positive number')
});
exports.UpdateIngredientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Ingredient name is required').max(255, 'Ingredient name must be less than 255 characters').optional(),
    description: zod_1.z.string().optional(),
    calories: zod_1.z.number().min(0, 'Calories must be a non-negative number').optional(),
    protein: zod_1.z.number().min(0, 'Protein must be a non-negative number').optional(),
    carbs: zod_1.z.number().min(0, 'Carbs must be a non-negative number').optional(),
    fat: zod_1.z.number().min(0, 'Fat must be a non-negative number').optional()
});
exports.IngredientResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    calories: zod_1.z.number(),
    protein: zod_1.z.number(),
    carbs: zod_1.z.number(),
    fat: zod_1.z.number(),
    meal_id: zod_1.z.number(),
    created_at: zod_1.z.date()
});
exports.IngredientParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('Ingredient ID must be a positive number')
});
exports.IngredientQuerySchema = zod_1.z.object({
    meal_id: zod_1.z.coerce.number().positive('Meal ID must be a positive number').optional()
});
//# sourceMappingURL=ingredient.schema.js.map