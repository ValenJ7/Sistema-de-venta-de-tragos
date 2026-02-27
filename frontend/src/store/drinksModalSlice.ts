import type { StateCreator } from "zustand";

// Definimos el tipo aquí para romper la dependencia con el backend
export type Drink = {
  id: number;
  name: string;
  category?: string;
  image_path?: string;
  price?: number;
  description?: string;
};

export type DrinksModalSliceType = {
  modal: boolean;
  selectedDrink: Drink | null;
  openDrinkModal: (drink: Drink) => void;
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