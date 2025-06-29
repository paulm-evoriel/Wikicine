import { useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Autocomplete({ label, placeholder, fetchUrl, onSelect, renderOption, valueKey = 'name', allowAdd = false, onAddNew, inputValue, setInputValue }) {
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const search = async (q) => {
    setLoading(true);
    const res = await fetch(`${API_URL}${fetchUrl}?q=${encodeURIComponent(q)}`);
    setResults(await res.json());
    setLoading(false);
    setShow(true);
  };

  return (
    <div className="w-full mb-2 relative">
      <label className="block font-semibold mb-1">{label}</label>
      <input
        className="input input-bordered w-full"
        placeholder={placeholder}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          if (e.target.value.length > 1) search(e.target.value);
          else setShow(false);
        }}
        onFocus={e => { if (inputValue.length > 1) setShow(true); }}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        autoComplete="off"
      />
      {show && (results.length > 0 || allowAdd) && (
        <div className="absolute left-0 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-auto mt-1">
          {results.map(r => (
            <div
              key={r.id}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
              onClick={() => { onSelect(r); setShow(false); }}
            >
              {renderOption ? renderOption(r) : r[valueKey]}
            </div>
          ))}
          {allowAdd && inputValue && !loading && !results.some(r => r[valueKey]?.toLowerCase() === inputValue.toLowerCase()) && (
            <div className="px-4 py-2 text-primary cursor-pointer hover:bg-base-200" onClick={() => { onAddNew(inputValue); setShow(false); }}>
              Ajouter un nouvel élément : <b>{inputValue}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DragDropImage({ label, file, setFile, preview, setPreview, required }) {
  const inputRef = useRef();
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <label className="font-semibold mb-1">{label}{required && ' *'}</label>
      <div
        className="w-full border-2 border-dashed border-base-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-base-200 hover:bg-base-300 transition"
        onClick={() => inputRef.current.click()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
          }
        }}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="Aperçu" className="max-h-48 rounded shadow mb-2" />
        ) : (
          <span className="text-base-content/60">Glissez-déposez une image ici ou cliquez pour choisir</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const f = e.target.files[0];
            if (f) {
              setFile(f);
              setPreview(URL.createObjectURL(f));
            }
          }}
        />
      </div>
    </div>
  );
}

export default function AddMovie({ open, onClose, user }) {
  // Champs principaux
  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [budget, setBudget] = useState("");
  const [boxOffice, setBoxOffice] = useState("");
  const [imdbId, setImdbId] = useState("");
  const [tmdbId, setTmdbId] = useState("");
  const [status, setStatus] = useState("released");
  // Pays, genres, studios, réalisateurs, acteurs (listes dynamiques)
  const [country, setCountry] = useState(null);
  const [countryInput, setCountryInput] = useState("");
  const [genres, setGenres] = useState([]);
  const [genreInput, setGenreInput] = useState("");
  const [studios, setStudios] = useState([]); // [{studio, role}]
  const [studioInput, setStudioInput] = useState("");
  const [studioRoleInput, setStudioRoleInput] = useState("production");
  const [directors, setDirectors] = useState([]); // [{director}]
  const [directorInput, setDirectorInput] = useState("");
  const [actors, setActors] = useState([]); // [{actor, role, character_name}]
  const [actorInput, setActorInput] = useState("");
  const [actorRoleInput, setActorRoleInput] = useState("lead");
  const [actorCharInput, setActorCharInput] = useState("");
  // Poster drag & drop
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  // Validation
  const [error, setError] = useState("");

  // Gestion dynamique des listes
  const addGenre = g => setGenres([...genres, g]);
  const removeGenre = idx => setGenres(genres.filter((_, i) => i !== idx));
  const addStudio = (studio, role) => setStudios([...studios, { studio, role }]);
  const removeStudio = idx => setStudios(studios.filter((_, i) => i !== idx));
  const addDirector = (director) => setDirectors([...directors, { director }]);
  const removeDirector = idx => setDirectors(directors.filter((_, i) => i !== idx));
  const addActor = (actor, role, character_name) => setActors([...actors, { actor, role, character_name }]);
  const removeActor = idx => setActors(actors.filter((_, i) => i !== idx));

  // Validation à la soumission
  const isValid = !!(title && releaseDate && duration && language && country && genres.length && studios.length && directors.length && actors.length && posterFile && user);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!isValid) {
      setError("Merci de remplir tous les champs obligatoires et d'être connecté.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("originalTitle", originalTitle);
    formData.append("synopsis", synopsis);
    formData.append("releaseDate", releaseDate);
    formData.append("duration", duration);
    formData.append("trailerUrl", trailerUrl);
    formData.append("language", language);
    formData.append("budget", budget);
    formData.append("boxOffice", boxOffice);
    formData.append("imdbId", imdbId);
    formData.append("tmdbId", tmdbId);
    formData.append("status", status);
    formData.append("country", JSON.stringify(country));
    formData.append("genres", JSON.stringify(genres));
    formData.append("studios", JSON.stringify(studios));
    formData.append("directors", JSON.stringify(directors));
    formData.append("actors", JSON.stringify(actors));
    formData.append("poster", posterFile);
    try {
      const token = (user && user.token) || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
      const response = await fetch(`${API_URL}/movies`, {
        method: "POST",
        body: formData,
        headers
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout du film");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-base-100 p-8 rounded-xl shadow-xl w-full max-w-2xl mx-4 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <h2 className="text-2xl font-bold mb-6 text-center font-poppins">Ajouter un film</h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input className="input input-bordered w-full mb-2" placeholder="Titre du film *" value={title} onChange={e => setTitle(e.target.value)} required />
              <input className="input input-bordered w-full mb-2" placeholder="Titre original" value={originalTitle} onChange={e => setOriginalTitle(e.target.value)} />
              <textarea className="textarea textarea-bordered w-full mb-2" placeholder="Synopsis" value={synopsis} onChange={e => setSynopsis(e.target.value)} />
              <input className="input input-bordered w-full mb-2" type="date" placeholder="Date de sortie *" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required />
              <input className="input input-bordered w-full mb-2" type="number" min="1" placeholder="Durée (min) *" value={duration} onChange={e => setDuration(e.target.value)} required />
              <input className="input input-bordered w-full mb-2" placeholder="Langue *" value={language} onChange={e => setLanguage(e.target.value)} required />
              <input className="input input-bordered w-full mb-2" placeholder="Bande-annonce (URL)" value={trailerUrl} onChange={e => setTrailerUrl(e.target.value)} />
              <input className="input input-bordered w-full mb-2" type="number" placeholder="Budget ($)" value={budget} onChange={e => setBudget(e.target.value)} />
              <input className="input input-bordered w-full mb-2" type="number" placeholder="Box office ($)" value={boxOffice} onChange={e => setBoxOffice(e.target.value)} />
              <input className="input input-bordered w-full mb-2" placeholder="IMDB id" value={imdbId} onChange={e => setImdbId(e.target.value)} />
              <input className="input input-bordered w-full mb-2" placeholder="TMDB id" value={tmdbId} onChange={e => setTmdbId(e.target.value)} />
              <select className="select select-bordered w-full mb-2" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="announced">Annoncé</option>
                <option value="in_production">En production</option>
                <option value="post_production">Post-production</option>
                <option value="released">Sorti</option>
              </select>
              <Autocomplete
                label="Pays *"
                placeholder="Rechercher un pays..."
                fetchUrl="/countries"
                onSelect={c => { setCountry(c); setCountryInput(c.name); }}
                renderOption={c => `${c.name} (${c.code})`}
                valueKey="name"
                allowAdd={true}
                onAddNew={name => setCountry({ id: null, name, code: "" })}
                inputValue={countryInput}
                setInputValue={setCountryInput}
              />
            </div>
            <div>
              <DragDropImage label="Affiche du film" file={posterFile} setFile={setPosterFile} preview={posterPreview} setPreview={setPosterPreview} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold mb-1">Genres *</label>
              <div className="flex gap-2 mb-2">
                <Autocomplete
                  label=""
                  placeholder="Ajouter un genre..."
                  fetchUrl="/genres"
                  onSelect={g => { addGenre(g); setGenreInput(""); }}
                  valueKey="name"
                  allowAdd={true}
                  onAddNew={name => { addGenre({ id: null, name }); setGenreInput(""); }}
                  inputValue={genreInput}
                  setInputValue={setGenreInput}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.map((g, i) => (
                  <span key={i} className="badge badge-primary gap-2">{g.name} <button type="button" onClick={() => removeGenre(i)} className="ml-1">✕</button></span>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold mb-1">Studios *</label>
              <div className="flex gap-2 mb-2">
                <Autocomplete
                  label=""
                  placeholder="Ajouter un studio..."
                  fetchUrl="/studios"
                  onSelect={s => { addStudio(s, studioRoleInput); setStudioInput(""); }}
                  valueKey="name"
                  allowAdd={true}
                  onAddNew={name => { addStudio({ id: null, name }, studioRoleInput); setStudioInput(""); }}
                  inputValue={studioInput}
                  setInputValue={setStudioInput}
                />
                <select className="select select-bordered" value={studioRoleInput} onChange={e => setStudioRoleInput(e.target.value)}>
                  <option value="production">Production</option>
                  <option value="distribution">Distribution</option>
                  <option value="co_production">Co-production</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                {studios.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-base-200 rounded px-2 py-1">
                    <span>{s.studio.name}</span>
                    <span className="badge badge-outline">{s.role}</span>
                    <button type="button" onClick={() => removeStudio(i)} className="ml-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold mb-1">Réalisateurs *</label>
              <div className="flex gap-2 mb-2">
                <Autocomplete
                  label=""
                  placeholder="Ajouter un réalisateur..."
                  fetchUrl="/directors"
                  onSelect={d => { addDirector(d); setDirectorInput(""); }}
                  valueKey="last_name"
                  allowAdd={true}
                  onAddNew={name => { addDirector({ id: null, first_name: name, last_name: "" }); setDirectorInput(""); }}
                  inputValue={directorInput}
                  setInputValue={setDirectorInput}
                />
              </div>
              <div className="flex flex-col gap-2">
                {directors.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 bg-base-200 rounded px-2 py-1">
                    <span>{d.director.first_name} {d.director.last_name}</span>
                    <button type="button" onClick={() => removeDirector(i)} className="ml-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold mb-1">Acteurs *</label>
              <div className="flex gap-2 mb-2">
                <Autocomplete
                  label=""
                  placeholder="Ajouter un acteur..."
                  fetchUrl="/actors"
                  onSelect={a => { addActor(a, actorRoleInput, actorCharInput); setActorInput(""); setActorCharInput(""); }}
                  valueKey="last_name"
                  allowAdd={true}
                  onAddNew={name => { addActor({ id: null, first_name: name, last_name: "" }, actorRoleInput, actorCharInput); setActorInput(""); setActorCharInput(""); }}
                  inputValue={actorInput}
                  setInputValue={setActorInput}
                />
                <select className="select select-bordered" value={actorRoleInput} onChange={e => setActorRoleInput(e.target.value)}>
                  <option value="lead">Lead</option>
                  <option value="supporting">Supporting</option>
                  <option value="cameo">Cameo</option>
                  <option value="voice">Voice</option>
                </select>
                <input className="input input-bordered w-full" placeholder="Nom du personnage" value={actorCharInput} onChange={e => setActorCharInput(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                {actors.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 bg-base-200 rounded px-2 py-1">
                    <span>{a.actor.first_name} {a.actor.last_name}</span>
                    <span className="badge badge-outline">{a.role}</span>
                    {a.character_name && <span className="badge badge-info">{a.character_name}</span>}
                    <button type="button" onClick={() => removeActor(i)} className="ml-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button className="btn btn-primary mt-2" type="submit" disabled={!isValid}>Ajouter le film</button>
        </form>
      </div>
    </div>
  );
}
