const API_BASE = '/api';

export const api = {
  // Overview
  getOverview: async () => {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Failed to load overview data');
    return res.json();
  },

  // Pantry
  getPantry: async (category = '', search = '', sortBy = 'expiry') => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sort_by', sortBy);
    const res = await fetch(`${API_BASE}/pantry?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load pantry items');
    return res.json();
  },

  addPantryItem: async (item) => {
    const res = await fetch(`${API_BASE}/pantry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add pantry item');
    return res.json();
  },

  addPantryBulk: async (data) => {
    const res = await fetch(`${API_BASE}/pantry/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add bulk items');
    return res.json();
  },

  updatePantryItem: async (id, item) => {
    const res = await fetch(`${API_BASE}/pantry/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to update pantry item');
    return res.json();
  },

  deletePantryItem: async (id) => {
    const res = await fetch(`${API_BASE}/pantry/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete pantry item');
    return res.json();
  },

  // Recipes
  getRecipes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.diet && filters.diet !== 'All') params.append('diet', filters.diet);
    if (filters.max_time) params.append('max_time', filters.max_time);
    if (filters.max_budget) params.append('max_budget', filters.max_budget);
    const res = await fetch(`${API_BASE}/recipes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load recipes');
    return res.json();
  },

  getRecipeDetail: async (id) => {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) throw new Error('Failed to load recipe detail');
    return res.json();
  },

  cookRecipe: async (id) => {
    const res = await fetch(`${API_BASE}/recipes/${id}/cook`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to cook recipe');
    return res.json();
  },

  // Meal Planner
  getPlanner: async () => {
    const res = await fetch(`${API_BASE}/planner`);
    if (!res.ok) throw new Error('Failed to load meal plan');
    return res.json();
  },

  generatePlanner: async (options = {}) => {
    const res = await fetch(`${API_BASE}/planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        days: options.days || 3,
        meal_types: options.meal_types || ['Breakfast', 'Lunch', 'Dinner'],
        respect_budget: options.respect_budget ?? true,
        respect_diet: options.respect_diet ?? true,
        respect_time: options.respect_time ?? true,
      }),
    });
    if (!res.ok) throw new Error('Failed to generate meal plan');
    return res.json();
  },

  syncPlanToShopping: async () => {
    const res = await fetch(`${API_BASE}/planner/to-shopping-list`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to sync plan to shopping list');
    return res.json();
  },

  // Shopping List
  getShoppingList: async () => {
    const res = await fetch(`${API_BASE}/shopping`);
    if (!res.ok) throw new Error('Failed to load shopping list');
    return res.json();
  },

  addShoppingItem: async (item) => {
    const res = await fetch(`${API_BASE}/shopping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add shopping item');
    return res.json();
  },

  toggleShoppingItem: async (id) => {
    const res = await fetch(`${API_BASE}/shopping/${id}/toggle`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to toggle item');
    return res.json();
  },

  deleteShoppingItem: async (id) => {
    const res = await fetch(`${API_BASE}/shopping/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete shopping item');
    return res.json();
  },

  clearCompletedShopping: async () => {
    const res = await fetch(`${API_BASE}/shopping/clear-completed`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to clear completed items');
    return res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  updateSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  resetDemoData: async () => {
    const res = await fetch(`${API_BASE}/settings/reset-demo`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  },

  // Photo Scan
  scanFridgePhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/scan-fridge`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to scan fridge photo');
    return res.json();
  },
};
