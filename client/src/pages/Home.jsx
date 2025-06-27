import MovieCard from "../components/MovieCard";
import duneImg from "../../image/11.png";
import mousquetairesImg from "../../image/12.png";
import wonkaImg from "../../image/10.png";
import { useState, useEffect } from "react";
import RegisterForm from "../components/Register";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff/3600)}h`;
  if (diff < 172800) return 'hier';
  return date.toLocaleDateString();
}

export default function Home({ theme, user, setUser }) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [latestReviews, setLatestReviews] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/reviews/latest`).then(res => res.json()).then(setLatestReviews);
    fetch(`${API_URL}/movies/latest`).then(res => res.json()).then(setLatestMovies);
  }, []);

  return (
    <div className="pt-8 bg-base-100 text-base-content min-h-screen">
      <h1 className="pb-8 text-2xl font-bold text-center">Sortie cinéma</h1>
      <MovieCard />
      {!user && (
        <button
          className={`btn mx-auto mt-8 block transition-none ${
            theme === "dark" ? "btn-outline" : "btn-neutral"
          }`}
          onClick={() => setIsRegisterModalOpen(true)}
        >
          Get Started
        </button>
      )}
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
              <h2 className="text-2xl font-bold text-base-content">
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
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-base-200 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-2">
          Comment fonctionne Wikicine&nbsp;?
        </h2>
        <p>
          Wikicine est une plateforme collaborative dédiée au cinéma. Vous
          pouvez explorer les films à l'affiche, consulter des fiches
          détaillées, et créer un compte pour partager vos avis ou constituer
          votre propre liste de films. Utilisez la barre de recherche pour
          trouver rapidement un film, et naviguez facilement grâce à la barre de
          navigation en haut de la page. Rejoignez la communauté et enrichissez
          la base de données avec vos contributions&nbsp;!
        </p>
      </div>
      {/* Section Dernières reviews et Nouveaux films */}
      <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {/* Dernières reviews */}
        <div className="bg-base-200 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-center">
            Dernières reviews
          </h3>
          <ul className="space-y-4">
            {latestReviews.length === 0 && <li>Aucune review récente.</li>}
            {latestReviews.map(r => (
              <li key={r.id}>
                <span className="font-semibold">{r.movie_title}</span> — {r.content && <span className="italic">"{r.content}"</span>}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400">
                    {Array.from({length: Math.round(r.rating/2)}, (_,i) => '★').join('')}
                    {Array.from({length: 5-Math.round(r.rating/2)}, (_,i) => '☆').join('')}
                  </span>
                  <span className="text-sm text-gray-500">
                    par {r.username}, {timeAgo(r.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Nouveaux films ajoutés */}
        <div className="bg-base-200 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-center">
            Nouveaux films ajoutés
          </h3>
          <ul className="space-y-4">
            {latestMovies.length === 0 && <li>Aucun film récent.</li>}
            {latestMovies.map(m => (
              <li key={m.id} className="flex items-center gap-3">
                <img
                  src={m.poster}
                  alt={m.title}
                  className="w-12 h-16 object-cover rounded shadow"
                />
                <div>
                  <span className="font-semibold">{m.title}</span> — ajouté {timeAgo(m.created_at)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Footer professionnel */}
      <footer className="bg-base-200 border-t border-base-300 mt-16 py-6 w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
          <div className="text-base-content text-sm text-center md:text-left">
            © {new Date().getFullYear()} Wikicine. Tous droits réservés.
          </div>
          <div className="flex gap-4 text-base-content text-sm justify-center">
            <a href="/" className="hover:underline">
              Accueil
            </a>
            <a href="#" className="hover:underline">
              À propos
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
