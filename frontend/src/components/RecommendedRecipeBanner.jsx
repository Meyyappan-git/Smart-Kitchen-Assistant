import React from 'react';
import { Star, Clock, Flame, ChefHat, Sparkles, AlertCircle } from 'lucide-react';

export default function RecommendedRecipeBanner({ 
  recipe, 
  onCookNow, 
  onViewRecipe 
}) {
  if (!recipe) return null;

  const totalTime = (recipe.prep_time_minutes || 10) + (recipe.cook_time_minutes || 15);
  const imageUrl = recipe.image_url || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="relative w-full bg-gradient-to-br from-[#FF8A1F] via-[#FF7510] to-[#FF6200] text-white rounded-3xl p-5 shadow-lg overflow-hidden border border-orange-400/30">
      {/* Decorative ambient radial glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/10 rounded-full blur-xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="relative flex items-center justify-between mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase border border-white/25">
          <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
          <span>AI Recommended Recipe</span>
        </div>

        {/* Cost chip */}
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/20 text-white border border-white/10">
          ₹{recipe.cost_inr || 220}
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-3">
        {/* Left Information Content */}
        <div className="flex-1">
          <h3 className="text-xl font-extrabold tracking-tight leading-snug drop-shadow-sm">
            {recipe.title || "Creamy Mushroom Pasta"}
          </h3>

          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold text-orange-50">
            {/* Star Rating */}
            <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Star className="w-3 h-3 text-amber-200 fill-amber-200" />
              <span>{recipe.rating || 4.9}</span>
            </span>

            {/* Time */}
            <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Clock className="w-3 h-3 text-white" />
              <span>{totalTime}m</span>
            </span>

            {/* Difficulty */}
            <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <ChefHat className="w-3 h-3 text-white" />
              <span>{recipe.difficulty || "Easy"}</span>
            </span>

            {/* Calories */}
            <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Flame className="w-3 h-3 text-amber-200" />
              <span>{recipe.calories || 480} kcal</span>
            </span>
          </div>

          {/* Zero-waste highlight line */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-100 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
            <span className="italic">Uses ingredients expiring soon</span>
          </div>

          {/* Buttons: Cook Now & View Recipe */}
          <div className="flex items-center gap-2.5 mt-4">
            <button
              onClick={() => onCookNow && onCookNow(recipe)}
              className="px-4 py-2 bg-white text-[#FF6A00] hover:bg-orange-50 rounded-xl font-bold text-xs shadow-md shadow-orange-900/20 active:scale-95 transition-all cursor-pointer"
            >
              Cook Now
            </button>
            <button
              onClick={() => onViewRecipe && onViewRecipe(recipe)}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl font-semibold text-xs backdrop-blur-sm active:scale-95 transition-all cursor-pointer"
            >
              View Recipe
            </button>
          </div>
        </div>

        {/* Right Food Photo */}
        <div className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white/40 group">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>
      </div>
    </div>
  );
}
