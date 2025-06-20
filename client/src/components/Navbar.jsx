import { Link } from "react-router-dom";
import logoWikicine from "../../image/wikicine.svg";
import accountIcon from "../../image/account.svg";

export default function Navbar() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex">
        <Link to="/" className="btn btn-ghost text-xl">
          <img src={logoWikicine} alt="Logo Wikicine" className="h-10 w-auto" />
          Wikicine
        </Link>
      </div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher un film..."
          className="input input-bordered w-full max-w-xs"
        />
        <button className="btn btn-sm ml-2">🎬 Films</button>
        <button className="btn btn-sm">👥 Membre</button>
        <button className="btn btn-sm">📋 Liste</button>
      </div>
      <div className="flex items-center mr-4 gap-2">
        <input
          type="checkbox"
          className="toggle theme-controller"
          onChange={(e) => {
            const theme = e.target.checked ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", theme);
          }}
          aria-label="Changer de thème"
        />
        <Link to="/login" className="btns ">
          <img
            src={accountIcon}
            alt="Compte utilisateur"
            className="h-10 w-10"
          />
        </Link>
      </div>
    </div>
  );
}
