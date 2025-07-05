import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SetData(BaseModel):
    exercise_id: int
    reps: int
    weight: int

class SetResponse(BaseModel):
    id: int
    exercise_id: int
    reps: int
    weight: int

def get_all_sets(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all sets from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all sets with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/sets/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch sets: {str(e)}"}]

def get_set_by_id(set_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific set by its ID.
    
    Args:
        set_id: The ID of the set to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        Set details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/sets/{set_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch set {set_id}: {str(e)}"}

def create_set(exercise_id: int, reps: int, weight: int, base_url: str) -> Dict[str, Any]:
    """
    Create a new set.
    
    Args:
        exercise_id: The ID of the exercise this set belongs to
        reps: Number of repetitions
        weight: Weight used in the set
        base_url: The base URL of the fitness API
        
    Returns:
        Created set details or error message
    """
    try:
        set_data = {
            "exercise_id": exercise_id,
            "reps": reps,
            "weight": weight
        }
        response = requests.post(f"{base_url}/api/v1/sets/", json=set_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create set: {str(e)}"} 