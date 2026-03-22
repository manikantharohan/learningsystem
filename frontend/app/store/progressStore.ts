import { create } from 'zustand';
import { progressApi } from '@lib/api';

interface VideoProgress {
  video_id: string;
  last_position_seconds: number;
  is_completed: boolean;
  completed_at: string | null;
}

interface SubjectProgress {
  subjectId: string;
  totalVideos: number;
  completedVideos: number;
  progressPercentage: number;
  totalTimeSpent: number;
}

interface ProgressState {
  videoProgress: Map<string, VideoProgress>;
  subjectProgress: Map<string, SubjectProgress>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchVideoProgress: (videoId: string) => Promise<void>;
  updateVideoProgress: (videoId: string, data: {
    lastPositionSeconds?: number;
    isCompleted?: boolean;
  }) => Promise<void>;
  fetchSubjectProgress: (subjectId: string) => Promise<void>;
  getProgress: (videoId: string) => VideoProgress | undefined;
  clearError: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  videoProgress: new Map(),
  subjectProgress: new Map(),
  isLoading: false,
  error: null,

  fetchVideoProgress: async (videoId: string) => {
    try {
      const response = await progressApi.getVideoProgress(videoId);
      const progress = response.data.progress;
      
      set((state) => ({
        videoProgress: new Map(state.videoProgress).set(videoId, progress)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch progress' });
    }
  },

  updateVideoProgress: async (videoId: string, data) => {
    try {
      const response = await progressApi.updateVideoProgress(videoId, data);
      const progress = response.data.progress;
      
      set((state) => ({
        videoProgress: new Map(state.videoProgress).set(videoId, progress)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update progress' });
    }
  },

  fetchSubjectProgress: async (subjectId: string) => {
    try {
      const response = await progressApi.getSubjectProgress(subjectId);
      const progress = response.data.progress;
      
      set((state) => ({
        subjectProgress: new Map(state.subjectProgress).set(subjectId, progress)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch subject progress' });
    }
  },

  getProgress: (videoId: string) => {
    return get().videoProgress.get(videoId);
  },

  clearError: () => set({ error: null }),
}));
