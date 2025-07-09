import { z } from 'zod';
export declare const CreateSetSchema: z.ZodObject<{
    exercise_id: z.ZodNumber;
    reps: z.ZodNumber;
    weight: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    exercise_id: number;
    reps: number;
    weight: number;
}, {
    exercise_id: number;
    reps: number;
    weight: number;
}>;
export declare const UpdateSetSchema: z.ZodObject<{
    reps: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    reps?: number | undefined;
    weight?: number | undefined;
}, {
    reps?: number | undefined;
    weight?: number | undefined;
}>;
export declare const SetResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    exercise_id: z.ZodNumber;
    reps: z.ZodNumber;
    weight: z.ZodNumber;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    created_at: Date;
    exercise_id: number;
    reps: number;
    weight: number;
}, {
    id: number;
    created_at: Date;
    exercise_id: number;
    reps: number;
    weight: number;
}>;
export declare const SetParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const SetQuerySchema: z.ZodObject<{
    exercise_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    exercise_id?: number | undefined;
}, {
    exercise_id?: number | undefined;
}>;
export type CreateSet = z.infer<typeof CreateSetSchema>;
export type UpdateSet = z.infer<typeof UpdateSetSchema>;
export type SetResponse = z.infer<typeof SetResponseSchema>;
export type SetParams = z.infer<typeof SetParamsSchema>;
export type SetQuery = z.infer<typeof SetQuerySchema>;
//# sourceMappingURL=set.schema.d.ts.map