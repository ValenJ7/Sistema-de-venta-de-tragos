import DrinkCard from "../components/DrinkCard";

// Lista estática de favoritos para la demo
const MOCK_FAVORITES = [
  { 
    id: 1, 
    name: "Gin Tonic", 
    price: 4800, 
    category: "Tragos", 
    image_path: "/assets/home/imagen1.webp" 
  },
  { 
    id: 2, 
    name: "Fernet Branca", 
    price: 5200, 
    category: "Tragos", 
    image_path: "/assets/home/imagen2.jpg" 
  }
];

export default function FavoritesPage() {
  // Al ser solo frontend, omitimos la carga y validaciones
  const favoriteDrinks = MOCK_FAVORITES;
  const hasFavorites = favoriteDrinks.length > 0;

  return (
    <>
      <h1 className="text-6xl pt-7 font-extrabold">Favoritos</h1>

      {hasFavorites ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 my-10 gap-10">
          {favoriteDrinks.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>
      ) : (
        <p className="my-10 text-center text-2xl text-slate-400">
          Todavía no agregaste ningún trago a tus favoritos.
        </p>
      )}
    </>
  );
}