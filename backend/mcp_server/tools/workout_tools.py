import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class WorkoutData(BaseModel):
    name: str
    user_id: int

class WorkoutResponse(BaseModel):
    id: int
    name: str
    user_id: int

def get_all_workouts(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all workouts from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all workouts with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/workouts/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch workouts: {str(e)}"}]

def get_workout_by_id(workout_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific workout by its ID.
    
    Args:
        workout_id: The ID of the workout to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        Workout details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/workouts/{workout_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch workout {workout_id}: {str(e)}"}

def create_workout(name: str, user_id: int, base_url: str) -> Dict[str, Any]:
    """
    Create a new workout.
    
    Args:
        name: Name of the workout
        user_id: The ID of the user who owns this workout
        base_url: The base URL of the fitness API
        
    Returns:
        Created workout details or error message
    """
    try:
        workout_data = {
            "name": name,
            "user_id": user_id
        }
        response = requests.post(f"{base_url}/api/v1/workouts/", json=workout_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create workout: {str(e)}"} 