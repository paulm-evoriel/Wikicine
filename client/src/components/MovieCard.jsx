export default function MovieCard({ movie }) {
  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h2 className="text-xl font-semibold">{movie.title}</h2>
      <p>Note : ⭐ {movie.rating}</p>
    </div>
  )
}