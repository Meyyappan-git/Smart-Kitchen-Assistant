# AI Smart Fridge 🤖
> **An Intelligent Kitchen Assistant & Food Waste Reduction Platform**  
> *Semmaya Samaikirom, Bayagarama Rusikirom*

![AI Smart Fridge Banner](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview
**AI Smart Fridge** is a full-stack, mobile-first web application designed to combat everyday food waste and answer the timeless question: *"What should I cook with what I have?"*

By continuously tracking your pantry and refrigerator contents, auto-calculating shelf lives, alerting you to expiring ingredients, and running a **greedy zero-waste meal planning algorithm**, the assistant ensures your groceries are cooked at their peak freshness.

---

## ✨ Key Features

### 1. 📱 Home Screen (Smart Dashboard)
- **Time-Adaptive Header:** Warm orange gradient (`#FF8A1F` to `#FF6A00`) displaying dynamic greetings (*Good Morning / Afternoon / Evening / Night, Alex*), live date/time, weather chip (`24°C ☀️`), connectivity indicator, notification bell with unread alert badge, and custom SVG robot-chef mascot avatar.
- **"My Fridge" Card:** Live breakdown of inventory items across 5 categories (*Vegetables, Fruits, Dairy, Protein, Drinks*), freshness progress bar with health status (*"Everything looks fresh" / "Some items need attention"*), and a custom vector smart fridge graphic.
- **Voice & Vision Search Bar:** 
  - 🎙️ **Web Speech API:** Speak ingredient names into your microphone for real-time hands-free search.
  - 📷 **Gemini AI Camera:** One-tap button opening the fridge shelf vision scanner.
- **Available Ingredients (4-Column Grid):** Small interactive cards displaying emoji, item name, quantity, 3-dot menu (*Edit / Delete*), and dynamic color-coded freshness badges (*Green "Fresh", Orange "Expiring soon", Red "In 2 days" / "Expires today"*).
- **AI Recommended Recipe Banner:** Warm gradient hero card highlighting *Creamy Mushroom Pasta* (or urgent recipe consuming expiring items) with star rating, cooking time, difficulty, calories, *"Uses ingredients expiring soon"*, and **Cook Now** / **View Recipe** actions.
- **"More Recipes for You":** Horizontally scrolling cards with high-res food photos, cooking time, difficulty, and green **% Available** badges calculated dynamically from your pantry.
- **Smart Suggestions Card:** Featuring the friendly Robot Chef mascot offering 4 actionable real-time tips (e.g. *"Milk expires tomorrow, use it today"*, *"Tomatoes are expiring soon"*, *"You have enough ingredients for 42 recipes"*).

### 2. 🍲 Live Step-by-Step Cooking Mode & Recipe Details
- **Interactive Cooking Mode:**
  - Clicking **"Cook Now"** enters a dedicated, distraction-free **Live Cooking Mode**.
  - **Progress Bar & Numbered Steps:** Step-by-step guidance through each recipe preparation phase.
  - 🔊 **Voice Assistant ("Read Aloud"):** Uses Web Speech Synthesis API to narrate instructions aloud hands-free while your hands are busy cooking.
  - ⏱️ **Integrated Kitchen Timer:** Digital countdown clock with Start/Pause/Reset controls and quick presets (`+3m`, `+5m`, `+10m`).
  - 🤖 **Chef Robot's Advice:** Contextual culinary tips from the mascot tailored to each step.
  - 📋 **Ingredients Checklist:** Real-time checklist to cross off items as they are prepped.
  - ✨ **Automatic Pantry Deduction:** Finishing cooking triggers celebratory confetti and immediately deducts consumed ingredient quantities from your SQLite pantry!

- **Desktop Scaling:**
  - Full-width desktop responsive dashboard (`max-w-7xl mx-auto`) with a sleek top navigation bar, multi-column dashboard grid, 8-column ingredient overview, and 3-column recipe catalog. Seamlessly scales down to tablet and mobile.

### 3. 🧠 Zero-Waste Meal Planner (Core Algorithm)
- **Selectable Duration:** 1 Day, 3 Days, 5 Days, or 7 Days.
- **Heuristic Greedy Algorithm:**
  1. Ranks pantry items by urgency: $\text{Weight} \propto \frac{1}{\text{Days to Expiry}}$.
  2. Evaluates candidate recipes against user preferences (diet, allergens, max cooking time, budget).
  3. Scores recipes based on the sum of urgency weights of the pantry ingredients they consume.
  4. Deducts consumed ingredients from an in-memory virtual pantry copy and steps forward.
  5. Applies repetition penalties to guarantee variety.
- **Day-by-Day Plan:** Shows Breakfast, Lunch, Dinner with badges highlighting the exact expiring ingredients rescued by each meal.
- **Food Waste Prevention Impact Banner:** Highlights the total expiring items rescued and estimated grocery money saved.

### 4. 🛒 Smart Shopping List
- Groups missing ingredients by category (*Vegetables, Dairy, Fruits, Protein, Pantry*).
- **Budget Tracker:** Displays total estimated cost in ₹ INR against your target meal budget with progress meter.
- **Interactive Checkboxes:** Mark items as bought with line-through styling.
- **Clear Checked** and manual **Add Custom Item** form.

### 5. 📷 Gemini Vision Fridge Scanner
- Upload or capture a photo of your fridge interior or grocery counter.
- Analyzes food items using **Google Gemini Vision API** (`gemini-1.5-flash`).
- Displays detected ingredients with confidence scores, suggested shelf life from the lookup catalog, and editable quantities.
- Graceful offline/demo fallback if an API key is not configured.

### 6. ⚙️ Settings & Preferences
- **Kitchen Profile Name** (Default: *Alex*).
- **Budget per Meal Slider:** ₹80 to ₹600.
- **Max Cooking Time Slider:** 15m to 90m.
- **Dietary Restriction:** All, Vegetarian, Vegan, Eggless, Non-Veg.
- **Allergens Avoidance:** Dairy, Nuts, Gluten, Eggs, Soy, Fish, Shellfish.
- **Expiry Notification Toggles:** Native browser notification permissions for ingredients expiring within 2 days.
- **Reset to Sample Demo Data:** Re-seeds initial 37 pantry items and 42 recipes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn |
| **Database** | SQLite (`backend/smart_fridge.db`) |
| **AI Vision** | Google Gemini 1.5 Flash (`google-generativeai` / `google-genai`) |
| **Voice API** | HTML5 Web Speech API (`SpeechRecognition`) |

---

## 🚀 Setup & Run Instructions

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: 3.10+ (tested on Python 3.13)

### 2. Backend Setup
1. Open a terminal in the root folder and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```
3. (Optional) Set your Google Gemini API Key in `backend/.env`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *(Note: If left empty, the application automatically uses the built-in intelligent demo vision scanner).*
4. Start the FastAPI backend server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API will be live at `http://127.0.0.1:8000`.
   API documentation is available at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Setup
1. In a separate terminal, navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 📁 Repository Structure
```
Smart-Kitchen-Assistant/
├── backend/
│   ├── .env                    # Environment variables (Gemini API key)
│   ├── requirements.txt        # Backend Python dependencies
│   ├── database.py             # SQLite engine & session setup
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic validation schemas
│   ├── planner.py              # Zero-waste greedy meal planning engine
│   ├── gemini_service.py       # Google Gemini Vision photo analysis
│   ├── main.py                 # FastAPI REST API endpoints
│   └── data/
│       ├── shelf_life.json     # Standard shelf-life catalog (64+ items)
│       ├── recipes.json        # 42 curated recipes in INR ₹ with steps
│       ├── seed_pantry.json    # Initial pantry inventory
│       └── generate_recipes.py # Seed data generator script
├── frontend/
│   ├── package.json
│   ├── vite.config.js          # Tailwind v4 & /api proxy config
│   ├── index.html              # HTML with Google Fonts & responsive meta
│   └── src/
│       ├── index.css           # Tailwind CSS v4 @import & design tokens
│       ├── main.jsx
│       ├── App.jsx             # Mobile-first frame & routing
│       ├── components/
│       │   ├── Header.jsx                # Orange header with greeting & weather
│       │   ├── MascotChef.jsx            # SVG Robot Chef Mascot
│       │   ├── FridgeIllustration.jsx    # SVG Smart Fridge illustration
│       │   ├── FridgeCard.jsx            # "My Fridge" summary card
│       │   ├── SearchBar.jsx             # Mic voice input & camera scan
│       │   ├── AvailableIngredients.jsx  # 4-column ingredients grid
│       │   ├── RecommendedRecipeBanner.jsx # Hero Creamy Mushroom Pasta card
│       │   ├── MoreRecipesRow.jsx        # Horizontal scrolling recipe cards
│       │   ├── SmartSuggestions.jsx      # Robot mascot suggestions
│       │   ├── BottomNav.jsx             # 5 pinned navigation tabs
│       │   ├── ExpiryAlertBanner.jsx     # <= 2 days alert banner & browser push
│       │   ├── RecipeModal.jsx           # Owned vs missing breakdown & Cook Now
│       │   ├── AddIngredientsModal.jsx   # Gemini scan, comma text, & manual
│       │   └── CookSuccessModal.jsx      # Confetti celebration modal
│       ├── pages/
│       │   ├── HomeScreen.jsx
│       │   ├── RecipesScreen.jsx
│       │   ├── PantryScreen.jsx
│       │   ├── MealPlannerScreen.jsx
│       │   ├── ShoppingScreen.jsx
│       │   └── SettingsScreen.jsx
│       └── services/
│           └── api.js                    # REST API client
└── README.md
```

---

## 🧪 Testing the Core Flows

1. **Expiring Ingredients & AI Recommendation:**
   - Look at the **AI Recommended Recipe** on the Home screen. It highlights *Creamy Mushroom Pasta* which utilizes mushrooms, heavy cream, and butter (items marked as expiring soon in the fridge).
2. **One-Tap Cooking & Pantry Deduction:**
   - Click **"Cook Now"** on any recipe. Notice the confetti celebration, confirmation of deducted ingredients, and how your fridge inventory automatically updates!
3. **Zero-Waste Meal Planner:**
   - Navigate to the **Meal Planner** tab.
   - Choose **3 Days** and click **"Generate 3-Day Zero Waste Plan"**.
   - Review the schedule: each meal clearly lists the expiring items it rescued!
   - Click **"Sync Missing"** to push all required ingredients into your **Shopping** tab.
4. **Voice Input:**
   - On the Home search bar, click the 🎙️ **Mic** icon and speak an ingredient (e.g. *"tomatoes"* or *"milk"*).
5. **Photo Scan:**
   - Click the 📷 **Camera** icon in the search bar to upload a fridge photo and inspect detected ingredients.
>>>>>>> a66989c (almost done)
