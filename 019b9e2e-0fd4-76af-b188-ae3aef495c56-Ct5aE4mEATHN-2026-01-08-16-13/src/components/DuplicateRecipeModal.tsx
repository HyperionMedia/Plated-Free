import React from 'react';
import { View, Text, Pressable, Modal, Image } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import type { Recipe } from '@/lib/store';

interface DuplicateRecipeModalProps {
  visible: boolean;
  existingRecipe: Recipe | null;
  newRecipeTitle: string;
  onSaveAnyway: () => void;
  onCancel: () => void;
}

export function DuplicateRecipeModal({
  visible,
  existingRecipe,
  newRecipeTitle,
  onSaveAnyway,
  onCancel,
}: DuplicateRecipeModalProps) {
  if (!visible || !existingRecipe) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        className="flex-1 bg-black/80 justify-end"
      >
        <Pressable className="flex-1" onPress={onCancel} />
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          className="bg-zinc-900 rounded-t-3xl overflow-hidden"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center mr-3">
                <AlertTriangle size={20} color="#F59E0B" />
              </View>
              <Text className="text-white font-bold text-lg">
                Duplicate Recipe
              </Text>
            </View>
            <Pressable
              onPress={onCancel}
              className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center"
            >
              <X size={18} color="#71717A" />
            </Pressable>
          </View>

          {/* Content */}
          <View className="px-5 pb-4">
            <Text className="text-zinc-400 mb-4">
              A recipe with a similar name already exists in your library:
            </Text>

            {/* Existing Recipe Preview */}
            <View className="bg-zinc-800 rounded-2xl overflow-hidden mb-4">
              <View className="flex-row">
                <Image
                  source={{ uri: existingRecipe.imageUri }}
                  className="w-20 h-20"
                  resizeMode="cover"
                />
                <View className="flex-1 p-3 justify-center">
                  <Text className="text-white font-semibold" numberOfLines={1}>
                    {existingRecipe.title}
                  </Text>
                  <Text className="text-zinc-500 text-sm mt-1">
                    {existingRecipe.caloriesPerServing} cal/serving
                  </Text>
                  <Text className="text-zinc-600 text-xs mt-1">
                    Saved {new Date(existingRecipe.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            <Text className="text-zinc-500 text-sm text-center mb-4">
              Do you still want to save "{newRecipeTitle}"?
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row px-5 pb-8 pt-2 border-t border-zinc-800">
            <Pressable
              onPress={onCancel}
              className="flex-1 py-4 bg-zinc-800 rounded-xl mr-2 active:bg-zinc-700"
            >
              <Text className="text-white font-semibold text-center">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={onSaveAnyway}
              className="flex-1 py-4 bg-amber-500 rounded-xl ml-2 active:bg-amber-600"
            >
              <Text className="text-black font-semibold text-center">
                Save Anyway
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
