import React, { useState, useEffect } from 'react';
import HomeScreen from './pages/HomeScreen';
import RecipesScreen from './pages/RecipesScreen';
import PantryScreen from './pages/PantryScreen';
import MealPlannerScreen from './pages/MealPlannerScreen';
import ShoppingScreen from './pages/ShoppingScreen';
import SettingsScreen from './pages/SettingsScreen';
import BottomNav from './components/BottomNav';
import NavbarDesktop from './components/NavbarDesktop';
import RecipeModal from './components/RecipeModal';
import AddIngredientsModal from './components/AddIngredientsModal';
import CookSuccessModal from './components/CookSuccessModal';
import CookingStepsModal from './components/CookingStepsModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [overviewData, setOverviewData] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [shoppingCount, setShoppingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState(null);
  const [cookedSuccessData, setCookedSuccessData] = useState(null);

  const loadAllData = async () => {
    try {
      const [overview, pantry, shopping] = await Promise.all([
        api.getOverview(),
        api.getPantry(),
        api.getShoppingList().catch(() => ({ items: [] }))
      ]);
      setOverviewData(overview);
      setPantryItems(pantry);
      setShoppingCount(shopping?.items?.filter(i => !i.is_checked)?.length || 0);
    } catch (err) {
      console.error("Failed to load initial app data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // When user clicks "Cook Now", open the interactive Step-by-Step Cooking Guide!
  const handleInitiateCook = (recipe) => {
    setSelectedRecipe(null);
    setCookingRecipe(recipe);
  };

  // Called when user finishes the final step (or clicks "Mark Cooked")
  const handleCompleteCook = async (recipe) => {
    try {
      const res = await api.cookRecipe(recipe.id);
      setCookingRecipe(null);
      setCookedSuccessData({
        recipe,
        deducted: res.deducted_ingredients || []
      });
      // Refresh inventory
      loadAllData();
    } catch (err) {
      alert("Error cooking recipe: " + err.message);
    }
  };

  const handleDeletePantryItem = async (id) => {
    try {
      await api.deletePantryItem(id);
      setPantryItems(pantryItems.filter(i => i.id !== id));
      loadAllData();
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleAddToShopping = async (missingIngredients) => {
    try {
      for (const item of missingIngredients) {
        await api.addShoppingItem({
          name: item.name,
          category: item.category || 'Pantry',
          quantity: item.amount || 1,
          unit: item.unit || 'items',
          estimated_cost_inr: item.estimated_cost_inr || 40,
          source_meal: selectedRecipe?.title ? `For ${selectedRecipe.title}` : 'Recipe'
        });
      }
      alert(`Added ${missingIngredients.length} ingredients to your shopping list!`);
      setSelectedRecipe(null);
      loadAllData();
      setActiveTab('shopping');
    } catch (err) {
      alert("Error adding to shopping: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* Desktop & Tablet Top Navigation Bar */}
      <NavbarDesktop
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        shoppingCount={shoppingCount}
        urgentAlertsCount={overviewData?.urgent_alerts_count || 0}
        weather={overviewData?.weather}
        onOpenAddIngredient={() => setIsAddModalOpen(true)}
      />

      {/* Main Container - Desktop Scaled (max-w-7xl, responsive padding) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'home' && (
          <HomeScreen
            overviewData={overviewData}
            pantryItems={pantryItems}
            onOpenPhotoScan={() => setIsAddModalOpen(true)}
            onOpenAddIngredient={() => setIsAddModalOpen(true)}
            onSelectTab={setActiveTab}
            onSelectRecipe={setSelectedRecipe}
            onCookRecipe={handleInitiateCook}
            onDeleteItem={handleDeletePantryItem}
            onEditItem={() => setActiveTab('pantry')}
            onSearchPantry={() => setActiveTab('pantry')}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesScreen
            onSelectRecipe={setSelectedRecipe}
            onCookRecipe={handleInitiateCook}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryScreen
            onOpenAddIngredient={() => setIsAddModalOpen(true)}
            onOpenRecipeWithIngredient={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'planner' && (
          <MealPlannerScreen
            onSelectRecipe={setSelectedRecipe}
            onCookRecipe={handleInitiateCook}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingScreen
            onOpenPlanner={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            onSettingsUpdated={loadAllData}
          />
        )}
      </main>

      {/* Mobile-Only Bottom Navigation Bar (hidden on md and larger desktop screens) */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 z-40">
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          shoppingCount={shoppingCount}
        />
      </div>

      {/* 1. Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onCookNow={handleInitiateCook}
          onAddToShopping={handleAddToShopping}
        />
      )}

      {/* 2. Interactive Step-by-Step Cooking Guide Modal */}
      {cookingRecipe && (
        <CookingStepsModal
          recipe={cookingRecipe}
          onClose={() => setCookingRecipe(null)}
          onFinishAndDeduct={() => handleCompleteCook(cookingRecipe)}
        />
      )}

      {/* 3. Add Ingredients (Photo Scan / Comma List / Manual) Modal */}
      {isAddModalOpen && (
        <AddIngredientsModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={loadAllData}
        />
      )}

      {/* 4. Cook Success & Deducted Items Modal */}
      {cookedSuccessData && (
        <CookSuccessModal
          recipe={cookedSuccessData.recipe}
          deducted={cookedSuccessData.deducted}
          onClose={() => setCookedSuccessData(null)}
          onViewFridge={() => {
            setCookedSuccessData(null);
            setActiveTab('pantry');
          }}
        />
      )}
    </div>
  );
}
