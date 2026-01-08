import { View, Text, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import { useStore, type Recipe, type SavedCustomMeal, type Ingredient, type IngredientCategory, type MealLog } from '@/lib/store';
import { Calendar, ChefHat, X, Sparkles, Plus, BookmarkPlus, RefreshCw, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react-native';
import { format, addDays, startOfWeek } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { getRecipeImageUrl } from '@/lib/recipeImages';
import { router } from 'expo-router';

// Helper to get calories from either Recipe or SavedCustomMeal
const getCalories = (meal: Recipe | SavedCustomMeal): number => {
  if ('caloriesPerServing' in meal) {
    return meal.caloriesPerServing;
  }
  return meal.calories;
};

// Helper to get name from either Recipe or SavedCustomMeal
const getMealName = (meal: Recipe | SavedCustomMeal): string => {
  if ('title' in meal) {
    return meal.title;
  }
  return meal.name;
};

// Helper to convert string ingredients to Ingredient objects
const convertIngredients = (ingredients: string[]): Omit<Ingredient, 'checked'>[] => {
  return ingredients.map((ing, index) => ({
    id: `ing-${Date.now()}-${index}`,
    name: ing,
    amount: '1 serving',
    category: 'other' as IngredientCategory,
  }));
};

// Separate component to handle meal item touches properly on mobile
const MealItemCard = ({
  meal,
  mealType,
  isExpanded,
  onOpenRecipe,
  onSaveRecipe,
  onSwapMeal,
}: {
  meal: Recipe;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  isExpanded: boolean;
  onOpenRecipe: () => void;
  onSaveRecipe: () => void;
  onSwapMeal: () => void;
}) => {
  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onOpenRecipe();
        }}
        activeOpacity={0.7}
        style={{
          backgroundColor: 'rgba(39, 39, 42, 0.5)',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 14,
        }}
      >
        <View className="flex-row items-center">
          <Text className="text-zinc-500 text-xs w-20">{mealTypeLabels[mealType]}</Text>
          <Text className="text-white text-sm flex-1" numberOfLines={1}>{getMealName(meal)}</Text>
          <ChevronRight size={16} color="#71717A" />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View className="flex-row gap-2 mt-2">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSaveRecipe();
            }}
            activeOpacity={0.7}
            className="flex-1 bg-blue-600/20 rounded-lg py-2 flex-row items-center justify-center"
          >
            <BookmarkPlus size={14} color="#3B82F6" style={{ marginRight: 4 }} />
            <Text className="text-blue-400 text-xs font-semibold">Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSwapMeal();
            }}
            activeOpacity={0.7}
            className="flex-1 bg-amber-600/20 rounded-lg py-2 flex-row items-center justify-center"
          >
            <RefreshCw size={14} color="#F59E0B" style={{ marginRight: 4 }} />
            <Text className="text-amber-400 text-xs font-semibold">Swap</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export function WeeklyMealPlanner() {
  const [visible, setVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [swapMode, setSwapMode] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [swappingMeal, setSwappingMeal] = useState<{ date: string; type: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<{ meal: Recipe; dateStr: string; type: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
  const [showSwapOptions, setShowSwapOptions] = useState<{ dateStr: string; type: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
  const [showRecipeList, setShowRecipeList] = useState(false);
  const recipes = useStore((s) => s.recipes);
  const savedCustomMeals = useStore((s) => s.savedCustomMeals);
  const dailyGoals = useStore((s) => s.dailyGoals);
  const userProfile = useStore((s) => s.userProfile);
  const mealPlans = useStore((s) => s.mealPlans);
  const addMealPlan = useStore((s) => s.addMealPlan);
  const updateMealPlan = useStore((s) => s.updateMealPlan);
  const deleteMealPlan = useStore((s) => s.deleteMealPlan);
  const getMealPlanForDate = useStore((s) => s.getMealPlanForDate);
  const addRecipe = useStore((s) => s.addRecipe);
  const logMeal = useStore((s) => s.logMeal);
  const addToShoppingList = useStore((s) => s.addToShoppingList);

  const handleGenerateWeek = async () => {
    if (!dailyGoals || !userProfile) return;

    setGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
      const targetCalories = dailyGoals.calories;
      const caloriesPerMeal = Math.floor(targetCalories / 3);

      // Use AI to generate a weekly meal plan
      const avoidedIngredientsText = userProfile.avoidedIngredients && userProfile.avoidedIngredients.length > 0
        ? `\nIMPORTANT: DO NOT use these ingredients: ${userProfile.avoidedIngredients.join(', ')}`
        : '';

      const prompt = `Generate a 7-day meal plan with breakfast, lunch, and dinner for each day.

Target daily calories: ${dailyGoals.calories}
Protein: ${dailyGoals.protein}g
Carbs: ${dailyGoals.carbs}g
Fat: ${dailyGoals.fat}g
Goal: ${userProfile.goalType}${avoidedIngredientsText}

Each meal should be:
- Breakfast: ${Math.round(caloriesPerMeal * 0.9)} calories
- Lunch: ${Math.round(caloriesPerMeal * 1.1)} calories
- Dinner: ${Math.round(caloriesPerMeal * 1.0)} calories

CRITICAL: Each meal MUST include:
1. A detailed list of ingredients (3-5 ingredients)
2. Step-by-step cooking instructions (3-5 clear steps)

Return a JSON array with 7 days in this exact format:
[
  {
    "day": 1,
    "breakfast": {
      "title": "Meal name",
      "caloriesPerServing": 400,
      "macros": { "protein": 25, "carbs": 45, "fat": 12, "fiber": 6 },
      "ingredients": ["2 eggs", "1 slice whole wheat bread", "1 tbsp butter"],
      "instructions": ["Heat pan over medium heat", "Cook eggs to desired doneness", "Toast bread and serve"]
    },
    "lunch": {
      "title": "Meal name",
      "caloriesPerServing": 550,
      "macros": { "protein": 35, "carbs": 60, "fat": 15, "fiber": 8 },
      "ingredients": ["6 oz chicken breast", "1 cup brown rice", "1 cup broccoli"],
      "instructions": ["Season and grill chicken", "Cook rice according to package", "Steam broccoli and combine"]
    },
    "dinner": {
      "title": "Meal name",
      "caloriesPerServing": 500,
      "macros": { "protein": 40, "carbs": 50, "fat": 16, "fiber": 7 },
      "ingredients": ["8 oz salmon", "1 cup quinoa", "Mixed vegetables"],
      "instructions": ["Preheat oven to 400F", "Bake salmon for 15 minutes", "Serve with quinoa and vegetables"]
    }
  }
]

Make meals:
- Varied and interesting
- Easy to prepare (3-5 specific ingredients with amounts, 3-5 simple cooking steps)
- Nutritionally balanced
- Appropriate for ${userProfile.goalType} goal
- MUST NOT include any avoided ingredients

Return ONLY valid JSON, no other text.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      const outputText = data.choices?.[0]?.message?.content || '';
      const jsonMatch = outputText.match(/\[[\s\S]*\]/);

      if (!jsonMatch) {
        throw new Error('Invalid response from AI');
      }

      const weekPlan = JSON.parse(jsonMatch[0]);

      // Create meal plans for each day
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        const dateStr = format(date, 'yyyy-MM-dd');

        // Check if plan already exists and delete it (to allow regeneration)
        const existingPlan = getMealPlanForDate(dateStr);
        if (existingPlan) {
          deleteMealPlan(existingPlan.id);
        }

        const dayPlan = weekPlan[i];
        if (!dayPlan) continue;

        const totalCalories =
          dayPlan.breakfast.caloriesPerServing +
          dayPlan.lunch.caloriesPerServing +
          dayPlan.dinner.caloriesPerServing;

        const totalMacros = {
          protein:
            dayPlan.breakfast.macros.protein +
            dayPlan.lunch.macros.protein +
            dayPlan.dinner.macros.protein,
          carbs:
            dayPlan.breakfast.macros.carbs +
            dayPlan.lunch.macros.carbs +
            dayPlan.dinner.macros.carbs,
          fat:
            dayPlan.breakfast.macros.fat +
            dayPlan.lunch.macros.fat +
            dayPlan.dinner.macros.fat,
          fiber:
            dayPlan.breakfast.macros.fiber +
            dayPlan.lunch.macros.fiber +
            dayPlan.dinner.macros.fiber,
        };

        // Convert to Recipe-like objects
        const breakfast: Recipe = {
          id: `ai-breakfast-${Date.now()}-${i}`,
          title: dayPlan.breakfast.title,
          imageUri: getRecipeImageUrl(dayPlan.breakfast.title, 'breakfast'),
          ingredients: dayPlan.breakfast.ingredients ? convertIngredients(dayPlan.breakfast.ingredients) : [],
          instructions: dayPlan.breakfast.instructions || [],
          servings: '1',
          prepTime: '15 min',
          cookTime: '20 min',
          folderId: 'breakfast',
          createdAt: Date.now(),
          caloriesPerServing: dayPlan.breakfast.caloriesPerServing,
          macros: dayPlan.breakfast.macros,
          isSuggested: true,
        };

        const lunch: Recipe = {
          id: `ai-lunch-${Date.now()}-${i}`,
          title: dayPlan.lunch.title,
          imageUri: getRecipeImageUrl(dayPlan.lunch.title, 'lunch'),
          ingredients: dayPlan.lunch.ingredients ? convertIngredients(dayPlan.lunch.ingredients) : [],
          instructions: dayPlan.lunch.instructions || [],
          servings: '1',
          prepTime: '15 min',
          cookTime: '25 min',
          folderId: 'lunch',
          createdAt: Date.now(),
          caloriesPerServing: dayPlan.lunch.caloriesPerServing,
          macros: dayPlan.lunch.macros,
          isSuggested: true,
        };

        const dinner: Recipe = {
          id: `ai-dinner-${Date.now()}-${i}`,
          title: dayPlan.dinner.title,
          imageUri: getRecipeImageUrl(dayPlan.dinner.title, 'dinner'),
          ingredients: dayPlan.dinner.ingredients ? convertIngredients(dayPlan.dinner.ingredients) : [],
          instructions: dayPlan.dinner.instructions || [],
          servings: '1',
          prepTime: '20 min',
          cookTime: '30 min',
          folderId: 'dinner',
          createdAt: Date.now(),
          caloriesPerServing: dayPlan.dinner.caloriesPerServing,
          macros: dayPlan.dinner.macros,
          isSuggested: true,
        };

        const mealPlan = {
          id: `plan-${Date.now()}-${i}`,
          date: dateStr,
          meals: {
            breakfast,
            lunch,
            dinner,
          },
          totalCalories,
          totalMacros,
          createdAt: Date.now(),
        };

        addMealPlan(mealPlan);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setGenerating(false);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
      setGenerating(false);
    }
  };

  const handleSaveRecipe = (meal: Recipe) => {
    // Check if recipe already exists
    const exists = recipes.find((r) => r.id === meal.id);
    if (exists) {
      alert('This recipe is already in your recipe book!');
      return;
    }

    addRecipe(meal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Recipe saved to your recipe book!');
  };

  const handleClearWeek = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });

    // Delete all meal plans for this week
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const plan = getMealPlanForDate(dateStr);
      if (plan) {
        deleteMealPlan(plan.id);
      }
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSwapMeal = async (dateStr: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!dailyGoals || !userProfile) return;

    setSwappingMeal({ date: dateStr, type: mealType });

    try {
      const plan = getMealPlanForDate(dateStr);
      if (!plan) return;

      // Generate a new meal using AI
      const targetCalories = dailyGoals.calories;
      const caloriesPerMeal = Math.floor(targetCalories / 3);
      const mealCalories = mealType === 'breakfast'
        ? Math.round(caloriesPerMeal * 0.9)
        : mealType === 'lunch'
        ? Math.round(caloriesPerMeal * 1.1)
        : Math.round(caloriesPerMeal * 1.0);

      const avoidedIngredientsText = userProfile.avoidedIngredients && userProfile.avoidedIngredients.length > 0
        ? `\nIMPORTANT: DO NOT use these ingredients: ${userProfile.avoidedIngredients.join(', ')}`
        : '';

      const prompt = `Generate 1 ${mealType} meal.

Target calories: ${mealCalories}
Protein: ${Math.round(dailyGoals.protein / 3)}g
Carbs: ${Math.round(dailyGoals.carbs / 3)}g
Fat: ${Math.round(dailyGoals.fat / 3)}g
Goal: ${userProfile.goalType}${avoidedIngredientsText}

CRITICAL: The meal MUST include:
1. A detailed list of ingredients (3-5 ingredients with amounts)
2. Step-by-step cooking instructions (3-5 clear steps)

Return JSON in this exact format:
{
  "title": "Meal name",
  "caloriesPerServing": ${mealCalories},
  "macros": { "protein": 25, "carbs": 45, "fat": 12, "fiber": 6 },
  "ingredients": ["2 eggs", "1 slice bread", "1 tbsp butter"],
  "instructions": ["Heat pan", "Cook eggs", "Serve with toast"]
}

Make it:
- Different from the current meal: ${getMealName(plan.meals[mealType] as any)}
- Easy to prepare (3-5 specific ingredients with amounts, 3-5 simple cooking steps)
- Nutritionally balanced
- MUST NOT include any avoided ingredients

Return ONLY valid JSON, no other text.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate meal');

      const data = await response.json();
      const outputText = data.choices?.[0]?.message?.content || '';
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error('Invalid response');

      const newMealData = JSON.parse(jsonMatch[0]);

      const newMeal: Recipe = {
        id: `ai-${mealType}-${Date.now()}`,
        title: newMealData.title,
        imageUri: getRecipeImageUrl(newMealData.title, mealType),
        ingredients: newMealData.ingredients ? convertIngredients(newMealData.ingredients) : [],
        instructions: newMealData.instructions || [],
        servings: '1',
        prepTime: '15 min',
        cookTime: mealType === 'breakfast' ? '20 min' : '25 min',
        folderId: mealType,
        createdAt: Date.now(),
        caloriesPerServing: newMealData.caloriesPerServing,
        macros: newMealData.macros,
        isSuggested: true,
      };

      // Update the meal plan
      const updatedMeals = { ...plan.meals, [mealType]: newMeal };
      const totalCalories = Object.values(updatedMeals).reduce(
        (sum, meal) => sum + (meal ? getCalories(meal) : 0),
        0
      );

      updateMealPlan(plan.id, {
        meals: updatedMeals,
        totalCalories,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSwappingMeal(null);
      setShowSwapOptions(null);
    } catch (error) {
      console.error('Error swapping meal:', error);
      alert('Failed to swap meal. Please try again.');
      setSwappingMeal(null);
    }
  };

  const handleSwapWithRecipe = (dateStr: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe) => {
    const plan = getMealPlanForDate(dateStr);
    if (!plan) return;

    // Update the meal plan with the selected recipe
    const updatedMeals = { ...plan.meals, [mealType]: recipe };
    const totalCalories = Object.values(updatedMeals).reduce(
      (sum, meal) => sum + (meal ? getCalories(meal) : 0),
      0
    );

    updateMealPlan(plan.id, {
      meals: updatedMeals,
      totalCalories,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowRecipeList(false);
    setShowSwapOptions(null);
  };

  const handleLogMeal = (meal: Recipe, dateStr: string) => {
    const mealLog: MealLog = {
      id: `log-${Date.now()}`,
      recipeId: meal.id,
      recipeTitle: meal.title,
      servings: 1,
      calories: meal.caloriesPerServing,
      macros: meal.macros,
      date: dateStr,
      timestamp: Date.now(),
    };

    logMeal(mealLog);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Meal logged to your daily tracker!');
  };

  const handleAddIngredients = (meal: Recipe) => {
    if (meal.ingredients && meal.ingredients.length > 0) {
      addToShoppingList(meal.ingredients.map(ing => ({ ...ing, checked: false })));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert('Ingredients added to shopping list!');
    }
  };

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Check if any meal plans exist for this week
  const hasWeekPlan = weekDays.some((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return getMealPlanForDate(dateStr) !== null;
  });

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-4 mx-6 mb-6"
        style={{
          backgroundColor: '#10B981',
          shadowColor: '#10B981',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Calendar size={20} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">Weekly Meal Planner</Text>
            </View>
            <Text className="text-white/80 text-sm">
              AI-generated meal plan based on your goals
            </Text>
          </View>
          <Sparkles size={24} color="#fff" />
        </View>
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View className="flex-1 bg-black/80 justify-end">
          <Animated.View entering={FadeIn} className="bg-zinc-950 rounded-t-3xl h-5/6">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
              <View className="flex-row items-center">
                <Calendar size={20} color="#10B981" style={{ marginRight: 8 }} />
                <Text className="text-white text-lg font-bold">Weekly Meal Plan</Text>
              </View>
              <Pressable
                onPress={() => setVisible(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center"
              >
                <X size={16} color="#fff" />
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="p-5">
                {/* Info Card */}
                <Animated.View entering={FadeInDown.delay(100)} className="bg-zinc-900 rounded-2xl p-4 mb-4">
                  <Text className="text-white font-semibold mb-2">Your Goals</Text>
                  <View className="flex-row flex-wrap gap-2">
                    <View className="bg-zinc-800 rounded-lg px-3 py-2">
                      <Text className="text-zinc-400 text-xs">Calories</Text>
                      <Text className="text-white font-bold">{dailyGoals?.calories || 0}</Text>
                    </View>
                    <View className="bg-zinc-800 rounded-lg px-3 py-2">
                      <Text className="text-zinc-400 text-xs">Protein</Text>
                      <Text className="text-blue-400 font-bold">{dailyGoals?.protein || 0}g</Text>
                    </View>
                    <View className="bg-zinc-800 rounded-lg px-3 py-2">
                      <Text className="text-zinc-400 text-xs">Carbs</Text>
                      <Text className="text-amber-400 font-bold">{dailyGoals?.carbs || 0}g</Text>
                    </View>
                    <View className="bg-zinc-800 rounded-lg px-3 py-2">
                      <Text className="text-zinc-400 text-xs">Fat</Text>
                      <Text className="text-pink-400 font-bold">{dailyGoals?.fat || 0}g</Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Generate Button */}
                <Animated.View entering={FadeInDown.delay(200)}>
                  {hasWeekPlan ? (
                    <View className="flex-row gap-2 mb-6">
                      <Pressable
                        onPress={handleClearWeek}
                        className="flex-1 rounded-2xl py-4 bg-red-600 active:bg-red-700 flex-row items-center justify-center"
                      >
                        <X size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-base">Clear Week</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleGenerateWeek}
                        disabled={generating}
                        className={`flex-1 rounded-2xl py-4 flex-row items-center justify-center ${
                          generating ? 'bg-zinc-700' : 'bg-emerald-600 active:bg-emerald-700'
                        }`}
                      >
                        <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-base">
                          {generating ? 'Generating...' : 'Regenerate'}
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={handleGenerateWeek}
                      disabled={generating || !dailyGoals || !userProfile}
                      className={`rounded-2xl py-4 mb-6 flex-row items-center justify-center ${
                        generating || !dailyGoals || !userProfile
                          ? 'bg-zinc-700'
                          : 'bg-emerald-600 active:bg-emerald-700'
                      }`}
                    >
                      <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text className="text-white font-bold text-base">
                        {generating ? 'Generating Plan...' : 'Generate This Week'}
                      </Text>
                    </Pressable>
                  )}
                </Animated.View>

                {/* Week View */}
                <Text className="text-white font-bold text-lg mb-3">This Week</Text>
                {weekDays.map((day, index) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const plan = getMealPlanForDate(dateStr);
                  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
                  const isExpanded = selectedDay === dateStr;

                  return (
                    <Animated.View
                      key={dateStr}
                      entering={FadeInDown.delay(300 + index * 50)}
                      className="bg-zinc-900 rounded-2xl p-4 mb-3"
                    >
                      {/* Day Header - Only this part expands/collapses */}
                      <Pressable
                        onPress={() => {
                          setSelectedDay(isExpanded ? null : dateStr);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className="flex-row items-center justify-between mb-3"
                      >
                        <View>
                          <Text className={`font-bold ${isExpanded ? 'text-2xl' : 'text-base'} ${isToday ? 'text-emerald-500' : 'text-white'}`}>
                            {format(day, 'EEEE')}
                          </Text>
                          <Text className="text-zinc-500 text-xs">{format(day, 'MMM d')}</Text>
                        </View>
                        {plan && (
                          <View className="bg-emerald-600/20 rounded-lg px-3 py-1">
                            <Text className="text-emerald-500 text-xs font-semibold">
                              {plan.totalCalories} cal
                            </Text>
                          </View>
                        )}
                      </Pressable>

                      {/* Meal Items - Separate from the header Pressable */}
                      {plan ? (
                        <View className="gap-2">
                          {plan.meals.breakfast && 'title' in plan.meals.breakfast && (
                            <MealItemCard
                              meal={plan.meals.breakfast as Recipe}
                              mealType="breakfast"
                              isExpanded={isExpanded}
                              onOpenRecipe={() => {
                                console.log('Breakfast pressed');
                                setVisible(false); // Close main modal first
                                setTimeout(() => {
                                  setSelectedMeal({ meal: plan.meals.breakfast as Recipe, dateStr, type: 'breakfast' });
                                }, 300);
                              }}
                              onSaveRecipe={() => handleSaveRecipe(plan.meals.breakfast as Recipe)}
                              onSwapMeal={() => {
                                setShowSwapOptions({ dateStr, type: 'breakfast' });
                              }}
                            />
                          )}
                          {plan.meals.lunch && 'title' in plan.meals.lunch && (
                            <MealItemCard
                              meal={plan.meals.lunch as Recipe}
                              mealType="lunch"
                              isExpanded={isExpanded}
                              onOpenRecipe={() => {
                                console.log('Lunch pressed');
                                setVisible(false); // Close main modal first
                                setTimeout(() => {
                                  setSelectedMeal({ meal: plan.meals.lunch as Recipe, dateStr, type: 'lunch' });
                                }, 300);
                              }}
                              onSaveRecipe={() => handleSaveRecipe(plan.meals.lunch as Recipe)}
                              onSwapMeal={() => {
                                setShowSwapOptions({ dateStr, type: 'lunch' });
                              }}
                            />
                          )}
                          {plan.meals.dinner && 'title' in plan.meals.dinner && (
                            <MealItemCard
                              meal={plan.meals.dinner as Recipe}
                              mealType="dinner"
                              isExpanded={isExpanded}
                              onOpenRecipe={() => {
                                console.log('Dinner pressed');
                                setVisible(false); // Close main modal first
                                setTimeout(() => {
                                  setSelectedMeal({ meal: plan.meals.dinner as Recipe, dateStr, type: 'dinner' });
                                }, 300);
                              }}
                              onSaveRecipe={() => handleSaveRecipe(plan.meals.dinner as Recipe)}
                              onSwapMeal={() => {
                                setShowSwapOptions({ dateStr, type: 'dinner' });
                              }}
                            />
                          )}
                        </View>
                      ) : (
                        <Text className="text-zinc-600 text-sm">No plan yet</Text>
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <Modal visible={true} animationType="slide" onRequestClose={() => {
          setSelectedMeal(null);
          setTimeout(() => setVisible(true), 300);
        }}>
          <View className="flex-1 bg-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="px-6 pt-16 pb-6">
                <Pressable
                  onPress={() => {
                    setSelectedMeal(null);
                    setTimeout(() => setVisible(true), 300);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center mb-4"
                >
                  <ChevronLeft size={24} color="#fff" />
                </Pressable>

                <View className="flex-row items-center mb-2">
                  <View className="bg-emerald-600/20 rounded-full p-3 mr-3">
                    <ChefHat size={24} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-zinc-400 text-sm mb-1 capitalize">{selectedMeal.type}</Text>
                    <Text className="text-white font-bold text-2xl">{selectedMeal.meal.title}</Text>
                  </View>
                </View>

                {/* Macros */}
                <View className="flex-row flex-wrap gap-2 mt-4">
                  <View className="bg-zinc-900 rounded-xl px-4 py-3">
                    <Text className="text-zinc-400 text-xs mb-1">Calories</Text>
                    <Text className="text-emerald-400 font-bold text-lg">{selectedMeal.meal.caloriesPerServing}</Text>
                  </View>
                  {selectedMeal.meal.macros && (
                    <>
                      <View className="bg-zinc-900 rounded-xl px-4 py-3">
                        <Text className="text-zinc-400 text-xs mb-1">Protein</Text>
                        <Text className="text-blue-400 font-bold text-lg">{selectedMeal.meal.macros.protein}g</Text>
                      </View>
                      <View className="bg-zinc-900 rounded-xl px-4 py-3">
                        <Text className="text-zinc-400 text-xs mb-1">Carbs</Text>
                        <Text className="text-amber-400 font-bold text-lg">{selectedMeal.meal.macros.carbs}g</Text>
                      </View>
                      <View className="bg-zinc-900 rounded-xl px-4 py-3">
                        <Text className="text-zinc-400 text-xs mb-1">Fat</Text>
                        <Text className="text-pink-400 font-bold text-lg">{selectedMeal.meal.macros.fat}g</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* Ingredients */}
              <View className="px-6 pb-6">
                <Text className="text-white font-bold text-xl mb-4">Ingredients</Text>
                {selectedMeal.meal.ingredients && selectedMeal.meal.ingredients.length > 0 ? (
                  <View className="bg-zinc-900 rounded-2xl p-4">
                    {selectedMeal.meal.ingredients.map((ingredient, index) => (
                      <View key={ingredient.id || index} className="flex-row items-start mb-3 last:mb-0">
                        <View className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-3" />
                        <Text className="text-zinc-300 flex-1 text-base">
                          {ingredient.amount !== '1 serving' ? `${ingredient.amount} ` : ''}{ingredient.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-zinc-900 rounded-2xl p-6 items-center">
                    <Text className="text-zinc-500 text-center">No ingredients listed</Text>
                  </View>
                )}
              </View>

              {/* Instructions */}
              <View className="px-6 pb-8">
                <Text className="text-white font-bold text-xl mb-4">Instructions</Text>
                {selectedMeal.meal.instructions && selectedMeal.meal.instructions.length > 0 ? (
                  <View className="bg-zinc-900 rounded-2xl p-4">
                    {selectedMeal.meal.instructions.map((instruction, index) => (
                      <View key={index} className="flex-row items-start mb-4 last:mb-0">
                        <View className="w-8 h-8 rounded-full bg-emerald-600/20 items-center justify-center mr-3 mt-0.5">
                          <Text className="text-emerald-400 font-bold">{index + 1}</Text>
                        </View>
                        <Text className="text-zinc-300 flex-1 text-base leading-6">{instruction}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-zinc-900 rounded-2xl p-6 items-center">
                    <Text className="text-zinc-500 text-center">No instructions listed</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="px-6 pb-10">
                <View className="flex-row gap-3 mb-3">
                  <Pressable
                    onPress={() => {
                      handleSaveRecipe(selectedMeal.meal);
                      setSelectedMeal(null);
                      setTimeout(() => setVisible(true), 300);
                    }}
                    className="flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center active:bg-blue-700"
                  >
                    <BookmarkPlus size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Save Recipe</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const swapInfo = { dateStr: selectedMeal.dateStr, type: selectedMeal.type };
                      setSelectedMeal(null);
                      setTimeout(() => {
                        setVisible(true);
                        setShowSwapOptions(swapInfo);
                      }, 300);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="flex-1 bg-amber-600 rounded-xl py-4 flex-row items-center justify-center active:bg-amber-700"
                  >
                    <RefreshCw size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Swap Meal</Text>
                  </Pressable>
                </View>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => {
                      handleLogMeal(selectedMeal.meal, selectedMeal.dateStr);
                      setSelectedMeal(null);
                      setTimeout(() => setVisible(true), 300);
                    }}
                    className="flex-1 bg-emerald-600 rounded-xl py-4 flex-row items-center justify-center active:bg-emerald-700"
                  >
                    <Plus size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Log to Tracker</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleAddIngredients(selectedMeal.meal);
                      setSelectedMeal(null);
                      setTimeout(() => setVisible(true), 300);
                    }}
                    className="flex-1 bg-purple-600 rounded-xl py-4 flex-row items-center justify-center active:bg-purple-700"
                  >
                    <ShoppingCart size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-base">Add Ingredients</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Swap Options Modal */}
      {showSwapOptions && (
        <Modal visible={true} animationType="fade" transparent onRequestClose={() => setShowSwapOptions(null)}>
          <Pressable
            onPress={() => setShowSwapOptions(null)}
            className="flex-1 bg-black/80 justify-center items-center"
          >
            <Pressable onPress={(e) => e.stopPropagation()} className="bg-zinc-900 rounded-3xl p-6 mx-6 w-5/6">
              <Text className="text-white font-bold text-xl mb-4">Swap Meal</Text>
              <Text className="text-zinc-400 text-sm mb-6">Choose how you'd like to swap this meal</Text>

              <Pressable
                onPress={() => {
                  setShowRecipeList(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="bg-blue-600 rounded-xl py-4 mb-3 active:bg-blue-700"
              >
                <View className="flex-row items-center justify-center">
                  <BookmarkPlus size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">Choose from Recipe Book</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  handleSwapMeal(showSwapOptions.dateStr, showSwapOptions.type);
                  setSelectedMeal(null);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                disabled={swappingMeal?.date === showSwapOptions.dateStr && swappingMeal?.type === showSwapOptions.type}
                className="bg-emerald-600 rounded-xl py-4 mb-3 active:bg-emerald-700"
              >
                <View className="flex-row items-center justify-center">
                  <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">
                    {swappingMeal?.date === showSwapOptions.dateStr && swappingMeal?.type === showSwapOptions.type
                      ? 'Generating...'
                      : 'Generate with AI'}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowSwapOptions(null);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="bg-zinc-800 rounded-xl py-4 active:bg-zinc-700"
              >
                <Text className="text-white font-semibold text-base text-center">Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Recipe List Modal */}
      {showRecipeList && showSwapOptions && (
        <Modal visible={true} animationType="slide" onRequestClose={() => setShowRecipeList(false)}>
          <View className="flex-1 bg-black">
            <View className="px-6 pt-16 pb-4 border-b border-zinc-800">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-bold text-2xl">Choose Recipe</Text>
                <Pressable
                  onPress={() => {
                    setShowRecipeList(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center"
                >
                  <X size={20} color="#fff" />
                </Pressable>
              </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-4">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <Pressable
                    key={recipe.id}
                    onPress={() => {
                      handleSwapWithRecipe(showSwapOptions.dateStr, showSwapOptions.type, recipe);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="bg-zinc-900 rounded-2xl p-4 mb-3 active:bg-zinc-800"
                  >
                    <Text className="text-white font-bold text-lg mb-2">{recipe.title}</Text>
                    <View className="flex-row flex-wrap gap-2">
                      <View className="bg-zinc-800 rounded-lg px-3 py-1">
                        <Text className="text-emerald-400 text-xs">{recipe.caloriesPerServing} cal</Text>
                      </View>
                      {recipe.macros && (
                        <>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1">
                            <Text className="text-blue-400 text-xs">P: {recipe.macros.protein}g</Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1">
                            <Text className="text-amber-400 text-xs">C: {recipe.macros.carbs}g</Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1">
                            <Text className="text-pink-400 text-xs">F: {recipe.macros.fat}g</Text>
                          </View>
                        </>
                      )}
                    </View>
                  </Pressable>
                ))
              ) : (
                <View className="bg-zinc-900 rounded-2xl p-8 items-center">
                  <BookmarkPlus size={48} color="#52525B" style={{ marginBottom: 12 }} />
                  <Text className="text-white font-bold text-lg mb-2">No Recipes Yet</Text>
                  <Text className="text-zinc-500 text-center text-sm">
                    Save some recipes to your recipe book to swap meals
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  );
}
