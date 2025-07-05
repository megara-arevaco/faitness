"""
Fitness API Tools Package
Unified package that exports all tools for the fitness API endpoints
"""

from typing import Optional

# Import all tool functions
from .user_tools import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    delete_user
)

from .set_tools import (
    get_all_sets,
    get_set_by_id,
    create_set
)

from .meal_tools import (
    get_all_meals,
    get_meal_by_id,
    create_meal
)

from .ingredient_tools import (
    get_all_ingredients,
    get_ingredient_by_id,
    create_ingredient
)

from .meal_day_tools import (
    get_all_meal_days,
    get_meal_day_by_id,
    create_meal_day
)

from .workout_tools import (
    get_all_workouts,
    get_workout_by_id,
    create_workout
)

from .exercise_tools import (
    get_all_exercises,
    get_exercise_by_id,
    create_exercise,
    delete_exercise
)

# Create a unified tools class that combines all tools
class FitnessTools:
    """
    Unified tools class that provides access to all fitness API endpoints
    """
    
    def __init__(self, api_base_url: str):
        self.api_base_url = api_base_url
    
    # User tools methods
    def get_users(self):
        """Get all users"""
        return get_all_users(self.api_base_url)
    
    def create_user(self, email: str, name: str, age: int, weight: float, height: float):
        """Create a new user"""
        return create_user(email, name, age, weight, height, self.api_base_url)
    
    def get_user_by_id(self, user_id: int):
        """Get a specific user by ID"""
        return get_user_by_id(user_id, self.api_base_url)
    
    def update_user(self, user_id: int, **kwargs):
        """Update a user's information"""
        return update_user(user_id, self.api_base_url, **kwargs)
    
    def delete_user(self, user_id: int):
        """Delete a user"""
        return delete_user(user_id, self.api_base_url)
    
    # Set tools methods
    def get_sets(self):
        """Get all sets"""
        return get_all_sets(self.api_base_url)
    
    def get_set_by_id(self, set_id: int):
        """Get a specific set by ID"""
        return get_set_by_id(set_id, self.api_base_url)
    
    def create_set(self, exercise_id: int, reps: int, weight: int):
        """Create a new set"""
        return create_set(exercise_id, reps, weight, self.api_base_url)
    
    # Meal tools methods
    def get_meals(self):
        """Get all meals"""
        return get_all_meals(self.api_base_url)
    
    def get_meal_by_id(self, meal_id: int):
        """Get a specific meal by ID"""
        return get_meal_by_id(meal_id, self.api_base_url)
    
    def create_meal(self, name: str, user_id: int, description: Optional[str] = None):
        """Create a new meal"""
        return create_meal(name, user_id, self.api_base_url, description)
    
    # Ingredient tools methods
    def get_ingredients(self):
        """Get all ingredients"""
        return get_all_ingredients(self.api_base_url)
    
    def get_ingredient_by_id(self, ingredient_id: int):
        """Get a specific ingredient by ID"""
        return get_ingredient_by_id(ingredient_id, self.api_base_url)
    
    def create_ingredient(self, name: str, calories: int, protein: int, carbs: int, fat: int, meal_id: int, description: Optional[str] = None):
        """Create a new ingredient"""
        return create_ingredient(name, calories, protein, carbs, fat, meal_id, self.api_base_url, description)
    
    # Meal day tools methods
    def get_meal_days(self):
        """Get all meal days"""
        return get_all_meal_days(self.api_base_url)
    
    def get_meal_day_by_id(self, meal_day_id: int):
        """Get a specific meal day by ID"""
        return get_meal_day_by_id(meal_day_id, self.api_base_url)
    
    def create_meal_day(self, meal_id: int, day_of_week: str):
        """Create a new meal day"""
        return create_meal_day(meal_id, day_of_week, self.api_base_url)
    
    # Workout tools methods
    def get_workouts(self):
        """Get all workouts"""
        return get_all_workouts(self.api_base_url)
    
    def get_workout_by_id(self, workout_id: int):
        """Get a specific workout by ID"""
        return get_workout_by_id(workout_id, self.api_base_url)
    
    def create_workout(self, name: str, user_id: int):
        """Create a new workout"""
        return create_workout(name, user_id, self.api_base_url)
    
    # Exercise tools methods
    def get_exercises(self):
        """Get all exercises"""
        return get_all_exercises(self.api_base_url)
    
    def get_exercise_by_id(self, exercise_id: int):
        """Get a specific exercise by ID"""
        return get_exercise_by_id(exercise_id, self.api_base_url)
    
    def create_exercise(self, name: str, description: str, workout_id: int):
        """Create a new exercise"""
        return create_exercise(name, description, workout_id, self.api_base_url)
    
    def delete_exercise(self, exercise_id: int):
        """Delete an exercise"""
        return delete_exercise(exercise_id, self.api_base_url)

# Export all individual functions and the unified class
__all__ = [
    # Individual functions
    'get_all_users', 'get_user_by_id', 'create_user', 'update_user', 'delete_user',
    'get_all_sets', 'get_set_by_id', 'create_set',
    'get_all_meals', 'get_meal_by_id', 'create_meal',
    'get_all_ingredients', 'get_ingredient_by_id', 'create_ingredient',
    'get_all_meal_days', 'get_meal_day_by_id', 'create_meal_day',
    'get_all_workouts', 'get_workout_by_id', 'create_workout',
    'get_all_exercises', 'get_exercise_by_id', 'create_exercise', 'delete_exercise',
    # Unified class
    'FitnessTools'
]

# Convenience function to create a tools instance
def create_fitness_tools(api_base_url: str) -> FitnessTools:
    """
    Convenience function to create a FitnessTools instance
    
    Args:
        api_base_url: Base URL for the fitness API
        
    Returns:
        FitnessTools instance
    """
    return FitnessTools(api_base_url)