import { useState, useEffect } from "react";
import LoginForm from "../components/Login";
import RegisterForm from "../components/Register";

const categories = [
  { key: "S", label: "Chef-d'œuvre" },
  { key: "A", label: "Excellent" },
  { key: "B", label: "Sympa" },
  { key: "C", label: "Bof" },
  { key: "D", label: "À oublier" },
];
const categoryColors = {
  S: "bg-yellow-400",
  A: "bg-red-400",
  B: "bg-green-400",
  C: "bg-blue-400",
  D: "bg-gray-400",
};

export default function TierList({ theme, setTheme, user, setUser }) {
  const [affiches, setAffiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [savedTierList, setSavedTierList] = useState({});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Récupérer les films depuis la base de données
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (user) {
          // Si l'utilisateur est connecté, récupérer ses films notés
          const token = localStorage.getItem("token");
          console.log("Utilisateur connecté, récupération des films notés...");
          console.log("Token:", token ? "Présent" : "Absent");
          console.log("User ID:", user.id);

          const response = await fetch(
            "http://localhost:5000/my-reviewed-movies",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Réponse API:", response.status, response.statusText);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Données reçues:", data);
          console.log("Nombre de films reçus:", data.length);

          setAffiches(data.slice(0, 5)); // Prendre seulement les 5 premiers
        } else {
          // Si pas connecté, récupérer les 5 premiers films publics
          console.log(
            "Utilisateur non connecté, récupération des films publics..."
          );
          const response = await fetch("http://localhost:5000/movies?limit=5");
          const data = await response.json();
          setAffiches(data.slice(0, 5));
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user]); // Re-exécuter quand l'utilisateur change

  // Récupérer la tier list sauvegardée de l'utilisateur
  useEffect(() => {
    const fetchSavedTierList = async () => {
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
          console.log("Tier list sauvegardée récupérée:", data);
          setSavedTierList(data);

          // Convertir la tier list sauvegardée en format afficheCategories
          const categoriesFromDB = {};
          Object.entries(data).forEach(([tierName, tierData]) => {
            tierData.movies.forEach((movie) => {
              categoriesFromDB[movie.id] = tierName;
            });
          });
          setAfficheCategories(categoriesFromDB);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la tier list sauvegardée:",
          error
        );
      }
    };

    fetchSavedTierList();
  }, [user]);

  // Pour chaque affiche, on stocke la catégorie sélectionnée (ou null)
  const [afficheCategories, setAfficheCategories] = useState({});

  // Sauvegarder la tier list
  const saveTierList = async (newCategories) => {
    if (!user) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      // Organiser les films par catégorie
      const tierListData = {};
      Object.entries(newCategories).forEach(([movieId, category]) => {
        if (category) {
          const movie = affiches.find((a) => a.id == movieId);
          if (movie) {
            if (!tierListData[category]) {
              tierListData[category] = { movies: [] };
            }
            tierListData[category].movies.push({
              id: movie.id,
              title: movie.title,
              poster: movie.poster,
            });
          }
        }
      });

      const response = await fetch("http://localhost:5000/my-tierlist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tierList: tierListData }),
      });

      if (response.ok) {
        console.log("Tier list sauvegardée avec succès");
        setLastSaved(new Date());
      } else {
        console.error("Erreur lors de la sauvegarde de la tier list");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setSaving(false);
    }
  };

  // Déplacer une affiche dans une catégorie
  const handleSetCategory = (afficheId, cat) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    const newCategories = { ...afficheCategories, [afficheId]: cat };
    setAfficheCategories(newCategories);
    saveTierList(newCategories);
  };

  const handleUnassign = (afficheId) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    const newCategories = { ...afficheCategories, [afficheId]: null };
    setAfficheCategories(newCategories);
    saveTierList(newCategories);
  };

  // Gérer la connexion réussie
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowRegister(false);
    // Mettre à jour l'état global de l'utilisateur
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        })
        .catch(() => setUser(null));
    }
  };

  // Gérer l'inscription réussie
  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Tier List</h1>
        <div className="text-center">Chargement des films...</div>
      </div>
    );
  }

  // Afficher le formulaire de connexion/inscription si pas connecté
  if (!user && (showLogin || showRegister)) {
    return (
      <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Tier List</h1>
        <div className="max-w-md mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-center mb-4">
            Connectez-vous pour pouvoir compléter votre liste personnelle
          </h2>
          {showLogin ? (
            <>
              <LoginForm onSuccess={handleLoginSuccess} />
              <div className="text-center mt-4">
                <button
                  className="btn btn-link"
                  onClick={() => setShowRegister(true)}
                >
                  Pas encore de compte ? S'inscrire
                </button>
              </div>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={handleRegisterSuccess} />
              <div className="text-center mt-4">
                <button
                  className="btn btn-link"
                  onClick={() => setShowLogin(true)}
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Tier List</h1>
      {!user && (
        <div className="text-center bg-warning/20 p-4 rounded-lg">
          <p className="text-warning-content">
            Connectez-vous pour pouvoir compléter votre liste personnelle
          </p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => setShowLogin(true)}
          >
            Se connecter
          </button>
        </div>
      )}
      {user && (
        <div className="text-center bg-info/20 p-4 rounded-lg">
          <p className="text-info-content">
            Films que vous avez notés - Classez-les selon vos préférences !
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                <span className="text-sm">Sauvegarde en cours...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2">
                <div className="text-success">✓</div>
                <span className="text-sm text-success">
                  Sauvegardé le {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            ) : (
              <span className="text-sm text-base-content/70">
                Sauvegarde automatique activée
              </span>
            )}
          </div>
        </div>
      )}
      {/* Catégories façon tier list */}
      {categories.map((cat) => (
        <div
          key={cat.key}
          className={`flex items-center min-h-[110px] rounded-lg mb-2 p-2 ${
            categoryColors[cat.key]
          } bg-opacity-80 w-full`}
        >
          <div className="flex flex-col items-center justify-center w-40 min-w-[120px]">
            <div className="text-2xl font-bold text-center text-black drop-shadow">
              {cat.key}
            </div>
            <div className="text-xs font-semibold text-black/80 mt-1">
              {cat.label}
            </div>
          </div>
          <div className="h-16 border-l-2 border-black/30 mx-4"></div>
          <div className="flex gap-4 flex-wrap">
            {affiches
              .filter((a) => afficheCategories[a.id] === cat.key)
              .map((affiche) => (
                <div key={affiche.id} className="relative">
                  <img
                    src={affiche.poster}
                    alt={`Affiche ${affiche.title}`}
                    className="h-24 w-auto rounded shadow-lg border-2 border-black cursor-pointer hover:scale-105 transition"
                    onClick={() => handleUnassign(affiche.id)}
                    title={
                      user
                        ? "Clique pour retirer l'affiche de la catégorie"
                        : "Connectez-vous pour classer les films"
                    }
                  />
                  {user && affiche.rating && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1 rounded-full">
                      {affiche.rating}/10
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      {/* Affiches non classées */}
      <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 shadow mt-8 w-full">
        <div className="font-bold mb-2 text-lg">
          {user ? "Films non classés" : "Non classées"}
        </div>
        <div className="flex gap-8 flex-wrap justify-center w-full">
          {affiches.filter((a) => !afficheCategories[a.id]).length === 0 && (
            <div className="text-sm text-base-content/50">
              {user ? "Tous vos films sont classés !" : "Aucune affiche"}
            </div>
          )}
          {affiches
            .filter((a) => !afficheCategories[a.id])
            .map((affiche) => (
              <div key={affiche.id} className="flex flex-col items-center mb-2">
                <div className="relative">
                  <img
                    src={affiche.poster}
                    alt={`Affiche ${affiche.title}`}
                    className="h-24 w-auto rounded mb-2 shadow-lg border"
                  />
                  {user && affiche.rating && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1 rounded-full">
                      {affiche.rating}/10
                    </div>
                  )}
                </div>
                <div className="text-xs text-center mb-2 max-w-24 truncate">
                  {affiche.title}
                </div>
                <div className="flex gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      className={`btn btn-xs btn-outline ${
                        categoryColors[cat.key]
                      }`}
                      onClick={() => handleSetCategory(affiche.id, cat.key)}
                      disabled={!user}
                    >
                      {cat.key}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
