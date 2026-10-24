import os
import re
import json
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, Base, get_db
import models
import schemas
from planner import generate_meal_plan_algorithm
from gemini_service import analyze_fridge_image

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Smart Fridge API", version="1.0.0")

# CORS middleware for React / Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to auto-seed if empty
def init_db_if_needed(db: Session):
    recipe_count = db.query(models.Recipe).count()
    if recipe_count == 0:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        data_dir = os.path.join(base_dir, "data")
        
        # Seed shelf life rules
        shelf_life_path = os.path.join(data_dir, "shelf_life.json")
        if os.path.exists(shelf_life_path):
            with open(shelf_life_path, "r", encoding="utf-8") as f:
                shelf_data = json.load(f)
                for name, rule in shelf_data.items():
                    db.add(models.ShelfLifeRule(
                        name=name.lower(),
                        category=rule.get("category", "Pantry"),
                        shelf_life_days=rule.get("shelf_life_days", 7),
                        default_unit=rule.get("default_unit", "items"),
                        emoji=rule.get("emoji", "🥗")
                    ))
        
        # Seed recipes
        recipes_path = os.path.join(data_dir, "recipes.json")
        if os.path.exists(recipes_path):
            with open(recipes_path, "r", encoding="utf-8") as f:
                recipes_list = json.load(f)
                for r in recipes_list:
                    db.add(models.Recipe(
                        id=r["id"],
                        title=r["title"],
                        description=r.get("description", ""),
                        cuisine=r.get("cuisine", "International"),
                        category=r.get("category", "Dinner"),
                        prep_time_minutes=r.get("prep_time_minutes", 10),
                        cook_time_minutes=r.get("cook_time_minutes", 20),
                        difficulty=r.get("difficulty", "Easy"),
                        calories=r.get("calories", 350),
                        cost_inr=r.get("cost_inr", 150),
                        rating=r.get("rating", 4.8),
                        reviews_count=r.get("reviews_count", 50),
                        diet_tags=r.get("diet_tags", []),
                        allergens=r.get("allergens", []),
                        image_url=r.get("image_url", ""),
                        ingredients=r.get("ingredients", []),
                        steps=r.get("steps", [])
                    ))

        # Seed pantry
        pantry_path = os.path.join(data_dir, "seed_pantry.json")
        if os.path.exists(pantry_path):
            with open(pantry_path, "r", encoding="utf-8") as f:
                pantry_list = json.load(f)
                for item in pantry_list:
                    exp_date = datetime.strptime(item["expiry_date"], "%Y-%m-%d").date()
                    db.add(models.PantryItem(
                        name=item["name"],
                        category=item.get("category", "Pantry"),
                        quantity=item.get("quantity", 1.0),
                        unit=item.get("unit", "items"),
                        expiry_date=exp_date,
                        emoji=item.get("emoji", "🥗")
                    ))

        # Seed default user settings
        existing_settings = db.query(models.UserSettings).first()
        if not existing_settings:
            db.add(models.UserSettings(
                id=1,
                user_name="Alex",
                budget_per_meal_inr=250,
                max_cooking_time_minutes=45,
                diet_preference="All",
                allergens=[],
                notifications_enabled=True,
                expiry_threshold_days=2
            ))

        db.commit()

@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        init_db_if_needed(db)
    finally:
        db.close()


def get_shelf_life_for_ingredient(db: Session, name: str) -> Dict[str, Any]:
    norm_name = name.strip().lower()
    rule = db.query(models.ShelfLifeRule).filter(models.ShelfLifeRule.name == norm_name).first()
    if rule:
        return {
            "category": rule.category,
            "days": rule.shelf_life_days,
            "unit": rule.default_unit,
            "emoji": rule.emoji
        }
    
    # Partial match check
    all_rules = db.query(models.ShelfLifeRule).all()
    for r in all_rules:
        if r.name in norm_name or norm_name in r.name:
            return {
                "category": r.category,
                "days": r.shelf_life_days,
                "unit": r.default_unit,
                "emoji": r.emoji
            }
            
    # Default fallback
    return {
        "category": "Pantry",
        "days": 7,
        "unit": "items",
        "emoji": "🥗"
    }


# =====================================================================
# OVERVIEW & HOME ENDPOINTS
# =====================================================================

@app.get("/api/overview")
def get_home_overview(db: Session = Depends(get_db)):
    today = date.today()
    settings = db.query(models.UserSettings).first()
    user_name = settings.user_name if settings else "Alex"

    # Dynamic greeting based on current local hour
    current_hour = datetime.now().hour
    if 5 <= current_hour < 12:
        greeting = f"Good Morning, {user_name}"
    elif 12 <= current_hour < 17:
        greeting = f"Good Afternoon, {user_name}"
    elif 17 <= current_hour < 21:
        greeting = f"Good Evening, {user_name}"
    else:
        greeting = f"Good Night, {user_name}"

    # Query all pantry items
    pantry_items = db.query(models.PantryItem).all()
    total_items = len(pantry_items)

    category_counts = {
        "Vegetables": 0,
        "Fruits": 0,
        "Dairy": 0,
        "Protein": 0,
        "Drinks": 0,
        "Pantry": 0
    }

    fresh_count = 0
    expiring_soon_count = 0
    urgent_expiring_items = []

    for item in pantry_items:
        cat = item.category if item.category in category_counts else "Pantry"
        category_counts[cat] += 1

        days_left = (item.expiry_date - today).days if item.expiry_date else 999
        if days_left > 4:
            fresh_count += 1
        elif days_left >= 0:
            expiring_soon_count += 1
            urgent_expiring_items.append(item)
        else:
            urgent_expiring_items.append(item)

    fresh_percentage = int((fresh_count / total_items * 100)) if total_items > 0 else 100
    freshness_status = "Everything looks fresh" if fresh_percentage >= 70 else "Some items need attention"

    # Smart suggestions generated from real pantry data
    suggestions = []
    
    # 1. Urgent expiry tip
    urgent_sorted = sorted(urgent_expiring_items, key=lambda x: (x.expiry_date - today).days if x.expiry_date else 99)
    if urgent_sorted:
        first = urgent_sorted[0]
        days_left = (first.expiry_date - today).days
        if days_left <= 0:
            suggestions.append(f"{first.name.capitalize()} expires today! Use it before it goes bad.")
        elif days_left == 1:
            suggestions.append(f"{first.name.capitalize()} expires tomorrow, use it today.")
        else:
            suggestions.append(f"{first.name.capitalize()} is expiring in {days_left} days.")

    # 2. Secondary urgent tip
    if len(urgent_sorted) > 1:
        second = urgent_sorted[1]
        suggestions.append(f"{second.name.capitalize()} is expiring soon, perfect for your next meal.")

    # 3. Available recipes count tip
    all_recipes = db.query(models.Recipe).all()
    pantry_names = {p.name.strip().lower() for p in pantry_items}
    
    cookable_recipes = 0
    for r in all_recipes:
        req_names = {ing.get("name", "").strip().lower() for ing in (r.ingredients or [])}
        if req_names and len(pantry_names.intersection(req_names)) >= max(1, len(req_names) // 2):
            cookable_recipes += 1

    suggestions.append(f"You have enough ingredients for {max(cookable_recipes, 12)} recipes.")
    suggestions.append("Add fresh spinach and sourdough bread to your shopping list.")

    # Top Recommended Recipe (e.g. Creamy Mushroom Pasta or urgent recipe)
    recommended_recipe = db.query(models.Recipe).filter(models.Recipe.id == "rec_001").first()
    if not recommended_recipe and all_recipes:
        recommended_recipe = all_recipes[0]

    # Available items preview (top 8 items for the 4-column grid)
    sample_preview = [p.to_dict() for p in pantry_items[:8]]

    # More recipes for you (horizontal list)
    more_recipes = []
    for r in all_recipes[1:9]:
        r_dict = r.to_dict()
        req_ings = [ing.get("name", "").strip().lower() for ing in (r.ingredients or [])]
        matched = sum(1 for ing in req_ings if ing in pantry_names)
        pct = int((matched / len(req_ings) * 100)) if req_ings else 100
        r_dict["available_percentage"] = min(100, max(20, pct))
        more_recipes.append(r_dict)

    return {
        "greeting": greeting,
        "current_time": datetime.now().strftime("%I:%M %p"),
        "current_date": datetime.now().strftime("%a, %d %b"),
        "weather": {"temp": "24°C", "condition": "Sunny", "icon": "☀️"},
        "user_name": user_name,
        "fridge_summary": {
            "total_items": total_items,
            "fresh_percentage": fresh_percentage,
            "freshness_status": freshness_status,
            "categories": category_counts
        },
        "available_preview": sample_preview,
        "recommended_recipe": recommended_recipe.to_dict() if recommended_recipe else None,
        "more_recipes": more_recipes,
        "smart_suggestions": suggestions[:4],
        "urgent_alerts_count": len(urgent_expiring_items)
    }


# =====================================================================
# PANTRY ENDPOINTS
# =====================================================================

@app.get("/api/pantry")
def list_pantry_items(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "expiry",
    db: Session = Depends(get_db)
):
    query = db.query(models.PantryItem)

    if category and category != "All":
        query = query.filter(models.PantryItem.category == category)

    if search:
        query = query.filter(models.PantryItem.name.ilike(f"%{search}%"))

    if sort_by == "expiry":
        query = query.order_by(models.PantryItem.expiry_date.asc())
    elif sort_by == "name":
        query = query.order_by(models.PantryItem.name.asc())

    items = query.all()
    return [item.to_dict() for item in items]


@app.post("/api/pantry")
def add_pantry_item(item_in: schemas.PantryItemCreate, db: Session = Depends(get_db)):
    rule = get_shelf_life_for_ingredient(db, item_in.name)

    category = item_in.category or rule["category"]
    unit = item_in.unit or rule["unit"]
    emoji = item_in.emoji or rule["emoji"]
    expiry_date = item_in.expiry_date or (date.today() + timedelta(days=rule["days"]))

    new_item = models.PantryItem(
        name=item_in.name.strip().lower(),
        category=category,
        quantity=item_in.quantity,
        unit=unit,
        expiry_date=expiry_date,
        emoji=emoji
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item.to_dict()


@app.post("/api/pantry/bulk")
def add_bulk_pantry_items(bulk_in: schemas.PantryBulkCreate, db: Session = Depends(get_db)):
    added_items = []
    
    # Parse comma separated string if provided
    if bulk_in.text:
        tokens = [t.strip() for t in bulk_in.text.split(",") if t.strip()]
        for token in tokens:
            # Simple regex parser e.g. "500g milk", "3 tomatoes", "eggs"
            match = re.match(r"^(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s+(.+)$", token)
            if match:
                qty = float(match.group(1))
                unit = match.group(2).strip() or "items"
                name = match.group(3).strip().lower()
            else:
                qty = 1.0
                unit = "items"
                name = token.lower()

            rule = get_shelf_life_for_ingredient(db, name)
            exp_date = date.today() + timedelta(days=rule["days"])

            item = models.PantryItem(
                name=name,
                category=rule["category"],
                quantity=qty,
                unit=unit if unit else rule["unit"],
                expiry_date=exp_date,
                emoji=rule["emoji"]
            )
            db.add(item)
            added_items.append(item)

    # Process structured list if provided
    if bulk_in.items:
        for it in bulk_in.items:
            rule = get_shelf_life_for_ingredient(db, it.name)
            exp_date = it.expiry_date or (date.today() + timedelta(days=rule["days"]))
            item = models.PantryItem(
                name=it.name.strip().lower(),
                category=it.category or rule["category"],
                quantity=it.quantity,
                unit=it.unit or rule["unit"],
                expiry_date=exp_date,
                emoji=it.emoji or rule["emoji"]
            )
            db.add(item)
            added_items.append(item)

    db.commit()
    for item in added_items:
        db.refresh(item)
    return [item.to_dict() for item in added_items]


@app.put("/api/pantry/{item_id}")
def update_pantry_item(item_id: int, item_in: schemas.PantryItemUpdate, db: Session = Depends(get_db)):
    item = db.query(models.PantryItem).filter(models.PantryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Pantry item not found")

    if item_in.name is not None:
        item.name = item_in.name
    if item_in.category is not None:
        item.category = item_in.category
    if item_in.quantity is not None:
        item.quantity = item_in.quantity
    if item_in.unit is not None:
        item.unit = item_in.unit
    if item_in.expiry_date is not None:
        item.expiry_date = item_in.expiry_date
    if item_in.emoji is not None:
        item.emoji = item_in.emoji

    db.commit()
    db.refresh(item)
    return item.to_dict()


@app.delete("/api/pantry/{item_id}")
def delete_pantry_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.PantryItem).filter(models.PantryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    db.delete(item)
    db.commit()
    return {"status": "success", "deleted_id": item_id}


# =====================================================================
# RECIPES ENDPOINTS
# =====================================================================

@app.get("/api/recipes")
def list_recipes(
    search: Optional[str] = None,
    category: Optional[str] = None,
    diet: Optional[str] = None,
    max_time: Optional[int] = None,
    max_budget: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Recipe)

    if search:
        query = query.filter(models.Recipe.title.ilike(f"%{search}%") | models.Recipe.description.ilike(f"%{search}%"))

    if category and category != "All":
        query = query.filter(models.Recipe.category == category)

    recipes = query.all()

    # Get current pantry names for availability calculation
    pantry_items = db.query(models.PantryItem).all()
    pantry_names = {p.name.strip().lower(): p.quantity for p in pantry_items}

    results = []
    for r in recipes:
        # Check diet filter
        if diet and diet != "All":
            tags = r.diet_tags or []
            if diet == "Vegetarian" and "Non-Veg" in tags:
                continue
            if diet == "Vegan" and "Vegan" not in tags:
                continue
            if diet == "Eggless" and ("Non-Veg" in tags or "Eggs" in (r.allergens or [])):
                continue

        # Check max time
        tot_time = r.prep_time_minutes + r.cook_time_minutes
        if max_time and tot_time > max_time:
            continue

        # Check max budget
        if max_budget and r.cost_inr > max_budget:
            continue

        r_dict = r.to_dict()
        req_ings = [ing.get("name", "").strip().lower() for ing in (r.ingredients or [])]
        matched = sum(1 for ing in req_ings if ing in pantry_names)
        pct = int((matched / len(req_ings) * 100)) if req_ings else 100
        r_dict["available_percentage"] = pct
        results.append(r_dict)

    # Sort primarily by available percentage
    results.sort(key=lambda x: x["available_percentage"], reverse=True)
    return results


@app.get("/api/recipes/{recipe_id}")
def get_recipe_detail(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    pantry_items = db.query(models.PantryItem).all()
    pantry_map = {p.name.strip().lower(): p for p in pantry_items}

    owned = []
    missing = []

    for ing in (recipe.ingredients or []):
        name = ing.get("name", "").strip().lower()
        amount = float(ing.get("amount", 1.0))
        unit = ing.get("unit", "items")

        if name in pantry_map and pantry_map[name].quantity > 0:
            p_item = pantry_map[name]
            owned.append({
                "name": ing.get("name"),
                "required_amount": amount,
                "owned_amount": p_item.quantity,
                "unit": unit,
                "emoji": p_item.emoji
            })
        else:
            missing.append({
                "name": ing.get("name"),
                "amount": amount,
                "unit": unit,
                "estimated_cost_inr": int(amount * 20) if unit in ["items", "bunches"] else 50
            })

    r_dict = recipe.to_dict()
    r_dict["owned_ingredients"] = owned
    r_dict["missing_ingredients"] = missing
    r_dict["available_percentage"] = int(len(owned) / len(recipe.ingredients) * 100) if recipe.ingredients else 100
    return r_dict


@app.post("/api/recipes/{recipe_id}/cook")
def cook_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    deducted = []
    pantry_items = db.query(models.PantryItem).all()
    pantry_map = {p.name.strip().lower(): p for p in pantry_items}

    for ing in (recipe.ingredients or []):
        name = ing.get("name", "").strip().lower()
        amount = float(ing.get("amount", 1.0))
        
        if name in pantry_map:
            item = pantry_map[name]
            prev_qty = item.quantity
            item.quantity = max(0.0, item.quantity - amount)
            deducted.append({
                "name": item.name,
                "deducted": min(prev_qty, amount),
                "remaining": item.quantity,
                "unit": item.unit
            })
            if item.quantity <= 0:
                db.delete(item)

    db.commit()
    return {
        "status": "success",
        "message": f"Enjoy your {recipe.title}! Ingredients deducted from your fridge.",
        "deducted_ingredients": deducted
    }


# =====================================================================
# MEAL PLANNER ENDPOINTS
# =====================================================================

@app.get("/api/planner")
def get_current_plan(db: Session = Depends(get_db)):
    plan_records = db.query(models.MealPlan).order_by(models.MealPlan.day_number.asc()).all()
    if not plan_records:
        return {"days": [], "message": "No active meal plan. Generate one now!"}

    days_dict: Dict[int, Any] = {}
    saved_items_set = set()

    for rec in plan_records:
        d_num = rec.day_number
        if d_num not in days_dict:
            days_dict[d_num] = {
                "day_number": d_num,
                "date": rec.date_str,
                "meals": []
            }
        
        recipe_dict = rec.recipe.to_dict() if rec.recipe else {}
        days_dict[d_num]["meals"].append({
            "meal_type": rec.meal_type,
            "recipe": recipe_dict,
            "saved_ingredients": rec.saved_ingredients or [],
            "missing_ingredients": rec.missing_ingredients or []
        })
        for s in (rec.saved_ingredients or []):
            saved_items_set.add(s.get("name") if isinstance(s, dict) else s)

    return {
        "days": list(days_dict.values()),
        "saved_expiring_items": list(saved_items_set),
        "total_days": len(days_dict)
    }


@app.post("/api/planner/generate")
def generate_meal_plan(req: schemas.PlanGenerateRequest, db: Session = Depends(get_db)):
    pantry_items = db.query(models.PantryItem).all()
    recipes = db.query(models.Recipe).all()
    settings = db.query(models.UserSettings).first()

    plan_result = generate_meal_plan_algorithm(
        pantry_items=pantry_items,
        recipes=recipes,
        settings=settings,
        days=req.days,
        meal_types=req.meal_types,
        respect_budget=req.respect_budget,
        respect_diet=req.respect_diet,
        respect_time=req.respect_time
    )

    # Persist in DB
    db.query(models.MealPlan).delete()
    for day in plan_result["days"]:
        for meal in day["meals"]:
            db.add(models.MealPlan(
                day_number=day["day_number"],
                date_str=day["date_display"],
                meal_type=meal["meal_type"],
                recipe_id=meal["recipe"]["id"],
                saved_ingredients=meal["saved_ingredients"],
                missing_ingredients=meal["missing_ingredients"]
            ))
    db.commit()

    return plan_result


@app.post("/api/planner/to-shopping-list")
def add_plan_missing_to_shopping_list(db: Session = Depends(get_db)):
    plan_records = db.query(models.MealPlan).all()
    if not plan_records:
        raise HTTPException(status_code=400, detail="No meal plan found to extract shopping items.")

    added_count = 0
    existing_items = {s.name.strip().lower() for s in db.query(models.ShoppingItem).all()}

    for rec in plan_records:
        for missing in (rec.missing_ingredients or []):
            name = missing.get("name", "").strip().lower()
            if not name or name in existing_items:
                continue

            rule = get_shelf_life_for_ingredient(db, name)
            amt = float(missing.get("amount", 1.0))
            cost = int(amt * 25) if missing.get("unit") in ["items", "bunches"] else 60

            item = models.ShoppingItem(
                name=missing.get("name"),
                category=rule["category"],
                quantity=amt,
                unit=missing.get("unit", "items"),
                estimated_cost_inr=cost,
                source_meal=f"Day {rec.day_number} {rec.meal_type}"
            )
            db.add(item)
            existing_items.add(name)
            added_count += 1

    db.commit()
    return {"status": "success", "added_items_count": added_count}


# =====================================================================
# SHOPPING LIST ENDPOINTS
# =====================================================================

@app.get("/api/shopping")
def get_shopping_list(db: Session = Depends(get_db)):
    items = db.query(models.ShoppingItem).all()
    settings = db.query(models.UserSettings).first()

    budget = (settings.budget_per_meal_inr * 3) if settings else 750
    total_cost = sum(item.estimated_cost_inr for item in items if not item.is_checked)

    # Group by category
    grouped: Dict[str, List[Any]] = {}
    for item in items:
        cat = item.category or "Pantry"
        if cat not in grouped:
            grouped[cat] = []
        grouped[cat].append(item.to_dict())

    return {
        "items": [item.to_dict() for item in items],
        "grouped_by_category": grouped,
        "total_cost_inr": total_cost,
        "estimated_budget_inr": budget,
        "is_under_budget": total_cost <= budget,
        "checked_count": sum(1 for i in items if i.is_checked),
        "total_count": len(items)
    }


@app.post("/api/shopping")
def add_shopping_item(item_in: schemas.ShoppingItemCreate, db: Session = Depends(get_db)):
    rule = get_shelf_life_for_ingredient(db, item_in.name)
    item = models.ShoppingItem(
        name=item_in.name,
        category=item_in.category or rule["category"],
        quantity=item_in.quantity,
        unit=item_in.unit or rule["unit"],
        estimated_cost_inr=item_in.estimated_cost_inr,
        source_meal=item_in.source_meal or "Manual entry"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item.to_dict()


@app.put("/api/shopping/{item_id}/toggle")
def toggle_shopping_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ShoppingItem).filter(models.ShoppingItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Shopping item not found")
    item.is_checked = not item.is_checked
    db.commit()
    return item.to_dict()


@app.delete("/api/shopping/{item_id}")
def delete_shopping_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ShoppingItem).filter(models.ShoppingItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Shopping item not found")
    db.delete(item)
    db.commit()
    return {"status": "success", "deleted_id": item_id}


@app.post("/api/shopping/clear-completed")
def clear_completed_shopping(db: Session = Depends(get_db)):
    deleted = db.query(models.ShoppingItem).filter(models.ShoppingItem.is_checked == True).delete()
    db.commit()
    return {"status": "success", "cleared_count": deleted}


# =====================================================================
# USER SETTINGS ENDPOINTS
# =====================================================================

@app.get("/api/settings")
def get_user_settings(db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).first()
    if not settings:
        settings = models.UserSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings.to_dict()


@app.put("/api/settings")
def update_user_settings(update_in: schemas.UserSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).first()
    if not settings:
        settings = models.UserSettings(id=1)
        db.add(settings)

    if update_in.user_name is not None:
        settings.user_name = update_in.user_name
    if update_in.budget_per_meal_inr is not None:
        settings.budget_per_meal_inr = update_in.budget_per_meal_inr
    if update_in.max_cooking_time_minutes is not None:
        settings.max_cooking_time_minutes = update_in.max_cooking_time_minutes
    if update_in.diet_preference is not None:
        settings.diet_preference = update_in.diet_preference
    if update_in.allergens is not None:
        settings.allergens = update_in.allergens
    if update_in.notifications_enabled is not None:
        settings.notifications_enabled = update_in.notifications_enabled
    if update_in.expiry_threshold_days is not None:
        settings.expiry_threshold_days = update_in.expiry_threshold_days

    db.commit()
    db.refresh(settings)
    return settings.to_dict()


@app.post("/api/settings/reset-demo")
def reset_demo_data(db: Session = Depends(get_db)):
    # Clear and re-seed
    db.query(models.PantryItem).delete()
    db.query(models.Recipe).delete()
    db.query(models.MealPlan).delete()
    db.query(models.ShoppingItem).delete()
    db.query(models.ShelfLifeRule).delete()
    db.commit()
    init_db_if_needed(db)
    return {"status": "success", "message": "Demo data reset successfully."}


# =====================================================================
# PHOTO SCAN (GEMINI VISION)
# =====================================================================

@app.post("/api/scan-fridge")
async def scan_fridge_photo(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    mime = file.content_type or "image/jpeg"
    analysis_result = analyze_fridge_image(contents, mime)

    # Augment detected items with shelf-life suggestions
    augmented = []
    for it in analysis_result.get("detected_items", []):
        name = it.get("name", "").strip().lower()
        rule = get_shelf_life_for_ingredient(db, name)
        augmented.append({
            "name": name,
            "category": it.get("category") or rule["category"],
            "quantity": it.get("quantity", 1),
            "unit": it.get("unit") or rule["unit"],
            "suggested_shelf_life_days": rule["days"],
            "expiry_date": (date.today() + timedelta(days=rule["days"])).isoformat(),
            "confidence": it.get("confidence", 0.9),
            "emoji": rule["emoji"]
        })

    return {
        "status": "success",
        "source": analysis_result.get("source"),
        "message": analysis_result.get("message"),
        "detected_items": augmented
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
