# Fitness API MCP Server

This MCP (Model Context Protocol) server provides tools to interact with the Fitness API backend. It allows AI assistants to perform various fitness-related operations through a unified interface.

## Features

The MCP server provides tools for all major fitness API endpoints:

### User Management
- Create, read, update, and delete users
- Get user information by ID
- List all users

### Workout Management
- Create and manage workouts
- Associate workouts with users
- List all workouts

### Exercise Management
- Create exercises within workouts
- Delete exercises
- List all exercises

### Set Management
- Create sets for exercises
- Track reps and weight
- List all sets

### Meal Management
- Create and manage meals
- Associate meals with users
- List all meals

### Ingredient Management
- Add ingredients to meals
- Track nutritional information (calories, protein, carbs, fat)
- List all ingredients

### Meal Day Planning
- Schedule meals for specific days
- Plan weekly meal schedules
- List all meal days

## Installation

1. Make sure you have the required dependencies:
```bash
pip install requests pydantic
```

2. Ensure the Fitness API backend is running on `http://localhost:8000`

## Usage

### Using the Unified Tools Class

```python
from tools import FitnessTools

# Create a tools instance (base_url is required)
tools = FitnessTools("http://localhost:8000")

# User operations
user = tools.create_user(
    email="john@example.com",
    name="John Doe",
    age=30,
    weight=75.5,
    height=180.0
)

# Workout operations
workout = tools.create_workout(
    name="Morning Cardio",
    user_id=1
)

# Exercise operations
exercise = tools.create_exercise(
    name="Push-ups",
    description="Standard push-ups",
    workout_id=1
)

# Set operations
set_data = tools.create_set(
    exercise_id=1,
    reps=10,
    weight=0
)

# Meal operations
meal = tools.create_meal(
    name="Protein Shake",
    user_id=1,
    description="Post-workout shake"
)

# Ingredient operations
ingredient = tools.create_ingredient(
    name="Whey Protein",
    calories=120,
    protein=24,
    carbs=3,
    fat=1,
    meal_id=1,
    description="High-quality protein"
)

# Meal day operations
meal_day = tools.create_meal_day(
    meal_id=1,
    day_of_week="Monday"
)
```

### Using Individual Functions

You can also use individual functions directly:

```python
from tools import create_user, get_all_workouts, create_exercise

# Create a user
user = create_user(
    email="jane@example.com",
    name="Jane Smith",
    age=25,
    weight=65.0,
    height=165.0,
    base_url="http://localhost:8000"
)

# Get all workouts
workouts = get_all_workouts("http://localhost:8000")

# Create an exercise
exercise = create_exercise(
    name="Squats",
    description="Bodyweight squats",
    workout_id=1,
    base_url="http://localhost:8000"
)
```

## API Endpoints

The tools interact with the following API endpoints:

- `GET /api/v1/users/` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users/` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

- `GET /api/v1/workouts/` - Get all workouts
- `GET /api/v1/workouts/{id}` - Get workout by ID
- `POST /api/v1/workouts/` - Create workout

- `GET /api/v1/exercises/` - Get all exercises
- `GET /api/v1/exercises/{id}` - Get exercise by ID
- `POST /api/v1/exercises/` - Create exercise
- `DELETE /api/v1/exercises/exercises/{id}` - Delete exercise

- `GET /api/v1/sets/` - Get all sets
- `GET /api/v1/sets/{id}` - Get set by ID
- `POST /api/v1/sets/` - Create set

- `GET /api/v1/meals/` - Get all meals
- `GET /api/v1/meals/{id}` - Get meal by ID
- `POST /api/v1/meals/` - Create meal

- `GET /api/v1/ingredients/` - Get all ingredients
- `GET /api/v1/ingredients/{id}` - Get ingredient by ID
- `POST /api/v1/ingredients/` - Create ingredient

- `GET /api/v1/meal-days/` - Get all meal days
- `GET /api/v1/meal-days/{id}` - Get meal day by ID
- `POST /api/v1/meal-days/` - Create meal day

## Error Handling

All tools include proper error handling and will return error messages if the API calls fail. Error responses follow this format:

```python
{
    "error": "Failed to create user: Connection refused"
}
```

## Example Script

Run the example script to see all tools in action:

```bash
python example_usage.py
```

This will demonstrate creating users, workouts, exercises, sets, meals, ingredients, and meal days.

## MCP Server Integration

This tools package is designed to be used with an MCP server. The server can expose these tools to AI assistants, allowing them to interact with the fitness API programmatically.

## Contributing

To add new tools or modify existing ones:

1. Create a new tool file in the `tools/` directory
2. Follow the established pattern with proper error handling
3. Update the `tools/__init__.py` file to include the new tools
4. Add appropriate documentation and examples 