import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Bell, Shield, Heart, DollarSign, Clock, Check } from 'lucide-react';
import MascotChef from '../components/MascotChef';
import { api } from '../services/api';

export default function SettingsScreen({ onSettingsUpdated }) {
  const [userName, setUserName] = useState('Alex');
  const [budget, setBudget] = useState(250);
  const [maxTime, setMaxTime] = useState(45);
  const [diet, setDiet] = useState('All');
  const [allergens, setAllergens] = useState([]);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) {
        setUserName(s.user_name || 'Alex');
        setBudget(s.budget_per_meal_inr || 250);
        setMaxTime(s.max_cooking_time_minutes || 45);
        setDiet(s.diet_preference || 'All');
        setAllergens(s.allergens || []);
        setNotifications(s.notifications_enabled ?? true);
      }
    }).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        user_name: userName,
        budget_per_meal_inr: budget,
        max_cooking_time_minutes: maxTime,
        diet_preference: diet,
        allergens: allergens,
        notifications_enabled: notifications
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      if (onSettingsUpdated) onSettingsUpdated();
    } catch (err) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm("Reset all pantry items and recipes to the initial full demo dataset?")) return;
    setResetting(true);
    try {
      await api.resetDemoData();
      alert("Demo data successfully refreshed!");
      if (onSettingsUpdated) onSettingsUpdated();
    } catch (err) {
      alert("Error resetting data: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  const dietOptions = ['All', 'Vegetarian', 'Vegan', 'Eggless', 'Non-Veg'];
  const allergenOptions = ['Dairy', 'Nuts', 'Gluten', 'Eggs', 'Soy', 'Fish', 'Shellfish'];

  const toggleAllergen = (item) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter(a => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Assistant Preferences
        </h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">
          Customize recipe suggestions, budgets, and dietary restrictions
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs flex items-center gap-3.5 md:col-span-2">
          <MascotChef variant="avatar" size={44} />
          <div className="flex-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Kitchen Profile Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-sm font-bold text-stone-900 bg-transparent border-b border-stone-200 focus:border-stone-900 focus:outline-none w-full py-0.5"
            />
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs space-y-3">
          <label className="block text-xs font-semibold text-stone-900 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Dietary Preference</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dietOptions.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setDiet(opt)}
                className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  diet === opt
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 border border-stone-200/70 hover:border-stone-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Per Meal Slider */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target Budget Per Meal</span>
            </label>
            <span className="text-sm font-bold text-stone-900">
              ₹{budget}
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="600"
            step="10"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-normal">
            <span>₹80 (Budget)</span>
            <span>₹300 (Average)</span>
            <span>₹600 (Gourmet)</span>
          </div>
        </div>

        {/* Max Cooking Time Slider */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Max Cooking Time</span>
            </label>
            <span className="text-sm font-bold text-stone-900">
              {maxTime} mins
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={maxTime}
            onChange={(e) => setMaxTime(parseInt(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-normal">
            <span>15m (Quick)</span>
            <span>45m (Standard)</span>
            <span>90m (Slow cooked)</span>
          </div>
        </div>

        {/* Allergen Avoidance */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs space-y-3">
          <label className="block text-xs font-semibold text-stone-900 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Allergen Avoidance</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {allergenOptions.map((item) => {
              const selected = allergens.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleAllergen(item)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-stone-50 text-stone-600 border border-stone-200/70 hover:border-stone-300'
                  }`}
                >
                  {selected ? `✕ ${item}` : item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expiry Notifications Toggle */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/70 shadow-2xs flex items-center justify-between md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900">
                Expiry Alerts
              </h4>
              <p className="text-[10px] text-stone-400 font-normal">
                Notify when items have ≤ 2 days left
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 accent-stone-900 cursor-pointer"
          />
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer md:col-span-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Preferences Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
            </>
          )}
        </button>

        {/* Reset Demo Data Button */}
        <div className="pt-1 text-center md:col-span-2">
          <button
            type="button"
            onClick={handleResetDemo}
            disabled={resetting}
            className="text-xs font-normal text-stone-400 hover:text-rose-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetting ? 'Resetting Demo Data...' : 'Reset to Sample Demo Data'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

