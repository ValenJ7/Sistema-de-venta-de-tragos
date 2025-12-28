import { useAdminOverview } from "../hooks/admin/useAdminOverview";
import { Link } from "react-router-dom";
import { ShoppingCartIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"


function formatMoney(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminOverview();


  if (isLoading) return <div>Cargando dashboard...</div>;
  if (isError || !data) return <div>Error cargando dashboard</div>;

  return (
    <section className="space-y-6 pt-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Dashboard Multi-Caja</h1>
          <p className="text-sm text-muted-foreground">
            Ventas del día y estado por caja (actualiza cada 5s).
          </p>
        </div>

       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Total ventas */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm overflow-hidden">
            <div className="grid h-9 w-9 place-items-center">
              <ShoppingCartIcon className="h-6 w-6 text-orange-500" />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-medium text-slate-600">Total ventas</div>
              <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                {data.dayTotals.salesCount}
              </div>
            </div>
          </div>

          {/* Total general */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm overflow-hidden">
            <div className="grid h-9 w-9 place-items-center">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-500" />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-medium text-slate-600">Total general</div>
              <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                {formatMoney(data.dayTotals.totalAmount)}
              </div>
            </div>
          </div>
        </div>

      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {data.cashiers.map((c) => (
          <div
            key={c.cashier.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-black tracking-tight text-slate-900">
                {c.cashier.username}
              </div>

              <span
                className={[
                  "rounded-full px-3 py-1 text-[11px] font-bold uppercase shadow-sm",
                  c.status === "open"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200",
                ].join(" ")}
              >
                {c.status === "open" ? "ABIERTA" : "CERRADA"}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-orange-300 bg-orange-50 p-5">
                <div className="text-3xl font-black tracking-tight text-slate-900">
                  {c.shift.salesCount}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {c.shift.salesCount} ventas
                </div>
              </div>

              <div className="rounded-2xl border border-orange-300 bg-orange-50 p-5">
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  {formatMoney(c.shift.totalAmount)}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              to={`/admin/caja/${c.cashier.id}`}
              className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              Ver turno
            </Link>
          </div>
        ))}
      </div>


    </section>
  );
}
