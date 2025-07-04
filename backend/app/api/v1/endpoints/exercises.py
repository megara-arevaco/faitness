from fastapi import APIRouter, Depends, status
from database.db import get_db_connection
from app.models.exercise import Exercise
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError
router = APIRouter()

@router.get("/", response_model=list[Exercise])
@handle_db_errors("get_exercises")
def get_exercises(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, workout_id FROM exercises")
    exercises = cursor.fetchall()
    cursor.close()
    return [Exercise(id=e[0], name=e[1], description=e[2], workout_id=e[3]) for e in exercises]

@router.get("/{exercise_id}", response_model=Exercise)
@handle_db_errors("get_exercise")
@handle_not_found("Exercise")
def get_exercise(exercise_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, workout_id FROM exercises WHERE id = %s", (exercise_id,))
    exercise = cursor.fetchone()
    cursor.close()
    
    return Exercise(id=exercise[0], name=exercise[1], description=exercise[2], workout_id=exercise[3])

@router.post("/", response_model=Exercise, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_exercise")
@with_transaction_rollback()
def create_exercise(exercise: Exercise, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO exercises (name, description, workout_id) VALUES (%s, %s, %s) RETURNING id",
        (exercise.name, exercise.description, exercise.workout_id)
    )
    exercise_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return Exercise(id=exercise_id, name=exercise.name, description=exercise.description, workout_id=exercise.workout_id)

@router.delete("/exercises/{exercise_id}", response_model=Exercise)
def delete_exercise(exercise_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM exercises WHERE id = %s", (exercise_id,))
    db.commit()
    cursor.close()
    return {"message": "Exercise deleted successfully"}