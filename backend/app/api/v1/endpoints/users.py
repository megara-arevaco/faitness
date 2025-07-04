from fastapi import APIRouter, Depends
from database.db import get_db_connection
from app.models.user import User

router = APIRouter()

@router.get("/users", response_model=list[User])
def get_users(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    return [User(id=u[0], email=u[1], name=u[2]) for u in users]

@router.get("/users/{user_id}", response_model=User)
def get_user(user_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    return User(id=user[0], email=user[1], name=user[2])