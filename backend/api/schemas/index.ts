import { zodToJsonSchema } from 'zod-to-json-schema';

export * from './user.schema';
export * from './workout.schema';
export * from './exercise.schema';
export * from './set.schema';
export * from './meal.schema';
export * from './ingredient.schema';
export * from './mealDay.schema';

// Convert Zod schemas to JSON Schema for Swagger
import { 
  UserResponseSchema, 
  CreateUserSchema, 
  UpdateUserSchema, 
  UserParamsSchema 
} from './user.schema';

import { 
  WorkoutResponseSchema, 
  CreateWorkoutSchema, 
  UpdateWorkoutSchema, 
  WorkoutParamsSchema,
  WorkoutQuerySchema 
} from './workout.schema';

import { 
  ExerciseResponseSchema, 
  CreateExerciseSchema, 
  UpdateExerciseSchema, 
  ExerciseParamsSchema,
  ExerciseQuerySchema 
} from './exercise.schema';

import { 
  SetResponseSchema, 
  CreateSetSchema, 
  UpdateSetSchema, 
  SetParamsSchema,
  SetQuerySchema 
} from './set.schema';

import { 
  MealResponseSchema, 
  CreateMealSchema, 
  UpdateMealSchema, 
  MealParamsSchema,
  MealQuerySchema 
} from './meal.schema';

import { 
  IngredientResponseSchema, 
  CreateIngredientSchema, 
  UpdateIngredientSchema, 
  IngredientParamsSchema,
  IngredientQuerySchema 
} from './ingredient.schema';

import { 
  MealDayResponseSchema, 
  CreateMealDaySchema, 
  UpdateMealDaySchema, 
  MealDayParamsSchema,
  MealDayQuerySchema 
} from './mealDay.schema';

// User schemas
export const UserResponseJsonSchema = zodToJsonSchema(UserResponseSchema);
export const CreateUserJsonSchema = zodToJsonSchema(CreateUserSchema);
export const UpdateUserJsonSchema = zodToJsonSchema(UpdateUserSchema);
export const UserParamsJsonSchema = zodToJsonSchema(UserParamsSchema);

// Workout schemas
export const WorkoutResponseJsonSchema = zodToJsonSchema(WorkoutResponseSchema);
export const CreateWorkoutJsonSchema = zodToJsonSchema(CreateWorkoutSchema);
export const UpdateWorkoutJsonSchema = zodToJsonSchema(UpdateWorkoutSchema);
export const WorkoutParamsJsonSchema = zodToJsonSchema(WorkoutParamsSchema);
export const WorkoutQueryJsonSchema = zodToJsonSchema(WorkoutQuerySchema);

// Exercise schemas
export const ExerciseResponseJsonSchema = zodToJsonSchema(ExerciseResponseSchema);
export const CreateExerciseJsonSchema = zodToJsonSchema(CreateExerciseSchema);
export const UpdateExerciseJsonSchema = zodToJsonSchema(UpdateExerciseSchema);
export const ExerciseParamsJsonSchema = zodToJsonSchema(ExerciseParamsSchema);
export const ExerciseQueryJsonSchema = zodToJsonSchema(ExerciseQuerySchema);

// Set schemas
export const SetResponseJsonSchema = zodToJsonSchema(SetResponseSchema);
export const CreateSetJsonSchema = zodToJsonSchema(CreateSetSchema);
export const UpdateSetJsonSchema = zodToJsonSchema(UpdateSetSchema);
export const SetParamsJsonSchema = zodToJsonSchema(SetParamsSchema);
export const SetQueryJsonSchema = zodToJsonSchema(SetQuerySchema);

// Meal schemas
export const MealResponseJsonSchema = zodToJsonSchema(MealResponseSchema);
export const CreateMealJsonSchema = zodToJsonSchema(CreateMealSchema);
export const UpdateMealJsonSchema = zodToJsonSchema(UpdateMealSchema);
export const MealParamsJsonSchema = zodToJsonSchema(MealParamsSchema);
export const MealQueryJsonSchema = zodToJsonSchema(MealQuerySchema);

// Ingredient schemas
export const IngredientResponseJsonSchema = zodToJsonSchema(IngredientResponseSchema);
export const CreateIngredientJsonSchema = zodToJsonSchema(CreateIngredientSchema);
export const UpdateIngredientJsonSchema = zodToJsonSchema(UpdateIngredientSchema);
export const IngredientParamsJsonSchema = zodToJsonSchema(IngredientParamsSchema);
export const IngredientQueryJsonSchema = zodToJsonSchema(IngredientQuerySchema);

// MealDay schemas
export const MealDayResponseJsonSchema = zodToJsonSchema(MealDayResponseSchema);
export const CreateMealDayJsonSchema = zodToJsonSchema(CreateMealDaySchema);
export const UpdateMealDayJsonSchema = zodToJsonSchema(UpdateMealDaySchema);
export const MealDayParamsJsonSchema = zodToJsonSchema(MealDayParamsSchema);
export const MealDayQueryJsonSchema = zodToJsonSchema(MealDayQuerySchema);