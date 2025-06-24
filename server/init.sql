-- Base de données Wikinema
-- Schéma complet avec toutes les relations - Version PostgreSQL

-- Table des utilisateurs (authentification et profil)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    nationality VARCHAR(50),
    date_of_birth DATE,
    profile_picture VARCHAR(255),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Table des pays
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL -- ISO 3166-1 alpha-3
);

-- Table des genres de films
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Table des studios/producteurs
CREATE TABLE studios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INTEGER,
    founded_year INTEGER,
    logo VARCHAR(255),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Table des réalisateurs
CREATE TABLE directors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nationality_id INTEGER,
    date_of_birth DATE,
    date_of_death DATE,
    biography TEXT,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nationality_id) REFERENCES countries(id)
);

-- Table des acteurs
CREATE TABLE actors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nationality_id INTEGER,
    date_of_birth DATE,
    date_of_death DATE,
    biography TEXT,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nationality_id) REFERENCES countries(id)
);

-- Type ENUM pour les plateformes
CREATE TYPE platform_type AS ENUM ('streaming', 'cinema', 'tv', 'dvd', 'other');

-- Table des plateformes de streaming/diffusion
CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type platform_type NOT NULL,
    logo VARCHAR(255),
    website VARCHAR(255)
);

-- Type ENUM pour le statut des films
CREATE TYPE movie_status AS ENUM ('announced', 'in_production', 'post_production', 'released');

-- Table des films
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    original_title VARCHAR(200),
    synopsis TEXT,
    release_date DATE,
    duration INTEGER, -- en minutes
    poster VARCHAR(255),
    trailer_url VARCHAR(255),
    country_id INTEGER,
    language VARCHAR(50),
    budget BIGINT,
    box_office BIGINT,
    imdb_id VARCHAR(20),
    tmdb_id INTEGER,
    status movie_status DEFAULT 'released',
    is_verified BOOLEAN DEFAULT FALSE, -- vérifié par un admin
    added_by_user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (added_by_user_id) REFERENCES users(id)
);

-- Table de liaison films-réalisateurs
CREATE TABLE movie_directors (
    movie_id INTEGER,
    director_id INTEGER,
    role VARCHAR(50) DEFAULT 'Director', -- Director, Co-Director, etc.
    PRIMARY KEY (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE
);

-- Type ENUM pour les rôles d'acteurs
CREATE TYPE actor_role_type AS ENUM ('lead', 'supporting', 'cameo', 'voice');

-- Table de liaison films-acteurs
CREATE TABLE movie_actors (
    movie_id INTEGER,
    actor_id INTEGER,
    character_name VARCHAR(100),
    role_type actor_role_type DEFAULT 'supporting',
    order_index INTEGER, -- ordre d'apparition dans les crédits
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);

-- Type ENUM pour les rôles de studios
CREATE TYPE studio_role AS ENUM ('production', 'distribution', 'co_production');

-- Table de liaison films-studios
CREATE TABLE movie_studios (
    movie_id INTEGER,
    studio_id INTEGER,
    role studio_role DEFAULT 'production',
    PRIMARY KEY (movie_id, studio_id, role),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
);

-- Table de liaison films-genres
CREATE TABLE movie_genres (
    movie_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- Table de liaison films-plateformes
CREATE TABLE movie_platforms (
    movie_id INTEGER,
    platform_id INTEGER,
    available_from DATE,
    available_until DATE,
    rental_price DECIMAL(5,2),
    purchase_price DECIMAL(5,2),
    is_subscription BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (movie_id, platform_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- Table des reviews/critiques
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    title VARCHAR(200),
    content TEXT,
    contains_spoilers BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN,
    watch_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id) -- Un utilisateur ne peut faire qu'une review par film
);

-- Table des "likes" sur les reviews
CREATE TABLE review_likes (
    user_id INTEGER,
    review_id INTEGER,
    is_helpful BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, review_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Table des tier lists
CREATE TABLE tier_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des tiers (S, A, B, C, D, etc.)
CREATE TABLE tiers (
    id SERIAL PRIMARY KEY,
    tier_list_id INTEGER NOT NULL,
    name VARCHAR(20) NOT NULL, -- S, A, B, C, D, etc.
    color VARCHAR(7) DEFAULT '#FFFFFF', -- code couleur hex
    order_index INTEGER NOT NULL,
    FOREIGN KEY (tier_list_id) REFERENCES tier_lists(id) ON DELETE CASCADE,
    UNIQUE (tier_list_id, order_index)
);

-- Table des films dans les tier lists
CREATE TABLE tier_list_movies (
    tier_id INTEGER,
    movie_id INTEGER,
    order_index INTEGER,
    PRIMARY KEY (tier_id, movie_id),
    FOREIGN KEY (tier_id) REFERENCES tiers(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Table des collections/listes de films
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table de liaison collections-films
CREATE TABLE collection_movies (
    collection_id INTEGER,
    movie_id INTEGER,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (collection_id, movie_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Type ENUM pour la priorité de watchlist
CREATE TYPE watchlist_priority AS ENUM ('low', 'medium', 'high');

-- Table des watchlists (films à voir)
CREATE TABLE watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    priority watchlist_priority DEFAULT 'medium',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id)
);

-- Table des films vus
CREATE TABLE watched_movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    watched_at DATE DEFAULT CURRENT_DATE,
    watch_count INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id)
);

-- Table des follows entre utilisateurs
CREATE TABLE user_follows (
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (follower_id != following_id)
);

-- Table des commentaires sur les reviews
CREATE TABLE review_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    review_id INTEGER NOT NULL,
    parent_comment_id INTEGER, -- pour les réponses aux commentaires
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES review_comments(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- ex: 'new_follower', 'liked_review', 'comment_on_review'
    related_entity_id INTEGER, -- ex: user_id du follower, review_id, comment_id
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vue pour les statistiques des films
CREATE VIEW movie_stats AS
SELECT 
    m.id AS movie_id,
    m.title,
    COUNT(DISTINCT r.id) as review_count,
    AVG(r.rating) as average_rating,
    COUNT(DISTINCT w.user_id) as watched_count,
    COUNT(DISTINCT wl.user_id) as watchlist_count
FROM movies m
LEFT JOIN reviews r ON m.id = r.movie_id
LEFT JOIN watched_movies w ON m.id = w.movie_id
LEFT JOIN watchlists wl ON m.id = wl.movie_id
GROUP BY m.id, m.title;

-- Vue pour les statistiques des utilisateurs
CREATE VIEW user_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(DISTINCT r.id) as review_count,
    COUNT(DISTINCT w.movie_id) as watched_count,
    COUNT(DISTINCT tl.id) as tier_lists_count,
    AVG(r.rating) as average_rating_given
FROM users u
LEFT JOIN reviews r ON u.id = r.user_id
LEFT JOIN watched_movies w ON u.id = w.user_id
LEFT JOIN tier_lists tl ON u.id = tl.user_id
GROUP BY u.id, u.username;

-- Index pour optimiser les recherches
CREATE INDEX idx_movies_title_fulltext ON movies USING gin(to_tsvector('french', title || ' ' || COALESCE(original_title, '')));
CREATE INDEX idx_actors_name ON actors(first_name, last_name);
CREATE INDEX idx_directors_name ON directors(first_name, last_name);
CREATE INDEX idx_reviews_rating_date ON reviews(rating, created_at);
CREATE INDEX idx_movies_release_date ON movies(release_date);
CREATE INDEX idx_movies_country ON movies(country_id);