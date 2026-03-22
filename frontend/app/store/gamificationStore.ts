import { create } from 'zustand';
import { gamificationApi } from '@lib/api';

interface XPData {
  total_xp: number;
  current_level: number;
  level_title: string;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  xp_reward: number;
  unlocked_at?: string;
}

interface GamificationState {
  xp: XPData | null;
  streak: StreakData | null;
  achievements: Achievement[];
  xpToNextLevel: number;
  nextLevel: { level: number; title: string; xpRequired: number } | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  completeVideo: () => Promise<void>;
  clearError: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  xp: null,
  streak: null,
  achievements: [],
  xpToNextLevel: 0,
  nextLevel: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await gamificationApi.getProfile();
      set({
        xp: response.data.xp,
        streak: response.data.streak,
        achievements: response.data.achievements,
        xpToNextLevel: response.data.xpToNextLevel,
        nextLevel: response.data.nextLevel,
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch gamification data', 
        isLoading: false 
      });
    }
  },

  completeVideo: async () => {
    try {
      const response = await gamificationApi.completeVideo();
      set({
        xp: response.data.profile.xp,
        streak: response.data.profile.streak,
        achievements: response.data.profile.achievements,
        xpToNextLevel: response.data.profile.xpToNextLevel,
        nextLevel: response.data.profile.nextLevel,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to record completion' });
    }
  },

  clearError: () => set({ error: null }),
}));
