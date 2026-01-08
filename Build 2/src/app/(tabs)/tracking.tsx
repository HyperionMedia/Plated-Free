import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Flame,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Target,
  BookOpen,
  PenLine,
  Weight,
  Check,
  Trash2,
  Sparkles,
  Save,
  ChefHat,
} from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  useStore,
  getTodayDateString,
  type Recipe,
  type MealLog,
  type WeightEntry,
} from '@/lib/store';
import { cn } from '@/lib/cn';
import { ManualMealLogger } from '@/components/ManualMealLogger';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';

export default function TrackingScreen() {
  const router = useRouter();
  const recipes = useStore((s) => s.recipes);
  const folders = useStore((s) => s.folders);
  const mealLogs = useStore((s) => s.mealLogs);
  const dailyGoals = useStore((s) => s.dailyGoals);
  const weightEntries = useStore((s) => s.weightEntries);
  const logMeal = useStore((s) => s.logMeal);
  const removeMealLog = useStore((s) => s.removeMealLog);
  const addWeightEntry = useStore((s) => s.addWeightEntry);
  const deleteWeightEntry = useStore((s) => s.deleteWeightEntry);
  const addRecipe = useStore((s) => s.addRecipe);

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [showManualLogger, setShowManualLogger] = useState(false);
  const [selectedMealLog, setSelectedMealLog] = useState<MealLog | null>(null);
  const [showAILogger, setShowAILogger] = useState(false);
  const [showWeightLogger, setShowWeightLogger] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [servingCount, setServingCount] = useState(1);
  const [weightInput, setWeightInput] = useState('');
  const [aiMealDescription, setAiMealDescription] = useState('');
  const [aiMealLoading, setAiMealLoading] = useState(false);

  const logsForDate = useMemo(() => {
    return mealLogs.filter((log) => log.date === selectedDate);
  }, [mealLogs, selectedDate]);

  const totals = useMemo(() => {
    return logsForDate.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.macros.protein,
        carbs: acc.carbs + log.macros.carbs,
        fat: acc.fat + log.macros.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [logsForDate]);

  const goals = dailyGoals || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
  const remaining = goals.calories - totals.calories;

  const changeDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(date.toISOString().split('T')[0]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = getTodayDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddMeal = () => {
    if (!selectedRecipe) return;

    const log: MealLog = {
      id: `log-${Date.now()}`,
      recipeId: selectedRecipe.id,
      recipeTitle: selectedRecipe.title,
      servings: servingCount,
      calories: selectedRecipe.caloriesPerServing * servingCount,
      macros: {
        protein: selectedRecipe.macros.protein * servingCount,
        carbs: selectedRecipe.macros.carbs * servingCount,
        fat: selectedRecipe.macros.fat * servingCount,
        fiber: selectedRecipe.macros.fiber * servingCount,
      },
      date: selectedDate,
      timestamp: Date.now(),
    };

    logMeal(log);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowRecipePicker(false);
    setSelectedRecipe(null);
    setServingCount(1);
  };

  const handleRemoveLog = (id: string) => {
    removeMealLog(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleLogWeight = () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const entry: WeightEntry = {
      id: `weight-${Date.now()}`,
      weight,
      date: selectedDate,
      timestamp: Date.now(),
    };

    addWeightEntry(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowWeightLogger(false);
    setWeightInput('');
  };

  const handleDeleteWeight = () => {
    if (weightForDate) {
      deleteWeightEntry(weightForDate.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleAILogMeal = async () => {
    if (!aiMealDescription.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setAiMealLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `Parse this meal description into nutritional information. Return ONLY valid JSON with this exact structure (no markdown, no explanations):
{
  "mealName": "descriptive name of the meal",
  "servings": 1,
  "calories": total calories as number,
  "macros": {
    "protein": grams as number,
    "carbs": grams as number,
    "fat": grams as number,
    "fiber": grams as number
  },
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "quantity with unit (e.g., 2 eggs, 1 cup, 100g)"
    }
  ],
  "instructions": [
    "Step 1: First instruction",
    "Step 2: Second instruction"
  ]
}

Meal description: ${aiMealDescription}

Break down the meal into individual ingredients with amounts. Provide simple cooking instructions. Estimate reasonable values based on typical portions. Be accurate with nutritional data.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      // Handle both response formats
      const content = data.choices?.[0]?.message?.content || '';

      if (!content) {
        throw new Error('No response from AI');
      }

      // Extract JSON from the response using regex (handles markdown wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse meal data');
      }

      // Parse the JSON response
      const mealData = JSON.parse(jsonMatch[0]);

      // Create meal log
      const log: MealLog = {
        id: `meal-${Date.now()}`,
        recipeId: '',
        recipeTitle: mealData.mealName,
        servings: mealData.servings || 1,
        calories: Math.round(mealData.calories),
        macros: {
          protein: Math.round(mealData.macros.protein),
          carbs: Math.round(mealData.macros.carbs),
          fat: Math.round(mealData.macros.fat),
          fiber: Math.round(mealData.macros.fiber || 0),
        },
        date: selectedDate,
        timestamp: Date.now(),
        ingredients: mealData.ingredients || [],
        instructions: mealData.instructions || [],
      };

      logMeal(log);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowAILogger(false);
      setAiMealDescription('');
    } catch (error) {
      console.error('AI meal logging error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAiMealLoading(false);
    }
  };

  const handleSaveAIMealAsRecipe = (mealLog: MealLog) => {
    if (!mealLog.ingredients || !mealLog.instructions) return;

    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      title: mealLog.recipeTitle,
      imageUri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      ingredients: mealLog.ingredients.map((ing, idx) => ({
        id: `ing-${idx}`,
        name: ing.name,
        amount: ing.amount,
        category: 'other' as const,
      })),
      instructions: mealLog.instructions,
      servings: String(mealLog.servings),
      prepTime: '5 min',
      cookTime: '10 min',
      folderId: folders[0]?.id || '',
      createdAt: Date.now(),
      caloriesPerServing: Math.round(mealLog.calories / mealLog.servings),
      macros: {
        protein: Math.round(mealLog.macros.protein / mealLog.servings),
        carbs: Math.round(mealLog.macros.carbs / mealLog.servings),
        fat: Math.round(mealLog.macros.fat / mealLog.servings),
        fiber: Math.round(mealLog.macros.fiber / mealLog.servings),
      },
    };

    addRecipe(newRecipe);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedMealLog(null);
  };

  // Get weight for selected date
  const weightForDate = useMemo(() => {
    const entriesForDate = weightEntries.filter((entry) => entry.date === selectedDate);
    if (entriesForDate.length === 0) return null;
    return entriesForDate.reduce((latest, entry) =>
      entry.timestamp > latest.timestamp ? entry : latest
    );
  }, [weightEntries, selectedDate]);

  const progressPercent = Math.min((totals.calories / goals.calories) * 100, 100);

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-5 pt-2 pb-4">
            <Text className="text-3xl font-bold text-white">Daily Tracking</Text>
          </View>

          {/* Date Selector */}
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Pressable
              onPress={() => changeDate('prev')}
              className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
            >
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
            <Text className="text-white text-lg font-semibold">
              {formatDate(selectedDate)}
            </Text>
            <Pressable
              onPress={() => changeDate('next')}
              disabled={selectedDate === getTodayDateString()}
              className={cn(
                'w-10 h-10 rounded-full bg-zinc-900 items-center justify-center',
                selectedDate === getTodayDateString() ? 'opacity-30' : 'active:bg-zinc-800'
              )}
            >
              <ChevronRight size={20} color="#fff" />
            </Pressable>
          </View>

          {/* Calorie Ring */}
          <Animated.View entering={FadeInUp.delay(100)} className="px-5 mb-6">
          <LinearGradient
            colors={['#18181B', '#09090B']}
            style={{ borderRadius: 24, padding: 20 }}
          >
            <View className="items-center">
              {/* Progress Ring */}
              <View className="w-40 h-40 rounded-full border-8 border-zinc-800 items-center justify-center mb-4">
                <View
                  className="absolute w-40 h-40 rounded-full border-8 border-amber-500"
                  style={{
                    borderColor: remaining < 0 ? '#EF4444' : '#F59E0B',
                    transform: [{ rotate: '-90deg' }],
                    borderTopColor: 'transparent',
                    borderRightColor: progressPercent > 25 ? (remaining < 0 ? '#EF4444' : '#F59E0B') : 'transparent',
                    borderBottomColor: progressPercent > 50 ? (remaining < 0 ? '#EF4444' : '#F59E0B') : 'transparent',
                    borderLeftColor: progressPercent > 75 ? (remaining < 0 ? '#EF4444' : '#F59E0B') : 'transparent',
                  }}
                />
                <View className="items-center">
                  <Flame size={24} color={remaining < 0 ? '#EF4444' : '#F59E0B'} />
                  <Text className="text-white text-3xl font-bold mt-1">
                    {totals.calories}
                  </Text>
                  <Text className="text-zinc-500 text-sm">
                    of {goals.calories} cal
                  </Text>
                </View>
              </View>

              {/* Remaining */}
              <View className="flex-row items-center">
                {remaining >= 0 ? (
                  <>
                    <TrendingDown size={16} color="#22C55E" />
                    <Text className="text-green-500 font-semibold ml-1">
                      {remaining} cal remaining
                    </Text>
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} color="#EF4444" />
                    <Text className="text-red-500 font-semibold ml-1">
                      {Math.abs(remaining)} cal over
                    </Text>
                  </>
                )}
              </View>
            </View>

            {/* Macros */}
            <View className="flex-row mt-6 pt-4 border-t border-zinc-800">
              {[
                { label: 'Protein', value: totals.protein, goal: goals.protein, color: '#3B82F6' },
                { label: 'Carbs', value: totals.carbs, goal: goals.carbs, color: '#F59E0B' },
                { label: 'Fat', value: totals.fat, goal: goals.fat, color: '#EC4899' },
              ].map((macro) => (
                <View key={macro.label} className="flex-1 items-center">
                  <View className="h-1.5 w-full bg-zinc-800 rounded-full mb-2 overflow-hidden">
                    <Animated.View
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: macro.color,
                        width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                      }}
                      layout={Layout.springify()}
                    />
                  </View>
                  <Text className="text-white font-semibold">
                    {Math.round(macro.value)}g
                  </Text>
                  <Text className="text-zinc-500 text-xs">
                    {macro.label} / {macro.goal}g
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Add Meal Buttons */}
        <View className="px-5 mb-4">
          <Pressable
            onPress={() => setShowAILogger(true)}
            className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl py-4 flex-row items-center justify-center active:opacity-80 mb-3"
            style={{ backgroundColor: '#10B981' }}
          >
            <Sparkles size={18} color="#fff" />
            <Text className="text-white font-semibold ml-2">Describe Your Meal</Text>
          </Pressable>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setShowRecipePicker(true)}
              className="flex-1 bg-zinc-800 rounded-2xl py-4 flex-row items-center justify-center active:bg-zinc-700"
            >
              <BookOpen size={18} color="#F59E0B" />
              <Text className="text-white font-semibold ml-2">From Recipes</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowManualLogger(true)}
              className="flex-1 bg-zinc-800 rounded-2xl py-4 flex-row items-center justify-center active:bg-zinc-700"
            >
              <PenLine size={18} color="#71717A" />
              <Text className="text-white font-semibold ml-2">Log Manual</Text>
            </Pressable>
          </View>
        </View>

        {/* Weight Check-in Section */}
        <Animated.View entering={FadeInUp.delay(200)} className="px-5 mb-4">
          <LinearGradient
            colors={['#18181B', '#09090B']}
            style={{ borderRadius: 24, padding: 16 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Weight size={18} color="#3B82F6" />
                  <Text className="text-white font-bold text-lg ml-2">Weight Check-in</Text>
                </View>
                {weightForDate ? (
                  <Text className="text-zinc-400 text-sm">
                    Current: {weightForDate.weight} lbs
                  </Text>
                ) : (
                  <Text className="text-zinc-500 text-sm">No weight logged for this day</Text>
                )}
              </View>
              <View className="flex-row gap-2">
                {weightForDate && (
                  <Pressable
                    onPress={handleDeleteWeight}
                    className="bg-red-600 rounded-xl px-4 py-3 active:bg-red-700"
                  >
                    <Trash2 size={18} color="#fff" />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    setShowWeightLogger(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="bg-blue-600 rounded-xl px-4 py-3 active:bg-blue-700"
                >
                  <Text className="text-white font-semibold">
                    {weightForDate ? 'Update' : 'Log Weight'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Today's Meals */}
        <View className="px-5">
          <Text className="text-zinc-400 font-medium mb-3">
            {logsForDate.length > 0 ? 'Logged Meals' : 'No meals logged yet'}
          </Text>

          {logsForDate.map((log, index) => (
            <Pressable
              key={log.id}
              onPress={() => {
                setSelectedMealLog(log);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Animated.View
                entering={FadeIn.delay(index * 50)}
                className="bg-zinc-900 rounded-2xl p-4 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-semibold" numberOfLines={1}>
                      {log.recipeTitle}
                    </Text>
                    <Text className="text-zinc-500 text-sm">
                      {log.servings} serving{log.servings !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View className="items-end mr-3">
                    <Text className="text-amber-500 font-bold">
                      {log.calories} cal
                    </Text>
                    <Text className="text-zinc-500 text-xs">
                      P: {Math.round(log.macros.protein)}g | C: {Math.round(log.macros.carbs)}g | F: {Math.round(log.macros.fat)}g
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleRemoveLog(log.id)}
                    className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                  >
                    <X size={14} color="#EF4444" />
                  </Pressable>
                </View>
              </Animated.View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>

    {/* Recipe Picker Modal */}
    <Modal
      visible={showRecipePicker}
      animationType="slide"
      transparent
          onRequestClose={() => setShowRecipePicker(false)}
        >
          <View className="flex-1 bg-black/80 justify-end">
            <View className="bg-zinc-900 rounded-t-3xl max-h-[80%]">
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
                <Text className="text-white text-lg font-bold">
                  {selectedRecipe ? 'Add Servings' : 'Select Recipe'}
                </Text>
                <Pressable
                  onPress={() => {
                    setShowRecipePicker(false);
                    setSelectedRecipe(null);
                    setServingCount(1);
                  }}
                  className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center"
                >
                  <X size={16} color="#fff" />
                </Pressable>
              </View>

              {selectedRecipe ? (
                <View className="p-5">
                  <Text className="text-white text-xl font-bold mb-2">
                    {selectedRecipe.title}
                  </Text>
                  <Text className="text-zinc-400 mb-6">
                    {selectedRecipe.caloriesPerServing} cal per serving
                  </Text>

                  {/* Serving Counter */}
                  <View className="flex-row items-center justify-center mb-6">
                    <Pressable
                      onPress={() => {
                        if (servingCount > 0.5) {
                          setServingCount((s) => s - 0.5);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                    >
                      <Minus size={24} color="#fff" />
                    </Pressable>
                    <View className="mx-8 items-center">
                      <Text className="text-white text-4xl font-bold">
                        {servingCount}
                      </Text>
                      <Text className="text-zinc-500">servings</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setServingCount((s) => s + 0.5);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                    >
                      <Plus size={24} color="#fff" />
                    </Pressable>
                  </View>

                  {/* Total Preview */}
                  <View className="bg-zinc-800 rounded-2xl p-4 mb-6">
                    <Text className="text-zinc-400 text-sm mb-2">This will add:</Text>
                    <Text className="text-amber-500 text-2xl font-bold">
                      {Math.round(selectedRecipe.caloriesPerServing * servingCount)} calories
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1">
                      P: {Math.round(selectedRecipe.macros.protein * servingCount)}g |
                      C: {Math.round(selectedRecipe.macros.carbs * servingCount)}g |
                      F: {Math.round(selectedRecipe.macros.fat * servingCount)}g
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleAddMeal}
                    className="bg-amber-500 rounded-2xl py-4 items-center active:bg-amber-600"
                  >
                    <Text className="text-black font-bold text-lg">Add to Log</Text>
                  </Pressable>
                </View>
              ) : (
                <ScrollView className="p-5" contentContainerStyle={{ paddingBottom: 40 }}>
                  {recipes.length === 0 ? (
                    <View className="items-center py-10">
                      <Text className="text-zinc-500 text-center">
                        No recipes yet.{'\n'}Scan some recipes first!
                      </Text>
                    </View>
                  ) : (
                    recipes.map((recipe) => (
                      <Pressable
                        key={recipe.id}
                        onPress={() => {
                          setSelectedRecipe(recipe);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className="bg-zinc-800 rounded-2xl p-4 mb-3 active:bg-zinc-700"
                      >
                        <Text className="text-white font-semibold" numberOfLines={1}>
                          {recipe.title}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Flame size={12} color="#F59E0B" />
                          <Text className="text-amber-500 text-sm ml-1">
                            {recipe.caloriesPerServing} cal/serving
                          </Text>
                          <Text className="text-zinc-500 text-sm ml-3">
                            P: {recipe.macros.protein}g | C: {recipe.macros.carbs}g | F: {recipe.macros.fat}g
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Manual Meal Logger */}
        <ManualMealLogger
          visible={showManualLogger}
          selectedDate={selectedDate}
          onClose={() => setShowManualLogger(false)}
          onLogMeal={(log) => {
            logMeal(log);
            setShowManualLogger(false);
          }}
        />

        {/* Weight Logger Modal */}
        <Modal
          visible={showWeightLogger}
          animationType="slide"
          transparent
          onRequestClose={() => {
            setShowWeightLogger(false);
            setWeightInput('');
            Keyboard.dismiss();
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex-1 bg-black/80 justify-end">
                <TouchableWithoutFeedback>
                  <View className="bg-zinc-900 rounded-t-3xl p-6">
                    <View className="flex-row items-center justify-between mb-6">
                      <View className="flex-row items-center">
                        <Weight size={24} color="#3B82F6" />
                        <Text className="text-white text-xl font-bold ml-2">
                          Log Weight
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setShowWeightLogger(false);
                          setWeightInput('');
                          Keyboard.dismiss();
                        }}
                        className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>

                    <View className="mb-6">
                      <Text className="text-zinc-400 mb-2">
                        Weight (lbs) for {formatDate(selectedDate)}
                      </Text>
                      <TextInput
                        value={weightInput}
                        onChangeText={setWeightInput}
                        placeholder="Enter weight"
                        placeholderTextColor="#71717A"
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        onSubmitEditing={handleLogWeight}
                        className="bg-zinc-800 text-white text-2xl font-bold px-4 py-4 rounded-xl"
                        autoFocus
                      />
                    </View>

                    <Pressable
                      onPress={handleLogWeight}
                      className="bg-blue-600 rounded-2xl py-4 items-center active:bg-blue-700"
                      disabled={!weightInput}
                    >
                      <View className="flex-row items-center">
                        <Check size={20} color="#fff" />
                        <Text className="text-white font-bold text-lg ml-2">
                          Save Weight
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>

        {/* AI Meal Logger Modal */}
        <Modal
          visible={showAILogger}
          animationType="slide"
          transparent
          onRequestClose={() => {
            setShowAILogger(false);
            setAiMealDescription('');
            Keyboard.dismiss();
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex-1 bg-black/80 justify-end">
                <TouchableWithoutFeedback>
                  <View className="bg-zinc-900 rounded-t-3xl p-6">
                    <View className="flex-row items-center justify-between mb-6">
                      <View className="flex-row items-center">
                        <Sparkles size={24} color="#10B981" />
                        <Text className="text-white text-xl font-bold ml-2">
                          Log Meal with AI
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setShowAILogger(false);
                          setAiMealDescription('');
                          Keyboard.dismiss();
                        }}
                        className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>

                    <View className="mb-6">
                      <Text className="text-zinc-400 mb-2">
                        Describe your meal in natural language
                      </Text>
                      <Text className="text-zinc-600 text-sm mb-3">
                        e.g., "Two slices of pepperoni pizza and a Coke" or "Grilled chicken salad with balsamic dressing"
                      </Text>
                      <TextInput
                        value={aiMealDescription}
                        onChangeText={setAiMealDescription}
                        placeholder="I had a..."
                        placeholderTextColor="#52525B"
                        className="bg-zinc-800 text-white rounded-xl p-4 text-base"
                        style={{ minHeight: 100, textAlignVertical: 'top' }}
                        multiline
                        autoFocus
                        editable={!aiMealLoading}
                      />
                    </View>

                    <Pressable
                      onPress={handleAILogMeal}
                      disabled={aiMealLoading || !aiMealDescription.trim()}
                      className={cn(
                        'rounded-xl py-4 items-center',
                        aiMealLoading || !aiMealDescription.trim()
                          ? 'bg-zinc-800 opacity-50'
                          : 'bg-emerald-600 active:bg-emerald-700'
                      )}
                    >
                      <View className="flex-row items-center">
                        {aiMealLoading ? (
                          <>
                            <Text className="text-white font-semibold mr-2">Analyzing...</Text>
                            <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} color="#fff" />
                            <Text className="text-white font-semibold ml-2">
                              Log Meal
                            </Text>
                          </>
                        )}
                      </View>
                    </Pressable>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>

        {/* Recipe Detail Modal for Logged Meals */}
        {selectedMealLog && (() => {
          const recipe = recipes.find((r) => r.id === selectedMealLog.recipeId);

          if (recipe) {
            const folder = folders.find((f) => f.id === recipe.folderId);
            return (
              <RecipeDetailModal
                recipe={recipe}
                folder={folder}
                visible={true}
                onClose={() => setSelectedMealLog(null)}
              />
            );
          }

          // For meals without a recipe (AI-logged or manual), show a simple modal
          return (
            <Modal
              visible={true}
              animationType="slide"
              onRequestClose={() => setSelectedMealLog(null)}
            >
              <View className="flex-1 bg-black">
                <SafeAreaView edges={['top']} className="flex-1">
                  <View className="px-6 pt-4 pb-6 border-b border-zinc-800">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white text-2xl font-bold flex-1">
                        {selectedMealLog.recipeTitle}
                      </Text>
                      <Pressable
                        onPress={() => {
                          setSelectedMealLog(null);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>
                  </View>

                  <ScrollView className="flex-1 px-6 pt-6">
                    {/* Servings */}
                    <View className="mb-6">
                      <Text className="text-zinc-500 text-sm mb-1">Servings</Text>
                      <Text className="text-white text-lg">
                        {selectedMealLog.servings} serving{selectedMealLog.servings !== 1 ? 's' : ''}
                      </Text>
                    </View>

                    {/* Calories */}
                    <View className="bg-zinc-900 rounded-2xl p-4 mb-6">
                      <View className="flex-row items-center mb-2">
                        <Flame size={20} color="#F59E0B" />
                        <Text className="text-white font-bold text-lg ml-2">Calories</Text>
                      </View>
                      <Text className="text-amber-500 text-3xl font-bold">
                        {selectedMealLog.calories} cal
                      </Text>
                      <Text className="text-zinc-500 text-sm mt-1">
                        per {selectedMealLog.servings} serving{selectedMealLog.servings !== 1 ? 's' : ''}
                      </Text>
                    </View>

                    {/* Macros */}
                    <View className="mb-6">
                      <Text className="text-white font-bold text-lg mb-3">Macronutrients</Text>
                      <View className="flex-row gap-3">
                        <View className="flex-1 bg-zinc-900 rounded-2xl p-4">
                          <Text className="text-blue-400 text-sm mb-1">Protein</Text>
                          <Text className="text-white text-2xl font-bold">
                            {Math.round(selectedMealLog.macros.protein)}g
                          </Text>
                        </View>
                        <View className="flex-1 bg-zinc-900 rounded-2xl p-4">
                          <Text className="text-amber-400 text-sm mb-1">Carbs</Text>
                          <Text className="text-white text-2xl font-bold">
                            {Math.round(selectedMealLog.macros.carbs)}g
                          </Text>
                        </View>
                        <View className="flex-1 bg-zinc-900 rounded-2xl p-4">
                          <Text className="text-pink-400 text-sm mb-1">Fat</Text>
                          <Text className="text-white text-2xl font-bold">
                            {Math.round(selectedMealLog.macros.fat)}g
                          </Text>
                        </View>
                      </View>
                      {selectedMealLog.macros.fiber > 0 && (
                        <View className="bg-zinc-900 rounded-2xl p-4 mt-3">
                          <Text className="text-green-400 text-sm mb-1">Fiber</Text>
                          <Text className="text-white text-2xl font-bold">
                            {Math.round(selectedMealLog.macros.fiber)}g
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Ingredients */}
                    {selectedMealLog.ingredients && selectedMealLog.ingredients.length > 0 && (
                      <View className="mb-6">
                        <Text className="text-white font-bold text-lg mb-3">Ingredients</Text>
                        <View className="bg-zinc-900 rounded-2xl p-4">
                          {selectedMealLog.ingredients.map((ingredient, index) => (
                            <View
                              key={index}
                              className={cn(
                                "flex-row justify-between py-2",
                                index < selectedMealLog.ingredients!.length - 1 && "border-b border-zinc-800"
                              )}
                            >
                              <Text className="text-white flex-1">{ingredient.name}</Text>
                              <Text className="text-zinc-400 ml-3">{ingredient.amount}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Instructions */}
                    {selectedMealLog.instructions && selectedMealLog.instructions.length > 0 && (
                      <View className="mb-6">
                        <View className="flex-row items-center mb-3">
                          <ChefHat size={20} color="#fff" />
                          <Text className="text-white font-bold text-lg ml-2">Instructions</Text>
                        </View>
                        {selectedMealLog.instructions.map((instruction, index) => (
                          <View key={index} className="flex-row mb-3">
                            <View className="w-6 h-6 rounded-full bg-amber-500 items-center justify-center mr-3 mt-0.5">
                              <Text className="text-black font-bold text-xs">{index + 1}</Text>
                            </View>
                            <Text className="text-zinc-300 flex-1 leading-6">{instruction}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* AI Disclaimer */}
                    <View className="bg-zinc-900/50 rounded-2xl p-4 mb-6">
                      <Text className="text-zinc-400 text-sm text-center">
                        AI-estimated recipe based on your meal description.{'\n'}
                        Nutrition and instructions are approximate.
                      </Text>
                    </View>

                    {/* Save Button */}
                    {selectedMealLog.ingredients && selectedMealLog.instructions && (
                      <Pressable
                        onPress={() => {
                          handleSaveAIMealAsRecipe(selectedMealLog);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        className="bg-green-600 rounded-2xl py-4 mb-6 flex-row items-center justify-center active:bg-green-700"
                      >
                        <Save size={20} color="#fff" />
                        <Text className="text-white font-bold text-lg ml-2">
                          Save to Recipes
                        </Text>
                      </Pressable>
                    )}
                  </ScrollView>
                </SafeAreaView>
              </View>
            </Modal>
          );
        })()}
      </View>
    );
  }
