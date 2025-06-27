import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoginForm from "../components/Login";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

async function fetchMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

function StarRating({ value, onChange, max = 5, disabled }) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          className={`cursor-pointer text-2xl ${i < value ? 'text-yellow-400' : 'text-gray-400'} ${disabled ? 'pointer-events-none' : ''}`}
          onClick={() => !disabled && onChange(i + 1)}
          role="button"
        >★</span>
      ))}
    </div>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState({ directors: [], actors: [] });
  const [ratingInfo, setRatingInfo] = useState({ average_rating: null, count: 0 });
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewLimit] = useState(5);
  const [user, setUser] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/movies/${id}`)
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

  useEffect(() => {
    fetch(`${API_URL}/movies/${id}/cast`)
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

  useEffect(() => {
    fetch(`${API_URL}/movies/${id}/rating`)
      .then(res => res.json())
      .then(data => setRatingInfo(data));
  }, [id, userReview]);

  useEffect(() => {
    setReviewLoading(true);
    fetch(`${API_URL}/movies/${id}/reviews?page=${reviewPage}&limit=${reviewLimit}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews);
        setReviewTotal(data.total);
        setReviewLoading(false);
      });
  }, [id, reviewPage, reviewLimit, userReview]);

  useEffect(() => {
    const onStorage = () => {
      fetchMe().then(setUser);
    };
    window.addEventListener('storage', onStorage);
    fetchMe().then(setUser);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/movies/${id}/reviews?page=1&limit=1000`)
      .then(res => res.json())
      .then(data => {
        const found = data.reviews.find(r => r.user_id === user.id);
        setUserReview(found || null);
      });
  }, [user, id]);

  function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m > 0 ? ` ${m}min` : ""}`;
  }

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!newRating) {
      if (newComment.trim() !== "") {
        setReviewError('Vous devez sélectionner une note pour ajouter un commentaire.');
        return;
      } else {
        setReviewError('La note est obligatoire');
        return;
      }
    }
    try {
      const res = await fetch(`${API_URL}/movies/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ rating: newRating * 2, content: newComment }) // note sur 10 en base
      });
      const data = await res.json();
      if (res.ok) {
        setUserReview(data.review);
        setNewRating(0);
        setNewComment('');
      } else {
        setReviewError(data.error || "Erreur lors de l'ajout de la review");
      }
    } catch (err) {
      setReviewError('Erreur réseau');
    }
  };

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
        <div className="md:w-1/3 flex flex-col items-center">
          <img
            src={movie.poster}
            alt={`Affiche de ${movie.title}`}
            className="rounded-lg shadow-lg w-full h-auto mb-2"
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold">Note moyenne :</span>
            <StarRating value={Math.round((ratingInfo.average_rating || 0) / 2)} max={5} disabled />
            <span className="text-md">{ratingInfo.average_rating ? (Number(ratingInfo.average_rating)/2).toFixed(2) : '—'} / 5</span>
            <span className="text-gray-500">({ratingInfo.count || 0} avis)</span>
          </div>
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
      {/* Zone de note/commentaire sur toute la largeur */}
      <div className="relative w-full max-w-4xl mx-auto mt-8">
        <div className={(!user ? "pointer-events-none blur-sm opacity-60" : "") + " transition-all"}>
          <form className="p-4 border rounded-lg bg-base-200 flex flex-col gap-3 w-full max-w-none" onSubmit={handleReviewSubmit}>
            <div>
              <span className="font-bold">Votre note :</span>
              <StarRating value={user ? newRating : 0} onChange={v => user ? setNewRating(v) : null} />
            </div>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Votre commentaire (optionnel)"
              value={user ? newComment : ''}
              onChange={e => user ? setNewComment(e.target.value) : null}
              disabled={!user}
            />
            <button className="btn btn-primary w-fit" type="submit" disabled={!user} onClick={e => { if (!user) { e.preventDefault(); setShowLoginModal(true); } }}>Noter</button>
            {reviewError && user && <div className="text-red-500">{reviewError}</div>}
          </form>
        </div>
        {!user && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <button className="btn btn-primary" onClick={() => setShowLoginModal(true)}>
              Se connecter ou s'inscrire
            </button>
          </div>
        )}
      </div>
      {/* Affichage de la review de l'utilisateur si elle existe */}
      {user && userReview && (
        <div className="max-w-4xl mx-auto mt-4 p-4 border rounded-lg bg-base-200 w-full">
          <span className="font-bold">Vous avez déjà noté ce film.</span>
          <div className="flex items-center gap-2 mt-2">
            <StarRating value={Math.round(userReview.rating/2)} max={5} disabled />
            <span>{userReview.rating ? (userReview.rating/2).toFixed(2) : '—'} / 5</span>
          </div>
          {userReview.content && <div className="mt-2">"{userReview.content}"</div>}
        </div>
      )}
      {/* Liste des reviews */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Avis des spectateurs</h2>
        {reviewLoading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <>
            {reviews.length === 0 && <div>Aucun avis pour ce film.</div>}
            {reviews.map(r => (
              <div key={r.id} className="mb-4 p-4 border rounded-lg bg-base-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{r.username}</span>
                  <StarRating value={Math.round(r.rating/2)} max={5} disabled />
                  <span>{r.rating ? (r.rating/2).toFixed(2) : '—'} / 5</span>
                  <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.content && <div className="mt-2">{r.content}</div>}
              </div>
            ))}
            {/* Pagination */}
            {reviewTotal > reviewLimit && (
              <div className="flex gap-2 justify-center mt-4">
                {Array.from({ length: Math.ceil(reviewTotal / reviewLimit) }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-xs ${reviewPage === i + 1 ? 'btn-primary' : ''}`}
                    onClick={() => setReviewPage(i + 1)}
                  >{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {/* Modal de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowLoginModal(false)}>
          <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-base-content">Connexion</h2>
              <button onClick={() => setShowLoginModal(false)} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            <LoginForm onSuccess={() => { setShowLoginModal(false); fetchMe().then(setUser); }} />
          </div>
        </div>
      )}
    </div>
  );
}
