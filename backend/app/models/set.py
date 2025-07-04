from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Set(BaseModel):
    id: int
    exercise_id: int
    reps: int
    weight: int
    created_at: Optional[datetime] = None 