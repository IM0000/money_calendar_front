import { create } from 'zustand';
import { UserDto } from '../types/UsersTypes';

interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  login: (user: UserDto, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('token'); // 로컬 스토리지의 토큰 제거
    set({ isAuthenticated: false, user: null });
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
