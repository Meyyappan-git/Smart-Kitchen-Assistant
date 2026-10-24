from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class PantryItem(Base):
    __tablename__ = "pantry_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), default="Pantry", index=True)
    quantity = Column(Float, default=1.0)
    unit = Column(String(20), default="items")
    expiry_date = Column(Date, nullable=False, index=True)
    emoji = Column(String(10), default="🥗")
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        today = date.today()
        days_left = (self.expiry_date - today).days if self.expiry_date else 999
        if days_left < 0:
            status = "Expired"
            status_color = "red"
        elif days_left <= 2:
            status = f"Expiring in {days_left} day{'s' if days_left != 1 else ''}" if days_left > 0 else "Expires today"
            status_color = "red"
        elif days_left <= 4:
            status = "Expiring soon"
            status_color = "orange"
        else:
            status = "Fresh"
            status_color = "green"

        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "quantity": self.quantity,
            "unit": self.unit,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "days_left": days_left,
            "status": status,
            "status_color": status_color,
            "emoji": self.emoji,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)
    cuisine = Column(String(50), default="International")
    category = Column(String(50), default="Dinner")  # Breakfast, Lunch, Dinner, Snack, Drinks
    prep_time_minutes = Column(Integer, default=15)
    cook_time_minutes = Column(Integer, default=20)
    difficulty = Column(String(20), default="Easy")  # Easy, Medium, Hard
    calories = Column(Integer, default=350)
    cost_inr = Column(Integer, default=150)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=50)
    diet_tags = Column(JSON, default=list)  # ["Vegetarian", "Vegan", "Eggless", "Non-Veg", "Quick", "High-Protein"]
    allergens = Column(JSON, default=list)  # ["Dairy", "Gluten", "Eggs", "Nuts", "Soy", "Fish"]
    image_url = Column(String(500), nullable=True)
    ingredients = Column(JSON, default=list)  # list of {name, amount, unit}
    steps = Column(JSON, default=list)  # list of strings
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "cuisine": self.cuisine,
            "category": self.category,
            "prep_time_minutes": self.prep_time_minutes,
            "cook_time_minutes": self.cook_time_minutes,
            "total_time_minutes": self.prep_time_minutes + self.cook_time_minutes,
            "difficulty": self.difficulty,
            "calories": self.calories,
            "cost_inr": self.cost_inr,
            "rating": self.rating,
            "reviews_count": self.reviews_count,
            "diet_tags": self.diet_tags or [],
            "allergens": self.allergens or [],
            "image_url": self.image_url,
            "ingredients": self.ingredients or [],
            "steps": self.steps or []
        }


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, nullable=False)  # 1 to N
    date_str = Column(String(20), nullable=False)
    meal_type = Column(String(20), nullable=False)  # Breakfast, Lunch, Dinner
    recipe_id = Column(String(50), ForeignKey("recipes.id"), nullable=False)
    saved_ingredients = Column(JSON, default=list)  # list of ingredient names rescued
    missing_ingredients = Column(JSON, default=list)  # list of {name, amount, unit} needed
    created_at = Column(DateTime, default=datetime.utcnow)

    recipe = relationship("Recipe")


class ShoppingItem(Base):
    __tablename__ = "shopping_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="Pantry")
    quantity = Column(Float, default=1.0)
    unit = Column(String(20), default="items")
    estimated_cost_inr = Column(Integer, default=50)
    is_checked = Column(Boolean, default=False)
    source_meal = Column(String(100), nullable=True)  # e.g. "Plan Day 1 Dinner"
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "quantity": self.quantity,
            "unit": self.unit,
            "estimated_cost_inr": self.estimated_cost_inr,
            "is_checked": self.is_checked,
            "source_meal": self.source_meal,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, default=1)
    user_name = Column(String(50), default="Alex")
    budget_per_meal_inr = Column(Integer, default=250)
    max_cooking_time_minutes = Column(Integer, default=45)
    diet_preference = Column(String(50), default="All")  # "All", "Vegetarian", "Vegan", "Eggless", "Non-Veg"
    allergens = Column(JSON, default=list)  # avoid list e.g. ["Nuts"]
    notifications_enabled = Column(Boolean, default=True)
    expiry_threshold_days = Column(Integer, default=2)

    def to_dict(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "budget_per_meal_inr": self.budget_per_meal_inr,
            "max_cooking_time_minutes": self.max_cooking_time_minutes,
            "diet_preference": self.diet_preference,
            "allergens": self.allergens or [],
            "notifications_enabled": self.notifications_enabled,
            "expiry_threshold_days": self.expiry_threshold_days
        }


class ShelfLifeRule(Base):
    __tablename__ = "shelf_life_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    category = Column(String(50), default="Pantry")
    shelf_life_days = Column(Integer, default=7)
    default_unit = Column(String(20), default="items")
    emoji = Column(String(10), default="🥗")
