import api from "./api";

export type AdminOverview = {
  now: string;
  dayStart: string;
  dayTotals: { salesCount: number; totalAmount: number };
  cashiers: Array<{
    cashier: { id: number; username: string };
    status: "open" | "closed";
    range: { from: string; to: string; lastCloseTo: string | null };
    shift: { salesCount: number; totalAmount: number; lastSaleAt: string | null };
    day: { salesCount: number; totalAmount: number };
  }>;
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const { data } = await api.get("/admin/overview.php");
  return data;
}
