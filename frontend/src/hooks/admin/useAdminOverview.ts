import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "../../services/admin";

export const adminOverviewKey = ["admin-overview"] as const;

export function useAdminOverview() {
  return useQuery({
    queryKey: adminOverviewKey,
    queryFn: getAdminOverview,
    refetchInterval: 1000, // refresca cada 5s (opcional)
  });
}
