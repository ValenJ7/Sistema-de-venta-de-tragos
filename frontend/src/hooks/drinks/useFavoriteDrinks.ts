import { useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useDrinks } from "./useDrinks";

export function useFavoriteDrinks() {
  // IDs favoritos (client state)
  const favoriteIds = useAppStore((s) => s.favoriteIds);

  // Lista completa (server state)
  const { data: drinks = [], ...query } = useDrinks();

  // Derivado: solo los que están en favoritos
  const favoriteDrinks = useMemo(() => {
    const setIds = new Set(favoriteIds);
    return drinks.filter((d) => setIds.has(d.id));
  }, [drinks, favoriteIds]);

  const hasFavorites = favoriteIds.length > 0;

  return {
    favoriteIds,
    favoriteDrinks,
    hasFavorites,
    ...query, // isLoading, isError, error, refetch, etc.
  };
}
