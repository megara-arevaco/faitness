import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class MealData(BaseModel):
    name: str
    description: Optional[str] = None
    user_id: int

class MealResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    user_id: int

def get_all_meals(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all meals from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all meals with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/meals/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch meals: {str(e)}"}]

def get_meal_by_id(meal_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific meal by its ID.
    
    Args:
        meal_id: The ID of the meal to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        Meal details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/meals/{meal_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch meal {meal_id}: {str(e)}"}

def create_meal(name: str, user_id: int, base_url: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new meal.
    
    Args:
        name: Name of the meal
        user_id: The ID of the user who owns this meal
        description: Optional description of the meal
        base_url: The base URL of the fitness API
        
    Returns:
        Created meal details or error message
    """
    try:
        meal_data = {
            "name": name,
            "user_id": user_id
        }
        if description:
            meal_data["description"] = description
            
        response = requests.post(f"{base_url}/api/v1/meals/", json=meal_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create meal: {str(e)}"} 