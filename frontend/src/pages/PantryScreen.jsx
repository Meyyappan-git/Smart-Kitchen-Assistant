import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, AlertCircle, CheckCircle, Clock, Calendar, Check } from 'lucide-react';
import { api } from '../services/api';

export default function PantryScreen({
  onOpenAddIngredient,
  onOpenRecipeWithIngredient
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editDate, setEditDate] = useState('');

  const fetchPantry = async () => {
    setLoading(true);
    try {
      const data = await api.getPantry(category, search);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, [category, search]);

  const handleDelete = async (id) => {
    try {
      await api.deletePantryItem(id);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await api.updatePantryItem(editingItem.id, {
        quantity: parseFloat(editQty),
        expiry_date: editDate || null
      });
      setItems(items.map(i => i.id === updated.id ? updated : i));
      setEditingItem(null);
    } catch (err) {
      alert("Error updating item: " + err.message);
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Protein', 'Drinks', 'Pantry'];

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

  return (
    <div className="p-4 flex flex-col gap-4 pb-12">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pantry & Fridge Inventory
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            {items.length} items total • tracked by shelf life
          </p>
        </div>
        <button
          onClick={onOpenAddIngredient}
          className="px-3 py-2 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Items</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <div className="flex items-center bg-white rounded-2xl border border-stone-200 shadow-xs px-3.5 py-2.5 focus-within:border-[#FF6A00]">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pantry items..."
            className="w-full text-xs text-slate-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              category === cat
                ? 'bg-[#FF6A00] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-16 bg-white rounded-2xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-100 p-6">
          <p className="text-3xl mb-2">🥬</p>
          <h3 className="text-sm font-bold text-slate-800">No ingredients in this view</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">Add your groceries or scan your fridge with camera!</p>
          <button
            onClick={onOpenAddIngredient}
            className="px-4 py-2 bg-[#FF6A00] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Add Items Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3 border border-stone-100 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3 group"
            >
              {/* Left: Emoji & Information */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-stone-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {item.emoji || '🥗'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 capitalize">
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-stone-400 font-medium">
                      ({item.category})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500 font-medium">
                    <span className="font-bold text-slate-700">
                      {item.quantity} {item.unit}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {item.expiry_date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Status Badge & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getBadgeStyle(item.status_color)}`}>
                  {item.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditQty(item.quantity);
                      setEditDate(item.expiry_date || '');
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 cursor-pointer"
                    title="Edit item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 capitalize">
              Edit {editingItem.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity ({editingItem.unit}):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expiry Date:
              </label>
              <input
                type="date"
                required
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 text-stone-500 font-bold text-xs rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
