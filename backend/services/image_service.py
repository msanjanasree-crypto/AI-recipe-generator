import requests
import os
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

    return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"