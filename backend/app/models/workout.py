from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Workout(BaseModel):
    id: int
    name: str
    user_id: int
    created_at: Optional[datetime] = None 