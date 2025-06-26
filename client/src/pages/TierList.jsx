import { useState } from "react";
import img1 from "../../image/1.png";
import img2 from "../../image/2.png";
import img3 from "../../image/3.png";

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
const affiches = [
  { id: 1, src: img1 },
  { id: 2, src: img2 },
  { id: 3, src: img3 },
];

export default function TierList({ theme, setTheme }) {
  // Pour chaque affiche, on stocke la catégorie sélectionnée (ou null)
  const [afficheCategories, setAfficheCategories] = useState({
    1: null,
    2: null,
    3: null,
  });

  // Déplacer une affiche dans une catégorie
  const handleSetCategory = (afficheId, cat) => {
    setAfficheCategories((prev) => ({ ...prev, [afficheId]: cat }));
  };

  const handleUnassign = (afficheId) => {
    setAfficheCategories((prev) => ({ ...prev, [afficheId]: null }));
  };

  return (
    <div className="mt-8 w-full flex flex-col gap-6 px-8 sm:px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Tier List</h1>
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
                <img
                  key={affiche.id}
                  src={affiche.src}
                  alt={`Affiche ${affiche.id}`}
                  className="h-24 w-auto rounded shadow-lg border-2 border-black cursor-pointer hover:scale-105 transition"
                  onClick={() => handleUnassign(affiche.id)}
                  title="Clique pour retirer l'affiche de la catégorie"
                />
              ))}
          </div>
        </div>
      ))}
      {/* Affiches non classées */}
      <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 shadow mt-8 w-full">
        <div className="font-bold mb-2 text-lg">Non classées</div>
        <div className="flex gap-8 flex-wrap justify-center w-full">
          {affiches.filter((a) => !afficheCategories[a.id]).length === 0 && (
            <div className="text-sm text-base-content/50">Aucune affiche</div>
          )}
          {affiches
            .filter((a) => !afficheCategories[a.id])
            .map((affiche) => (
              <div key={affiche.id} className="flex flex-col items-center mb-2">
                <img
                  src={affiche.src}
                  alt={`Affiche ${affiche.id}`}
                  className="h-24 w-auto rounded mb-2 shadow-lg border"
                />
                <div className="flex gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      className={`btn btn-xs btn-outline ${
                        categoryColors[cat.key]
                      }`}
                      onClick={() => handleSetCategory(affiche.id, cat.key)}
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
