"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealDayQuerySchema = exports.MealDayParamsSchema = exports.MealDayResponseSchema = exports.UpdateMealDaySchema = exports.CreateMealDaySchema = void 0;
const zod_1 = require("zod");
const DayOfWeekEnum = zod_1.z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
exports.CreateMealDaySchema = zod_1.z.object({
    meal_id: zod_1.z.number().positive('Meal ID must be a positive number'),
    day_of_week: DayOfWeekEnum
});
exports.UpdateMealDaySchema = zod_1.z.object({
    day_of_week: DayOfWeekEnum.optional()
});
exports.MealDayResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    meal_id: zod_1.z.number(),
    day_of_week: DayOfWeekEnum,
    created_at: zod_1.z.date()
});
exports.MealDayParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('Meal Day ID must be a positive number')
});
exports.MealDayQuerySchema = zod_1.z.object({
    meal_id: zod_1.z.coerce.number().positive('Meal ID must be a positive number').optional(),
    day_of_week: DayOfWeekEnum.optional()
});
//# sourceMappingURL=mealDay.schema.js.map