export function PosCart({ cart, onInc, onDec, onConfirm, isConfirming }: any) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-black">Carrito Actual</h2>

      <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/30 p-4 min-h-[140px]">
        {/* Fila Estética 1 */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white border border-orange-100 p-3 mb-3">
          <div className="min-w-0">
            <p className="font-extrabold truncate">Producto Ejemplo</p>
            <p className="text-xs text-gray-500 mt-1">$0.00 c/u</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDec}
              className="w-9 h-9 rounded-xl border border-orange-200 font-black hover:bg-orange-50"
            >
              -
            </button>
            <span className="w-10 text-center font-black">
              {cart.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1}
            </span>
            <button
              onClick={onInc}
              className="w-9 h-9 rounded-xl border border-orange-200 font-black hover:bg-orange-50"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="font-black">$0.00</p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm italic mt-4">
          Espacio para más productos...
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xl font-black">Total:</p>
        <p className="text-3xl font-black text-orange-500">$0.00</p>
      </div>

      <button
        type="button"
        disabled={isConfirming}
        onClick={onConfirm}
        className="mt-6 w-full h-14 rounded-xl bg-orange-400 text-white font-black text-lg shadow disabled:opacity-50"
      >
        {isConfirming ? "Confirmando..." : "Confirmar Venta"}
      </button>
    </div>
  );
}