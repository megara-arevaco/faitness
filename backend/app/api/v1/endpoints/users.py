from fastapi import APIRouter, Depends, status
from database.db import get_db_connection
from app.models.user import User
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError
router = APIRouter()

@router.get("/", response_model=list[User])
@handle_db_errors("get_users")
def get_users(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, email FROM users")
    users = cursor.fetchall()
    cursor.close()
    return [User(id=u[0], name=u[1], email=u[2]) for u in users]

@router.get("/{user_id}", response_model=User)
@handle_db_errors("get_user")
@handle_not_found("User")
def get_user(user_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    
    return User(id=user[0], name=user[1], email=user[2])

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_user")
@with_transaction_rollback()
def create_user(user: User, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO users (name, email) VALUES (%s, %s) RETURNING id",
        (user.name, user.email)
    )
    user_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return User(id=user_id, name=user.name, email=user.email)

@router.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, user: User, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("UPDATE users SET email = %s, name = %s WHERE id = %s", (user.email, user.name, user_id))
    db.commit()
    cursor.close()
    return user

@router.delete("/users/{user_id}", response_model=User)
def delete_user(user_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    db.commit()
    cursor.close()
    return {"message": "User deleted successfully"}