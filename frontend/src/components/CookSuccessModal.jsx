import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Utensils, X, Sparkles } from 'lucide-react';
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl overflow-hidden border border-orange-100">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot */}
        <div className="relative flex justify-center mb-3">
          <MascotChef variant="suggestions" size={80} />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold mb-2">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Cooked & Saved from Waste!</span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
          Bon Appétit!
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          Enjoy cooking <span className="font-bold text-slate-800">{recipe?.title}</span>. Ingredients were automatically deducted from your fridge.
        </p>

        {/* Deducted items breakdown */}
        {deducted.length > 0 && (
          <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-left mb-4 max-h-36 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Deducted from Pantry:
            </p>
            <div className="space-y-1">
              {deducted.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium capitalize">{item.name}</span>
                  <span className="text-[11px] text-stone-500 font-semibold">
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
            className="w-full py-2.5 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
          >
            View Updated Fridge
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
