import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  wizardCompleted: boolean;
  setWizardCompleted: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      wizardCompleted: false,
      setWizardCompleted: () => set({ wizardCompleted: true }),
    }),
    {
      name: 'onboarding-storage',
    },
  ),
);
