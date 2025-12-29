import { useRef, useState } from "react";
import { drinkFormSchema } from "../validation/drinkFormSchema";

import { useDrinks } from "../hooks/drinks/useDrinks";
import { useCreateDrink } from "../hooks/drinks/useCreateDrink";
import { useUpdateDrink } from "../hooks/drinks/useUpdateDrink";
import { useDeleteDrink } from "../hooks/drinks/useDeleteDrink";
import { useUpdateDrinkImage } from "../hooks/drinks/useUpdateDrinkImage";

import { getBackendImageUrl } from "../utils/images";

export function AdminDrinksPage() {
  // 🔹 READ (React Query)
  const { data: items = [], isLoading } = useDrinks();

  // 🔹 MUTATIONS (React Query hooks)
  const createDrinkMutation = useCreateDrink();
  const updateDrinkMutation = useUpdateDrink();
  const deleteDrinkMutation = useDeleteDrink();
  const updateDrinkImageMutation = useUpdateDrinkImage();

  // ---------------------------
  // FORM STATE (UI only)
  // ---------------------------
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(""); // input siempre string
  const [isAlcoholic, setIsAlcoholic] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ Zod errors (por campo)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------------------------
  // HANDLERS
  // ---------------------------
  function resetForm() {
    setName("");
    setCategory("");
    setPrice("");
    setIsAlcoholic(false);
    setIngredients("");
    setInstructions("");
    setImage(null);
    setEditingId(null);
    setFormErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ✅ Validación Zod antes de mutar
    const parsed = drinkFormSchema.safeParse({
      name,
      category,
      price, // string -> number (z.coerce.number)
      is_alcoholic: isAlcoholic,
      ingredients,
      instructions,
      image,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      const flattened = parsed.error.flatten().fieldErrors;

      // ✅ FIX TS: entries evita "any"
      for (const [key, value] of Object.entries(flattened)) {
        const msg = value?.[0];
        if (msg) fieldErrors[key] = msg;
      }

      setFormErrors(fieldErrors);
      return;
    }

    // si está OK, limpiamos errores
    setFormErrors({});

    // ---------------------------
    // MUTATIONS
    // ---------------------------
    if (editingId) {
      updateDrinkMutation.mutate({
        id: editingId,
        data: {
          name: parsed.data.name,
          category: parsed.data.category,
          price: parsed.data.price, // ✅ number
          is_alcoholic: parsed.data.is_alcoholic,
          ingredients: parsed.data.ingredients,
          instructions: parsed.data.instructions,
        },
      });

      if (image) {
        updateDrinkImageMutation.mutate({
          id: editingId,
          file: image,
        });
      }

      resetForm();
      return;
    }

    createDrinkMutation.mutate({
      name: parsed.data.name,
      category: parsed.data.category,
      price: parsed.data.price, // ✅ number
      is_alcoholic: parsed.data.is_alcoholic,
      ingredients: parsed.data.ingredients,
      instructions: parsed.data.instructions,
      image: parsed.data.image ?? null,
    });

    resetForm();
  }

  function cancelEdit() {
    resetForm();
  }

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <>
      <h1 className="text-6xl font-extrabold pt-10">Administrar Tragos</h1>
      <p className="my-6 text-2xl text-slate-700">
        Agregá, editá o eliminá tragos del catálogo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-10">
        {/* FORM */}
        <section className="lg:col-span-1">
          <form
            onSubmit={onSubmit}
            className="bg-orange-400 p-8 rounded-lg shadow space-y-5"
          >
            <h2 className="text-white uppercase font-extrabold text-2xl text-center">
              {editingId ? "Editar trago" : "Nuevo trago"}
            </h2>

            <div className="space-y-1">
              <input
                className="p-3 w-full rounded-lg bg-amber-50"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {formErrors.name && (
                <p className="text-sm font-semibold text-red-900">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <input
                className="p-3 w-full rounded-lg bg-amber-50"
                placeholder="Categoría"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              {formErrors.category && (
                <p className="text-sm font-semibold text-red-900">
                  {formErrors.category}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <input
                type="number"
                className="p-3 w-full rounded-lg bg-amber-50"
                placeholder="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {formErrors.price && (
                <p className="text-sm font-semibold text-red-900">
                  {formErrors.price}
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 text-white font-bold">
              <input
                type="checkbox"
                checked={isAlcoholic}
                onChange={(e) => setIsAlcoholic(e.target.checked)}
              />
              Es alcohólica
            </label>

            <div className="space-y-1">
              <textarea
                rows={4}
                className="p-3 w-full rounded-lg bg-amber-50"
                placeholder="Ingredientes"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              {formErrors.ingredients && (
                <p className="text-sm font-semibold text-red-900">
                  {formErrors.ingredients}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <textarea
                rows={5}
                className="p-3 w-full rounded-lg bg-amber-50"
                placeholder="Instrucciones"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
              {formErrors.instructions && (
                <p className="text-sm font-semibold text-red-900">
                  {formErrors.instructions}
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="p-3 w-full rounded-lg bg-amber-50"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />

            <button
              type="submit"
              disabled={
                createDrinkMutation.isPending || updateDrinkMutation.isPending
              }
              className="bg-orange-800 hover:bg-orange-900 disabled:opacity-60 text-white font-extrabold w-full p-3 rounded-lg uppercase"
            >
              Guardar
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-white/20 hover:bg-white/30 text-white font-bold w-full p-3 rounded-lg uppercase"
              >
                Cancelar edición
              </button>
            )}
          </form>
        </section>

        {/* LIST */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-extrabold">Listado</h3>
              <p className="text-slate-600 mt-1">
                {isLoading ? "Cargando..." : `Total: ${items.length}`}
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {items.map((drink) => {
                const imageUrl = getBackendImageUrl(drink.image_path);

                return (
                  <div
                    key={drink.id}
                    className="p-6 flex flex-col md:flex-row md:items-center gap-5"
                  >
                    <img
                      src={imageUrl}
                      alt={drink.name}
                      className="w-full md:w-28 h-36 md:h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <p className="text-xl font-black">{drink.name}</p>
                      <p className="text-slate-600">{drink.category ?? "-"}</p>
                      <p className="text-slate-500 text-sm">
                        Precio: ${drink.price}
                      </p>
                      <p className="text-xs font-bold mt-1">
                        {drink.is_alcoholic ? "Alcohólica" : "Sin alcohol"}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="bg-orange-400 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg"
                        onClick={() => {
                          setEditingId(drink.id);
                          setName(drink.name);
                          setCategory(drink.category ?? "");
                          setPrice(String(drink.price));
                          setIsAlcoholic(drink.is_alcoholic);
                          setIngredients(drink.ingredients ?? "");
                          setInstructions(drink.instructions ?? "");
                          setImage(null);
                          setFormErrors({});

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        disabled={deleteDrinkMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg"
                        onClick={() => deleteDrinkMutation.mutate(drink.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}

              {!isLoading && items.length === 0 && (
                <p className="my-10 text-center text-2xl">
                  No hay bebidas cargadas todavía
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
