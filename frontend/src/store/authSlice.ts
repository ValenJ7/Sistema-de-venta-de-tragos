import type { StateCreator } from "zustand";

export type UserRole = "admin" | "caja" | "user";

export type AuthUser = {
  id: number;
  username: string;
  role: UserRole;
};

export type AuthSlice = {
  user: AuthUser | null;
  // Simplificamos: si hay usuario, está autenticado
  isAuthenticated: () => boolean;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
  logout: () => void;
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => ({
  // Empezamos como null para que el usuario pase por el LoginPage que limpiamos
  user: null,

  isAuthenticated: () => !!get().user,

  setSession: (user) => {
    set({ user });
  },

  clearSession: () => {
    set({ user: null });
  },

  logout: () => {
    set({ user: null });
  },
});