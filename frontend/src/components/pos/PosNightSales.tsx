import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { SaleDTO } from "../../services/sales";

function money(n: number) {
  return n.toLocaleString("es-AR");
}

type Props = {
  sales: SaleDTO[];
  isLoading: boolean;
  onCloseCash: () => void;
  isClosing?: boolean;
};

export function PosNightSales({
  sales,
  isLoading,
  onCloseCash,
  isClosing = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const canClose = sales.length > 0 && !isClosing;

  function handleAskClose() {
    if (!canClose) return;
    setOpen(true);
  }

  function handleConfirm() {
    setOpen(false);
    onCloseCash();
  }

  return (
    <div>
      <h2 className="text-3xl font-black text-center">Ventas de la Noche</h2>

      <div className="mt-6 rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden">
        <div className="max-h-[62vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-gray-600 text-center">
              Cargando ventas...
            </div>
          ) : sales.length === 0 ? (
            <div className="p-6 text-sm text-gray-600 text-center">
              Todavía no hay ventas.
            </div>
          ) : (
            <ul className="divide-y divide-orange-100">
              {sales.map((s) => (
                <li key={s.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Lista de items */}
                    <div className="min-w-0">
                      {s.items?.length ? (
                        <div className="space-y-1">
                          {s.items.map((it) => (
                            <p
                              key={`${s.id}-${it.drinkId}`}
                              className="font-semibold text-gray-800 truncate"
                            >
                              x{it.qty} {it.name}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="font-semibold text-gray-800 truncate">
                          Venta #{s.id}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <span className="shrink-0 text-orange-600 font-black text-2xl leading-none">
                      ${money(s.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5 border-t border-orange-100 bg-white">
          <button
            type="button"
            disabled={!canClose}
            onClick={handleAskClose}
            className="w-full h-14 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow flex items-center justify-center gap-3 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
          >
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full border-2 border-white">
              ×
            </span>
            {isClosing ? "Cerrando caja..." : "Cerrar Caja"}
          </button>

          <p className="mt-3 text-xs text-gray-500 text-center">
            * Cierra el turno actual y reinicia las ventas.
          </p>

          {sales.length === 0 && (
            <p className="mt-2 text-xs text-gray-400 text-center">
              No hay ventas para cerrar el turno.
            </p>
          )}
        </div>
      </div>

      {/* Modal confirmación */}
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95 translate-y-1"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-1"
              >
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                  <Dialog.Title className="text-lg font-black text-slate-900">
                    ¿Cerrar caja?
                  </Dialog.Title>

                  <p className="mt-2 text-sm text-slate-600">
                    Esta acción cierra el turno actual y reinicia las ventas. ¿Estás seguro?
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 h-11 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition"
                      disabled={isClosing}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black transition disabled:opacity-60"
                      disabled={isClosing}
                    >
                      Sí, cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
