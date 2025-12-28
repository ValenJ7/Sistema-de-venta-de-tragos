import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeCash, type CloseCashDTO } from "../../services/cash";
import { shiftSalesKey } from "../sales/useShiftSales";

export function useCloseCash() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CloseCashDTO) => closeCash(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: shiftSalesKey(variables.cashierUserId) });
    },
  });
}
