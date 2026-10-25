import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, X, ArrowRight } from 'lucide-react';

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
      new Notification("Smart Kitchen Expiry Alert", {
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
    <div className="w-full bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 flex items-center justify-between gap-3 text-amber-950">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-amber-950">
              {urgentCount} ingredient{urgentCount > 1 ? 's' : ''} expiring soon
            </h4>
            {notificationState !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                title="Enable browser notifications"
                className="text-[10px] font-medium text-amber-800 bg-amber-200/50 hover:bg-amber-200 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Enable Alerts
              </button>
            )}
          </div>
          {sampleNames && (
            <p className="text-[11px] text-amber-800/80 font-normal capitalize truncate">
              {sampleNames}{expiringItems.length > 3 ? ` +${expiringItems.length - 3} more` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onPlanMeals}
          className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Plan Meals</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-700/60 hover:text-amber-900 rounded-md cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

