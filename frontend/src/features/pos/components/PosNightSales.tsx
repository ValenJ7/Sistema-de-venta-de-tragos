import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export function PosNightSales() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h2 className="text-3xl font-black text-center mb-6">Ventas de la Noche</h2>
      <div className="rounded-2xl border border-orange-200 bg-white shadow-sm min-h-[400px]">
        
        <ul className="divide-y divide-orange-100">
          {/* Venta Estética 1 */}
          <li className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-gray-700">x2 Trago de Ejemplo</p>
              <p className="text-xs text-gray-400">Hora: 00:00</p>
            </div>
            <span className="text-2xl font-black text-orange-600">$0.00</span>
          </li>
        </ul>

        <div className="p-5 border-t">
          <button 
            onClick={() => setOpen(true)}
            className="w-full bg-red-600 text-white font-black py-4 rounded-xl"
          >
            Cerrar Caja
          </button>
        </div>
      </div>

      {/* Modal de Confirmación (Solo Estético) */}
      <Transition show={open} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-8 rounded-2xl max-w-sm w-full">
              <Dialog.Title className="text-xl font-bold">¿Cerrar turno?</Dialog.Title>
              <div className="mt-6 flex gap-4">
                <button onClick={() => setOpen(false)} className="flex-1 font-bold text-gray-500">No</button>
                <button onClick={() => setOpen(false)} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold">Sí, Cerrar</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}