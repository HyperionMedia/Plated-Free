import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, ChevronLeft, UserPlus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/lib/store';

export default function SignupScreen() {
  const router = useRouter();
  const signup = useStore((s) => s.signup);

  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSignup = async () => {
    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Basic email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Username validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');

    const success = await signup(email.toLowerCase().trim(), username.trim(), password);

    setLoading(false);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } else {
      setError('Email already exists. Please use a different email.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['#10B981', '#059669', '#000000']}
        locations={[0, 0.3, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <SafeAreaView edges={['top', 'bottom']} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Back Button */}
          <View className="px-6 py-4">
            <Pressable
              onPress={handleBackPress}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
            >
              <ChevronLeft size={24} color="white" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-4">
                <Text className="text-5xl">🍽️</Text>
              </View>
              <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
              <Text className="text-zinc-400 text-center">
                Join Plated to start tracking your meals
              </Text>
            </View>

            {/* Signup Form */}
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-white font-semibold mb-2 ml-1">Email</Text>
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20">
                  <Mail size={20} color="#9CA3AF" />
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    placeholder="your@email.com"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                </View>
              </View>

              {/* Username Input */}
              <View className="mt-4">
                <Text className="text-white font-semibold mb-2 ml-1">Username</Text>
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20">
                  <User size={20} color="#9CA3AF" />
                  <TextInput
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setError('');
                    }}
                    placeholder="johndoe"
                    placeholderTextColor="#6B7280"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mt-4">
                <Text className="text-white font-semibold mb-2 ml-1">Password</Text>
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20">
                  <Lock size={20} color="#9CA3AF" />
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mt-4">
                <Text className="text-white font-semibold mb-2 ml-1">Confirm Password</Text>
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20">
                  <Lock size={20} color="#9CA3AF" />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                </View>
              </View>

              {/* Error Message */}
              {error ? (
                <View className="bg-red-500/20 rounded-xl px-4 py-3 mt-4 border border-red-500/30">
                  <Text className="text-red-400 text-center">{error}</Text>
                </View>
              ) : null}

              {/* Sign Up Button */}
              <Pressable
                onPress={handleSignup}
                disabled={loading}
                className="bg-green-600 rounded-2xl py-4 items-center justify-center mt-6 active:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View className="flex-row items-center">
                    <UserPlus size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Sign Up</Text>
                  </View>
                )}
              </Pressable>

              {/* Terms */}
              <Text className="text-zinc-500 text-center text-sm mt-6">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
