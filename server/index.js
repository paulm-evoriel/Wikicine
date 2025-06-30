const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// Configurer multer pour stocker l'image dans /client/image
const imageDir = path.join(__dirname, "../client/image");
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("API is working");
});

// Middleware pour vérifier si l'utilisateur est admin OU renvoyer son profil
function getUserFromToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Route pour récupérer les films triés par box-office (public : seulement les vérifiés, admin : tous)
app.get("/movies", async (req, res) => {
  const user = getUserFromToken(req);
  const isAdmin = user
    ? await pool
        .query("SELECT is_admin FROM users WHERE id = $1", [user.id])
        .then((r) => r.rows[0]?.is_admin)
    : false;
  try {
    const result = await pool.query(
      isAdmin
        ? "SELECT id, title, poster, box_office FROM movies ORDER BY box_office DESC"
        : "SELECT id, title, poster, box_office FROM movies WHERE is_verified = true ORDER BY box_office DESC"
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
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des derniers films" });
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
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des dernières reviews" });
  }
});

// Route pour récupérer les détails d'un film par son ID (public : seulement vérifié, admin : tout)
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const user = getUserFromToken(req);
  const isAdmin = user
    ? await pool
        .query("SELECT is_admin FROM users WHERE id = $1", [user.id])
        .then((r) => r.rows[0]?.is_admin)
    : false;
  try {
    const result = await pool.query(
      "SELECT * FROM movies WHERE id = $1" +
        (isAdmin ? "" : " AND is_verified = true"),
      [id]
    );
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
      `SELECT COUNT(*) FROM reviews WHERE movie_id = $1`,
      [id]
    );
    res.json({
      reviews: reviewsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des reviews" });
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
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la note moyenne" });
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
      "SELECT id, username, email, first_name, last_name, is_admin, is_verified FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
});

// Récupérer les films notés par l'utilisateur connecté
app.get("/my-reviewed-movies", authenticateToken, async (req, res) => {
  try {
    console.log("Recherche des films notés pour l'utilisateur:", req.user.id);

    const result = await pool.query(
      `SELECT m.id, m.title, m.poster, m.release_date, r.rating, r.created_at as review_date
       FROM movies m
       JOIN reviews r ON m.id = r.movie_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    console.log("Résultats trouvés:", result.rows.length);
    console.log(
      "Films trouvés:",
      result.rows.map((r) => ({ id: r.id, title: r.title, rating: r.rating }))
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des films notés:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des films notés" });
  }
});

// Récupérer la tier list personnelle de l'utilisateur
app.get("/my-tierlist", authenticateToken, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a déjà une tier list
    let tierListResult = await pool.query(
      "SELECT id FROM tier_lists WHERE user_id = $1 LIMIT 1",
      [req.user.id]
    );

    let tierListId;
    if (tierListResult.rows.length === 0) {
      // Créer une nouvelle tier list pour l'utilisateur
      const newTierList = await pool.query(
        "INSERT INTO tier_lists (user_id, title, description) VALUES ($1, $2, $3) RETURNING id",
        [req.user.id, "Ma Tier List", "Tier list personnelle"]
      );
      tierListId = newTierList.rows[0].id;

      // Créer les tiers par défaut (S, A, B, C, D)
      const defaultTiers = [
        { name: "S", color: "#FFD700", order: 1 },
        { name: "A", color: "#FF6B6B", order: 2 },
        { name: "B", color: "#4ECDC4", order: 3 },
        { name: "C", color: "#45B7D1", order: 4 },
        { name: "D", color: "#96CEB4", order: 5 },
      ];

      for (const tier of defaultTiers) {
        await pool.query(
          "INSERT INTO tiers (tier_list_id, name, color, order_index) VALUES ($1, $2, $3, $4)",
          [tierListId, tier.name, tier.color, tier.order]
        );
      }
    } else {
      tierListId = tierListResult.rows[0].id;
    }

    // Récupérer la tier list complète avec les films classés
    const result = await pool.query(
      `SELECT 
        t.id as tier_id,
        t.name as tier_name,
        t.color as tier_color,
        tlm.movie_id,
        tlm.order_index,
        m.title,
        m.poster,
        m.id as movie_id
       FROM tiers t
       LEFT JOIN tier_list_movies tlm ON t.id = tlm.tier_id
       LEFT JOIN movies m ON tlm.movie_id = m.id
       WHERE t.tier_list_id = $1
       ORDER BY t.order_index, tlm.order_index`,
      [tierListId]
    );

    // Organiser les données par tier
    const tierList = {};
    result.rows.forEach((row) => {
      if (!tierList[row.tier_name]) {
        tierList[row.tier_name] = {
          id: row.tier_id,
          color: row.tier_color,
          movies: [],
        };
      }
      if (row.movie_id) {
        tierList[row.tier_name].movies.push({
          id: row.movie_id,
          title: row.title,
          poster: row.poster,
        });
      }
    });

    res.json(tierList);
  } catch (err) {
    console.error("Erreur lors de la récupération de la tier list:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la tier list" });
  }
});

// Sauvegarder la tier list personnelle de l'utilisateur
app.post("/my-tierlist", authenticateToken, async (req, res) => {
  try {
    const { tierList } = req.body; // Format: { "S": { movies: [...] }, "A": { movies: [...] }, ... }

    // Récupérer ou créer la tier list de l'utilisateur
    let tierListResult = await pool.query(
      "SELECT id FROM tier_lists WHERE user_id = $1 LIMIT 1",
      [req.user.id]
    );

    let tierListId;
    if (tierListResult.rows.length === 0) {
      const newTierList = await pool.query(
        "INSERT INTO tier_lists (user_id, title, description) VALUES ($1, $2, $3) RETURNING id",
        [req.user.id, "Ma Tier List", "Tier list personnelle"]
      );
      tierListId = newTierList.rows[0].id;
    } else {
      tierListId = tierListResult.rows[0].id;
    }

    // Récupérer les IDs des tiers
    const tiersResult = await pool.query(
      "SELECT id, name FROM tiers WHERE tier_list_id = $1",
      [tierListId]
    );

    // Vider les anciens classements
    await pool.query(
      "DELETE FROM tier_list_movies WHERE tier_id IN (SELECT id FROM tiers WHERE tier_list_id = $1)",
      [tierListId]
    );

    // Insérer les nouveaux classements
    for (const [tierName, tierData] of Object.entries(tierList)) {
      const tier = tiersResult.rows.find((t) => t.name === tierName);
      if (tier && tierData.movies) {
        for (let i = 0; i < tierData.movies.length; i++) {
          const movie = tierData.movies[i];
          await pool.query(
            "INSERT INTO tier_list_movies (tier_id, movie_id, order_index) VALUES ($1, $2, $3)",
            [tier.id, movie.id, i]
          );
        }
      }
    }

    res.json({ success: true, message: "Tier list sauvegardée avec succès" });
  } catch (err) {
    console.error("Erreur lors de la sauvegarde de la tier list:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la sauvegarde de la tier list" });
  }
});

// Récupérer les avis de l'utilisateur connecté
app.get("/my-reviews", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, m.title as movie_title, m.poster, m.id as movie_id
       FROM reviews r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des avis:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des avis" });
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
      ...users.rows.map((r) => ({ ...r, type: "user" })),
      ...movies.rows.map((r) => ({ ...r, type: "movie" })),
      ...actors.rows.map((r) => ({ ...r, type: "actor" })),
      ...studios.rows.map((r) => ({ ...r, type: "studio" })),
    ];
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
});

// Autocomplete réalisateurs
app.get("/directors", async (req, res) => {
  const q = (req.query.q || "").trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name FROM directors WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY last_name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche de réalisateurs" });
  }
});

// Autocomplete acteurs
app.get("/actors", async (req, res) => {
  const q = (req.query.q || "").trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name FROM actors WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY last_name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche d'acteurs" });
  }
});

// Autocomplete studios
app.get("/studios", async (req, res) => {
  const q = (req.query.q || "").trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, name FROM studios WHERE name ILIKE $1 ORDER BY name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche de studios" });
  }
});

// Autocomplete genres
app.get("/genres", async (req, res) => {
  const q = (req.query.q || "").trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, name FROM genres WHERE name ILIKE $1 ORDER BY name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche de genres" });
  }
});

// Autocomplete pays
app.get("/countries", async (req, res) => {
  const q = (req.query.q || "").trim();
  const like = `%${q}%`;
  try {
    const result = await pool.query(
      `SELECT id, name, code FROM countries WHERE name ILIKE $1 OR code ILIKE $1 ORDER BY name LIMIT 10`,
      [like]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche de pays" });
  }
});

// Middleware pour vérifier si l'utilisateur est admin
function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Non authentifié" });
  pool
    .query("SELECT is_admin FROM users WHERE id = $1", [req.user.id])
    .then((result) => {
      if (result.rows[0]?.is_admin) return next();
      return res.status(403).json({ error: "Accès réservé aux admins" });
    })
    .catch(() => res.status(500).json({ error: "Erreur serveur" }));
}

// Route admin : liste des films non vérifiés
app.get(
  "/admin/unverified-movies",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM movies WHERE is_verified = false ORDER BY created_at DESC"
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de la récupération des films non vérifiés",
      });
    }
  }
);

// Route admin : valider un film
app.patch(
  "/movies/:id/verify",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "UPDATE movies SET is_verified = true WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Film non trouvé" });
      res.json({ success: true, movie: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la validation du film" });
    }
  }
);

// Route admin : refuser un film (is_verified à false)
app.patch(
  "/movies/:id/unverify",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "UPDATE movies SET is_verified = false WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Film non trouvé" });
      res.json({ success: true, movie: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors du refus du film" });
    }
  }
);

// Ajouter un film (authentifié)
app.post(
  "/movies",
  authenticateToken,
  upload.single("poster"),
  async (req, res) => {
    try {
      const {
        title,
        originalTitle,
        synopsis,
        releaseDate,
        duration,
        trailerUrl,
        language,
        budget,
        boxOffice,
        imdbId,
        tmdbId,
        status,
      } = req.body;
      const country = JSON.parse(req.body.country);
      const genres = JSON.parse(req.body.genres);
      const studios = JSON.parse(req.body.studios);
      const directors = JSON.parse(req.body.directors);
      const actors = JSON.parse(req.body.actors);
      if (
        !title ||
        !releaseDate ||
        !duration ||
        !language ||
        !country ||
        !genres.length ||
        !studios.length ||
        !directors.length ||
        !actors.length ||
        !req.file
      ) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }
      // Chemin relatif pour la base
      const posterPath = `image/${req.file.filename}`;
      // Insérer le pays si besoin
      let countryId = country.id;
      if (!countryId) {
        const cRes = await pool.query(
          "INSERT INTO countries (name, code) VALUES ($1, $2) RETURNING id",
          [country.name, country.code || ""]
        );
        countryId = cRes.rows[0].id;
      }
      // Fonction pour convertir les champs numériques vides en null
      const safeInt = (v) => (v === "" || v === undefined ? null : v);
      // Insérer le film
      const filmRes = await pool.query(
        `INSERT INTO movies (title, original_title, synopsis, release_date, duration, poster, trailer_url, country_id, language, budget, box_office, imdb_id, tmdb_id, status, added_by_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
        [
          title,
          originalTitle,
          synopsis,
          releaseDate,
          duration,
          posterPath,
          trailerUrl,
          countryId,
          language,
          safeInt(budget),
          safeInt(boxOffice),
          imdbId || null,
          safeInt(tmdbId),
          status,
          req.user.id,
        ]
      );
      const movieId = filmRes.rows[0].id;
      // Genres
      for (const g of genres) {
        let genreId = g.id;
        if (!genreId) {
          const gRes = await pool.query(
            "INSERT INTO genres (name) VALUES ($1) RETURNING id",
            [g.name]
          );
          genreId = gRes.rows[0].id;
        }
        await pool.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [movieId, genreId]
        );
      }
      // Studios
      for (const s of studios) {
        let studioId = s.studio.id;
        if (!studioId) {
          const sRes = await pool.query(
            "INSERT INTO studios (name) VALUES ($1) RETURNING id",
            [s.studio.name]
          );
          studioId = sRes.rows[0].id;
        }
        await pool.query(
          "INSERT INTO movie_studios (movie_id, studio_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
          [movieId, studioId, s.role]
        );
      }
      // Réalisateurs
      for (const d of directors) {
        let directorId = d.director.id;
        if (!directorId) {
          const dRes = await pool.query(
            "INSERT INTO directors (first_name, last_name) VALUES ($1, $2) RETURNING id",
            [d.director.first_name, d.director.last_name]
          );
          directorId = dRes.rows[0].id;
        }
        await pool.query(
          "INSERT INTO movie_directors (movie_id, director_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [movieId, directorId]
        );
      }
      // Acteurs
      let orderIdx = 0;
      for (const a of actors) {
        let actorId = a.actor.id;
        if (!actorId) {
          const aRes = await pool.query(
            "INSERT INTO actors (first_name, last_name) VALUES ($1, $2) RETURNING id",
            [a.actor.first_name, a.actor.last_name]
          );
          actorId = aRes.rows[0].id;
        }
        await pool.query(
          "INSERT INTO movie_actors (movie_id, actor_id, character_name, role_type, order_index) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
          [movieId, actorId, a.character_name, a.role, orderIdx++]
        );
      }
      res.status(201).json({ success: true, movie_id: movieId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de l'ajout du film" });
    }
  }
);

// Route pour vérifier un utilisateur (admin seulement)
app.put("/users/:id/verify", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET is_verified = true WHERE id = $1 RETURNING id, is_verified",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Utilisateur vérifié avec succès",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la vérification de l'utilisateur" });
  }
});

// Route pour annuler la vérification d'un utilisateur (admin seulement)
app.put("/users/:id/unverify", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET is_verified = false WHERE id = $1 RETURNING id, is_verified",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Vérification de l'utilisateur annulée avec succès",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur lors de l'annulation de la vérification de l'utilisateur",
    });
  }
});

// Route pour récupérer la liste des utilisateurs
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.created_at,
        u.is_verified,
        u.is_admin,
        COUNT(r.id) as reviews_count
      FROM users u
      LEFT JOIN reviews r ON u.id = r.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// Route pour récupérer les détails d'un utilisateur
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, username, email, first_name, last_name, nationality, bio, created_at, is_verified, is_admin FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
});

// Route pour récupérer les avis d'un utilisateur spécifique
app.get("/users/:id/reviews", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        r.*,
        m.title as movie_title,
        m.poster
      FROM reviews r
      JOIN movies m ON r.movie_id = m.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des avis" });
  }
});

// Route pour récupérer la tier list d'un utilisateur spécifique
app.get("/users/:id/tierlist", async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifie d'abord si l'utilisateur existe
    const userExists = await pool.query("SELECT id FROM users WHERE id = $1", [
      id,
    ]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Récupérer l'ID de la tier list de l'utilisateur
    let tierListResult = await pool.query(
      "SELECT id FROM tier_lists WHERE user_id = $1 LIMIT 1",
      [id]
    );

    let tierListId;
    if (tierListResult.rows.length === 0) {
      // Créer une nouvelle tier list pour l'utilisateur
      const newTierList = await pool.query(
        "INSERT INTO tier_lists (user_id, title, description) VALUES ($1, $2, $3) RETURNING id",
        [id, "Ma Tier List", "Tier list personnelle"]
      );
      tierListId = newTierList.rows[0].id;

      // Créer les tiers par défaut (S, A, B, C, D)
      const defaultTiers = [
        { name: "S", color: "#FFD700", order: 1 },
        { name: "A", color: "#FF6B6B", order: 2 },
        { name: "B", color: "#4ECDC4", order: 3 },
        { name: "C", color: "#45B7D1", order: 4 },
        { name: "D", color: "#96CEB4", order: 5 },
      ];

      for (const tier of defaultTiers) {
        await pool.query(
          "INSERT INTO tiers (tier_list_id, name, color, order_index) VALUES ($1, $2, $3, $4)",
          [tierListId, tier.name, tier.color, tier.order]
        );
      }
    } else {
      tierListId = tierListResult.rows[0].id;
    }

    // Récupérer la tier list complète avec les films classés
    const result = await pool.query(
      `SELECT 
        t.id as tier_id,
        t.name as tier_name,
        t.color as tier_color,
        t.order_index as tier_order,
        tlm.movie_id,
        tlm.order_index,
        m.title,
        m.poster,
        m.id as movie_id
       FROM tiers t
       LEFT JOIN tier_list_movies tlm ON t.id = tlm.tier_id
       LEFT JOIN movies m ON tlm.movie_id = m.id
       WHERE t.tier_list_id = $1
       ORDER BY t.order_index, tlm.order_index NULLS LAST`,
      [tierListId]
    );

    // Organiser les données par tier
    const tierList = {};
    result.rows.forEach((row) => {
      if (!tierList[row.tier_name]) {
        tierList[row.tier_name] = {
          id: row.tier_id,
          color: row.tier_color,
          order: row.tier_order,
          movies: [],
        };
      }
      if (row.movie_id) {
        tierList[row.tier_name].movies.push({
          id: row.movie_id,
          title: row.title,
          poster: row.poster,
        });
      }
    });

    res.json(tierList);
  } catch (err) {
    console.error("Erreur lors de la récupération de la tier list:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la tier list" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
