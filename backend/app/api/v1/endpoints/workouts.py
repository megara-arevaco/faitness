from fastapi import APIRouter, Depends, status
from database.db import get_db_connection
from app.models.workout import Workout
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError

router = APIRouter()

@router.get("/", response_model=list[Workout])
@handle_db_errors("get_workouts")
def get_workouts(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, user_id FROM workouts")
    workouts = cursor.fetchall()
    cursor.close()
    return [Workout(id=w[0], name=w[1], user_id=w[2]) for w in workouts]

@router.get("/{workout_id}", response_model=Workout)
@handle_db_errors("get_workout")
@handle_not_found("Workout")
def get_workout(workout_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, user_id FROM workouts WHERE id = %s", (workout_id,))
    workout = cursor.fetchone()
    cursor.close()
    
    return Workout(id=workout[0], name=workout[1], user_id=workout[2])

@router.post("/", response_model=Workout, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_workout")
@with_transaction_rollback()
def create_workout(workout: Workout, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO workouts (name, user_id) VALUES (%s, %s) RETURNING id",
        (workout.name, workout.user_id)
    )
    workout_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return Workout(id=workout_id, name=workout.name, user_id=workout.user_id) 