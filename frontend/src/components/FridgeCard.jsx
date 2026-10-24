import React from 'react';
import FridgeIllustration from './FridgeIllustration';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function FridgeCard({ 
  fridgeSummary = {},
  onViewAllPantry,
  onSelectCategory
}) {
  const totalItems = fridgeSummary.total_items ?? 37;
  const freshPercentage = fridgeSummary.fresh_percentage ?? 80;
  const freshnessStatus = fridgeSummary.freshness_status ?? 'Everything looks fresh';
  const categories = fridgeSummary.categories || {
    Vegetables: 15,
    Fruits: 6,
    Dairy: 5,
    Protein: 4,
    Drinks: 3
  };

  const categoryChips = [
    { label: 'Veg', name: 'Vegetables', count: categories.Vegetables || 0, icon: '🥦' },
    { label: 'Fruits', name: 'Fruits', count: categories.Fruits || 0, icon: '🍎' },
    { label: 'Dairy', name: 'Dairy', count: categories.Dairy || 0, icon: '🥛' },
    { label: 'Protein', name: 'Protein', count: categories.Protein || 0, icon: '🍗' },
    { label: 'Drinks', name: 'Drinks', count: categories.Drinks || 0, icon: '🧃' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-stone-100/80 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        {/* Left Column: Data & Metrics */}
        <div className="flex-1 pr-2">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              My Fridge
            </h2>
            <button 
              onClick={onViewAllPantry}
              className="text-xs font-semibold text-[#FF6A00] hover:text-[#FF8A1F] flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Total available items count */}
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#FF6A00] tracking-tight">
              {totalItems}
            </span>
            <span className="text-sm font-semibold text-slate-600">
              Fresh Items Available
            </span>
          </div>

          {/* Category counts row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {categoryChips.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-stone-50 hover:bg-orange-50 border border-stone-100 hover:border-orange-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span>{cat.icon}</span>
                <span className="font-semibold text-slate-900">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Freshness progress bar */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {freshPercentage}% Fresh
              </span>
              <span className="text-slate-500 text-[11px] font-medium">
                {freshnessStatus}
              </span>
            </div>

            {/* Progress track */}
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, Math.max(10, freshPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cute Fridge Illustration */}
        <div className="shrink-0 flex items-center justify-center pl-1">
          <FridgeIllustration width={98} height={122} />
        </div>
      </div>
    </div>
  );
}
