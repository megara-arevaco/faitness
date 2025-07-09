import { z } from 'zod';

export const CreateExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(255, 'Exercise name must be less than 255 characters'),
  description: z.string().optional(),
  workout_id: z.number().positive('Workout ID must be a positive number')
});

export const UpdateExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(255, 'Exercise name must be less than 255 characters').optional(),
  description: z.string().optional()
});

export const ExerciseResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  workout_id: z.number(),
  created_at: z.date()
});

export const ExerciseParamsSchema = z.object({
  id: z.coerce.number().positive('Exercise ID must be a positive number')
});

export const ExerciseQuerySchema = z.object({
  workout_id: z.coerce.number().positive('Workout ID must be a positive number').optional()
});

export type CreateExercise = z.infer<typeof CreateExerciseSchema>;
export type UpdateExercise = z.infer<typeof UpdateExerciseSchema>;
export type ExerciseResponse = z.infer<typeof ExerciseResponseSchema>;
export type ExerciseParams = z.infer<typeof ExerciseParamsSchema>;
export type ExerciseQuery = z.infer<typeof ExerciseQuerySchema>;