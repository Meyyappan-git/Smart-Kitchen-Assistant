import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

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
    <div className="w-full pt-1 pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Greeting & Date */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            {currentDate}
          </span>
          <span>•</span>
          <span>{currentTime}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {greeting}
        </h1>
      </div>

      {/* Subtle status badges */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200/80 rounded-xl text-xs font-medium text-stone-600 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Smart Sync Active</span>
        </div>

        {unreadAlertsCount > 0 && (
          <button
            onClick={onBellClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200/80 rounded-xl text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span>{unreadAlertsCount} item{unreadAlertsCount > 1 ? 's' : ''} expiring</span>
          </button>
        )}
      </div>
    </div>
  );
}

