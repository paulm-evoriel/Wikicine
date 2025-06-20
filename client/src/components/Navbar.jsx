import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">🎬 Wikicine</Link>
      </div>
      <div className="flex gap-2">
        <Link to="/login" className="btn btn-outline btn-sm">Connexion</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Inscription</Link>
      </div>
    </div>
  )
}