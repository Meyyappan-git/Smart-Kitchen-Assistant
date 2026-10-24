import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, Plus, Trash2, Check, AlertCircle, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function AddIngredientsModal({ 
  onClose, 
  onSuccess 
}) {
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'bulk' | 'manual'
  
  // Photo Scan State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [detectedItems, setDetectedItems] = useState([]);
  const fileInputRef = useRef(null);

  // Bulk Text State
  const [bulkText, setBulkText] = useState('');
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState('Vegetables');
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualUnit, setManualUnit] = useState('items');
  const [manualExpiry, setManualExpiry] = useState('');
  const [manualEmoji, setManualEmoji] = useState('🥕');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectedItems([]);
      setScanMessage('');
    }
  };

  const handleScanPhoto = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanMessage('Scanning your fridge with Gemini AI Vision...');
    try {
      const res = await api.scanFridgePhoto(selectedFile);
      setScanMessage(res.message || 'Detection complete! Review and adjust items below:');
      setDetectedItems(res.detected_items || []);
    } catch (err) {
      console.error(err);
      setScanMessage('Could not analyze photo. You can enter items manually or using text below.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveDetectedItems = async () => {
    if (detectedItems.length === 0) return;
    try {
      const itemsToSave = detectedItems.map(d => ({
        name: d.name,
        category: d.category,
        quantity: parseFloat(d.quantity) || 1,
        unit: d.unit,
        expiry_date: d.expiry_date,
        emoji: d.emoji
      }));
      await api.addPantryBulk({ items: itemsToSave });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Error saving detected items: " + err.message);
    }
  };

  const handleSaveBulkText = async () => {
    if (!bulkText.trim()) return;
    setIsSubmittingBulk(true);
    try {
      await api.addPantryBulk({ text: bulkText });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Error adding ingredients: " + err.message);
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleSaveManual = async (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    setIsSubmittingManual(true);
    try {
      await api.addPantryItem({
        name: manualName.trim(),
        category: manualCategory,
        quantity: parseFloat(manualQuantity) || 1,
        unit: manualUnit,
        expiry_date: manualExpiry || null,
        emoji: manualEmoji
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Error adding item: " + err.message);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Add Ingredients to Fridge
            </h2>
            <p className="text-[11px] text-stone-500 font-medium">
              Photo scan with Gemini AI, type quick list, or manual entry
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-100 bg-stone-50/50 p-1.5">
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'photo' 
                ? 'bg-white text-[#FF6A00] shadow-xs' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Photo Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bulk' 
                ? 'bg-white text-[#FF6A00] shadow-xs' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quick Comma Text</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manual' 
                ? 'bg-white text-[#FF6A00] shadow-xs' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Form</span>
          </button>
        </div>

        {/* Tab 1: Photo Scan */}
        {activeTab === 'photo' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/30 hover:bg-orange-50/60 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
                  <img src={previewUrl} alt="Fridge preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-xs font-bold">
                    Click to choose different photo
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6A00] flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Take photo or upload fridge shelf picture
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Gemini AI Vision will automatically detect ingredients
                  </p>
                </>
              )}
            </div>

            {selectedFile && detectedItems.length === 0 && (
              <button
                onClick={handleScanPhoto}
                disabled={isScanning}
                className="w-full py-3 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isScanning ? 'Analyzing with Gemini AI...' : 'Analyze Photo with Gemini AI'}</span>
              </button>
            )}

            {scanMessage && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span>{scanMessage}</span>
              </div>
            )}

            {/* Detected Items List */}
            {detectedItems.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">
                    Detected Items ({detectedItems.length})
                  </h4>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Edit quantities or expiry before saving
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {detectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{item.emoji || '🥗'}</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...detectedItems];
                              updated[idx].name = e.target.value;
                              setDetectedItems(updated);
                            }}
                            className="text-xs font-bold text-slate-800 bg-transparent border-b border-stone-200 focus:outline-none w-full capitalize"
                          />
                          <p className="text-[10px] text-stone-500">
                            Expires in {item.suggested_shelf_life_days || 7} days ({item.category})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...detectedItems];
                            updated[idx].quantity = e.target.value;
                            setDetectedItems(updated);
                          }}
                          className="w-14 px-1.5 py-1 text-xs text-center border border-stone-300 rounded-lg bg-white"
                          min="0.1"
                          step="0.5"
                        />
                        <span className="text-[10px] text-stone-500 w-8">{item.unit}</span>
                        <button
                          onClick={() => {
                            setDetectedItems(detectedItems.filter((_, i) => i !== idx));
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveDetectedItems}
                  className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Add {detectedItems.length} Items to Fridge</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Quick Bulk Comma Text */}
        {activeTab === 'bulk' && (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Type ingredients (comma-separated):
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={4}
                placeholder="e.g. 4 tomatoes, 1000ml milk, 6 eggs, 250g paneer, 2 avocados"
                className="w-full p-3 text-xs border border-stone-200 rounded-2xl focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Tip: Quantities and units (like 500g, 2 bunches, 3 items) are automatically parsed, and expiry dates are auto-filled using standard shelf life!
              </p>
            </div>

            <button
              onClick={handleSaveBulkText}
              disabled={isSubmittingBulk || !bulkText.trim()}
              className="w-full py-3 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmittingBulk ? 'Adding to Fridge...' : 'Add Ingredients to Fridge'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Manual Single Item Entry */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSaveManual} className="p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Ingredient Name</label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Fresh Mushrooms"
                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none bg-white"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Protein">Protein</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Pantry">Pantry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  value={manualEmoji}
                  onChange={(e) => setManualEmoji(e.target.value)}
                  className="w-full p-2 text-center text-sm border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Quantity</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  required
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Unit</label>
                <select
                  value={manualUnit}
                  onChange={(e) => setManualUnit(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none bg-white"
                >
                  <option value="items">items</option>
                  <option value="g">g (grams)</option>
                  <option value="ml">ml (milliliters)</option>
                  <option value="bunches">bunches</option>
                  <option value="slices">slices</option>
                  <option value="cloves">cloves</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Expiry Date (Optional - defaults to shelf-life)
              </label>
              <input
                type="date"
                value={manualExpiry}
                onChange={(e) => setManualExpiry(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-[#FF6A00] focus:outline-none bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingManual}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#FF8A1F] to-[#FF6A00] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmittingManual ? 'Saving...' : 'Save Item to Fridge'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
