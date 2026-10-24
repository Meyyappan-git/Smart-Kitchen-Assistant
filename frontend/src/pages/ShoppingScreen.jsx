import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Trash2, Plus, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function ShoppingScreen({ onOpenPlanner }) {
  const [shoppingData, setShoppingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Vegetables');
  const [newItemCost, setNewItemCost] = useState('50');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchShopping = async () => {
    setLoading(true);
    try {
      const data = await api.getShoppingList();
      setShoppingData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopping();
  }, []);

  const handleToggle = async (id) => {
    try {
      await api.toggleShoppingItem(id);
      fetchShopping();
    } catch (err) {
      alert("Error toggling item: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteShoppingItem(id);
      fetchShopping();
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await api.clearCompletedShopping();
      fetchShopping();
    } catch (err) {
      alert("Error clearing items: " + err.message);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      await api.addShoppingItem({
        name: newItemName.trim(),
        category: newItemCategory,
        quantity: 1,
        unit: 'items',
        estimated_cost_inr: parseInt(newItemCost) || 50,
        source_meal: 'Manual'
      });
      setNewItemName('');
      setShowAddForm(false);
      fetchShopping();
    } catch (err) {
      alert("Error adding shopping item: " + err.message);
    }
  };

  const totalCost = shoppingData?.total_cost_inr || 0;
  const budget = shoppingData?.estimated_budget_inr || 750;
  const budgetPct = Math.min(100, Math.round((totalCost / budget) * 100));
  const grouped = shoppingData?.grouped_by_category || {};
  const hasItems = shoppingData?.items?.length > 0;

  return (
    <div className="p-4 flex flex-col gap-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Smart Shopping List
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Merged missing ingredients for your planned meals
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-2 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Manual Quick Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3 animate-fadeIn">
          <h3 className="text-xs font-bold text-slate-800">Add Custom Item to Shopping List</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Item name (e.g. Sourdough bread)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="p-2 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none col-span-2"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="p-2 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none bg-white"
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Fruits">Fruits</option>
              <option value="Protein">Protein</option>
              <option value="Pantry">Pantry</option>
            </select>
            <input
              type="number"
              placeholder="Est. Cost (₹)"
              value={newItemCost}
              onChange={(e) => setNewItemCost(e.target.value)}
              className="p-2 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2 bg-[#FF6A00] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Add to List
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-stone-500 text-xs font-bold rounded-xl hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Budget & Cost Tracker Card */}
      <div className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Estimated Total Cost
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{totalCost}
              </span>
              <span className="text-xs font-medium text-stone-500">
                / ₹{budget} budget
              </span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
            totalCost <= budget 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {totalCost <= budget ? 'Under Budget' : 'Over Budget'}
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              totalCost <= budget 
                ? 'bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00]' 
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, budgetPct))}%` }}
          />
        </div>

        {shoppingData?.checked_count > 0 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-medium text-stone-500">
              {shoppingData.checked_count} of {shoppingData.total_count} items bought
            </span>
            <button
              onClick={handleClearCompleted}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Clear Checked
            </button>
          </div>
        )}
      </div>

      {/* Grouped Shopping Items */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white rounded-2xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : !hasItems ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-100 p-6">
          <ShoppingCart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Your shopping list is empty!</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Generate a meal plan to automatically add all missing recipe ingredients.
          </p>
          <button
            onClick={onOpenPlanner}
            className="px-4 py-2 bg-[#FF6A00] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Open Meal Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {Object.entries(grouped).map(([catName, items]) => (
            <div key={catName} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-xs space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-1 border-b border-stone-100 flex items-center justify-between">
                <span>{catName}</span>
                <span className="text-[10px] text-stone-400 font-semibold">{items.length} items</span>
              </h3>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                      item.is_checked ? 'bg-stone-50 opacity-60' : 'bg-stone-50/50 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-[#FF6A00]">
                        {item.is_checked ? (
                          <CheckCircle2 className="w-5 h-5 fill-[#FF6A00] text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold capitalize ${
                          item.is_checked ? 'line-through text-stone-400' : 'text-slate-900'
                        }`}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-medium">
                          <span>{item.quantity} {item.unit}</span>
                          {item.source_meal && (
                            <>
                              <span>•</span>
                              <span className="text-orange-600 font-semibold">{item.source_meal}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        ₹{item.estimated_cost_inr}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
