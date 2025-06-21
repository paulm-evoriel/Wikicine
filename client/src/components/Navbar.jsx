import { useState } from "react";
import { Link } from "react-router-dom";
import logoWikicine from "../../image/wikicine.svg";
import accountIcon from "../../image/account.svg";
import test from "../../image/test.png";

export default function Navbar({ theme, setTheme }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegisterMode && formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    // Ici vous pouvez ajouter la logique de connexion/inscription
    console.log("Données du formulaire:", formData);
    setIsLoginModalOpen(false);
    setFormData({ username: "", password: "", confirmPassword: "" });
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterMode(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setFormData({ username: "", password: "", confirmPassword: "" });
  };

  return (
    <>
      <div className="navbar bg-base-200">
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
        <div className="flex-1 flex justify-center items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            className="input input-bordered w-full max-w-xs hidden sm:block"
          />
          <button className="btn btn-sm ml-2 hidden sm:inline-block">
            🎬 Films
          </button>
          <button className="btn btn-sm hidden sm:inline-block">
            👥 Membre
          </button>
          <button className="btn btn-sm hidden sm:inline-block">
            📋 Liste
          </button>
        </div>
        <div className="flex items-center mr-0 sm:mr-4 gap-2">
          <div className="sm:hidden dropdown dropdown-end">
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
              <li>
                <a>🎬 Films</a>
              </li>
              <li>
                <a>👥 Membre</a>
              </li>
              <li>
                <a>📋 Liste</a>
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
          <button onClick={openLoginModal} className="btn btn-ghost btn-circle">
            <img
              src={theme === "dark" ? test : accountIcon}
              alt="Compte utilisateur"
              className="h-8 w-8"
            />
          </button>
        </div>
      </div>

      {/* Modal de connexion/inscription */}
      {isLoginModalOpen && (
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-base-content">
                    Nom d'utilisateur
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200 text-base-content"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-base-content">
                    Mot de passe
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200 text-base-content"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>

              {isRegisterMode && (
                <div>
                  <label className="label">
                    <span className="label-text text-base-content">
                      Confirmer le mot de passe
                    </span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-base-200 text-base-content"
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                {isRegisterMode ? "S'inscrire" : "Se connecter"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="btn btn-link text-base-content"
              >
                {isRegisterMode
                  ? "Déjà un compte ? Se connecter"
                  : "Pas de compte ? S'inscrire"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
