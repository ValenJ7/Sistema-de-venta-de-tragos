export type PrintTicketItem = {
  qty: number;
  name: string;
  unitPrice: number;
  lineTotal: number;
};

export type PrintTicketSale = {
  id?: number;
  createdAt?: string;
  cashier?: { id: number; username?: string };
  items: PrintTicketItem[];
  total: number;
};

export async function printTicket(sale: PrintTicketSale) {
  const res = await fetch("http://localhost:3333/print-ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sale }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error imprimiendo ticket");
  }

  // el servicio puede devolver JSON o nada, no nos importa mucho
  return res.json().catch(() => ({}));
}
