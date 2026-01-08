import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useStore, type Recipe, type SavedCustomMeal, type Ingredient, type IngredientCategory, type MealLog } from '@/lib/store';
import { Calendar, ChefHat, BookmarkPlus, RefreshCw, X, Sparkles, Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { WeeklyMealPlanner } from '@/components/WeeklyMealPlanner';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { getRecipeImageUrl } from '@/lib/recipeImages';

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

export default function MealsScreen() {
  const [swappingMeal, setSwappingMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<Recipe | null>(null);
  const recipes = useStore((s) => s.recipes);
  const dailyGoals = useStore((s) => s.dailyGoals);
  const userProfile = useStore((s) => s.userProfile);
  const getMealPlanForDate = useStore((s) => s.getMealPlanForDate);
  const addRecipe = useStore((s) => s.addRecipe);
  const updateMealPlan = useStore((s) => s.updateMealPlan);
  const folders = useStore((s) => s.folders);
  const addToShoppingList = useStore((s) => s.addToShoppingList);
  const logMeal = useStore((s) => s.logMeal);

  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const plan = getMealPlanForDate(dateStr);

  const handleSaveRecipe = (meal: Recipe) => {
    const exists = recipes.find((r) => r.id === meal.id);
    if (exists) {
      alert('This recipe is already in your recipe book!');
      return;
    }

    addRecipe(meal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Recipe saved to your recipe book!');
  };

  const [showSwapOptions, setShowSwapOptions] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [showRecipeList, setShowRecipeList] = useState(false);

  // Helper to convert string ingredients to Ingredient objects
  const convertIngredients = (ingredients: string[]): Omit<Ingredient, 'checked'>[] => {
    return ingredients.map((ing, index) => ({
      id: `ing-${Date.now()}-${index}`,
      name: ing,
      amount: '1 serving',
      category: 'other' as IngredientCategory,
    }));
  };

  const handleSwapMeal = async (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!dailyGoals || !userProfile || !plan) return;

    setSwappingMeal(mealType);

    try {
      // Generate a new meal using AI
      const targetCalories = dailyGoals.calories;
      const caloriesPerMeal = Math.floor(targetCalories / 3);
      const mealCalories =
        mealType === 'breakfast'
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

  const handleSwapWithRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe) => {
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

  const handleLogMeal = (meal: Recipe) => {
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

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-center mb-2">
            <Calendar size={28} color="#10B981" style={{ marginRight: 8 }} />
            <Text className="text-white text-3xl font-bold">Meals</Text>
          </View>
          <Text className="text-zinc-500 text-base">Plan your week and view today's meals</Text>
        </View>

        {/* Weekly Meal Planner */}
        <WeeklyMealPlanner />

        {/* Today's Date */}
        <View className="px-6 pb-4">
          <Text className="text-white text-xl font-bold">{format(today, 'EEEE, MMMM d')}</Text>
        </View>

        {/* Daily Summary */}
        {plan && (
          <Animated.View entering={FadeInDown} className="mx-6 mb-6 bg-zinc-900 rounded-2xl p-4">
            <Text className="text-white font-semibold mb-3">Today's Summary</Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-zinc-800 rounded-lg px-3 py-2">
                <Text className="text-zinc-400 text-xs">Total Calories</Text>
                <Text className="text-emerald-400 font-bold text-lg">{plan.totalCalories}</Text>
              </View>
              <View className="bg-zinc-800 rounded-lg px-3 py-2">
                <Text className="text-zinc-400 text-xs">Protein</Text>
                <Text className="text-blue-400 font-bold text-lg">{plan.totalMacros.protein}g</Text>
              </View>
              <View className="bg-zinc-800 rounded-lg px-3 py-2">
                <Text className="text-zinc-400 text-xs">Carbs</Text>
                <Text className="text-amber-400 font-bold text-lg">{plan.totalMacros.carbs}g</Text>
              </View>
              <View className="bg-zinc-800 rounded-lg px-3 py-2">
                <Text className="text-zinc-400 text-xs">Fat</Text>
                <Text className="text-pink-400 font-bold text-lg">{plan.totalMacros.fat}g</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Meals */}
        <View className="px-6 pb-6">
          {plan ? (
            <>
              {/* Breakfast */}
              {plan.meals.breakfast && 'title' in plan.meals.breakfast && (
                <Animated.View entering={FadeInDown.delay(100)} className="bg-zinc-900 rounded-2xl p-5 mb-4">
                  <Pressable
                    onPress={() => {
                      setSelectedMealForDetail(plan.meals.breakfast as Recipe);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View className="flex-row items-center mb-3">
                      <View className="bg-amber-600/20 rounded-full p-2 mr-3">
                        <ChefHat size={20} color="#F59E0B" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-zinc-400 text-xs mb-1">Breakfast</Text>
                        <Text className="text-white font-bold text-lg">
                          {getMealName(plan.meals.breakfast)}
                        </Text>
                      </View>
                    </View>

                    {/* Macros */}
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                        <Text className="text-zinc-400 text-xs">
                          {getCalories(plan.meals.breakfast)} cal
                        </Text>
                      </View>
                      {plan.meals.breakfast.macros && (
                        <>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-blue-400 text-xs">
                              P: {plan.meals.breakfast.macros.protein}g
                            </Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-amber-400 text-xs">
                              C: {plan.meals.breakfast.macros.carbs}g
                            </Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-pink-400 text-xs">
                              F: {plan.meals.breakfast.macros.fat}g
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </Pressable>

                  {/* Actions */}
                  <View className="flex-row gap-2 mb-2">
                    <Pressable
                      onPress={() => handleSaveRecipe(plan.meals.breakfast as Recipe)}
                      className="flex-1 bg-blue-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-blue-600/30"
                    >
                      <BookmarkPlus size={16} color="#3B82F6" style={{ marginRight: 6 }} />
                      <Text className="text-blue-400 text-sm font-semibold">Save Recipe</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowSwapOptions('breakfast')}
                      className="flex-1 bg-amber-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-amber-600/30"
                    >
                      <RefreshCw size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text className="text-amber-400 text-sm font-semibold">Swap Meal</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleLogMeal(plan.meals.breakfast as Recipe)}
                    className="bg-emerald-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-emerald-600/30"
                  >
                    <Plus size={16} color="#10B981" style={{ marginRight: 6 }} />
                    <Text className="text-emerald-400 text-sm font-semibold">Log to Tracker</Text>
                  </Pressable>
                </Animated.View>
              )}

              {/* Lunch */}
              {plan.meals.lunch && 'title' in plan.meals.lunch && (
                <Animated.View entering={FadeInDown.delay(200)} className="bg-zinc-900 rounded-2xl p-5 mb-4">
                  <Pressable
                    onPress={() => {
                      setSelectedMealForDetail(plan.meals.lunch as Recipe);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View className="flex-row items-center mb-3">
                      <View className="bg-blue-600/20 rounded-full p-2 mr-3">
                        <ChefHat size={20} color="#3B82F6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-zinc-400 text-xs mb-1">Lunch</Text>
                        <Text className="text-white font-bold text-lg">{getMealName(plan.meals.lunch)}</Text>
                      </View>
                    </View>

                    {/* Macros */}
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                        <Text className="text-zinc-400 text-xs">{getCalories(plan.meals.lunch)} cal</Text>
                      </View>
                      {plan.meals.lunch.macros && (
                        <>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-blue-400 text-xs">P: {plan.meals.lunch.macros.protein}g</Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-amber-400 text-xs">C: {plan.meals.lunch.macros.carbs}g</Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-pink-400 text-xs">F: {plan.meals.lunch.macros.fat}g</Text>
                          </View>
                        </>
                      )}
                    </View>
                  </Pressable>

                  {/* Actions */}
                  <View className="flex-row gap-2 mb-2">
                    <Pressable
                      onPress={() => handleSaveRecipe(plan.meals.lunch as Recipe)}
                      className="flex-1 bg-blue-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-blue-600/30"
                    >
                      <BookmarkPlus size={16} color="#3B82F6" style={{ marginRight: 6 }} />
                      <Text className="text-blue-400 text-sm font-semibold">Save Recipe</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowSwapOptions('lunch')}
                      className="flex-1 bg-amber-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-amber-600/30"
                    >
                      <RefreshCw size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text className="text-amber-400 text-sm font-semibold">Swap Meal</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleLogMeal(plan.meals.lunch as Recipe)}
                    className="bg-emerald-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-emerald-600/30"
                  >
                    <Plus size={16} color="#10B981" style={{ marginRight: 6 }} />
                    <Text className="text-emerald-400 text-sm font-semibold">Log to Tracker</Text>
                  </Pressable>
                </Animated.View>
              )}

              {/* Dinner */}
              {plan.meals.dinner && 'title' in plan.meals.dinner && (
                <Animated.View entering={FadeInDown.delay(300)} className="bg-zinc-900 rounded-2xl p-5 mb-4">
                  <Pressable
                    onPress={() => {
                      setSelectedMealForDetail(plan.meals.dinner as Recipe);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View className="flex-row items-center mb-3">
                      <View className="bg-emerald-600/20 rounded-full p-2 mr-3">
                        <ChefHat size={20} color="#10B981" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-zinc-400 text-xs mb-1">Dinner</Text>
                        <Text className="text-white font-bold text-lg">
                          {getMealName(plan.meals.dinner)}
                        </Text>
                      </View>
                    </View>

                    {/* Macros */}
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                        <Text className="text-zinc-400 text-xs">{getCalories(plan.meals.dinner)} cal</Text>
                      </View>
                      {plan.meals.dinner.macros && (
                        <>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-blue-400 text-xs">
                              P: {plan.meals.dinner.macros.protein}g
                            </Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-amber-400 text-xs">
                              C: {plan.meals.dinner.macros.carbs}g
                            </Text>
                          </View>
                          <View className="bg-zinc-800 rounded-lg px-3 py-1.5">
                            <Text className="text-pink-400 text-xs">F: {plan.meals.dinner.macros.fat}g</Text>
                          </View>
                        </>
                      )}
                    </View>
                  </Pressable>

                  {/* Actions */}
                  <View className="flex-row gap-2 mb-2">
                    <Pressable
                      onPress={() => handleSaveRecipe(plan.meals.dinner as Recipe)}
                      className="flex-1 bg-blue-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-blue-600/30"
                    >
                      <BookmarkPlus size={16} color="#3B82F6" style={{ marginRight: 6 }} />
                      <Text className="text-blue-400 text-sm font-semibold">Save Recipe</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowSwapOptions('dinner')}
                      className="flex-1 bg-amber-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-amber-600/30"
                    >
                      <RefreshCw size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text className="text-amber-400 text-sm font-semibold">Swap Meal</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleLogMeal(plan.meals.dinner as Recipe)}
                    className="bg-emerald-600/20 rounded-xl py-3 flex-row items-center justify-center active:bg-emerald-600/30"
                  >
                    <Plus size={16} color="#10B981" style={{ marginRight: 6 }} />
                    <Text className="text-emerald-400 text-sm font-semibold">Log to Tracker</Text>
                  </Pressable>
                </Animated.View>
              )}
            </>
          ) : (
            <Animated.View entering={FadeInDown} className="bg-zinc-900 rounded-2xl p-8 items-center">
              <Calendar size={48} color="#52525B" style={{ marginBottom: 12 }} />
              <Text className="text-white font-bold text-lg mb-2">No Meal Plan Yet</Text>
              <Text className="text-zinc-500 text-center text-sm">
                Generate a weekly meal plan from the Home tab to see today's meals here
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

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
                  handleSwapMeal(showSwapOptions);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                disabled={swappingMeal === showSwapOptions}
                className="bg-emerald-600 rounded-xl py-4 mb-3 active:bg-emerald-700"
              >
                <View className="flex-row items-center justify-center">
                  <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">
                    {swappingMeal === showSwapOptions ? 'Generating...' : 'Generate with AI'}
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
                      handleSwapWithRecipe(showSwapOptions, recipe);
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

      {/* Recipe Detail Modal */}
      {selectedMealForDetail && (
        <RecipeDetailModal
          recipe={selectedMealForDetail}
          folder={folders.find((f) => f.id === selectedMealForDetail.folderId)}
          visible={true}
          onClose={() => setSelectedMealForDetail(null)}
          onAddToShoppingList={() => {
            if (selectedMealForDetail.ingredients) {
              addToShoppingList(selectedMealForDetail.ingredients.map(ing => ({ ...ing, checked: false })));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
