import { create } from 'zustand';
import { UserDto, UserProfileResponse } from '../types/users-types';
import { LoginDto } from '@/types/auth-types';
import { login, logout, status } from '@/api/services/authService';
import { getUserProfile } from '../api/services/userService';

interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  userProfile: UserProfileResponse | null;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: UserDto) => void;
  setUserProfile: (profile: UserProfileResponse) => void;
  fetchUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  userProfile: null,

  login: async (dto) => {
    const res = await login(dto);
    set({ isAuthenticated: true, user: res.data?.user });
  },

  logout: async () => {
    await logout();
    set({ isAuthenticated: false, user: null, userProfile: null });
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

  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },

  fetchUserProfile: async () => {
    try {
      const response = await getUserProfile();
      if (response?.data) {
        set({ userProfile: response.data });
      }
    } catch (e) {
      set({ userProfile: null });
      throw e;
    }
  },
}));
