import React from 'react';
import { View, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { cn } from '@/lib/cn';

interface StarRatingProps {
  rating: number; // 0-5 in 0.5 increments
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showEmptyStars?: boolean;
}

export function StarRating({
  rating = 0,
  onRatingChange,
  size = 16,
  readonly = false,
  showEmptyStars = true,
}: StarRatingProps) {
  const handlePress = (starIndex: number, isHalfStar: boolean) => {
    if (readonly || !onRatingChange) return;

    const newRating = starIndex + (isHalfStar ? 0.5 : 1);
    onRatingChange(newRating);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFullStar = rating >= starValue;
    const isHalfStar = rating >= starValue - 0.5 && rating < starValue;

    if (readonly) {
      // Display-only mode
      if (isFullStar) {
        return (
          <Star
            key={index}
            size={size}
            fill="#FCD34D"
            color="#FCD34D"
          />
        );
      } else if (isHalfStar) {
        return (
          <View key={index} style={{ position: 'relative', width: size, height: size }}>
            <Star
              size={size}
              fill="transparent"
              color="#FCD34D"
              style={{ position: 'absolute' }}
            />
            <View
              style={{
                position: 'absolute',
                width: size / 2,
                height: size,
                overflow: 'hidden',
              }}
            >
              <Star
                size={size}
                fill="#FCD34D"
                color="#FCD34D"
              />
            </View>
          </View>
        );
      } else if (showEmptyStars) {
        return (
          <Star
            key={index}
            size={size}
            fill="transparent"
            color="#52525B"
          />
        );
      }
      return null;
    }

    // Interactive mode
    return (
      <View key={index} className="flex-row">
        {/* Left half - for 0.5 rating */}
        <Pressable
          onPress={() => handlePress(index, true)}
          style={{ width: size / 2, height: size, overflow: 'hidden' }}
          className="active:opacity-70"
        >
          <View style={{ position: 'relative' }}>
            <Star
              size={size}
              fill={isHalfStar || isFullStar ? '#FCD34D' : 'transparent'}
              color="#FCD34D"
            />
          </View>
        </Pressable>

        {/* Right half - for full rating */}
        <Pressable
          onPress={() => handlePress(index, false)}
          style={{ width: size / 2, height: size, marginLeft: -(size / 2) }}
          className="active:opacity-70"
        >
          <View style={{ position: 'relative' }}>
            <Star
              size={size}
              fill={isFullStar ? '#FCD34D' : 'transparent'}
              color="#FCD34D"
            />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View className="flex-row items-center">
      {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
    </View>
  );
}
