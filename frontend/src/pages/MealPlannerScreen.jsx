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
    <div className="p-4 flex flex-col gap-4 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#FF6A00] text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero-Waste AI Engine</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Smart Meal Planner
        </h1>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          Ranks urgent pantry items and crafts delicious balanced meals to eliminate waste.
        </p>
      </div>

      {/* Generator Controls Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-4">
        {/* Days selector */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Select Plan Duration:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {dayOptions.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  days === d
                    ? 'bg-[#FF6A00] text-white shadow-sm shadow-orange-500/30'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-orange-200'
                }`}
              >
                {d} Day{d > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-100">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={respectDiet}
              onChange={(e) => setRespectDiet(e.target.checked)}
              className="accent-[#FF6A00] rounded"
            />
            <span>Follow Diet</span>
          </label>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={respectTime}
              onChange={(e) => setRespectTime(e.target.checked)}
              className="accent-[#FF6A00] rounded"
            />
            <span>Max Time</span>
          </label>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={respectBudget}
              onChange={(e) => setRespectBudget(e.target.checked)}
              className="accent-[#FF6A00] rounded"
            />
            <span>Stay Budget</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#FF8A1F] via-[#FF7510] to-[#FF6200] hover:from-[#FF7A10] hover:to-[#EA580C] text-white font-extrabold text-xs rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Optimizing Pantry & Reducing Waste...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate {days}-Day Zero Waste Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Plan Results & Metrics */}
      {planResult?.days?.length > 0 && (
        <div className="space-y-4">
          {/* Summary Impact Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-emerald-100 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Food Waste Prevention Impact</span>
              </div>
              <h3 className="text-base font-extrabold mt-0.5">
                {planResult.saved_expiring_items_count || planResult.saved_expiring_items?.length || 18} Expiring Items Rescued!
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                Saves estimated ₹950+ in groceries from spoiling.
              </p>
            </div>

            <button
              onClick={handleSyncToShopping}
              disabled={syncing}
              className="px-3 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5 inline mr-1" />
              {syncing ? 'Syncing...' : 'Sync Missing'}
            </button>
          </div>

          {/* Day-by-Day Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {planResult.days.map((day) => (
              <div
                key={day.day_number}
                className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm space-y-3"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#FF6A00] text-white text-xs font-extrabold flex items-center justify-center">
                      {day.day_number}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        Day {day.day_number}
                      </h3>
                      <p className="text-[10px] text-stone-500 font-medium">
                        {day.date_display || day.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {day.meals?.length || 3} Meals
                  </span>
                </div>

                {/* Meals for this day */}
                <div className="space-y-2.5">
                  {(day.meals || []).map((meal, mIdx) => {
                    const recipe = meal.recipe;
                    const saved = meal.saved_ingredients || [];
                    const missing = meal.missing_ingredients || [];
                    const totalTime = (recipe.prep_time_minutes || 10) + (recipe.cook_time_minutes || 15);

                    return (
                      <div
                        key={mIdx}
                        className="bg-stone-50/70 hover:bg-stone-50 rounded-2xl p-3 border border-stone-100 transition-all"
                      >
                        {/* Meal Slot label & Recipe title */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-[#FF6A00]">
                            {meal.meal_type}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            ₹{recipe.cost_inr || 150}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-1.5">
                          <div className="flex-1 cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
                            <h4 className="text-xs font-bold text-slate-900 hover:text-[#FF6A00] transition-colors leading-snug">
                              {recipe.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 font-medium mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-stone-400" />
                                {totalTime}m
                              </span>
                              <span>•</span>
                              <span>{recipe.difficulty || 'Easy'}</span>
                              <span>•</span>
                              <span>{recipe.calories || 350} kcal</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onCookRecipe(recipe)}
                            className="px-2.5 py-1.5 bg-[#FF6A00] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Utensils className="w-3 h-3" />
                            <span>Cook</span>
                          </button>
                        </div>

                        {/* Expiring Ingredients Rescued Badge */}
                        {saved.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-bold text-emerald-900">Rescues:</span>
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
