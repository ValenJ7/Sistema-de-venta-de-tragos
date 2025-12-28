import type { StateCreator } from "zustand";
import type { NotificationSliceType } from "./notificationSlice";

const GUEST_STORAGE_KEY = "favoriteDrinkIds:guest";

function safeParseNumberArray(value: string | null): number[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => Number(x)).filter((x) => Number.isFinite(x));
  } catch {
    return [];
  }
}

export type FavoritesSlice = {
  favoriteIds: number[];

  toggleFavorite: (drinkId: number) => void;
  isFavorite: (drinkId: number) => boolean;

  hydrateFavoritesFromStorage: () => void;
  clearFavorites: () => void;
};

export const createFavoritesSlice: StateCreator<
  FavoritesSlice & NotificationSliceType,
  [],
  [],
  FavoritesSlice
> = (set, get) => ({
  // ✅ SIN get() acá
  favoriteIds: safeParseNumberArray(localStorage.getItem(GUEST_STORAGE_KEY)),

  toggleFavorite: (drinkId) => {
    const exists = get().favoriteIds.includes(drinkId);

    set((state) => {
      const next = exists
        ? state.favoriteIds.filter((id) => id !== drinkId)
        : [...state.favoriteIds, drinkId];

      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next));
      return { favoriteIds: next };
    });

    get().showNotification({
      text: exists ? "Eliminado de favoritos" : "Agregado a favoritos",
      error: false,
    });
  },

  isFavorite: (drinkId) => get().favoriteIds.includes(drinkId),

  hydrateFavoritesFromStorage: () => {
    const ids = safeParseNumberArray(localStorage.getItem(GUEST_STORAGE_KEY));
    set({ favoriteIds: ids });
  },

  clearFavorites: () => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    set({ favoriteIds: [] });

    get().showNotification({
      text: "Favoritos limpiados",
      error: false,
    });
  },
});
