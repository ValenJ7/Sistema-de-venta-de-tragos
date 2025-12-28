import { useQuery } from "@tanstack/react-query";
import { getShiftSales, type TodaySalesResponse } from "../../services/sales";

export const shiftSalesKey = (cashierUserId: number) =>
  ["shift-sales", cashierUserId] as const;

export function useShiftSales(cashierUserId?: number) {
  return useQuery<TodaySalesResponse>({
    queryKey: cashierUserId ? shiftSalesKey(cashierUserId) : ["shift-sales", "missing"] as const,
    queryFn: () => {
      if (!cashierUserId) {
        throw new Error("cashierUserId is required");
      }
      return getShiftSales(cashierUserId);
    },
    enabled: !!cashierUserId,
  });
}
