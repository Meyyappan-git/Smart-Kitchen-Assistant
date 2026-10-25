import React, { useState } from 'react';
import Header from '../components/Header';
import FridgeCard from '../components/FridgeCard';
import SearchBar from '../components/SearchBar';
import AvailableIngredients from '../components/AvailableIngredients';
import RecommendedRecipeBanner from '../components/RecommendedRecipeBanner';
import MoreRecipesRow from '../components/MoreRecipesRow';
import SmartSuggestions from '../components/SmartSuggestions';
import ExpiryAlertBanner from '../components/ExpiryAlertBanner';

export default function HomeScreen({
  overviewData,
  pantryItems,
  onOpenPhotoScan,
  onOpenAddIngredient,
  onSelectTab,
  onSelectRecipe,
  onCookRecipe,
  onDeleteItem,
  onEditItem,
  onSearchPantry
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && onSearchPantry) {
      onSearchPantry(query);
      onSelectTab('pantry');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Minimal Header Greeting */}
      <Header
        greeting={overviewData?.greeting || "Good Morning, Alex"}
        currentDate={overviewData?.current_date || "Sat, 24 Oct"}
        currentTime={overviewData?.current_time || "12:00 PM"}
        weather={overviewData?.weather || { temp: '24°C', icon: '☀️' }}
        unreadAlertsCount={overviewData?.urgent_alerts_count || 0}
        onBellClick={() => onSelectTab('pantry')}
        onAvatarClick={() => onSelectTab('settings')}
      />

      {/* Expiry Alert Warning Banner if items are expiring */}
      {overviewData?.urgent_alerts_count > 0 && (
        <ExpiryAlertBanner
          urgentCount={overviewData.urgent_alerts_count}
          pantryItems={pantryItems || []}
          onPlanMeals={() => onSelectTab('planner')}
        />
      )}

      {/* 2. Minimalist Search Bar */}
      <div className="w-full">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          onOpenPhotoScan={onOpenPhotoScan}
          placeholder="Search ingredients in your fridge..."
        />
      </div>

      {/* 3. 2-Column Row: Pantry Overview + Recommended Recipe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column on Desktop (5 cols): Fridge Overview */}
        <div className="lg:col-span-5 flex">
          <FridgeCard
            fridgeSummary={overviewData?.fridge_summary}
            onViewAllPantry={() => onSelectTab('pantry')}
            onSelectCategory={(cat) => {
              onSearchPantry(cat);
              onSelectTab('pantry');
            }}
          />
        </div>

        {/* Right Column on Desktop (7 cols): Recommended Recipe */}
        <div className="lg:col-span-7 flex">
          <RecommendedRecipeBanner
            recipe={overviewData?.recommended_recipe}
            onCookNow={onCookRecipe}
            onViewRecipe={onSelectRecipe}
          />
        </div>
      </div>

      {/* 4. Available Ingredients Grid */}
      <AvailableIngredients
        items={pantryItems || overviewData?.available_preview || []}
        onViewAll={() => onSelectTab('pantry')}
        onDeleteItem={onDeleteItem}
        onEditItem={onEditItem}
      />

      {/* 5. 2-Column Row: More Recipes + Smart Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: More Recipes */}
        <div className="lg:col-span-7">
          <MoreRecipesRow
            recipes={overviewData?.more_recipes || []}
            onSeeAll={() => onSelectTab('recipes')}
            onSelectRecipe={onSelectRecipe}
          />
        </div>

        {/* Right: Smart Suggestions Card */}
        <div className="lg:col-span-5 flex">
          <SmartSuggestions
            suggestions={overviewData?.smart_suggestions || []}
            onOpenPlanner={() => onSelectTab('planner')}
            onOpenShopping={() => onSelectTab('shopping')}
          />
        </div>
      </div>
    </div>
  );
}

