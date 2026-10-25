import React from 'react';
import MascotChef from './MascotChef';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SmartSuggestions({ 
  suggestions = [],
  onOpenPlanner,
  onOpenShopping
}) {
  const defaultTips = [
    "Milk expires tomorrow, use it today.",
    "Tomatoes are expiring soon, perfect for a quick pasta.",
    "You have enough ingredients for 14 recipes.",
    "Add fresh spinach to your shopping list."
  ];

  const tipsList = (suggestions && suggestions.length > 0) ? suggestions : defaultTips;

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs hover:border-stone-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-stone-100 text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            </span>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">
              Smart Suggestions
            </h3>
          </div>
          <MascotChef variant="avatar" size={28} />
        </div>

        <div className="space-y-2">
          {tipsList.slice(0, 4).map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick CTA */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <button
          onClick={onOpenPlanner}
          className="font-medium text-stone-900 hover:text-orange-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Use expiring items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenShopping}
          className="font-normal text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
        >
          View list
        </button>
      </div>
    </div>
  );
}

