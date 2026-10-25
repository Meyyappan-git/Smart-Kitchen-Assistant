import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles } from 'lucide-react';
import MascotChef from './MascotChef';

export default function CookSuccessModal({ 
  recipe, 
  deducted = [], 
  onClose,
  onViewFridge 
}) {
  useEffect(() => {
    // Trigger festive celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-xl overflow-hidden border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot */}
        <div className="relative flex justify-center mb-3">
          <MascotChef variant="suggestions" size={64} />
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[11px] font-medium mb-2">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Cooked & Saved from Waste</span>
        </div>

        <h3 className="text-base font-bold text-stone-900 leading-snug">
          Bon Appétit!
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4 font-normal">
          Enjoy cooking <span className="font-semibold text-stone-800">{recipe?.title}</span>. Ingredients were automatically deducted from your inventory.
        </p>

        {/* Deducted items breakdown */}
        {deducted.length > 0 && (
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60 text-left mb-4 max-h-36 overflow-y-auto">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Deducted from Pantry:
            </p>
            <div className="space-y-1">
              {deducted.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-stone-700">
                  <span className="font-medium capitalize">{item.name}</span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    -{item.deducted} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={onViewFridge}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            View Updated Inventory
          </button>
          <button
            onClick={onClose}
            className="w-full py-1.5 text-stone-400 hover:text-stone-700 text-xs font-normal cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

