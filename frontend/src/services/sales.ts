import api from "./api";

export type CreateSaleItemDTO = {
  drinkId: number;
  name: string;
  qty: number;
  priceAtSale: number;
};

export type CreateSaleDTO = {
  cashierUserId: number;
  items: CreateSaleItemDTO[];
};

export type SaleDTO = {
  id: number;
  createdAt: string; // viene de DB (DATETIME)
  cashierUserId: number;
  total: number;
  status: "completed" | "void";
  items: Array<{
    drinkId: number;
    name: string;
    qty: number;
    priceAtSale: number;
    lineTotal: number;
  }>;
};

export type TodaySalesResponse = {
  from: string;
  to: string;
  sales: SaleDTO[];
};

export type ShiftSaleItem = {
  drinkId: number;
  name: string;
  qty: number;
  priceAtSale: number;
  lineTotal: number;
};

export type ShiftSale = {
  id: number;
  createdAt: string;
  cashierUserId: number;
  total: number;
  status: string;
  items: ShiftSaleItem[];
};

export type ShiftSalesResponse = {
  from: string;
  to: string;
  sales: ShiftSale[];
};

export async function createSale(payload: CreateSaleDTO) {
  const { data } = await api.post("/sales/create.php", payload);
  return data as { id: number; createdAt: string; cashierUserId: number; total: number };
}


export async function getShiftSales(cashierUserId: number) {
  const { data } = await api.get("/sales/shift.php", {
    params: { cashierUserId },
  });
  return data; 
}
