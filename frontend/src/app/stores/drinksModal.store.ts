import type { StateCreator } from "zustand";

export const createDrinksModalSlice: StateCreator<any> = (set) => ({
  modal: false,
  selectedDrink: null,

  openDrinkModal: (data: any) => {
    set({
      modal: true,
      selectedDrink: data,
    });
  },

  closeDrinkModal: () => {
    set({
      modal: false,
      selectedDrink: null,
    });
  },
});