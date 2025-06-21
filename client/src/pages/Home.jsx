import MovieCard from "../components/MovieCard";

export default function Home({ theme }) {
  return (
    <div className="pt-8 bg-base-100 text-base-content min-h-screen">
      <h1 className="pb-8 text-2xl font-bold text-center">Sortie cinéma</h1>
      <MovieCard />
      <button
        className={`btn mx-auto mt-8 block transition-none ${
          theme === "dark" ? "btn-outline" : "btn-neutral"
        }`}
      >
        Get Started
      </button>
    </div>
  );
}
