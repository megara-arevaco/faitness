from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Exercise(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    workout_id: int
    created_at: Optional[datetime] = None 