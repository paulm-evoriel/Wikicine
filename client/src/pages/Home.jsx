import MovieCard from "../components/MovieCard"

const mockMovies = [
  { id: 1, title: "Inception", rating: 4.8 },
  { id: 2, title: "Interstellar", rating: 4.7 },
]

export default function Home() {
  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Films populaires</h1>
      {mockMovies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}