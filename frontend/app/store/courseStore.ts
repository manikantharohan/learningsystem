import { create } from 'zustand';
import { subjectsApi, videosApi, SubjectFilters } from '@lib/api';

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
  youtube_url: string;
  duration_seconds: number;
  order_index: number;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  total_duration_seconds: number;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  instructor: string | null;
  tags: string[] | null;
  is_featured: boolean;
  sections?: Section[];
  video_count?: number;
}

interface EnrolledSubject extends Subject {
  total_videos: number;
  completed_videos: number;
  total_progress_seconds: number;
}

interface ContinueLearningSubject extends Subject {
  last_video_id: string;
  last_video_title: string;
  youtube_video_id: string;
  progress_seconds: number;
  completed: boolean;
  last_watched: string;
}

interface CourseState {
  subjects: Subject[];
  featuredSubjects: Subject[];
  categories: string[];
  currentSubject: Subject | null;
  currentVideo: Video | null;
  nextVideo: Video | null;
  prevVideo: Video | null;
  enrolledSubjects: Subject[];
  enrolledWithProgress: EnrolledSubject[];
  continueLearning: ContinueLearningSubject[];
  isEnrolled: boolean;
  isLoading: boolean;
  error: string | null;
  filters: SubjectFilters;
  
  // Actions
  fetchSubjects: (filters?: SubjectFilters) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSubjectTree: (slug: string) => Promise<void>;
  fetchVideo: (id: string) => Promise<void>;
  enroll: (subjectId: string) => Promise<void>;
  fetchEnrolled: () => Promise<void>;
  fetchEnrolledWithProgress: () => Promise<void>;
  fetchContinueLearning: (limit?: number) => Promise<void>;
  setFilters: (filters: SubjectFilters) => void;
  clearError: () => void;
  clearCurrentSubject: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  subjects: [],
  featuredSubjects: [],
  categories: [],
  currentSubject: null,
  currentVideo: null,
  nextVideo: null,
  prevVideo: null,
  enrolledSubjects: [],
  enrolledWithProgress: [],
  continueLearning: [],
  isEnrolled: false,
  isLoading: false,
  error: null,
  filters: {},

  fetchSubjects: async (filters?: SubjectFilters) => {
    set({ isLoading: true, error: null, filters: filters || {} });
    try {
      const response = await subjectsApi.getAll(filters);
      set({ subjects: response.data.subjects, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch courses', 
        isLoading: false 
      });
    }
  },

  fetchFeatured: async () => {
    try {
      const response = await subjectsApi.getFeatured();
      set({ featuredSubjects: response.data.subjects });
    } catch (error: any) {
      // Silently handle 429 rate limit errors
      if (error.response?.status === 429) {
        console.warn('Rate limit hit for featured courses, retrying...');
        // Retry after 1 second
        setTimeout(() => get().fetchFeatured(), 1000);
        return;
      }
      console.error('Failed to fetch featured courses:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await subjectsApi.getCategories();
      set({ categories: response.data.categories });
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchSubjectTree: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subjectsApi.getTree(slug);
      set({ 
        currentSubject: response.data.subject, 
        isEnrolled: response.data.isEnrolled,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch course', 
        isLoading: false 
      });
    }
  },

  fetchVideo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await videosApi.getById(id);
      set({ 
        currentVideo: response.data.video,
        nextVideo: response.data.nextVideo,
        prevVideo: response.data.prevVideo,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch video', 
        isLoading: false 
      });
    }
  },

  enroll: async (subjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await subjectsApi.enroll(subjectId);
      set({ isEnrolled: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to enroll', 
        isLoading: false 
      });
    }
  },

  fetchEnrolled: async () => {
    // Check if user is authenticated before making request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ enrolledSubjects: [] });
      return;
    }
    try {
      const response = await subjectsApi.getEnrolled();
      set({ enrolledSubjects: response.data.subjects });
    } catch (error: any) {
      // Silently handle 401 errors (not authenticated)
      if (error.response?.status === 401) {
        set({ enrolledSubjects: [] });
        return;
      }
      console.error('Failed to fetch enrolled courses:', error);
    }
  },

  fetchEnrolledWithProgress: async () => {
    // Check if user is authenticated before making request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ enrolledWithProgress: [] });
      return;
    }
    try {
      const response = await subjectsApi.getEnrolledWithProgress();
      set({ enrolledWithProgress: response.data.subjects });
    } catch (error: any) {
      // Silently handle 401/429 errors
      if (error.response?.status === 401) {
        set({ enrolledWithProgress: [] });
        return;
      }
      if (error.response?.status === 429) {
        console.warn('Rate limit hit, retrying...');
        setTimeout(() => get().fetchEnrolledWithProgress(), 1000);
        return;
      }
      console.error('Failed to fetch enrolled courses with progress:', error);
    }
  },

  fetchContinueLearning: async (limit: number = 5) => {
    // Check if user is authenticated before making request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ continueLearning: [] });
      return;
    }
    try {
      const response = await subjectsApi.getContinueLearning(limit);
      set({ continueLearning: response.data.subjects });
    } catch (error: any) {
      // Silently handle 401/404 errors (not authenticated or no data)
      if (error.response?.status === 401 || error.response?.status === 404) {
        set({ continueLearning: [] });
        return;
      }
      // Handle 429 rate limit errors
      if (error.response?.status === 429) {
        console.warn('Rate limit hit for continue learning, retrying...');
        setTimeout(() => get().fetchContinueLearning(limit), 1000);
        return;
      }
      console.error('Failed to fetch continue learning:', error);
    }
  },

  setFilters: (filters: SubjectFilters) => {
    set({ filters });
    get().fetchSubjects(filters);
  },

  clearError: () => set({ error: null }),
  
  clearCurrentSubject: () => set({ currentSubject: null, currentVideo: null }),
}));
