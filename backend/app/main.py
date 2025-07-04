from fastapi import FastAPI
from app.api.v1.endpoints import users, workouts, exercises, sets, meals, ingredients, meal_days
from app.core.error_handlers import setup_error_handlers

app = FastAPI(title="Faitness API", version="1.0.0")

# Setup global error handlers
setup_error_handlers(app)

# Include all routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(workouts.router, prefix="/api/v1/workouts", tags=["workouts"])
app.include_router(exercises.router, prefix="/api/v1/exercises", tags=["exercises"])
app.include_router(sets.router, prefix="/api/v1/sets", tags=["sets"])
app.include_router(meals.router, prefix="/api/v1/meals", tags=["meals"])
app.include_router(ingredients.router, prefix="/api/v1/ingredients", tags=["ingredients"])
app.include_router(meal_days.router, prefix="/api/v1/meal-days", tags=["meal_days"])

@app.get("/")
def read_root():
    return {"message": "Faitness API is running!"}