import { PlusIcon } from "@heroicons/react/24/solid";
import { PosProductPicker } from "../components/PosProductPicker";
import { PosCart } from "../components/PosCart";
import { PosNightSales } from "../components/PosNightSales";

export function PosPage() {
  return (
    <section className="p-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* SECCIÓN IZQUIERDA: VENTA */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-black text-slate-800">Nueva Venta</h1>
          </div>

          <div className="border border-slate-200 p-8 bg-white rounded-3xl shadow-sm space-y-8">
            {/* Selector de productos (Vacío) */}
            <PosProductPicker />

            <div className="h-px bg-slate-100 w-full" />

            {/* Carrito (Vacío) */}
            <PosCart
              cart={[]}
              onInc={() => { }}
              onDec={() => { }}
              onConfirm={() => { }}
              isConfirming={false}
            />
          </div>
        </div>

        {/* SECCIÓN DERECHA: HISTORIAL */}
        <div className="space-y-6">
          <PosNightSales
          />
        </div>

      </div>
    </section>
  );
}