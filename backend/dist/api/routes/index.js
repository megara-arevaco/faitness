"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user.routes"));
const workout_routes_1 = __importDefault(require("./workout.routes"));
const exercise_routes_1 = __importDefault(require("./exercise.routes"));
const set_routes_1 = __importDefault(require("./set.routes"));
const meal_routes_1 = __importDefault(require("./meal.routes"));
const ingredient_routes_1 = __importDefault(require("./ingredient.routes"));
const mealDay_routes_1 = __importDefault(require("./mealDay.routes"));
const routes = async (fastify) => {
    await fastify.register(user_routes_1.default);
    await fastify.register(workout_routes_1.default);
    await fastify.register(exercise_routes_1.default);
    await fastify.register(set_routes_1.default);
    await fastify.register(meal_routes_1.default);
    await fastify.register(ingredient_routes_1.default);
    await fastify.register(mealDay_routes_1.default);
};
exports.default = routes;
//# sourceMappingURL=index.js.map