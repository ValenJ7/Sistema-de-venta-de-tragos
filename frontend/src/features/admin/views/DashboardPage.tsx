import { Link } from "react-router-dom";
import { ShoppingCartIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"

export function DashboardPage() {
  return (
    <section className="space-y-6 pt-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Dashboard Multi-Caja</h1>
          <p className="text-sm text-slate-500">
            Vista general del estado de las cajas y ventas del día.
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
                0
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
                $0.00
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de Cajas (Estaticas para ver el diseño) */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {/* Tarjeta de Ejemplo 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black tracking-tight text-slate-900">
              Usuario de Ejemplo
            </div>

            <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase shadow-sm bg-emerald-100 text-emerald-700 border border-emerald-200">
              ABIERTA
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-orange-300 bg-orange-50 p-5">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                0
              </div>
              <div className="mt-2 text-sm text-slate-600">
                0 ventas
              </div>
            </div>

            <div className="rounded-2xl border border-orange-300 bg-orange-50 p-5">
              <div className="text-2xl font-black tracking-tight text-slate-900">
                $0.00
              </div>
            </div>
          </div>

          <Link
            to="/admin/dashboard"
            className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none active:scale-[0.99]"
          >
            Ver detalles del turno
          </Link>
        </div>

        {/* Tarjeta de Ejemplo 2 (Cerrada) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg overflow-hidden opacity-60">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black tracking-tight text-slate-900">
              Caja Inactiva
            </div>

            <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase shadow-sm bg-slate-100 text-slate-700 border border-slate-200">
              CERRADA
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-3xl font-black tracking-tight text-slate-400">
                -
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-2xl font-black tracking-tight text-slate-400">
                $0.00
              </div>
            </div>
          </div>

          <div className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-slate-200 py-3 text-base font-extrabold text-slate-400 cursor-not-allowed">
            Turno Finalizado
          </div>
        </div>
      </div>
    </section>
  );
}