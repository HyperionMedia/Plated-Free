import { View, Text, ScrollView, Pressable } from 'react-native';
import { useStore, getTodayDateString } from '@/lib/store';
import { TrendingUp, TrendingDown, Target, Calendar, Weight, Activity, Clock, Footprints, Settings, Sparkles, AlertCircle } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Svg, { Line, Circle } from 'react-native-svg';
import { Modal, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

const GRAPH_HEIGHT = 280;
const MACRO_GRAPH_HEIGHT = 200;
const BAR_SPACING = 4;
const Y_AXIS_WIDTH = 48;
const PADDING_HORIZONTAL = 24;

type TimeRange = '7' | '14' | '30';

export default function HomeScreen() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiAdviceTimestamp, setAiAdviceTimestamp] = useState<number>(0);
  const mealLogs = useStore((s) => s.mealLogs);
  const userProfile = useStore((s) => s.userProfile);
  const dailyGoals = useStore((s) => s.dailyGoals);
  const weightEntries = useStore((s) => s.weightEntries);
  const exerciseLogs = useStore((s) => s.exerciseLogs);
  const widgetPreferences = useStore((s) => s.widgetPreferences);
  const getLatestWeight = useStore((s) => s.getLatestWeight);
  const getExerciseLogsForDate = useStore((s) => s.getExerciseLogsForDate);

  const handleNavigateToProfile = () => {
    try {
      router?.push('/(tabs)/profile');
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  // Calculate daily totals for the selected time range
  const chartData = useMemo(() => {
    const days = parseInt(timeRange);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day in local time

    const data: Array<{
      date: string;
      dateLabel: string;
      actual: number;
      maintenance: number;
      target: number;
      weight?: number;
      macros: {
        protein: number;
        carbs: number;
        fat: number;
      };
    }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Format date using local timezone (same as getTodayDateString)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dateLabel = i === 0 ? 'Today' :
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Calculate actual calories and macros for this day
      const dayLogs = mealLogs.filter((log) => log.date === dateStr);
      const actual = dayLogs.reduce((sum, log) => sum + log.calories, 0);
      const macros = dayLogs.reduce(
        (acc, log) => ({
          protein: acc.protein + (log.macros?.protein || 0),
          carbs: acc.carbs + (log.macros?.carbs || 0),
          fat: acc.fat + (log.macros?.fat || 0),
        }),
        { protein: 0, carbs: 0, fat: 0 }
      );

      // Get maintenance and target from profile
      const maintenance = dailyGoals?.calories ? dailyGoals.calories + 500 : 2000;
      const target = dailyGoals?.calories || 1800;

      // Get weight for this day - use the latest entry by timestamp if multiple exist
      const entriesForDay = weightEntries.filter((entry) => entry.date === dateStr);
      const weightForDay = entriesForDay.length > 0
        ? entriesForDay.reduce((latest, entry) =>
            entry.timestamp > latest.timestamp ? entry : latest
          )
        : null;

      data.push({
        date: dateStr,
        dateLabel: i === 0 ? 'Today' : dateLabel,
        actual,
        maintenance,
        target,
        weight: weightForDay?.weight,
        macros,
      });
    }

    return data;
  }, [mealLogs, dailyGoals, timeRange, weightEntries]);

  // Find max value for scaling
  const maxValue = useMemo(() => {
    const values = chartData.flatMap((d) => [d.actual, d.maintenance, d.target]);
    return Math.max(...values, 2500);
  }, [chartData]);

  // Calculate weight range for secondary Y-axis
  const weightRange = useMemo(() => {
    const weights = chartData.map((d) => d.weight).filter((w): w is number => w !== undefined);
    if (weights.length === 0) return null;

    const minWeight = Math.min(...weights, userProfile?.goalWeight || 0);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight;
    const padding = range * 0.2; // Add 20% padding

    return {
      min: Math.floor(minWeight - padding),
      max: Math.ceil(maxWeight + padding),
      goalWeight: userProfile?.goalWeight,
    };
  }, [chartData, userProfile]);

  // Calculate max macro value for scaling
  const maxMacroValue = useMemo(() => {
    const proteinGoal = dailyGoals?.protein || 150;
    const carbsGoal = dailyGoals?.carbs || 200;
    const fatGoal = dailyGoals?.fat || 70;

    const allValues = chartData.flatMap((d) => [
      d.macros.protein,
      d.macros.carbs,
      d.macros.fat,
    ]);

    return Math.max(...allValues, proteinGoal, carbsGoal, fatGoal) * 1.1; // 10% padding
  }, [chartData, dailyGoals]);

  // Calculate bar width dynamically based on available space
  const barWidth = useMemo(() => {
    const totalSpacing = BAR_SPACING * (chartData.length - 1);
    // Use flex-1 container width minus Y-axis and padding
    const availableWidth = 100; // Percentage-based, will use flex in component
    return availableWidth;
  }, [chartData.length]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalActual = chartData.reduce((sum, d) => sum + d.actual, 0);
    const avgActual = Math.round(totalActual / chartData.length);
    const avgTarget = dailyGoals?.calories || 1800;
    const avgMaintenance = avgTarget + 500;

    const daysUnderTarget = chartData.filter((d) => d.actual <= d.target).length;
    const daysOverTarget = chartData.filter((d) => d.actual > d.target).length;

    return {
      avgActual,
      avgTarget,
      avgMaintenance,
      daysUnderTarget,
      daysOverTarget,
      totalDays: chartData.length,
    };
  }, [chartData, dailyGoals]);

  // Widget data
  const widgetData = useMemo(() => {
    const latestWeight = getLatestWeight();
    const todayExercise = getExerciseLogsForDate(getTodayDateString());

    // Get previous weight by finding second-latest by timestamp
    const previousWeight = weightEntries.length > 1
      ? weightEntries
          .filter((entry) => entry.timestamp !== latestWeight?.timestamp)
          .reduce((latest, entry) =>
            entry.timestamp > (latest?.timestamp || 0) ? entry : latest
          , null as typeof weightEntries[0] | null)?.weight
      : null;

    const totalReps = todayExercise
      .filter((log) => log.type === 'strength' && log.reps)
      .reduce((sum, log) => sum + (log.reps || 0) * (log.sets || 1), 0);

    const exerciseTime = todayExercise
      .filter((log) => (log.type === 'cardio' || log.type === 'strength') && log.duration)
      .reduce((sum, log) => sum + (log.duration || 0), 0);

    const walkingTime = todayExercise
      .filter((log) => log.type === 'walking' && log.duration)
      .reduce((sum, log) => sum + (log.duration || 0), 0);

    return {
      currentWeight: latestWeight?.weight,
      previousWeight,
      bodyFat: userProfile?.bodyFat,
      totalReps,
      exerciseTime,
      walkingTime,
    };
  }, [weightEntries, exerciseLogs, userProfile, getLatestWeight, getExerciseLogsForDate]);

  // Calculate hours remaining until new advice can be generated
  const hoursUntilNewAdvice = useMemo(() => {
    if (!aiAdviceTimestamp || !aiAdvice) return 0;

    const now = Date.now();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    const timeSinceAdvice = now - aiAdviceTimestamp;
    const timeRemaining = TWELVE_HOURS - timeSinceAdvice;

    if (timeRemaining <= 0) return 0;

    return Math.ceil(timeRemaining / (60 * 60 * 1000)); // Convert to hours and round up
  }, [aiAdviceTimestamp, aiAdvice]);

  const handleAIAssist = async () => {
    if (!userProfile || !dailyGoals) return;

    const now = Date.now();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    // Check if we have cached advice less than 12 hours old
    if (aiAdvice && aiAdviceTimestamp && (now - aiAdviceTimestamp) < TWELVE_HOURS) {
      setShowAIAssist(true);
      return; // Show existing advice without regenerating
    }

    setShowAIAssist(true);
    setAiAnalyzing(true);
    setAiAdvice('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Calculate today's progress
      const todayLogs = mealLogs.filter(log => log.date === getTodayDateString());
      const todayCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
      const todayProtein = todayLogs.reduce((sum, log) => sum + log.macros.protein, 0);
      const todayCarbs = todayLogs.reduce((sum, log) => sum + log.macros.carbs, 0);
      const todayFat = todayLogs.reduce((sum, log) => sum + log.macros.fat, 0);

      // Get recent weight trend
      const recentWeights = weightEntries.slice(-7);
      const weightTrend = recentWeights.length >= 2
        ? recentWeights[recentWeights.length - 1].weight - recentWeights[0].weight
        : 0;

      const prompt = `You are a supportive fitness and nutrition coach. Analyze the user's current status and provide personalized, encouraging advice in a conversational tone.

User Profile:
- Goal: ${userProfile.goalType} weight (Current: ${userProfile.weight} lbs, Target: ${userProfile.goalWeight} lbs)
- Activity Level: ${userProfile.activityLevel}
- Daily Goals: ${dailyGoals.calories} calories, ${dailyGoals.protein}g protein, ${dailyGoals.carbs}g carbs, ${dailyGoals.fat}g fat

Today's Progress:
- Consumed: ${todayCalories}/${dailyGoals.calories} calories
- Protein: ${Math.round(todayProtein)}/${dailyGoals.protein}g
- Carbs: ${Math.round(todayCarbs)}/${dailyGoals.carbs}g
- Fat: ${Math.round(todayFat)}/${dailyGoals.fat}g

Recent Trend (7 days):
- Weight change: ${weightTrend > 0 ? '+' : ''}${weightTrend.toFixed(1)} lbs
- Average daily calories: ${stats.avgActual} cal

Provide encouraging, conversational advice in this structure:

Progress Summary:
Start with 2-3 sentences acknowledging their progress. Be warm and supportive. Highlight what they're doing well, then gently note any areas for improvement.

Food Focus for This Week:
Give 3-4 specific, actionable recommendations in bullet points:
- What foods or macros to prioritize
- What to moderate or reduce
- Simple meal ideas if relevant

Quick 10-Minute Home Workout:
Suggest 4-5 bodyweight exercises in bullet points:
- Exercise name: reps or duration
- Include brief form tips if helpful

FORMATTING RULES:
- Write in a warm, conversational tone like talking to a friend
- Be genuinely supportive and encouraging
- Use plain text only (no emojis, asterisks, bold, or italics)
- Use bullet points with dashes for lists
- Keep it concise but friendly
- Be specific with numbers and recommendations`;

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
              role: 'system',
              content: 'You are a supportive, friendly fitness coach. Write in a warm, conversational tone. Use plain text with bullet points for lists. No emojis, bold, italics, or excessive formatting. Be genuinely encouraging and helpful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 600
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI advice');
      }

      const data = await response.json();
      const advice = data.choices?.[0]?.message?.content || '';

      if (!advice) {
        throw new Error('No advice received');
      }

      setAiAdvice(advice);
      setAiAdviceTimestamp(Date.now()); // Store timestamp when advice is generated
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('AI assist error:', error);
      setAiAdvice('Unable to generate personalized advice right now. Please try again later.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAiAnalyzing(false);
    }
  };

  if (!userProfile || !dailyGoals) {
    return (
      <View className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center px-6">
          <Target size={64} color="#666" />
          <Text className="text-white text-2xl font-bold mt-6 text-center">
            Set Up Your Profile
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Go to the Profile tab to set your goals and start tracking your progress
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-3xl font-bold">Dashboard</Text>
              <Text className="text-gray-400 text-base mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            <Pressable
              onPress={handleNavigateToProfile}
              className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center"
            >
              <Settings size={20} color="#71717A" />
            </Pressable>
          </View>
        </View>

        {/* AI Assist Button */}
        <Animated.View entering={FadeInDown.delay(0)} className="px-6 mb-6">
          <Pressable
            onPress={handleAIAssist}
            className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl py-4 px-6 flex-row items-center justify-center active:opacity-80"
            style={{ backgroundColor: '#10B981' }}
          >
            <Sparkles size={22} color="#fff" />
            <Text className="text-white font-bold text-base ml-2">
              Daily AI Coach Advice
            </Text>
          </Pressable>
        </Animated.View>

        {/* Dashboard Widgets */}
        <View className="px-6 mb-6">
          <View className="flex-row flex-wrap gap-3">
            {/* Weight Widget */}
            {widgetPreferences.showWeight && widgetData.currentWeight && (
              <Animated.View entering={FadeInDown.delay(50)} className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Weight size={18} color="#3B82F6" />
                  <Text className="text-gray-400 text-xs font-semibold ml-2">WEIGHT</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{widgetData.currentWeight}</Text>
                <View className="flex-row items-center mt-1">
                  {widgetData.previousWeight && widgetData.currentWeight !== widgetData.previousWeight && (
                    <>
                      {widgetData.currentWeight < widgetData.previousWeight ? (
                        <>
                          <TrendingDown size={12} color="#10b981" />
                          <Text className="text-emerald-500 text-xs ml-1">
                            -{(widgetData.previousWeight - widgetData.currentWeight).toFixed(1)} lbs
                          </Text>
                        </>
                      ) : (
                        <>
                          <TrendingUp size={12} color="#ef4444" />
                          <Text className="text-red-500 text-xs ml-1">
                            +{(widgetData.currentWeight - widgetData.previousWeight).toFixed(1)} lbs
                          </Text>
                        </>
                      )}
                    </>
                  )}
                  {!widgetData.previousWeight || widgetData.currentWeight === widgetData.previousWeight && (
                    <Text className="text-gray-500 text-xs">lbs</Text>
                  )}
                </View>
              </Animated.View>
            )}

            {/* Body Fat Widget */}
            {widgetPreferences.showBodyFat && widgetData.bodyFat && (
              <Animated.View entering={FadeInDown.delay(100)} className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Activity size={18} color="#EC4899" />
                  <Text className="text-gray-400 text-xs font-semibold ml-2">BODY FAT</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{widgetData.bodyFat}%</Text>
                <Text className="text-gray-500 text-xs mt-1">percentage</Text>
              </Animated.View>
            )}

            {/* Macro Goals Widget */}
            {widgetPreferences.showMacros && dailyGoals && (
              <Animated.View entering={FadeInDown.delay(150)} className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Target size={18} color="#F59E0B" />
                  <Text className="text-gray-400 text-xs font-semibold ml-2">MACRO GOALS</Text>
                </View>
                <View className="flex-row items-center justify-between mt-1">
                  <View>
                    <Text className="text-blue-400 text-xs">P: {dailyGoals.protein}g</Text>
                    <Text className="text-amber-400 text-xs mt-0.5">C: {dailyGoals.carbs}g</Text>
                    <Text className="text-pink-400 text-xs mt-0.5">F: {dailyGoals.fat}g</Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Exercise Reps Widget */}
            {widgetPreferences.showExerciseReps && (
              <Animated.View entering={FadeInDown.delay(200)} className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Activity size={18} color="#8B5CF6" />
                  <Text className="text-gray-400 text-xs font-semibold ml-2">REPS TODAY</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{widgetData.totalReps}</Text>
                <Text className="text-gray-500 text-xs mt-1">total reps</Text>
              </Animated.View>
            )}

            {/* Exercise Time Widget */}
            {widgetPreferences.showExerciseTime && (
              <Animated.View entering={FadeInDown.delay(250)} className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Clock size={18} color="#10B981" />
                  <Text className="text-gray-400 text-xs font-semibold ml-2">EXERCISE</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{widgetData.exerciseTime}</Text>
                <Text className="text-gray-500 text-xs mt-1">minutes today</Text>
              </Animated.View>
            )}

            {/* Walking Time Widget */}
            {widgetPreferences.showWalkingTime && (
              <Animated.View entering={FadeInDown.delay(300)} className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Footprints size={18} color="#06B6D4" />
                  <Text className="text-gray-400 text-xs font-semibold ml-2">WALKING</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{widgetData.walkingTime}</Text>
                <Text className="text-gray-500 text-xs mt-1">minutes today</Text>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Calorie Tracking Section */}
        <View className="px-6 mb-4">
          <Text className="text-white text-2xl font-bold">Calorie Tracking</Text>
        </View>

        {/* Time Range Selector */}
        <View className="flex-row px-6 mb-6 gap-3">
          {(['7', '14', '30'] as TimeRange[]).map((range) => (
            <Pressable
              key={range}
              onPress={() => setTimeRange(range)}
              className={`flex-1 py-3 rounded-xl ${
                timeRange === range ? 'bg-blue-600' : 'bg-zinc-900'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  timeRange === range ? 'text-white' : 'text-gray-400'
                }`}
              >
                {range} Days
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-6 mb-6 gap-3">
          <Animated.View
            entering={FadeInDown.delay(100)}
            className="flex-1 bg-zinc-900 rounded-2xl p-4"
          >
            <Text className="text-gray-400 text-xs font-semibold mb-1">AVG ACTUAL</Text>
            <Text className="text-white text-2xl font-bold">{stats.avgActual}</Text>
            <Text className="text-gray-500 text-xs mt-1">cal/day</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200)}
            className="flex-1 bg-zinc-900 rounded-2xl p-4"
          >
            <Text className="text-gray-400 text-xs font-semibold mb-1">TARGET</Text>
            <Text className="text-emerald-500 text-2xl font-bold">{stats.avgTarget}</Text>
            <Text className="text-gray-500 text-xs mt-1">cal/day</Text>
          </Animated.View>
        </View>

        {/* Progress Indicator */}
        <Animated.View entering={FadeInDown.delay(300)} className="px-6 mb-6">
          <View className="bg-zinc-900 rounded-2xl p-4">
            <Text className="text-gray-400 text-xs font-semibold mb-3">PROGRESS</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <TrendingDown size={16} color="#10b981" />
                  <Text className="text-emerald-500 font-semibold ml-2">
                    {stats.daysUnderTarget} days under target
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <TrendingUp size={16} color="#ef4444" />
                  <Text className="text-red-500 font-semibold ml-2">
                    {stats.daysOverTarget} days over target
                  </Text>
                </View>
              </View>
              <View className="items-center ml-4">
                <Text className="text-white text-3xl font-bold">
                  {Math.round((stats.daysUnderTarget / stats.totalDays) * 100)}%
                </Text>
                <Text className="text-gray-500 text-xs">on track</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Graph */}
        <Animated.View entering={FadeInDown.delay(400)} className="px-6 mb-6">
          <View className="bg-zinc-900 rounded-2xl p-4">
            <Text className="text-gray-400 text-xs font-semibold mb-4">
              DAILY CALORIES
            </Text>

            {/* Legend */}
            <View className="flex-row flex-wrap justify-center mb-4 gap-3">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                <Text className="text-gray-400 text-xs">Actual</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                <Text className="text-gray-400 text-xs">Target</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                <Text className="text-gray-400 text-xs">Maintenance</Text>
              </View>
            </View>

            {/* Graph Container */}
            <View style={{ height: GRAPH_HEIGHT }}>
              {/* Y-axis labels */}
              <View className="absolute left-0 top-0 bottom-0 justify-between py-2" style={{ width: Y_AXIS_WIDTH }}>
                <Text className="text-gray-600 text-xs">{maxValue}</Text>
                <Text className="text-gray-600 text-xs">{Math.round(maxValue / 2)}</Text>
                <Text className="text-gray-600 text-xs">0</Text>
              </View>

              {/* Grid lines */}
              <View className="absolute top-0 bottom-0 justify-between" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                <View className="h-px bg-zinc-800" />
                <View className="h-px bg-zinc-800" />
                <View className="h-px bg-zinc-800" />
              </View>

              {/* Bars */}
              <View className="absolute bottom-8 top-2 flex-row items-end" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                {chartData.map((day, index) => {
                  const actualHeight = (day.actual / maxValue) * (GRAPH_HEIGHT - 40);
                  const targetHeight = (day.target / maxValue) * (GRAPH_HEIGHT - 40);
                  const maintenanceHeight = (day.maintenance / maxValue) * (GRAPH_HEIGHT - 40);

                  return (
                    <View
                      key={day.date}
                      className="flex-1 items-center"
                      style={{
                        marginLeft: index > 0 ? BAR_SPACING : 0,
                      }}
                    >
                      {/* Bar stack */}
                      <View className="flex-1 w-full justify-end items-center gap-1">
                        {/* Actual bar */}
                        <View
                          style={{ height: Math.max(actualHeight, 2) }}
                          className="w-full bg-blue-500 rounded-t-sm"
                        />

                        {/* Reference lines */}
                        <View className="absolute left-0 right-0 flex-col">
                          <View
                            style={{ bottom: targetHeight }}
                            className="h-0.5 bg-emerald-500 opacity-50"
                          />
                          <View
                            style={{ bottom: maintenanceHeight }}
                            className="h-0.5 bg-amber-500 opacity-50"
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* X-axis labels */}
              <View className="absolute bottom-0 flex-row" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                {chartData.map((day, index) => (
                  <View
                    key={day.date}
                    className="flex-1"
                    style={{
                      marginLeft: index > 0 ? BAR_SPACING : 0,
                    }}
                  >
                    <Text
                      className="text-gray-600 text-xs text-center mt-1"
                      numberOfLines={1}
                      style={{ fontSize: chartData.length > 14 ? 8 : 10 }}
                    >
                      {chartData.length <= 7
                        ? day.dateLabel
                        : index % Math.ceil(chartData.length / 5) === 0
                        ? day.dateLabel.split(' ')[1]
                        : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Macro Tracking Graph */}
        <Animated.View entering={FadeInDown.delay(500)} className="px-6 mb-6">
          <View className="bg-zinc-900 rounded-2xl p-4">
            <Text className="text-gray-400 text-xs font-semibold mb-4">
              DAILY MACROS (grams)
            </Text>

            {/* Legend */}
            <View className="flex-row justify-center mb-4 gap-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                <Text className="text-gray-400 text-xs">Protein ({dailyGoals?.protein || 0}g goal)</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                <Text className="text-gray-400 text-xs">Carbs ({dailyGoals?.carbs || 0}g goal)</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-pink-500 mr-2" />
                <Text className="text-gray-400 text-xs">Fat ({dailyGoals?.fat || 0}g goal)</Text>
              </View>
            </View>

            {/* Graph Container */}
            <View style={{ height: MACRO_GRAPH_HEIGHT }}>
              {/* Y-axis labels */}
              <View className="absolute left-0 top-0 bottom-0 justify-between py-2" style={{ width: Y_AXIS_WIDTH }}>
                <Text className="text-gray-600 text-xs">{Math.round(maxMacroValue)}g</Text>
                <Text className="text-gray-600 text-xs">{Math.round(maxMacroValue / 2)}g</Text>
                <Text className="text-gray-600 text-xs">0</Text>
              </View>

              {/* Grid lines */}
              <View className="absolute top-0 bottom-0 justify-between" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                <View className="h-px bg-zinc-800" />
                <View className="h-px bg-zinc-800" />
                <View className="h-px bg-zinc-800" />
              </View>

              {/* Goal lines */}
              <View className="absolute bottom-8 top-2" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                {/* Protein goal line */}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: ((dailyGoals?.protein || 0) / maxMacroValue) * (MACRO_GRAPH_HEIGHT - 40),
                    height: 2,
                    backgroundColor: '#3B82F6',
                    opacity: 0.6,
                  }}
                />
                {/* Carbs goal line */}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: ((dailyGoals?.carbs || 0) / maxMacroValue) * (MACRO_GRAPH_HEIGHT - 40),
                    height: 2,
                    backgroundColor: '#F59E0B',
                    opacity: 0.6,
                  }}
                />
                {/* Fat goal line */}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: ((dailyGoals?.fat || 0) / maxMacroValue) * (MACRO_GRAPH_HEIGHT - 40),
                    height: 2,
                    backgroundColor: '#EC4899',
                    opacity: 0.6,
                  }}
                />
              </View>

              {/* Macro Bars */}
              <View className="absolute bottom-8 top-2 flex-row items-end" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                {chartData.map((day, index) => {
                  const proteinHeight = (day.macros.protein / maxMacroValue) * (MACRO_GRAPH_HEIGHT - 40);
                  const carbsHeight = (day.macros.carbs / maxMacroValue) * (MACRO_GRAPH_HEIGHT - 40);
                  const fatHeight = (day.macros.fat / maxMacroValue) * (MACRO_GRAPH_HEIGHT - 40);

                  return (
                    <View
                      key={day.date}
                      className="flex-1 flex-row items-end justify-center"
                      style={{
                        marginLeft: index > 0 ? BAR_SPACING : 0,
                      }}
                    >
                      {/* Protein bar */}
                      <View
                        style={{ height: Math.max(proteinHeight, 2), width: '28%' }}
                        className="bg-blue-500 rounded-t-sm mx-px"
                      />
                      {/* Carbs bar */}
                      <View
                        style={{ height: Math.max(carbsHeight, 2), width: '28%' }}
                        className="bg-amber-500 rounded-t-sm mx-px"
                      />
                      {/* Fat bar */}
                      <View
                        style={{ height: Math.max(fatHeight, 2), width: '28%' }}
                        className="bg-pink-500 rounded-t-sm mx-px"
                      />
                    </View>
                  );
                })}
              </View>

              {/* X-axis labels */}
              <View className="absolute bottom-0 flex-row" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                {chartData.map((day, index) => (
                  <View
                    key={day.date}
                    className="flex-1"
                    style={{
                      marginLeft: index > 0 ? BAR_SPACING : 0,
                    }}
                  >
                    <Text
                      className="text-gray-600 text-xs text-center mt-1"
                      numberOfLines={1}
                      style={{ fontSize: chartData.length > 14 ? 8 : 10 }}
                    >
                      {chartData.length <= 7
                        ? day.dateLabel
                        : index % Math.ceil(chartData.length / 5) === 0
                        ? day.dateLabel.split(' ')[1]
                        : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Today's Macro Summary */}
            {chartData.length > 0 && (
              <View className="flex-row justify-between mt-4 pt-3 border-t border-zinc-800">
                <View className="items-center flex-1">
                  <Text className="text-blue-500 text-lg font-bold">
                    {chartData[chartData.length - 1].macros.protein}g
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    / {dailyGoals?.protein || 0}g protein
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-amber-500 text-lg font-bold">
                    {chartData[chartData.length - 1].macros.carbs}g
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    / {dailyGoals?.carbs || 0}g carbs
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-pink-500 text-lg font-bold">
                    {chartData[chartData.length - 1].macros.fat}g
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    / {dailyGoals?.fat || 0}g fat
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Weight Tracking Graph */}
        <Animated.View entering={FadeInDown.delay(600)} className="px-6 mb-6">
          <View className="bg-zinc-900 rounded-2xl p-4">
            <Text className="text-gray-400 text-xs font-semibold mb-4">
              WEIGHT TRACKING
            </Text>

            {!weightRange ? (
              <View className="items-center py-12">
                <Weight size={48} color="#71717A" />
                <Text className="text-zinc-400 text-center mt-4">
                  No weight data yet
                </Text>
                <Text className="text-zinc-600 text-center text-sm mt-1">
                  Go to Tracking tab to log your weight
                </Text>
              </View>
            ) : (
              <>
                {/* Legend */}
                <View className="flex-row justify-center mb-4 gap-4">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                    <Text className="text-gray-400 text-xs">Weight (lbs)</Text>
                  </View>
                  {weightRange.goalWeight && (
                    <View className="flex-row items-center">
                      <View className="w-3 h-px bg-purple-300 mr-2" style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: '#D8B4FE', width: 12 }} />
                      <Text className="text-gray-400 text-xs">Goal: {weightRange.goalWeight} lbs</Text>
                    </View>
                  )}
                </View>

                {/* Graph Container */}
                <View style={{ height: MACRO_GRAPH_HEIGHT }}>
                  {/* Y-axis labels */}
                  <View className="absolute left-0 top-0 bottom-0 justify-between py-2" style={{ width: Y_AXIS_WIDTH }}>
                    <Text className="text-purple-400 text-xs">{weightRange.max}lb</Text>
                    <Text className="text-purple-400 text-xs">{Math.round((weightRange.max + weightRange.min) / 2)}lb</Text>
                    <Text className="text-purple-400 text-xs">{weightRange.min}lb</Text>
                  </View>

                  {/* Grid lines */}
                  <View className="absolute top-0 bottom-0 justify-between" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                    <View className="h-px bg-zinc-800" />
                    <View className="h-px bg-zinc-800" />
                    <View className="h-px bg-zinc-800" />
                  </View>

                  {/* Goal weight line */}
                  {weightRange.goalWeight && (
                    <View className="absolute bottom-8 top-2" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                      <View
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: ((weightRange.goalWeight - weightRange.min) / (weightRange.max - weightRange.min)) * (MACRO_GRAPH_HEIGHT - 40),
                          height: 2,
                          backgroundColor: '#D8B4FE',
                          opacity: 0.6,
                        }}
                      />
                    </View>
                  )}

                  {/* Weight Line and Points */}
                  <View className="absolute bottom-8 top-2" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                    <Svg width="100%" height={MACRO_GRAPH_HEIGHT - 40} style={{ position: 'absolute' }}>
                      {/* Draw lines connecting weight entries */}
                      {(() => {
                        const weightDays = chartData
                          .map((day, index) => ({ ...day, index }))
                          .filter((day) => day.weight !== undefined);

                        return weightDays.map((day, i) => {
                          if (i === weightDays.length - 1) return null;
                          const nextDay = weightDays[i + 1];

                          const graphWidth = 100; // Percentage
                          const barWidthPx = graphWidth / chartData.length;

                          const x1Percent = (day.index * barWidthPx) + (barWidthPx / 2);
                          const x2Percent = (nextDay.index * barWidthPx) + (barWidthPx / 2);

                          // Calculate Y position: normalize weight to 0-1 range, then map to SVG coordinates
                          // SVG Y starts at top (0), so we invert: (1 - normalized) * height
                          const normalizedY1 = (day.weight! - weightRange.min) / (weightRange.max - weightRange.min);
                          const normalizedY2 = (nextDay.weight! - weightRange.min) / (weightRange.max - weightRange.min);
                          const y1 = (1 - normalizedY1) * (MACRO_GRAPH_HEIGHT - 40);
                          const y2 = (1 - normalizedY2) * (MACRO_GRAPH_HEIGHT - 40);

                          return (
                            <Line
                              key={`line-${day.date}`}
                              x1={`${x1Percent}%`}
                              y1={y1}
                              x2={`${x2Percent}%`}
                              y2={y2}
                              stroke="#A78BFA"
                              strokeWidth="3"
                            />
                          );
                        });
                      })()}

                      {/* Draw dots for weight entries */}
                      {chartData.map((day, index) => {
                        if (!day.weight) return null;

                        const graphWidth = 100;
                        const barWidthPx = graphWidth / chartData.length;
                        const xPercent = (index * barWidthPx) + (barWidthPx / 2);

                        // Calculate Y position: normalize weight to 0-1 range, then invert for SVG
                        const normalizedY = (day.weight - weightRange.min) / (weightRange.max - weightRange.min);
                        const y = (1 - normalizedY) * (MACRO_GRAPH_HEIGHT - 40);

                        return (
                          <Circle
                            key={`dot-${day.date}`}
                            cx={`${xPercent}%`}
                            cy={y}
                            r="4"
                            fill="#A78BFA"
                            stroke="#000"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </Svg>
                  </View>

                  {/* X-axis labels */}
                  <View className="absolute bottom-0 flex-row" style={{ left: Y_AXIS_WIDTH, right: 0 }}>
                    {chartData.map((day, index) => (
                      <View
                        key={day.date}
                        className="flex-1"
                        style={{
                          marginLeft: index > 0 ? BAR_SPACING : 0,
                        }}
                      >
                        <Text
                          className="text-gray-600 text-xs text-center mt-1"
                          numberOfLines={1}
                          style={{ fontSize: chartData.length > 14 ? 8 : 10 }}
                        >
                          {chartData.length <= 7
                            ? day.dateLabel
                            : index % Math.ceil(chartData.length / 5) === 0
                            ? day.dateLabel.split(' ')[1]
                            : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Weight Stats */}
                {(() => {
                  // Get the latest weight entry from all entries using the store method
                  const latestWeightEntry = getLatestWeight();

                  if (!latestWeightEntry) return null;

                  return (
                    <View className="flex-row justify-between mt-4 pt-3 border-t border-zinc-800">
                      <View className="items-center flex-1">
                        <Text className="text-purple-500 text-lg font-bold">
                          {latestWeightEntry.weight} lbs
                        </Text>
                        <Text className="text-gray-500 text-xs">Current Weight</Text>
                      </View>
                      {weightRange.goalWeight && (
                        <View className="items-center flex-1">
                          <Text className="text-purple-300 text-lg font-bold">
                            {weightRange.goalWeight} lbs
                          </Text>
                          <Text className="text-gray-500 text-xs">Goal Weight</Text>
                        </View>
                      )}
                      {weightRange.goalWeight && (
                        <View className="items-center flex-1">
                          <Text className={`text-lg font-bold ${
                            latestWeightEntry.weight > weightRange.goalWeight
                              ? 'text-amber-500'
                              : 'text-emerald-500'
                          }`}>
                            {Math.abs(latestWeightEntry.weight - weightRange.goalWeight).toFixed(1)} lbs
                          </Text>
                          <Text className="text-gray-500 text-xs">To Goal</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}
              </>
            )}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Text className="text-gray-400 text-xs font-semibold mb-3">QUICK INFO</Text>
          <View className="bg-zinc-900 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-400">Maintenance Calories</Text>
              <Text className="text-white font-semibold">{stats.avgMaintenance} cal</Text>
            </View>
            <View className="h-px bg-zinc-800 mb-3" />
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-400">Weight Loss Target</Text>
              <Text className="text-emerald-500 font-semibold">{stats.avgTarget} cal</Text>
            </View>
            <View className="h-px bg-zinc-800 mb-3" />
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400">Daily Deficit</Text>
              <Text className="text-blue-500 font-semibold">
                -{stats.avgMaintenance - stats.avgTarget} cal
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Coach Advice Modal */}
      <Modal
        visible={showAIAssist}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAIAssist(false)}
      >
        <View className="flex-1 bg-black">
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-16 pb-4 border-b border-zinc-800">
              <View className="flex-row items-center flex-1">
                <Sparkles size={24} color="#10B981" />
                <Text className="text-white text-xl font-bold ml-2">
                  AI Coach Advice
                </Text>
              </View>
              <Pressable
                onPress={() => setShowAIAssist(false)}
                className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
              >
                <Text className="text-white text-2xl">×</Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
              {aiAnalyzing ? (
                <View className="items-center justify-center py-16">
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text className="text-white font-bold text-lg mt-6">
                    Analyzing Your Progress...
                  </Text>
                  <Text className="text-zinc-400 text-base mt-2 text-center">
                    Getting personalized tips based on your goals
                  </Text>
                </View>
              ) : (
                <View>
                  <Text className="text-white text-base leading-7">
                    {aiAdvice}
                  </Text>
                  {hoursUntilNewAdvice > 0 && (
                    <View className="mt-6 pt-6 border-t border-zinc-800">
                      <Text className="text-zinc-400 text-sm text-center">
                        Come back in {hoursUntilNewAdvice} {hoursUntilNewAdvice === 1 ? 'hour' : 'hours'} for more advice
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
