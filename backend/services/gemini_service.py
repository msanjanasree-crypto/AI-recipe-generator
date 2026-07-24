import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_recipe(ingredients):

    prompt = f"""
You are an expert chef.

Using these ingredients:

{ingredients}

Generate ONLY valid JSON.

Format:

{{
  "recipe_name":"",
  "description":"",
  "prep_time":"",
  "cook_time":"",
  "servings":"",
  "ingredients":[],
  "steps":[],
  "nutrition":{{
      "calories":"",
      "protein":"",
      "carbs":"",
      "fat":""
  }},
  "grocery_list":[],
  "chef_tip":""
}}

Do not include markdown.
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)