import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Users, ChefHat, ShoppingCart, Folder, Trash2, Flame, Plus, Edit, Share2, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import type { Recipe, Folder as FolderType } from '@/lib/store';
import { cn } from '@/lib/cn';
import { StarRating } from './StarRating';

interface RecipeCardProps {
  recipe: Recipe;
  folder?: FolderType;
  onAddToShoppingList: () => void;
  onChangeFolder: () => void;
  onDelete: () => void;
  onLogMeal?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onRegenerateImage?: () => void;
  isRegeneratingImage?: boolean;
  expanded?: boolean;
  onPress?: () => void;
  onRatingChange?: (rating: number) => void;
}

export function RecipeCard({
  recipe,
  folder,
  onAddToShoppingList,
  onChangeFolder,
  onDelete,
  onLogMeal,
  onEdit,
  onShare,
  onRegenerateImage,
  isRegeneratingImage = false,
  expanded = false,
  onPress,
  onRatingChange,
}: RecipeCardProps) {
  const [showRatingPicker, setShowRatingPicker] = useState(false);

  const handleRatingPress = (e: any) => {
    e.stopPropagation();
    setShowRatingPicker(!showRatingPicker);
  };

  const handleRatingChange = (rating: number) => {
    onRatingChange?.(rating);
    setShowRatingPicker(false);
  };

  return (
    <Animated.View entering={FadeInUp.springify()}>
      <Pressable
        onPress={onPress}
        className={cn(
          'mx-4 mb-4 rounded-3xl overflow-hidden bg-zinc-900',
          'active:scale-[0.98]'
        )}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        {/* Image Header */}
        <View className="h-48 relative">
          <Image
            source={{ uri: recipe.imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
          <View className="absolute bottom-3 left-4 right-4">
            <Text className="text-white text-xl font-bold" numberOfLines={1}>
              {recipe.title}
            </Text>

            {/* Rating Section */}
            <View className="flex-row items-center mt-2 mb-1">
              {recipe.rating !== undefined && recipe.rating > 0 ? (
                <Pressable
                  onPress={handleRatingPress}
                  className="flex-row items-center active:opacity-70"
                >
                  <StarRating rating={recipe.rating} size={14} readonly showEmptyStars={false} />
                  <Text className="text-amber-400 text-xs font-semibold ml-1.5">
                    {recipe.rating.toFixed(1)}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleRatingPress}
                  className="flex-row items-center active:opacity-70"
                >
                  <Text className="text-zinc-400 text-xs">Tap to rate</Text>
                </Pressable>
              )}
            </View>

            <View className="flex-row items-center">
              {folder && (
                <>
                  <View
                    className="w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: folder.color }}
                  />
                  <Text className="text-white/70 text-xs mr-3">{folder.name}</Text>
                </>
              )}
              <Flame size={12} color="#F59E0B" />
              <Text className="text-amber-500 text-xs ml-1 font-medium">
                {recipe.caloriesPerServing} cal/serving
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Info */}
        <View className="flex-row px-4 py-3 border-b border-zinc-800">
          <View className="flex-row items-center flex-1">
            <Clock size={14} color="#71717A" />
            <Text className="text-zinc-400 text-xs ml-1">
              {recipe.prepTime} prep
            </Text>
          </View>
          <View className="flex-row items-center flex-1">
            <ChefHat size={14} color="#71717A" />
            <Text className="text-zinc-400 text-xs ml-1">
              {recipe.cookTime} cook
            </Text>
          </View>
          <View className="flex-row items-center flex-1">
            <Users size={14} color="#71717A" />
            <Text className="text-zinc-400 text-xs ml-1">
              {recipe.servings} servings
            </Text>
          </View>
        </View>

        {/* Macros Bar */}
        <View className="flex-row px-4 py-2 border-b border-zinc-800">
          <View className="flex-row items-center flex-1">
            <Text className="text-blue-500 text-xs font-medium">
              P: {recipe.macros.protein}g
            </Text>
          </View>
          <View className="flex-row items-center flex-1">
            <Text className="text-amber-500 text-xs font-medium">
              C: {recipe.macros.carbs}g
            </Text>
          </View>
          <View className="flex-row items-center flex-1">
            <Text className="text-pink-500 text-xs font-medium">
              F: {recipe.macros.fat}g
            </Text>
          </View>
        </View>

        {/* Expanded Content */}
        {expanded && (
          <Animated.View entering={FadeInDown.springify()}>
            {/* Ingredients */}
            <View className="px-4 py-3 border-b border-zinc-800">
              <Text className="text-white font-semibold mb-2">
                Ingredients ({recipe.ingredients.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
              >
                {recipe.ingredients.slice(0, 6).map((ing) => (
                  <View
                    key={ing.id}
                    className="bg-zinc-800 rounded-xl px-3 py-2 mr-2"
                  >
                    <Text className="text-white text-sm font-medium">
                      {ing.name}
                    </Text>
                    <Text className="text-zinc-500 text-xs">{ing.amount}</Text>
                  </View>
                ))}
                {recipe.ingredients.length > 6 && (
                  <View className="bg-zinc-800 rounded-xl px-3 py-2 justify-center">
                    <Text className="text-zinc-400 text-sm">
                      +{recipe.ingredients.length - 6} more
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Instructions Preview */}
            <View className="px-4 py-3 border-b border-zinc-800">
              <Text className="text-white font-semibold mb-2">
                Instructions
              </Text>
              {recipe.instructions.slice(0, 3).map((step, idx) => (
                <View key={idx} className="flex-row mb-2">
                  <View className="w-5 h-5 rounded-full bg-amber-500 items-center justify-center mr-2">
                    <Text className="text-black text-xs font-bold">
                      {idx + 1}
                    </Text>
                  </View>
                  <Text className="text-zinc-300 text-sm flex-1" numberOfLines={2}>
                    {step}
                  </Text>
                </View>
              ))}
              {recipe.instructions.length > 3 && (
                <Text className="text-zinc-500 text-xs ml-7">
                  +{recipe.instructions.length - 3} more steps
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View className="flex-row px-2 py-2">
          <Pressable
            onPress={onLogMeal}
            className="flex-1 flex-row items-center justify-center py-3 mx-1 bg-emerald-500 rounded-xl active:bg-emerald-600"
          >
            <Plus size={18} color="black" />
          </Pressable>
          {onEdit && (
            <Pressable
              onPress={onEdit}
              className="py-3 px-4 mx-1 bg-blue-600 rounded-xl active:bg-blue-700"
            >
              <Edit size={16} color="#fff" />
            </Pressable>
          )}
          {onShare && (
            <Pressable
              onPress={onShare}
              className="py-3 px-4 mx-1 bg-purple-600 rounded-xl active:bg-purple-700"
            >
              <Share2 size={16} color="#fff" />
            </Pressable>
          )}
          <Pressable
            onPress={onAddToShoppingList}
            className="py-3 px-4 mx-1 bg-amber-500 rounded-xl active:bg-amber-600"
          >
            <ShoppingCart size={16} color="black" />
          </Pressable>
          <Pressable
            onPress={onChangeFolder}
            className="py-3 px-4 mx-1 bg-zinc-800 rounded-xl active:bg-zinc-700"
          >
            <Folder size={16} color="#71717A" />
          </Pressable>
          <Pressable
            onPress={onDelete}
            className="py-3 px-4 mx-1 bg-zinc-800 rounded-xl active:bg-zinc-700"
          >
            <Trash2 size={16} color="#EF4444" />
          </Pressable>
        </View>

        {/* Regenerate Image Button */}
        {onRegenerateImage && (
          <View className="px-4 pb-3">
            <Pressable
              onPress={onRegenerateImage}
              disabled={isRegeneratingImage}
              className={cn(
                'flex-row items-center justify-center py-3 rounded-xl',
                isRegeneratingImage
                  ? 'bg-zinc-800'
                  : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 active:opacity-80'
              )}
              style={{
                backgroundColor: isRegeneratingImage ? '#27272A' : '#7C3AED',
              }}
            >
              {isRegeneratingImage ? (
                <>
                  <ActivityIndicator size="small" color="#A78BFA" />
                  <Text className="text-violet-400 font-semibold ml-2">
                    Generating Image...
                  </Text>
                </>
              ) : (
                <>
                  <Sparkles size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    Regenerate Image with AI
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Rating Picker Modal */}
        {showRatingPicker && (
          <Animated.View
            entering={FadeInDown.springify()}
            className="px-4 pb-3"
          >
            <View className="bg-zinc-800 rounded-2xl p-4">
              <Text className="text-white text-center font-semibold mb-3">
                Rate this recipe
              </Text>
              <View className="items-center mb-3">
                <StarRating
                  rating={recipe.rating || 0}
                  onRatingChange={handleRatingChange}
                  size={32}
                  readonly={false}
                  showEmptyStars={true}
                />
              </View>
              <Pressable
                onPress={() => setShowRatingPicker(false)}
                className="bg-zinc-700 py-2 rounded-xl active:bg-zinc-600"
              >
                <Text className="text-zinc-300 text-center text-sm">Cancel</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}
