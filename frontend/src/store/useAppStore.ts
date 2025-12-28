import { create } from "zustand";

import type { DrinksModalSliceType } from "./drinksModalSlice";
import { createDrinksModalSlice } from "./drinksModalSlice";

import type { FavoritesSlice } from "./favoritesSlice";
import { createFavoritesSlice } from "./favoritesSlice";

import type { NotificationSliceType } from "./notificationSlice";
import { createNotificationSlice } from "./notificationSlice";
import { createAuthSlice, type AuthSlice } from "./authSlice";


export type AppStore = AuthSlice & DrinksModalSliceType & FavoritesSlice & NotificationSliceType;


export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createDrinksModalSlice(...a),
  ...createFavoritesSlice(...a),
  ...createNotificationSlice(...a),
}));
