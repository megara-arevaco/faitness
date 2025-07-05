import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ExerciseData(BaseModel):
    name: str
    description: str
    workout_id: int

class ExerciseResponse(BaseModel):
    id: int
    name: str
    description: str
    workout_id: int

def get_all_exercises(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all exercises from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all exercises with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/exercises/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch exercises: {str(e)}"}]

def get_exercise_by_id(exercise_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific exercise by its ID.
    
    Args:
        exercise_id: The ID of the exercise to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        Exercise details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/exercises/{exercise_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch exercise {exercise_id}: {str(e)}"}

def create_exercise(name: str, description: str, workout_id: int, base_url: str) -> Dict[str, Any]:
    """
    Create a new exercise.
    
    Args:
        name: Name of the exercise
        description: Description of the exercise
        workout_id: The ID of the workout this exercise belongs to
        base_url: The base URL of the fitness API
        
    Returns:
        Created exercise details or error message
    """
    try:
        exercise_data = {
            "name": name,
            "description": description,
            "workout_id": workout_id
        }
        response = requests.post(f"{base_url}/api/v1/exercises/", json=exercise_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create exercise: {str(e)}"}

def delete_exercise(exercise_id: int, base_url: str) -> Dict[str, Any]:
    """
    Delete an exercise by its ID.
    
    Args:
        exercise_id: The ID of the exercise to delete
        base_url: The base URL of the fitness API
        
    Returns:
        Success message or error message
    """
    try:
        response = requests.delete(f"{base_url}/api/v1/exercises/exercises/{exercise_id}")
        response.raise_for_status()
        return {"message": "Exercise deleted successfully"}
    except requests.RequestException as e:
        return {"error": f"Failed to delete exercise {exercise_id}: {str(e)}"} 