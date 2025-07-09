"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealDayQueryJsonSchema = exports.MealDayParamsJsonSchema = exports.UpdateMealDayJsonSchema = exports.CreateMealDayJsonSchema = exports.MealDayResponseJsonSchema = exports.IngredientQueryJsonSchema = exports.IngredientParamsJsonSchema = exports.UpdateIngredientJsonSchema = exports.CreateIngredientJsonSchema = exports.IngredientResponseJsonSchema = exports.MealQueryJsonSchema = exports.MealParamsJsonSchema = exports.UpdateMealJsonSchema = exports.CreateMealJsonSchema = exports.MealResponseJsonSchema = exports.SetQueryJsonSchema = exports.SetParamsJsonSchema = exports.UpdateSetJsonSchema = exports.CreateSetJsonSchema = exports.SetResponseJsonSchema = exports.ExerciseQueryJsonSchema = exports.ExerciseParamsJsonSchema = exports.UpdateExerciseJsonSchema = exports.CreateExerciseJsonSchema = exports.ExerciseResponseJsonSchema = exports.WorkoutQueryJsonSchema = exports.WorkoutParamsJsonSchema = exports.UpdateWorkoutJsonSchema = exports.CreateWorkoutJsonSchema = exports.WorkoutResponseJsonSchema = exports.UserParamsJsonSchema = exports.UpdateUserJsonSchema = exports.CreateUserJsonSchema = exports.UserResponseJsonSchema = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
__exportStar(require("./user.schema"), exports);
__exportStar(require("./workout.schema"), exports);
__exportStar(require("./exercise.schema"), exports);
__exportStar(require("./set.schema"), exports);
__exportStar(require("./meal.schema"), exports);
__exportStar(require("./ingredient.schema"), exports);
__exportStar(require("./mealDay.schema"), exports);
// Convert Zod schemas to JSON Schema for Swagger
const user_schema_1 = require("./user.schema");
const workout_schema_1 = require("./workout.schema");
const exercise_schema_1 = require("./exercise.schema");
const set_schema_1 = require("./set.schema");
const meal_schema_1 = require("./meal.schema");
const ingredient_schema_1 = require("./ingredient.schema");
const mealDay_schema_1 = require("./mealDay.schema");
// User schemas
exports.UserResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(user_schema_1.UserResponseSchema);
exports.CreateUserJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(user_schema_1.CreateUserSchema);
exports.UpdateUserJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(user_schema_1.UpdateUserSchema);
exports.UserParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(user_schema_1.UserParamsSchema);
// Workout schemas
exports.WorkoutResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(workout_schema_1.WorkoutResponseSchema);
exports.CreateWorkoutJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(workout_schema_1.CreateWorkoutSchema);
exports.UpdateWorkoutJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(workout_schema_1.UpdateWorkoutSchema);
exports.WorkoutParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(workout_schema_1.WorkoutParamsSchema);
exports.WorkoutQueryJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(workout_schema_1.WorkoutQuerySchema);
// Exercise schemas
exports.ExerciseResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(exercise_schema_1.ExerciseResponseSchema);
exports.CreateExerciseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(exercise_schema_1.CreateExerciseSchema);
exports.UpdateExerciseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(exercise_schema_1.UpdateExerciseSchema);
exports.ExerciseParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(exercise_schema_1.ExerciseParamsSchema);
exports.ExerciseQueryJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(exercise_schema_1.ExerciseQuerySchema);
// Set schemas
exports.SetResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(set_schema_1.SetResponseSchema);
exports.CreateSetJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(set_schema_1.CreateSetSchema);
exports.UpdateSetJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(set_schema_1.UpdateSetSchema);
exports.SetParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(set_schema_1.SetParamsSchema);
exports.SetQueryJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(set_schema_1.SetQuerySchema);
// Meal schemas
exports.MealResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(meal_schema_1.MealResponseSchema);
exports.CreateMealJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(meal_schema_1.CreateMealSchema);
exports.UpdateMealJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(meal_schema_1.UpdateMealSchema);
exports.MealParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(meal_schema_1.MealParamsSchema);
exports.MealQueryJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(meal_schema_1.MealQuerySchema);
// Ingredient schemas
exports.IngredientResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(ingredient_schema_1.IngredientResponseSchema);
exports.CreateIngredientJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(ingredient_schema_1.CreateIngredientSchema);
exports.UpdateIngredientJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(ingredient_schema_1.UpdateIngredientSchema);
exports.IngredientParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(ingredient_schema_1.IngredientParamsSchema);
exports.IngredientQueryJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(ingredient_schema_1.IngredientQuerySchema);
// MealDay schemas
exports.MealDayResponseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(mealDay_schema_1.MealDayResponseSchema);
exports.CreateMealDayJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(mealDay_schema_1.CreateMealDaySchema);
exports.UpdateMealDayJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(mealDay_schema_1.UpdateMealDaySchema);
exports.MealDayParamsJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(mealDay_schema_1.MealDayParamsSchema);
exports.MealDayQueryJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(mealDay_schema_1.MealDayQuerySchema);
//# sourceMappingURL=index.js.map