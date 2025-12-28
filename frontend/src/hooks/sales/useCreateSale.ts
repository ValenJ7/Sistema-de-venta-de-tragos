import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale, type CreateSaleDTO } from "../../services/sales";
import { shiftSalesKey } from "./useShiftSales";

export function useCreateSale() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSaleDTO) => createSale(payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: shiftSalesKey(vars.cashierUserId) });
    },
  });
}
