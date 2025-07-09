import { z } from 'zod';
export declare const CreateIngredientSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    meal_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meal_id: number;
    description?: string | undefined;
}, {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meal_id: number;
    description?: string | undefined;
}>;
export declare const UpdateIngredientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    calories: z.ZodOptional<z.ZodNumber>;
    protein: z.ZodOptional<z.ZodNumber>;
    carbs: z.ZodOptional<z.ZodNumber>;
    fat: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    calories?: number | undefined;
    protein?: number | undefined;
    carbs?: number | undefined;
    fat?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    calories?: number | undefined;
    protein?: number | undefined;
    carbs?: number | undefined;
    fat?: number | undefined;
}>;
export declare const IngredientResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    meal_id: z.ZodNumber;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    created_at: Date;
    description: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meal_id: number;
}, {
    name: string;
    id: number;
    created_at: Date;
    description: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meal_id: number;
}>;
export declare const IngredientParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const IngredientQuerySchema: z.ZodObject<{
    meal_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    meal_id?: number | undefined;
}, {
    meal_id?: number | undefined;
}>;
export type CreateIngredient = z.infer<typeof CreateIngredientSchema>;
export type UpdateIngredient = z.infer<typeof UpdateIngredientSchema>;
export type IngredientResponse = z.infer<typeof IngredientResponseSchema>;
export type IngredientParams = z.infer<typeof IngredientParamsSchema>;
export type IngredientQuery = z.infer<typeof IngredientQuerySchema>;
//# sourceMappingURL=ingredient.schema.d.ts.map