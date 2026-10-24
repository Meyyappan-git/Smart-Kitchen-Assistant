import React from 'react';
import { Clock, ChefHat, ChevronRight } from 'lucide-react';

export default function MoreRecipesRow({ 
  recipes = [], 
  onSeeAll, 
  onSelectRecipe 
}) {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          More Recipes for You
        </h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-semibold text-[#FF6A00] hover:text-[#FF8A1F] flex items-center gap-0.5 cursor-pointer transition-colors"
        >
          <span>See All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontally scrolling row */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 pt-0.5 px-0.5">
        {recipes.map((recipe) => {
          const totalTime = (recipe.prep_time_minutes || 10) + (recipe.cook_time_minutes || 15);
          const availablePct = recipe.available_percentage ?? 100;
          const imgUrl = recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

          return (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe && onSelectRecipe(recipe)}
              className="w-40 shrink-0 bg-white rounded-2xl p-2.5 border border-stone-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Image container with % Available badge */}
              <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 bg-stone-100">
                <img
                  src={imgUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                {/* Green "% Available" badge */}
                <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold rounded-md shadow-xs">
                  {availablePct}% Available
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#FF6A00] transition-colors mb-1">
                {recipe.title}
              </h4>

              {/* Time & Difficulty */}
              <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 pt-1 border-t border-stone-50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {totalTime}m
                </span>
                <span className="flex items-center gap-1">
                  <ChefHat className="w-3 h-3 text-stone-400" />
                  {recipe.difficulty || 'Easy'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
