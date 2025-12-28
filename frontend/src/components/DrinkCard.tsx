import type { DrinkDTO } from "../services/drinks";
import { useAppStore } from "../store/useAppStore";

const BACKEND_ROOT = "http://localhost/ej-front-3/backend";

type Props = {
  drink: DrinkDTO;
};

export default function DrinkCard({ drink }: Props) {
  const imageUrl = drink.image_path
    ? `${BACKEND_ROOT}/${drink.image_path}`
    : "/placeholder-drink.jpg";

  const openDrinkModal = useAppStore((s) => s.openDrinkModal);

  return (
    <div className="border border-slate-200 rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={drink.name}
          className="hover:scale-125 transition-transform hover:rotate-2 w-full h-56 object-cover"
        />
      </div>

      <div className="p-5">
        <h2 className="text-2xl truncate font-black">{drink.name}</h2>
        <p className="text-slate-500 mt-1">{drink.category ?? "-"}</p>

        <button
          type="button"
          className="bg-orange-400 hover:bg-orange-600 mt-5 w-full p-3 font-bold text-white text-lg rounded-lg"
          onClick={() => openDrinkModal(drink)}
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}
