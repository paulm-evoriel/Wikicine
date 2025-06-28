import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Account({ user, setUser }) {
  const [userProfile, setUserProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userTierList, setUserTierList] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Récupérer les informations détaillées du profil
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Récupérer les avis de l'utilisateur
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/my-reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserReviews(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  // Récupérer la tier list de l'utilisateur
  useEffect(() => {
    const fetchUserTierList = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/my-tierlist", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserTierList(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la tier list:", error);
      }
    };

    fetchUserTierList();
  }, [user]);

  if (!user) {
    return (
      <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Mon Compte</h1>
        <div className="text-center">
          <p className="text-lg mb-4">
            Vous devez être connecté pour accéder à votre profil
          </p>
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Mon Compte</h1>
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Mon Compte</h1>

      {/* Onglets */}
      <div className="tabs tabs-boxed justify-center mb-6">
        <button
          className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profil
        </button>
        <button
          className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          📝 Mes Avis ({userReviews.length})
        </button>
        <button
          className={`tab ${activeTab === "tierlist" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("tierlist")}
        >
          📋 Ma Tier List
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "profile" && (
        <div className="max-w-2xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Informations du profil</h2>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-16">
                  <span className="text-xl">
                    {userProfile?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {userProfile?.username}
                </h3>
                <p className="text-base-content/70">{userProfile?.email}</p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Prénom</span>
                </label>
                <p className="text-base-content/80">
                  {userProfile?.first_name || "Non renseigné"}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Nom</span>
                </label>
                <p className="text-base-content/80">
                  {userProfile?.last_name || "Non renseigné"}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Nationalité</span>
                </label>
                <p className="text-base-content/80">
                  {userProfile?.nationality || "Non renseignée"}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Date de naissance
                  </span>
                </label>
                <p className="text-base-content/80">
                  {userProfile?.date_of_birth
                    ? new Date(userProfile.date_of_birth).toLocaleDateString(
                        "fr-FR"
                      )
                    : "Non renseignée"}
                </p>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Bio</span>
              </label>
              <p className="text-base-content/80">
                {userProfile?.bio || "Aucune bio renseignée"}
              </p>
            </div>

            <div className="divider"></div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Statut du compte</p>
                <div className="flex items-center gap-2 mt-1">
                  {userProfile?.is_verified ? (
                    <span className="badge badge-success">✓ Vérifié</span>
                  ) : (
                    <span className="badge badge-warning">
                      ⚠ En attente de vérification
                    </span>
                  )}
                  {userProfile?.is_admin && (
                    <span className="badge badge-error">👑 Administrateur</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-base-content/70">Membre depuis</p>
                <p className="text-sm">
                  {userProfile?.created_at
                    ? new Date(userProfile.created_at).toLocaleDateString(
                        "fr-FR"
                      )
                    : "Date inconnue"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Mes Avis sur les Films</h2>

          {userReviews.length === 0 ? (
            <div className="text-center bg-base-100 p-8 rounded-lg shadow-lg">
              <p className="text-lg mb-4">
                Vous n'avez pas encore écrit d'avis
              </p>
              <Link to="/movies" className="btn btn-primary">
                Découvrir des films
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {userReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-base-100 p-4 rounded-lg shadow-lg"
                >
                  <div className="flex gap-4">
                    <img
                      src={review.poster}
                      alt={review.movie_title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            <Link
                              to={`/movie/${review.movie_id}`}
                              className="hover:text-primary"
                            >
                              {review.movie_title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="rating rating-sm">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <input
                                  key={star}
                                  type="radio"
                                  name={`rating-${review.id}`}
                                  className="mask mask-star-2 bg-orange-400"
                                  checked={
                                    star <= Math.round(review.rating / 2)
                                  }
                                  readOnly
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold">
                              {(review.rating / 2).toFixed(1)}/5
                            </span>
                          </div>
                        </div>
                        <div className="ml-8">
                          <span className="text-sm text-base-content/70">
                            {new Date(review.created_at).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="font-medium mb-2">{review.title}</h4>
                      )}

                      {review.content && (
                        <p className="text-base-content/80 text-sm leading-relaxed">
                          {review.content}
                        </p>
                      )}

                      <div className="flex gap-2 mt-3">
                        {review.contains_spoilers && (
                          <span className="badge badge-warning">Spoilers</span>
                        )}
                        {review.is_recommended && (
                          <span className="badge badge-success">
                            Recommandé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "tierlist" && (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Ma Tier List</h2>

          {/* Version mini de la tier list */}
          <div className="bg-base-100 p-6 rounded-lg shadow-lg">
            {Object.keys(userTierList).length === 0 ? (
              <div className="text-center">
                <p className="text-lg mb-4">
                  Vous n'avez pas encore de tier list
                </p>
                <Link to="/tierlist" className="btn btn-primary">
                  Créer ma Tier List
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {["S", "A", "B", "C", "D"].map((tier) => {
                  const tierData = userTierList[tier];
                  if (!tierData || tierData.movies.length === 0) return null;

                  return (
                    <div key={tier} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            tier === "S"
                              ? "bg-yellow-400"
                              : tier === "A"
                              ? "bg-red-400"
                              : tier === "B"
                              ? "bg-green-400"
                              : tier === "C"
                              ? "bg-blue-400"
                              : "bg-gray-400"
                          }`}
                        >
                          {tier}
                        </div>
                        <h3 className="font-semibold">
                          {tier === "S"
                            ? "Chef-d'œuvre"
                            : tier === "A"
                            ? "Excellent"
                            : tier === "B"
                            ? "Sympa"
                            : tier === "C"
                            ? "Bof"
                            : "À oublier"}
                          ({tierData.movies.length} film
                          {tierData.movies.length > 1 ? "s" : ""})
                        </h3>
                      </div>

                      <div className="flex gap-2 flex-wrap justify-start w-full">
                        {tierData.movies.slice(0, 6).map((movie) => (
                          <div key={movie.id} className="relative group">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-1">
                                {movie.title}
                              </span>
                            </div>
                          </div>
                        ))}
                        {tierData.movies.length > 6 && (
                          <div className="w-12 h-16 bg-base-200 rounded flex items-center justify-center">
                            <span className="text-xs font-semibold text-base-content/70">
                              +{tierData.movies.length - 6}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Statistiques */}
                <div className="mt-6 p-4 bg-base-200 rounded-lg">
                  <h4 className="font-semibold mb-2">Statistiques</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    {["S", "A", "B", "C", "D"].map((tier) => {
                      const tierData = userTierList[tier];
                      const count = tierData ? tierData.movies.length : 0;
                      const total = Object.values(userTierList).reduce(
                        (sum, tier) => sum + tier.movies.length,
                        0
                      );
                      const percentage =
                        total > 0 ? Math.round((count / total) * 100) : 0;

                      return (
                        <div key={tier}>
                          <div
                            className={`text-2xl font-bold ${
                              tier === "S"
                                ? "text-yellow-400"
                                : tier === "A"
                                ? "text-red-400"
                                : tier === "B"
                                ? "text-green-400"
                                : tier === "C"
                                ? "text-blue-400"
                                : "text-gray-400"
                            }`}
                          >
                            {count}
                          </div>
                          <div className="text-xs text-base-content/70">
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bouton "Voir plus" vraiment à droite de la page */}
          {Object.keys(userTierList).length > 0 && (
            <div className="flex justify-end mt-4 pr-0">
              <Link to="/tierlist" className="btn btn-primary">
                Voir plus
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
