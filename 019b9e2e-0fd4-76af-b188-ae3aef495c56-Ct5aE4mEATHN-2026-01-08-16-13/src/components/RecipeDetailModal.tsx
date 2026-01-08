import React from 'react';
import { View, Text, ScrollView, Pressable, Modal, Image } from 'react-native';
import { ChevronLeft, Clock, Users, ChefHat, ShoppingCart, Flame, Folder } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Recipe, Folder as FolderType } from '@/lib/store';

interface RecipeDetailModalProps {
  recipe: Recipe;
  folder?: FolderType;
  visible: boolean;
  onClose: () => void;
  onAddToShoppingList?: () => void;
  onChangeFolder?: () => void;
}

export function RecipeDetailModal({
  recipe,
  folder,
  visible,
  onClose,
  onAddToShoppingList,
  onChangeFolder,
}: RecipeDetailModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View className="h-80 relative">
            <Image
              source={{ uri: recipe.imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Back Button */}
            <Pressable
              onPress={() => {
                onClose();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="absolute top-16 left-6 w-10 h-10 rounded-full bg-black/60 items-center justify-center"
            >
              <ChevronLeft size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Header */}
          <View className="px-6 py-6">
            <View className="flex-row items-center mb-3">
              {folder && (
                <>
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: folder.color }}
                  />
                  <Text className="text-zinc-400 text-sm mr-3">{folder.name}</Text>
                </>
              )}
              <View className="flex-row items-center">
                <Flame size={14} color="#F59E0B" />
                <Text className="text-amber-500 text-sm ml-1 font-medium">
                  {recipe.caloriesPerServing} cal/serving
                </Text>
              </View>
            </View>

            <Text className="text-white text-3xl font-bold mb-4">{recipe.title}</Text>

            {/* Quick Info */}
            <View className="flex-row mb-6">
              <View className="flex-row items-center flex-1">
                <Clock size={18} color="#71717A" />
                <Text className="text-zinc-400 text-sm ml-2">
                  {recipe.prepTime} prep
                </Text>
              </View>
              <View className="flex-row items-center flex-1">
                <ChefHat size={18} color="#71717A" />
                <Text className="text-zinc-400 text-sm ml-2">
                  {recipe.cookTime} cook
                </Text>
              </View>
              <View className="flex-row items-center flex-1">
                <Users size={18} color="#71717A" />
                <Text className="text-zinc-400 text-sm ml-2">
                  {recipe.servings} servings
                </Text>
              </View>
            </View>

            {/* Macros */}
            <View className="flex-row flex-wrap gap-2 mb-8">
              <View className="bg-zinc-900 rounded-xl px-4 py-3">
                <Text className="text-zinc-400 text-xs mb-1">Protein</Text>
                <Text className="text-blue-400 font-bold text-lg">{recipe.macros.protein}g</Text>
              </View>
              <View className="bg-zinc-900 rounded-xl px-4 py-3">
                <Text className="text-zinc-400 text-xs mb-1">Carbs</Text>
                <Text className="text-amber-400 font-bold text-lg">{recipe.macros.carbs}g</Text>
              </View>
              <View className="bg-zinc-900 rounded-xl px-4 py-3">
                <Text className="text-zinc-400 text-xs mb-1">Fat</Text>
                <Text className="text-pink-400 font-bold text-lg">{recipe.macros.fat}g</Text>
              </View>
              {recipe.macros.fiber > 0 && (
                <View className="bg-zinc-900 rounded-xl px-4 py-3">
                  <Text className="text-zinc-400 text-xs mb-1">Fiber</Text>
                  <Text className="text-green-400 font-bold text-lg">{recipe.macros.fiber}g</Text>
                </View>
              )}
            </View>

            {/* Ingredients */}
            <Text className="text-white text-2xl font-bold mb-4">Ingredients</Text>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <View className="bg-zinc-900 rounded-2xl p-4 mb-8">
                {recipe.ingredients.map((ingredient, index) => (
                  <View key={ingredient.id || index} className="flex-row items-start mb-3 last:mb-0">
                    <View className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-3" />
                    <Text className="text-zinc-300 flex-1 text-base leading-6">
                      {ingredient.amount !== '1 serving' ? `${ingredient.amount} ` : ''}{ingredient.name}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-zinc-900 rounded-2xl p-6 items-center mb-8">
                <Text className="text-zinc-500 text-center">No ingredients listed</Text>
              </View>
            )}

            {/* Instructions */}
            <Text className="text-white text-2xl font-bold mb-4">Instructions</Text>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <View className="bg-zinc-900 rounded-2xl p-4 mb-8">
                {recipe.instructions.map((instruction, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 50)}
                    className="flex-row items-start mb-4 last:mb-0"
                  >
                    <View className="w-8 h-8 rounded-full bg-emerald-600/20 items-center justify-center mr-3 mt-0.5">
                      <Text className="text-emerald-400 font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-zinc-300 flex-1 text-base leading-7">{instruction}</Text>
                  </Animated.View>
                ))}
              </View>
            ) : (
              <View className="bg-zinc-900 rounded-2xl p-6 items-center mb-8">
                <Text className="text-zinc-500 text-center">No instructions listed</Text>
              </View>
            )}

            {/* Add to Shopping List Button */}
            {onAddToShoppingList && (
              <Pressable
                onPress={() => {
                  onAddToShoppingList();
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                className="bg-amber-500 rounded-2xl py-4 flex-row items-center justify-center mb-4 active:bg-amber-600"
              >
                <ShoppingCart size={20} color="#000" />
                <Text className="text-black font-bold text-base ml-2">
                  Add to Shopping List
                </Text>
              </Pressable>
            )}

            {/* Change Folder Button */}
            {onChangeFolder && (
              <Pressable
                onPress={() => {
                  onChangeFolder();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="bg-zinc-800 rounded-2xl py-4 flex-row items-center justify-center mb-8 active:bg-zinc-700"
              >
                <Folder size={20} color="#71717A" />
                <Text className="text-white font-semibold text-base ml-2">
                  Move to Folder
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
