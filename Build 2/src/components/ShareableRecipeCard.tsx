import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Users, ChefHat, Flame } from 'lucide-react-native';
import type { Recipe } from '@/lib/store';

interface ShareableRecipeCardProps {
  recipe: Recipe;
}

export function ShareableRecipeCard({ recipe }: ShareableRecipeCardProps) {
  return (
    <View
      style={{
        width: 600,
        backgroundColor: '#18181B',
        borderRadius: 24,
        overflow: 'hidden',
      }}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24 }}
      >
        <Text
          style={{
            color: '#000',
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          {recipe.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Clock size={18} color="#000" />
            <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
              {recipe.prepTime}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ChefHat size={18} color="#000" />
            <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
              {recipe.cookTime}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Users size={18} color="#000" />
            <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
              {recipe.servings}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Nutrition Info */}
      <View style={{ padding: 24, backgroundColor: '#27272A' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Flame size={20} color="#F59E0B" />
          <Text style={{ color: '#F59E0B', fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>
            {recipe.caloriesPerServing} cal/serving
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View
            style={{
              backgroundColor: '#18181B',
              borderRadius: 12,
              padding: 12,
              flex: 1,
            }}
          >
            <Text style={{ color: '#71717A', fontSize: 12, marginBottom: 4 }}>Protein</Text>
            <Text style={{ color: '#60A5FA', fontSize: 20, fontWeight: 'bold' }}>
              {recipe.macros.protein}g
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#18181B',
              borderRadius: 12,
              padding: 12,
              flex: 1,
            }}
          >
            <Text style={{ color: '#71717A', fontSize: 12, marginBottom: 4 }}>Carbs</Text>
            <Text style={{ color: '#FBBF24', fontSize: 20, fontWeight: 'bold' }}>
              {recipe.macros.carbs}g
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#18181B',
              borderRadius: 12,
              padding: 12,
              flex: 1,
            }}
          >
            <Text style={{ color: '#71717A', fontSize: 12, marginBottom: 4 }}>Fat</Text>
            <Text style={{ color: '#F472B6', fontSize: 20, fontWeight: 'bold' }}>
              {recipe.macros.fat}g
            </Text>
          </View>
        </View>
      </View>

      {/* Ingredients */}
      <View style={{ padding: 24, backgroundColor: '#18181B' }}>
        <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
          Ingredients
        </Text>
        {recipe.ingredients.slice(0, 8).map((ing, idx) => (
          <View
            key={ing.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#10B981',
                marginRight: 12,
              }}
            />
            <Text style={{ color: '#D4D4D8', fontSize: 15, flex: 1 }}>
              {ing.amount} {ing.name}
            </Text>
          </View>
        ))}
        {recipe.ingredients.length > 8 && (
          <Text style={{ color: '#71717A', fontSize: 14, marginLeft: 18, marginTop: 8 }}>
            +{recipe.ingredients.length - 8} more ingredients
          </Text>
        )}
      </View>

      {/* Instructions Preview */}
      <View style={{ padding: 24, backgroundColor: '#27272A' }}>
        <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
          Instructions
        </Text>
        {recipe.instructions.slice(0, 4).map((step, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#10B98120',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                marginTop: 2,
              }}
            >
              <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 14 }}>
                {idx + 1}
              </Text>
            </View>
            <Text style={{ color: '#D4D4D8', fontSize: 15, flex: 1, lineHeight: 22 }}>
              {step}
            </Text>
          </View>
        ))}
        {recipe.instructions.length > 4 && (
          <Text style={{ color: '#71717A', fontSize: 14, marginLeft: 40, marginTop: 8 }}>
            +{recipe.instructions.length - 4} more steps
          </Text>
        )}
      </View>

      {/* Footer CTA */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ padding: 20, alignItems: 'center' }}
      >
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
          Want more recipes like this?
        </Text>
        <Text style={{ color: '#E9D5FF', fontSize: 14 }}>
          Download Plated to scan, save, and track your favorite recipes!
        </Text>
      </LinearGradient>
    </View>
  );
}
