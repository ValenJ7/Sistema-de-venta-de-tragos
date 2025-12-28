import { useEffect, useMemo, useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

function toNumberPrice(price: unknown) {
  const n = typeof price === "string" ? Number(price) : (price as number);
  return Number.isFinite(n) ? n : 0;
}

function money(n: number) {
  return n.toLocaleString("es-AR");
}

type Props = {
  drinks: any[];
  isLoading: boolean;

  query: string;
  setQuery: (v: string) => void;

  isOpen: boolean;
  setIsOpen: (v: boolean) => void;

  onPick: (drink: any) => void;
};

export function PosProductPicker({
  drinks,
  isLoading,
  query,
  setQuery,
  isOpen,
  setIsOpen,
  onPick,
}: Props) {
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return drinks.slice(0, 8);
    return drinks
      .filter((d: any) => String(d.name).toLowerCase().includes(q))
      .slice(0, 12);
  }, [drinks, query]);

  // click afuera + escape
  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = pickerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setIsOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div ref={pickerRef} className="relative">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow"
          title="Agregar"
        >
          <PlusIcon className="w-7 h-7" />
        </button>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar productos o escribe para filtrar..."
          className="w-full h-14 rounded-xl border border-orange-200 px-4 outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50/40"
        />
      </div>

      {isOpen ? (
        <div className="absolute z-20 mt-3 w-full rounded-2xl border border-orange-200 bg-white shadow-lg overflow-hidden">
          <div className="max-h-72 overflow-auto">
            {isLoading ? (
              <div className="p-4 text-sm text-gray-600">Cargando bebidas...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-600">No se encontraron productos.</div>
            ) : (
              <ul className="divide-y divide-orange-100">
                {filtered.map((d: any) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(d);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-4 hover:bg-orange-50 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-extrabold truncate">{d.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{d.category}</p>
                      </div>
                      <span className="font-black text-orange-600">
                        ${money(toNumberPrice(d.price))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-orange-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-gray-600 hover:text-black"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
