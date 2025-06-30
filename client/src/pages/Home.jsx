import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Register";
import Aurora from "../effects/Aurora";
import ScrollFloat from "../effects/ScrollFloat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return "hier";
  return date.toLocaleDateString();
}

export default function Home({ theme, user, setUser }) {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [latestReviews, setLatestReviews] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [showAllMovies, setShowAllMovies] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/reviews/latest`)
      .then((res) => res.json())
      .then(setLatestReviews);
    fetch(`${API_URL}/movies/latest`)
      .then((res) => res.json())
      .then(setLatestMovies);
  }, []);

  const displayedMovies = showAllMovies
    ? latestMovies
    : latestMovies.slice(0, 5);

  console.log("displayedMovies", displayedMovies);

  return (
    <div className="bg-base-100 min-h-screen text-base-content">
      {/* HERO */}
      <section className="relative w-full min-h-[40vh] flex flex-col justify-center items-center overflow-hidden pb-12">
        <Aurora
          colorStops={["#5227FF", "#7CFF67", "#5227FF"]}
          blend={0.6}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <ScrollFloat>
            <h1 className="text-6xl font-extrabold font-poppins text-center mb-4 drop-shadow-lg leading-tight">
              Wikicine, la plateforme cinéma nouvelle génération
            </h1>
          </ScrollFloat>
          <p className="text-2xl font-medium text-center max-w-3xl mb-4 opacity-90 font-montserrat leading-relaxed">
            Explorez, partagez, notez et découvrez le cinéma autrement.
            <br />
            Rejoignez la communauté et enrichissez la base de données avec vos
            contributions !
          </p>
          {!user && (
            <button
              className="btn btn-primary btn-lg px-8 py-4 text-xl rounded-full shadow-lg mt-1"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Commencer
            </button>
          )}
        </div>
      </section>

      {/* CAROUSEL / FILMS EN VEDETTE */}
      <section className="max-w-7xl mx-auto mt-[-3rem] mb-12 z-20 relative">
        <MovieCard />
      </section>

      {/* COMMUNAUTÉ */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 px-2">
        <div className="bg-base-200 rounded-3xl shadow-xl p-10 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 font-poppins">
            Dernières reviews
          </h2>
          <ul className="space-y-6">
            {latestReviews.length === 0 && <li>Aucune review récente.</li>}
            {latestReviews.map((r) => (
              <li
                key={r.id}
                className="bg-base-100 rounded-xl p-5 shadow flex flex-col gap-2"
              >
                <span className="font-semibold text-lg font-montserrat">
                  {r.movie_title}
                </span>
                {r.content && (
                  <span className="italic text-base font-montserrat">
                    "{r.content}"
                  </span>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400 text-lg">
                    {Array.from(
                      { length: Math.round(r.rating / 2) },
                      (_, i) => "★"
                    ).join("")}
                    {Array.from(
                      { length: 5 - Math.round(r.rating / 2) },
                      (_, i) => "☆"
                    ).join("")}
                  </span>
                  <span className="text-sm text-gray-500 font-montserrat">
                    par {r.username}, {timeAgo(r.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-base-200 rounded-3xl shadow-xl p-10 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 font-poppins">
            Nouveaux films ajoutés
          </h2>
          <ul className="space-y-6">
            {displayedMovies.length === 0 && <li>Aucun film récent.</li>}
            {displayedMovies.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-4 bg-base-100 rounded-xl p-5 shadow cursor-pointer hover:bg-base-300 transition-colors"
                onClick={() => navigate(`/movie/${m.id}`)}
              >
                <img
                  src={m.poster}
                  alt={m.title}
                  className="w-16 h-24 object-cover rounded shadow"
                />
                <div>
                  <span className="font-semibold text-lg font-montserrat">
                    {m.title}
                  </span>
                  <br />
                  <span className="text-sm text-gray-500 font-montserrat">
                    ajouté {timeAgo(m.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {latestMovies.length > 5 && (
            <div className="mt-4 text-center">
              {!showAllMovies ? (
                <button
                  className="btn btn-neutral btn-sm px-4 py-2 rounded-full"
                  onClick={() => setShowAllMovies(true)}
                >
                  Voir plus ({latestMovies.length - 5} autres)
                </button>
              ) : (
                <button
                  className="btn btn-outline btn-sm px-4 py-2 rounded-full"
                  onClick={() => setShowAllMovies(false)}
                >
                  Voir moins
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MODAL INSCRIPTION */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-base-content font-poppins">
                Inscription
              </h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            <RegisterForm onSuccess={() => setIsRegisterModalOpen(false)} />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-12 py-8 bg-base-200 text-center text-base-content/70 font-montserrat">
        © {new Date().getFullYear()} Wikicine. Tous droits réservés.
      </footer>
    </div>
  );
}
