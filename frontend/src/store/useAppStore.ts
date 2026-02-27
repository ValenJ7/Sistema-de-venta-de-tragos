import { create } from "zustand";

// Importamos los creadores de slices
import { createDrinksModalSlice, type DrinksModalSliceType } from "./drinksModalSlice";
import { createFavoritesSlice, type FavoritesSlice } from "./favoritesSlice";
import { createNotificationSlice, type NotificationSliceType } from "./notificationSlice";
import { createAuthSlice, type AuthSlice } from "./authSlice";

// Unificamos el tipo de la tienda
export type AppStore = AuthSlice & DrinksModalSliceType & FavoritesSlice & NotificationSliceType;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createDrinksModalSlice(...a),
  ...createFavoritesSlice(...a),
  ...createNotificationSlice(...a),
}));