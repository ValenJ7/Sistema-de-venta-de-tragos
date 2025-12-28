import type { StateCreator } from "zustand";

export type UserRole = "admin" | "caja" | "user";

export type AuthUser = {
  id: number;
  username: string;
  role: UserRole;
};

const AUTH_STORAGE_KEY = "ejfront_auth";

function loadAuthFromStorage(): { user: AuthUser | null; accessToken: string | null } {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null };

    const parsed = JSON.parse(raw) as { user?: AuthUser; accessToken?: string };
    return {
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
    };
  } catch {
    return { user: null, accessToken: null };
  }
}

function saveAuthToStorage(payload: { user: AuthUser; accessToken: string }) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

function clearAuthStorage() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export type AuthSlice = {
  user: AuthUser | null;
  accessToken: string | null;

  isAuthenticated: () => boolean;

  /** Login (setea user + token) */
  setSession: (payload: { user: AuthUser; accessToken: string }) => void;

  /** Refresh: actualiza SOLO el accessToken (mantiene el user) */
  setAccessToken: (accessToken: string) => void;

  /** Logout */
  clearSession: () => void;

  /** Alias cómodo para usar desde axios interceptor */
  logout: () => void;
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => {
  const initial = loadAuthFromStorage();

  return {
    user: initial.user,
    accessToken: initial.accessToken,

    isAuthenticated: () => !!get().accessToken && !!get().user,

    setSession: ({ user, accessToken }) => {
      set({ user, accessToken });
      saveAuthToStorage({ user, accessToken });
    },

    setAccessToken: (accessToken) => {
      const currentUser = get().user;
      // Si no hay user, no tiene sentido persistir un token suelto
      if (!currentUser) {
        set({ accessToken: null });
        clearAuthStorage();
        return;
      }

      set({ accessToken });
      saveAuthToStorage({ user: currentUser, accessToken });
    },

    clearSession: () => {
      set({ user: null, accessToken: null });
      clearAuthStorage();
    },

    logout: () => {
      set({ user: null, accessToken: null });
      clearAuthStorage();
    },
  };
};
