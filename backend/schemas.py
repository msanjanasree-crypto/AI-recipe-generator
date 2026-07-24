from pydantic import BaseModel, EmailStr
from typing import List
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Message(BaseModel):
    message: str

class LoginResponse(BaseModel):
    message: str
    name: str
    email: EmailStr


class RecipeRequest(BaseModel):
    ingredients: str
    category: str
    meal_type: str


class Nutrition(BaseModel):
    calories: str
    protein: str
    carbs: str
    fat: str


# NEW
class GroceryItem(BaseModel):
    item: str


class RecipeResponse(BaseModel):
    recipe_name: str
    image: str
    description: str
    cooking_time: str
    difficulty: str
    servings: str

    ingredients: List[str]
    steps: List[str]

    nutrition: Nutrition

    grocery_list: List[str]

    chef_tip: str