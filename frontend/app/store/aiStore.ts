import { create } from 'zustand';
import { aiApi } from '@lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AIState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  
  // Actions
  sendMessage: (message: string, context?: { videoId?: string; subjectId?: string }) => Promise<void>;
  summarizeVideo: (videoId: string) => Promise<string>;
  generateQuiz: (videoId: string) => Promise<QuizQuestion[]>;
  explainConcept: (concept: string, videoId?: string) => Promise<string>;
  togglePanel: () => void;
  setIsOpen: (isOpen: boolean) => void;
  clearMessages: () => void;
  clearError: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  isOpen: false,

  sendMessage: async (message: string, context) => {
    set({ isLoading: true, error: null });
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, userMessage]
    }));

    try {
      const response = await aiApi.chat(message, context);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        suggestions: response.data.suggestions,
      };
      
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to get response', 
        isLoading: false 
      });
    }
  },

  summarizeVideo: async (videoId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiApi.summarize(videoId);
      set({ isLoading: false });
      return response.data.summary;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to generate summary', 
        isLoading: false 
      });
      throw error;
    }
  },

  generateQuiz: async (videoId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiApi.quiz(videoId);
      set({ isLoading: false });
      return response.data.questions;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to generate quiz', 
        isLoading: false 
      });
      throw error;
    }
  },

  explainConcept: async (concept: string, videoId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiApi.explain(concept, videoId);
      set({ isLoading: false });
      return response.data.explanation;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to get explanation', 
        isLoading: false 
      });
      throw error;
    }
  },

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  clearMessages: () => set({ messages: [] }),
  clearError: () => set({ error: null }),
}));
