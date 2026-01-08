import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sunrise,
  Sun,
  Moon,
  Cake,
  Cookie,
  Wine,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useStore, type Folder, type Recipe, type MealLog, getTodayDateString } from '@/lib/store';
import { RecipeCard } from '@/components/RecipeCard';
import { FolderPicker } from '@/components/FolderPicker';
import { RecipeEditor } from '@/components/RecipeEditor';
import { generateRecipeImage } from '@/lib/generateRecipeImage';

const ICON_MAP: Record<string, React.ElementType> = {
  Sunrise,
  Sun,
  Moon,
  Cake,
  Cookie,
  Wine,
};

export default function FoldersScreen() {
  const folders = useStore((s) => s.folders);
  const recipes = useStore((s) => s.recipes);
  const deleteRecipe = useStore((s) => s.deleteRecipe);
  const moveRecipeToFolder = useStore((s) => s.moveRecipeToFolder);
  const addToShoppingList = useStore((s) => s.addToShoppingList);
  const logMeal = useStore((s) => s.logMeal);
  const updateRecipe = useStore((s) => s.updateRecipe);
  const addRecipe = useStore((s) => s.addRecipe);
  const addFolder = useStore((s) => s.addFolder);
  const setRecipeRating = useStore((s) => s.setRecipeRating);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [folderPickerVisible, setFolderPickerVisible] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [regeneratingImageId, setRegeneratingImageId] = useState<string | null>(null);

  const recipesByFolder = useMemo(() => {
    const grouped: Record<string, Recipe[]> = {};
    folders.forEach((f) => {
      grouped[f.id] = recipes.filter((r) => r.folderId === f.id);
    });
    grouped['uncategorized'] = recipes.filter(
      (r) => !r.folderId || !folders.some((f) => f.id === r.folderId)
    );
    return grouped;
  }, [folders, recipes]);

  const selectedFolderRecipes = selectedFolder
    ? recipesByFolder[selectedFolder] || []
    : [];

  const handleAddToShoppingList = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      addToShoppingList(recipe.ingredients);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleChangeFolder = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setFolderPickerVisible(true);
  };

  const handleFolderSelect = (folderId: string) => {
    if (selectedRecipeId) {
      moveRecipeToFolder(selectedRecipeId, folderId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFolderPickerVisible(false);
    setSelectedRecipeId(null);
  };

  const handleCreateFolder = (name: string, color: string, icon: string, parentId?: string) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      color,
      icon,
      parentId,
    };
    addFolder(newFolder);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // If creating while moving a recipe, auto-select the new folder
    if (selectedRecipeId) {
      moveRecipeToFolder(selectedRecipeId, newFolder.id);
      setFolderPickerVisible(false);
      setSelectedRecipeId(null);
    }
  };

  const handleDelete = (recipeId: string) => {
    deleteRecipe(recipeId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleRatingChange = (recipeId: string, rating: number) => {
    setRecipeRating(recipeId, rating);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLogMeal = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      const mealLog: MealLog = {
        id: `log-${Date.now()}`,
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        servings: parseInt(recipe.servings) || 1,
        calories: recipe.caloriesPerServing * (parseInt(recipe.servings) || 1),
        macros: {
          protein: recipe.macros.protein,
          carbs: recipe.macros.carbs,
          fat: recipe.macros.fat,
          fiber: recipe.macros.fiber,
        },
        date: getTodayDateString(),
        timestamp: Date.now(),
      };
      logMeal(mealLog);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleEdit = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      setRecipeToEdit(recipe);
      setEditorVisible(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSaveRecipe = (recipe: Recipe, saveAsNew: boolean) => {
    if (saveAsNew) {
      addRecipe(recipe);
    } else {
      updateRecipe(recipe.id, recipe);
    }
    setEditorVisible(false);
    setRecipeToEdit(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRegenerateImage = async (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    setRegeneratingImageId(recipeId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const newImageUrl = await generateRecipeImage(recipe.title);
      updateRecipe(recipeId, { imageUri: newImageUrl });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to regenerate image:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Image Generation Failed',
        'Unable to generate a new image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setRegeneratingImageId(null);
    }
  };

  if (selectedFolder) {
    const folder = folders.find((f) => f.id === selectedFolder);
    const IconComponent = folder ? ICON_MAP[folder.icon] || Sun : BookOpen;

    return (
      <View className="flex-1 bg-black">
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center px-5 pt-2 pb-4">
            <Pressable
              onPress={() => setSelectedFolder(null)}
              className="mr-3 active:opacity-50"
            >
              <ChevronRight
                size={24}
                color="#fff"
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </Pressable>
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: folder ? `${folder.color}20` : '#27272A' }}
            >
              <IconComponent
                size={20}
                color={folder?.color || '#71717A'}
              />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">
                {folder?.name || 'Uncategorized'}
              </Text>
              <Text className="text-zinc-500 text-sm">
                {selectedFolderRecipes.length} recipe
                {selectedFolderRecipes.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Recipe List */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {selectedFolderRecipes.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <View className="w-16 h-16 rounded-full bg-zinc-900 items-center justify-center mb-3">
                  <BookOpen size={28} color="#71717A" />
                </View>
                <Text className="text-zinc-500 text-center">
                  No recipes in this folder yet
                </Text>
              </View>
            ) : (
              selectedFolderRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  folder={folder}
                  expanded={expandedId === recipe.id}
                  onPress={() =>
                    setExpandedId(expandedId === recipe.id ? null : recipe.id)
                  }
                  onAddToShoppingList={() => handleAddToShoppingList(recipe.id)}
                  onChangeFolder={() => handleChangeFolder(recipe.id)}
                  onDelete={() => handleDelete(recipe.id)}
                  onLogMeal={() => handleLogMeal(recipe.id)}
                  onEdit={() => handleEdit(recipe.id)}
                  onRegenerateImage={() => handleRegenerateImage(recipe.id)}
                  isRegeneratingImage={regeneratingImageId === recipe.id}
                  onRatingChange={(rating) => handleRatingChange(recipe.id, rating)}
                />
              ))
            )}
          </ScrollView>

          <FolderPicker
            visible={folderPickerVisible}
            folders={folders}
            selectedId={
              recipes.find((r) => r.id === selectedRecipeId)?.folderId
            }
            onSelect={handleFolderSelect}
            onCreateFolder={handleCreateFolder}
            onClose={() => setFolderPickerVisible(false)}
          />

          {recipeToEdit && (
            <RecipeEditor
              visible={editorVisible}
              recipe={recipeToEdit}
              onClose={() => {
                setEditorVisible(false);
                setRecipeToEdit(null);
              }}
              onSave={handleSaveRecipe}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-3xl font-bold text-white">Folders</Text>
          <Text className="text-zinc-500 mt-1">
            Organize your recipes by meal type
          </Text>
        </View>

        {/* Folder Grid */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex-row flex-wrap">
            {folders.map((folder, index) => {
              const IconComponent = ICON_MAP[folder.icon] || Sun;
              const count = recipesByFolder[folder.id]?.length || 0;
              const previewRecipes = recipesByFolder[folder.id]?.slice(0, 3) || [];

              return (
                <Animated.View
                  key={folder.id}
                  entering={FadeInUp.delay(index * 50)}
                  className="w-1/2 p-2"
                >
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFolder(folder.id);
                    }}
                    className="bg-zinc-900 rounded-2xl p-4 active:scale-[0.98]"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    {/* Preview Images */}
                    <View className="h-20 mb-3 rounded-xl overflow-hidden bg-zinc-800">
                      {previewRecipes.length > 0 ? (
                        <View className="flex-row flex-1">
                          {previewRecipes.map((recipe) => (
                            <Image
                              key={recipe.id}
                              source={{ uri: recipe.imageUri }}
                              className="flex-1 h-full"
                              resizeMode="cover"
                            />
                          ))}
                        </View>
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <IconComponent size={32} color={folder.color} />
                        </View>
                      )}
                    </View>

                    {/* Folder Info */}
                    <View className="flex-row items-center">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-2"
                        style={{ backgroundColor: `${folder.color}20` }}
                      >
                        <IconComponent size={16} color={folder.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-semibold">
                          {folder.name}
                        </Text>
                        <Text className="text-zinc-500 text-xs">
                          {count} recipe{count !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#71717A" />
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}

            {/* Uncategorized */}
            {recipesByFolder['uncategorized']?.length > 0 && (
              <Animated.View
                entering={FadeInUp.delay(folders.length * 50)}
                className="w-1/2 p-2"
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedFolder('uncategorized');
                  }}
                  className="bg-zinc-800 rounded-2xl p-4 active:scale-[0.98]"
                >
                  <View className="h-20 mb-3 rounded-xl overflow-hidden bg-zinc-700 items-center justify-center">
                    <BookOpen size={32} color="#71717A" />
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2 bg-zinc-700">
                      <BookOpen size={16} color="#71717A" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-zinc-300 font-semibold">
                        Uncategorized
                      </Text>
                      <Text className="text-zinc-500 text-xs">
                        {recipesByFolder['uncategorized'].length} recipe
                        {recipesByFolder['uncategorized'].length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#71717A" />
                  </View>
                </Pressable>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
