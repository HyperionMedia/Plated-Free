import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { Check, ShoppingCart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: 'success' | 'cart';
}

export function Toast({ message, visible, onHide, type = 'success' }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      console.log('Toast showing:', message);
      // Reset values first
      translateY.value = -100;
      opacity.value = 0;

      // Show toast with animation
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto hide after 2.5 seconds
      const hideToast = () => {
        translateY.value = withSpring(-100, { damping: 15 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        });
        opacity.value = withTiming(0, { duration: 200 });
      };

      const timer = setTimeout(hideToast, 2500);
      return () => clearTimeout(timer);
    } else {
      translateY.value = -100;
      opacity.value = 0;
    }
  }, [visible, message]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Don't return null - always render but off-screen when not visible
  // This ensures the component stays mounted and animations work properly

  const Icon = type === 'cart' ? ShoppingCart : Check;
  const bgColor = type === 'cart' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: insets.top + 10,
          left: 16,
          right: 16,
          zIndex: 9999,
        },
      ]}
      pointerEvents="none"
    >
      <View className={`${bgColor} rounded-2xl px-4 py-3 flex-row items-center shadow-lg`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="w-8 h-8 rounded-full bg-black/20 items-center justify-center mr-3">
          <Icon size={16} color="#000" />
        </View>
        <Text className="text-black font-semibold flex-1">{message}</Text>
      </View>
    </Animated.View>
  );
}
