import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddMovie from "../components/Add_movie";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MoviesPage({ user }) {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des films");
        setLoading(false);
      });
  }, []);

  // Top 3 box office
  const top3 = [...movies]
    .sort((a, b) => (b.box_office || 0) - (a.box_office || 0))
    .slice(0, 3);
  const top3Ids = new Set(top3.map(m => m.id));

  useEffect(() => {
    let res = movies.filter(m => !top3Ids.has(m.id));
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(m => m.title.toLowerCase().includes(s));
    }
    res.sort((a, b) => {
      let v1 = a[sort], v2 = b[sort];
      if (sort === "box_office") {
        v1 = v1 || 0; v2 = v2 || 0;
      }
      if (v1 == null) return 1;
      if (v2 == null) return -1;
      if (typeof v1 === "string") {
        v1 = v1.toLowerCase(); v2 = v2.toLowerCase();
      }
      if (v1 < v2) return sortDir === "asc" ? -1 : 1;
      if (v1 > v2) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    setFiltered(res);
  }, [movies, search, sort, sortDir]);

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
    <div className="pt-12 bg-base-100 text-base-content min-h-screen">
      <h1 className="pb-8 text-3xl font-bold text-center font-poppins">Tous les films</h1>
      {/* Top 3 Box Office */}
      <div className="flex justify-center items-end gap-8 px-4 mb-12">
        {[1, 0, 2].map((orderIdx, i) => {
          const movie = top3[orderIdx];
          if (!movie) return null;
          let marginBottom = "";
          if (i === 1) marginBottom = "mb-16";
          else marginBottom = "mb-4";
          return (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div
                className={`relative w-64 ${marginBottom} transition-transform duration-300 hover:-translate-y-4 hover:scale-105`}
              >
                <img
                  src={movie.poster}
                  alt={`Film classé n°${orderIdx + 1}`}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div
                  className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg bg-yellow-400 text-black`}
                >
                  <span>{orderIdx + 1}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Recherche et tri */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center max-w-5xl mx-auto mb-8 px-2">
        <input
          type="text"
          placeholder="Rechercher un film..."
          className="input input-bordered w-full md:w-1/2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <label className="font-montserrat">Trier par :</label>
          <select className="select select-bordered" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="title">Titre</option>
            <option value="release_date">Date de sortie</option>
            <option value="box_office">Box Office</option>
          </select>
          <button className="btn btn-ghost" onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}>{sortDir === "asc" ? "▲" : "▼"}</button>
        </div>
      </div>
      {/* Grille des films */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-2">
        {filtered.length === 0 && <div className="col-span-full text-center">Aucun film trouvé.</div>}
        {filtered.map(movie => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
            <div className="relative rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform h-96 flex flex-col">
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3">
                <h2 className="font-bold text-lg font-montserrat text-white drop-shadow-lg">{movie.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <AddMovie open={showAdd} onClose={() => setShowAdd(false)} user={user} />
      <button
        className={`fixed bottom-8 right-8 z-50 btn btn-primary btn-lg rounded-full shadow-xl flex items-center gap-2 ${!user ? 'btn-disabled opacity-60 cursor-not-allowed' : ''}`}
        style={{ padding: '0.9rem 1.4rem', fontSize: '1.7rem' }}
        onClick={() => user && setShowAdd(true)}
        aria-label="Ajouter un film"
        disabled={!user}
      >
        <span className="text-2xl">＋</span>
      </button>
    </div>
  );
}
