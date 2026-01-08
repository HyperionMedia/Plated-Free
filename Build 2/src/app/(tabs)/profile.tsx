import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Scale,
  Ruler,
  Calendar,
  Target,
  Flame,
  TrendingDown,
  TrendingUp,
  Activity,
  ChevronRight,
  Sparkles,
  Plus,
  Check,
  X,
  Ban,
  LogOut,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@tanstack/react-query';
import {
  useStore,
  calculateBMI,
  getBMICategory,
  calculateTDEE,
  calculateGoalCalories,
  calculateMacros,
  type UserProfile,
  type Recipe,
} from '@/lib/store';
import { cn } from '@/lib/cn';
import { getRecipeImageUrl } from '@/lib/recipeImages';
import { useRouter } from 'expo-router';

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { id: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
  { id: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
  { id: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' },
  { id: 'veryActive', label: 'Very Active', desc: 'Hard exercise daily' },
] as const;

interface SuggestedRecipe {
  title: string;
  description: string;
  caloriesPerServing: number;
  macros: { protein: number; carbs: number; fat: number; fiber: number };
  ingredients: { id: string; name: string; amount: string; category: string }[];
  instructions: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
  mealType: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const userProfile = useStore((s) => s.userProfile);
  const dailyGoals = useStore((s) => s.dailyGoals);
  const user = useStore((s) => s.user);
  const setUserProfile = useStore((s) => s.setUserProfile);
  const setDailyGoals = useStore((s) => s.setDailyGoals);
  const setCustomMacros = useStore((s) => s.setCustomMacros);
  const addRecipe = useStore((s) => s.addRecipe);
  const addAvoidedIngredient = useStore((s) => s.addAvoidedIngredient);
  const removeAvoidedIngredient = useStore((s) => s.removeAvoidedIngredient);
  const logout = useStore((s) => s.logout);

  const [showForm, setShowForm] = useState(!userProfile);
  const [showCustomMacros, setShowCustomMacros] = useState(false);
  const [showAvoidedIngredients, setShowAvoidedIngredients] = useState(false);
  const [newAvoidedIngredient, setNewAvoidedIngredient] = useState('');
  const [customProtein, setCustomProtein] = useState(dailyGoals?.protein?.toString() || '');
  const [customCarbs, setCustomCarbs] = useState(dailyGoals?.carbs?.toString() || '');
  const [customFat, setCustomFat] = useState(dailyGoals?.fat?.toString() || '');
  const [weight, setWeight] = useState(userProfile?.weight?.toString() || '');
  const [height, setHeight] = useState(userProfile?.height?.toString() || '');
  const [age, setAge] = useState(userProfile?.age?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female'>(userProfile?.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>(
    userProfile?.activityLevel || 'moderate'
  );
  const [goalWeight, setGoalWeight] = useState(userProfile?.goalWeight?.toString() || '');
  const [suggestedRecipes, setSuggestedRecipes] = useState<SuggestedRecipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());

  const calculations = useMemo(() => {
    if (!userProfile) return null;

    const bmi = calculateBMI(userProfile.weight, userProfile.height);
    const bmiCategory = getBMICategory(bmi);
    const tdee = calculateTDEE(userProfile);
    const weightDiff = userProfile.weight - userProfile.goalWeight;
    const goalType = weightDiff > 0 ? 'lose' : weightDiff < 0 ? 'gain' : 'maintain';
    const goalCalories = calculateGoalCalories(tdee, goalType, weightDiff);
    const macros = calculateMacros(goalCalories.calories, goalType);

    return {
      bmi,
      bmiCategory,
      tdee,
      goalType,
      ...goalCalories,
      macros,
    };
  }, [userProfile]);

  const suggestRecipesMutation = useMutation({
    mutationFn: async () => {
      if (!calculations || !dailyGoals) throw new Error('No goals set');

      const prompt = `Generate 3 healthy recipe suggestions for someone with these goals:
- Daily calories: ${dailyGoals.calories}
- Protein: ${dailyGoals.protein}g
- Carbs: ${dailyGoals.carbs}g
- Fat: ${dailyGoals.fat}g
- Goal: ${calculations.goalType === 'lose' ? 'weight loss' : calculations.goalType === 'gain' ? 'muscle gain' : 'maintenance'}

Return a JSON array with exactly 3 recipes in this format:
[
  {
    "title": "Recipe name",
    "description": "Brief description",
    "caloriesPerServing": 400,
    "macros": { "protein": 35, "carbs": 30, "fat": 15, "fiber": 5 },
    "ingredients": [
      { "id": "1", "name": "ingredient", "amount": "1 cup", "category": "produce" }
    ],
    "instructions": ["Step 1", "Step 2"],
    "servings": "4",
    "prepTime": "15 min",
    "cookTime": "25 min",
    "mealType": "dinner"
  }
]

Focus on:
${calculations.goalType === 'lose' ? '- High protein, lower calorie options\n- Filling, fiber-rich ingredients' : ''}
${calculations.goalType === 'gain' ? '- Calorie-dense, protein-rich foods\n- Complex carbs for energy' : ''}
- Easy to prepare
- Whole, nutritious ingredients

Return ONLY valid JSON array, no other text.`;

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

      if (!response.ok) throw new Error('Failed to get suggestions');

      const data = await response.json();
      const outputText = data.choices?.[0]?.message?.content || '';
      const jsonMatch = outputText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No valid response');

      return JSON.parse(jsonMatch[0]) as SuggestedRecipe[];
    },
    onSuccess: (recipes) => {
      setSuggestedRecipes(recipes);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (err) => {
      console.error('Suggestion error:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const saveProfile = useCallback(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age, 10);
    const goalWeightNum = parseFloat(goalWeight) || weightNum;

    if (!weightNum || !heightNum || !ageNum) return;

    const profile: UserProfile = {
      weight: weightNum,
      height: heightNum,
      age: ageNum,
      gender,
      activityLevel,
      goalWeight: goalWeightNum,
      goalType: goalWeightNum < weightNum ? 'lose' : goalWeightNum > weightNum ? 'gain' : 'maintain',
    };

    setUserProfile(profile);

    // Calculate and set goals
    const tdee = calculateTDEE(profile);
    const weightDiff = weightNum - goalWeightNum;
    const goalType = weightDiff > 0 ? 'lose' : weightDiff < 0 ? 'gain' : 'maintain';
    const goalCalories = calculateGoalCalories(tdee, goalType, weightDiff);
    const macros = calculateMacros(goalCalories.calories, goalType);

    setDailyGoals({
      calories: goalCalories.calories,
      ...macros,
    });

    setShowForm(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [weight, height, age, gender, activityLevel, goalWeight, setUserProfile, setDailyGoals]);

  const saveRecipe = useCallback((recipe: SuggestedRecipe) => {
    const newRecipe: Recipe = {
      id: `suggested-${Date.now()}-${Math.random()}`,
      title: recipe.title,
      imageUri: getRecipeImageUrl(recipe.title, recipe.mealType),
      ingredients: recipe.ingredients.map((ing, i) => ({
        ...ing,
        id: `${Date.now()}-${i}`,
        category: ing.category as any,
      })),
      instructions: recipe.instructions,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      folderId: recipe.mealType,
      createdAt: Date.now(),
      caloriesPerServing: recipe.caloriesPerServing,
      macros: recipe.macros,
      isSuggested: true,
    };

    addRecipe(newRecipe);
    setSavedRecipeIds((prev) => new Set([...prev, recipe.title]));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [addRecipe]);

  const handleSaveCustomMacros = useCallback(() => {
    const protein = parseInt(customProtein);
    const carbs = parseInt(customCarbs);
    const fat = parseInt(customFat);

    if (isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
      alert('Please enter valid numbers for all macros');
      return;
    }

    setCustomMacros(protein, carbs, fat);
    setShowCustomMacros(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [customProtein, customCarbs, customFat, setCustomMacros]);

  const handleAddAvoidedIngredient = useCallback(() => {
    const ingredient = newAvoidedIngredient.trim().toLowerCase();
    if (!ingredient) return;

    addAvoidedIngredient(ingredient);
    setNewAvoidedIngredient('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newAvoidedIngredient, addAvoidedIngredient]);

  const handleRemoveAvoidedIngredient = useCallback((ingredient: string) => {
    removeAvoidedIngredient(ingredient);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [removeAvoidedIngredient]);

  const handleLogout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
    router.replace('/login');
  }, [logout, router]);

  const handleGetRecipeSuggestions = useCallback(() => {
    // Proceed with mutation
    suggestRecipesMutation.mutate();
  }, [suggestRecipesMutation.mutate]);

  if (showForm) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView edges={['top']} className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              className="flex-1 px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <Text className="text-3xl font-bold text-white mt-2 mb-2">
                Your Profile
              </Text>
              <Text className="text-zinc-400 mb-6">
                Enter your details to calculate your goals
              </Text>

              {/* Gender */}
              <Text className="text-zinc-400 text-sm mb-2">Gender</Text>
              <View className="flex-row mb-5">
                {(['male', 'female'] as const).map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => {
                      setGender(g);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className={cn(
                      'flex-1 py-4 rounded-xl mr-2 items-center',
                      gender === g ? 'bg-amber-500' : 'bg-zinc-900'
                    )}
                  >
                    <Text className={cn(
                      'font-semibold capitalize',
                      gender === g ? 'text-black' : 'text-white'
                    )}>
                      {g}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Weight */}
              <Text className="text-zinc-400 text-sm mb-2">Current Weight (lbs)</Text>
              <View className="bg-zinc-900 rounded-xl px-4 py-3 mb-5 flex-row items-center">
                <Scale size={20} color="#71717A" />
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="180"
                  placeholderTextColor="#52525B"
                  className="flex-1 text-white text-lg ml-3"
                />
              </View>

              {/* Height */}
              <Text className="text-zinc-400 text-sm mb-2">Height (inches)</Text>
              <View className="bg-zinc-900 rounded-xl px-4 py-3 mb-5 flex-row items-center">
                <Ruler size={20} color="#71717A" />
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  placeholder="70"
                  placeholderTextColor="#52525B"
                  className="flex-1 text-white text-lg ml-3"
                />
                <Text className="text-zinc-500 text-sm">
                  {height ? `${Math.floor(parseFloat(height) / 12)}'${Math.round(parseFloat(height) % 12)}"` : ''}
                </Text>
              </View>

              {/* Age */}
              <Text className="text-zinc-400 text-sm mb-2">Age</Text>
              <View className="bg-zinc-900 rounded-xl px-4 py-3 mb-5 flex-row items-center">
                <Calendar size={20} color="#71717A" />
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor="#52525B"
                  className="flex-1 text-white text-lg ml-3"
                />
              </View>

              {/* Activity Level */}
              <Text className="text-zinc-400 text-sm mb-2">Activity Level</Text>
              <View className="mb-5">
                {ACTIVITY_LEVELS.map((level) => (
                  <Pressable
                    key={level.id}
                    onPress={() => {
                      setActivityLevel(level.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className={cn(
                      'py-3 px-4 rounded-xl mb-2 flex-row items-center justify-between',
                      activityLevel === level.id ? 'bg-amber-500' : 'bg-zinc-900'
                    )}
                  >
                    <View>
                      <Text className={cn(
                        'font-semibold',
                        activityLevel === level.id ? 'text-black' : 'text-white'
                      )}>
                        {level.label}
                      </Text>
                      <Text className={cn(
                        'text-sm',
                        activityLevel === level.id ? 'text-black/70' : 'text-zinc-500'
                      )}>
                        {level.desc}
                      </Text>
                    </View>
                    {activityLevel === level.id && <Check size={20} color="#000" />}
                  </Pressable>
                ))}
              </View>

              {/* Goal Weight */}
              <Text className="text-zinc-400 text-sm mb-2">Goal Weight (lbs)</Text>
              <View className="bg-zinc-900 rounded-xl px-4 py-3 mb-8 flex-row items-center">
                <Target size={20} color="#71717A" />
                <TextInput
                  value={goalWeight}
                  onChangeText={setGoalWeight}
                  keyboardType="numeric"
                  placeholder={weight || '165'}
                  placeholderTextColor="#52525B"
                  className="flex-1 text-white text-lg ml-3"
                />
              </View>

              {/* Save Button */}
              <Pressable
                onPress={saveProfile}
                disabled={!weight || !height || !age}
                className={cn(
                  'py-4 rounded-xl items-center',
                  weight && height && age ? 'bg-amber-500 active:bg-amber-600' : 'bg-zinc-800'
                )}
              >
                <Text className={cn(
                  'font-bold text-lg',
                  weight && height && age ? 'text-black' : 'text-zinc-500'
                )}>
                  Calculate My Goals
                </Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-white">Profile</Text>
            <Pressable
              onPress={() => setShowForm(true)}
              className="bg-zinc-900 px-4 py-2 rounded-xl active:bg-zinc-800"
            >
              <Text className="text-amber-500 font-medium">Edit</Text>
            </Pressable>
          </View>

          {userProfile && calculations && (
            <>
              {/* Account Section with Logout */}
              <Animated.View entering={FadeInUp.delay(100)} className="px-5 mb-4">
                <View className="bg-zinc-900 rounded-2xl p-5">
                  {/* User Info */}
                  {user && (
                    <View className="mb-4 pb-4 border-b border-zinc-800">
                      <Text className="text-zinc-400 text-sm mb-2">Logged in as</Text>
                      <Text className="text-white font-semibold text-base">{user.username}</Text>
                      <Text className="text-zinc-500 text-sm">{user.email}</Text>
                    </View>
                  )}

                  {/* Logout Button */}
                  <Pressable
                    onPress={handleLogout}
                    className="bg-red-500/10 rounded-xl py-4 items-center justify-center border border-red-500/30 active:bg-red-500/20"
                  >
                    <View className="flex-row items-center">
                      <LogOut size={20} color="#EF4444" />
                      <Text className="text-red-500 font-bold ml-2">Log Out</Text>
                    </View>
                  </Pressable>
                </View>
              </Animated.View>

              {/* BMI Card */}
              <Animated.View entering={FadeInUp.delay(200)} className="px-5 mb-4">
                <LinearGradient
                  colors={['#18181B', '#09090B']}
                  style={{ borderRadius: 24, padding: 20 }}
                >
                  <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center">
                      <User size={24} color="#F59E0B" />
                    </View>
                    <View className="ml-4">
                      <Text className="text-white text-lg font-semibold">
                        {userProfile.weight} lbs | {Math.floor(userProfile.height / 12)}'{Math.round(userProfile.height % 12)}"
                      </Text>
                      <Text className="text-zinc-500">
                        {userProfile.age} years old | {userProfile.gender}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row">
                    <View className="flex-1 bg-zinc-800 rounded-xl p-4 mr-2">
                      <Text className="text-zinc-400 text-sm mb-1">BMI</Text>
                      <Text className="text-white text-2xl font-bold">
                        {calculations.bmi.toFixed(1)}
                      </Text>
                      <Text className={cn(
                        'text-sm font-medium',
                        calculations.bmiCategory === 'Normal' ? 'text-green-500' :
                        calculations.bmiCategory === 'Overweight' ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {calculations.bmiCategory}
                      </Text>
                    </View>
                    <View className="flex-1 bg-zinc-800 rounded-xl p-4 ml-2">
                      <Text className="text-zinc-400 text-sm mb-1">Maintenance</Text>
                      <Text className="text-white text-2xl font-bold">
                        {calculations.tdee}
                      </Text>
                      <Text className="text-zinc-500 text-sm">cal/day</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Goal Card */}
              <Animated.View entering={FadeInUp.delay(300)} className="px-5 mb-4">
                <LinearGradient
                  colors={['#18181B', '#09090B']}
                  style={{ borderRadius: 24, padding: 20 }}
                >
                  <View className="flex-row items-center mb-4">
                    {calculations.goalType === 'lose' ? (
                      <TrendingDown size={24} color="#22C55E" />
                    ) : calculations.goalType === 'gain' ? (
                      <TrendingUp size={24} color="#3B82F6" />
                    ) : (
                      <Activity size={24} color="#F59E0B" />
                    )}
                    <Text className="text-white text-lg font-semibold ml-3">
                      {calculations.goalType === 'lose' ? 'Weight Loss Goal' :
                       calculations.goalType === 'gain' ? 'Weight Gain Goal' : 'Maintenance'}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between mb-4">
                    <View className="items-center">
                      <Text className="text-zinc-400 text-sm">Current</Text>
                      <Text className="text-white text-xl font-bold">{userProfile.weight} lbs</Text>
                    </View>
                    <ChevronRight size={20} color="#71717A" />
                    <View className="items-center">
                      <Text className="text-zinc-400 text-sm">Goal</Text>
                      <Text className="text-amber-500 text-xl font-bold">{userProfile.goalWeight} lbs</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-zinc-400 text-sm">Timeline</Text>
                      <Text className="text-white text-xl font-bold">
                        {calculations.weeksToGoal} wks
                      </Text>
                    </View>
                  </View>

                  {calculations.deficit > 0 && (
                    <View className="bg-zinc-800 rounded-xl p-3">
                      <Text className="text-zinc-400 text-sm text-center">
                        {calculations.goalType === 'lose' ? 'Daily calorie deficit' : 'Daily calorie surplus'}:{' '}
                        <Text className="text-amber-500 font-semibold">{calculations.deficit} cal</Text>
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </Animated.View>

              {/* Daily Targets */}
              <Animated.View entering={FadeInUp.delay(400)} className="px-5 mb-4">
                <LinearGradient
                  colors={['#18181B', '#09090B']}
                  style={{ borderRadius: 24, padding: 20 }}
                >
                  <View className="flex-row items-center mb-4">
                    <Flame size={24} color="#F59E0B" />
                    <Text className="text-white text-lg font-semibold ml-3">
                      Daily Targets
                    </Text>
                  </View>

                  <View className="bg-amber-500 rounded-xl p-4 mb-4">
                    <Text className="text-black/70 text-sm">Target Calories</Text>
                    <Text className="text-black text-3xl font-bold">
                      {dailyGoals?.calories || calculations.calories} cal
                    </Text>
                  </View>

                  <View className="flex-row">
                    {[
                      { label: 'Protein', value: dailyGoals?.protein || calculations.macros.protein, color: '#3B82F6' },
                      { label: 'Carbs', value: dailyGoals?.carbs || calculations.macros.carbs, color: '#F59E0B' },
                      { label: 'Fat', value: dailyGoals?.fat || calculations.macros.fat, color: '#EC4899' },
                    ].map((macro) => (
                      <View key={macro.label} className="flex-1 items-center">
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center mb-2"
                          style={{ backgroundColor: `${macro.color}20` }}
                        >
                          <Text style={{ color: macro.color }} className="font-bold">
                            {macro.value}g
                          </Text>
                        </View>
                        <Text className="text-zinc-400 text-sm">{macro.label}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Custom Macro Goals Display Widget */}
              {dailyGoals?.isCustom && (
                <Animated.View entering={FadeInUp.delay(425)} className="px-5 mb-4">
                  <LinearGradient
                    colors={['#1E3A5F', '#0F172A']}
                    style={{ borderRadius: 24, padding: 20 }}
                  >
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center">
                        <Target size={24} color="#3B82F6" />
                        <Text className="text-white text-lg font-semibold ml-3">
                          Custom Macro Goals
                        </Text>
                      </View>
                      <View className="bg-emerald-600/30 rounded-full px-3 py-1">
                        <Text className="text-emerald-400 text-xs font-semibold">Active</Text>
                      </View>
                    </View>

                    <View className="bg-blue-500/20 rounded-xl p-4 mb-4">
                      <Text className="text-blue-300/70 text-sm">Custom Daily Calories</Text>
                      <Text className="text-blue-400 text-3xl font-bold">
                        {(dailyGoals.protein * 4) + (dailyGoals.carbs * 4) + (dailyGoals.fat * 9)} cal
                      </Text>
                    </View>

                    <View className="flex-row mb-4">
                      <View className="flex-1 bg-zinc-900/50 rounded-xl p-3 mr-2 items-center">
                        <Text className="text-blue-400 text-2xl font-bold">{dailyGoals.protein}g</Text>
                        <Text className="text-zinc-400 text-xs mt-1">Protein</Text>
                        <Text className="text-zinc-600 text-xs">{dailyGoals.protein * 4} cal</Text>
                      </View>
                      <View className="flex-1 bg-zinc-900/50 rounded-xl p-3 mx-1 items-center">
                        <Text className="text-amber-400 text-2xl font-bold">{dailyGoals.carbs}g</Text>
                        <Text className="text-zinc-400 text-xs mt-1">Carbs</Text>
                        <Text className="text-zinc-600 text-xs">{dailyGoals.carbs * 4} cal</Text>
                      </View>
                      <View className="flex-1 bg-zinc-900/50 rounded-xl p-3 ml-2 items-center">
                        <Text className="text-pink-400 text-2xl font-bold">{dailyGoals.fat}g</Text>
                        <Text className="text-zinc-400 text-xs mt-1">Fat</Text>
                        <Text className="text-zinc-600 text-xs">{dailyGoals.fat * 9} cal</Text>
                      </View>
                    </View>

                    <View className="bg-zinc-900/50 rounded-xl p-3">
                      <Text className="text-zinc-400 text-xs text-center">
                        These custom goals override the calculated values based on your profile
                      </Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              )}

              {/* Custom Macros Section */}
              <Animated.View entering={FadeInUp.delay(450)} className="px-5 mb-4">
                <Pressable
                  onPress={() => setShowCustomMacros(!showCustomMacros)}
                  className="bg-zinc-900 rounded-2xl p-4 active:bg-zinc-800"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Target size={20} color="#3B82F6" />
                      <Text className="text-white font-semibold ml-2">Custom Macro Goals</Text>
                    </View>
                    <View className="flex-row items-center">
                      {dailyGoals?.isCustom && (
                        <View className="bg-emerald-600/20 rounded-full px-2 py-1 mr-2">
                          <Text className="text-emerald-500 text-xs font-semibold">Active</Text>
                        </View>
                      )}
                      <ChevronRight
                        size={18}
                        color="#71717A"
                        style={{ transform: [{ rotate: showCustomMacros ? '90deg' : '0deg' }] }}
                      />
                    </View>
                  </View>
                  <Text className="text-zinc-500 text-sm mt-1">
                    Override calculated macros with your own targets
                  </Text>
                </Pressable>

                {showCustomMacros && (
                  <Animated.View entering={FadeInDown} className="bg-zinc-900 rounded-2xl p-4 mt-2">
                    <View className="mb-3">
                      <Text className="text-white font-semibold mb-2">Protein (g)</Text>
                      <TextInput
                        value={customProtein}
                        onChangeText={setCustomProtein}
                        placeholder="e.g., 150"
                        placeholderTextColor="#71717A"
                        keyboardType="numeric"
                        className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-white font-semibold mb-2">Carbs (g)</Text>
                      <TextInput
                        value={customCarbs}
                        onChangeText={setCustomCarbs}
                        placeholder="e.g., 200"
                        placeholderTextColor="#71717A"
                        keyboardType="numeric"
                        className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base"
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="text-white font-semibold mb-2">Fat (g)</Text>
                      <TextInput
                        value={customFat}
                        onChangeText={setCustomFat}
                        placeholder="e.g., 60"
                        placeholderTextColor="#71717A"
                        keyboardType="numeric"
                        className="bg-zinc-800 rounded-xl px-4 py-3 text-white text-base"
                      />
                    </View>

                    <View className="bg-zinc-800 rounded-xl p-3 mb-4">
                      <Text className="text-zinc-400 text-xs mb-1">Calculated Calories</Text>
                      <Text className="text-white text-lg font-bold">
                        {parseInt(customProtein || '0') * 4 + parseInt(customCarbs || '0') * 4 + parseInt(customFat || '0') * 9} cal
                      </Text>
                    </View>

                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => setShowCustomMacros(false)}
                        className="flex-1 bg-zinc-800 rounded-xl py-3 items-center active:bg-zinc-700"
                      >
                        <Text className="text-zinc-400 font-semibold">Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleSaveCustomMacros}
                        className="flex-1 bg-blue-600 rounded-xl py-3 items-center active:bg-blue-700"
                      >
                        <Text className="text-white font-semibold">Save Goals</Text>
                      </Pressable>
                    </View>
                  </Animated.View>
                )}
              </Animated.View>

              {/* Avoid Ingredients Section */}
              <Animated.View entering={FadeInUp.delay(475)} className="px-5 mb-4">
                <Pressable
                  onPress={() => setShowAvoidedIngredients(!showAvoidedIngredients)}
                  className="bg-zinc-900 rounded-2xl p-4 active:bg-zinc-800"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ban size={20} color="#EF4444" />
                      <Text className="text-white font-semibold ml-2">Avoid Ingredients</Text>
                    </View>
                    <View className="flex-row items-center">
                      {userProfile?.avoidedIngredients && userProfile.avoidedIngredients.length > 0 && (
                        <View className="bg-red-600/20 rounded-full px-2 py-1 mr-2">
                          <Text className="text-red-500 text-xs font-semibold">
                            {userProfile.avoidedIngredients.length}
                          </Text>
                        </View>
                      )}
                      <ChevronRight
                        size={18}
                        color="#71717A"
                        style={{ transform: [{ rotate: showAvoidedIngredients ? '90deg' : '0deg' }] }}
                      />
                    </View>
                  </View>
                  <Text className="text-zinc-500 text-sm mt-1">
                    Exclude ingredients from AI-generated recipes
                  </Text>
                </Pressable>

                {showAvoidedIngredients && (
                  <Animated.View entering={FadeInDown} className="bg-zinc-900 rounded-2xl p-4 mt-2">
                    <View className="mb-4">
                      <Text className="text-white font-semibold mb-2">Add Ingredient to Avoid</Text>
                      <View className="flex-row gap-2">
                        <TextInput
                          value={newAvoidedIngredient}
                          onChangeText={setNewAvoidedIngredient}
                          placeholder="e.g., seafood, dairy, nuts"
                          placeholderTextColor="#71717A"
                          className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 text-white text-base"
                          onSubmitEditing={handleAddAvoidedIngredient}
                        />
                        <Pressable
                          onPress={handleAddAvoidedIngredient}
                          disabled={!newAvoidedIngredient.trim()}
                          className="bg-red-600 rounded-xl px-4 items-center justify-center active:bg-red-700 disabled:bg-zinc-700"
                        >
                          <Plus size={20} color={newAvoidedIngredient.trim() ? '#fff' : '#52525B'} />
                        </Pressable>
                      </View>
                    </View>

                    {userProfile?.avoidedIngredients && userProfile.avoidedIngredients.length > 0 ? (
                      <View>
                        <Text className="text-zinc-400 text-xs mb-2">CURRENTLY AVOIDING</Text>
                        <View className="flex-row flex-wrap gap-2">
                          {userProfile.avoidedIngredients.map((ingredient) => (
                            <View
                              key={ingredient}
                              className="bg-zinc-800 rounded-xl pl-3 pr-2 py-2 flex-row items-center"
                            >
                              <Text className="text-white text-sm mr-1">{ingredient}</Text>
                              <Pressable
                                onPress={() => handleRemoveAvoidedIngredient(ingredient)}
                                className="w-5 h-5 rounded-full bg-zinc-700 items-center justify-center active:bg-zinc-600"
                              >
                                <X size={12} color="#fff" />
                              </Pressable>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View className="bg-zinc-800 rounded-xl p-4 items-center">
                        <Ban size={32} color="#52525B" style={{ marginBottom: 8 }} />
                        <Text className="text-zinc-500 text-sm text-center">
                          No avoided ingredients yet. Add ingredients you don't want in AI-generated recipes.
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                )}
              </Animated.View>

              {/* Recipe Suggestions */}
              <Animated.View entering={FadeInUp.delay(500)} className="px-5">
                <Pressable
                  onPress={handleGetRecipeSuggestions}
                  disabled={suggestRecipesMutation.isPending}
                  className="rounded-2xl py-4 flex-row items-center justify-center mb-4 active:opacity-90"
                  style={{ backgroundColor: '#10B981' }}
                >
                  {suggestRecipesMutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Sparkles size={20} color="#fff" />
                      <Text className="text-white font-bold ml-2">
                        Get Recipe Suggestions
                      </Text>
                    </>
                  )}
                </Pressable>

                {suggestedRecipes.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-zinc-400 text-sm mb-3">
                      Suggested for your goals
                    </Text>
                    {suggestedRecipes.map((recipe, index) => (
                      <Animated.View
                        key={`${recipe.title}-${index}`}
                        entering={FadeInDown.delay(index * 100)}
                        className="bg-zinc-900 rounded-2xl p-4 mb-3"
                      >
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1 mr-3">
                            <Text className="text-white font-semibold text-lg">
                              {recipe.title}
                            </Text>
                            <Text className="text-zinc-400 text-sm mt-1" numberOfLines={2}>
                              {recipe.description}
                            </Text>
                            <View className="flex-row items-center mt-2">
                              <Flame size={12} color="#F59E0B" />
                              <Text className="text-amber-500 text-sm ml-1">
                                {recipe.caloriesPerServing} cal
                              </Text>
                              <Text className="text-zinc-500 text-sm ml-3">
                                P: {recipe.macros.protein}g | C: {recipe.macros.carbs}g | F: {recipe.macros.fat}g
                              </Text>
                            </View>
                          </View>
                          <Pressable
                            onPress={() => saveRecipe(recipe)}
                            disabled={savedRecipeIds.has(recipe.title)}
                            className={cn(
                              'w-10 h-10 rounded-full items-center justify-center',
                              savedRecipeIds.has(recipe.title) ? 'bg-green-500' : 'bg-amber-500 active:bg-amber-600'
                            )}
                          >
                            {savedRecipeIds.has(recipe.title) ? (
                              <Check size={18} color="#fff" />
                            ) : (
                              <Plus size={18} color="#000" />
                            )}
                          </Pressable>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                )}
              </Animated.View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
