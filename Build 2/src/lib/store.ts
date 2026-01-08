import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ingredient categories for shopping list organization
export type IngredientCategory =
  | 'produce'
  | 'meats'
  | 'dairy'
  | 'grains'
  | 'spices'
  | 'canned'
  | 'frozen'
  | 'beverages'
  | 'condiments'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  category: IngredientCategory;
  checked: boolean;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  imageUri: string;
  ingredients: Omit<Ingredient, 'checked'>[];
  instructions: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
  folderId: string;
  createdAt: number;
  caloriesPerServing: number;
  macros: MacroNutrients;
  isSuggested?: boolean;
  rating?: number; // 0-5, in 0.5 increments
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentId?: string; // For subfolders - if undefined, it's a top-level folder
}

export interface MealLog {
  id: string;
  recipeId: string;
  recipeTitle: string;
  servings: number;
  calories: number;
  macros: MacroNutrients;
  date: string; // YYYY-MM-DD format
  timestamp: number;
  ingredients?: Array<{
    name: string;
    amount: string;
  }>;
  instructions?: string[];
}

// Custom saved meals for quick logging
export interface SavedCustomMeal {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  ingredients: Array<{
    name: string;
    servings: number;
    calories: number;
  }>;
  createdAt: number;
}

//Custom ingredients created by user
export interface CustomIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  caloriesPer100g: number;
  macrosPer100g: MacroNutrients;
  defaultServingGrams: number;
  servingDescription: string;
  isCustom: true;
  createdAt: number;
}

// Custom restaurants created by user
export interface CustomRestaurant {
  id: string;
  name: string;
  category: 'fast-food' | 'healthy' | 'sit-down' | 'breakfast' | 'custom';
  createdAt: number;
}

// Custom or user-added restaurant meals
export interface CustomRestaurantMeal {
  id: string;
  restaurant: string; // Name of restaurant (can be custom or prefab)
  name: string;
  calories: number;
  macros: MacroNutrients;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isCustom: true;
  createdAt: number;
}

// Weight tracking entry
export interface WeightEntry {
  id: string;
  weight: number; // in lbs
  date: string; // YYYY-MM-DD
  timestamp: number;
}

// Exercise log entry
export interface ExerciseLog {
  id: string;
  name: string;
  reps?: number;
  sets?: number;
  duration?: number; // in minutes
  type: 'strength' | 'cardio' | 'walking';
  date: string; // YYYY-MM-DD
  timestamp: number;
}

// Widget preferences
export interface WidgetPreferences {
  showWeight: boolean;
  showBodyFat: boolean;
  showExerciseReps: boolean;
  showExerciseTime: boolean;
  showWalkingTime: boolean;
  showMacros: boolean;
}

export interface UserProfile {
  weight: number; // in lbs
  height: number; // in inches
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goalWeight: number;
  goalType: 'lose' | 'maintain' | 'gain';
  bodyFat?: number; // percentage
  avoidedIngredients?: string[]; // List of ingredients to avoid in AI-generated recipes
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isCustom?: boolean; // true if user manually set macros, false if auto-calculated
}

// User authentication
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: number;
}


// Meal plan for a specific day
export interface MealPlan {
  id: string;
  date: string; // YYYY-MM-DD
  meals: {
    breakfast?: Recipe | SavedCustomMeal;
    lunch?: Recipe | SavedCustomMeal;
    dinner?: Recipe | SavedCustomMeal;
    snack?: Recipe | SavedCustomMeal;
  };
  totalCalories: number;
  totalMacros: MacroNutrients;
  createdAt: number;
}

interface RecipeState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;

  recipes: Recipe[];
  folders: Folder[];
  shoppingList: Ingredient[];
  mealLogs: MealLog[];
  savedCustomMeals: SavedCustomMeal[];
  customIngredients: CustomIngredient[];
  customRestaurants: CustomRestaurant[];
  customRestaurantMeals: CustomRestaurantMeal[];
  weightEntries: WeightEntry[];
  exerciseLogs: ExerciseLog[];
  widgetPreferences: WidgetPreferences;
  mealPlans: MealPlan[];
  userProfile: UserProfile | null;
  dailyGoals: DailyGoals | null;

  // Recipe actions
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  moveRecipeToFolder: (recipeId: string, folderId: string) => void;
  findDuplicateRecipe: (title: string) => Recipe | null;
  setRecipeRating: (recipeId: string, rating: number) => void;

  // Folder actions
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  // Shopping list actions
  addToShoppingList: (ingredients: Omit<Ingredient, 'checked'>[]) => void;
  toggleShoppingItem: (id: string) => void;
  removeFromShoppingList: (id: string) => void;
  clearShoppingList: () => void;
  clearCheckedItems: () => void;

  // Meal logging actions
  logMeal: (log: MealLog) => void;
  removeMealLog: (id: string) => void;
  getMealLogsForDate: (date: string) => MealLog[];

  // Custom meal actions
  saveCustomMeal: (meal: SavedCustomMeal) => void;
  deleteCustomMeal: (id: string) => void;

  // Custom ingredient actions
  addCustomIngredient: (ingredient: CustomIngredient) => void;
  deleteCustomIngredient: (id: string) => void;

  // Custom restaurant actions
  addCustomRestaurant: (restaurant: CustomRestaurant) => void;
  deleteCustomRestaurant: (id: string) => void;
  addCustomRestaurantMeal: (meal: CustomRestaurantMeal) => void;
  deleteCustomRestaurantMeal: (id: string) => void;

  // Weight tracking actions
  addWeightEntry: (entry: WeightEntry) => void;
  deleteWeightEntry: (id: string) => void;
  getLatestWeight: () => WeightEntry | null;

  // Exercise log actions
  addExerciseLog: (log: ExerciseLog) => void;
  deleteExerciseLog: (id: string) => void;
  getExerciseLogsForDate: (date: string) => ExerciseLog[];

  // Widget preferences actions
  updateWidgetPreferences: (preferences: Partial<WidgetPreferences>) => void;

  // Meal plan actions
  addMealPlan: (plan: MealPlan) => void;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  getMealPlanForDate: (date: string) => MealPlan | null;

  // Profile actions
  setUserProfile: (profile: UserProfile) => void;
  setDailyGoals: (goals: DailyGoals) => void;
  setCustomMacros: (protein: number, carbs: number, fat: number) => void;
  addAvoidedIngredient: (ingredient: string) => void;
  removeAvoidedIngredient: (ingredient: string) => void;

  // Authentication actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
}

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'breakfast', name: 'Breakfast', color: '#FFA726', icon: 'Sunrise' },
  { id: 'lunch', name: 'Lunch', color: '#66BB6A', icon: 'Sun' },
  { id: 'dinner', name: 'Dinner', color: '#5C6BC0', icon: 'Moon' },
  { id: 'desserts', name: 'Desserts', color: '#EC407A', icon: 'Cake' },
  { id: 'snacks', name: 'Snacks', color: '#26C6DA', icon: 'Cookie' },
  { id: 'drinks', name: 'Drinks', color: '#AB47BC', icon: 'Wine' },
];

export const useStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      isAuthenticated: false,

      recipes: [],
      folders: DEFAULT_FOLDERS,
      shoppingList: [],
      mealLogs: [],
      savedCustomMeals: [],
      customIngredients: [],
      customRestaurants: [],
      customRestaurantMeals: [],
      weightEntries: [],
      exerciseLogs: [],
      widgetPreferences: {
        showWeight: true,
        showBodyFat: false,
        showExerciseReps: false,
        showExerciseTime: false,
        showWalkingTime: false,
        showMacros: true,
      },
      mealPlans: [],
      userProfile: null,
      dailyGoals: null,

      addRecipe: (recipe) =>
        set((state) => ({ recipes: [recipe, ...state.recipes] })),

      updateRecipe: (id, updates) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),

      moveRecipeToFolder: (recipeId, folderId) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipeId ? { ...r, folderId } : r
          ),
        })),

      findDuplicateRecipe: (title) => {
        const recipes = get().recipes;
        const normalizedTitle = title.toLowerCase().trim();
        return recipes.find((r) =>
          r.title.toLowerCase().trim() === normalizedTitle
        ) || null;
      },

      setRecipeRating: (recipeId, rating) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipeId ? { ...r, rating } : r
          ),
        })),

      addFolder: (folder) =>
        set((state) => ({ folders: [...state.folders, folder] })),

      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          recipes: state.recipes.map((r) =>
            r.folderId === id ? { ...r, folderId: '' } : r
          ),
        })),

      addToShoppingList: (ingredients) =>
        set((state) => {
          const newItems: Ingredient[] = ingredients.map((ing) => ({
            ...ing,
            id: `${ing.id}-${Date.now()}-${Math.random()}`,
            checked: false,
          }));
          return { shoppingList: [...state.shoppingList, ...newItems] };
        }),

      toggleShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),

      removeFromShoppingList: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        })),

      clearShoppingList: () => set({ shoppingList: [] }),

      clearCheckedItems: () =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => !item.checked),
        })),

      logMeal: (log) =>
        set((state) => ({ mealLogs: [log, ...state.mealLogs] })),

      removeMealLog: (id) =>
        set((state) => ({
          mealLogs: state.mealLogs.filter((log) => log.id !== id),
        })),

      getMealLogsForDate: (date) => {
        return get().mealLogs.filter((log) => log.date === date);
      },

      saveCustomMeal: (meal) =>
        set((state) => ({ savedCustomMeals: [meal, ...state.savedCustomMeals] })),

      deleteCustomMeal: (id) =>
        set((state) => ({
          savedCustomMeals: state.savedCustomMeals.filter((m) => m.id !== id),
        })),

      addCustomIngredient: (ingredient) =>
        set((state) => ({ customIngredients: [ingredient, ...state.customIngredients] })),

      deleteCustomIngredient: (id) =>
        set((state) => ({
          customIngredients: state.customIngredients.filter((i) => i.id !== id),
        })),

      addCustomRestaurant: (restaurant) =>
        set((state) => ({ customRestaurants: [restaurant, ...state.customRestaurants] })),

      deleteCustomRestaurant: (id) =>
        set((state) => ({
          customRestaurants: state.customRestaurants.filter((r) => r.id !== id),
          customRestaurantMeals: state.customRestaurantMeals.filter(
            (m) => m.restaurant !== state.customRestaurants.find((r) => r.id === id)?.name
          ),
        })),

      addCustomRestaurantMeal: (meal) =>
        set((state) => ({ customRestaurantMeals: [meal, ...state.customRestaurantMeals] })),

      deleteCustomRestaurantMeal: (id) =>
        set((state) => ({
          customRestaurantMeals: state.customRestaurantMeals.filter((m) => m.id !== id),
        })),

      addWeightEntry: (entry) =>
        set((state) => {
          // Remove any existing entries for the same date (overwrite behavior)
          const filteredEntries = state.weightEntries.filter((e) => e.date !== entry.date);
          return { weightEntries: [entry, ...filteredEntries] };
        }),

      deleteWeightEntry: (id) =>
        set((state) => ({
          weightEntries: state.weightEntries.filter((e) => e.id !== id),
        })),

      getLatestWeight: () => {
        const entries = get().weightEntries;
        if (entries.length === 0) return null;

        // First, sort by date (most recent date first), then by timestamp (latest first)
        const sorted = [...entries].sort((a, b) => {
          const dateComparison = b.date.localeCompare(a.date);
          if (dateComparison !== 0) return dateComparison;
          return b.timestamp - a.timestamp;
        });

        return sorted[0];
      },

      addExerciseLog: (log) =>
        set((state) => ({ exerciseLogs: [log, ...state.exerciseLogs] })),

      deleteExerciseLog: (id) =>
        set((state) => ({
          exerciseLogs: state.exerciseLogs.filter((l) => l.id !== id),
        })),

      getExerciseLogsForDate: (date) => {
        return get().exerciseLogs.filter((log) => log.date === date);
      },

      updateWidgetPreferences: (preferences) =>
        set((state) => ({
          widgetPreferences: { ...state.widgetPreferences, ...preferences },
        })),

      addMealPlan: (plan) =>
        set((state) => ({ mealPlans: [plan, ...state.mealPlans] })),

      updateMealPlan: (id, updates) =>
        set((state) => ({
          mealPlans: state.mealPlans.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteMealPlan: (id) =>
        set((state) => ({
          mealPlans: state.mealPlans.filter((p) => p.id !== id),
        })),

      getMealPlanForDate: (date) => {
        return get().mealPlans.find((plan) => plan.date === date) || null;
      },

      setUserProfile: (profile) => set({ userProfile: profile }),

      setDailyGoals: (goals) => set({ dailyGoals: goals }),

      setCustomMacros: (protein, carbs, fat) => {
        const currentGoals = get().dailyGoals;
        if (!currentGoals) return;

        // Calculate calories from macros (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
        const calories = protein * 4 + carbs * 4 + fat * 9;

        set({
          dailyGoals: {
            calories,
            protein,
            carbs,
            fat,
            isCustom: true,
          },
        });
      },

      addAvoidedIngredient: (ingredient) => {
        const profile = get().userProfile;
        if (!profile) return;

        const avoidedIngredients = profile.avoidedIngredients || [];
        if (avoidedIngredients.includes(ingredient)) return;

        set({
          userProfile: {
            ...profile,
            avoidedIngredients: [...avoidedIngredients, ingredient],
          },
        });
      },

      removeAvoidedIngredient: (ingredient) => {
        const profile = get().userProfile;
        if (!profile) return;

        const avoidedIngredients = profile.avoidedIngredients || [];
        set({
          userProfile: {
            ...profile,
            avoidedIngredients: avoidedIngredients.filter((i) => i !== ingredient),
          },
        });
      },

      // Authentication actions
      login: async (email, password) => {
        // Get stored users from AsyncStorage
        try {
          const usersJson = await AsyncStorage.getItem('plated-users');
          const users: Array<{ email: string; username: string; password: string; id: string; createdAt: number }> = usersJson ? JSON.parse(usersJson) : [];

          const user = users.find(u => u.email === email && u.password === password);

          if (user) {
            set({
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
              },
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      signup: async (email, username, password) => {
        try {
          // Get existing users
          const usersJson = await AsyncStorage.getItem('plated-users');
          const users: Array<{ email: string; username: string; password: string; id: string; createdAt: number }> = usersJson ? JSON.parse(usersJson) : [];

          // Check if email already exists
          if (users.find(u => u.email === email)) {
            return false;
          }

          // Create new user
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            username,
            password, // In production, this should be hashed
            createdAt: Date.now(),
          };

          users.push(newUser);
          await AsyncStorage.setItem('plated-users', JSON.stringify(users));

          // Log the user in
          set({
            user: {
              id: newUser.id,
              email: newUser.email,
              username: newUser.username,
              createdAt: newUser.createdAt,
            },
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error('Signup error:', error);
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      resetPassword: async (email, newPassword) => {
        try {
          const usersJson = await AsyncStorage.getItem('plated-users');
          const users: Array<{ email: string; username: string; password: string; id: string; createdAt: number }> = usersJson ? JSON.parse(usersJson) : [];

          const userIndex = users.findIndex(u => u.email === email.toLowerCase().trim());

          if (userIndex === -1) {
            return false;
          }

          users[userIndex].password = newPassword;
          await AsyncStorage.setItem('plated-users', JSON.stringify(users));
          return true;
        } catch (error) {
          console.error('Reset password error:', error);
          return false;
        }
      },

      checkEmailExists: async (email) => {
        try {
          const usersJson = await AsyncStorage.getItem('plated-users');
          const users: Array<{ email: string; username: string; password: string; id: string; createdAt: number }> = usersJson ? JSON.parse(usersJson) : [];

          return users.some(u => u.email === email.toLowerCase().trim());
        } catch (error) {
          console.error('Check email error:', error);
          return false;
        }
      },
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions for calculations
export function calculateBMI(weightLbs: number, heightInches: number): number {
  return (weightLbs / (heightInches * heightInches)) * 703;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calculateTDEE(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  const weightKg = profile.weight * 0.453592;
  const heightCm = profile.height * 2.54;

  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  return Math.round(bmr * activityMultipliers[profile.activityLevel]);
}

export function calculateGoalCalories(
  tdee: number,
  goalType: 'lose' | 'maintain' | 'gain',
  weightDiff: number
): { calories: number; weeksToGoal: number; deficit: number } {
  if (goalType === 'maintain') {
    return { calories: tdee, weeksToGoal: 0, deficit: 0 };
  }

  // Safe rate: 1-2 lbs per week for weight loss, 0.5-1 lb for gain
  const weeklyChange = goalType === 'lose' ? 1.5 : 0.75;
  const caloriesPerLb = 3500;
  const dailyDeficit = (weeklyChange * caloriesPerLb) / 7;

  const targetCalories = goalType === 'lose'
    ? Math.max(tdee - dailyDeficit, 1200) // Minimum safe calories
    : tdee + dailyDeficit;

  const weeksToGoal = Math.abs(weightDiff) / weeklyChange;

  return {
    calories: Math.round(targetCalories),
    weeksToGoal: Math.round(weeksToGoal),
    deficit: Math.round(dailyDeficit),
  };
}

export function calculateMacros(
  calories: number,
  goalType: 'lose' | 'maintain' | 'gain'
): { protein: number; carbs: number; fat: number } {
  // Macro ratios based on goal
  let proteinRatio: number;
  let fatRatio: number;
  let carbRatio: number;

  if (goalType === 'lose') {
    // Higher protein to preserve muscle
    proteinRatio = 0.35;
    fatRatio = 0.30;
    carbRatio = 0.35;
  } else if (goalType === 'gain') {
    // Balanced with slightly more carbs for energy
    proteinRatio = 0.30;
    fatRatio = 0.25;
    carbRatio = 0.45;
  } else {
    // Maintenance - balanced
    proteinRatio = 0.30;
    fatRatio = 0.30;
    carbRatio = 0.40;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9), // 9 cal per gram
  };
}

export function getTodayDateString(): string {
  // Use local date, not UTC, to match date-fns behavior in charts
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
