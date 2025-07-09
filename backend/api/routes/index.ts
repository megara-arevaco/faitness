import { FastifyPluginAsync } from 'fastify';
import userRoutes from './user.routes';
import workoutRoutes from './workout.routes';
import exerciseRoutes from './exercise.routes';
import setRoutes from './set.routes';
import mealRoutes from './meal.routes';
import ingredientRoutes from './ingredient.routes';
import mealDayRoutes from './mealDay.routes';

const routes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(userRoutes);
  await fastify.register(workoutRoutes);
  await fastify.register(exerciseRoutes);
  await fastify.register(setRoutes);
  await fastify.register(mealRoutes);
  await fastify.register(ingredientRoutes);
  await fastify.register(mealDayRoutes);
};

export default routes;