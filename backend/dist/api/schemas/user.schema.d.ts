import { z } from 'zod';
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    name: string;
    email: string;
}, {
    password: string;
    name: string;
    email: string;
}>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
}, {
    password?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
}>;
export declare const UserResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    email: z.ZodString;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    id: number;
    created_at: Date;
}, {
    name: string;
    email: string;
    id: number;
    created_at: Date;
}>;
export declare const UserParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
//# sourceMappingURL=user.schema.d.ts.map