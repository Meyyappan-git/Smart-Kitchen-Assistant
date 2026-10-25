import React from 'react';
import { Home, UtensilsCrossed, ShoppingCart, CalendarDays, Settings, Sun, Bell, Plus } from 'lucide-react';
import MascotChef from './MascotChef';

export default function NavbarDesktop({
  activeTab,
  onSelectTab,
  shoppingCount = 0,
  urgentAlertsCount = 0,
  weather = { temp: '24°C', condition: 'Sunny' },
  onOpenAddIngredient
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart, badge: shoppingCount },
    { id: 'planner', label: 'Meal Planner', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-stone-200/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Mascot */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center p-0.5 group-hover:bg-orange-50 transition-colors">
            <MascotChef variant="avatar" size={30} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-stone-900 tracking-tight">
                Smart Kitchen
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium border border-stone-200/50">
                AI Assistant
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-normal leading-none hidden sm:block mt-0.5">
              Zero-Waste Kitchen Management
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/70 p-1 rounded-xl border border-stone-200/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                id={`desktop-nav-${tab.id}`}
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600 stroke-[2.2]' : 'text-stone-400 stroke-[1.8]'}`} />
                <span>{tab.label}</span>

                {tab.badge > 0 && (
                  <span className={`min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ml-0.5 ${
                    isActive ? 'bg-orange-500 text-white' : 'bg-stone-300 text-stone-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Ambient Weather, Alerts & Quick Add */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Weather pill */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-stone-100/60 rounded-lg text-xs font-medium text-stone-600 border border-stone-200/40">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{weather?.temp || '24°C'}</span>
          </div>

          {/* Expiry alerts bell */}
          <button
            onClick={() => onSelectTab('pantry')}
            className="relative w-8 h-8 rounded-lg bg-stone-100/70 hover:bg-stone-100 border border-stone-200/50 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="Expiry Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            {urgentAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {urgentAlertsCount}
              </span>
            )}
          </button>

          {/* Minimal Add Button */}
          <button
            onClick={onOpenAddIngredient}
            className="h-8 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>

      </div>
    </header>
  );
}

