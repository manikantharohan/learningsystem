import api from './axios';

// Types
export interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  total_duration_seconds: number;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  instructor: string | null;
  tags: string[] | null;
  is_featured: boolean;
  created_at: string;
}

export interface SubjectFilters {
  category?: string;
  difficulty?: string;
  search?: string;
  featured?: boolean;
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  refresh: () => api.post('/auth/refresh'),
  
  me: () => api.get('/auth/me'),
};

// Subjects API
export const subjectsApi = {
  getAll: (filters?: SubjectFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.featured) params.append('featured', 'true');
    const queryString = params.toString();
    return api.get(`/subjects${queryString ? `?${queryString}` : ''}`);
  },
  
  getCategories: () => api.get('/subjects/categories'),
  
  getFeatured: () => api.get('/subjects/featured'),
  
  getBySlug: (slug: string) => api.get(`/subjects/${slug}`),
  
  getTree: (id: string) => api.get(`/subjects/${id}/tree`),
  
  getStats: (id: string) => api.get(`/subjects/${id}/stats`),
  
  enroll: (id: string) => api.post(`/subjects/${id}/enroll`),
  
  getEnrolled: () => api.get('/subjects/enrolled'),
  
  getEnrolledWithProgress: () => api.get('/subjects/enrolled/progress'),
  
  getContinueLearning: (limit: number = 5) => 
    api.get(`/subjects/continue-learning?limit=${limit}`),
};

// Videos API
export const videosApi = {
  getById: (id: string) => api.get(`/videos/${id}`),
  
  checkLock: (id: string) => api.get(`/videos/${id}/lock-status`),
};

// Progress API
export const progressApi = {
  getVideoProgress: (videoId: string) =>
    api.get(`/progress/videos/${videoId}`),
  
  updateVideoProgress: (videoId: string, data: { 
    lastPositionSeconds?: number; 
    isCompleted?: boolean;
  }) => api.post(`/progress/videos/${videoId}`, data),
  
  getSubjectProgress: (subjectId: string) =>
    api.get(`/progress/subjects/${subjectId}`),
  
  getAllProgress: () => api.get('/progress/all'),
};

// Gamification API
export const gamificationApi = {
  getProfile: () => api.get('/gamification/profile'),
  
  getAchievements: () => api.get('/gamification/achievements'),
  
  earnXP: (amount: number, reason: string) =>
    api.post('/gamification/xp/earn', { amount, reason }),
  
  completeVideo: () => api.post('/gamification/complete-video'),
};

// AI API
export const aiApi = {
  chat: (message: string, context?: { videoId?: string; subjectId?: string }) =>
    api.post('/ai/chat', { message, context }),
  
  summarize: (videoId: string) =>
    api.post('/ai/summarize', { videoId }),
  
  quiz: (videoId: string) =>
    api.post('/ai/quiz', { videoId }),
  
  explain: (concept: string, videoId?: string) =>
    api.post('/ai/explain', { concept, videoId }),
};
