import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const UserRole = {
  admin: 'Адмін',
  director: 'Зав.аптеки',
  pharmacist: 'Фармацевт',
  senior_pharmacist: 'Старший фармацевт'
} as const;

export type UserRoleType = keyof typeof UserRole;
export type UserRoleUkrType = typeof UserRole[keyof typeof UserRole];

interface User {
  id: number;
  username: string;
  full_name: string;
  role: UserRoleType;
}

interface Session {
  id: number;
  loginAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  session: Session | null;
  isAuthenticated: boolean;
  setAuth: (data: { user: User; token: string; session: Session }) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      session: null,
      isAuthenticated: false,

      setAuth: ({ user, token, session }) =>
        set({ user, token, session, isAuthenticated: true }),

      updateUser: (user) => set({ user }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        session: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
);
