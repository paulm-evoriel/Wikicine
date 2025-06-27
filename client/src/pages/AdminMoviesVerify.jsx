import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminMoviesVerify({ user }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) return;
    fetch(`${API_URL}/admin/unverified-movies`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(() => setError('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.is_admin) return <div className="p-8 text-center text-xl">Accès réservé aux admins</div>;
  if (loading) return <div className="p-8 text-center">Chargement…</div>;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Films à valider</h1>
      {movies.length === 0 ? <div>Aucun film à valider.</div> : (
        <ul className="space-y-4">
          {movies.map(m => (
            <li key={m.id} className="bg-base-200 rounded-lg p-4 flex items-center gap-4">
              <img src={m.poster} alt={m.title} className="w-16 h-24 object-cover rounded shadow" />
              <div className="flex-1">
                <Link to={`/movie/${m.id}`} className="text-lg font-semibold hover:underline">{m.title}</Link>
                <div className="text-sm text-gray-500">Ajouté le {new Date(m.created_at).toLocaleDateString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 