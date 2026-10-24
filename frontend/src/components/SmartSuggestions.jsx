import React from 'react';
import MascotChef from './MascotChef';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

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
    <div className="w-full bg-gradient-to-br from-[#FFF9F3] to-[#FFF0E2] rounded-3xl p-5 border border-orange-200/80 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3.5">
        {/* Left: Mascot Chef */}
        <div className="shrink-0 flex items-center justify-center pt-1">
          <MascotChef variant="suggestions" size={72} />
        </div>

        {/* Right: Smart Suggestions list */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="p-1 rounded-md bg-[#FF6A00] text-white">
              <Sparkles className="w-3 h-3" />
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Chef Robot's Smart Suggestions
            </h3>
          </div>

          <div className="space-y-1.5">
            {tipsList.slice(0, 4).map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] mt-1.5 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* Quick CTA */}
          <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center justify-between">
            <button
              onClick={onOpenPlanner}
              className="text-xs font-bold text-[#FF6A00] hover:text-[#EA580C] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Rescue Expiring Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenShopping}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              View Shopping List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
