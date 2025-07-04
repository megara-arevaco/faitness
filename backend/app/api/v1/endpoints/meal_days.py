from fastapi import APIRouter, Depends, status
from app.models.meal_day import MealDay
from database.db import get_db_connection
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError
router = APIRouter()

@router.get("/", response_model=list[MealDay])
@handle_db_errors("get_meal_days")
def get_meal_days(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, meal_id, day_of_week FROM meal_days")
    meal_days = cursor.fetchall()
    cursor.close()
    return [MealDay(id=md[0], meal_id=md[1], day_of_week=md[2]) for md in meal_days]

@router.get("/{meal_day_id}", response_model=MealDay)
@handle_db_errors("get_meal_day")
@handle_not_found("Meal day")
def get_meal_day(meal_day_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, meal_id, day_of_week FROM meal_days WHERE id = %s", (meal_day_id,))
    meal_day = cursor.fetchone()
    cursor.close()
    
    return MealDay(id=meal_day[0], meal_id=meal_day[1], day_of_week=meal_day[2])

@router.post("/", response_model=MealDay, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_meal_day")
@with_transaction_rollback()
def create_meal_day(meal_day: MealDay, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO meal_days (meal_id, day_of_week) VALUES (%s, %s) RETURNING id",
        (meal_day.meal_id, meal_day.day_of_week)
    )
    meal_day_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return MealDay(id=meal_day_id, meal_id=meal_day.meal_id, day_of_week=meal_day.day_of_week)

 