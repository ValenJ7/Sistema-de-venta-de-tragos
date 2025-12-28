import type { StateCreator } from "zustand";
import type { DrinkDTO } from "../services/drinks";

export type DrinksModalSliceType = {
  modal: boolean;
  selectedDrink: DrinkDTO | null;
  openDrinkModal: (drink: DrinkDTO) => void;
  closeDrinkModal: () => void;
};

export const createDrinksModalSlice: StateCreator<
  DrinksModalSliceType,
  [],
  [],
  DrinksModalSliceType
> = (set) => ({
  modal: false,
  selectedDrink: null,

  openDrinkModal: (drink) => {
    set({
      modal: true,
      selectedDrink: drink,
    });
  },

  closeDrinkModal: () => {
    set({
      modal: false,
      selectedDrink: null,
    });
  },
});
