import { useRef, useState } from "react";

// Mock inicial para tener algo que ver
const INITIAL_ITEMS = [
  { id: 1, name: "Mojito", category: "Tragos", price: 4500, is_alcoholic: true, ingredients: "Menta, Lima, Ron", instructions: "Mezclar todo", image_path: "/assets/home/imagen1.webp" },
];

export function AdminDrinksPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isAlcoholic, setIsAlcoholic] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function resetForm() {
    setName(""); setCategory(""); setPrice(""); setIsAlcoholic(false);
    setIngredients(""); setInstructions(""); setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingId) {
      // Editar en memoria
      setItems(items.map(item => item.id === editingId ? {
        ...item, name, category, price: Number(price), is_alcoholic: isAlcoholic, ingredients, instructions
      } : item));
    } else {
      // Crear en memoria
      const newItem = {
        id: Date.now(),
        name, category, price: Number(price), is_alcoholic: isAlcoholic, ingredients, instructions,
        image_path: "/assets/home/imagen1.webp" // Imagen por defecto
      };
      setItems([...items, newItem]);
    }
    resetForm();
  }

  const deleteDrink = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <>
      <h1 className="text-6xl font-extrabold pt-10 text-orange-600">Admin Tragos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-10">
        <section className="lg:col-span-1">
          <form onSubmit={onSubmit} className="bg-slate-800 p-8 rounded-lg shadow space-y-5 text-white">
            <h2 className="font-extrabold text-2xl text-center">{editingId ? "Editar" : "Nuevo"} Trago</h2>
            <input className="p-3 w-full rounded bg-slate-700" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            <input className="p-3 w-full rounded bg-slate-700" placeholder="Categoría" value={category} onChange={e => setCategory(e.target.value)} />
            <input type="number" className="p-3 w-full rounded bg-slate-700" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 w-full p-3 rounded font-bold uppercase">Guardar</button>
            {editingId && <button onClick={resetForm} className="w-full text-slate-400">Cancelar</button>}
          </form>
        </section>

        <section className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow border divide-y">
            {items.map((drink) => (
              <div key={drink.id} className="p-5 flex items-center gap-4">
                <img src={drink.image_path} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-bold text-xl">{drink.name}</p>
                  <p className="text-slate-500">${drink.price}</p>
                </div>
                <button onClick={() => {
                  setEditingId(drink.id); setName(drink.name); setPrice(String(drink.price)); setCategory(drink.category)
                }} className="text-blue-600 font-bold">Editar</button>
                <button onClick={() => deleteDrink(drink.id)} className="text-red-600 font-bold">Borrar</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}