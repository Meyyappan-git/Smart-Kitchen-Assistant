import React from 'react';
import { Home, UtensilsCrossed, ShoppingCart, CalendarDays, Settings } from 'lucide-react';

export default function BottomNav({ 
  activeTab = 'home', 
  onSelectTab,
  shoppingCount = 0 
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart, badge: shoppingCount },
    { id: 'planner', label: 'Meal Planner', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="shrink-0 w-full bg-white/95 backdrop-blur-md border-t border-stone-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-3 py-2 z-30">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              id={`nav-${tab.id}`}
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#FF6A00] scale-105 font-bold' 
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
              aria-label={tab.label}
            >
              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-[#FF6A00] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-1 transition-colors ${isActive ? 'text-[#FF6A00] font-bold' : 'text-stone-400'}`}>
                {tab.label}
              </span>

              {/* Active Orange Glow Bar */}
              {isActive && (
                <div className="w-4 h-1 bg-[#FF6A00] rounded-full mt-0.5 shadow-sm shadow-orange-500/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
