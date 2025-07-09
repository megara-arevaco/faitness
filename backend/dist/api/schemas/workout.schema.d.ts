import { z } from 'zod';
export declare const CreateWorkoutSchema: z.ZodObject<{
    name: z.ZodString;
    user_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    user_id: number;
}, {
    name: string;
    user_id: number;
}>;
export declare const UpdateWorkoutSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export declare const WorkoutResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    user_id: z.ZodNumber;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    created_at: Date;
    user_id: number;
}, {
    name: string;
    id: number;
    created_at: Date;
    user_id: number;
}>;
export declare const WorkoutParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const WorkoutQuerySchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    user_id?: number | undefined;
}, {
    user_id?: number | undefined;
}>;
export type CreateWorkout = z.infer<typeof CreateWorkoutSchema>;
export type UpdateWorkout = z.infer<typeof UpdateWorkoutSchema>;
export type WorkoutResponse = z.infer<typeof WorkoutResponseSchema>;
export type WorkoutParams = z.infer<typeof WorkoutParamsSchema>;
export type WorkoutQuery = z.infer<typeof WorkoutQuerySchema>;
//# sourceMappingURL=workout.schema.d.ts.map