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
    { id: 'planner', label: 'Planner', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="shrink-0 w-full bg-white/90 backdrop-blur-md border-t border-stone-200/60 px-2 py-1.5 z-30">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              id={`nav-${tab.id}`}
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-stone-900' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              aria-label={tab.label}
            >
              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-orange-600 stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-0.5 transition-colors ${isActive ? 'font-semibold text-stone-900' : 'font-normal text-stone-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

