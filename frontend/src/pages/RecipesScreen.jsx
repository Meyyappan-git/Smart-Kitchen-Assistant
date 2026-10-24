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
    <div className="p-4 flex flex-col gap-4 pb-12">
      {/* Screen Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Smart Recipe Catalog
        </h1>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          Sorted by ingredients currently in your fridge
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="flex items-center bg-white rounded-2xl border border-stone-200 shadow-xs px-3.5 py-2.5 focus-within:border-[#FF6A00]">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes, ingredients, cuisines..."
            className="w-full text-xs text-slate-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="text-xs font-bold text-[#FF6A00] ml-2 px-2 py-0.5 rounded-lg hover:bg-orange-50 cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Chips Horizontal Groups */}
      <div className="space-y-2">
        {/* Diet Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold uppercase text-stone-400 mr-1 shrink-0">Diet:</span>
          {dietChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setDiet(chip)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                diet === chip
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-200'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Meal Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold uppercase text-stone-400 mr-1 shrink-0">Meal:</span>
          {categoryChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setCategory(chip)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                category === chip
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-slate-300'
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
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'bg-stone-50 text-stone-600 border border-stone-200'
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
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                  : 'bg-stone-50 text-stone-600 border border-stone-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Cards List / Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-100 p-6">
          <Utensils className="w-10 h-10 mx-auto text-stone-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No matching recipes found</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">Try relaxing your diet, budget, or cooking time filters.</p>
          <button
            onClick={() => {
              setDiet('All');
              setCategory('All');
              setMaxTime(null);
              setMaxBudget(null);
              setSearch('');
            }}
            className="px-4 py-2 bg-[#FF6A00] text-white rounded-xl text-xs font-bold cursor-pointer"
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
                className="bg-white rounded-2xl p-3 border border-stone-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3.5 group"
              >
                {/* Food Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={imgUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  {/* % Available Badge */}
                  <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white shadow-xs ${
                    availablePct >= 75 ? 'bg-emerald-600' : availablePct >= 40 ? 'bg-amber-600' : 'bg-slate-700'
                  }`}>
                    {availablePct}%
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold mb-0.5">
                      <span className="uppercase text-[10px] text-[#FF6A00] font-bold">{recipe.cuisine}</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {recipe.rating || 4.8}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#FF6A00] transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>

                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-50 mt-1">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {totalTime}m
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-800">
                        ₹{recipe.cost_inr}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCookRecipe(recipe);
                      }}
                      className="px-2.5 py-1 bg-orange-50 hover:bg-[#FF6A00] text-[#FF6A00] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 border border-orange-200"
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
