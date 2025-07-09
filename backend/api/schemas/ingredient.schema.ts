import { z } from 'zod';

export const CreateIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required').max(255, 'Ingredient name must be less than 255 characters'),
  description: z.string().optional(),
  calories: z.number().min(0, 'Calories must be a non-negative number'),
  protein: z.number().min(0, 'Protein must be a non-negative number'),
  carbs: z.number().min(0, 'Carbs must be a non-negative number'),
  fat: z.number().min(0, 'Fat must be a non-negative number'),
  meal_id: z.number().positive('Meal ID must be a positive number')
});

export const UpdateIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required').max(255, 'Ingredient name must be less than 255 characters').optional(),
  description: z.string().optional(),
  calories: z.number().min(0, 'Calories must be a non-negative number').optional(),
  protein: z.number().min(0, 'Protein must be a non-negative number').optional(),
  carbs: z.number().min(0, 'Carbs must be a non-negative number').optional(),
  fat: z.number().min(0, 'Fat must be a non-negative number').optional()
});

export const IngredientResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  meal_id: z.number(),
  created_at: z.date()
});

export const IngredientParamsSchema = z.object({
  id: z.coerce.number().positive('Ingredient ID must be a positive number')
});

export const IngredientQuerySchema = z.object({
  meal_id: z.coerce.number().positive('Meal ID must be a positive number').optional()
});

export type CreateIngredient = z.infer<typeof CreateIngredientSchema>;
export type UpdateIngredient = z.infer<typeof UpdateIngredientSchema>;
export type IngredientResponse = z.infer<typeof IngredientResponseSchema>;
export type IngredientParams = z.infer<typeof IngredientParamsSchema>;
export type IngredientQuery = z.infer<typeof IngredientQuerySchema>;