import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "../../services/favorites";
import { favoritesKey } from "./useFavorites";
import { useAppStore } from "../../store/useAppStore";

type ToggleArgs = { drinkId: number; isFavorite: boolean };

export function useToggleFavorite() {
  const qc = useQueryClient();
  const accessToken = useAppStore((s) => s.accessToken);
  const user = useAppStore((s) => s.user);
  const showNotification = useAppStore((s) => s.showNotification);

  return useMutation({
    mutationFn: async ({ drinkId, isFavorite }: ToggleArgs) => {
      if (!accessToken || !user?.id) throw new Error("No autenticado");
      if (isFavorite) await removeFavorite(accessToken, drinkId);
      else await addFavorite(accessToken, drinkId);
    },

    onMutate: async ({ drinkId, isFavorite }) => {
      const key = favoritesKey(user?.id);
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<number[]>(key) ?? [];
      const next = isFavorite ? prev.filter((id) => id !== drinkId) : [...prev, drinkId];

      qc.setQueryData<number[]>(key, next);
      return { prev, key, isFavorite };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.key) qc.setQueryData<number[]>(ctx.key, ctx.prev);
      showNotification({
        text: err instanceof Error ? err.message : "Error en favoritos",
        error: true,
      });
    },

    onSuccess: (_data, vars) => {
      showNotification({
        text: vars.isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
        error: false,
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: favoritesKey(user?.id) });
    },
  });
}
