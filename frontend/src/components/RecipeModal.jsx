import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, ChefHat, Star, CheckCircle2, AlertCircle, ShoppingCart, Utensils } from 'lucide-react';
import { api } from '../services/api';

export default function RecipeModal({ 
  recipe, 
  onClose, 
  onCookNow,
  onAddToShopping 
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipe?.id) return;
    let isMounted = true;
    setLoading(true);

    api.getRecipeDetail(recipe.id)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [recipe?.id]);

  if (!recipe) return null;

  const currentRecipe = detail || recipe;
  const totalTime = (currentRecipe.prep_time_minutes || 10) + (currentRecipe.cook_time_minutes || 15);
  const owned = detail?.owned_ingredients || [];
  const missing = detail?.missing_ingredients || [];
  const availablePct = detail?.available_percentage ?? 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-xl max-h-[92vh] flex flex-col border border-stone-200/80">
        {/* Top Image & Header */}
        <div className="relative w-full h-52 shrink-0 bg-stone-900">
          <img
            src={currentRecipe.image_url || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"}
            alt={currentRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Availability badge */}
          <div className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-2xs">
            {availablePct}% Ingredients In Fridge
          </div>

          {/* Title and Rating on top of image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-xl font-bold leading-tight drop-shadow-sm">
              {currentRecipe.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-stone-200">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{currentRecipe.rating || 4.8}</span>
                <span className="text-stone-300">({currentRecipe.reviews_count || 50})</span>
              </span>
              <span>•</span>
              <span className="font-medium text-white">₹{currentRecipe.cost_inr || 150}</span>
              <span>•</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                {currentRecipe.category || 'Dinner'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Metrics Chips */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-2.5">
              <Clock className="w-4 h-4 mx-auto text-stone-500 mb-1" />
              <p className="text-[10px] text-stone-400 font-normal">Total Time</p>
              <p className="text-xs font-semibold text-stone-800">{totalTime} mins</p>
            </div>
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-2.5">
              <ChefHat className="w-4 h-4 mx-auto text-stone-500 mb-1" />
              <p className="text-[10px] text-stone-400 font-normal">Difficulty</p>
              <p className="text-xs font-semibold text-stone-800">{currentRecipe.difficulty || 'Easy'}</p>
            </div>
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-2.5">
              <Flame className="w-4 h-4 mx-auto text-stone-500 mb-1" />
              <p className="text-[10px] text-stone-400 font-normal">Calories</p>
              <p className="text-xs font-semibold text-stone-800">{currentRecipe.calories || 400} kcal</p>
            </div>
          </div>

          {/* Description */}
          {currentRecipe.description && (
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              "{currentRecipe.description}"
            </p>
          )}

          {/* Diet & Allergen tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(currentRecipe.diet_tags || []).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium">
                {tag}
              </span>
            ))}
            {(currentRecipe.allergens || []).map((all, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px] font-medium">
                Contains: {all}
              </span>
            ))}
          </div>

          {/* Ingredients Section: Owned vs Missing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Ingredients Breakdown
              </h3>
              <span className="text-[11px] font-normal text-stone-400">
                {owned.length} in fridge • {missing.length} missing
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Owned in Fridge */}
              {owned.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.emoji || '🥗'}</span>
                    <span className="font-medium text-stone-800 capitalize">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-800 font-normal text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Need {item.required_amount} {item.unit} (Have {item.owned_amount})</span>
                  </div>
                </div>
              ))}

              {/* Missing */}
              {missing.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-medium text-stone-700 capitalize">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[11px] font-normal">Need {item.amount} {item.unit} (~₹{item.estimated_cost_inr || 30})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add missing to shopping list */}
            {missing.length > 0 && (
              <button
                type="button"
                onClick={() => onAddToShopping && onAddToShopping(missing)}
                className="mt-2.5 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium border border-stone-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add {missing.length} Missing Ingredients to Shopping List</span>
              </button>
            )}
          </div>

          {/* Cooking Steps */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
              Instructions
            </h3>
            <div className="space-y-2">
              {(currentRecipe.steps || []).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-700 font-semibold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                    {idx + 1}
                  </span>
                  <p className="flex-1 font-normal pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-100 flex items-center gap-3">
          <button
            onClick={() => onCookNow && onCookNow(currentRecipe)}
            className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl shadow-2xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Utensils className="w-4 h-4" />
            <span>Cook Now (Deduct from Fridge)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

