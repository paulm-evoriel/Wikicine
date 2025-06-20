import MovieCard from "../components/MovieCard";

const mockMovies = [
  { id: 1, title: "Inception", rating: 4.8 },
  { id: 2, title: "Interstellar", rating: 4.7 },
];

export default function Home() {
  return (
    <div className="p-4 grid gap-4 bg-base-100 text-base-content min-h-screen">
      <h1 className="text-2xl font-bold text-center">Sortie cinéma</h1>
      <MovieCard />
    </div>
  );
}
