import { create } from "zustand";
import { createDrinksModalSlice } from "./drinksModal.store";
import { createNotificationSlice } from "./ui.store";
import { createAuthSlice } from "./auth.store";

// Usamos any para no definir estructuras de datos que van a cambiar
export const useAppStore = create<any>()((...a) => ({
  ...createAuthSlice(...a),
  ...createDrinksModalSlice(...a),
  ...createNotificationSlice(...a),
}));