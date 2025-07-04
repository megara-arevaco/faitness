from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MealDay(BaseModel):
    id: int
    meal_id: int
    day_of_week: str
    created_at: Optional[datetime] = None