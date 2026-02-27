import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useAppStore } from "../store/useAppStore";
import { PosProductPicker } from "../components/pos/PosProductPicker";
import { PosCart, type CartItem } from "../components/pos/PosCart";
import { PosNightSales } from "../components/pos/PosNightSales";

const MOCK_DRINKS = [
  { id: 1, name: "Mojito", price: 4500 },
  { id: 2, name: "Fernet", price: 5000 },
];

export function PosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<any[]>([]); // Historial de ventas local

  function addToCart(drink: any) {
    setCart(prev => {
      const existing = prev.find(x => x.id === drink.id);
      if (existing) return prev.map(x => x.id === drink.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { id: drink.id, name: drink.name, price: drink.price, qty: 1 }];
    });
  }

  function confirmSale() {
    if (cart.length === 0) return;
    
    // Simular guardado de venta
    const newSale = {
      id: Date.now(),
      total: cart.reduce((acc, item) => acc + (item.price * item.qty), 0),
      createdAt: new Date().toISOString(),
      items: [...cart]
    };

    setSales([newSale, ...sales]);
    setCart([]);
    alert("Venta confirmada (Demo)");
  }

  return (
    <section className="p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <PlusIcon className="w-7 h-7 text-orange-500" />
            <h1 className="text-3xl font-black">Nueva Venta</h1>
          </div>
          <div className="mt-6 border p-6 bg-white rounded-2xl shadow-sm">
            <PosProductPicker 
              drinks={MOCK_DRINKS} 
              onPick={addToCart} 
              query="" setQuery={() => {}} isOpen={true} setIsOpen={() => {}} isLoading={false} 
            />
            <PosCart 
              cart={cart} 
              onInc={(id) => setCart(c => c.map(x => x.id === id ? {...x, qty: x.qty+1} : x))}
              onDec={(id) => setCart(c => c.map(x => x.id === id ? {...x, qty: x.qty-1} : x).filter(x => x.qty > 0))}
              onConfirm={confirmSale} 
              isConfirming={false}
            />
          </div>
        </div>

        <PosNightSales 
          sales={sales} 
          isLoading={false} 
          isClosing={false} 
          onCloseCash={() => alert("Caja cerrada")} 
        />
      </div>
    </section>
  );
}