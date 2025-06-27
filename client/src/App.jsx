import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import Register from "./components/Register";
import TierList from "./pages/TierList";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          else setUser(null);
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div>
      <Navbar theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={<Home theme={theme} user={user} setUser={setUser} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<MoviesPage user={user} />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route
          path="/tierlist"
          element={<TierList theme={theme} setTheme={setTheme} />}
        />
      </Routes>
    </div>
  );
}
