import api from "./api";

export type CloseCashDTO = {
  cashierUserId: number;
};

export type CashClosingDTO = {
  id: number;
  cashierUserId: number;
  from: string;
  to: string;
  salesCount: number;
  totalAmount: number;
};

export async function closeCash(payload: CloseCashDTO) {
  const { data } = await api.post("/cash/close.php", payload);
  return data as CashClosingDTO;
}
