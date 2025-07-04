from pydantic import BaseModel

class Exercise(BaseModel):
    id: int
    name: str
    description: str
    workout_id: int