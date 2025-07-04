import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoWikicine from "../../image/wikicine.svg";
import accountIcon from "../../image/account.svg";
import test from "../../image/test.png";
import LoginForm from "./Login";
import RegisterForm from "./Register";

export default function Navbar({ theme, setTheme, user, setUser }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!search) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const controller = new AbortController();
    fetch(`${API_URL}/search?q=${encodeURIComponent(search)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setShowDropdown(true);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [search]);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterMode(false);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterMode(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <div className="pl-6 navbar bg-base-200 fixed top-0 w-full z-50 relative">
        <div className="flex">
          <Link to="/" className="btn btn-ghost text-xl">
            <img
              src={logoWikicine}
              alt="Logo Wikicine"
              className="h-10 w-auto"
            />
            Wikicine
          </Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full flex items-center gap-2 hidden sm:flex">
          <Link
            to="/movies"
            className="btn btn-sm ml-2 inline-flex items-center justify-center"
          >
            🎬 Films
          </Link>
          <Link
            to="/members"
            className="btn btn-sm inline-flex items-center justify-center"
          >
            👥 Membre
          </Link>
          <Link
            to="/tierlist"
            className="btn btn-sm inline-flex items-center justify-center"
          >
            📋 Liste
          </Link>
        </div>
        <div className="flex items-center gap-2 ml-auto relative">
          <div className="relative w-full max-w-xs hidden lg:block">
            <input
              ref={searchRef}
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered w-full"
              style={{ minWidth: "150px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && results.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
                {results.map((r) => (
                  <Link
                    key={r.type + "-" + r.id}
                    to={
                      r.type === "movie"
                        ? `/movie/${r.id}`
                        : r.type === "user"
                        ? `/account/${r.id}`
                        : r.type === "actor"
                        ? `/actor/${r.id}`
                        : r.type === "studio"
                        ? `/studio/${r.id}`
                        : "#"
                    }
                    className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 transition-colors border-b last:border-b-0"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearch("");
                    }}
                  >
                    {r.image && (
                      <img
                        src={r.image}
                        alt={r.label}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <span className="font-semibold">{r.label}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-base-300 text-base-content/70 font-mono">
                        {r.type === "movie" && "Film"}
                        {r.type === "user" && "Utilisateur"}
                        {r.type === "actor" && "Acteur"}
                        {r.type === "studio" && "Studio"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[9999] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="block sm:hidden">
                <Link to="/movies">🎬 Films</Link>
              </li>
              <li className="block sm:hidden">
                <Link to="/members">👥 Membre</Link>
              </li>
              <li className="block sm:hidden">
                <Link to="/tierlist">📋 Liste</Link>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="input input-bordered w-full"
                />
              </li>
            </ul>
          </div>
          <input
            type="checkbox"
            className="toggle theme-controller"
            checked={theme === "dark"}
            onChange={(e) => {
              const newTheme = e.target.checked ? "dark" : "light";
              setTheme(newTheme);
            }}
            aria-label="Changer de thème"
          />
          {user ? (
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle">
                <img
                  src={theme === "dark" ? test : accountIcon}
                  alt="Compte utilisateur"
                  className="h-8 w-8"
                />
              </button>
              <ul className="menu menu-sm dropdown-content mt-3 z-[9999] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/account" className="hover:text-primary">
                    👤 {user.username}
                  </Link>
                </li>
                {user.is_admin && (
                  <li>
                    <Link
                      to="/admin/verify-movies"
                      className="text-red-600 font-semibold"
                    >
                      Modération
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout}>Se déconnecter</button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="btn btn-ghost btn-circle"
            >
              <img
                src={theme === "dark" ? test : accountIcon}
                alt="Compte utilisateur"
                className="h-8 w-8"
              />
            </button>
          )}
        </div>
      </div>

      {/* Modal de connexion/inscription */}
      {isLoginModalOpen && !user && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeLoginModal}
        >
          <div
            className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-base-content">
                {isRegisterMode ? "Inscription" : "Connexion"}
              </h2>
              <button
                onClick={closeLoginModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            {isRegisterMode ? (
              <>
                <RegisterForm onSuccess={closeLoginModal} />
                <div className="text-center mt-2">
                  <button
                    className="link"
                    onClick={() => setIsRegisterMode(false)}
                  >
                    Déjà un compte ? Se connecter
                  </button>
                </div>
              </>
            ) : (
              <>
                <LoginForm onSuccess={handleLoginSuccess} />
                <div className="text-center mt-2">
                  <button className="link" onClick={openRegisterModal}>
                    Pas de compte ? S'inscrire
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
