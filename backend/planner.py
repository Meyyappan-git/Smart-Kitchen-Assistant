import copy
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
from models import PantryItem, Recipe, UserSettings

def calculate_item_urgency(days_left: int) -> float:
    """Computes urgency weight based on days to expiry."""
    if days_left <= 0:
        return 100.0  # Expired or expires today
    elif days_left == 1:
        return 60.0
    elif days_left == 2:
        return 40.0
    elif days_left <= 4:
        return 20.0
    elif days_left <= 7:
        return 8.0
    else:
        return 1.0

def matches_diet(recipe: Recipe, diet_preference: str) -> bool:
    """Checks if recipe matches user dietary restriction."""
    if not diet_preference or diet_preference == "All":
        return True
    
    tags = recipe.diet_tags or []
    if diet_preference == "Vegetarian":
        return "Non-Veg" not in tags
    elif diet_preference == "Vegan":
        return "Vegan" in tags
    elif diet_preference == "Eggless":
        return "Non-Veg" not in tags and "Eggs" not in (recipe.allergens or [])
    elif diet_preference == "Non-Veg":
        return True
    return True

def has_allergen_conflict(recipe: Recipe, user_allergens: List[str]) -> bool:
    """Returns True if recipe contains any allergen the user avoids."""
    if not user_allergens:
        return False
    recipe_allergens = [a.lower() for a in (recipe.allergens or [])]
    for allergen in user_allergens:
        if allergen.lower() in recipe_allergens:
            return True
    return False

def generate_meal_plan_algorithm(
    pantry_items: List[PantryItem],
    recipes: List[Recipe],
    settings: UserSettings,
    days: int = 3,
    meal_types: Optional[List[str]] = None,
    respect_budget: bool = True,
    respect_diet: bool = True,
    respect_time: bool = True
) -> Dict[str, Any]:
    """
    Intelligent zero-waste meal planner:
    1. Ranks pantry items by days to expiry.
    2. Scores recipes by urgent ingredient usage.
    3. Greedily picks best recipes, deducts from working virtual pantry.
    4. Avoids repeated dishes, respects constraints.
    5. Returns day-by-day plan with saved expiring items.
    """
    if meal_types is None:
        meal_types = ["Breakfast", "Lunch", "Dinner"]

    today = date.today()

    # Create virtual working copy of pantry
    # Key: normalized ingredient name -> {quantity, unit, days_left, urgency, emoji}
    virtual_pantry: Dict[str, Dict[str, Any]] = {}
    for item in pantry_items:
        key = item.name.strip().lower()
        days_left = (item.expiry_date - today).days if item.expiry_date else 999
        urgency = calculate_item_urgency(days_left)
        
        if key not in virtual_pantry or days_left < virtual_pantry[key]["days_left"]:
            virtual_pantry[key] = {
                "id": item.id,
                "name": item.name,
                "quantity": float(item.quantity),
                "unit": item.unit,
                "days_left": days_left,
                "urgency": urgency,
                "category": item.category,
                "emoji": item.emoji
            }

    plan_days = []
    used_recipe_ids = set()
    total_saved_expiring_items = set()
    all_missing_ingredients = []

    for day_idx in range(1, days + 1):
        day_date = today + timedelta(days=day_idx - 1)
        day_date_str = day_date.strftime("%A, %b %d")
        
        day_meals = []

        for meal_type in meal_types:
            best_recipe = None
            best_score = -999999
            best_saved = []
            best_missing = []

            for recipe in recipes:
                # 1. Dietary filter
                if respect_diet and not matches_diet(recipe, settings.diet_preference):
                    continue

                # 2. Allergen filter
                if has_allergen_conflict(recipe, settings.allergens or []):
                    continue

                # 3. Time filter
                total_time = recipe.prep_time_minutes + recipe.cook_time_minutes
                if respect_time and total_time > (settings.max_cooking_time_minutes * 1.3):
                    continue

                # 4. Budget filter
                if respect_budget and recipe.cost_inr > (settings.budget_per_meal_inr * 1.5):
                    continue

                # Repetition penalty
                repetition_penalty = -300.0 if recipe.id in used_recipe_ids else 0.0

                # Meal type preference bonus
                slot_bonus = 0.0
                if recipe.category == meal_type:
                    slot_bonus = 25.0
                elif meal_type in ["Lunch", "Dinner"] and recipe.category in ["Lunch", "Dinner"]:
                    slot_bonus = 15.0

                # Calculate urgent ingredient score
                recipe_ingredients = recipe.ingredients or []
                match_score = 0.0
                saved_in_recipe = []
                missing_in_recipe = []

                for req in recipe_ingredients:
                    ing_name = req.get("name", "").strip().lower()
                    req_amt = float(req.get("amount", 1.0))
                    req_unit = req.get("unit", "items")

                    pantry_entry = virtual_pantry.get(ing_name)
                    if pantry_entry and pantry_entry["quantity"] > 0:
                        urgency = pantry_entry["urgency"]
                        days_left = pantry_entry["days_left"]
                        
                        # Weight proportional to urgency
                        match_score += urgency * 2.5
                        if days_left <= 2:
                            # Critical urgency bonus
                            match_score += 40.0
                        
                        saved_in_recipe.append({
                            "name": pantry_entry["name"],
                            "days_left": days_left,
                            "emoji": pantry_entry.get("emoji", "🥗")
                        })
                    else:
                        match_score -= 3.0  # slight penalty for missing ingredients
                        missing_in_recipe.append({
                            "name": req.get("name", "Ingredient"),
                            "amount": req_amt,
                            "unit": req_unit,
                            "category": "Pantry"
                        })

                # Rating bonus
                rating_bonus = (recipe.rating or 4.5) * 3.0

                total_score = match_score + slot_bonus + repetition_penalty + rating_bonus

                if total_score > best_score:
                    best_score = total_score
                    best_recipe = recipe
                    best_saved = saved_in_recipe
                    best_missing = missing_in_recipe

            # If no recipe found matching filters, fallback to any valid recipe for the slot
            if not best_recipe:
                for candidate in recipes:
                    if candidate.id not in used_recipe_ids:
                        best_recipe = candidate
                        break
                if not best_recipe and recipes:
                    best_recipe = recipes[0]
                best_saved = []
                best_missing = best_recipe.ingredients if best_recipe else []

            if best_recipe:
                used_recipe_ids.add(best_recipe.id)
                
                # Deduct ingredients from virtual pantry
                for req in (best_recipe.ingredients or []):
                    ing_name = req.get("name", "").strip().lower()
                    req_amt = float(req.get("amount", 1.0))
                    if ing_name in virtual_pantry:
                        virtual_pantry[ing_name]["quantity"] = max(0.0, virtual_pantry[ing_name]["quantity"] - req_amt)

                for item in best_saved:
                    total_saved_expiring_items.add(item["name"])

                for m in best_missing:
                    all_missing_ingredients.append(m)

                day_meals.append({
                    "meal_type": meal_type,
                    "recipe": best_recipe.to_dict(),
                    "saved_ingredients": best_saved,
                    "missing_ingredients": best_missing
                })

        plan_days.append({
            "day_number": day_idx,
            "date": day_date.isoformat(),
            "date_display": day_date_str,
            "meals": day_meals
        })

    # Consolidate missing ingredients for shopping list
    consolidated_missing: Dict[str, Dict[str, Any]] = {}
    for item in all_missing_ingredients:
        name = item["name"].strip().lower()
        amt = item.get("amount", 1.0)
        unit = item.get("unit", "items")
        category = item.get("category", "Pantry")
        
        if name in consolidated_missing:
            consolidated_missing[name]["quantity"] += amt
        else:
            consolidated_missing[name] = {
                "name": item["name"],
                "quantity": amt,
                "unit": unit,
                "category": category,
                "estimated_cost_inr": int(amt * 25) if unit in ["items", "bunches"] else 60
            }

    return {
        "days": plan_days,
        "total_days": days,
        "total_meals": len(plan_days) * len(meal_types),
        "saved_expiring_items_count": len(total_saved_expiring_items),
        "saved_expiring_items": list(total_saved_expiring_items),
        "missing_ingredients": list(consolidated_missing.values())
    }
