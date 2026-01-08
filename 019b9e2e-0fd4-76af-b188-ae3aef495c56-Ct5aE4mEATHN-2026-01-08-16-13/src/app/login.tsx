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
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Mail, Lock, LogIn, UserPlus, X, KeyRound, Eye, EyeOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/lib/store';

export default function LoginScreen() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const checkEmailExists = useStore((s) => s.checkEmailExists);
  const resetPassword = useStore((s) => s.resetPassword);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  // Forgot password modal state
  const [resetStep, setResetStep] = useState<'email' | 'newPassword' | 'success'>('email');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleForgotPasswordOpen = () => {
    setShowForgotPassword(true);
    setResetStep('email');
    setResetEmail(email); // Pre-fill with login email if exists
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
    setResetStep('email');
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
  };

  const handleCheckEmail = async () => {
    if (!resetEmail.trim()) {
      setResetError('Please enter your email');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!resetEmail.includes('@')) {
      setResetError('Please enter a valid email');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setResetLoading(true);
    setResetError('');

    const exists = await checkEmailExists(resetEmail);

    setResetLoading(false);

    if (exists) {
      setResetStep('newPassword');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setResetError('No account found with this email');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setResetError('Please enter a new password');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setResetLoading(true);
    setResetError('');

    const success = await resetPassword(resetEmail, newPassword);

    setResetLoading(false);

    if (success) {
      setResetStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setResetError('Failed to reset password. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
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

    setLoading(true);
    setError('');

    const success = await login(email.toLowerCase().trim(), password);

    setLoading(false);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } else {
      setError('Invalid email or password');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleSignupPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/signup');
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
          keyboardVerticalOffset={0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            {/* Logo / Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-4">
                <Text className="text-5xl">🍽️</Text>
              </View>
              <Text className="text-4xl font-bold text-white mb-2">Plated</Text>
              <Text className="text-zinc-400 text-center">
                Your personal recipe & meal tracker
              </Text>
            </View>

            {/* Login Form */}
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

              {/* Error Message */}
              {error ? (
                <View className="bg-red-500/20 rounded-xl px-4 py-3 mt-4 border border-red-500/30">
                  <Text className="text-red-400 text-center">{error}</Text>
                </View>
              ) : null}

              {/* Forgot Password Link */}
              <Pressable onPress={handleForgotPasswordOpen} className="mt-3 self-end">
                <Text className="text-green-400 text-sm">Forgot password?</Text>
              </Pressable>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                className="bg-green-600 rounded-2xl py-4 items-center justify-center mt-6 active:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View className="flex-row items-center">
                    <LogIn size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Log In</Text>
                  </View>
                )}
              </Pressable>

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-white/20" />
                <Text className="text-zinc-500 mx-4">or</Text>
                <View className="flex-1 h-px bg-white/20" />
              </View>

              {/* Sign Up Button */}
              <Pressable
                onPress={handleSignupPress}
                className="bg-white/10 rounded-2xl py-4 items-center justify-center border-2 border-white/20 active:bg-white/20"
              >
                <View className="flex-row items-center">
                  <UserPlus size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">Create Account</Text>
                </View>
              </Pressable>
            </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        animationType="slide"
        transparent
        onRequestClose={handleForgotPasswordClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-black/80 justify-end">
              <View className="bg-zinc-900 rounded-t-3xl px-6 pt-6 pb-12">
                {/* Modal Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-white text-xl font-bold">
                    {resetStep === 'email' && 'Reset Password'}
                    {resetStep === 'newPassword' && 'Create New Password'}
                    {resetStep === 'success' && 'Password Reset'}
                  </Text>
                  <Pressable
                    onPress={handleForgotPasswordClose}
                    className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                  >
                    <X size={20} color="#9CA3AF" />
                  </Pressable>
                </View>

            {/* Step 1: Email Verification */}
            {resetStep === 'email' && (
              <View>
                <Text className="text-zinc-400 mb-4">
                  Enter your email address and we'll help you reset your password.
                </Text>
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20">
                  <Mail size={20} color="#9CA3AF" />
                  <TextInput
                    value={resetEmail}
                    onChangeText={(text) => {
                      setResetEmail(text);
                      setResetError('');
                    }}
                    placeholder="your@email.com"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                </View>

                {resetError ? (
                  <View className="bg-red-500/20 rounded-xl px-4 py-3 mt-4 border border-red-500/30">
                    <Text className="text-red-400 text-center">{resetError}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleCheckEmail}
                  disabled={resetLoading}
                  className="bg-green-600 rounded-2xl py-4 items-center justify-center mt-6 active:bg-green-700 disabled:opacity-50"
                >
                  {resetLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-lg">Continue</Text>
                  )}
                </Pressable>
              </View>
            )}

            {/* Step 2: New Password */}
            {resetStep === 'newPassword' && (
              <View>
                <Text className="text-zinc-400 mb-4">
                  Create a new password for {resetEmail}
                </Text>

                {/* New Password */}
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20">
                  <KeyRound size={20} color="#9CA3AF" />
                  <TextInput
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setResetError('');
                    }}
                    placeholder="New password"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                  <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </Pressable>
                </View>

                {/* Confirm Password */}
                <View className="bg-white/10 rounded-2xl flex-row items-center px-4 py-4 border-2 border-white/20 mt-4">
                  <Lock size={20} color="#9CA3AF" />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setResetError('');
                    }}
                    placeholder="Confirm password"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </Pressable>
                </View>

                {resetError ? (
                  <View className="bg-red-500/20 rounded-xl px-4 py-3 mt-4 border border-red-500/30">
                    <Text className="text-red-400 text-center">{resetError}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleResetPassword}
                  disabled={resetLoading}
                  className="bg-green-600 rounded-2xl py-4 items-center justify-center mt-6 active:bg-green-700 disabled:opacity-50"
                >
                  {resetLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-lg">Reset Password</Text>
                  )}
                </Pressable>
              </View>
            )}

            {/* Step 3: Success */}
            {resetStep === 'success' && (
              <View className="items-center py-6">
                <View className="w-16 h-16 rounded-full bg-green-500/20 items-center justify-center mb-4">
                  <KeyRound size={32} color="#10B981" />
                </View>
                <Text className="text-white text-lg font-semibold mb-2">
                  Password Reset Successfully!
                </Text>
                <Text className="text-zinc-400 text-center mb-6">
                  You can now log in with your new password.
                </Text>
                <Pressable
                  onPress={handleForgotPasswordClose}
                  className="bg-green-600 rounded-2xl py-4 px-12 items-center justify-center active:bg-green-700"
                >
                  <Text className="text-white font-bold text-lg">Back to Login</Text>
                </Pressable>
              </View>
            )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
