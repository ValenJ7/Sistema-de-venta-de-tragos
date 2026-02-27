import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const MOCK_SHIFT_DATA = {
  sales: [
    { id: 1, total: 15000, createdAt: "2024-05-20 22:30", items: [{ name: "Fernet", qty: 2, lineTotal: 10000 }, { name: "Cerveza", qty: 1, lineTotal: 5000 }] },
    { id: 2, total: 4500, createdAt: "2024-05-20 23:15", items: [{ name: "Mojito", qty: 1, lineTotal: 4500 }] }
  ]
};

function formatMoney(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

export function AdminCashierShiftPage() {
  const params = useParams();
  const cashierUserId = Number(params.cashierUserId);
  const data = MOCK_SHIFT_DATA;

  const totals = useMemo(() => {
    const sales = data.sales;
    const salesCount = sales.length;
    const totalAmount = sales.reduce((acc, s) => acc + s.total, 0);
    const itemsCount = sales.reduce((acc, s) => acc + s.items.reduce((a, it) => a + it.qty, 0), 0);
    return { salesCount, totalAmount, itemsCount };
  }, [data]);

  return (
    <section className="space-y-6 pt-10">
      <header className="text-center">
        <h1 className="text-3xl font-black">Turno detallado (Demo)</h1>
        <p className="text-sm text-gray-600">Caja ID: <span className="font-black text-black">{cashierUserId}</span></p>
        <div className="mt-4">
          <div className="text-3xl font-black text-orange-600">{formatMoney(totals.totalAmount)}</div>
          <div className="text-sm text-gray-600">{totals.salesCount} ventas realizadas</div>
        </div>
      </header>

      <div className="rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-orange-100">
          {data.sales.map((sale) => (
            <div key={sale.id} className="p-4">
              <div className="flex justify-between font-black">
                <span>Venta #{sale.id}</span>
                <span className="text-orange-600">{formatMoney(sale.total)}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {sale.items.map((it, idx) => (
                  <div key={idx}>x{it.qty} {it.name} - {formatMoney(it.lineTotal)}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link to="/admin/dashboard" className="w-full h-12 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center">Volver</Link>
    </section>
  );
}