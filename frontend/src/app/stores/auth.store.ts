import type { StateCreator } from "zustand";

export const createAuthSlice: StateCreator<any> = (set) => ({
  user: null,

  setSession: (userData: any) => {
    set({ user: userData });
  },

  clearSession: () => {
    set({ user: null });
  },

  logout: () => {
    set({ user: null });
  },
});