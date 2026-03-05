export function DrinksPage() {
  return (
    <>
      <h1 className="text-6xl font-extrabold pt-10 text-orange-600">Gestión de Catálogo</h1>
      <p className="text-slate-500 mt-2 font-medium">Diseño base para la administración de productos.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-10">
        {/* Formulario Estético */}
        <section className="lg:col-span-1">
          <form className="bg-slate-800 p-8 rounded-2xl shadow-xl space-y-5 text-white border border-slate-700">
            <h2 className="font-extrabold text-2xl text-center">Nuevo Producto</h2>

            <div className="space-y-4">
              <input className="p-4 w-full rounded-xl bg-slate-700 border border-slate-600 outline-none focus:border-orange-500 transition" placeholder="Nombre del producto..." />
              <input className="p-4 w-full rounded-xl bg-slate-700 border border-slate-600 outline-none focus:border-orange-500 transition" placeholder="Categoría..." />
              <input type="number" className="p-4 w-full rounded-xl bg-slate-700 border border-slate-600 outline-none focus:border-orange-500 transition" placeholder="Precio..." />
              <textarea className="p-4 w-full rounded-xl bg-slate-700 border border-slate-600 outline-none focus:border-orange-500 transition" placeholder="Descripción corta..." rows={3} />
            </div>

            <button type="button" className="bg-orange-500 hover:bg-orange-600 w-full p-4 rounded-xl font-black uppercase shadow-lg shadow-orange-900/20 transition-all mt-4">
              Guardar Cambios
            </button>
          </form>
        </section>

        {/* Listado Estético */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-xl text-slate-800">Productos Registrados</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Fila de ejemplo 1 */}
              <div className="p-6 flex items-center gap-4 hover:bg-slate-50 transition">
                <div className="w-16 h-16 bg-slate-200 rounded-xl animate-pulse" />
                <div className="flex-1">
                  <p className="font-bold text-xl text-slate-800">Producto Ejemplo</p>
                  <p className="text-slate-400 text-sm">Categoría General</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-black text-orange-600 text-lg">$0.00</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition">Editar</button>
                  <button className="p-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition">Borrar</button>
                </div>
              </div>

              {/* Fila de ejemplo 2 */}
              <div className="p-6 flex items-center gap-4 hover:bg-slate-50 transition text-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-xl" />
                <div className="flex-1 italic">Espacio para más productos...</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}