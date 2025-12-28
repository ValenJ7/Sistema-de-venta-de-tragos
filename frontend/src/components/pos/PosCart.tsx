import { useMemo } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

function money(n: number) {
  return n.toLocaleString("es-AR");
}

type Props = {
  cart: CartItem[];
  onInc: (id: number) => void;
  onDec: (id: number) => void;
  onConfirm: () => void;
  isConfirming: boolean;
};

export function PosCart({ cart, onInc, onDec, onConfirm, isConfirming }: Props) {
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-black">Carrito Actual</h2>

      <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/30 p-4 min-h-[140px]">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 italic mt-10">
            No hay productos en el carrito
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-white border border-orange-100 p-3"
              >
                <div className="min-w-0">
                  <p className="font-extrabold truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">${money(item.price)} c/u</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDec(item.id)}
                    className="w-9 h-9 rounded-xl border border-orange-200 font-black hover:bg-orange-50"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => onInc(item.id)}
                    className="w-9 h-9 rounded-xl border border-orange-200 font-black hover:bg-orange-50"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-black">${money(item.price * item.qty)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xl font-black">Total:</p>
        <p className="text-3xl font-black text-orange-500">${money(total)}</p>
      </div>

      <button
        type="button"
        disabled={cart.length === 0 || isConfirming}
        onClick={onConfirm}
        className="mt-6 w-full h-14 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-black text-lg shadow disabled:opacity-60 disabled:hover:bg-orange-400"
      >
        {isConfirming ? "Confirmando..." : "Confirmar Venta"}
      </button>
    </div>
  );
}
