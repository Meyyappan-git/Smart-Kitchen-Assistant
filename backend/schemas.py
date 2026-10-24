from datetime import date
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class PantryItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    quantity: float = 1.0
    unit: Optional[str] = None
    expiry_date: Optional[date] = None
    emoji: Optional[str] = None

class PantryBulkCreate(BaseModel):
    text: Optional[str] = None  # Comma-separated list e.g. "2 onions, 500ml milk, 4 eggs"
    items: Optional[List[PantryItemCreate]] = None

class PantryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    expiry_date: Optional[date] = None
    emoji: Optional[str] = None

class UserSettingsUpdate(BaseModel):
    user_name: Optional[str] = None
    budget_per_meal_inr: Optional[int] = None
    max_cooking_time_minutes: Optional[int] = None
    diet_preference: Optional[str] = None
    allergens: Optional[List[str]] = None
    notifications_enabled: Optional[bool] = None
    expiry_threshold_days: Optional[int] = None

class PlanGenerateRequest(BaseModel):
    days: int = Field(default=3, ge=1, le=7)
    meal_types: List[str] = Field(default=["Breakfast", "Lunch", "Dinner"])
    respect_budget: bool = True
    respect_diet: bool = True
    respect_time: bool = True

class ShoppingItemCreate(BaseModel):
    name: str
    category: Optional[str] = "Pantry"
    quantity: float = 1.0
    unit: str = "items"
    estimated_cost_inr: int = 50
    source_meal: Optional[str] = None
