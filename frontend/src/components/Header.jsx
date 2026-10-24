import React from 'react';
import { Wifi, Bell, Sun } from 'lucide-react';
import MascotChef from './MascotChef';

export default function Header({ 
  greeting = 'Good Morning, Alex',
  currentDate = 'Sat, 24 Oct',
  currentTime = '12:00 PM',
  weather = { temp: '24°C', icon: '☀️' },
  unreadAlertsCount = 0,
  onBellClick,
  onAvatarClick
}) {
  return (
    <header className="relative w-full bg-gradient-to-r from-[#FF8A1F] via-[#FF7A10] to-[#FF6A00] text-white pt-6 pb-7 px-5 sm:px-8 rounded-b-[32px] sm:rounded-3xl shadow-md overflow-hidden">
      {/* Subtle background decorative circular glows */}
      <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-black/5 blur-lg pointer-events-none" />

      {/* Top Utility Bar */}
      <div className="relative flex items-center justify-between mb-4">
        {/* Weather Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/25 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/25 transition-colors">
          <Sun className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
          <span>{weather.temp || '24°C'}</span>
        </div>

        {/* Action icons: Wifi, Bell, Mascot Avatar */}
        <div className="flex items-center gap-3">
          {/* Wifi status icon */}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Wifi className="w-4 h-4 text-white" />
          </div>

          {/* Bell notification icon with unread badge */}
          <button 
            onClick={onBellClick}
            className="relative w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-white" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#FF7A10] animate-pulse">
                {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Mascot Chef Avatar */}
          <button 
            onClick={onAvatarClick}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            aria-label="User profile & mascot"
          >
            <MascotChef variant="avatar" size={42} />
          </button>
        </div>
      </div>

      {/* Main Greeting & Time */}
      <div className="relative flex flex-col">
        <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-sm leading-tight">
          {greeting}
        </h1>
        <div className="flex items-center gap-2 mt-1 text-xs text-orange-100 font-medium">
          <span>{currentDate}</span>
          <span>•</span>
          <span>{currentTime}</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider">
            Smart Sync Active
          </span>
        </div>
      </div>
    </header>
  );
}
