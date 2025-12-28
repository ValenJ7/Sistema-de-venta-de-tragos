import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../services/favorites";
import { useAppStore } from "../../store/useAppStore";

export const favoritesKey = (userId?: number) => ["favorites", userId ?? "guest"];

export function useFavorites() {
  const accessToken = useAppStore((s) => s.accessToken);
  const user = useAppStore((s) => s.user);

  return useQuery({
    queryKey: favoritesKey(user?.id),
    enabled: !!accessToken && !!user?.id,
    queryFn: async () => {
      const res = await getFavorites(accessToken!);
      return res.favoriteIds;
    },
    placeholderData: [] as number[], // ✅ en vez de initialData
    staleTime: 1000 * 30,
  });
}
