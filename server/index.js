const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "filmdb",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

app.get("/", (req, res) => {
  res.send("API is working");
});

// Route pour récupérer les films triés par box-office
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, poster, box_office FROM movies ORDER BY box_office DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des films" });
  }
});

// Derniers films ajoutés (10 plus récents)
app.get("/movies/latest", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, poster, created_at
      FROM movies
      ORDER BY created_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des derniers films" });
  }
});

// Dernières reviews (10 plus récentes)
app.get("/reviews/latest", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.rating, r.content, r.created_at, u.username, m.id as movie_id, m.title as movie_title, m.poster
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN movies m ON r.movie_id = m.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des dernières reviews" });
  }
});

// Route pour récupérer les détails d'un film par son ID
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Film non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération du film" });
  }
});

// Route pour récupérer le casting (réalisateurs et acteurs) d'un film
app.get("/movies/:id/cast", async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer les réalisateurs
    const directorsResult = await pool.query(
      `SELECT d.id, d.first_name, d.last_name, d.nationality_id, d.photo, md.role
       FROM movie_directors md
       JOIN directors d ON md.director_id = d.id
       WHERE md.movie_id = $1`,
      [id]
    );
    // Récupérer les acteurs
    const actorsResult = await pool.query(
      `SELECT a.id, a.first_name, a.last_name, a.nationality_id, a.photo, ma.character_name, ma.role_type
       FROM movie_actors ma
       JOIN actors a ON ma.actor_id = a.id
       WHERE ma.movie_id = $1
       ORDER BY ma.role_type DESC, a.last_name ASC` /* lead d'abord, puis supporting, etc. */,
      [id]
    );
    res.json({
      directors: directorsResult.rows,
      actors: actorsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du casting" });
  }
});

// Récupérer les reviews d'un film (pagination)
app.get("/movies/:id/reviews", async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  try {
    const reviewsResult = await pool.query(
      `SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = $1 ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM reviews WHERE movie_id = $1`, [id]
    );
    res.json({
      reviews: reviewsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des reviews" });
  }
});

// Ajouter une review (authentifié)
app.post("/movies/:id/reviews", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const { rating, content } = req.body;
  if (!rating) {
    return res.status(400).json({ error: "La note est obligatoire" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, movie_id, rating, content) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, id, rating, content || null]
    );
    res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Vous avez déjà noté ce film" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de l'ajout de la review" });
    }
  }
});

// Note moyenne du film
app.get("/movies/:id/rating", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT AVG(rating) as average_rating, COUNT(*) as count FROM reviews WHERE movie_id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération de la note moyenne" });
  }
});

// Inscription
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Utilisateur ou email déjà existant" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  }
});

// Connexion
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Middleware de vérification du JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
}

// Exemple de route protégée
app.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, first_name, last_name FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
});

// Recherche globale multi-table
app.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);
  const like = `%${q}%`;
  try {
    const [users, movies, actors, studios] = await Promise.all([
      pool.query(
        `SELECT id, username as label, profile_picture as image FROM users WHERE username ILIKE $1 LIMIT 5`,
        [like]
      ),
      pool.query(
        `SELECT id, title as label, poster as image FROM movies WHERE title ILIKE $1 LIMIT 5`,
        [like]
      ),
      pool.query(
        `SELECT id, CONCAT(first_name, ' ', last_name) as label, photo as image FROM actors WHERE first_name ILIKE $1 OR last_name ILIKE $1 LIMIT 5`,
        [like]
      ),
      pool.query(
        `SELECT id, name as label, logo as image FROM studios WHERE name ILIKE $1 LIMIT 5`,
        [like]
      ),
    ]);
    const results = [
      ...users.rows.map(r => ({ ...r, type: 'user' })),
      ...movies.rows.map(r => ({ ...r, type: 'movie' })),
      ...actors.rows.map(r => ({ ...r, type: 'actor' })),
      ...studios.rows.map(r => ({ ...r, type: 'studio' })),
    ];
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
});

// Autocomplete réalisateurs
app.get('/directors', async (req, res) => {
  const q = (req.query.q || '').trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name FROM directors WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY last_name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche de réalisateurs' });
  }
});

// Autocomplete acteurs
app.get('/actors', async (req, res) => {
  const q = (req.query.q || '').trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name FROM actors WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY last_name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche d\'acteurs' });
  }
});

// Autocomplete studios
app.get('/studios', async (req, res) => {
  const q = (req.query.q || '').trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, name FROM studios WHERE name ILIKE $1 ORDER BY name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche de studios' });
  }
});

// Autocomplete genres
app.get('/genres', async (req, res) => {
  const q = (req.query.q || '').trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, name FROM genres WHERE name ILIKE $1 ORDER BY name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche de genres' });
  }
});

// Autocomplete pays
app.get('/countries', async (req, res) => {
  const q = (req.query.q || '').trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, name, code FROM countries WHERE name ILIKE $1 OR code ILIKE $1 ORDER BY name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche de pays' });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
