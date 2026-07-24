import os
import requests
from fastapi import APIRouter
from schemas import RecipeResponse, RecipeRequest
from recipe_ai import generate_recipe
from dotenv import load_dotenv

load_dotenv()
def get_food_image(recipe_name):

    url = "https://api.pexels.com/v1/search"

    headers = {
        "Authorization": os.getenv("PEXELS_API_KEY")
    }

    params = {
        "query": recipe_name + " food",
        "per_page": 1
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )

    data = response.json()

    if data.get("photos"):
        return data["photos"][0]["src"]["large"]

    return ""

router = APIRouter(
    prefix="/recipe",
    tags=["Recipe Generator"]
)


@router.post("/generate", response_model=RecipeResponse)
def recipe(request: RecipeRequest):

    recipe_data = generate_recipe(
        request.ingredients,
        request.category,
        request.meal_type
    )

    # Get image from Pexels
    recipe_data.image = get_food_image(
        recipe_data.recipe_name
    )

    return recipe_data