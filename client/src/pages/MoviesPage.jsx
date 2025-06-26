import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((response) => response.json())
      .then((data) => {
        // Prendre les 3 premiers films et leur assigner les styles appropriés
        const topMovies = data.slice(0, 3).map((movie, index) => ({
          ...movie,
          rank: index + 1,
          bgColor:
            index === 0
              ? "bg-yellow-400"
              : index === 1
              ? "bg-slate-300"
              : "bg-orange-500",
          textColor: "text-black",
        }));
        setMovies(topMovies);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des films:", err);
        setError("Erreur lors de la récupération des films");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-24 bg-base-100 text-base-content min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 bg-base-100 text-base-content min-h-screen flex justify-center items-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 bg-base-100 text-base-content min-h-screen">
      <h1 className="pb-8 text-2xl font-bold text-center">Top 3 Box Office</h1>
      <div className="flex justify-center items-end gap-8 px-4">
        {[1, 0, 2].map((orderIdx, i) => {
          const movie = movies[orderIdx];
          if (!movie) return null;
          let marginBottom = "";
          if (i === 1) marginBottom = "mb-16";
          else marginBottom = "mb-4";
          return (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div className={`relative w-64 ${marginBottom}`}>
                <img
                  src={movie.poster}
                  alt={`Film classé n°${movie.rank}`}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div
                  className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg ${movie.bgColor} ${movie.textColor}`}
                >
                  <span>{movie.rank}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
