import { useEffect, useRef, useState } from "react";

const images = [
  "/image/1.png",
  "/image/2.png",
  "/image/3.png",
  "/image/4.jpg",
  "/image/5.png",
  "/image/6.png",
  "/image/7.png",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // Pour afficher 3 images, centrée sur l'index courant
  const getVisibleImages = () => {
    const prev = (index - 1 + images.length) % images.length;
    const next = (index + 1) % images.length;
    return [prev, index, next];
  };

  const visible = getVisibleImages();

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 py-8">
      {visible.map((imgIdx, i) => (
        <img
          key={imgIdx}
          src={images[imgIdx]}
          alt={`Affiche ${imgIdx + 1}`}
          className={
            i === 1
              ? "w-40 h-60 sm:w-64 sm:h-96 object-cover rounded-xl shadow-2xl scale-110 z-10 transition-all duration-500"
              : "w-28 h-44 sm:w-48 sm:h-72 object-cover rounded-xl opacity-70 scale-95 transition-all duration-500"
          }
          style={{
            boxShadow: i === 1 ? "0 8px 32px rgba(0,0,0,0.3)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
