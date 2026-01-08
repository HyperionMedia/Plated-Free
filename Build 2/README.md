# Recipe Scanner & Calorie Tracker

A sleek, dark-themed mobile app for scanning recipes, tracking calories, and reaching your health goals.

## Features

### Authentication
- **User accounts** - Secure login and signup system with email, username, and password
- **Account persistence** - Your data stays saved between sessions
- **Profile management** - View your account details in the Settings screen
- **Secure logout** - Log out anytime from Settings
- All user data is stored locally and securely on your device

### Home Dashboard
- **Visual calorie tracking graph** showing daily intake over 7, 14, or 30 days with responsive flex-based layout
- **Three-line comparison**: Maintenance calories vs Weight loss target vs Actual consumption
- **Weight overlay graph**: Purple line showing weight progress over time with goal weight target line
- **Separate weight tracking graph**: Dedicated graph showing weight progression with current weight, goal weight, and distance to goal
- **Daily macros graph**: Track protein, carbs, and fat intake vs goals with grouped bar chart
  - Color-coded bars (blue=protein, amber=carbs, pink=fat)
  - Goal lines showing daily targets
  - Today's macro summary with current vs goal comparison
- Real-time progress tracking with stats:
  - Average actual calories
  - Days under/over target
  - Daily deficit calculations
  - Weight progression with goal visualization
- Beautiful, interactive bar chart with color-coded indicators
- Dual Y-axis: Calories (left) and Weight in pounds (right)
- Quick info panel showing maintenance, target, and deficit
- **App opens to Home tab by default** for quick access to dashboard
- **Customizable Dashboard Widgets**:
  - **Weight Tracking**: Display current weight with trend indicator (gain/loss)
  - **Body Fat %**: Track body fat percentage
  - **Macro Goals**: Quick view of daily protein, carbs, and fat targets
  - **Exercise Reps**: Total reps completed today
  - **Exercise Time**: Minutes spent exercising today
  - **Walking Time**: Minutes spent walking today
  - Show/hide widgets based on your preferences (all widgets are optional)
- **Weekly Meal Planner**:
  - **AI-generated meal plan** based on your weight and macro goals
  - **Respects custom macro targets** - AI uses your manually set macros when generating meals
  - **Respects avoided ingredients** - AI excludes your specified ingredients from all generated meals
  - **Introduces new recipe ideas** - doesn't require saved recipes
  - **Complete ingredients and cooking instructions** - All AI-generated meals include detailed ingredients and step-by-step instructions
  - **Dish-specific images** - Each meal includes a relevant image based on the recipe name
  - **Comprehensive drink image database** - 300+ alcoholic and non-alcoholic beverages including cocktails, spirits, wine, beer, and coffee drinks
  - Automatically generates meals that fit your calorie targets
  - Plan entire week with breakfast, lunch, and dinner
  - View daily calorie totals and macro breakdowns
  - **Clear & Regenerate**: Clear entire week and generate fresh meal plan
  - **Save meals to recipe book** - One-tap save for any meal from the plan
  - **Swap individual meals** - Two options:
    - **Choose from your saved recipes** - Replace a meal with any recipe from your recipe book
    - **AI generate a new meal** - Get a fresh AI-generated alternative with dish-specific image
  - One-tap generation for the whole week
  - Meals are varied, interesting, and nutritionally balanced
  - **Full-screen meal view** - Tap any meal to see complete details, ingredients, and instructions

### Recipe Management
- **Powerful search** - Search recipes by title, ingredients, or instructions with instant filtering
  - Clear X button to reset search
  - Works across all folders and recipe collections
  - Real-time results as you type
- **Recipe rating system** - Rate recipes out of 5 stars with half-star increments (0.5 star precision)
  - Tap "Tap to rate" to open the rating picker
  - Select ratings from 0.5 to 5.0 stars
  - Rating displayed on recipe cards with gold star icons
  - Update ratings anytime by tapping the current rating
- **Folder-first navigation with hierarchical browsing** - Browse recipes organized by category folders (Breakfast, Lunch, Dinner, Desserts, Snacks, Drinks)
  - Only top-level folders show on the main screen (no clutter from subfolders)
  - Tap any folder to see its subfolders and recipes
  - Tap a subfolder to drill down further (unlimited nesting)
  - Back button returns you to the parent folder
  - Each folder card shows recipe count and subfolder count (e.g., "5 recipes • 2 folders")
- **Create custom folders and subfolders** - Organize your recipes hierarchically:
  - Tap the "Create New Folder" button to make top-level folders
  - Each folder has a green folder+ button to add subfolders underneath it
  - Choose from 8 vibrant colors (Amber, Red, Green, Blue, Purple, Pink, Orange, Teal)
  - Select from 6 icons (Sunrise, Sun, Moon, Cake, Cookie, Wine)
  - Name your folders anything you want (e.g., "Smoothies", "Appetizers", "Meal Prep")
  - Subfolders are displayed in their parent folder with a "Subfolders" section
  - Move recipes to any folder or subfolder from the folder picker
  - Perfect for organizing recipes like "Breakfast → Smoothies" or "Dinner → Italian → Pasta"
- **Scan from anywhere** - Camera and Library buttons always visible for quick recipe scanning
- **Describe your recipe with AI** - Green "Describe Your Recipe" button creates complete recipes:
  - Describe any recipe in natural language (e.g., "healthy quinoa bowl with grilled chicken")
  - AI generates complete ingredients with amounts
  - AI creates step-by-step cooking instructions
  - Automatic nutritional information and macros
  - **Preview the generated recipe** before saving
  - **Choose the folder** where you want to save it
  - Perfect for recipes you know by heart but want documented
- **Import from URL** - Paste any recipe URL and AI automatically parses the webpage:
  - Extracts title, ingredients, instructions, and cooking times
  - Uses actual recipe images from the website
  - Estimates nutrition info if not available on the webpage
  - Automatically categorizes ingredients and suggests the right folder
  - Works with most recipe websites
- Take a photo of any recipe (from a cookbook, magazine, or handwritten)
- AI automatically extracts: title, ingredients, instructions, prep/cook time, servings
- **Automatic calorie and macro estimation** (protein, carbs, fat, fiber per serving)
- Each ingredient is categorized for organized shopping
- **Move recipes between folders and subfolders** - Folder button available on recipe cards and in full-screen detail view:
  - Tap the folder button on any recipe card or inside the detail view
  - Browse the hierarchical folder list showing all folders and subfolders
  - Create new folders or subfolders on the fly from the folder picker
  - Recipe moves immediately to the selected folder
- **Full-screen recipe view** - Tap any recipe to view ingredients and instructions in a beautiful, easy-to-read full-screen modal with "Move to Folder" button
- **Easy folder navigation** - Tap a folder to view its recipes, tap back to return to folder view
- **Log to Tracker button** - Quick-log any recipe to your daily calorie tracker with one tap
- **Duplicate recipe detection** - Warns you when saving a recipe with the same name as an existing one, with option to save anyway
- **Edit recipes** - Tap the blue edit button on any recipe card to modify:
  - Edit title, servings, prep time, and cook time
  - Update calories and macros (protein, carbs, fat, fiber)
  - Add, remove, or modify ingredients and amounts
  - Add, remove, or edit instruction steps
  - Changes are saved immediately when you tap the Save button
- **Share recipes** - Tap the purple share button to share recipes with friends:
  - Share as a shortened TinyURL link for easy sharing
  - Opens directly in Plated app if installed, otherwise directs to App Store
  - Recipients can save the recipe directly to their collection with one tap
  - Includes recipe title and complete recipe data in the link
  - Share via text message, email, social media, or any messaging app
  - Perfect for sharing your favorite recipes with family and friends
- **Visual feedback notifications** - Toast notifications confirm actions:
  - "Added X ingredients to shopping list" when adding to cart (amber notification)
  - "[Recipe Name] logged to tracker" when logging meals (green notification)
  - Notifications appear at the top of the screen with smooth animations
  - Notifications work on recipe cards and in the full-screen recipe view
- **AI-powered image regeneration** - Don't like the recipe image?
  - Tap "Regenerate Image with AI" button at the bottom of any recipe card
  - Uses OpenAI's image generation to create a new professional food photo
  - AI generates realistic, appetizing images based on the recipe name
  - Loading state with haptic feedback during generation
  - Perfect for getting better visuals for your saved recipes

### Restaurant Tracking
- **Create custom restaurants** - Build your own restaurant database
- **Add custom meals to any restaurant** - Add meals to both custom and popular chain restaurants
- **Pre-built meals from 27+ popular restaurants**:
  - **Fast Food**: McDonald's, Chick-fil-A, Chipotle, Subway, Taco Bell, Wendy's, Panda Express, In-N-Out, Five Guys
  - **Healthy Chains**: Sweetgreen, CAVA, Freshii, Just Salad, Tender Greens, Panera Bread
  - **Sit-Down**: Olive Garden, Applebee's, Chili's, Cheesecake Factory, Red Lobster, Outback Steakhouse, Texas Roadhouse, Cracker Barrel
  - **Breakfast**: Starbucks, IHOP, Denny's
- **Customize restaurant meals** - Add extra ingredients to any restaurant order
- Adjust serving quantities for restaurant meals

### Calorie Tracking
- Log meals from your saved recipes
- **AI-powered meal logging** - Describe your meal in natural language and let AI do the work:
  - Type what you ate (e.g., "2 eggs scrambled with cheese and toast")
  - GPT automatically calculates calories and macros
  - AI breaks down the meal into individual ingredients with amounts
  - AI generates step-by-step cooking instructions
  - Instant logging with accurate nutritional breakdown
  - Perfect for quick meal tracking without manual ingredient selection
  - **Tap any AI-logged meal** to view full recipe card with ingredients and instructions
  - **Save AI meals to your recipe book** - One-tap save with disclaimer about AI estimates
- **Weight check-in on tracking page** - Log your daily weight with date-specific tracking
  - Quick weight logging interface with lbs input
  - Shows current weight for selected date
  - Update weight entries for any date
  - Multiple entries on same day: Latest entry by timestamp overwrites previous ones
  - Weight data automatically displayed on Home dashboard graphs
  - Current weight on graph shows the latest entry by date, then by timestamp
  - All dates use local timezone to ensure today's entries display correctly
- **Manual meal logging** - Build meals from 400+ ingredients across all categories:
  - **Proteins**: Poultry, beef, pork, seafood, plant-based (100+ items)
  - **Dairy & Eggs**: Milk, cheese, yogurt, eggs (40+ items)
  - **Grains & Carbs**: Rice, pasta, bread, cereals, potatoes (70+ items)
  - **Produce**: Vegetables and fruits (50+ items)
  - **Condiments & Sauces**: Oils, dressings, spreads (25+ items)
  - **Canned & Legumes**: Beans, tomatoes, preserved items (15+ items)
  - **Beverages**: Coffee, juices, alcohol, protein shakes (15+ items)
  - **Frozen Foods**: Pizza, ice cream, frozen meals (13+ items)
  - **Snacks**: Chips, nuts, candy, cookies (25+ items)
  - **Spices & Herbs**: Common seasonings (13+ items)
- **Add custom ingredients** - Create and save your own ingredients with custom portions and calories
- **Restaurant quick-log** - Log meals from 27+ restaurants or create your own custom restaurants
- **Add custom meals to restaurants** - Add meals to both custom and popular chain restaurants
- **Customize restaurant meals** - Add extra ingredients to any restaurant order
- Adjust serving sizes (0.5x, 1x, 1.5x, etc.)
- Daily calorie and macro progress ring
- View history by date
- Color-coded progress indicators

### Manual Meal Builder
- Pick ingredients from organized categories
- Search across all 400+ ingredients
- Build custom meals from multiple ingredients
- **Save custom meals** for quick re-logging
- Accurate calorie and macro calculations per serving

### Profile & Goals
- Enter your weight, height, age, gender, and activity level
- Automatic BMI calculation with category display
- TDEE (maintenance calories) calculation using Mifflin-St Jeor equation
- Set a goal weight and get personalized:
  - Daily calorie target
  - Macro breakdown (protein, carbs, fat)
  - Estimated time to reach goal
  - Safe deficit/surplus recommendations
- **Custom Macro Goals**:
  - Override auto-calculated macros with your own targets
  - Manually set protein, carbs, and fat goals
  - Automatically calculates total calories from macros
  - Recipe suggestions adapt to your custom macros
  - Toggle between auto-calculated and custom macros
- **Avoid Ingredients**:
  - Specify ingredients to exclude from all AI-generated recipes
  - Type any ingredient or category (e.g., "seafood", "dairy", "nuts", "peanuts")
  - AI respects these preferences when generating meal plans and recipes
  - Perfect for allergies, dietary restrictions, or personal preferences
  - Add or remove avoided ingredients anytime

### AI Recipe Suggestions
- Get personalized recipe suggestions based on your goals
- **Adapts to custom macro goals** - Recipes reflect your manual macro targets
- Recipes optimized for weight loss (high protein, lower calorie) or muscle gain
- One-tap save suggested recipes to your collection
- **Dish-specific images** - Each AI-generated recipe includes a relevant food image based on the dish name

### Organized Folders
- Recipes auto-filed into suggested folders (Breakfast, Lunch, Dinner, Desserts, Snacks, Drinks)
- **Folder-first browsing** - See all folders first, tap to view recipes inside
- Move recipes between folders
- Each folder shows recipe count for easy organization

### Smart Shopping List
- Add all ingredients from a recipe with one tap
- Items organized by grocery store section (Produce, Meats, Dairy, Grains, Spices, etc.)
- Check off items as you shop
- Clear checked items or entire list

## Tabs

1. **Home** (Default) - Visual calorie tracking graph with progress stats, weight tracking graph, and weekly meal planner
2. **Meals** - Today's meal plan with detailed macros, save recipes, and swap meals
3. **Tracking** - Log meals, track daily calories/macros, and log weight check-ins
4. **Recipes** - Browse recipe folders, scan new recipes, and view your collection
5. **Shopping** - Organized grocery shopping list

**Settings icon** (top-right corner on all tabs) - Access health metrics, goals, account info, custom macro targets, and AI recipe suggestions

## How to Use

1. **Set Up Profile**: Tap the settings icon (top-right corner), enter your stats and goal weight
2. **Customize Macros (Optional)**: In Settings, tap "Custom Macros" to set your own protein/carbs/fat targets
3. **Generate Weekly Meal Plan**: On Home tab, tap the Weekly Meal Planner card to generate AI meals
4. **View Today's Meals**: Go to Meals tab to see today's breakfast, lunch, and dinner with detailed macros
5. **Save or Swap Meals**: In Meals tab, save any meal to your recipe book or swap it for a new one
6. **View Progress**: Home tab (default screen) shows your calorie tracking graph, weight progression, and macro trends over time
7. **Log Weight**: In Tracking tab, use the Weight Check-in section to log your daily weight
8. **Browse Recipe Folders**: In Recipes tab, tap any folder (Breakfast, Lunch, Dinner, etc.) to view recipes
9. **Scan Recipes**: Use the camera or photo library buttons to scan recipes from anywhere
10. **Log Meals**: Go to Tracking tab:
   - Tap "From Recipes" to log from your saved recipes
   - Tap "Log with AI" to describe your meal in natural language and let GPT calculate calories/macros
   - Tap "Log Manual" to:
     - Build a meal from 400+ ingredients
     - Select from 27+ popular restaurants
     - **Create your own custom restaurant**
     - **Add custom meals to any restaurant**
     - Add extra ingredients to restaurant orders
11. **Track Progress**: Monitor your daily calorie intake vs. goal on the Home screen
12. **Get Suggestions**: Tap "Get Recipe Suggestions" in Settings for goal-optimized recipes
13. **Shop**: Add ingredients to your shopping list from any recipe

## Technical Stack

- Expo SDK 53 / React Native 0.76.7
- Zustand with AsyncStorage persistence
- React Query for async operations
- OpenAI GPT-5.2 for image analysis and recipe suggestions
- RevenueCat for subscription management (9.6.13)
- NativeWind (Tailwind) for styling
- React Native Reanimated for smooth animations
- 400+ ingredient database with accurate nutrition data

## Recent Fixes

**TestFlight AI Features Fix (Jan 2026)**
- Added comprehensive error logging and validation for all AI API calls
- Added explicit API key checks with helpful error messages directing users to ENV tab
- Added specific error handling for common issues:
  - 401 errors: "OpenAI API authentication failed. Please check your API key in the ENV tab."
  - 429 errors: "OpenAI API rate limit exceeded. Please try again later."
- Enhanced logging with prefixed tags ([analyzeRecipe], [parseRecipeUrl], [generateRecipeImage]) for easier debugging
- All AI functions now fail gracefully with clear user-facing error messages
- Improved TestFlight diagnostics for API key configuration issues

**OpenAI API Integration Fix (Jan 2026)**
- Fixed all AI features to use correct OpenAI API endpoints and format
- Updated from incorrect `/v1/responses` endpoint to `/v1/chat/completions`
- Changed model from non-existent `gpt-5.2` to `gpt-4o` (supports vision for recipe scanning)
- Fixed image generation to use correct `dall-e-3` model
- Updated request/response format to match OpenAI's Chat Completions API
- All AI features now working correctly in both development and production (TestFlight)

**Runtime Error Fix (Jan 2026)**
- Fixed "runtime not ready" Hermes error caused by duplicate RevenueCat initialization
- Consolidated RevenueCat SDK usage into `revenuecatClient.ts` (single initialization at module load)
- Removed duplicate initialization from `_layout.tsx` and `subscriptions.ts`
- Updated `PremiumGuard.tsx` and `paywall.tsx` to use the centralized RevenueCat client
- Result: Clean initialization, no SDK conflicts, proper error handling for missing API keys

**iOS Build Issue (Jan 2026)**
- Fixed CocoaPods dependency conflict between `react-native-purchases` and `react-native-purchases-ui`
- Both packages now pinned to version 9.6.13 to ensure `PurchasesHybridCommon` compatibility
- This resolves the "Compatible versions of some pods could not be resolved" error

