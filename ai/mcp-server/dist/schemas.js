"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutQuerySchema = exports.WorkoutIdSchema = exports.UpdateWorkoutSchema = exports.CreateWorkoutSchema = exports.SetQuerySchema = exports.SetIdSchema = exports.UpdateSetSchema = exports.CreateSetSchema = exports.MealDayQuerySchema = exports.MealDayIdSchema = exports.UpdateMealDaySchema = exports.CreateMealDaySchema = exports.MealQuerySchema = exports.MealIdSchema = exports.UpdateMealSchema = exports.CreateMealSchema = exports.IngredientQuerySchema = exports.IngredientIdSchema = exports.UpdateIngredientSchema = exports.CreateIngredientSchema = exports.ExerciseQuerySchema = exports.ExerciseIdSchema = exports.UpdateExerciseSchema = exports.CreateExerciseSchema = exports.DeleteUserSchema = exports.UpdateUserSchema = exports.GetUserSchema = exports.GetUsersSchema = exports.CreateUserSchema = exports.GetSystemInfoSchema = exports.AddNumbersSchema = exports.EchoSchema = void 0;
const zod_1 = require("zod");
exports.EchoSchema = zod_1.z.object({
    text: zod_1.z.string().describe("Text to echo back"),
});
exports.AddNumbersSchema = zod_1.z.object({
    a: zod_1.z.number().describe("First number"),
    b: zod_1.z.number().describe("Second number"),
});
exports.GetSystemInfoSchema = zod_1.z.object({});
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().describe("User's name"),
    email: zod_1.z.string().email().describe("User's email"),
    password: zod_1.z.string().min(6).describe("User's password (min 6 chars)"),
});
exports.GetUsersSchema = zod_1.z.object({});
exports.GetUserSchema = zod_1.z.object({
    id: zod_1.z.string().describe("User ID"),
});
exports.UpdateUserSchema = zod_1.z.object({
    id: zod_1.z.string().describe("User ID"),
    name: zod_1.z.string().optional().describe("User's name"),
    email: zod_1.z.string().email().optional().describe("User's email"),
    password: zod_1.z
        .string()
        .min(6)
        .optional()
        .describe("User's password (min 6 chars)"),
});
exports.DeleteUserSchema = zod_1.z.object({
    id: zod_1.z.string().describe("User ID"),
});
// --- EXERCISE TOOLS ---
exports.CreateExerciseSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    workout_id: zod_1.z.number(),
});
exports.UpdateExerciseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.ExerciseIdSchema = zod_1.z.object({ id: zod_1.z.number() });
exports.ExerciseQuerySchema = zod_1.z.object({
    workout_id: zod_1.z.number().optional(),
});
// --- INGREDIENT TOOLS ---
exports.CreateIngredientSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    calories: zod_1.z.number(),
    protein: zod_1.z.number(),
    carbs: zod_1.z.number(),
    fat: zod_1.z.number(),
    meal_id: zod_1.z.number(),
});
exports.UpdateIngredientSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    calories: zod_1.z.number().optional(),
    protein: zod_1.z.number().optional(),
    carbs: zod_1.z.number().optional(),
    fat: zod_1.z.number().optional(),
});
exports.IngredientIdSchema = zod_1.z.object({ id: zod_1.z.number() });
exports.IngredientQuerySchema = zod_1.z.object({
    meal_id: zod_1.z.number().optional(),
});
// --- MEAL TOOLS ---
exports.CreateMealSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    user_id: zod_1.z.number(),
});
exports.UpdateMealSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.MealIdSchema = zod_1.z.object({ id: zod_1.z.number() });
exports.MealQuerySchema = zod_1.z.object({ user_id: zod_1.z.number().optional() });
// --- MEALDAY TOOLS ---
exports.CreateMealDaySchema = zod_1.z.object({
    meal_id: zod_1.z.number(),
    day_of_week: zod_1.z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]),
});
exports.UpdateMealDaySchema = zod_1.z.object({
    id: zod_1.z.number(),
    day_of_week: zod_1.z
        .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ])
        .optional(),
});
exports.MealDayIdSchema = zod_1.z.object({ id: zod_1.z.number() });
exports.MealDayQuerySchema = zod_1.z.object({
    meal_id: zod_1.z.number().optional(),
    day_of_week: zod_1.z
        .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ])
        .optional(),
});
// --- SET TOOLS ---
exports.CreateSetSchema = zod_1.z.object({
    exercise_id: zod_1.z.number(),
    reps: zod_1.z.number(),
    weight: zod_1.z.number(),
});
exports.UpdateSetSchema = zod_1.z.object({
    id: zod_1.z.number(),
    reps: zod_1.z.number().optional(),
    weight: zod_1.z.number().optional(),
});
exports.SetIdSchema = zod_1.z.object({ id: zod_1.z.number() });
exports.SetQuerySchema = zod_1.z.object({ exercise_id: zod_1.z.number().optional() });
// --- WORKOUT TOOLS ---
exports.CreateWorkoutSchema = zod_1.z.object({
    name: zod_1.z.string(),
    user_id: zod_1.z.number(),
});
exports.UpdateWorkoutSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().optional(),
});
exports.WorkoutIdSchema = zod_1.z.object({ id: zod_1.z.number() });
exports.WorkoutQuerySchema = zod_1.z.object({ user_id: zod_1.z.number().optional() });
