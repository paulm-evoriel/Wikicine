import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MovieCard() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des films:", err)
      );
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, movies.length]);

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 h-[300px] sm:h-[400px] md:h-[500px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Pour afficher 3 affiches, centrées sur l'index courant
  const getVisibleMovies = () => {
    if (movies.length === 0) return [];
    const prev = (index - 1 + movies.length) % movies.length;
    const next = (index + 1) % movies.length;
    return [movies[prev], movies[index], movies[next]];
  };

  const visible = getVisibleMovies();

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 py-4 sm:py-8 h-[220px] sm:h-[400px] md:h-[500px] w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto overflow-x-hidden overflow-y-hidden">
      {visible.map((movie, i) => (
        <Link
          key={movie.id}
          to={`/movie/${movie.id}`}
          aria-label={`Voir la fiche de ${movie.title}`}
        >
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "12px",
              WebkitBorderRadius: "12px",
              MozBorderRadius: "12px",
            }}
          >
            <img
              src={movie.poster}
              alt={`Affiche de ${movie.title}`}
              className={
                i === 1
                  ? "w-40 h-48 sm:w-64 sm:h-96 object-cover shadow-2xl z-10 transition-all duration-500 max-h-full"
                  : "w-28 h-44 sm:w-48 sm:h-72 object-cover opacity-70 transition-all duration-500 max-h-full"
              }
              style={{
                boxShadow: i === 1 ? "0 8px 32px rgba(0,0,0,0.3)" : undefined,
                objectFit: "cover",
                userSelect: "none",
                pointerEvents: "auto",
                borderRadius: "12px",
                transform: i === 1 ? "scale(1.1)" : "scale(0.95)",
                WebkitBorderRadius: "12px",
                MozBorderRadius: "12px",
              }}
              draggable={false}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}