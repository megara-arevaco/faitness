import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class MealDayData(BaseModel):
    meal_id: int
    day_of_week: str

class MealDayResponse(BaseModel):
    id: int
    meal_id: int
    day_of_week: str

def get_all_meal_days(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all meal days from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all meal days with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/meal-days/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch meal days: {str(e)}"}]

def get_meal_day_by_id(meal_day_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific meal day by its ID.
    
    Args:
        meal_day_id: The ID of the meal day to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        Meal day details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/meal-days/{meal_day_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch meal day {meal_day_id}: {str(e)}"}

def create_meal_day(meal_id: int, day_of_week: str, base_url: str) -> Dict[str, Any]:
    """
    Create a new meal day.
    
    Args:
        meal_id: The ID of the meal
        day_of_week: The day of the week (e.g., "Monday", "Tuesday", etc.)
        base_url: The base URL of the fitness API
        
    Returns:
        Created meal day details or error message
    """
    try:
        meal_day_data = {
            "meal_id": meal_id,
            "day_of_week": day_of_week
        }
        response = requests.post(f"{base_url}/api/v1/meal-days/", json=meal_day_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create meal day: {str(e)}"} 