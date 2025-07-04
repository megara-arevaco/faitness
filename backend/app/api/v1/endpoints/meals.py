from fastapi import APIRouter, Depends, status
from app.models.meal import Meal
from database.db import get_db_connection
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError
router = APIRouter()

@router.get("/", response_model=list[Meal])
@handle_db_errors("get_meals")
def get_meals(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, user_id FROM meal")
    meals = cursor.fetchall()
    cursor.close()
    return [Meal(id=m[0], name=m[1], description=m[2], user_id=m[3]) for m in meals]

@router.get("/{meal_id}", response_model=Meal)
@handle_db_errors("get_meal")
@handle_not_found("Meal")
def get_meal(meal_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, user_id FROM meal WHERE id = %s", (meal_id,))
    meal = cursor.fetchone()
    cursor.close()
    
    return Meal(id=meal[0], name=meal[1], description=meal[2], user_id=meal[3])

@router.post("/", response_model=Meal, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_meal")
@with_transaction_rollback()
def create_meal(meal: Meal, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO meal (name, description, user_id) VALUES (%s, %s, %s) RETURNING id",
        (meal.name, meal.description, meal.user_id)
    )
    meal_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return Meal(id=meal_id, name=meal.name, description=meal.description, user_id=meal.user_id)

 