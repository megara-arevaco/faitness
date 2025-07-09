import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  email: z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(255, 'Password must be less than 255 characters')
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  email: z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(255, 'Password must be less than 255 characters').optional()
});

export const UserResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  created_at: z.date()
});

export const UserParamsSchema = z.object({
  id: z.coerce.number().positive('User ID must be a positive number')
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;