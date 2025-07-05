import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class UserData(BaseModel):
    email: str
    name: str
    age: int
    weight: float
    height: float

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    age: int
    weight: float
    height: float

def get_all_users(base_url: str) -> List[Dict[str, Any]]:
    """
    Get all users from the fitness API.
    
    Args:
        base_url: The base URL of the fitness API
        
    Returns:
        List of all users with their details
    """
    try:
        response = requests.get(f"{base_url}/api/v1/users/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return [{"error": f"Failed to fetch users: {str(e)}"}]

def get_user_by_id(user_id: int, base_url: str) -> Dict[str, Any]:
    """
    Get a specific user by its ID.
    
    Args:
        user_id: The ID of the user to retrieve
        base_url: The base URL of the fitness API
        
    Returns:
        User details or error message
    """
    try:
        response = requests.get(f"{base_url}/api/v1/users/{user_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch user {user_id}: {str(e)}"}

def create_user(email: str, name: str, age: int, weight: float, height: float, base_url: str) -> Dict[str, Any]:
    """
    Create a new user.
    
    Args:
        email: User's email address
        name: User's name
        age: User's age
        weight: User's weight in kg
        height: User's height in cm
        base_url: The base URL of the fitness API
        
    Returns:
        Created user details or error message
    """
    try:
        user_data = {
            "email": email,
            "name": name,
            "age": age,
            "weight": weight,
            "height": height
        }
        response = requests.post(f"{base_url}/api/v1/users/", json=user_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create user: {str(e)}"}

def update_user(user_id: int, base_url: str, **kwargs) -> Dict[str, Any]:
    """
    Update a user's information.
    
    Args:
        user_id: The ID of the user to update
        base_url: The base URL of the fitness API
        **kwargs: Fields to update (email, name, age, weight, height)
        
    Returns:
        Updated user details or error message
    """
    try:
        response = requests.put(f"{base_url}/api/v1/users/{user_id}", json=kwargs)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to update user {user_id}: {str(e)}"}

def delete_user(user_id: int, base_url: str) -> Dict[str, Any]:
    """
    Delete a user.
    
    Args:
        user_id: The ID of the user to delete
        base_url: The base URL of the fitness API
        
    Returns:
        Success message or error message
    """
    try:
        response = requests.delete(f"{base_url}/api/v1/users/{user_id}")
        response.raise_for_status()
        return {"message": "User deleted successfully"}
    except requests.RequestException as e:
        return {"error": f"Failed to delete user {user_id}: {str(e)}"}    