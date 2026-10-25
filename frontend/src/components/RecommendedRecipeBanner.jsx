import React from 'react';
import { Star, Clock, Flame, ChefHat, Sparkles } from 'lucide-react';

export default function RecommendedRecipeBanner({ 
  recipe, 
  onCookNow, 
  onViewRecipe 
}) {
  if (!recipe) return null;

  const totalTime = (recipe.prep_time_minutes || 10) + (recipe.cook_time_minutes || 15);
  const imageUrl = recipe.image_url || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs hover:border-stone-300 transition-all flex flex-col justify-between">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[11px] font-medium border border-orange-200/60">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>Recommended for Today</span>
        </div>

        {/* Cost chip */}
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700">
          ₹{recipe.cost_inr || 220}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Left Information Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-snug truncate">
            {recipe.title || "Creamy Mushroom Pasta"}
          </h3>

          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs text-stone-600">
            {/* Star Rating */}
            <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded-md font-medium text-stone-700">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{recipe.rating || 4.9}</span>
            </span>

            {/* Time */}
            <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded-md font-medium text-stone-700">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{totalTime}m</span>
            </span>

            {/* Difficulty */}
            <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded-md font-medium text-stone-700">
              <ChefHat className="w-3 h-3 text-stone-400" />
              <span>{recipe.difficulty || "Easy"}</span>
            </span>

            {/* Calories */}
            <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded-md font-medium text-stone-700">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>{recipe.calories || 480} kcal</span>
            </span>
          </div>

          {/* Zero-waste highlight line */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-stone-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Uses expiring ingredients to reduce waste</span>
          </div>

          {/* Buttons: Cook Now & View Recipe */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => onCookNow && onCookNow(recipe)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium text-xs shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              Cook Now
            </button>
            <button
              onClick={() => onViewRecipe && onViewRecipe(recipe)}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium text-xs active:scale-95 transition-all cursor-pointer"
            >
              View Recipe
            </button>
          </div>
        </div>

        {/* Right Food Photo */}
        <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-2xs border border-stone-200/60 bg-stone-100 group">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>
      </div>
    </div>
  );
}

