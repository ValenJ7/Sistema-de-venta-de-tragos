import DrinkCard from "../components/DrinkCard";
import { HomeStorySection } from "../components/HomeStorySection";
import { useDrinks } from "../hooks/drinks/useDrinks";

export function HomePage() {
  const {
    data: drinks,
    isLoading,
    isError,
    error,
  } = useDrinks();

  if (isLoading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Error al cargar los tragos
      </p>
    );
  }

  return (
    <>
      <section className=" pb-15">
        <HomeStorySection />
      </section>

      <h1 className="text-6xl font-extrabold pt-10 text-center">Catálogo de bebidas</h1>

      <section className="pt-10 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
        {drinks?.map((drink) => (
          <DrinkCard key={drink.id} drink={drink} />
        ))}
      </section>

    </>
  );
}
