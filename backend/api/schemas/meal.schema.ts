import { z } from 'zod';

export const CreateMealSchema = z.object({
  name: z.string().min(1, 'Meal name is required').max(255, 'Meal name must be less than 255 characters'),
  description: z.string().optional(),
  user_id: z.number().positive('User ID must be a positive number')
});

export const UpdateMealSchema = z.object({
  name: z.string().min(1, 'Meal name is required').max(255, 'Meal name must be less than 255 characters').optional(),
  description: z.string().optional()
});

export const MealResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  user_id: z.number(),
  created_at: z.date()
});

export const MealParamsSchema = z.object({
  id: z.coerce.number().positive('Meal ID must be a positive number')
});

export const MealQuerySchema = z.object({
  user_id: z.coerce.number().positive('User ID must be a positive number').optional()
});

export type CreateMeal = z.infer<typeof CreateMealSchema>;
export type UpdateMeal = z.infer<typeof UpdateMealSchema>;
export type MealResponse = z.infer<typeof MealResponseSchema>;
export type MealParams = z.infer<typeof MealParamsSchema>;
export type MealQuery = z.infer<typeof MealQuerySchema>;