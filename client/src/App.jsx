import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MoviesPage from "./pages/MoviesPage";
import TierList from "./pages/TierList";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <Navbar theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route
          path="/tierlist"
          element={<TierList theme={theme} setTheme={setTheme} />}
        />
      </Routes>
    </div>
  );
}
