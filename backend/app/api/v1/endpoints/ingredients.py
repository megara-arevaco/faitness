from fastapi import APIRouter, Depends, status
from app.models.ingredient import Ingredient
from database.db import get_db_connection
from app.core.decorators import handle_db_errors, handle_not_found, with_transaction_rollback
from app.core.exceptions import NotFoundError
router = APIRouter()

@router.get("/", response_model=list[Ingredient])
@handle_db_errors("get_ingredients")
def get_ingredients(db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, calories, protein, carbs, fat, meal_id FROM ingredients")
    ingredients = cursor.fetchall()
    cursor.close()
    return [Ingredient(id=i[0], name=i[1], description=i[2], calories=i[3], protein=i[4], carbs=i[5], fat=i[6], meal_id=i[7]) for i in ingredients]

@router.get("/{ingredient_id}", response_model=Ingredient)
@handle_db_errors("get_ingredient")
@handle_not_found("Ingredient")
def get_ingredient(ingredient_id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("SELECT id, name, description, calories, protein, carbs, fat, meal_id FROM ingredients WHERE id = %s", (ingredient_id,))
    ingredient = cursor.fetchone()
    cursor.close()
    
    return Ingredient(id=ingredient[0], name=ingredient[1], description=ingredient[2], calories=ingredient[3], protein=ingredient[4], carbs=ingredient[5], fat=ingredient[6], meal_id=ingredient[7])

@router.post("/", response_model=Ingredient, status_code=status.HTTP_201_CREATED)
@handle_db_errors("create_ingredient")
@with_transaction_rollback()
def create_ingredient(ingredient: Ingredient, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO ingredients (name, description, calories, protein, carbs, fat, meal_id) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (ingredient.name, ingredient.description, ingredient.calories, ingredient.protein, ingredient.carbs, ingredient.fat, ingredient.meal_id)
    )
    ingredient_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    return Ingredient(id=ingredient_id, name=ingredient.name, description=ingredient.description, calories=ingredient.calories, protein=ingredient.protein, carbs=ingredient.carbs, fat=ingredient.fat, meal_id=ingredient.meal_id)

 