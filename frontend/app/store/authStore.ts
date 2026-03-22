import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          const { user, accessToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register({ email, password, name });
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          localStorage.removeItem('accessToken');
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      fetchUser: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          const response = await authApi.me();
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          localStorage.removeItem('accessToken');
          set({ user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
