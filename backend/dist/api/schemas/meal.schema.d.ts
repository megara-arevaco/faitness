import { z } from 'zod';
export declare const CreateMealSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    user_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    user_id: number;
    description?: string | undefined;
}, {
    name: string;
    user_id: number;
    description?: string | undefined;
}>;
export declare const UpdateMealSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const MealResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    user_id: z.ZodNumber;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    created_at: Date;
    user_id: number;
    description: string | null;
}, {
    name: string;
    id: number;
    created_at: Date;
    user_id: number;
    description: string | null;
}>;
export declare const MealParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const MealQuerySchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    user_id?: number | undefined;
}, {
    user_id?: number | undefined;
}>;
export type CreateMeal = z.infer<typeof CreateMealSchema>;
export type UpdateMeal = z.infer<typeof UpdateMealSchema>;
export type MealResponse = z.infer<typeof MealResponseSchema>;
export type MealParams = z.infer<typeof MealParamsSchema>;
export type MealQuery = z.infer<typeof MealQuerySchema>;
//# sourceMappingURL=meal.schema.d.ts.map