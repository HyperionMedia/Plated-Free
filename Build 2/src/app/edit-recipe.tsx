import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Save, Plus, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useStore, type Recipe, type IngredientCategory } from '@/lib/store';

export default function EditRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const recipes = useStore((s) => s.recipes);
  const updateRecipe = useStore((s) => s.updateRecipe);

  const recipe = recipes.find((r) => r.id === recipeId);

  const [title, setTitle] = useState<string>('');
  const [servings, setServings] = useState<string>('');
  const [prepTime, setPrepTime] = useState<string>('');
  const [cookTime, setCookTime] = useState<string>('');
  const [caloriesPerServing, setCaloriesPerServing] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fat, setFat] = useState<string>('');
  const [fiber, setFiber] = useState<string>('');
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; amount: string; category: IngredientCategory }>>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setServings(recipe.servings);
      setPrepTime(recipe.prepTime);
      setCookTime(recipe.cookTime);
      setCaloriesPerServing(recipe.caloriesPerServing.toString());
      setProtein(recipe.macros.protein.toString());
      setCarbs(recipe.macros.carbs.toString());
      setFat(recipe.macros.fat.toString());
      setFiber(recipe.macros.fiber.toString());
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
    }
  }, [recipe]);

  const handleSave = () => {
    if (!recipe || !recipeId) return;

    setIsSaving(true);

    // Calculate macros if changed
    const updatedRecipe: Partial<Recipe> = {
      title: title.trim(),
      servings: servings.trim(),
      prepTime: prepTime.trim(),
      cookTime: cookTime.trim(),
      caloriesPerServing: parseInt(caloriesPerServing) || recipe.caloriesPerServing,
      macros: {
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
        fiber: parseInt(fiber) || 0,
      },
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      instructions: instructions.filter(inst => inst.trim() !== ''),
    };

    updateRecipe(recipeId, updatedRecipe);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 300);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: `ing-${Date.now()}`, name: '', amount: '', category: 'other' },
    ]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!recipe) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Recipe not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
          >
            <X size={20} color="#fff" />
          </Pressable>
          <Text className="text-white text-xl font-bold">Edit Recipe</Text>
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            className="flex-row items-center px-4 py-2 bg-emerald-600 rounded-xl active:bg-emerald-700"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Save size={16} color="#fff" />
                <Text className="text-white font-semibold ml-2">Save</Text>
              </>
            )}
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Basic Info */}
          <View className="px-5 py-4">
            <Text className="text-white text-lg font-bold mb-3">Basic Info</Text>

            <View className="mb-4">
              <Text className="text-zinc-400 text-sm mb-2">Recipe Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter recipe title"
                placeholderTextColor="#52525B"
                className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Servings</Text>
                <TextInput
                  value={servings}
                  onChangeText={setServings}
                  placeholder="4"
                  placeholderTextColor="#52525B"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Prep Time</Text>
                <TextInput
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="15 min"
                  placeholderTextColor="#52525B"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Cook Time</Text>
                <TextInput
                  value={cookTime}
                  onChangeText={setCookTime}
                  placeholder="30 min"
                  placeholderTextColor="#52525B"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
            </View>
          </View>

          {/* Nutrition */}
          <View className="px-5 py-4 border-t border-zinc-800">
            <Text className="text-white text-lg font-bold mb-3">Nutrition (per serving)</Text>

            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Calories</Text>
                <TextInput
                  value={caloriesPerServing}
                  onChangeText={setCaloriesPerServing}
                  placeholder="350"
                  placeholderTextColor="#52525B"
                  keyboardType="numeric"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Protein (g)</Text>
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="25"
                  placeholderTextColor="#52525B"
                  keyboardType="numeric"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Carbs (g)</Text>
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="40"
                  placeholderTextColor="#52525B"
                  keyboardType="numeric"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Fat (g)</Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  placeholder="12"
                  placeholderTextColor="#52525B"
                  keyboardType="numeric"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm mb-2">Fiber (g)</Text>
                <TextInput
                  value={fiber}
                  onChangeText={setFiber}
                  placeholder="5"
                  placeholderTextColor="#52525B"
                  keyboardType="numeric"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                />
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View className="px-5 py-4 border-t border-zinc-800">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-lg font-bold">Ingredients</Text>
              <Pressable
                onPress={addIngredient}
                className="flex-row items-center px-3 py-2 bg-blue-600 rounded-lg active:bg-blue-700"
              >
                <Plus size={14} color="#fff" />
                <Text className="text-white text-sm font-semibold ml-1">Add</Text>
              </Pressable>
            </View>

            {ingredients.map((ingredient, index) => (
              <Animated.View
                key={ingredient.id}
                entering={FadeInDown.delay(index * 50)}
                className="flex-row items-center gap-2 mb-3"
              >
                <View className="flex-1">
                  <TextInput
                    value={ingredient.name}
                    onChangeText={(value) => updateIngredient(index, 'name', value)}
                    placeholder="Ingredient name"
                    placeholderTextColor="#52525B"
                    className="bg-zinc-900 text-white px-3 py-3 rounded-xl"
                  />
                </View>
                <View className="w-24">
                  <TextInput
                    value={ingredient.amount}
                    onChangeText={(value) => updateIngredient(index, 'amount', value)}
                    placeholder="1 cup"
                    placeholderTextColor="#52525B"
                    className="bg-zinc-900 text-white px-3 py-3 rounded-xl"
                  />
                </View>
                <Pressable
                  onPress={() => removeIngredient(index)}
                  className="w-10 h-10 bg-zinc-900 rounded-xl items-center justify-center active:bg-zinc-800"
                >
                  <Trash2 size={16} color="#EF4444" />
                </Pressable>
              </Animated.View>
            ))}
          </View>

          {/* Instructions */}
          <View className="px-5 py-4 border-t border-zinc-800">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-lg font-bold">Instructions</Text>
              <Pressable
                onPress={addInstruction}
                className="flex-row items-center px-3 py-2 bg-blue-600 rounded-lg active:bg-blue-700"
              >
                <Plus size={14} color="#fff" />
                <Text className="text-white text-sm font-semibold ml-1">Add</Text>
              </Pressable>
            </View>

            {instructions.map((instruction, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(index * 50)}
                className="flex-row items-start gap-2 mb-3"
              >
                <View className="w-8 h-8 rounded-full bg-emerald-600/20 items-center justify-center mt-2">
                  <Text className="text-emerald-400 font-bold text-sm">{index + 1}</Text>
                </View>
                <View className="flex-1">
                  <TextInput
                    value={instruction}
                    onChangeText={(value) => updateInstruction(index, value)}
                    placeholder={`Step ${index + 1}`}
                    placeholderTextColor="#52525B"
                    multiline
                    className="bg-zinc-900 text-white px-3 py-3 rounded-xl min-h-[80px]"
                    textAlignVertical="top"
                  />
                </View>
                <Pressable
                  onPress={() => removeInstruction(index)}
                  className="w-10 h-10 bg-zinc-900 rounded-xl items-center justify-center active:bg-zinc-800 mt-2"
                >
                  <Trash2 size={16} color="#EF4444" />
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
