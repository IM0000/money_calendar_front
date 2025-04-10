import { create } from 'zustand';
import { UserDto } from '../types/users-types';
import apiClient from '../api/client';

interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  token: string | null;
  login: (user: UserDto, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
  setUser: (user: UserDto) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('accessToken'),
  login: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ isAuthenticated: true, user, token });
  },
  logout: () => {
    localStorage.removeItem('accessToken'); // 로컬 스토리지의 토큰 제거
    set({ isAuthenticated: false, user: null, token: null });
  },
  setUser: (user) => {
    set((state) => ({
      ...state,
      user,
    }));
  },
  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }

    try {
      const response = await apiClient.get('/api/v1/auth/status', {
        headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 추가
      });

      set({
        isAuthenticated: response.data.data.isAuthenticated,
        user: response.data.data.user,
        token,
      });
    } catch {
      localStorage.removeItem('accessToken'); // 인증 실패 시 토큰 제거
      set({ isAuthenticated: false, user: null, token: null });
    }
  },
}));
