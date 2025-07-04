from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Meal(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    user_id: int
