import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Check,
  Trash2,
  ShoppingCart,
  Apple,
  Beef,
  Milk,
  Wheat,
  Flame,
  Package,
  Snowflake,
  Wine,
  Droplets,
  CircleDot,
} from 'lucide-react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useStore, type IngredientCategory, type Ingredient } from '@/lib/store';
import { cn } from '@/lib/cn';

const CATEGORY_CONFIG: Record<
  IngredientCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  produce: { label: 'Produce', icon: Apple, color: '#22C55E' },
  meats: { label: 'Meats & Seafood', icon: Beef, color: '#EF4444' },
  dairy: { label: 'Dairy & Eggs', icon: Milk, color: '#F59E0B' },
  grains: { label: 'Grains & Bread', icon: Wheat, color: '#D97706' },
  spices: { label: 'Spices & Seasonings', icon: Flame, color: '#F97316' },
  canned: { label: 'Canned Goods', icon: Package, color: '#71717A' },
  frozen: { label: 'Frozen Foods', icon: Snowflake, color: '#06B6D4' },
  beverages: { label: 'Beverages', icon: Wine, color: '#8B5CF6' },
  condiments: { label: 'Condiments & Oils', icon: Droplets, color: '#14B8A6' },
  other: { label: 'Other Items', icon: CircleDot, color: '#71717A' },
};

const CATEGORY_ORDER: IngredientCategory[] = [
  'produce',
  'meats',
  'dairy',
  'grains',
  'spices',
  'canned',
  'frozen',
  'beverages',
  'condiments',
  'other',
];

export default function ShoppingListScreen() {
  const shoppingList = useStore((s) => s.shoppingList);
  const toggleShoppingItem = useStore((s) => s.toggleShoppingItem);
  const removeFromShoppingList = useStore((s) => s.removeFromShoppingList);
  const clearShoppingList = useStore((s) => s.clearShoppingList);
  const clearCheckedItems = useStore((s) => s.clearCheckedItems);

  const groupedItems = useMemo(() => {
    const grouped: Record<IngredientCategory, Ingredient[]> = {
      produce: [],
      meats: [],
      dairy: [],
      grains: [],
      spices: [],
      canned: [],
      frozen: [],
      beverages: [],
      condiments: [],
      other: [],
    };

    shoppingList.forEach((item) => {
      const category = item.category || 'other';
      // Ensure the category exists in grouped, fallback to 'other' if not
      if (grouped[category]) {
        grouped[category].push(item);
      } else {
        grouped['other'].push(item);
      }
    });

    return grouped;
  }, [shoppingList]);

  const stats = useMemo(() => {
    const total = shoppingList.length;
    const checked = shoppingList.filter((i) => i.checked).length;
    return { total, checked, remaining: total - checked };
  }, [shoppingList]);

  const handleToggle = (id: string) => {
    toggleShoppingItem(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRemove = (id: string) => {
    removeFromShoppingList(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleClearChecked = () => {
    clearCheckedItems();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleClearAll = () => {
    clearShoppingList();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-3xl font-bold text-white">Shopping List</Text>
          {stats.total > 0 && (
            <Text className="text-zinc-500 mt-1">
              {stats.checked} of {stats.total} items checked
            </Text>
          )}
        </View>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <View className="mx-5 mb-4">
            <View className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <Animated.View
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(stats.checked / stats.total) * 100}%` }}
                layout={Layout.springify()}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {stats.total > 0 && (
          <View className="flex-row px-5 mb-4">
            {stats.checked > 0 && (
              <Pressable
                onPress={handleClearChecked}
                className="flex-1 flex-row items-center justify-center py-2.5 bg-green-500/20 rounded-xl mr-2 active:bg-green-500/30"
              >
                <Check size={16} color="#22C55E" />
                <Text className="text-green-500 font-medium ml-1.5 text-sm">
                  Clear Checked ({stats.checked})
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleClearAll}
              className={cn(
                'flex-row items-center justify-center py-2.5 bg-red-500/20 rounded-xl active:bg-red-500/30',
                stats.checked > 0 ? 'px-4' : 'flex-1'
              )}
            >
              <Trash2 size={16} color="#EF4444" />
              <Text className="text-red-500 font-medium ml-1.5 text-sm">
                Clear All
              </Text>
            </Pressable>
          </View>
        )}

        {/* Shopping List */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {stats.total === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 rounded-full bg-zinc-900 items-center justify-center mb-4">
                <ShoppingCart size={32} color="#71717A" />
              </View>
              <Text className="text-white font-semibold text-lg mb-1">
                Your list is empty
              </Text>
              <Text className="text-zinc-500 text-center px-10">
                Add ingredients from your recipes to start building your shopping list
              </Text>
            </View>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const items = groupedItems[category];
              if (items.length === 0) return null;

              const config = CATEGORY_CONFIG[category];
              const IconComponent = config.icon;
              const uncheckedCount = items.filter((i) => !i.checked).length;

              return (
                <Animated.View
                  key={category}
                  entering={FadeInRight}
                  className="mb-4"
                >
                  {/* Category Header */}
                  <View className="flex-row items-center px-5 mb-2">
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      <IconComponent size={16} color={config.color} />
                    </View>
                    <Text className="text-white font-semibold flex-1">
                      {config.label}
                    </Text>
                    <View className="bg-zinc-800 rounded-full px-2 py-0.5">
                      <Text className="text-zinc-400 text-xs font-medium">
                        {uncheckedCount}/{items.length}
                      </Text>
                    </View>
                  </View>

                  {/* Items */}
                  <View className="mx-4 bg-zinc-900 rounded-2xl overflow-hidden">
                    {items.map((item, index) => (
                      <Animated.View
                        key={item.id}
                        entering={FadeInRight.delay(index * 30)}
                        exiting={FadeOutLeft}
                        layout={Layout.springify()}
                      >
                        <Pressable
                          onPress={() => handleToggle(item.id)}
                          className={cn(
                            'flex-row items-center px-4 py-3 active:bg-zinc-800',
                            index < items.length - 1 && 'border-b border-zinc-800'
                          )}
                        >
                          {/* Checkbox */}
                          <Pressable
                            onPress={() => handleToggle(item.id)}
                            className={cn(
                              'w-6 h-6 rounded-full border-2 items-center justify-center mr-3',
                              item.checked
                                ? 'bg-green-500 border-green-500'
                                : 'border-zinc-600'
                            )}
                          >
                            {item.checked && <Check size={14} color="white" />}
                          </Pressable>

                          {/* Item Info */}
                          <View className="flex-1">
                            <Text
                              className={cn(
                                'text-base',
                                item.checked
                                  ? 'text-zinc-600 line-through'
                                  : 'text-white'
                              )}
                            >
                              {item.name}
                            </Text>
                            <Text className="text-zinc-500 text-sm">
                              {item.amount}
                            </Text>
                          </View>

                          {/* Delete Button */}
                          <Pressable
                            onPress={() => handleRemove(item.id)}
                            className="p-2 active:bg-zinc-800 rounded-lg"
                          >
                            <Trash2 size={16} color="#71717A" />
                          </Pressable>
                        </Pressable>
                      </Animated.View>
                    ))}
                  </View>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
