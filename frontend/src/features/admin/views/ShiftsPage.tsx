import { Link, useParams } from "react-router-dom";

export function ShiftsPage() {
  const params = useParams();
  const cashierUserId = params.cashierUserId; // Solo para mostrarlo en el texto

  return (
    <section className="space-y-6 pt-10">
      <header className="text-center">
        <h1 className="text-3xl font-black">Turno detallado</h1>
        <p className="text-sm text-gray-600">
          Caja ID: <span className="font-black text-black">{cashierUserId || "0"}</span>
        </p>

        <div className="mt-4">
          <div className="text-3xl font-black text-orange-600">$0.00</div>
          <div className="text-sm text-gray-600">0 ventas realizadas</div>
        </div>
      </header>

      <div className="rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-orange-100">
          {/* Fila Estética de Ejemplo */}
          <div className="p-4">
            <div className="flex justify-between font-black">
              <span>Venta #000</span>
              <span className="text-orange-600">$0.00</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>x0 Producto de ejemplo - $0.00</div>
            </div>
          </div>

          {/* Espacio vacío estético */}
          <div className="p-10 text-center text-slate-300 italic text-sm">
            Sin ventas registradas en este turno
          </div>
        </div>
      </div>

      <Link
        to="/admin/dashboard"
        className="w-full h-12 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center transition hover:bg-slate-700"
      >
        Volver al Dashboard
      </Link>
    </section>
  );
}