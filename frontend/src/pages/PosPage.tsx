import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

import { useDrinks } from "../hooks/drinks/useDrinks";
import { useAppStore } from "../store/useAppStore";

import { useShiftSales } from "../hooks/sales/useShiftSales";
import { useCreateSale } from "../hooks/sales/useCreateSale";
import { useCloseCash } from "../hooks/cash/useCloseCash";

import { PosProductPicker } from "../components/pos/PosProductPicker";
import { PosCart, type CartItem } from "../components/pos/PosCart";
import { PosNightSales } from "../components/pos/PosNightSales";

import { printTicket } from "../services/print";

function toNumberPrice(price: unknown) {
  const n = typeof price === "string" ? Number(price) : (price as number);
  return Number.isFinite(n) ? n : 0;
}

export function PosPage() {
  const user = useAppStore((s) => s.user);

  // 🔹 Server state
  const { data: drinks = [], isLoading: isDrinksLoading } = useDrinks();
  const { data: shiftData, isLoading: isSalesLoading } = useShiftSales(user?.id);
  const sales = shiftData?.sales ?? [];

  const createSaleMutation = useCreateSale();
  const closeCashMutation = useCloseCash();

  // 🔹 UI state
  const [query, setQuery] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(drink: any) {
    const id = Number(drink.id);
    const name = String(drink.name);
    const price = toNumberPrice(drink.price);

    setCart((prev) => {
      const existing = prev.find((x) => x.id === id);
      if (existing) {
        return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, { id, name, price, qty: 1 }];
    });
  }

  function inc(id: number) {
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  }

  function dec(id: number) {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  // 🔹 Confirmar venta → backend + imprimir ticket
  function confirmSale() {
    if (!user) return;
    if (cart.length === 0) return;

    // armamos items del ticket con el carrito actual (antes de limpiarlo)
    const ticketItems = cart.map((i) => ({
      qty: i.qty,
      name: i.name,
      unitPrice: i.price,
      lineTotal: i.qty * i.price,
    }));

    const ticketTotal = ticketItems.reduce((acc, it) => acc + it.lineTotal, 0);

    createSaleMutation.mutate(
      {
        cashierUserId: user.id,
        items: cart.map((i) => ({
          drinkId: i.id,
          name: i.name,
          qty: i.qty,
          priceAtSale: i.price,
        })),
      },
      {
        onSuccess: async (created: any) => {
          try {
            await printTicket({
              id: created?.id ?? created?.saleId,
              createdAt: created?.createdAt,
              cashier: { id: user.id, username: user.username },
              items: ticketItems,
              total: created?.total ?? ticketTotal,
            });

            useAppStore.getState().showNotification({
              text: "Venta confirmada e impresa ✅",
              error: false,
            });
          } catch (e) {
            console.error(e);
            useAppStore.getState().showNotification({
              text: "Venta guardada, pero falló la impresión ⚠️",
              error: true,
            });
          } finally {
            clearCart();
          }
        },
        onError: () => {
          useAppStore.getState().showNotification({
            text: "No se pudo confirmar la venta ❌",
            error: true,
          });
        },
      }
    );
  }

  // 🔹 Cerrar caja → backend
  function handleCloseCash() {
    if (!user) return;
    closeCashMutation.mutate({ cashierUserId: user.id });
  }

  return (
    <section className="p-10 min-h-[70vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3">
            <PlusIcon className="w-7 h-7 text-orange-500" />
            <h1 className="text-3xl font-black">Nueva Venta</h1>
          </div>

          <div className="mt-6 rounded-2xl border border-orange-200 bg-white shadow-sm">
            <div className="p-6">
              <PosProductPicker
                drinks={drinks}
                isLoading={isDrinksLoading}
                query={query}
                setQuery={setQuery}
                isOpen={isPickerOpen}
                setIsOpen={setIsPickerOpen}
                onPick={addToCart}
              />

              <div className="mt-6 border-t border-orange-100" />

              <PosCart
                cart={cart}
                onInc={inc}
                onDec={dec}
                onConfirm={confirmSale}
                isConfirming={createSaleMutation.isPending}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <PosNightSales
          sales={sales}
          isLoading={isSalesLoading}
          isClosing={closeCashMutation.isPending}
          onCloseCash={handleCloseCash}
        />
      </div>
    </section>
  );
}
