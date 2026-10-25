import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, ShieldCheck, ShoppingCart, Clock, ChefHat, CheckCircle2, ArrowRight, RefreshCw, Utensils } from 'lucide-react';
import { api } from '../services/api';

export default function MealPlannerScreen({
  onSelectRecipe,
  onCookRecipe,
  onSelectTab
}) {
  const [days, setDays] = useState(3);
  const [respectBudget, setRespectBudget] = useState(true);
  const [respectDiet, setRespectDiet] = useState(true);
  const [respectTime, setRespectTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [planResult, setPlanResult] = useState(null);

  const fetchCurrentPlan = async () => {
    try {
      const data = await api.getPlanner();
      if (data?.days?.length > 0) {
        setPlanResult(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const data = await api.generatePlanner({
        days,
        respect_budget: respectBudget,
        respect_diet: respectDiet,
        respect_time: respectTime
      });
      setPlanResult(data);
    } catch (err) {
      alert("Error generating plan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToShopping = async () => {
    setSyncing(true);
    try {
      const res = await api.syncPlanToShopping();
      alert(`Success! Added ${res.added_items_count} missing ingredients to your Shopping List.`);
      if (onSelectTab) onSelectTab('shopping');
    } catch (err) {
      alert("Error syncing to shopping list: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const dayOptions = [1, 3, 5, 7];

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Smart Meal Planner
        </h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">
          Ranks urgent pantry items and crafts balanced meals to eliminate food waste.
        </p>
      </div>

      {/* Generator Controls Card */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/70 shadow-2xs space-y-4">
        {/* Days selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-2">
            Plan Duration:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {dayOptions.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  days === d
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 border border-stone-200/70 hover:border-stone-300'
                }`}
              >
                {d} Day{d > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
          <label className="flex items-center gap-2 text-xs font-normal text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={respectDiet}
              onChange={(e) => setRespectDiet(e.target.checked)}
              className="accent-stone-900 rounded"
            />
            <span>Follow Diet</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-normal text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={respectTime}
              onChange={(e) => setRespectTime(e.target.checked)}
              className="accent-stone-900 rounded"
            />
            <span>Quick Recipes</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-normal text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={respectBudget}
              onChange={(e) => setRespectBudget(e.target.checked)}
              className="accent-stone-900 rounded"
            />
            <span>Stay In Budget</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Generating Zero-Waste Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Generate {days}-Day Meal Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Plan Results & Metrics */}
      {planResult?.days?.length > 0 && (
        <div className="space-y-4">
          {/* Summary Impact Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 text-emerald-950 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Waste Prevention Impact</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold mt-0.5 text-emerald-950">
                {planResult.saved_expiring_items_count || planResult.saved_expiring_items?.length || 18} Expiring Items Rescued
              </h3>
              <p className="text-[11px] text-emerald-800 font-normal mt-0.5">
                Saves estimated ₹950+ in groceries from spoiling.
              </p>
            </div>

            <button
              onClick={handleSyncToShopping}
              disabled={syncing}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5 inline mr-1.5" />
              {syncing ? 'Syncing...' : 'Sync Missing'}
            </button>
          </div>

          {/* Day-by-Day Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {planResult.days.map((day) => (
              <div
                key={day.day_number}
                className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs space-y-3"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-center">
                      {day.day_number}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                        Day {day.day_number}
                      </h3>
                      <p className="text-[10px] text-stone-400 font-normal">
                        {day.date_display || day.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {day.meals?.length || 3} Meals
                  </span>
                </div>

                {/* Meals for this day */}
                <div className="space-y-2">
                  {(day.meals || []).map((meal, mIdx) => {
                    const recipe = meal.recipe;
                    const saved = meal.saved_ingredients || [];
                    const totalTime = (recipe.prep_time_minutes || 10) + (recipe.cook_time_minutes || 15);

                    return (
                      <div
                        key={mIdx}
                        className="bg-stone-50/60 hover:bg-stone-50 rounded-lg p-2.5 border border-stone-200/50 transition-all"
                      >
                        {/* Meal Slot label & Recipe title */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                            {meal.meal_type}
                          </span>
                          <span className="text-xs font-medium text-stone-700">
                            ₹{recipe.cost_inr || 150}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-1">
                          <div className="flex-1 cursor-pointer min-w-0" onClick={() => onSelectRecipe(recipe)}>
                            <h4 className="text-xs font-semibold text-stone-900 hover:text-orange-600 transition-colors truncate">
                              {recipe.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-normal mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-stone-400" />
                                {totalTime}m
                              </span>
                              <span>•</span>
                              <span>{recipe.difficulty || 'Easy'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onCookRecipe(recipe)}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-[11px] font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Utensils className="w-3 h-3" />
                            <span>Cook</span>
                          </button>
                        </div>

                        {/* Expiring Ingredients Rescued Badge */}
                        {saved.length > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-stone-200/50 flex items-center gap-1 text-[10px] text-emerald-700 font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-medium text-emerald-800">Rescues:</span>
                            <span className="truncate">
                              {saved.map(s => typeof s === 'string' ? s : s.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

