import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  X,
  Search,
  ChevronRight,
  Plus,
  Minus,
  UtensilsCrossed,
  Salad,
  Store,
  Check,
  ChevronLeft,
  Bookmark,
  Leaf,
  Coffee,
  Utensils,
  Trash2,
  Heart,
} from 'lucide-react-native';
import {
  INGREDIENT_DATABASE,
  RESTAURANT_MEALS,
  CATEGORY_LABELS,
  getMealsByRestaurant,
  calculateNutrition,
  RESTAURANT_INFO,
  getAllRestaurantInfo,
  getMealsByRestaurantWithCustom,
  type FoodItem,
  type RestaurantMeal,
  type RestaurantCategory,
} from '@/lib/ingredientDatabase';
import {
  useStore,
  type IngredientCategory,
  type MacroNutrients,
  type MealLog,
  type SavedCustomMeal,
  type CustomRestaurant,
  type CustomRestaurantMeal,
} from '@/lib/store';
import { cn } from '@/lib/cn';

type LoggingMode = 'select' | 'ingredients' | 'restaurants' | 'saved' | 'create-restaurant' | 'create-meal';
type IngredientStep = 'category' | 'items' | 'servings';
type RestaurantStep = 'chains' | 'menu' | 'confirm' | 'customize';

interface SelectedIngredient {
  item: FoodItem;
  servings: number;
  calories: number;
  macros: MacroNutrients;
}

interface Props {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onLogMeal: (log: MealLog) => void;
}

const RESTAURANT_CATEGORY_LABELS: Record<RestaurantCategory, { label: string; icon: typeof Store }> = {
  'fast-food': { label: 'Fast Food', icon: Store },
  'healthy': { label: 'Healthy', icon: Leaf },
  'sit-down': { label: 'Sit-Down', icon: Utensils },
  'breakfast': { label: 'Breakfast', icon: Coffee },
};

export function ManualMealLogger({ visible, selectedDate, onClose, onLogMeal }: Props) {
  const savedCustomMeals = useStore((s) => s.savedCustomMeals);
  const saveCustomMeal = useStore((s) => s.saveCustomMeal);
  const deleteCustomMeal = useStore((s) => s.deleteCustomMeal);
  const customRestaurants = useStore((s) => s.customRestaurants);
  const customRestaurantMeals = useStore((s) => s.customRestaurantMeals);
  const addCustomRestaurant = useStore((s) => s.addCustomRestaurant);
  const deleteCustomRestaurant = useStore((s) => s.deleteCustomRestaurant);
  const addCustomRestaurantMeal = useStore((s) => s.addCustomRestaurantMeal);
  const deleteCustomRestaurantMeal = useStore((s) => s.deleteCustomRestaurantMeal);

  const [mode, setMode] = useState<LoggingMode>('select');

  // Ingredient flow state
  const [ingredientStep, setIngredientStep] = useState<IngredientStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [currentServings, setCurrentServings] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveMealName, setSaveMealName] = useState('');

  // Restaurant flow state
  const [restaurantStep, setRestaurantStep] = useState<RestaurantStep>('chains');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [selectedRestaurantCategory, setSelectedRestaurantCategory] = useState<RestaurantCategory | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<RestaurantMeal | null>(null);
  const [mealQuantity, setMealQuantity] = useState(1);
  const [supplementIngredients, setSupplementIngredients] = useState<SelectedIngredient[]>([]);

  // Create restaurant/meal state
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantCategory, setNewRestaurantCategory] = useState<RestaurantCategory>('fast-food');
  const [newMealName, setNewMealName] = useState('');
  const [newMealCalories, setNewMealCalories] = useState('');
  const [newMealProtein, setNewMealProtein] = useState('');
  const [newMealCarbs, setNewMealCarbs] = useState('');
  const [newMealFat, setNewMealFat] = useState('');
  const [newMealCategory, setNewMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [targetRestaurantForMeal, setTargetRestaurantForMeal] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setMode('select');
    setIngredientStep('category');
    setSelectedCategory(null);
    setSelectedIngredients([]);
    setCurrentItem(null);
    setCurrentServings(1);
    setSearchQuery('');
    setShowSaveModal(false);
    setSaveMealName('');
    setRestaurantStep('chains');
    setSelectedRestaurant(null);
    setSelectedRestaurantCategory(null);
    setSelectedMeal(null);
    setMealQuantity(1);
    setSupplementIngredients([]);
    setNewRestaurantName('');
    setNewRestaurantCategory('fast-food');
    setNewMealName('');
    setNewMealCalories('');
    setNewMealProtein('');
    setNewMealCarbs('');
    setNewMealFat('');
    setNewMealCategory('lunch');
    setTargetRestaurantForMeal(null);
  }, []);

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300);
  };

  // Calculate totals for selected ingredients
  const ingredientTotals = useMemo(() => {
    return selectedIngredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + ing.calories,
        protein: acc.protein + ing.macros.protein,
        carbs: acc.carbs + ing.macros.carbs,
        fat: acc.fat + ing.macros.fat,
        fiber: acc.fiber + ing.macros.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [selectedIngredients]);

  // Calculate supplement totals
  const supplementTotals = useMemo(() => {
    return supplementIngredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + ing.calories,
        protein: acc.protein + ing.macros.protein,
        carbs: acc.carbs + ing.macros.carbs,
        fat: acc.fat + ing.macros.fat,
        fiber: acc.fiber + ing.macros.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [supplementIngredients]);

  // Filter ingredients by search
  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedCategory
        ? INGREDIENT_DATABASE.filter(i => i.category === selectedCategory)
        : INGREDIENT_DATABASE;
    }
    const query = searchQuery.toLowerCase();
    const base = selectedCategory
      ? INGREDIENT_DATABASE.filter(i => i.category === selectedCategory)
      : INGREDIENT_DATABASE;
    return base.filter(i => i.name.toLowerCase().includes(query));
  }, [selectedCategory, searchQuery]);

  // Filter restaurants by category and search
  const filteredRestaurants = useMemo(() => {
    let restaurants = getAllRestaurantInfo(customRestaurants);
    if (selectedRestaurantCategory) {
      restaurants = restaurants.filter(r => r.category === selectedRestaurantCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      restaurants = restaurants.filter(r => r.name.toLowerCase().includes(query));
    }
    return restaurants;
  }, [selectedRestaurantCategory, searchQuery, customRestaurants]);

  // Filter restaurant meals by search
  const filteredMeals = useMemo(() => {
    if (!selectedRestaurant) return [];
    const meals = getMealsByRestaurantWithCustom(selectedRestaurant, customRestaurantMeals);
    if (!searchQuery.trim()) return meals;
    const query = searchQuery.toLowerCase();
    return meals.filter(m => m.name.toLowerCase().includes(query));
  }, [selectedRestaurant, searchQuery, customRestaurantMeals]);

  // Available categories that have items
  const availableCategories = useMemo(() => {
    const cats = [...new Set(INGREDIENT_DATABASE.map(i => i.category))];
    return cats.map(cat => ({
      id: cat,
      label: CATEGORY_LABELS[cat],
      count: INGREDIENT_DATABASE.filter(i => i.category === cat).length,
    }));
  }, []);

  const handleAddIngredient = () => {
    if (!currentItem) return;
    const nutrition = calculateNutrition(currentItem, currentServings);
    const newIngredient: SelectedIngredient = {
      item: currentItem,
      servings: currentServings,
      ...nutrition,
    };

    // Check if we're in restaurant customize mode
    if (restaurantStep === 'customize') {
      setSupplementIngredients(prev => [...prev, newIngredient]);
    } else {
      setSelectedIngredients(prev => [...prev, newIngredient]);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCurrentItem(null);
    setCurrentServings(1);

    if (restaurantStep === 'customize') {
      setRestaurantStep('confirm');
    } else {
      setIngredientStep('items');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleRemoveSupplement = (index: number) => {
    setSupplementIngredients(prev => prev.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSaveCustomMeal = () => {
    if (!saveMealName.trim() || selectedIngredients.length === 0) return;

    const meal: SavedCustomMeal = {
      id: `custom-${Date.now()}`,
      name: saveMealName.trim(),
      calories: ingredientTotals.calories,
      macros: {
        protein: ingredientTotals.protein,
        carbs: ingredientTotals.carbs,
        fat: ingredientTotals.fat,
        fiber: ingredientTotals.fiber,
      },
      ingredients: selectedIngredients.map(ing => ({
        name: ing.item.name,
        servings: ing.servings,
        calories: ing.calories,
      })),
      createdAt: Date.now(),
    };

    saveCustomMeal(meal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSaveModal(false);
    setSaveMealName('');
  };

  const handleLogIngredientMeal = (saveForLater = false) => {
    if (selectedIngredients.length === 0) return;

    if (saveForLater) {
      setShowSaveModal(true);
      return;
    }

    const mealTitle = selectedIngredients.length === 1
      ? selectedIngredients[0].item.name
      : `Custom Meal (${selectedIngredients.length} items)`;

    const log: MealLog = {
      id: `log-${Date.now()}`,
      recipeId: `manual-${Date.now()}`,
      recipeTitle: mealTitle,
      servings: 1,
      calories: ingredientTotals.calories,
      macros: {
        protein: ingredientTotals.protein,
        carbs: ingredientTotals.carbs,
        fat: ingredientTotals.fat,
        fiber: ingredientTotals.fiber,
      },
      date: selectedDate,
      timestamp: Date.now(),
    };

    onLogMeal(log);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleClose();
  };

  const handleLogSavedMeal = (meal: SavedCustomMeal) => {
    const log: MealLog = {
      id: `log-${Date.now()}`,
      recipeId: `saved-${meal.id}`,
      recipeTitle: meal.name,
      servings: 1,
      calories: meal.calories,
      macros: meal.macros,
      date: selectedDate,
      timestamp: Date.now(),
    };

    onLogMeal(log);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleClose();
  };

  const handleLogRestaurantMeal = () => {
    if (!selectedMeal) return;

    const baseCals = selectedMeal.calories * mealQuantity;
    const totalCals = baseCals + supplementTotals.calories;

    const supplementNames = supplementIngredients.length > 0
      ? ` + ${supplementIngredients.map(s => s.item.name).join(', ')}`
      : '';

    const log: MealLog = {
      id: `log-${Date.now()}`,
      recipeId: `restaurant-${selectedMeal.id}`,
      recipeTitle: `${selectedMeal.restaurant} - ${selectedMeal.name}${supplementNames}`,
      servings: mealQuantity,
      calories: totalCals,
      macros: {
        protein: selectedMeal.macros.protein * mealQuantity + supplementTotals.protein,
        carbs: selectedMeal.macros.carbs * mealQuantity + supplementTotals.carbs,
        fat: selectedMeal.macros.fat * mealQuantity + supplementTotals.fat,
        fiber: selectedMeal.macros.fiber * mealQuantity + supplementTotals.fiber,
      },
      date: selectedDate,
      timestamp: Date.now(),
    };

    onLogMeal(log);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleClose();
  };

  const handleCreateRestaurant = () => {
    if (!newRestaurantName.trim()) return;

    const restaurant: CustomRestaurant = {
      id: `custom-restaurant-${Date.now()}`,
      name: newRestaurantName.trim(),
      category: newRestaurantCategory,
      createdAt: Date.now(),
    };

    addCustomRestaurant(restaurant);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewRestaurantName('');
    setMode('restaurants');
  };

  const handleCreateMeal = () => {
    if (!newMealName.trim() || !newMealCalories.trim() || !targetRestaurantForMeal) return;

    const calories = parseInt(newMealCalories);
    const protein = parseInt(newMealProtein) || 0;
    const carbs = parseInt(newMealCarbs) || 0;
    const fat = parseInt(newMealFat) || 0;

    if (isNaN(calories)) return;

    const meal: CustomRestaurantMeal = {
      id: `custom-meal-${Date.now()}`,
      restaurant: targetRestaurantForMeal,
      name: newMealName.trim(),
      calories,
      macros: {
        protein,
        carbs,
        fat,
        fiber: 0,
      },
      category: newMealCategory,
      isCustom: true,
      createdAt: Date.now(),
    };

    addCustomRestaurantMeal(meal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewMealName('');
    setNewMealCalories('');
    setNewMealProtein('');
    setNewMealCarbs('');
    setNewMealFat('');
    setTargetRestaurantForMeal(null);
    setMode('restaurants');
    setRestaurantStep('menu');
    setSelectedRestaurant(targetRestaurantForMeal);
  };

  const renderModeSelection = () => (
    <Animated.View entering={FadeIn} className="p-5">
      <Text className="text-zinc-400 text-sm mb-4 text-center">
        How would you like to log your meal?
      </Text>

      {/* Saved Meals - show if there are any */}
      {savedCustomMeals.length > 0 && (
        <Pressable
          onPress={() => {
            setMode('saved');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          className="bg-zinc-800 rounded-2xl p-5 mb-3 active:bg-zinc-700"
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-pink-500/20 items-center justify-center">
              <Heart size={24} color="#EC4899" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white font-bold text-lg">Saved Meals</Text>
              <Text className="text-zinc-400 text-sm mt-0.5">
                {savedCustomMeals.length} saved meal{savedCustomMeals.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <ChevronRight size={20} color="#71717A" />
          </View>
        </Pressable>
      )}

      <Pressable
        onPress={() => {
          setMode('ingredients');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        className="bg-zinc-800 rounded-2xl p-5 mb-3 active:bg-zinc-700"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-emerald-500/20 items-center justify-center">
            <Salad size={24} color="#10B981" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-bold text-lg">By Ingredients</Text>
            <Text className="text-zinc-400 text-sm mt-0.5">
              Build a meal from individual foods
            </Text>
          </View>
          <ChevronRight size={20} color="#71717A" />
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          setMode('restaurants');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        className="bg-zinc-800 rounded-2xl p-5 active:bg-zinc-700"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-amber-500/20 items-center justify-center">
            <Store size={24} color="#F59E0B" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-bold text-lg">Restaurant Meals</Text>
            <Text className="text-zinc-400 text-sm mt-0.5">
              Quick log from popular chains
            </Text>
          </View>
          <ChevronRight size={20} color="#71717A" />
        </View>
      </Pressable>
    </Animated.View>
  );

  const renderSavedMeals = () => (
    <Animated.View entering={FadeIn} className="flex-1">
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {savedCustomMeals.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-zinc-500 text-center">
              No saved meals yet.{'\n'}Create one from ingredients!
            </Text>
          </View>
        ) : (
          savedCustomMeals.map((meal, index) => (
            <Animated.View key={meal.id} entering={FadeIn.delay(index * 30)}>
              <View className="bg-zinc-800 rounded-xl p-4 mb-2">
                <View className="flex-row items-center justify-between">
                  <Pressable
                    onPress={() => handleLogSavedMeal(meal)}
                    className="flex-1 active:opacity-70"
                  >
                    <Text className="text-white font-semibold">{meal.name}</Text>
                    <Text className="text-zinc-500 text-sm mt-0.5">
                      {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
                    </Text>
                    <Text className="text-amber-500 font-bold mt-1">
                      {meal.calories} cal
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      deleteCustomMeal(meal.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    className="w-10 h-10 rounded-full bg-zinc-700 items-center justify-center active:bg-zinc-600"
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderIngredientFlow = () => {
    if (ingredientStep === 'servings' && currentItem) {
      const preview = calculateNutrition(currentItem, currentServings);
      return (
        <Animated.View entering={FadeIn} className="p-5">
          <Pressable
            onPress={() => {
              setCurrentItem(null);
              setCurrentServings(1);
              setIngredientStep('items');
            }}
            className="flex-row items-center mb-4"
          >
            <ChevronLeft size={20} color="#71717A" />
            <Text className="text-zinc-400 ml-1">Back to list</Text>
          </Pressable>

          <Text className="text-white text-2xl font-bold mb-1">
            {currentItem.name}
          </Text>
          <Text className="text-zinc-500 mb-6">
            {currentItem.servingDescription}
          </Text>

          <View className="flex-row items-center justify-center mb-6">
            <Pressable
              onPress={() => {
                if (currentServings > 0.5) {
                  setCurrentServings(s => s - 0.5);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
            >
              <Minus size={24} color="#fff" />
            </Pressable>
            <View className="mx-8 items-center">
              <Text className="text-white text-4xl font-bold">
                {currentServings}
              </Text>
              <Text className="text-zinc-500">servings</Text>
            </View>
            <Pressable
              onPress={() => {
                setCurrentServings(s => s + 0.5);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
            >
              <Plus size={24} color="#fff" />
            </Pressable>
          </View>

          <View className="bg-zinc-800 rounded-2xl p-4 mb-6">
            <Text className="text-amber-500 text-2xl font-bold">
              {preview.calories} cal
            </Text>
            <Text className="text-zinc-400 text-sm mt-1">
              P: {preview.macros.protein}g | C: {preview.macros.carbs}g | F: {preview.macros.fat}g
            </Text>
          </View>

          <Pressable
            onPress={handleAddIngredient}
            className="bg-emerald-500 rounded-2xl py-4 items-center active:bg-emerald-600"
          >
            <Text className="text-white font-bold text-lg">Add to Meal</Text>
          </Pressable>
        </Animated.View>
      );
    }

    if (ingredientStep === 'items' || ingredientStep === 'category') {
      return (
        <Animated.View entering={FadeIn} className="flex-1">
          <View className="px-5 pt-4">
            <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 py-3 mb-3">
              <Search size={18} color="#71717A" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search ingredients..."
                placeholderTextColor="#71717A"
                className="flex-1 ml-3 text-white text-base"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color="#71717A" />
                </Pressable>
              )}
            </View>
          </View>

          {selectedIngredients.length > 0 && (
            <View className="mx-5 mb-3">
              <LinearGradient
                colors={['#18181B', '#09090B']}
                style={{ borderRadius: 16, padding: 16 }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white font-semibold">
                    {selectedIngredients.length} item{selectedIngredients.length !== 1 ? 's' : ''} selected
                  </Text>
                  <Text className="text-amber-500 font-bold">
                    {ingredientTotals.calories} cal
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
                  {selectedIngredients.map((ing, idx) => (
                    <Pressable
                      key={`${ing.item.id}-${idx}`}
                      onPress={() => handleRemoveIngredient(idx)}
                      className="bg-zinc-700 rounded-lg px-3 py-1.5 mr-2 flex-row items-center"
                    >
                      <Text className="text-white text-sm">{ing.item.name}</Text>
                      <X size={12} color="#EF4444" style={{ marginLeft: 6 }} />
                    </Pressable>
                  ))}
                </ScrollView>
              </LinearGradient>
            </View>
          )}

          <View className="px-5 mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
              <Pressable
                onPress={() => {
                  setSelectedCategory(null);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={cn(
                  'px-4 py-2 rounded-full mr-2',
                  !selectedCategory ? 'bg-amber-500' : 'bg-zinc-800'
                )}
              >
                <Text className={cn('font-semibold', !selectedCategory ? 'text-black' : 'text-white')}>
                  All
                </Text>
              </Pressable>
              {availableCategories.map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full mr-2',
                    selectedCategory === cat.id ? 'bg-amber-500' : 'bg-zinc-800'
                  )}
                >
                  <Text className={cn('font-semibold', selectedCategory === cat.id ? 'text-black' : 'text-white')}>
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {filteredIngredients.map((item, index) => (
              <Animated.View key={item.id} entering={FadeIn.delay(Math.min(index * 15, 300))} layout={Layout.springify()}>
                <Pressable
                  onPress={() => {
                    setCurrentItem(item);
                    setIngredientStep('servings');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="bg-zinc-800 rounded-xl p-4 mb-2 active:bg-zinc-700"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-medium">{item.name}</Text>
                      <Text className="text-zinc-500 text-sm">{item.servingDescription}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-amber-500 font-semibold">
                        {Math.round((item.caloriesPer100g * item.defaultServingGrams) / 100)} cal
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#71717A" style={{ marginLeft: 8 }} />
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>

          {selectedIngredients.length > 0 && (
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-zinc-900 border-t border-zinc-800">
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => handleLogIngredientMeal(true)}
                  className="flex-1 bg-zinc-700 rounded-2xl py-4 flex-row items-center justify-center active:bg-zinc-600"
                >
                  <Bookmark size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Save</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleLogIngredientMeal(false)}
                  className="flex-[2] bg-amber-500 rounded-2xl py-4 flex-row items-center justify-center active:bg-amber-600"
                >
                  <Check size={20} color="#000" />
                  <Text className="text-black font-bold text-lg ml-2">
                    Log ({ingredientTotals.calories} cal)
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      );
    }

    return null;
  };

  const renderRestaurantFlow = () => {
    // Customize step - add extra ingredients
    if (restaurantStep === 'customize') {
      return (
        <Animated.View entering={FadeIn} className="flex-1">
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => {
                setCurrentItem(null);
                setCurrentServings(1);
                setRestaurantStep('confirm');
              }}
              className="flex-row items-center mb-3"
            >
              <ChevronLeft size={20} color="#71717A" />
              <Text className="text-zinc-400 ml-1">Back to meal</Text>
            </Pressable>

            <Text className="text-white text-lg font-bold mb-3">Add Extra Ingredients</Text>

            <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 py-3 mb-3">
              <Search size={18} color="#71717A" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search ingredients..."
                placeholderTextColor="#71717A"
                className="flex-1 ml-3 text-white text-base"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color="#71717A" />
                </Pressable>
              )}
            </View>
          </View>

          {currentItem ? (
            <View className="p-5">
              <Text className="text-white text-xl font-bold mb-1">{currentItem.name}</Text>
              <Text className="text-zinc-500 mb-6">{currentItem.servingDescription}</Text>

              <View className="flex-row items-center justify-center mb-6">
                <Pressable
                  onPress={() => {
                    if (currentServings > 0.5) {
                      setCurrentServings(s => s - 0.5);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                >
                  <Minus size={20} color="#fff" />
                </Pressable>
                <View className="mx-6 items-center">
                  <Text className="text-white text-3xl font-bold">{currentServings}</Text>
                  <Text className="text-zinc-500 text-sm">servings</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setCurrentServings(s => s + 0.5);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                >
                  <Plus size={20} color="#fff" />
                </Pressable>
              </View>

              <Pressable
                onPress={handleAddIngredient}
                className="bg-emerald-500 rounded-2xl py-4 items-center active:bg-emerald-600"
              >
                <Text className="text-white font-bold">Add to Meal</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              className="flex-1 px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {filteredIngredients.slice(0, 30).map((item, index) => (
                <Animated.View key={item.id} entering={FadeIn.delay(index * 20)}>
                  <Pressable
                    onPress={() => {
                      setCurrentItem(item);
                      setCurrentServings(1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="bg-zinc-800 rounded-xl p-4 mb-2 active:bg-zinc-700"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-white font-medium">{item.name}</Text>
                        <Text className="text-zinc-500 text-sm">{item.servingDescription}</Text>
                      </View>
                      <Text className="text-amber-500 font-semibold">
                        {Math.round((item.caloriesPer100g * item.defaultServingGrams) / 100)} cal
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      );
    }

    if (restaurantStep === 'confirm' && selectedMeal) {
      const baseCals = selectedMeal.calories * mealQuantity;
      const totalCals = baseCals + supplementTotals.calories;

      return (
        <Animated.View entering={FadeIn} className="flex-1">
          <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
            <Pressable
              onPress={() => {
                setSelectedMeal(null);
                setMealQuantity(1);
                setSupplementIngredients([]);
                setRestaurantStep('menu');
              }}
              className="flex-row items-center mb-4"
            >
              <ChevronLeft size={20} color="#71717A" />
              <Text className="text-zinc-400 ml-1">Back to menu</Text>
            </Pressable>

            <Text className="text-amber-500 text-sm font-medium mb-1">
              {selectedMeal.restaurant}
            </Text>
            <Text className="text-white text-2xl font-bold mb-6">
              {selectedMeal.name}
            </Text>

            <View className="flex-row items-center justify-center mb-6">
              <Pressable
                onPress={() => {
                  if (mealQuantity > 1) {
                    setMealQuantity(q => q - 1);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
              >
                <Minus size={24} color="#fff" />
              </Pressable>
              <View className="mx-8 items-center">
                <Text className="text-white text-4xl font-bold">{mealQuantity}</Text>
                <Text className="text-zinc-500">quantity</Text>
              </View>
              <Pressable
                onPress={() => {
                  setMealQuantity(q => q + 1);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
              >
                <Plus size={24} color="#fff" />
              </Pressable>
            </View>

            {/* Add extra ingredients button */}
            <Pressable
              onPress={() => {
                setSearchQuery('');
                setRestaurantStep('customize');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="bg-zinc-800 rounded-2xl p-4 mb-4 flex-row items-center justify-between active:bg-zinc-700"
            >
              <View className="flex-row items-center">
                <Plus size={20} color="#10B981" />
                <Text className="text-white font-medium ml-3">Add Extra Ingredients</Text>
              </View>
              <ChevronRight size={18} color="#71717A" />
            </Pressable>

            {/* Supplements list */}
            {supplementIngredients.length > 0 && (
              <View className="mb-4">
                <Text className="text-zinc-400 text-sm mb-2">Extra ingredients:</Text>
                {supplementIngredients.map((ing, idx) => (
                  <View key={`sup-${idx}`} className="bg-zinc-800 rounded-xl p-3 mb-2 flex-row items-center justify-between">
                    <View>
                      <Text className="text-white">{ing.item.name}</Text>
                      <Text className="text-zinc-500 text-sm">{ing.servings} serving{ing.servings !== 1 ? 's' : ''}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-amber-500 mr-3">+{ing.calories} cal</Text>
                      <Pressable onPress={() => handleRemoveSupplement(idx)}>
                        <X size={16} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Total preview */}
            <View className="bg-zinc-800 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-zinc-400">Base meal</Text>
                <Text className="text-white">{baseCals} cal</Text>
              </View>
              {supplementTotals.calories > 0 && (
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-zinc-400">Extras</Text>
                  <Text className="text-emerald-400">+{supplementTotals.calories} cal</Text>
                </View>
              )}
              <View className="border-t border-zinc-700 pt-2 mt-2">
                <Text className="text-amber-500 text-2xl font-bold">
                  {totalCals} cal total
                </Text>
                <Text className="text-zinc-400 text-sm mt-1">
                  P: {selectedMeal.macros.protein * mealQuantity + supplementTotals.protein}g |
                  C: {selectedMeal.macros.carbs * mealQuantity + supplementTotals.carbs}g |
                  F: {selectedMeal.macros.fat * mealQuantity + supplementTotals.fat}g
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleLogRestaurantMeal}
              className="bg-amber-500 rounded-2xl py-4 items-center active:bg-amber-600"
            >
              <Text className="text-black font-bold text-lg">Log Meal</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      );
    }

    if (restaurantStep === 'menu' && selectedRestaurant) {
      return (
        <Animated.View entering={FadeIn} className="flex-1">
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => {
                setSelectedRestaurant(null);
                setSearchQuery('');
                setRestaurantStep('chains');
              }}
              className="flex-row items-center mb-3"
            >
              <ChevronLeft size={20} color="#71717A" />
              <Text className="text-zinc-400 ml-1">All restaurants</Text>
            </Pressable>

            <Text className="text-white text-xl font-bold mb-3">
              {selectedRestaurant}
            </Text>

            <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 py-3 mb-3">
              <Search size={18} color="#71717A" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search menu..."
                placeholderTextColor="#71717A"
                className="flex-1 ml-3 text-white text-base"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color="#71717A" />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Add Meal Button */}
            <Pressable
              onPress={() => {
                setTargetRestaurantForMeal(selectedRestaurant);
                setMode('create-meal');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="bg-emerald-600 rounded-xl p-4 mb-3 active:bg-emerald-700"
            >
              <View className="flex-row items-center justify-center">
                <Plus size={20} color="#fff" />
                <Text className="text-white font-bold ml-2">Add Custom Meal</Text>
              </View>
            </Pressable>

            {filteredMeals.map((meal, index) => (
              <Animated.View key={meal.id} entering={FadeIn.delay(index * 25)}>
                <Pressable
                  onPress={() => {
                    setSelectedMeal(meal);
                    setRestaurantStep('confirm');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="bg-zinc-800 rounded-xl p-4 mb-2 active:bg-zinc-700"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-medium">{meal.name}</Text>
                      <Text className="text-zinc-500 text-xs mt-0.5 capitalize">{meal.category}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-amber-500 font-bold">{meal.calories} cal</Text>
                      <Text className="text-zinc-500 text-xs">
                        P:{meal.macros.protein}g C:{meal.macros.carbs}g F:{meal.macros.fat}g
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#71717A" style={{ marginLeft: 8 }} />
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      );
    }

    // Restaurant chains list with category filters
    return (
      <Animated.View entering={FadeIn} className="flex-1">
        <View className="px-5 pt-4">
          <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 py-3 mb-3">
            <Search size={18} color="#71717A" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search restaurants..."
              placeholderTextColor="#71717A"
              className="flex-1 ml-3 text-white text-base"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={18} color="#71717A" />
              </Pressable>
            )}
          </View>

          {/* Category filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} className="mb-3">
            <Pressable
              onPress={() => {
                setSelectedRestaurantCategory(null);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={cn(
                'px-4 py-2 rounded-full mr-2',
                !selectedRestaurantCategory ? 'bg-amber-500' : 'bg-zinc-800'
              )}
            >
              <Text className={cn('font-semibold', !selectedRestaurantCategory ? 'text-black' : 'text-white')}>
                All
              </Text>
            </Pressable>
            {(Object.keys(RESTAURANT_CATEGORY_LABELS) as RestaurantCategory[]).map(cat => {
              const { label } = RESTAURANT_CATEGORY_LABELS[cat];
              return (
                <Pressable
                  key={cat}
                  onPress={() => {
                    setSelectedRestaurantCategory(cat);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full mr-2',
                    selectedRestaurantCategory === cat ? 'bg-amber-500' : 'bg-zinc-800'
                  )}
                >
                  <Text className={cn('font-semibold', selectedRestaurantCategory === cat ? 'text-black' : 'text-white')}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Create Restaurant Button */}
          <Pressable
            onPress={() => {
              setMode('create-restaurant');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            className="bg-emerald-600 rounded-xl p-4 mb-3 active:bg-emerald-700"
          >
            <View className="flex-row items-center justify-center">
              <Plus size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">Create New Restaurant</Text>
            </View>
          </Pressable>

          {filteredRestaurants.map((restaurant, index) => {
            const mealCount = getMealsByRestaurantWithCustom(restaurant.name, customRestaurantMeals).length;
            const catInfo = RESTAURANT_CATEGORY_LABELS[restaurant.category];
            const IconComponent = catInfo.icon;
            const iconColor = restaurant.category === 'healthy' ? '#10B981' : '#F59E0B';

            return (
              <Animated.View key={restaurant.name} entering={FadeIn.delay(index * 25)}>
                <Pressable
                  onPress={() => {
                    setSelectedRestaurant(restaurant.name);
                    setSearchQuery('');
                    setRestaurantStep('menu');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="bg-zinc-800 rounded-xl p-4 mb-2 active:bg-zinc-700"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: restaurant.category === 'healthy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }}
                      >
                        <IconComponent size={18} color={iconColor} />
                      </View>
                      <View className="ml-3">
                        <Text className="text-white font-medium">{restaurant.name}</Text>
                        <Text className="text-zinc-500 text-sm">
                          {mealCount} items · {catInfo.label}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color="#71717A" />
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderCreateRestaurant = () => (
    <Animated.View entering={FadeIn} className="p-5">
      <Text className="text-zinc-400 mb-4">Create your own restaurant to add custom meals</Text>

      <Text className="text-white font-semibold mb-2">Restaurant Name</Text>
      <TextInput
        value={newRestaurantName}
        onChangeText={setNewRestaurantName}
        placeholder="Enter restaurant name..."
        placeholderTextColor="#71717A"
        className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
        autoFocus
      />

      <Text className="text-white font-semibold mb-2">Category</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {(Object.keys(RESTAURANT_CATEGORY_LABELS) as RestaurantCategory[]).map(cat => {
          const { label } = RESTAURANT_CATEGORY_LABELS[cat];
          return (
            <Pressable
              key={cat}
              onPress={() => setNewRestaurantCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full',
                newRestaurantCategory === cat ? 'bg-amber-500' : 'bg-zinc-800'
              )}
            >
              <Text className={cn('font-semibold', newRestaurantCategory === cat ? 'text-black' : 'text-white')}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleCreateRestaurant}
        disabled={!newRestaurantName.trim()}
        className={cn(
          'rounded-2xl py-4 items-center',
          newRestaurantName.trim() ? 'bg-emerald-500 active:bg-emerald-600' : 'bg-zinc-700 opacity-50'
        )}
      >
        <Text className={newRestaurantName.trim() ? 'text-white font-bold text-lg' : 'text-zinc-400 font-bold text-lg'}>
          Create Restaurant
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderCreateMeal = () => (
    <Animated.View entering={FadeIn} className="p-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-zinc-400 mb-4">
          Add a custom meal to {targetRestaurantForMeal}
        </Text>

        <Text className="text-white font-semibold mb-2">Meal Name *</Text>
        <TextInput
          value={newMealName}
          onChangeText={setNewMealName}
          placeholder="e.g., Custom Burger"
          placeholderTextColor="#71717A"
          className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
          autoFocus
        />

        <Text className="text-white font-semibold mb-2">Calories *</Text>
        <TextInput
          value={newMealCalories}
          onChangeText={setNewMealCalories}
          placeholder="e.g., 450"
          placeholderTextColor="#71717A"
          keyboardType="numeric"
          className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
        />

        <Text className="text-white font-semibold mb-2">Protein (g)</Text>
        <TextInput
          value={newMealProtein}
          onChangeText={setNewMealProtein}
          placeholder="Optional"
          placeholderTextColor="#71717A"
          keyboardType="numeric"
          className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
        />

        <Text className="text-white font-semibold mb-2">Carbs (g)</Text>
        <TextInput
          value={newMealCarbs}
          onChangeText={setNewMealCarbs}
          placeholder="Optional"
          placeholderTextColor="#71717A"
          keyboardType="numeric"
          className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
        />

        <Text className="text-white font-semibold mb-2">Fat (g)</Text>
        <TextInput
          value={newMealFat}
          onChangeText={setNewMealFat}
          placeholder="Optional"
          placeholderTextColor="#71717A"
          keyboardType="numeric"
          className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
        />

        <Text className="text-white font-semibold mb-2">Meal Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(cat => (
            <Pressable
              key={cat}
              onPress={() => setNewMealCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full',
                newMealCategory === cat ? 'bg-amber-500' : 'bg-zinc-800'
              )}
            >
              <Text className={cn('font-semibold capitalize', newMealCategory === cat ? 'text-black' : 'text-white')}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleCreateMeal}
          disabled={!newMealName.trim() || !newMealCalories.trim()}
          className={cn(
            'rounded-2xl py-4 items-center',
            (newMealName.trim() && newMealCalories.trim()) ? 'bg-emerald-500 active:bg-emerald-600' : 'bg-zinc-700 opacity-50'
          )}
        >
          <Text className={(newMealName.trim() && newMealCalories.trim()) ? 'text-white font-bold text-lg' : 'text-zinc-400 font-bold text-lg'}>
            Add Meal
          </Text>
        </Pressable>
      </ScrollView>
    </Animated.View>
  );

  const getTitle = () => {
    if (mode === 'select') return 'Log a Meal';
    if (mode === 'saved') return 'Saved Meals';
    if (mode === 'create-restaurant') return 'Create Restaurant';
    if (mode === 'create-meal') return 'Add Custom Meal';
    if (mode === 'ingredients') {
      if (ingredientStep === 'servings' && currentItem) return currentItem.name;
      return 'Pick Ingredients';
    }
    if (mode === 'restaurants') {
      if (restaurantStep === 'customize') return 'Add Extras';
      if (restaurantStep === 'confirm' && selectedMeal) return 'Customize Meal';
      if (restaurantStep === 'menu' && selectedRestaurant) return selectedRestaurant;
      return 'Restaurant Meals';
    }
    return 'Log a Meal';
  };

  const getHeaderIcon = () => {
    if (mode === 'saved') return <Heart size={20} color="#EC4899" style={{ marginRight: 8 }} />;
    if (mode === 'create-restaurant' || mode === 'create-meal') return <Plus size={20} color="#10B981" style={{ marginRight: 8 }} />;
    if (mode === 'ingredients') return <Salad size={20} color="#10B981" style={{ marginRight: 8 }} />;
    if (mode === 'restaurants') return <Store size={20} color="#F59E0B" style={{ marginRight: 8 }} />;
    return <UtensilsCrossed size={20} color="#F59E0B" style={{ marginRight: 8 }} />;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-zinc-900 rounded-t-3xl max-h-[90%] min-h-[60%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
            <View className="flex-row items-center">
              {mode !== 'select' && (
                <Pressable
                  onPress={() => {
                    if (mode === 'saved') {
                      setMode('select');
                    } else if (mode === 'create-restaurant') {
                      setNewRestaurantName('');
                      setMode('restaurants');
                    } else if (mode === 'create-meal') {
                      setNewMealName('');
                      setNewMealCalories('');
                      setNewMealProtein('');
                      setNewMealCarbs('');
                      setNewMealFat('');
                      setTargetRestaurantForMeal(null);
                      setMode('restaurants');
                      setRestaurantStep('menu');
                    } else if (mode === 'ingredients') {
                      if (ingredientStep === 'servings') {
                        setCurrentItem(null);
                        setCurrentServings(1);
                        setIngredientStep('items');
                      } else {
                        setMode('select');
                        setSearchQuery('');
                        setSelectedIngredients([]);
                      }
                    } else if (mode === 'restaurants') {
                      if (restaurantStep === 'customize') {
                        setCurrentItem(null);
                        setRestaurantStep('confirm');
                      } else if (restaurantStep === 'confirm') {
                        setSelectedMeal(null);
                        setMealQuantity(1);
                        setSupplementIngredients([]);
                        setRestaurantStep('menu');
                      } else if (restaurantStep === 'menu') {
                        setSelectedRestaurant(null);
                        setSearchQuery('');
                        setRestaurantStep('chains');
                      } else {
                        setMode('select');
                        setSearchQuery('');
                        setSelectedRestaurantCategory(null);
                      }
                    }
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="mr-3"
                >
                  <ChevronLeft size={24} color="#fff" />
                </Pressable>
              )}
              <View className="flex-row items-center">
                {getHeaderIcon()}
                <Text className="text-white text-lg font-bold">{getTitle()}</Text>
              </View>
            </View>
            <Pressable
              onPress={handleClose}
              className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center"
            >
              <X size={16} color="#fff" />
            </Pressable>
          </View>

          {/* Content */}
          {mode === 'select' && renderModeSelection()}
          {mode === 'saved' && renderSavedMeals()}
          {mode === 'ingredients' && renderIngredientFlow()}
          {mode === 'restaurants' && renderRestaurantFlow()}
          {mode === 'create-restaurant' && renderCreateRestaurant()}
          {mode === 'create-meal' && renderCreateMeal()}
        </View>
      </View>

      {/* Save Meal Modal */}
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View className="flex-1 bg-black/80 items-center justify-center px-5">
          <View className="bg-zinc-900 rounded-2xl p-5 w-full">
            <Text className="text-white text-lg font-bold mb-4">Save Custom Meal</Text>
            <TextInput
              value={saveMealName}
              onChangeText={setSaveMealName}
              placeholder="Meal name (e.g., My Breakfast)"
              placeholderTextColor="#71717A"
              className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base mb-4"
              autoFocus
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setShowSaveModal(false);
                  setSaveMealName('');
                }}
                className="flex-1 bg-zinc-700 rounded-xl py-3 items-center active:bg-zinc-600"
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleSaveCustomMeal();
                  handleLogIngredientMeal(false);
                }}
                disabled={!saveMealName.trim()}
                className={cn(
                  'flex-1 rounded-xl py-3 items-center',
                  saveMealName.trim() ? 'bg-amber-500 active:bg-amber-600' : 'bg-zinc-700 opacity-50'
                )}
              >
                <Text className={saveMealName.trim() ? 'text-black font-semibold' : 'text-zinc-400 font-semibold'}>
                  Save & Log
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
