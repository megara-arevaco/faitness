#!/usr/bin/env python3
"""
Example usage of the Fitness API Tools
This script demonstrates how to use all the tools for the fitness API endpoints
"""

from tools import FitnessTools, create_fitness_tools

def main():
    """Main function demonstrating tool usage"""
    
    # Create a tools instance
    tools = create_fitness_tools("http://localhost:8000")
    
    print("=== Fitness API Tools Example ===\n")
    
    # Example 1: User operations
    print("1. User Operations:")
    print("-" * 20)
    
    # Create a user
    user_result = tools.create_user(
        email="john.doe@example.com",
        name="John Doe",
        age=30,
        weight=75.5,
        height=180.0
    )
    print(f"Created user: {user_result}")
    
    # Get all users
    users = tools.get_users()
    print(f"All users: {users}")
    
    # Example 2: Workout operations
    print("\n2. Workout Operations:")
    print("-" * 20)
    
    # Create a workout
    workout_result = tools.create_workout(
        name="Morning Cardio",
        user_id=1
    )
    print(f"Created workout: {workout_result}")
    
    # Get all workouts
    workouts = tools.get_workouts()
    print(f"All workouts: {workouts}")
    
    # Example 3: Exercise operations
    print("\n3. Exercise Operations:")
    print("-" * 20)
    
    # Create an exercise
    exercise_result = tools.create_exercise(
        name="Push-ups",
        description="Standard push-ups for upper body strength",
        workout_id=1
    )
    print(f"Created exercise: {exercise_result}")
    
    # Get all exercises
    exercises = tools.get_exercises()
    print(f"All exercises: {exercises}")
    
    # Example 4: Set operations
    print("\n4. Set Operations:")
    print("-" * 20)
    
    # Create a set
    set_result = tools.create_set(
        exercise_id=1,
        reps=10,
        weight=0  # Bodyweight exercise
    )
    print(f"Created set: {set_result}")
    
    # Get all sets
    sets = tools.get_sets()
    print(f"All sets: {sets}")
    
    # Example 5: Meal operations
    print("\n5. Meal Operations:")
    print("-" * 20)
    
    # Create a meal
    meal_result = tools.create_meal(
        name="Protein Shake",
        user_id=1,
        description="Post-workout protein shake"
    )
    print(f"Created meal: {meal_result}")
    
    # Get all meals
    meals = tools.get_meals()
    print(f"All meals: {meals}")
    
    # Example 6: Ingredient operations
    print("\n6. Ingredient Operations:")
    print("-" * 20)
    
    # Create an ingredient
    ingredient_result = tools.create_ingredient(
        name="Whey Protein",
        calories=120,
        protein=24,
        carbs=3,
        fat=1,
        meal_id=1,
        description="High-quality whey protein powder"
    )
    print(f"Created ingredient: {ingredient_result}")
    
    # Get all ingredients
    ingredients = tools.get_ingredients()
    print(f"All ingredients: {ingredients}")
    
    # Example 7: Meal day operations
    print("\n7. Meal Day Operations:")
    print("-" * 20)
    
    # Create a meal day
    meal_day_result = tools.create_meal_day(
        meal_id=1,
        day_of_week="Monday"
    )
    print(f"Created meal day: {meal_day_result}")
    
    # Get all meal days
    meal_days = tools.get_meal_days()
    print(f"All meal days: {meal_days}")
    
    print("\n=== Example completed ===")

if __name__ == "__main__":
    main() 