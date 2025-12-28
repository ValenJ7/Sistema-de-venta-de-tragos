import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useShiftSales } from "../hooks/sales/useShiftSales";

function formatMoney(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

export function AdminCashierShiftPage() {
  const params = useParams();
  const cashierUserId = Number(params.cashierUserId);

  const { data, isLoading, isError } = useShiftSales(cashierUserId);

  const totals = useMemo(() => {
    const sales = data?.sales ?? [];
    const salesCount = sales.length;
    const totalAmount = sales.reduce((acc, s) => acc + (s.total ?? 0), 0);
    const itemsCount = sales.reduce(
      (acc, s) => acc + (s.items?.reduce((a, it) => a + (it.qty ?? 0), 0) ?? 0),
      0
    );
    return { salesCount, totalAmount, itemsCount };
  }, [data]);

  if (!Number.isFinite(cashierUserId) || cashierUserId <= 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-black text-center">Turno detallado</h1>
        <p className="text-sm text-gray-600 text-center">ID de caja inválido.</p>
        <Link
          className="mx-auto inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 font-bold text-white hover:bg-slate-700 transition"
          to="/admin/dashboard"
        >
          Volver
        </Link>
      </section>
    );
  }

  if (isLoading) return <div className="p-6 text-sm text-gray-600 text-center">Cargando turno...</div>;
  if (isError || !data) return <div className="p-6 text-sm text-gray-600 text-center">Error cargando turno</div>;

  return (
    <section className="space-y-6 pt-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-center">Turno detallado</h1>

        <p className="text-sm text-gray-600 text-center">
          Caja ID: <span className="font-black text-black">{cashierUserId}</span>
        </p>

        <div className="text-center">
          <div className="text-sm text-gray-600">Total turno</div>
          <div className="mt-1 text-3xl font-black text-orange-600">
            {formatMoney(totals.totalAmount)}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {totals.salesCount} ventas · {totals.itemsCount} items
          </div>
        </div>
      </header>

      <div className="flex gap-3">
        <Link
          to="/admin/dashboard"
          className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-base shadow flex items-center justify-center transition active:scale-[0.99]"
        >
          Volver al Dashboard
        </Link>
      </div>

      {/* Lista de ventas */}
        <div className="rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden">
          <div className="max-h-[62vh] overflow-y-auto">
            {data.sales.length === 0 ? (
              <div className="p-4 text-sm text-gray-600 text-center">
                No hay ventas en este turno.
              </div>
            ) : (
              <div className="divide-y divide-orange-600">
                {data.sales.map((sale) => (
                  <div key={sale.id} className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-black text-gray-900">Venta</div>
                        <div className="text-[11px] text-gray-500">{sale.createdAt}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-gray-500">Total</div>
                        <div className="font-black text-xl sm:text-2xl text-orange-600 leading-none">
                          {formatMoney(sale.total)}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-2 divide-y divide-orange-100/70">
                      {sale.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="py-2 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-black shrink-0 text-gray-900">
                              x{it.qty}
                            </span>
                            <span className="truncate font-semibold text-gray-800">
                              {it.name}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-bold text-gray-900">
                              {formatMoney(it.lineTotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

    </section>
  );
}
