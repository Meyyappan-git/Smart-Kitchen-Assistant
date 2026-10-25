import React from 'react';
import FridgeIllustration from './FridgeIllustration';
import { ChevronRight } from 'lucide-react';

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
    <div className="w-full bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs transition-all hover:border-stone-300">
      <div className="flex items-start justify-between">
        {/* Left Column: Data & Metrics */}
        <div className="flex-1 pr-2">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Pantry & Fridge
            </h2>
            <button 
              onClick={onViewAllPantry}
              className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Total available items count */}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {totalItems}
            </span>
            <span className="text-xs font-normal text-stone-500">
              items in stock
            </span>
          </div>

          {/* Category counts row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {categoryChips.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-lg text-xs font-medium text-stone-700 transition-colors cursor-pointer"
              >
                <span>{cat.icon}</span>
                <span className="font-semibold text-stone-900">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Freshness progress bar */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {freshPercentage}% Fresh
              </span>
              <span className="text-stone-400 text-[11px] font-normal">
                {freshnessStatus}
              </span>
            </div>

            {/* Progress track */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(10, freshPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Fridge Illustration */}
        <div className="shrink-0 flex items-center justify-center pl-2">
          <FridgeIllustration width={88} height={110} />
        </div>
      </div>
    </div>
  );
}

