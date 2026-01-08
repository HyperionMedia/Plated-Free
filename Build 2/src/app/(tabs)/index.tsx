import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
  TextInput,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, ImagePlus, Sparkles, ChevronLeft, Folder, Link, X, MessageSquare, Flame, Search } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useStore, type Recipe, type MealLog, getTodayDateString } from '@/lib/store';
import { analyzeRecipeImage } from '@/lib/analyzeRecipe';
import { parseRecipeFromUrl } from '@/lib/parseRecipeUrl';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { FolderPicker } from '@/components/FolderPicker';
import { DuplicateRecipeModal } from '@/components/DuplicateRecipeModal';
import { ShareableRecipeCard } from '@/components/ShareableRecipeCard';
import { getRecipeImageUrl } from '@/lib/recipeImages';
import { Toast } from '@/components/Toast';
import { generateRecipeImage } from '@/lib/generateRecipeImage';

export default function RecipesScreen() {
  const recipes = useStore((s) => s.recipes);
  const folders = useStore((s) => s.folders);
  const addRecipe = useStore((s) => s.addRecipe);
  const deleteRecipe = useStore((s) => s.deleteRecipe);
  const moveRecipeToFolder = useStore((s) => s.moveRecipeToFolder);
  const updateRecipe = useStore((s) => s.updateRecipe);
  const setRecipeRating = useStore((s) => s.setRecipeRating);
  const addToShoppingList = useStore((s) => s.addToShoppingList);
  const logMeal = useStore((s) => s.logMeal);
  const findDuplicateRecipe = useStore((s) => s.findDuplicateRecipe);
  const addFolder = useStore((s) => s.addFolder);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [folderPickerVisible, setFolderPickerVisible] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Duplicate detection state
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [pendingRecipe, setPendingRecipe] = useState<Recipe | null>(null);
  const [existingDuplicate, setExistingDuplicate] = useState<Recipe | null>(null);

  // Share card ref
  const shareCardRef = useRef<View>(null);
  const [shareRecipe, setShareRecipe] = useState<Recipe | null>(null);

  // URL input state
  const [recipeUrl, setRecipeUrl] = useState<string>('');

  // AI Description state
  const [showAIDescriber, setShowAIDescriber] = useState(false);
  const [aiRecipeDescription, setAiRecipeDescription] = useState('');
  const [aiRecipeLoading, setAiRecipeLoading] = useState(false);
  const [aiGeneratedRecipe, setAiGeneratedRecipe] = useState<Recipe | null>(null);
  const [showAIRecipePreview, setShowAIRecipePreview] = useState(false);

  // Toast notification state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'cart'>('success');

  // Image regeneration state
  const [regeneratingImageId, setRegeneratingImageId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'cart' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }, []);

  const scanMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const result = await analyzeRecipeImage(imageUri);
      return { imageUri, ...result };
    },
    onSuccess: (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newRecipe: Recipe = {
        id: `recipe-${Date.now()}`,
        title: data.title,
        imageUri: data.imageUri,
        ingredients: data.ingredients,
        instructions: data.instructions,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        folderId: data.suggestedFolder,
        createdAt: Date.now(),
        caloriesPerServing: data.caloriesPerServing,
        macros: data.macros,
      };

      // Check for duplicate
      const duplicate = findDuplicateRecipe(newRecipe.title);
      if (duplicate) {
        setPendingRecipe(newRecipe);
        setExistingDuplicate(duplicate);
        setDuplicateModalVisible(true);
      } else {
        addRecipe(newRecipe);
        setExpandedId(newRecipe.id);
      }
    },
    onError: (error) => {
      console.error('Scan error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const { mutate: scanRecipe, isPending: isScanning, isError: scanError } = scanMutation;

  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      const result = await parseRecipeFromUrl(url);
      return result;
    },
    onSuccess: (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newRecipe: Recipe = {
        id: `recipe-${Date.now()}`,
        title: data.title,
        imageUri: data.imageUrl || getRecipeImageUrl(data.title, data.suggestedFolder, data.imageSearchTerm), // Use actual image or fallback to generated
        ingredients: data.ingredients,
        instructions: data.instructions,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        folderId: data.suggestedFolder,
        createdAt: Date.now(),
        caloriesPerServing: data.caloriesPerServing,
        macros: data.macros,
      };

      // Check for duplicate
      const duplicate = findDuplicateRecipe(newRecipe.title);
      if (duplicate) {
        setPendingRecipe(newRecipe);
        setExistingDuplicate(duplicate);
        setDuplicateModalVisible(true);
      } else {
        addRecipe(newRecipe);
        setExpandedId(newRecipe.id);
      }

      // Clear the URL input
      setRecipeUrl('');
    },
    onError: (error: Error) => {
      console.error('URL parse error:', error);
      console.error('Error message:', error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const { mutate: parseUrl, isPending: isParsing, isError: urlError } = urlMutation;

  const pickImage = useCallback(async (useCamera: boolean) => {
    try {
      const permissionFn = useCamera
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;

      const { granted } = await permissionFn();
      if (!granted) {
        return;
      }

      const launchFn = useCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

      const result = await launchFn({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scanRecipe(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
    }
  }, [scanRecipe]);

  const handleUrlSubmit = useCallback(async () => {
    if (!recipeUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(recipeUrl);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      parseUrl(recipeUrl);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [recipeUrl, parseUrl]);

  const handleAIDescribeRecipe = async () => {
    if (!aiRecipeDescription.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setAiRecipeLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `Create a complete recipe from this description. Return ONLY valid JSON with this exact structure (no markdown, no explanations):
{
  "title": "recipe name",
  "imageSearchTerm": "core dish name for image search (e.g., 'martini' for 'Classic Martini', 'chicken soup' for 'Grandma's Chicken Soup')",
  "servings": number,
  "prepTime": "X min",
  "cookTime": "X min",
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
      "amount": "quantity with unit"
    }
  ],
  "instructions": [
    "Step 1: instruction",
    "Step 2: instruction"
  ]
}

Recipe description: ${aiRecipeDescription}

Create a detailed recipe with realistic ingredients, amounts, cooking instructions, and accurate nutritional information. For imageSearchTerm, extract the core dish name (e.g., if title is "Classic Martini", use "martini"; if "Mom's Chicken Soup", use "chicken soup").`;

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
      const content = data.choices?.[0]?.message?.content || '';

      if (!content) {
        throw new Error('No response from AI');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse recipe data');
      }

      const recipeData = JSON.parse(jsonMatch[0]);

      // Create the recipe
      const newRecipe: Recipe = {
        id: `recipe-${Date.now()}`,
        title: recipeData.title,
        imageUri: getRecipeImageUrl(recipeData.title, undefined, recipeData.imageSearchTerm),
        ingredients: recipeData.ingredients.map((ing: any, idx: number) => ({
          id: `ing-${idx}`,
          name: ing.name,
          amount: ing.amount,
          category: 'other' as const,
        })),
        instructions: recipeData.instructions,
        servings: String(recipeData.servings),
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        folderId: folders[0]?.id || '',
        createdAt: Date.now(),
        caloriesPerServing: Math.round(recipeData.calories / recipeData.servings),
        macros: {
          protein: Math.round(recipeData.macros.protein / recipeData.servings),
          carbs: Math.round(recipeData.macros.carbs / recipeData.servings),
          fat: Math.round(recipeData.macros.fat / recipeData.servings),
          fiber: Math.round(recipeData.macros.fiber / recipeData.servings),
        },
      };

      // Show preview instead of directly saving
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAiGeneratedRecipe(newRecipe);
      setShowAIDescriber(false);
      setShowAIRecipePreview(true);
      setAiRecipeDescription('');
    } catch (error) {
      console.error('AI recipe creation error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAiRecipeLoading(false);
    }
  };

  const handleSaveAIRecipe = useCallback(() => {
    if (!aiGeneratedRecipe) return;

    // Check for duplicate
    const duplicate = findDuplicateRecipe(aiGeneratedRecipe.title);
    if (duplicate) {
      setPendingRecipe(aiGeneratedRecipe);
      setExistingDuplicate(duplicate);
      setDuplicateModalVisible(true);
      setShowAIRecipePreview(false);
      setAiGeneratedRecipe(null);
    } else {
      // Show folder picker - keep aiGeneratedRecipe in state
      setSelectedRecipeId(aiGeneratedRecipe.id);
      setShowAIRecipePreview(false);
      // Don't clear aiGeneratedRecipe yet - we need it in handleFolderSelect
      setTimeout(() => {
        setFolderPickerVisible(true);
      }, 100);
    }
  }, [aiGeneratedRecipe, findDuplicateRecipe]);

  const handleCancelAIRecipe = useCallback(() => {
    setShowAIRecipePreview(false);
    setAiGeneratedRecipe(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleAddToShoppingList = useCallback((recipeId: string) => {
    console.log('handleAddToShoppingList called for recipe:', recipeId);
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      console.log('Found recipe:', recipe.title);
      addToShoppingList(recipe.ingredients);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('About to show toast');
      showToast(`Added ${recipe.ingredients.length} ingredients to shopping list`, 'cart');
    } else {
      console.log('Recipe not found!');
    }
  }, [recipes, addToShoppingList, showToast]);

  const handleChangeFolder = useCallback((recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setExpandedId(null); // Close the detail modal
    setFolderPickerVisible(true);
  }, []);

  const handleFolderSelect = useCallback((folderId: string) => {
    if (selectedRecipeId) {
      // Check if this is an AI generated recipe that needs to be added first
      if (aiGeneratedRecipe && aiGeneratedRecipe.id === selectedRecipeId) {
        const recipeToSave = { ...aiGeneratedRecipe, folderId };
        addRecipe(recipeToSave);
        setAiGeneratedRecipe(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        moveRecipeToFolder(selectedRecipeId, folderId);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    setFolderPickerVisible(false);
    setSelectedRecipeId(null);
  }, [selectedRecipeId, aiGeneratedRecipe, addRecipe, moveRecipeToFolder]);

  const handleCreateFolder = useCallback((name: string, color: string, icon: string, parentId?: string) => {
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
  }, [addFolder, selectedRecipeId, moveRecipeToFolder]);

  const handleDelete = useCallback((recipeId: string) => {
    deleteRecipe(recipeId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [deleteRecipe]);

  const handleRatingChange = useCallback((recipeId: string, rating: number) => {
    setRecipeRating(recipeId, rating);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [setRecipeRating]);

  const handleLogMeal = useCallback((recipeId: string) => {
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
      showToast(`${recipe.title} logged to tracker`, 'success');
    }
  }, [recipes, logMeal, showToast]);

  const handleEdit = useCallback((recipeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/edit-recipe', params: { recipeId } });
  }, []);

  const handleShare = useCallback(async (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    try {
      // Set the recipe to be shared (this will render the ShareableRecipeCard)
      setShareRecipe(recipe);

      // Wait a bit for the card to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the shareable card as an image
      if (shareCardRef.current) {
        const uri = await captureRef(shareCardRef.current, {
          format: 'png',
          quality: 1,
        });

        // Share the image
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Share ${recipe.title}`,
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Clear the share recipe after sharing
      setShareRecipe(null);
    } catch (error) {
      console.error('Share error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShareRecipe(null);
    }
  }, [recipes]);

  const handleRegenerateImage = useCallback(async (recipeId: string) => {
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
  }, [recipes, updateRecipe]);

  const handleDuplicateSaveAnyway = useCallback(() => {
    if (pendingRecipe) {
      addRecipe(pendingRecipe);
      setExpandedId(pendingRecipe.id);
    }
    setDuplicateModalVisible(false);
    setPendingRecipe(null);
    setExistingDuplicate(null);
  }, [pendingRecipe, addRecipe]);

  const handleDuplicateCancel = useCallback(() => {
    setDuplicateModalVisible(false);
    setPendingRecipe(null);
    setExistingDuplicate(null);
  }, []);

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  // Get subfolders of the selected folder (or top-level if none selected)
  const currentLevelFolders = selectedFolderId
    ? folders.filter((f) => f.parentId === selectedFolderId)
    : folders.filter((f) => !f.parentId);

  // Filter recipes by selected folder (only direct children, not descendants) and search query
  let filteredRecipes = selectedFolderId
    ? recipes.filter((r) => r.folderId === selectedFolderId)
    : recipes;

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query)) ||
      recipe.instructions.some((inst) => inst.toLowerCase().includes(query))
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-5 pt-2 pb-4">
            {selectedFolderId ? (
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => {
                    setSelectedFolderId(null);
                    setSearchQuery('');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="mr-3 w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
                >
                  <ChevronLeft size={24} color="#fff" />
                </Pressable>
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-white">{selectedFolder?.name}</Text>
                  <Text className="text-zinc-500 mt-1">
                    {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <Text className="text-3xl font-bold text-white">My Recipes</Text>
                <Text className="text-zinc-500 mt-1">
                  {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
                </Text>
              </>
            )}
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <View className="bg-zinc-900 rounded-2xl flex-row items-center px-4 py-3">
              <Search size={20} color="#71717A" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search recipes, ingredients..."
                placeholderTextColor="#52525B"
                className="flex-1 text-white ml-3"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  className="ml-2"
                >
                  <X size={18} color="#71717A" />
                </Pressable>
              )}
            </View>
          </View>

        {/* AI Recipe Describer Button */}
        <Animated.View entering={FadeInUp.delay(100)} className="px-4 mb-4">
          <Pressable
            onPress={() => {
              setShowAIDescriber(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl py-4 px-6 flex-row items-center justify-center active:opacity-80"
            style={{ backgroundColor: '#10B981' }}
          >
            <MessageSquare size={20} color="#fff" />
            <Text className="text-white font-bold text-base ml-2">
              Describe Your Recipe
            </Text>
            <View className="ml-auto">
              <Sparkles size={16} color="#fff" />
            </View>
          </Pressable>
        </Animated.View>

        {/* Scan Button - Always visible */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              marginHorizontal: 16,
              marginBottom: 16,
              borderRadius: 20,
              padding: 1,
            }}
          >
            <View className="bg-zinc-900 rounded-[19px] p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center">
                  <Sparkles size={20} color="#F59E0B" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">
                    Scan a Recipe
                  </Text>
                  <Text className="text-zinc-500 text-sm">
                    Take a photo or pick from library
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <Pressable
                  onPress={() => pickImage(true)}
                  disabled={isScanning}
                  className="flex-1 flex-row items-center justify-center py-3 bg-amber-500 rounded-xl mr-2 active:bg-amber-600"
                >
                  {isScanning ? (
                    <ActivityIndicator color="black" />
                  ) : (
                    <>
                      <Camera size={18} color="black" />
                      <Text className="text-black font-semibold ml-2">
                        Camera
                      </Text>
                    </>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => pickImage(false)}
                  disabled={isScanning}
                  className="flex-1 flex-row items-center justify-center py-3 bg-zinc-800 rounded-xl ml-2 active:bg-zinc-700"
                >
                  <ImagePlus size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    Library
                  </Text>
                </Pressable>
              </View>

              {isScanning && (
                <View className="mt-3 flex-row items-center justify-center">
                  <Sparkles size={14} color="#F59E0B" />
                  <Text className="text-amber-500 text-sm ml-2">
                    AI is analyzing your recipe...
                  </Text>
                </View>
              )}

              {scanError && (
                <View className="mt-3 px-3 py-2 bg-red-500/20 rounded-lg">
                  <Text className="text-red-500 text-sm text-center">
                    Could not analyze recipe. Please try again.
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* URL Paste Widget */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              marginHorizontal: 16,
              marginBottom: 16,
              borderRadius: 20,
              padding: 1,
            }}
          >
            <View className="bg-zinc-900 rounded-[19px] p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-purple-500/20 items-center justify-center">
                  <Link size={20} color="#8B5CF6" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">
                    Import from URL
                  </Text>
                  <Text className="text-zinc-500 text-sm">
                    Paste a recipe link from any website
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <TextInput
                  value={recipeUrl}
                  onChangeText={setRecipeUrl}
                  placeholder="https://example.com/recipe"
                  placeholderTextColor="#52525B"
                  autoCapitalize="none"
                  keyboardType="url"
                  returnKeyType="done"
                  onSubmitEditing={handleUrlSubmit}
                  editable={!isParsing}
                  className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl mr-2"
                />
                <Pressable
                  onPress={handleUrlSubmit}
                  disabled={!recipeUrl.trim() || isParsing}
                  className="flex-row items-center justify-center py-3 px-6 bg-purple-600 rounded-xl active:bg-purple-700 disabled:bg-zinc-700 disabled:opacity-50"
                >
                  {isParsing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold">
                      Import
                    </Text>
                  )}
                </Pressable>
              </View>

              {isParsing && (
                <View className="mt-3 flex-row items-center justify-center">
                  <Sparkles size={14} color="#8B5CF6" />
                  <Text className="text-purple-500 text-sm ml-2">
                    AI is parsing the recipe...
                  </Text>
                </View>
              )}

              {urlError && (
                <View className="mt-3 px-3 py-2 bg-red-500/20 rounded-lg">
                  <Text className="text-red-500 text-sm text-center">
                    Could not parse recipe from URL. Please try again.
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Main Content */}
        <View className="px-5">
          {!selectedFolderId && !searchQuery.trim() ? (
            /* Folder Grid View - only show when not searching */
            recipes.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="w-20 h-20 rounded-full bg-zinc-900 items-center justify-center mb-4">
                  <Sparkles size={32} color="#71717A" />
                </View>
                <Text className="text-zinc-400 text-center text-lg mb-2">
                  No recipes yet
                </Text>
                <Text className="text-zinc-600 text-center">
                  Scan a recipe to get started
                </Text>
              </View>
            ) : (
              <View>
                <Text className="text-white font-bold text-xl mb-4">Categories</Text>
                <View className="flex-row flex-wrap gap-3">
                  {currentLevelFolders.map((folder, index) => {
                    // Count recipes in this folder (not including subfolders)
                    const count = recipes.filter((r) => r.folderId === folder.id).length;
                    // Count subfolders
                    const subfolderCount = folders.filter((f) => f.parentId === folder.id).length;
                    return (
                      <Animated.View
                        key={folder.id}
                        entering={FadeInDown.delay(index * 50)}
                        className="w-[48%]"
                      >
                        <Pressable
                          onPress={() => {
                            setSelectedFolderId(folder.id);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                          className="bg-zinc-900 rounded-2xl p-5 active:bg-zinc-800"
                        >
                          <View
                            className="w-12 h-12 rounded-full items-center justify-center mb-3"
                            style={{ backgroundColor: `${folder.color}20` }}
                          >
                            <Folder size={24} color={folder.color} />
                          </View>
                          <Text className="text-white font-bold text-lg mb-1">
                            {folder.name}
                          </Text>
                          <Text className="text-zinc-500 text-sm">
                            {count} recipe{count !== 1 ? 's' : ''}
                            {subfolderCount > 0 && ` • ${subfolderCount} folder${subfolderCount !== 1 ? 's' : ''}`}
                          </Text>
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            )
          ) : (
            /* Recipe List View - shows when in a folder OR when searching */
            filteredRecipes.length === 0 && currentLevelFolders.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="w-20 h-20 rounded-full bg-zinc-900 items-center justify-center mb-4">
                  {searchQuery.trim() ? (
                    <Search size={32} color="#71717A" />
                  ) : (
                    <Folder size={32} color={selectedFolder?.color || '#71717A'} />
                  )}
                </View>
                <Text className="text-zinc-400 text-center text-lg mb-2">
                  {searchQuery.trim() ? 'No recipes found' : 'No recipes in this folder'}
                </Text>
                <Text className="text-zinc-600 text-center">
                  {searchQuery.trim() ? 'Try a different search term' : 'Scan a recipe to add it here'}
                </Text>
              </View>
            ) : (
              <>
                {/* Subfolders in current folder - only show when actually in a folder, not when searching from main screen */}
                {currentLevelFolders.length > 0 && selectedFolderId && (
                  <View className="mb-6">
                    <Text className="text-white font-bold text-lg mb-3 px-4">Subfolders</Text>
                    <View className="flex-row flex-wrap gap-3 px-4">
                      {currentLevelFolders.map((folder, index) => {
                        const count = recipes.filter((r) => r.folderId === folder.id).length;
                        const subfolderCount = folders.filter((f) => f.parentId === folder.id).length;
                        return (
                          <Animated.View
                            key={folder.id}
                            entering={FadeInDown.delay(index * 50)}
                            className="w-[48%]"
                          >
                            <Pressable
                              onPress={() => {
                                setSelectedFolderId(folder.id);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              className="bg-zinc-900 rounded-2xl p-4 active:bg-zinc-800"
                            >
                              <View
                                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                                style={{ backgroundColor: `${folder.color}20` }}
                              >
                                <Folder size={20} color={folder.color} />
                              </View>
                              <Text className="text-white font-semibold text-base mb-1">
                                {folder.name}
                              </Text>
                              <Text className="text-zinc-500 text-xs">
                                {count} recipe{count !== 1 ? 's' : ''}
                                {subfolderCount > 0 && ` • ${subfolderCount} folder${subfolderCount !== 1 ? 's' : ''}`}
                              </Text>
                            </Pressable>
                          </Animated.View>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Recipes in current folder or search results */}
                {filteredRecipes.length > 0 && (
                  <Text className="text-white font-bold text-lg mb-3 px-4">
                    {searchQuery.trim()
                      ? `Search Results (${filteredRecipes.length})`
                      : currentLevelFolders.length > 0
                        ? 'Recipes'
                        : ''}
                  </Text>
                )}
                {filteredRecipes.map((recipe) => {
                  const folder = folders.find((f) => f.id === recipe.folderId);
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      folder={folder}
                      expanded={false}
                      onPress={() => setExpandedId(recipe.id)}
                      onAddToShoppingList={() => handleAddToShoppingList(recipe.id)}
                      onChangeFolder={() => handleChangeFolder(recipe.id)}
                      onDelete={() => handleDelete(recipe.id)}
                      onLogMeal={() => handleLogMeal(recipe.id)}
                      onEdit={() => handleEdit(recipe.id)}
                      onShare={() => handleShare(recipe.id)}
                      onRegenerateImage={() => handleRegenerateImage(recipe.id)}
                      isRegeneratingImage={regeneratingImageId === recipe.id}
                      onRatingChange={(rating) => handleRatingChange(recipe.id, rating)}
                    />
                  );
                })}
              </>
            )
          )}
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
        {expandedId && (
          <RecipeDetailModal
            recipe={filteredRecipes.find((r) => r.id === expandedId)!}
            folder={folders.find((f) => f.id === filteredRecipes.find((r) => r.id === expandedId)?.folderId)}
            visible={true}
            onClose={() => setExpandedId(null)}
            onAddToShoppingList={() => {
              handleAddToShoppingList(expandedId);
            }}
            onChangeFolder={() => handleChangeFolder(expandedId)}
          />
        )}

        {/* Folder Picker Modal */}
        <FolderPicker
          visible={folderPickerVisible}
          folders={folders}
          selectedId={selectedRecipe?.folderId}
          suggestedId={selectedRecipe?.folderId}
          onSelect={handleFolderSelect}
          onCreateFolder={handleCreateFolder}
          onClose={() => {
            setFolderPickerVisible(false);
            // If there's an AI generated recipe that wasn't saved, clear it
            if (aiGeneratedRecipe) {
              setAiGeneratedRecipe(null);
              setSelectedRecipeId(null);
            }
          }}
        />

        {/* Duplicate Recipe Warning Modal */}
        <DuplicateRecipeModal
          visible={duplicateModalVisible}
          existingRecipe={existingDuplicate}
          newRecipeTitle={pendingRecipe?.title || ''}
          onSaveAnyway={handleDuplicateSaveAnyway}
          onCancel={handleDuplicateCancel}
        />

        {/* Hidden shareable recipe card for capture */}
        <View
          style={{
            position: 'absolute',
            top: -10000,
            left: 0,
          }}
        >
          {shareRecipe && (
            <View ref={shareCardRef} collapsable={false}>
              <ShareableRecipeCard recipe={shareRecipe} />
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* AI Recipe Describer Modal */}
      <Modal
        visible={showAIDescriber}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowAIDescriber(false);
          setAiRecipeDescription('');
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
                      <MessageSquare size={24} color="#10B981" />
                      <Text className="text-white text-xl font-bold ml-2">
                        Describe Your Recipe
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setShowAIDescriber(false);
                        setAiRecipeDescription('');
                        Keyboard.dismiss();
                      }}
                      className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700"
                    >
                      <X size={20} color="#fff" />
                    </Pressable>
                  </View>

                  <Text className="text-zinc-400 mb-4">
                    Describe the recipe you'd like to create and AI will generate complete ingredients and instructions.
                  </Text>

                  <TextInput
                    value={aiRecipeDescription}
                    onChangeText={setAiRecipeDescription}
                    placeholder="E.g., 'A healthy quinoa bowl with grilled chicken, avocado, and lime dressing'"
                    placeholderTextColor="#52525B"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    returnKeyType="done"
                    onSubmitEditing={handleAIDescribeRecipe}
                    editable={!aiRecipeLoading}
                    className="bg-zinc-800 text-white px-4 py-4 rounded-xl mb-4 min-h-[120px]"
                    autoFocus
                  />

                  <Pressable
                    onPress={handleAIDescribeRecipe}
                    disabled={!aiRecipeDescription.trim() || aiRecipeLoading}
                    className="bg-green-600 rounded-2xl py-4 items-center active:bg-green-700 disabled:bg-zinc-700 disabled:opacity-50"
                  >
                    <View className="flex-row items-center">
                      {aiRecipeLoading ? (
                        <>
                          <ActivityIndicator color="white" />
                          <Text className="text-white font-semibold ml-2">
                            Creating Recipe...
                          </Text>
                          <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} color="#fff" />
                          <Text className="text-white font-semibold ml-2">
                            Create Recipe
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

      {/* AI Recipe Preview Modal */}
      {aiGeneratedRecipe && (
        <Modal
          visible={showAIRecipePreview}
          animationType="slide"
          onRequestClose={() => {}} // Prevent dismissal
        >
          <View className="flex-1 bg-black">
            <SafeAreaView edges={['top']} className="flex-1">
              {/* Header with mandatory folder prompt */}
              <View className="px-6 py-4 border-b border-amber-500/30 bg-amber-500/5">
                <View className="flex-row items-center mb-2">
                  <Sparkles size={24} color="#F59E0B" />
                  <Text className="text-white text-xl font-bold ml-2">Recipe Generated!</Text>
                </View>
                <Text className="text-amber-400 text-sm">
                  Please review and choose a folder to save this recipe.
                </Text>
              </View>

              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Recipe Image */}
                <View className="h-64 bg-zinc-900">
                  <View className="w-full h-full items-center justify-center">
                    <View className="w-20 h-20 rounded-full bg-zinc-800 items-center justify-center">
                      <Sparkles size={32} color="#71717A" />
                    </View>
                  </View>
                </View>

                <View className="px-6 py-6">
                  {/* Title */}
                  <Text className="text-white text-2xl font-bold mb-4">
                    {aiGeneratedRecipe.title}
                  </Text>

                  {/* Stats */}
                  <View className="flex-row mb-6 gap-3">
                    <View className="flex-1 bg-zinc-900 rounded-xl p-3">
                      <Text className="text-zinc-500 text-xs mb-1">Servings</Text>
                      <Text className="text-white font-semibold">{aiGeneratedRecipe.servings}</Text>
                    </View>
                    <View className="flex-1 bg-zinc-900 rounded-xl p-3">
                      <Text className="text-zinc-500 text-xs mb-1">Prep</Text>
                      <Text className="text-white font-semibold">{aiGeneratedRecipe.prepTime}</Text>
                    </View>
                    <View className="flex-1 bg-zinc-900 rounded-xl p-3">
                      <Text className="text-zinc-500 text-xs mb-1">Cook</Text>
                      <Text className="text-white font-semibold">{aiGeneratedRecipe.cookTime}</Text>
                    </View>
                  </View>

                  {/* Calories & Macros */}
                  <View className="bg-zinc-900 rounded-2xl p-4 mb-6">
                    <View className="flex-row items-center mb-3">
                      <Flame size={20} color="#F59E0B" />
                      <Text className="text-white font-bold text-lg ml-2">
                        {aiGeneratedRecipe.caloriesPerServing} cal
                      </Text>
                      <Text className="text-zinc-500 text-sm ml-2">per serving</Text>
                    </View>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <Text className="text-blue-400 text-xs mb-1">Protein</Text>
                        <Text className="text-white font-semibold">{aiGeneratedRecipe.macros.protein}g</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-amber-400 text-xs mb-1">Carbs</Text>
                        <Text className="text-white font-semibold">{aiGeneratedRecipe.macros.carbs}g</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-pink-400 text-xs mb-1">Fat</Text>
                        <Text className="text-white font-semibold">{aiGeneratedRecipe.macros.fat}g</Text>
                      </View>
                    </View>
                  </View>

                  {/* Ingredients */}
                  <View className="mb-6">
                    <Text className="text-white font-bold text-lg mb-3">Ingredients</Text>
                    <View className="bg-zinc-900 rounded-2xl p-4">
                      {aiGeneratedRecipe.ingredients.map((ing, idx) => (
                        <View
                          key={ing.id}
                          className={`flex-row py-2 ${
                            idx < aiGeneratedRecipe.ingredients.length - 1 ? 'border-b border-zinc-800' : ''
                          }`}
                        >
                          <Text className="text-white flex-1">{ing.name}</Text>
                          <Text className="text-zinc-400 ml-3">{ing.amount}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Instructions */}
                  <View className="mb-24">
                    <Text className="text-white font-bold text-lg mb-3">Instructions</Text>
                    {aiGeneratedRecipe.instructions.map((instruction, idx) => (
                      <View key={idx} className="flex-row mb-4">
                        <View className="w-6 h-6 rounded-full bg-amber-500 items-center justify-center mr-3 mt-0.5">
                          <Text className="text-black font-bold text-xs">{idx + 1}</Text>
                        </View>
                        <Text className="text-zinc-300 flex-1 leading-6">{instruction}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Fixed Bottom Action */}
              <View className="border-t border-zinc-800 bg-black px-6 py-4">
                <Pressable
                  onPress={handleSaveAIRecipe}
                  className="bg-green-600 rounded-2xl py-4 items-center justify-center active:bg-green-700 flex-row"
                >
                  <Folder size={22} color="#fff" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Choose Folder to Save
                  </Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}

      {/* Toast Notification - outside SafeAreaView to appear on top */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type={toastType}
      />
    </View>
  );
}
