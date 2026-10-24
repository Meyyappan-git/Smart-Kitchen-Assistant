import os
import json
import base64
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Fallback smart detections if Gemini API is unavailable or offline
FALLBACK_ITEMS = [
    {"name": "milk", "category": "Dairy", "quantity": 1000, "unit": "ml", "confidence": 0.94, "emoji": "🥛"},
    {"name": "tomatoes", "category": "Vegetables", "quantity": 4, "unit": "items", "confidence": 0.91, "emoji": "🍅"},
    {"name": "eggs", "category": "Protein", "quantity": 6, "unit": "items", "confidence": 0.96, "emoji": "🥚"},
    {"name": "mushrooms", "category": "Vegetables", "quantity": 200, "unit": "g", "confidence": 0.88, "emoji": "🍄"},
    {"name": "spinach", "category": "Vegetables", "quantity": 1, "unit": "bunches", "confidence": 0.89, "emoji": "🥬"},
    {"name": "cheese", "category": "Dairy", "quantity": 200, "unit": "g", "confidence": 0.87, "emoji": "🧀"}
]

def analyze_fridge_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
    """
    Analyzes an image of a fridge or groceries using Gemini Vision.
    Returns a list of detected food ingredients with estimated quantities and categories.
    """
    api_key = os.getenv("GEMINI_API_KEY", GEMINI_API_KEY)
    
    if not api_key:
        logger.warning("GEMINI_API_KEY not set. Using smart fallback detection.")
        return {
            "source": "fallback_demo",
            "message": "Demo mode: Gemini API key not detected in .env. Showing simulated detections.",
            "detected_items": FALLBACK_ITEMS
        }

    # Attempt calling Google Gemini API
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        prompt = """
        You are an expert AI Smart Fridge vision scanner. Analyze this fridge or kitchen grocery image.
        Identify all clearly visible food ingredients, vegetables, fruits, dairy, meats, drinks, or pantry items.
        
        Respond ONLY with a valid JSON array of objects with the following schema, and no extra markdown or backticks:
        [
          {
            "name": "ingredient name in lowercase (e.g. tomatoes, milk, eggs)",
            "category": "Vegetables" | "Fruits" | "Dairy" | "Protein" | "Drinks" | "Pantry",
            "quantity": numeric estimated quantity (e.g. 4, 500, 1),
            "unit": "items" | "g" | "ml" | "bunches" | "slices",
            "confidence": float between 0.0 and 1.0,
            "emoji": "appropriate single emoji"
          }
        ]
        """
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            prompt,
            {"mime_type": mime_type, "data": image_bytes}
        ])
        
        raw_text = response.text.strip()
        # Clean potential markdown wrapping
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        parsed_items = json.loads(raw_text)
        if isinstance(parsed_items, list) and len(parsed_items) > 0:
            return {
                "source": "gemini_api",
                "message": f"Successfully identified {len(parsed_items)} ingredients using Gemini AI Vision.",
                "detected_items": parsed_items
            }
        else:
            raise ValueError("Empty or non-list response from Gemini")

    except Exception as e:
        logger.error(f"Gemini API analysis failed: {e}. Falling back to default detections.")
        return {
            "source": "fallback_error",
            "message": f"Gemini scan encountered an error ({str(e)[:100]}). Showing default detection results.",
            "detected_items": FALLBACK_ITEMS
        }
