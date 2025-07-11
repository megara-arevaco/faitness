import { z } from "zod";

export const EchoSchema = z.object({
  text: z.string().describe("Text to echo back"),
});

export const AddNumbersSchema = z.object({
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});

export const GetSystemInfoSchema = z.object({});
export const CreateUserSchema = z.object({
  name: z.string().describe("User's name"),
  email: z.string().email().describe("User's email"),
  password: z.string().min(6).describe("User's password (min 6 chars)"),
});
export const GetUsersSchema = z.object({});
export const GetUserSchema = z.object({
  id: z.string().describe("User ID"),
});
export const UpdateUserSchema = z.object({
  id: z.string().describe("User ID"),
  name: z.string().optional().describe("User's name"),
  email: z.string().email().optional().describe("User's email"),
  password: z
    .string()
    .min(6)
    .optional()
    .describe("User's password (min 6 chars)"),
});
export const DeleteUserSchema = z.object({
  id: z.string().describe("User ID"),
});

// --- EXERCISE TOOLS ---
export const CreateExerciseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  workout_id: z.number(),
});
export const UpdateExerciseSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
});
export const ExerciseIdSchema = z.object({ id: z.number() });
export const ExerciseQuerySchema = z.object({
  workout_id: z.number().optional(),
});

// --- INGREDIENT TOOLS ---
export const CreateIngredientSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  meal_id: z.number(),
});
export const UpdateIngredientSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});
export const IngredientIdSchema = z.object({ id: z.number() });
export const IngredientQuerySchema = z.object({
  meal_id: z.number().optional(),
});

// --- MEAL TOOLS ---
export const CreateMealSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  user_id: z.number(),
});
export const UpdateMealSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
});
export const MealIdSchema = z.object({ id: z.number() });
export const MealQuerySchema = z.object({ user_id: z.number().optional() });

// --- MEALDAY TOOLS ---
export const CreateMealDaySchema = z.object({
  meal_id: z.number(),
  day_of_week: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
});
export const UpdateMealDaySchema = z.object({
  id: z.number(),
  day_of_week: z
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
export const MealDayIdSchema = z.object({ id: z.number() });
export const MealDayQuerySchema = z.object({
  meal_id: z.number().optional(),
  day_of_week: z
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
export const CreateSetSchema = z.object({
  exercise_id: z.number(),
  reps: z.number(),
  weight: z.number(),
});
export const UpdateSetSchema = z.object({
  id: z.number(),
  reps: z.number().optional(),
  weight: z.number().optional(),
});
export const SetIdSchema = z.object({ id: z.number() });
export const SetQuerySchema = z.object({ exercise_id: z.number().optional() });

// --- WORKOUT TOOLS ---
export const CreateWorkoutSchema = z.object({
  name: z.string(),
  user_id: z.number(),
});
export const UpdateWorkoutSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});
export const WorkoutIdSchema = z.object({ id: z.number() });
export const WorkoutQuerySchema = z.object({ user_id: z.number().optional() });
