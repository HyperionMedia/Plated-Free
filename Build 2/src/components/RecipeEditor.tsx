import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plus, Minus, Save, Copy, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Recipe } from '@/lib/store';

interface RecipeEditorProps {
  visible: boolean;
  recipe: Recipe;
  onClose: () => void;
  onSave: (recipe: Recipe, saveAsNew: boolean) => void;
}

export function RecipeEditor({ visible, recipe, onClose, onSave }: RecipeEditorProps) {
  const [title, setTitle] = useState(recipe.title);
  const [servings, setServings] = useState(recipe.servings);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);
  const [cookTime, setCookTime] = useState(recipe.cookTime);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  // Reset state when recipe changes
  useEffect(() => {
    if (visible) {
      setTitle(recipe.title);
      setServings(recipe.servings);
      setPrepTime(recipe.prepTime);
      setCookTime(recipe.cookTime);
      setIngredients([...recipe.ingredients]);
      setInstructions([...recipe.instructions]);
    }
  }, [visible, recipe]);

  const handleUpdateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: `ing-${Date.now()}`,
        name: '',
        amount: '',
        category: 'other',
      },
    ]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRemoveInstruction = (index: number) => {
    const updated = instructions.filter((_, i) => i !== index);
    setInstructions(updated);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const calculateCaloriesAndMacros = () => {
    // Simple estimation based on ingredient count and recipe complexity
    // In a real app, this would use an AI API or ingredient database
    const ingredientCount = ingredients.length;
    const servingCount = parseInt(servings) || 1;

    // Base calories estimation (rough average)
    const baseCalories = ingredientCount * 80;
    const caloriesPerServing = Math.round(baseCalories / servingCount);

    // Macro estimation (rough percentages)
    const protein = Math.round(caloriesPerServing * 0.25 / 4); // 25% calories from protein
    const carbs = Math.round(caloriesPerServing * 0.45 / 4); // 45% calories from carbs
    const fat = Math.round(caloriesPerServing * 0.30 / 9); // 30% calories from fat
    const fiber = Math.round(ingredientCount * 0.5); // Rough fiber estimate

    return {
      caloriesPerServing,
      macros: { protein, carbs, fat, fiber },
    };
  };

  const handleSave = (saveAsNew: boolean) => {
    const { caloriesPerServing, macros } = calculateCaloriesAndMacros();

    const updatedRecipe: Recipe = {
      ...recipe,
      id: saveAsNew ? `recipe-${Date.now()}` : recipe.id,
      title,
      servings,
      prepTime,
      cookTime,
      ingredients,
      instructions,
      caloriesPerServing,
      macros,
      createdAt: saveAsNew ? Date.now() : recipe.createdAt,
    };

    onSave(updatedRecipe, saveAsNew);
    setShowSaveOptions(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-zinc-800">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">Edit Recipe</Text>
              <Text className="text-zinc-500 text-sm">
                Make changes and save
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
            >
              <X size={20} color="#fff" />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {/* Basic Info */}
              <View className="px-5 py-4">
                <Text className="text-white font-semibold mb-3">Basic Info</Text>

                <Text className="text-zinc-400 text-sm mb-2">Recipe Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter recipe title"
                  placeholderTextColor="#71717A"
                  className="bg-zinc-900 text-white px-4 py-3 rounded-xl mb-4"
                />

                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1">
                    <Text className="text-zinc-400 text-sm mb-2">Servings</Text>
                    <TextInput
                      value={servings}
                      onChangeText={setServings}
                      placeholder="4"
                      placeholderTextColor="#71717A"
                      className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-zinc-400 text-sm mb-2">Prep Time</Text>
                    <TextInput
                      value={prepTime}
                      onChangeText={setPrepTime}
                      placeholder="15 min"
                      placeholderTextColor="#71717A"
                      className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-zinc-400 text-sm mb-2">Cook Time</Text>
                    <TextInput
                      value={cookTime}
                      onChangeText={setCookTime}
                      placeholder="30 min"
                      placeholderTextColor="#71717A"
                      className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                    />
                  </View>
                </View>
              </View>

              {/* Ingredients */}
              <View className="px-5 py-4 border-t border-zinc-800">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white font-semibold">
                    Ingredients ({ingredients.length})
                  </Text>
                  <Pressable
                    onPress={handleAddIngredient}
                    className="bg-blue-600 rounded-full px-4 py-2 flex-row items-center active:bg-blue-700"
                  >
                    <Plus size={16} color="#fff" />
                    <Text className="text-white font-semibold ml-1 text-sm">
                      Add
                    </Text>
                  </Pressable>
                </View>

                {ingredients.map((ingredient, index) => (
                  <Animated.View
                    key={ingredient.id}
                    entering={FadeInDown.delay(index * 30)}
                    className="flex-row items-center mb-3"
                  >
                    <View className="flex-1 mr-2">
                      <TextInput
                        value={ingredient.name}
                        onChangeText={(text) => handleUpdateIngredient(index, 'name', text)}
                        placeholder="Ingredient name"
                        placeholderTextColor="#71717A"
                        className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                      />
                    </View>
                    <View style={{ width: 100 }} className="mr-2">
                      <TextInput
                        value={ingredient.amount}
                        onChangeText={(text) => handleUpdateIngredient(index, 'amount', text)}
                        placeholder="Amount"
                        placeholderTextColor="#71717A"
                        className="bg-zinc-900 text-white px-4 py-3 rounded-xl"
                      />
                    </View>
                    <Pressable
                      onPress={() => handleRemoveIngredient(index)}
                      className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </Pressable>
                  </Animated.View>
                ))}
              </View>

              {/* Instructions */}
              <View className="px-5 py-4 border-t border-zinc-800">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white font-semibold">
                    Instructions ({instructions.length})
                  </Text>
                  <Pressable
                    onPress={handleAddInstruction}
                    className="bg-blue-600 rounded-full px-4 py-2 flex-row items-center active:bg-blue-700"
                  >
                    <Plus size={16} color="#fff" />
                    <Text className="text-white font-semibold ml-1 text-sm">
                      Add
                    </Text>
                  </Pressable>
                </View>

                {instructions.map((instruction, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 30)}
                    className="mb-3"
                  >
                    <View className="flex-row items-start">
                      <View className="w-6 h-6 rounded-full bg-amber-500 items-center justify-center mr-3 mt-3">
                        <Text className="text-black text-xs font-bold">
                          {index + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <TextInput
                          value={instruction}
                          onChangeText={(text) => handleUpdateInstruction(index, text)}
                          placeholder="Enter instruction step"
                          placeholderTextColor="#71717A"
                          multiline
                          numberOfLines={3}
                          className="bg-zinc-900 text-white px-4 py-3 rounded-xl flex-1"
                          style={{ minHeight: 80 }}
                        />
                      </View>
                      <Pressable
                        onPress={() => handleRemoveInstruction(index)}
                        className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center ml-2 mt-3 active:bg-zinc-800"
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </Pressable>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Save Button */}
          <View className="px-5 py-4 border-t border-zinc-800">
            <Pressable
              onPress={() => setShowSaveOptions(true)}
              className="bg-emerald-500 rounded-xl py-4 items-center active:bg-emerald-600"
            >
              <View className="flex-row items-center">
                <Save size={20} color="#000" />
                <Text className="text-black font-bold text-lg ml-2">
                  Save Changes
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Save Options Modal */}
          <Modal
            visible={showSaveOptions}
            animationType="fade"
            transparent
            onRequestClose={() => setShowSaveOptions(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowSaveOptions(false)}>
              <View className="flex-1 bg-black/80 justify-end">
                <TouchableWithoutFeedback>
                  <View className="bg-zinc-900 rounded-t-3xl p-6">
                    <Text className="text-white text-xl font-bold mb-2">
                      Save Changes
                    </Text>
                    <Text className="text-zinc-400 mb-6">
                      Choose how to save your changes
                    </Text>

                    <Pressable
                      onPress={() => handleSave(false)}
                      className="bg-blue-600 rounded-xl py-4 mb-3 active:bg-blue-700"
                    >
                      <View className="flex-row items-center justify-center">
                        <Save size={20} color="#fff" />
                        <Text className="text-white font-bold text-lg ml-2">
                          Save Over Original
                        </Text>
                      </View>
                      <Text className="text-blue-200 text-center text-sm mt-1">
                        Update the existing recipe
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleSave(true)}
                      className="bg-emerald-600 rounded-xl py-4 mb-3 active:bg-emerald-700"
                    >
                      <View className="flex-row items-center justify-center">
                        <Copy size={20} color="#fff" />
                        <Text className="text-white font-bold text-lg ml-2">
                          Save as New Recipe
                        </Text>
                      </View>
                      <Text className="text-emerald-200 text-center text-sm mt-1">
                        Keep original and create a new one
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setShowSaveOptions(false)}
                      className="bg-zinc-800 rounded-xl py-4 active:bg-zinc-700"
                    >
                      <Text className="text-white font-semibold text-center">
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
