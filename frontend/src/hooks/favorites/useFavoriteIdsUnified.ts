import { useFavorites } from "./useFavorites";
import { useAppStore } from "../../store/useAppStore";

export function useFavoriteIdsUnified() {
  const user = useAppStore((s) => s.user);
  const guestIds = useAppStore((s) => s.favoriteIds);

  const { data: userIds = [] } = useFavorites();

  return user ? userIds : guestIds;
}
