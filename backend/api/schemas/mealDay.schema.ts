import { z } from 'zod';

const DayOfWeekEnum = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

export const CreateMealDaySchema = z.object({
  meal_id: z.number().positive('Meal ID must be a positive number'),
  day_of_week: DayOfWeekEnum
});

export const UpdateMealDaySchema = z.object({
  day_of_week: DayOfWeekEnum.optional()
});

export const MealDayResponseSchema = z.object({
  id: z.number(),
  meal_id: z.number(),
  day_of_week: DayOfWeekEnum,
  created_at: z.date()
});

export const MealDayParamsSchema = z.object({
  id: z.coerce.number().positive('Meal Day ID must be a positive number')
});

export const MealDayQuerySchema = z.object({
  meal_id: z.coerce.number().positive('Meal ID must be a positive number').optional(),
  day_of_week: DayOfWeekEnum.optional()
});

export type CreateMealDay = z.infer<typeof CreateMealDaySchema>;
export type UpdateMealDay = z.infer<typeof UpdateMealDaySchema>;
export type MealDayResponse = z.infer<typeof MealDayResponseSchema>;
export type MealDayParams = z.infer<typeof MealDayParamsSchema>;
export type MealDayQuery = z.infer<typeof MealDayQuerySchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;