import { create } from "zustand";

// Importamos los creadores de slices
import { createDrinksModalSlice, type DrinksModalSliceType } from "./drinksModalSlice";
import { createNotificationSlice, type NotificationSliceType } from "./notificationSlice";
import { createAuthSlice, type AuthSlice } from "./authSlice";

// Unificamos el tipo de la tienda
export type AppStore = AuthSlice & DrinksModalSliceType & NotificationSliceType;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createDrinksModalSlice(...a),
  ...createNotificationSlice(...a),
}));