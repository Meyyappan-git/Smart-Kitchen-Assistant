import React, { useEffect, useState } from 'react';
import { AlertTriangle, ChevronRight, Bell, X } from 'lucide-react';

export default function ExpiryAlertBanner({ 
  urgentCount = 0, 
  onPlanMeals,
  pantryItems = [] 
}) {
  const [dismissed, setDismissed] = useState(false);
  const [notificationState, setNotificationState] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationState(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
    if (permission === 'granted') {
      new Notification("AI Smart Fridge Expiry Alert", {
        body: `You have ${urgentCount} ingredients expiring soon! Let's cook them today.`,
        icon: "/favicon.ico"
      });
    }
  };

  if (dismissed || urgentCount <= 0) return null;

  // Filter items expiring in <= 2 days
  const expiringItems = pantryItems.filter(p => p.days_left <= 2 && p.days_left >= 0);
  const sampleNames = expiringItems.slice(0, 3).map(p => p.name).join(', ');

  return (
    <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-3.5 shadow-xs mb-3 flex items-center justify-between gap-3 text-rose-900 animate-fadeIn">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-rose-950">
              {urgentCount} item{urgentCount > 1 ? 's' : ''} expiring in ≤ 2 days!
            </h4>
            {notificationState !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                title="Enable browser push notifications"
                className="text-[10px] font-semibold text-rose-700 bg-rose-200/60 hover:bg-rose-200 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer"
              >
                <Bell className="w-2.5 h-2.5" />
                <span>Alerts</span>
              </button>
            )}
          </div>
          {sampleNames && (
            <p className="text-[11px] text-rose-700 font-medium capitalize truncate max-w-[210px]">
              {sampleNames}{expiringItems.length > 3 ? ` +${expiringItems.length - 3} more` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onPlanMeals}
          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          Plan Meals
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-rose-400 hover:text-rose-700 rounded-md cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
