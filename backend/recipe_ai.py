import os
import json
import requests

from groq import Groq
from dotenv import load_dotenv

from schemas import RecipeResponse, Nutrition

# Load .env
load_dotenv()

print("API KEY:", os.getenv("GROQ_API_KEY"))

# Create Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
def get_food_image(search_query):

    url = "https://api.pexels.com/v1/search"

    headers = {
        "Authorization": os.getenv("PEXELS_API_KEY")
    }

    params = {
        "query": search_query,
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

def generate_recipe(ingredients, category, meal_type):

    prompt = f"""
You are Home Chef Buddy AI.

The user wants a {category} {meal_type} recipe.

Rules:

1. If category is "Veg", generate ONLY vegetarian recipes.

2. If category is "Non-Veg", generate ONLY non-vegetarian recipes.

3. If category is "Milkshake", generate ONLY milkshake recipes.

4. If category is "Dessert", generate ONLY dessert recipes.

5. If category is "Breakfast", generate ONLY breakfast recipes.

6. If category is "Lunch", generate ONLY lunch recipes.

7. If category is "Dinner", generate ONLY dinner recipes.

Use these ingredients:

{ingredients}
Also generate an "image_prompt" field.

The image_prompt should be a realistic food photography search phrase.

Example:

"Fresh homemade tomato rice bowl in a white ceramic bowl with basil garnish, restaurant style food photography"

Do not use generic words like "food".
Make the prompt describe exactly how the dish looks.

Return ONLY valid JSON in the following format.

{{
    "recipe_name": "",
     "image_prompt": "",
    "image": "",
    "description": "",
    "cooking_time": "",
    "difficulty": "",
    "servings": "",
    "ingredients": [],
    "steps": [],
    "nutrition": {{
        "calories": "",
        "protein": "",
        "carbs": "",
        "fat": ""
    }},
    "grocery_list": [],
    "chef_tip": ""
}}

Do NOT return markdown.
Do NOT return explanations.
Return ONLY JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
    )

    text = response.choices[0].message.content.strip()

    print("\n========== AI RESPONSE ==========")
    print(text)
    print("================================\n")

    # Remove markdown if AI returns ```json
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    data = json.loads(text)
    # Generate food image URL
    data["image"] = get_food_image(data["image_prompt"])

    # Convert ingredient objects into strings if needed
    ingredient_list = []

    for item in data["ingredients"]:

        if isinstance(item, dict):
            ingredient_list.append(
                f'{item.get("quantity","")} {item.get("unit","")} {item.get("name","")}'.strip()
            )

        else:
            ingredient_list.append(str(item))

    return RecipeResponse(

    recipe_name=data["recipe_name"],

    image=data["image"],

    description=data["description"],

    cooking_time=data["cooking_time"],

    difficulty=data["difficulty"],

    servings=data["servings"],

    ingredients=ingredient_list,

    steps=data["steps"],

    nutrition=Nutrition(
        calories=data["nutrition"]["calories"],
        protein=data["nutrition"]["protein"],
        carbs=data["nutrition"]["carbs"],
        fat=data["nutrition"]["fat"]
    ),

    grocery_list=data["grocery_list"],

    chef_tip=data["chef_tip"]

)