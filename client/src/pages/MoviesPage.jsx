import img2 from "../../image/3.png";
import img5 from "../../image/5.png";
import img6 from "../../image/1.png";

export default function MoviesPage() {
  const movies = [
    {
      id: 2,
      src: img5,
      rank: 2,
      bgColor: "bg-slate-300",
      textColor: "text-black",
    }, // Argent (gauche)
    {
      id: 1,
      src: img2,
      rank: 1,
      bgColor: "bg-yellow-400",
      textColor: "text-black",
    }, // Or (milieu)
    {
      id: 3,
      src: img6,
      rank: 3,
      bgColor: "bg-orange-500",
      textColor: "text-black",
    }, // Bronze (droite)
  ];

  return (
    <div className="pt-24 bg-base-100 text-base-content min-h-screen">
      <h1 className="pb-8 text-2xl font-bold text-center">
        Classement du jour
      </h1>
      <div className="flex justify-center items-end gap-8 px-4">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`relative w-64 ${
              index === 1 ? "mb-16" : index === 0 ? "mb-4" : "mb-0"
            }`}
          >
            <img
              src={movie.src}
              alt={`Film classé n°${movie.rank}`}
              className="rounded-lg shadow-lg w-full h-auto"
            />
            <div
              className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg ${movie.bgColor} ${movie.textColor}`}
            >
              <span>{movie.rank}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
