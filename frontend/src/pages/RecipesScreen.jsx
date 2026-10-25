import React, { useState, useEffect } from 'react';
import { Search, Clock, Flame, ChefHat, Filter, Star, Sparkles, Utensils } from 'lucide-react';
import { api } from '../services/api';

export default function RecipesScreen({ 
  onSelectRecipe, 
  onCookRecipe 
}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [diet, setDiet] = useState('All');
  const [category, setCategory] = useState('All');
  const [maxTime, setMaxTime] = useState(null);
  const [maxBudget, setMaxBudget] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await api.getRecipes({
        search,
        diet,
        category,
        max_time: maxTime,
        max_budget: maxBudget
      });
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [diet, category, maxTime, maxBudget]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const dietChips = ['All', 'Vegetarian', 'Vegan', 'Eggless', 'Non-Veg'];
  const categoryChips = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const timeChips = [
    { label: 'Any time', value: null },
    { label: '≤ 15m', value: 15 },
    { label: '≤ 25m', value: 25 },
    { label: '≤ 40m', value: 40 },
  ];
  const budgetChips = [
    { label: 'Any cost', value: null },
    { label: 'Under ₹120', value: 120 },
    { label: 'Under ₹200', value: 200 },
  ];

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Screen Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Recipe Catalog
        </h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">
          Sorted by ingredients currently in your fridge
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="flex items-center bg-white rounded-xl border border-stone-200/70 shadow-2xs px-3.5 py-2.5 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200/60">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes, ingredients, cuisines..."
            className="w-full text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="text-xs font-medium text-stone-700 ml-2 px-2.5 py-1 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Chips Horizontal Groups */}
      <div className="space-y-2">
        {/* Diet Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-semibold uppercase text-stone-400 mr-1 shrink-0">Diet:</span>
          {dietChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setDiet(chip)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                diet === chip
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200/70 hover:border-stone-300'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Meal Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-semibold uppercase text-stone-400 mr-1 shrink-0">Meal:</span>
          {categoryChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setCategory(chip)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                category === chip
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200/70 hover:border-stone-300'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Time & Budget Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {timeChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => setMaxTime(chip.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                maxTime === chip.value
                  ? 'bg-stone-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200/70'
              }`}
            >
              {chip.label}
            </button>
          ))}

          {budgetChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => setMaxBudget(chip.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                maxBudget === chip.value
                  ? 'bg-stone-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200/70'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Cards List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-32 bg-white rounded-xl animate-pulse border border-stone-200/60" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/70 p-6">
          <Utensils className="w-10 h-10 mx-auto text-stone-300 mb-2" />
          <h3 className="text-sm font-semibold text-stone-800">No matching recipes found</h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">Try relaxing your diet, budget, or cooking time filters.</p>
          <button
            onClick={() => {
              setDiet('All');
              setCategory('All');
              setMaxTime(null);
              setMaxBudget(null);
              setSearch('');
            }}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => {
            const totalTime = (recipe.prep_time_minutes || 10) + (recipe.cook_time_minutes || 15);
            const availablePct = recipe.available_percentage ?? 100;
            const imgUrl = recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

            return (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="bg-white rounded-xl p-3 border border-stone-200/70 shadow-2xs hover:border-stone-300 transition-all cursor-pointer flex gap-3.5 group"
              >
                {/* Food Image */}
                <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={imgUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  {/* % Available Badge */}
                  <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-white shadow-2xs ${
                    availablePct >= 75 ? 'bg-emerald-600/90' : availablePct >= 40 ? 'bg-amber-600/90' : 'bg-stone-700/90'
                  }`}>
                    {availablePct}% ready
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mb-0.5">
                      <span className="uppercase text-[10px] text-orange-600 font-semibold">{recipe.cuisine}</span>
                      <span className="flex items-center gap-1 text-stone-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {recipe.rating || 4.8}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>

                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-1">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-normal">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {totalTime}m
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-stone-800">
                        ₹{recipe.cost_inr}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCookRecipe(recipe);
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95"
                    >
                      Cook Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

