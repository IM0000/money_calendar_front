import { create } from 'zustand';
import { UserDto } from '../types/users-types';
import { LoginDto } from '@/types/auth-types';
import { login, logout, status } from '@/api/services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: UserDto) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (dto) => {
    const res = await login(dto);
    set({ isAuthenticated: true, user: res.data?.user });
  },

  logout: async () => {
    const res = await logout();
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    try {
      const res = await status();
      set({ isAuthenticated: true, user: res.data?.user });
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },

  setUser: (user) => {
    set({ user });
  },
}));
