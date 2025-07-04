from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Ingredient(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    calories: int
    protein: int
    carbs: int
    fat: int
    meal_id: int
    created_at: Optional[datetime] = None 