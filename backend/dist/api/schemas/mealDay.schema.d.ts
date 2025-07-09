import { z } from 'zod';
declare const DayOfWeekEnum: z.ZodEnum<["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]>;
export declare const CreateMealDaySchema: z.ZodObject<{
    meal_id: z.ZodNumber;
    day_of_week: z.ZodEnum<["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]>;
}, "strip", z.ZodTypeAny, {
    meal_id: number;
    day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}, {
    meal_id: number;
    day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}>;
export declare const UpdateMealDaySchema: z.ZodObject<{
    day_of_week: z.ZodOptional<z.ZodEnum<["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]>>;
}, "strip", z.ZodTypeAny, {
    day_of_week?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
}, {
    day_of_week?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
}>;
export declare const MealDayResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    meal_id: z.ZodNumber;
    day_of_week: z.ZodEnum<["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]>;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    created_at: Date;
    meal_id: number;
    day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}, {
    id: number;
    created_at: Date;
    meal_id: number;
    day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}>;
export declare const MealDayParamsSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const MealDayQuerySchema: z.ZodObject<{
    meal_id: z.ZodOptional<z.ZodNumber>;
    day_of_week: z.ZodOptional<z.ZodEnum<["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]>>;
}, "strip", z.ZodTypeAny, {
    meal_id?: number | undefined;
    day_of_week?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
}, {
    meal_id?: number | undefined;
    day_of_week?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
}>;
export type CreateMealDay = z.infer<typeof CreateMealDaySchema>;
export type UpdateMealDay = z.infer<typeof UpdateMealDaySchema>;
export type MealDayResponse = z.infer<typeof MealDayResponseSchema>;
export type MealDayParams = z.infer<typeof MealDayParamsSchema>;
export type MealDayQuery = z.infer<typeof MealDayQuerySchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;
export {};
//# sourceMappingURL=mealDay.schema.d.ts.map