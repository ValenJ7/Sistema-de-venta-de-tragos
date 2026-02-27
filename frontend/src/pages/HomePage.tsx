import DrinkCard from "../components/DrinkCard";
import { HomeStorySection } from "../components/HomeStorySection";

// Datos estáticos (hardcoded) para que la vista no esté vacía
const MOCK_DRINKS = [
  { id: 1, name: "Mojito Clásico", price: 4500, category: "Tragos", image: "/assets/home/imagen1.webp" },
  { id: 2, name: "Fernet Branca", price: 5000, category: "Tragos", image: "/assets/home/imagen2.jpg" },
  { id: 3, name: "Gin Tonic Premium", price: 4800, category: "Tragos", image: "/assets/home/imagen3.jpg" },
  { id: 4, name: "Negroni", price: 5200, category: "Tragos", image: "/assets/home/imagen1.webp" },
];

export function HomePage() {
  return (
    <>
      <section className="pb-15">
        <HomeStorySection />
      </section>

      <h1 className="text-6xl font-extrabold pt-10 text-center">
        Catálogo de bebidas
      </h1>

      <section className="pt-10 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
        {MOCK_DRINKS.map((drink) => (
          <DrinkCard key={drink.id} drink={drink} />
        ))}
      </section>
    </>
  );
}