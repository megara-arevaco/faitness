from fastapi import APIRouter, Depends, status
from app.models.set import Set
from database.db import get_db_connection
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError
router = APIRouter()

@router.get("/", response_model=list[Set])
@handle_db_errors("get_sets")
def get_sets(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, exercise_id, reps, weight FROM sets")
    sets = cursor.fetchall()
    cursor.close()
    return [Set(id=s[0], exercise_id=s[1], reps=s[2], weight=s[3]) for s in sets]

@router.get("/{set_id}", response_model=Set)
@handle_db_errors("get_set")
@handle_not_found("Set")
def get_set(set_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, exercise_id, reps, weight FROM sets WHERE id = %s", (set_id,))
    set_data = cursor.fetchone()
    cursor.close()
    
    return Set(id=set_data[0], exercise_id=set_data[1], reps=set_data[2], weight=set_data[3])

@router.post("/", response_model=Set, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_set")
@with_transaction_rollback()
def create_set(set_data: Set, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO sets (exercise_id, reps, weight) VALUES (%s, %s, %s) RETURNING id",
        (set_data.exercise_id, set_data.reps, set_data.weight)
    )
    set_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return Set(id=set_id, exercise_id=set_data.exercise_id, reps=set_data.reps, weight=set_data.weight)

 