import { z } from 'zod';

export const CreateSetSchema = z.object({
  exercise_id: z.number().positive('Exercise ID must be a positive number'),
  reps: z.number().positive('Reps must be a positive number'),
  weight: z.number().positive('Weight must be a positive number')
});

export const UpdateSetSchema = z.object({
  reps: z.number().positive('Reps must be a positive number').optional(),
  weight: z.number().positive('Weight must be a positive number').optional()
});

export const SetResponseSchema = z.object({
  id: z.number(),
  exercise_id: z.number(),
  reps: z.number(),
  weight: z.number(),
  created_at: z.date()
});

export const SetParamsSchema = z.object({
  id: z.coerce.number().positive('Set ID must be a positive number')
});

export const SetQuerySchema = z.object({
  exercise_id: z.coerce.number().positive('Exercise ID must be a positive number').optional()
});

export type CreateSet = z.infer<typeof CreateSetSchema>;
export type UpdateSet = z.infer<typeof UpdateSetSchema>;
export type SetResponse = z.infer<typeof SetResponseSchema>;
export type SetParams = z.infer<typeof SetParamsSchema>;
export type SetQuery = z.infer<typeof SetQuerySchema>;