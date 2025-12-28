import DrinkCard from "../components/DrinkCard";
import { useFavoriteIdsUnified } from "../hooks/favorites/useFavoriteIdsUnified";
import { useDrinks } from "../hooks/drinks/useDrinks";

export default function FavoritesPage() {
  const favoriteIds = useFavoriteIdsUnified();

  // Traemos todos los tragos (como ya venías haciendo en Home/Admin)
  const { data: drinks = [], isLoading } = useDrinks();

  const hasFavorites = favoriteIds.length > 0;
  const favoriteDrinks = drinks.filter((d) => favoriteIds.includes(d.id));

  return (
    <>
      <h1 className="text-6xl pt-7 font-extrabold">Favoritos</h1>

      {hasFavorites ? (
        isLoading ? (
          <p className="my-10 text-center text-2xl">Cargando favoritos...</p>
        ) : favoriteDrinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 my-10 gap-10">
            {favoriteDrinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        ) : (
          <p className="my-10 text-center text-2xl">
            No se encontraron esos favoritos (puede que hayan sido eliminados).
          </p>
        )
      ) : (
        <p className="my-10 text-center text-2xl">
          Los favoritos se mostrarán acá
        </p>
      )}
    </>
  );
}
