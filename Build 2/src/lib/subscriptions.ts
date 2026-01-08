import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Subscription entitlement identifier
export const PREMIUM_ENTITLEMENT_ID = 'premium';

interface SubscriptionState {
  isPremium: boolean;
  trialStartDate: number | null;

  // Actions
  setIsPremium: (isPremium: boolean) => void;
  startTrial: () => void;
  isTrialActive: () => boolean;
  isTrialExpired: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      trialStartDate: null,

      setIsPremium: (isPremium) => set({ isPremium }),

      startTrial: () => {
        const state = get();
        if (!state.trialStartDate) {
          set({ trialStartDate: Date.now() });
        }
      },

      isTrialActive: () => {
        const state = get();
        if (!state.trialStartDate) return false;
        const daysSinceStart = (Date.now() - state.trialStartDate) / (1000 * 60 * 60 * 24);
        return daysSinceStart < 30;
      },

      isTrialExpired: () => {
        const state = get();
        if (!state.trialStartDate) return false;
        const daysSinceStart = (Date.now() - state.trialStartDate) / (1000 * 60 * 60 * 24);
        return daysSinceStart >= 30;
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isPremium: state.isPremium,
        trialStartDate: state.trialStartDate,
      }),
    }
  )
);

// Get trial info
export function getTrialInfo() {
  const subscriptionStore = useSubscriptionStore.getState();
  const trialStartDate = subscriptionStore.trialStartDate;

  if (!trialStartDate) {
    return {
      hasStarted: false,
      daysRemaining: 30,
      isActive: false,
      isExpired: false,
    };
  }

  const daysSinceStart = (Date.now() - trialStartDate) / (1000 * 60 * 60 * 24);
  const daysRemaining = Math.max(0, Math.ceil(30 - daysSinceStart));
  const isActive = daysSinceStart < 30;
  const isExpired = daysSinceStart >= 30;

  return {
    hasStarted: true,
    daysRemaining,
    isActive,
    isExpired,
  };
}
