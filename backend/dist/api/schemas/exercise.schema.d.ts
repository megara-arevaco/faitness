import { z } from 'zod';
export declare const CreateExerciseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    workout_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    workout_id: number;
    description?: string | undefined;
}, {
    name: string;
    workout_id: number;
    description?: string | undefined;
}>;
export declare const UpdateExerciseSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const ExerciseResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    workout_id: z.ZodNumber;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    created_at: Date;
    description: string | null;
    workout_id: number;
}, {
    name: string;
    id: number;
    created_at: Date;
    description: string | null;
    workout_id: number;
}>;
export declare const ExerciseParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const ExerciseQuerySchema: z.ZodObject<{
    workout_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    workout_id?: number | undefined;
}, {
    workout_id?: number | undefined;
}>;
export type CreateExercise = z.infer<typeof CreateExerciseSchema>;
export type UpdateExercise = z.infer<typeof UpdateExerciseSchema>;
export type ExerciseResponse = z.infer<typeof ExerciseResponseSchema>;
export type ExerciseParams = z.infer<typeof ExerciseParamsSchema>;
export type ExerciseQuery = z.infer<typeof ExerciseQuerySchema>;
//# sourceMappingURL=exercise.schema.d.ts.map