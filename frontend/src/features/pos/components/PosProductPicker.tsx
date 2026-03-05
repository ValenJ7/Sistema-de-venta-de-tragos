import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

export function PosProductPicker() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow"
        >
          <PlusIcon className="w-7 h-7" />
        </button>

        <input
          placeholder="Buscar productos..."
          className="w-full h-14 rounded-xl border border-orange-200 px-4 outline-none bg-orange-50/40"
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-3 w-full rounded-2xl border border-orange-200 bg-white shadow-lg overflow-hidden">
          <ul className="divide-y divide-orange-100">
            <li>
              <button
                type="button"
                className="w-full text-left p-4 hover:bg-orange-50 flex items-start justify-between gap-4"
                onClick={() => setIsOpen(false)}
              >
                <div className="min-w-0">
                  <p className="font-extrabold truncate">Producto de Muestra</p>
                  <p className="text-xs text-gray-500 mt-1">Categoría</p>
                </div>
                <span className="font-black text-orange-600">$0.00</span>
              </button>
            </li>
          </ul>

          <div className="p-3 border-t border-orange-100 flex justify-end">
            <button onClick={() => setIsOpen(false)} className="text-sm font-bold text-gray-600">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}