import { useToggleFavorite } from "./useToggleFavorite";
import { useAppStore } from "../../store/useAppStore";

export function useToggleFavoriteUnified() {
  const user = useAppStore((s) => s.user);
  const guestToggle = useAppStore((s) => s.toggleFavorite);

  const userToggle = useToggleFavorite();

  return {
    toggle: (drinkId: number, isFavorite: boolean) => {
      if (user) {
        userToggle.mutate({ drinkId, isFavorite });
      } else {
        guestToggle(drinkId);
      }
    },
    isPending: user ? userToggle.isPending : false,
  };
}
