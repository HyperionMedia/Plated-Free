import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Redirect, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/lib/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import * as Haptics from 'expo-haptics';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Give navigation time to mount
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isNavigationReady, router]);
}

function RootLayoutNav({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  const router = useRouter();
  const addRecipe = useStore((s) => s.addRecipe);
  const folders = useStore((s) => s.folders);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  // Use the protected route hook
  useProtectedRoute(isAuthenticated);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;

      // Handle both plated:// deep links and https://plated.app universal links
      if (url.includes('plated://recipe/shared') || url.includes('plated.app/recipe')) {
        try {
          const parsedUrl = Linking.parse(url);
          const encodedData = parsedUrl.queryParams?.data as string;

          if (encodedData) {
            const decodedData = decodeURIComponent(encodedData);
            const recipeData = JSON.parse(decodedData);

            const newRecipe = {
              id: `recipe-${Date.now()}`,
              title: recipeData.title,
              imageUri: recipeData.imageUri,
              ingredients: recipeData.ingredients,
              instructions: recipeData.instructions,
              servings: recipeData.servings,
              prepTime: recipeData.prepTime,
              cookTime: recipeData.cookTime,
              caloriesPerServing: recipeData.caloriesPerServing,
              macros: recipeData.macros,
              folderId: folders[0]?.id || '',
              createdAt: Date.now(),
            };

            addRecipe(newRecipe);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push('/(tabs)');
          }
        } catch (error) {
          console.error('Error handling deep link:', error);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [addRecipe, folders, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
        <Stack.Screen name="edit-recipe" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <RootLayoutNav colorScheme={colorScheme} />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
