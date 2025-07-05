import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class IngredientData(BaseModel):
    name: str
    description: Optional[str] = None
    calories: int
    protein: int
    carbs: int
    fat: int
    meal_id: int

class IngredientResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    calories: int
    protein: int
    carbs: int
    fat: int
    meal_id: int

def get_all_ingredients(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all ingredients from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all ingredients with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/ingredients/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch ingredients: {str(e)}"}]

def get_ingredient_by_id(ingredient_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific ingredient by its ID.
    
    Args:
        ingredient_id: The ID of the ingredient to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        Ingredient details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/ingredients/{ingredient_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch ingredient {ingredient_id}: {str(e)}"}

def create_ingredient(name: str, calories: int, protein: int, carbs: int, fat: int, meal_id: int, base_url: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new ingredient.
    
    Args:
        name: Name of the ingredient
        calories: Calories per serving
        protein: Protein content in grams
        carbs: Carbohydrate content in grams
        fat: Fat content in grams
        meal_id: The ID of the meal this ingredient belongs to
        description: Optional description of the ingredient
        base_url: The base URL of the fitness API
        
    Returns:
        Created ingredient details or error message
    """
    try:
        ingredient_data = {
            "name": name,
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fat": fat,
            "meal_id": meal_id
        }
        if description:
            ingredient_data["description"] = description
            
        response = requests.post(f"{base_url}/api/v1/ingredients/", json=ingredient_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create ingredient: {str(e)}"} 