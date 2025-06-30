import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function UserProfilePage({ user: currentUser }) {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userTierList, setUserTierList] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/users/${userId}/reviews`
        );
        if (response.ok) {
          const data = await response.json();
          setUserReviews(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error);
      }
    };

    const fetchUserTierList = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/users/${userId}/tierlist`
        );
        if (response.ok) {
          const data = await response.json();
          setUserTierList(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la tier list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchUserReviews();
    fetchUserTierList();
  }, [userId]);

  const handleVerify = async (verify = true) => {
    if (!currentUser?.is_admin) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/users/${userId}/${
          verify ? "verify" : "unverify"
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setUserProfile((prev) => ({ ...prev, is_verified: verify }));
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profil non trouvé</h1>
          <p className="mb-4">Ce profil n'existe pas ou a été supprimé.</p>
          <Link to="/members" className="btn btn-primary">
            Retour à la liste des membres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-sm breadcrumbs mb-6 overflow-x-auto">
          <ul>
            <li>
              <Link to="/members">Membres</Link>
            </li>
            <li>{userProfile.username}</li>
          </ul>
        </div>

        {/* Onglets */}
        <div className="tabs tabs-boxed justify-center mb-6 flex-wrap gap-2">
          <button
            className={`tab min-w-[120px] whitespace-nowrap ${
              activeTab === "profile" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profil
          </button>
          <button
            className={`tab min-w-[120px] whitespace-nowrap ${
              activeTab === "reviews" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            📝 Avis ({userReviews.length})
          </button>
          <button
            className={`tab min-w-[120px] whitespace-nowrap ${
              activeTab === "tierlist" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("tierlist")}
          >
            📋 Tier List
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-16">
                  <span className="text-xl">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold truncate">
                    {userProfile.username}
                  </h1>
                  {userProfile.is_verified ? (
                    <span className="badge badge-success whitespace-nowrap">
                      Vérifié
                    </span>
                  ) : (
                    <span className="badge badge-error whitespace-nowrap">
                      Non vérifié
                    </span>
                  )}
                  {userProfile.is_admin && (
                    <span className="badge badge-error whitespace-nowrap">
                      👑 Administrateur
                    </span>
                  )}
                </div>
                {userProfile.bio && (
                  <p className="mt-2 text-base-content/80 line-clamp-2">
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="divider"></div>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <p className="text-base-content/80 break-all">
                    {userProfile.email}
                  </p>
                </div>

                {userProfile.nationality && (
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Nationalité
                      </span>
                    </label>
                    <p className="text-base-content/80">
                      {userProfile.nationality}
                    </p>
                  </div>
                )}
              </div>

              {(userProfile.first_name || userProfile.last_name) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.first_name && (
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Prénom</span>
                      </label>
                      <p className="text-base-content/80">
                        {userProfile.first_name}
                      </p>
                    </div>
                  )}

                  {userProfile.last_name && (
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Nom</span>
                      </label>
                      <p className="text-base-content/80">
                        {userProfile.last_name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Membre depuis
                    </span>
                  </label>
                  <p className="text-base-content/80">
                    {new Date(userProfile.created_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                </div>

                {currentUser?.is_admin && currentUser.id !== userProfile.id && (
                  <div className="self-end sm:self-auto">
                    {userProfile.is_verified ? (
                      <button
                        onClick={() => handleVerify(false)}
                        className="btn btn-error btn-sm w-full sm:w-auto"
                      >
                        Annuler la vérification
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(true)}
                        className="btn btn-success btn-sm w-full sm:w-auto"
                      >
                        Vérifier le compte
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-4xl mx-auto">
            {userReviews.length === 0 ? (
              <div className="text-center bg-base-100 p-8 rounded-lg shadow-lg">
                <p className="text-lg mb-4">
                  {userProfile.username} n'a pas encore écrit d'avis
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-base-100 p-4 rounded-lg shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {console.log("poster:", review.poster)}
                      <img
                        src={review.poster}
                        alt={review.movie_title}
                        className="w-16 h-24 object-cover rounded self-center sm:self-auto"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              <Link
                                to={`/movie/${review.movie_id}`}
                                className="hover:text-primary"
                              >
                                {review.movie_title}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
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
                          <div className="ml-4 sm:ml-8">
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

                        <div className="flex flex-wrap gap-2 mt-3">
                          {review.contains_spoilers && (
                            <span className="badge badge-warning whitespace-nowrap">
                              Spoilers
                            </span>
                          )}
                          {review.is_recommended && (
                            <span className="badge badge-success whitespace-nowrap">
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
            {console.log("Tier List Data:", userTierList)}
            {Object.keys(userTierList).length === 0 ? (
              <div className="text-center bg-base-100 p-8 rounded-lg shadow-lg">
                <p className="text-lg mb-4">
                  {userProfile.username} n'a pas encore de tier list
                </p>
              </div>
            ) : (
              <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                <div className="space-y-4">
                  {["S", "A", "B", "C", "D"].map((tier) => {
                    const tierData = userTierList[tier];
                    console.log(`Tier ${tier} Data:`, tierData);

                    // Vérifie si le tier existe et a des films
                    if (
                      !tierData ||
                      !tierData.movies ||
                      tierData.movies.length === 0
                    ) {
                      return (
                        <div
                          key={tier}
                          className="border rounded-lg p-4 opacity-50"
                        >
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
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
                              <span className="whitespace-nowrap ml-2">
                                (0 film)
                              </span>
                            </h3>
                          </div>
                          <p className="text-sm text-base-content/70 italic">
                            Aucun film dans cette catégorie
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={tier} className="border rounded-lg p-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
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
                            <span className="whitespace-nowrap ml-2">
                              ({tierData.movies.length} film
                              {tierData.movies.length > 1 ? "s" : ""})
                            </span>
                          </h3>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                          {tierData.movies.map((movie) => (
                            <Link
                              key={movie.id}
                              to={`/movie/${movie.id}`}
                              className="relative group aspect-[2/3]"
                            >
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded shadow-sm"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center p-1">
                                  {movie.title}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
