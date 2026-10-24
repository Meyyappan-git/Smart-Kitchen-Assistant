import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AvailableIngredients({ 
  items = [], 
  onViewAll,
  onEditItem,
  onDeleteItem
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Status badge styling helper
  const getBadgeStyle = (statusColor) => {
    switch (statusColor) {
      case 'red':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'orange':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'green':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const displayItems = items.slice(0, 8); // Top 8 items for the grid

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Available Ingredients
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#FF6A00] hover:text-[#FF8A1F] flex items-center gap-0.5 cursor-pointer transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Grid: 4 cols on mobile/tablet, up to 8 on wide desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className="relative bg-white rounded-2xl p-2.5 flex flex-col justify-between border border-stone-100 shadow-sm hover:shadow-md transition-all group"
          >
            {/* Top row: Emoji & 3-dot menu */}
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                {item.emoji || '🥗'}
              </div>

              {/* Three-dot menu button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === item.id ? null : item.id);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 cursor-pointer transition-colors"
                  aria-label="Item options"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown popup */}
                {activeMenuId === item.id && (
                  <div 
                    className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        if (onEditItem) onEditItem(item);
                      }}
                      className="w-full px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-orange-50 hover:text-[#FF6A00] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        if (onDeleteItem) onDeleteItem(item.id);
                      }}
                      className="w-full px-2.5 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Name & Quantity */}
            <div className="mt-2">
              <h4 className="text-xs font-bold text-slate-800 capitalize truncate" title={item.name}>
                {item.name}
              </h4>
              <p className="text-[11px] font-medium text-stone-500 mt-0.5">
                {item.quantity} {item.unit}
              </p>
            </div>

            {/* Bottom: Status Badge */}
            <div className="mt-2">
              <span 
                className={`inline-block w-full text-center text-[9px] font-bold px-1.5 py-0.5 rounded-md border truncate ${getBadgeStyle(item.status_color)}`}
                title={item.status}
              >
                {item.status === 'Expiring in 2 days' ? 'In 2 days' : item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
