import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, ChevronRight } from 'lucide-react';

export default function AvailableIngredients({ 
  items = [], 
  onViewAll,
  onEditItem,
  onDeleteItem
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Status indicator helper
  const getStatusDot = (statusColor) => {
    switch (statusColor) {
      case 'red':
        return 'bg-rose-500';
      case 'orange':
        return 'bg-amber-500';
      case 'green':
      default:
        return 'bg-emerald-500';
    }
  };

  const displayItems = items.slice(0, 8); // Top 8 items for the grid

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold text-stone-900 tracking-tight">
          Available Ingredients
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-0.5 cursor-pointer transition-colors"
        >
          <span>View All ({items.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className="relative bg-white rounded-xl p-3 flex flex-col justify-between border border-stone-200/70 shadow-2xs hover:border-stone-300 transition-all group"
          >
            {/* Top row: Emoji & 3-dot menu */}
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-lg shrink-0 border border-stone-100">
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
                  className="p-1 text-stone-300 hover:text-stone-600 rounded-md hover:bg-stone-50 cursor-pointer transition-colors"
                  aria-label="Item options"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown popup */}
                {activeMenuId === item.id && (
                  <div 
                    className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-md border border-stone-200/80 py-1 z-20 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        if (onEditItem) onEditItem(item);
                      }}
                      className="w-full px-2.5 py-1.5 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
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
            <div className="mt-2.5">
              <h4 className="text-xs font-semibold text-stone-900 capitalize truncate" title={item.name}>
                {item.name}
              </h4>
              <p className="text-[11px] font-normal text-stone-500 mt-0.5">
                {item.quantity} {item.unit}
              </p>
            </div>

            {/* Bottom: Subtle Status Indicator */}
            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(item.status_color)}`} />
              <span className="text-[10px] text-stone-500 font-medium truncate" title={item.status}>
                {item.status === 'Expiring in 2 days' ? 'In 2 days' : item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

