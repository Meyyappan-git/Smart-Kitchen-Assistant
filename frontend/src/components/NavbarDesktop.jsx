import React from 'react';
import { Home, UtensilsCrossed, ShoppingCart, CalendarDays, Settings, Sun, Bell, Plus, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Mascot */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="group-hover:scale-105 transition-transform">
            <MascotChef variant="avatar" size={42} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                AI Smart Fridge
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-100 text-[#FF6A00] text-[10px] font-bold">
                <Sparkles className="w-2.5 h-2.5" />
                Assistant
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Zero-Waste Kitchen Management
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/60 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                id={`desktop-nav-${tab.id}`}
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span>{tab.label}</span>

                {tab.badge > 0 && (
                  <span className={`min-w-[16px] h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                    isActive ? 'bg-white text-[#FF6A00]' : 'bg-[#FF6A00] text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Weather, Notifications & Add Button */}
        <div className="flex items-center gap-3">
          {/* Weather Chip */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-900">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{weather?.temp || '24°C'}</span>
          </div>

          {/* Expiry alerts button */}
          <button
            onClick={() => onSelectTab('pantry')}
            className="relative w-9 h-9 rounded-xl bg-stone-100 hover:bg-orange-50 border border-stone-200/80 flex items-center justify-center text-stone-600 hover:text-[#FF6A00] transition-colors cursor-pointer"
            title="Expiry Alerts"
          >
            <Bell className="w-4 h-4" />
            {urgentAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {urgentAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onOpenAddIngredient}
            className="px-3.5 py-2 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] hover:from-[#FF7A10] hover:to-[#EA580C] text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Ingredients</span>
          </button>
        </div>

      </div>
    </header>
  );
}
