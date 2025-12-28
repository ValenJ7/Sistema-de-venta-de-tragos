import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAppStore } from "../store/useAppStore";
import { useFavoriteIdsUnified } from "../hooks/favorites/useFavoriteIdsUnified";
import { useToggleFavoriteUnified } from "../hooks/favorites/useToggleFavoriteUnified";

const BACKEND_ROOT = "http://localhost/ej-front-3/backend";

export default function DrinkDetailsModal() {
  const modal = useAppStore((s) => s.modal);
  const selectedDrink = useAppStore((s) => s.selectedDrink);
  const closeDrinkModal = useAppStore((s) => s.closeDrinkModal);

  // ✅ favoritos unificados (guest o user)
  const favoriteIds = useFavoriteIdsUnified();
  const { toggle, isPending } = useToggleFavoriteUnified();

  const imageUrl = selectedDrink?.image_path
    ? `${BACKEND_ROOT}/${selectedDrink.image_path}`
    : null;

  const fav = selectedDrink ? favoriteIds.includes(selectedDrink.id) : false;

  return (
    <>
      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDrinkModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-400/65" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  {!selectedDrink ? (
                    <div className="p-6">
                      <p className="text-gray-700">No hay trago seleccionado.</p>

                      <button
                        type="button"
                        className="mt-4 w-full rounded bg-gray-600 p-3 font-bold uppercase text-white shadow hover:bg-gray-500"
                        onClick={closeDrinkModal}
                      >
                        Cerrar
                      </button>
                    </div>
                  ) : (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-gray-900 text-4xl font-extrabold my-5 text-center"
                      >
                        {selectedDrink.name}
                      </Dialog.Title>

                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={`Imagen de ${selectedDrink.name}`}
                          className="mx-auto w-96"
                        />
                      )}

                      <div className="mt-3 space-y-2 text-gray-800">
                        <p>
                          <span className="font-bold">¿Alcohólica?:</span>{" "}
                          {selectedDrink.is_alcoholic ? "Sí" : "No"}
                        </p>
                      </div>

                      <Dialog.Title
                        as="h3"
                        className="text-gray-900 text-2xl font-extrabold my-5"
                      >
                        Ingredientes
                      </Dialog.Title>

                      <p className="text-lg text-gray-800 whitespace-pre-line">
                        {selectedDrink.ingredients ?? "—"}
                      </p>

                      <Dialog.Title
                        as="h3"
                        className="text-gray-900 text-2xl font-extrabold my-5"
                      >
                        Instrucciones
                      </Dialog.Title>

                      <p className="text-lg text-gray-800 whitespace-pre-line">
                        {selectedDrink.instructions ?? "—"}
                      </p>

                      <div className="mt-5 flex justify-between gap-4">
                        <button
                          type="button"
                          className="w-full rounded bg-gray-600 p-3 font-bold uppercase text-white shadow hover:bg-gray-500"
                          onClick={closeDrinkModal}
                        >
                          Cerrar
                        </button>

                        <button
                          type="button"
                          disabled={isPending}
                          className={[
                            "w-full rounded p-3 font-bold uppercase text-white shadow",
                            fav ? "bg-slate-700 hover:bg-slate-800" : "bg-orange-500 hover:bg-orange-600",
                            isPending ? "opacity-60 cursor-not-allowed" : "",
                          ].join(" ")}
                          onClick={() => {
                            toggle(selectedDrink.id, fav);
                            closeDrinkModal();
                          }}
                        >
                          {fav ? "Eliminar favorito" : "Agregar a Favoritos"}
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
