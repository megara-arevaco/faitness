import { z } from 'zod';

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required').max(255, 'Workout name must be less than 255 characters'),
  user_id: z.number().positive('User ID must be a positive number')
});

export const UpdateWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required').max(255, 'Workout name must be less than 255 characters').optional()
});

export const WorkoutResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  user_id: z.number(),
  created_at: z.date()
});

export const WorkoutParamsSchema = z.object({
  id: z.coerce.number().positive('Workout ID must be a positive number')
});

export const WorkoutQuerySchema = z.object({
  user_id: z.coerce.number().positive('User ID must be a positive number').optional()
});

export type CreateWorkout = z.infer<typeof CreateWorkoutSchema>;
export type UpdateWorkout = z.infer<typeof UpdateWorkoutSchema>;
export type WorkoutResponse = z.infer<typeof WorkoutResponseSchema>;
export type WorkoutParams = z.infer<typeof WorkoutParamsSchema>;
export type WorkoutQuery = z.infer<typeof WorkoutQuerySchema>;