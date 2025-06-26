import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState({ directors: [], actors: [] });

  useEffect(() => {
    fetch(`http://localhost:5000/movies/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Film non trouvé");
        }
        return response.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du film:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Récupérer le casting (réalisateurs et acteurs)
  useEffect(() => {
    fetch(`http://localhost:5000/movies/${id}/cast`)
      .then((response) => {
        if (!response.ok)
          throw new Error("Erreur lors du chargement du casting");
        return response.json();
      })
      .then((data) => setCast(data))
      .catch((err) => {
        console.error("Erreur lors de la récupération du casting:", err);
      });
  }, [id]);

  // Fonction utilitaire pour formater la durée en heures et minutes
  function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m > 0 ? ` ${m}min` : ""}`;
  }

  // Fonction utilitaire pour formater les montants (budget, box office)
  function formatMoney(amount) {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(2)} milliard $`;
    } else if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2)} million $`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(2)} mille $`;
    } else {
      return `${amount} $`;
    }
  }

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
    <div className="pt-24 bg-base-100 text-base-content min-h-screen p-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        <div className="md:w-1/3">
          <img
            src={movie.poster}
            alt={`Affiche de ${movie.title}`}
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="mb-4">{movie.synopsis}</p>
          {/* Affichage des réalisateurs */}
          {cast.directors.length > 0 && (
            <div className="mb-2">
              <strong>Réalisateur(s)&nbsp;:</strong>{" "}
              {cast.directors
                .map((d) => `${d.first_name} ${d.last_name}`)
                .join(", ")}
            </div>
          )}
          {/* Affichage des acteurs */}
          {cast.actors.length > 0 && (
            <div className="mb-2">
              <strong>Acteurs principaux&nbsp;:</strong>{" "}
              {cast.actors
                .map(
                  (a) =>
                    `${a.first_name} ${a.last_name}${
                      a.character_name ? ` (${a.character_name})` : ""
                    }`
                )
                .join(", ")}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p>
              <strong>Date de sortie:</strong>{" "}
              {new Date(movie.release_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Durée:</strong> {formatDuration(movie.duration)}
            </p>
            <p>
              <strong>Budget:</strong> {formatMoney(movie.budget)}
            </p>
            <p>
              <strong>Box Office:</strong> {formatMoney(movie.box_office)}
            </p>
            <p>
              <strong>Titre Original:</strong> {movie.original_title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
