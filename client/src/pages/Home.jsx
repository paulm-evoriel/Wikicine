import MovieCard from "../components/MovieCard";
import duneImg from "../../image/11.png";
import mousquetairesImg from "../../image/12.png";
import wonkaImg from "../../image/10.png";

export default function Home({ theme }) {
  return (
    <div className="pt-8 bg-base-100 text-base-content min-h-screen">
      <h1 className="pb-8 text-2xl font-bold text-center">Sortie cinéma</h1>
      <MovieCard />
      <button
        className={`btn mx-auto mt-8 block transition-none ${
          theme === "dark" ? "btn-outline" : "btn-neutral"
        }`}
      >
        Get Started
      </button>
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-base-200 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-2">
          Comment fonctionne Wikicine&nbsp;?
        </h2>
        <p>
          Wikicine est une plateforme collaborative dédiée au cinéma. Vous
          pouvez explorer les films à l'affiche, consulter des fiches
          détaillées, et créer un compte pour partager vos avis ou constituer
          votre propre liste de films. Utilisez la barre de recherche pour
          trouver rapidement un film, et naviguez facilement grâce à la barre de
          navigation en haut de la page. Rejoignez la communauté et enrichissez
          la base de données avec vos contributions&nbsp;!
        </p>
      </div>
      {/* Section Dernières reviews et Nouveaux films */}
      <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {/* Dernières reviews */}
        <div className="bg-base-200 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-center">
            Dernières reviews
          </h3>
          <ul className="space-y-4">
            <li>
              <span className="font-semibold">Inception</span> —{" "}
              <span className="italic">
                "Un chef-d'œuvre visuel et narratif, à voir absolument !"
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-500">
                  par Alice, il y a 2h
                </span>
              </div>
            </li>
            <li>
              <span className="font-semibold">
                Le Fabuleux Destin d'Amélie Poulain
              </span>{" "}
              —{" "}
              <span className="italic">
                "Poétique, drôle et touchant. Un film qui fait du bien."
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400">★★★★☆</span>
                <span className="text-sm text-gray-500">
                  par Bob, il y a 5h
                </span>
              </div>
            </li>
            <li>
              <span className="font-semibold">Interstellar</span> —{" "}
              <span className="italic">
                "Une expérience cinématographique bouleversante."
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-500">
                  par Clara, il y a 1j
                </span>
              </div>
            </li>
          </ul>
        </div>
        {/* Nouveaux films ajoutés */}
        <div className="bg-base-200 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-center">
            Nouveaux films ajoutés
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <img
                src={duneImg}
                alt="Dune: Deuxième Partie"
                className="w-12 h-16 object-cover rounded shadow"
              />
              <div>
                <span className="font-semibold">Dune: Deuxième Partie</span> —
                ajouté il y a 30 min
              </div>
            </li>
            <li className="flex items-center gap-3">
              <img
                src={mousquetairesImg}
                alt="Les Trois Mousquetaires: Milady"
                className="w-12 h-16 object-cover rounded shadow"
              />
              <div>
                <span className="font-semibold">
                  Les Trois Mousquetaires: Milady
                </span>{" "}
                — ajouté il y a 3h
              </div>
            </li>
            <li className="flex items-center gap-3">
              <img
                src={wonkaImg}
                alt="Wonka"
                className="w-12 h-16 object-cover rounded shadow"
              />
              <div>
                <span className="font-semibold">Wonka</span> — ajouté hier
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* Footer professionnel */}
      <footer className="bg-base-200 border-t border-base-300 mt-16 py-6 w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
          <div className="text-base-content text-sm text-center md:text-left">
            © {new Date().getFullYear()} Wikicine. Tous droits réservés.
          </div>
          <div className="flex gap-4 text-base-content text-sm justify-center">
            <a href="/" className="hover:underline">
              Accueil
            </a>
            <a href="#" className="hover:underline">
              À propos
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
