--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: actor_role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.actor_role_type AS ENUM (
    'lead',
    'supporting',
    'cameo',
    'voice'
);


ALTER TYPE public.actor_role_type OWNER TO postgres;

--
-- Name: movie_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.movie_status AS ENUM (
    'announced',
    'in_production',
    'post_production',
    'released'
);


ALTER TYPE public.movie_status OWNER TO postgres;

--
-- Name: platform_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.platform_type AS ENUM (
    'streaming',
    'cinema',
    'tv',
    'dvd',
    'other'
);


ALTER TYPE public.platform_type OWNER TO postgres;

--
-- Name: studio_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.studio_role AS ENUM (
    'production',
    'distribution',
    'co_production'
);


ALTER TYPE public.studio_role OWNER TO postgres;

--
-- Name: watchlist_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.watchlist_priority AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public.watchlist_priority OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actors (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    nationality_id integer,
    date_of_birth date,
    date_of_death date,
    biography text,
    photo character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.actors OWNER TO postgres;

--
-- Name: actors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.actors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actors_id_seq OWNER TO postgres;

--
-- Name: actors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.actors_id_seq OWNED BY public.actors.id;


--
-- Name: collection_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collection_movies (
    collection_id integer NOT NULL,
    movie_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.collection_movies OWNER TO postgres;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_public boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- Name: collections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.collections_id_seq OWNER TO postgres;

--
-- Name: collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(3) NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directors (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    nationality_id integer,
    date_of_birth date,
    date_of_death date,
    biography text,
    photo character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.directors OWNER TO postgres;

--
-- Name: directors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.directors_id_seq OWNER TO postgres;

--
-- Name: directors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directors_id_seq OWNED BY public.directors.id;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: movie_actors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_actors (
    movie_id integer NOT NULL,
    actor_id integer NOT NULL,
    character_name character varying(100),
    role_type public.actor_role_type DEFAULT 'supporting'::public.actor_role_type,
    order_index integer
);


ALTER TABLE public.movie_actors OWNER TO postgres;

--
-- Name: movie_directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_directors (
    movie_id integer NOT NULL,
    director_id integer NOT NULL,
    role character varying(50) DEFAULT 'Director'::character varying
);


ALTER TABLE public.movie_directors OWNER TO postgres;

--
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movie_genres OWNER TO postgres;

--
-- Name: movie_platforms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_platforms (
    movie_id integer NOT NULL,
    platform_id integer NOT NULL,
    available_from date,
    available_until date,
    rental_price numeric(5,2),
    purchase_price numeric(5,2),
    is_subscription boolean DEFAULT false
);


ALTER TABLE public.movie_platforms OWNER TO postgres;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    original_title character varying(200),
    synopsis text,
    release_date date,
    duration integer,
    poster character varying(255),
    trailer_url character varying(255),
    country_id integer,
    language character varying(50),
    budget bigint,
    box_office bigint,
    imdb_id character varying(20),
    tmdb_id integer,
    status public.movie_status DEFAULT 'released'::public.movie_status,
    is_verified boolean DEFAULT false,
    added_by_user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    rating numeric(3,1),
    title character varying(200),
    content text,
    contains_spoilers boolean DEFAULT false,
    is_recommended boolean,
    watch_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (10)::numeric)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: watched_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watched_movies (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    watched_at date DEFAULT CURRENT_DATE,
    watch_count integer DEFAULT 1
);


ALTER TABLE public.watched_movies OWNER TO postgres;

--
-- Name: watchlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watchlists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    priority public.watchlist_priority DEFAULT 'medium'::public.watchlist_priority,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.watchlists OWNER TO postgres;

--
-- Name: movie_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.movie_stats AS
 SELECT m.id AS movie_id,
    m.title,
    count(DISTINCT r.id) AS review_count,
    avg(r.rating) AS average_rating,
    count(DISTINCT w.user_id) AS watched_count,
    count(DISTINCT wl.user_id) AS watchlist_count
   FROM (((public.movies m
     LEFT JOIN public.reviews r ON ((m.id = r.movie_id)))
     LEFT JOIN public.watched_movies w ON ((m.id = w.movie_id)))
     LEFT JOIN public.watchlists wl ON ((m.id = wl.movie_id)))
  GROUP BY m.id, m.title;


ALTER TABLE public.movie_stats OWNER TO postgres;

--
-- Name: movie_studios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_studios (
    movie_id integer NOT NULL,
    studio_id integer NOT NULL,
    role public.studio_role DEFAULT 'production'::public.studio_role NOT NULL
);


ALTER TABLE public.movie_studios OWNER TO postgres;

--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movies_id_seq OWNER TO postgres;

--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(50) NOT NULL,
    related_entity_id integer,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: platforms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platforms (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    type public.platform_type NOT NULL,
    logo character varying(255),
    website character varying(255)
);


ALTER TABLE public.platforms OWNER TO postgres;

--
-- Name: platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platforms_id_seq OWNER TO postgres;

--
-- Name: platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platforms_id_seq OWNED BY public.platforms.id;


--
-- Name: review_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    review_id integer NOT NULL,
    parent_comment_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.review_comments OWNER TO postgres;

--
-- Name: review_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_comments_id_seq OWNER TO postgres;

--
-- Name: review_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_comments_id_seq OWNED BY public.review_comments.id;


--
-- Name: review_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_likes (
    user_id integer NOT NULL,
    review_id integer NOT NULL,
    is_helpful boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.review_likes OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: studios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.studios (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country_id integer,
    founded_year integer,
    logo character varying(255),
    description text,
    website character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.studios OWNER TO postgres;

--
-- Name: studios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.studios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.studios_id_seq OWNER TO postgres;

--
-- Name: studios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.studios_id_seq OWNED BY public.studios.id;


--
-- Name: tier_list_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tier_list_movies (
    tier_id integer NOT NULL,
    movie_id integer NOT NULL,
    order_index integer
);


ALTER TABLE public.tier_list_movies OWNER TO postgres;

--
-- Name: tier_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tier_lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    is_public boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tier_lists OWNER TO postgres;

--
-- Name: tier_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tier_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tier_lists_id_seq OWNER TO postgres;

--
-- Name: tier_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tier_lists_id_seq OWNED BY public.tier_lists.id;


--
-- Name: tiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiers (
    id integer NOT NULL,
    tier_list_id integer NOT NULL,
    name character varying(20) NOT NULL,
    color character varying(7) DEFAULT '#FFFFFF'::character varying,
    order_index integer NOT NULL
);


ALTER TABLE public.tiers OWNER TO postgres;

--
-- Name: tiers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tiers_id_seq OWNER TO postgres;

--
-- Name: tiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tiers_id_seq OWNED BY public.tiers.id;


--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_follows (
    follower_id integer NOT NULL,
    following_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_follows_check CHECK ((follower_id <> following_id))
);


ALTER TABLE public.user_follows OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    nationality character varying(50),
    date_of_birth date,
    profile_picture character varying(255),
    bio text,
    is_verified boolean DEFAULT false,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: user_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.user_stats AS
 SELECT u.id AS user_id,
    u.username,
    count(DISTINCT r.id) AS review_count,
    count(DISTINCT w.movie_id) AS watched_count,
    count(DISTINCT tl.id) AS tier_lists_count,
    avg(r.rating) AS average_rating_given
   FROM (((public.users u
     LEFT JOIN public.reviews r ON ((u.id = r.user_id)))
     LEFT JOIN public.watched_movies w ON ((u.id = w.user_id)))
     LEFT JOIN public.tier_lists tl ON ((u.id = tl.user_id)))
  GROUP BY u.id, u.username;


ALTER TABLE public.user_stats OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: watched_movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.watched_movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.watched_movies_id_seq OWNER TO postgres;

--
-- Name: watched_movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.watched_movies_id_seq OWNED BY public.watched_movies.id;


--
-- Name: watchlists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.watchlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.watchlists_id_seq OWNER TO postgres;

--
-- Name: watchlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.watchlists_id_seq OWNED BY public.watchlists.id;


--
-- Name: actors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors ALTER COLUMN id SET DEFAULT nextval('public.actors_id_seq'::regclass);


--
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: directors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors ALTER COLUMN id SET DEFAULT nextval('public.directors_id_seq'::regclass);


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: platforms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platforms ALTER COLUMN id SET DEFAULT nextval('public.platforms_id_seq'::regclass);


--
-- Name: review_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_comments ALTER COLUMN id SET DEFAULT nextval('public.review_comments_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: studios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.studios ALTER COLUMN id SET DEFAULT nextval('public.studios_id_seq'::regclass);


--
-- Name: tier_lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier_lists ALTER COLUMN id SET DEFAULT nextval('public.tier_lists_id_seq'::regclass);


--
-- Name: tiers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiers ALTER COLUMN id SET DEFAULT nextval('public.tiers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: watched_movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_movies ALTER COLUMN id SET DEFAULT nextval('public.watched_movies_id_seq'::regclass);


--
-- Name: watchlists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlists ALTER COLUMN id SET DEFAULT nextval('public.watchlists_id_seq'::regclass);


--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actors (id, first_name, last_name, nationality_id, date_of_birth, date_of_death, biography, photo, created_at) FROM stdin;
1	Margot	Robbie	1	\N	\N	\N	\N	2025-06-25 17:07:57.113377
2	Tom	Cruise	1	\N	\N	\N	\N	2025-06-25 17:07:57.113377
3	Robert	Downey Jr.	1	\N	\N	\N	\N	2025-06-25 17:07:57.113377
4	Leonardo	DiCaprio	1	1974-11-11	\N	\N	\N	2025-06-27 13:52:59.066463
5	Brad	Pitt	1	1963-12-18	\N	\N	\N	2025-06-27 13:52:59.066463
6	Tom	Cruise	1	1962-07-03	\N	\N	\N	2025-06-27 13:52:59.066463
7	Morgan	Freeman	1	1937-06-01	\N	\N	\N	2025-06-27 13:52:59.066463
8	Robert	De Niro	1	1943-08-17	\N	\N	\N	2025-06-27 13:52:59.066463
\.


--
-- Data for Name: collection_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collection_movies (collection_id, movie_id, added_at) FROM stdin;
\.


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collections (id, user_id, name, description, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, name, code) FROM stdin;
1	United States	USA
2	China	CHN
3	United Kingdom	GBR
5	France	FRA
6	Japon	JPN
\.


--
-- Data for Name: directors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directors (id, first_name, last_name, nationality_id, date_of_birth, date_of_death, biography, photo, created_at) FROM stdin;
1	Christopher	Nolan	3	\N	\N	\N	\N	2025-06-25 17:07:57.063678
2	Greta	Gerwig	1	\N	\N	\N	\N	2025-06-25 17:07:57.063678
3	James	Cameron	1	\N	\N	\N	\N	2025-06-25 17:07:57.063678
4	Christopher	Nolan	3	1970-07-30	\N	\N	\N	2025-06-27 13:52:59.012557
5	Martin	Scorsese	1	1942-11-17	\N	\N	\N	2025-06-27 13:52:59.012557
6	Quentin	Tarantino	1	1963-03-27	\N	\N	\N	2025-06-27 13:52:59.012557
7	Steven	Spielberg	1	1946-12-18	\N	\N	\N	2025-06-27 13:52:59.012557
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (id, name, description) FROM stdin;
1	Action	\N
2	Adventure	\N
3	Animation	\N
4	Comedy	\N
5	Drama	\N
6	Science Fiction	\N
7	Fantasy	\N
8	Drame	Films dramatiques
9	Science-Fiction	Films de science-fiction
10	Comédie	Films humoristiques
11	Aventure	Films d'aventure
\.


--
-- Data for Name: movie_actors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_actors (movie_id, actor_id, character_name, role_type, order_index) FROM stdin;
1	1	\N	lead	\N
4	4	Dom Cobb	lead	\N
8	4	Jordan Belfort	lead	\N
12	8	James Conway	lead	\N
6	8	Vito Corleone	lead	\N
5	7	Red	lead	\N
13	4	Calvin Candie	supporting	\N
11	6	Captain Miller	lead	\N
11	2	Captain Miller	lead	\N
7	5	Floyd	supporting	\N
\.


--
-- Data for Name: movie_directors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_directors (movie_id, director_id, role) FROM stdin;
1	2	Director
2	1	Director
3	3	Director
1	1	Director
6	1	Director
3	2	Director
5	2	Director
4	3	Director
10	3	Director
7	4	Director
8	4	Director
\.


--
-- Data for Name: movie_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_genres (movie_id, genre_id) FROM stdin;
1	4
2	5
3	6
\.


--
-- Data for Name: movie_platforms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_platforms (movie_id, platform_id, available_from, available_until, rental_price, purchase_price, is_subscription) FROM stdin;
\.


--
-- Data for Name: movie_studios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_studios (movie_id, studio_id, role) FROM stdin;
1	2	production
2	1	production
3	4	production
10	1	production
8	1	distribution
12	2	production
9	2	distribution
5	2	distribution
4	2	production
11	5	distribution
9	5	production
8	5	production
6	5	production
12	6	production
9	6	distribution
5	6	distribution
4	6	production
10	7	production
8	7	distribution
11	8	distribution
9	8	production
8	8	production
6	8	production
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (id, title, original_title, synopsis, release_date, duration, poster, trailer_url, country_id, language, budget, box_office, imdb_id, tmdb_id, status, is_verified, added_by_user_id, created_at, updated_at) FROM stdin;
1	Barbie	Barbie	Une poupée vivant dans Barbieland est expulsée du pays pour être loin d'être assez parfaite.	2023-07-21	114	/image/1.png	\N	1	en	145000000	1441000000	\N	\N	released	f	1	2025-06-25 17:07:57.155331	2025-06-25 17:07:57.155331
2	Oppenheimer	Oppenheimer	L'histoire du scientifique américain J. Robert Oppenheimer et de son rôle dans le développement de la bombe atomique.	2023-07-21	180	/image/2.png	\N	1	en	100000000	950000000	\N	\N	released	f	1	2025-06-25 17:07:57.155331	2025-06-25 17:07:57.155331
3	Avatar: La Voie de l'eau	Avatar: The Way of Water	Jake Sully et Neytiri ont formé une famille et font tout pour rester aussi soudés que possible.	2022-12-14	192	/image/3.png	\N	1	en	350000000	2320000000	\N	\N	released	f	1	2025-06-25 17:07:57.155331	2025-06-25 17:07:57.155331
4	Inception	Inception	Dom Cobb est un voleur expérimenté, le meilleur dans l'art dangereux de l'extraction : sa spécialité consiste à s'approprier les secrets les plus précieux d'un individu, enfouis au plus profond de son subconscient, pendant qu'il rêve et que son esprit est particulièrement vulnérable.	2010-07-16	148	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
5	Les Évadés	The Shawshank Redemption	En 1947, Andy Dufresne, un banquier, est condamné à la prison à vie pour le meurtre de sa femme et de son amant. Ayant beau clamer son innocence, il est emprisonné à Shawshank, le pénitencier d'État du Maine. Il y fait la rencontre de Red, un contrebandier noir américain emprisonné depuis vingt ans.	1994-09-23	142	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
6	Le Parrain	The Godfather	En 1945, à New York, les Corleone sont une des cinq familles de la mafia. Don Vito Corleone, 'parrain' de cette famille, marie sa fille à un bookmaker. Sollozzo, 'parrain' de la famille Tattaglia, propose à Don Vito une association dans le trafic de drogue, mais celui-ci refuse.	1972-03-24	175	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
7	Pulp Fiction	Pulp Fiction	L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent. Dans un restaurant, un couple de jeunes braqueurs, Pumpkin et Honey Bunny, discutent des risques que comporte leur activité.	1994-10-14	154	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
8	Le Loup de Wall Street	The Wolf of Wall Street	L'histoire vraie de Jordan Belfort, un courtier en bourse qui passa vingt mois en prison pour avoir refusé de participer à une gigantesque arnaque, dévoilant la corruption et l'implication de la pègre qui sévit derrière les portes closes de Wall Street.	2013-12-25	180	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
9	Interstellar	Interstellar	Dans un futur proche, la Terre est devenue hostile pour l'homme. Les tempêtes de sable sont fréquentes et les récoltes de plus en plus rares. Cooper, un ancien pilote de la NASA, vit avec sa famille dans une ferme. Avec sa fille Murphy, il découvre que des phénomènes étranges se produisent dans sa maison.	2014-11-07	169	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
10	Les Dents de la mer	Jaws	À quelques jours du début de la saison estivale, les habitants de la petite station balnéaire d'Amity sont mis en émoi par la découverte sur le littoral du corps atrocement mutilé d'une jeune vacancière. Pour Martin Brody, le nouveau chef de la police, il ne fait aucun doute que la jeune fille a été victime d'un requin.	1975-06-20	124	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
11	Il faut sauver le soldat Ryan	Saving Private Ryan	Lors du débarquement des forces alliées en Normandie, trois frères Ryan sont tués au combat. Leur mère, qui vient de recevoir trois télégrammes annonçant leur mort, est effondrée. Le chef d'état-major décide alors d'envoyer une escouade pour retrouver et rapatrier le dernier des frères Ryan.	1998-07-24	169	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
12	Les Affranchis	Goodfellas	Brooklyn, dans les années 1950. Depuis l'enfance, le petit Henry Hill rêve de devenir gangster. À l'âge de onze ans, il intègre la "famille" de Paul Cicero, un caïd local, et commence par travailler pour lui, effectuant ses premières livraisons.	1990-09-19	146	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
13	Django Unchained	Django Unchained	Dans le sud des États-Unis, deux ans avant la guerre de Sécession, le Dr King Schultz, un chasseur de primes allemand, fait l'acquisition de Django, un esclave qui peut l'aider à traquer les frères Brittle, les meurtriers qu'il recherche.	2012-12-25	165	\N	\N	1	English	\N	\N	\N	\N	released	f	\N	2025-06-27 13:52:59.419577	2025-06-27 13:52:59.419577
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, related_entity_id, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: platforms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platforms (id, name, type, logo, website) FROM stdin;
\.


--
-- Data for Name: review_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_comments (id, user_id, review_id, parent_comment_id, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: review_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_likes (user_id, review_id, is_helpful, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, movie_id, rating, title, content, contains_spoilers, is_recommended, watch_date, created_at, updated_at) FROM stdin;
1	3	3	8.0	\N	Super film !	f	\N	\N	2025-06-27 09:12:09.666421	2025-06-27 09:12:09.666421
\.


--
-- Data for Name: studios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.studios (id, name, country_id, founded_year, logo, description, website, created_at) FROM stdin;
1	Universal Pictures	1	\N	\N	\N	\N	2025-06-25 17:07:56.984721
2	Warner Bros.	1	\N	\N	\N	\N	2025-06-25 17:07:56.984721
3	Walt Disney Pictures	1	\N	\N	\N	\N	2025-06-25 17:07:56.984721
4	20th Century Studios	1	\N	\N	\N	\N	2025-06-25 17:07:56.984721
5	Paramount Pictures	1	\N	\N	\N	\N	2025-06-25 17:07:56.984721
6	Warner Bros.	1	1923	\N	\N	\N	2025-06-27 13:52:58.590192
7	Universal Pictures	1	1912	\N	\N	\N	2025-06-27 13:52:58.590192
8	Paramount Pictures	1	1912	\N	\N	\N	2025-06-27 13:52:58.590192
9	20th Century Studios	1	1935	\N	\N	\N	2025-06-27 13:52:58.590192
\.


--
-- Data for Name: tier_list_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tier_list_movies (tier_id, movie_id, order_index) FROM stdin;
\.


--
-- Data for Name: tier_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tier_lists (id, user_id, title, description, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiers (id, tier_list_id, name, color, order_index) FROM stdin;
\.


--
-- Data for Name: user_follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_follows (follower_id, following_id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, first_name, last_name, nationality, date_of_birth, profile_picture, bio, is_verified, is_admin, created_at, updated_at, last_login) FROM stdin;
1	admin	admin@wikinema.com	hashed_password_placeholder	\N	\N	\N	\N	\N	\N	f	t	2025-06-25 17:07:56.847541	2025-06-25 17:07:56.847541	\N
2	testuser	test@example.com	$2b$10$A3hKRN6cv8GygyxZAcCf9usvrrKFNTjJKyF2jrnrxp/xWD9I.ezhu	\N	\N	\N	\N	\N	\N	f	f	2025-06-26 12:33:42.258345	2025-06-26 12:33:42.258345	\N
3	titi	titi@mail.com	$2b$10$QJVQkD6EZ5rJtH3J1KUt/.wm9J8ptoulDMeg8dNNYNsa87.DFPOF6	\N	\N	\N	\N	\N	\N	f	f	2025-06-26 12:48:52.68838	2025-06-26 12:48:52.68838	\N
\.


--
-- Data for Name: watched_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watched_movies (id, user_id, movie_id, watched_at, watch_count) FROM stdin;
\.


--
-- Data for Name: watchlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watchlists (id, user_id, movie_id, priority, added_at) FROM stdin;
\.


--
-- Name: actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.actors_id_seq', 8, true);


--
-- Name: collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.collections_id_seq', 1, false);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 6, true);


--
-- Name: directors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directors_id_seq', 7, true);


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_id_seq', 11, true);


--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_id_seq', 13, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: platforms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platforms_id_seq', 1, false);


--
-- Name: review_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_comments_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 3, true);


--
-- Name: studios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.studios_id_seq', 9, true);


--
-- Name: tier_lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tier_lists_id_seq', 1, false);


--
-- Name: tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiers_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: watched_movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.watched_movies_id_seq', 1, false);


--
-- Name: watchlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.watchlists_id_seq', 1, false);


--
-- Name: actors actors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pkey PRIMARY KEY (id);


--
-- Name: collection_movies collection_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_movies
    ADD CONSTRAINT collection_movies_pkey PRIMARY KEY (collection_id, movie_id);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: countries countries_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code_key UNIQUE (code);


--
-- Name: countries countries_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_name_key UNIQUE (name);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: directors directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (id);


--
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: movie_actors movie_actors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_actors
    ADD CONSTRAINT movie_actors_pkey PRIMARY KEY (movie_id, actor_id);


--
-- Name: movie_directors movie_directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_directors
    ADD CONSTRAINT movie_directors_pkey PRIMARY KEY (movie_id, director_id);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);


--
-- Name: movie_platforms movie_platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_platforms
    ADD CONSTRAINT movie_platforms_pkey PRIMARY KEY (movie_id, platform_id);


--
-- Name: movie_studios movie_studios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_studios
    ADD CONSTRAINT movie_studios_pkey PRIMARY KEY (movie_id, studio_id, role);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: platforms platforms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_name_key UNIQUE (name);


--
-- Name: platforms platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_pkey PRIMARY KEY (id);


--
-- Name: review_comments review_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_pkey PRIMARY KEY (id);


--
-- Name: review_likes review_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_pkey PRIMARY KEY (user_id, review_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_movie_id_key UNIQUE (user_id, movie_id);


--
-- Name: studios studios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.studios
    ADD CONSTRAINT studios_pkey PRIMARY KEY (id);


--
-- Name: tier_list_movies tier_list_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier_list_movies
    ADD CONSTRAINT tier_list_movies_pkey PRIMARY KEY (tier_id, movie_id);


--
-- Name: tier_lists tier_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier_lists
    ADD CONSTRAINT tier_lists_pkey PRIMARY KEY (id);


--
-- Name: tiers tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiers
    ADD CONSTRAINT tiers_pkey PRIMARY KEY (id);


--
-- Name: tiers tiers_tier_list_id_order_index_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiers
    ADD CONSTRAINT tiers_tier_list_id_order_index_key UNIQUE (tier_list_id, order_index);


--
-- Name: user_follows user_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (follower_id, following_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: watched_movies watched_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_movies
    ADD CONSTRAINT watched_movies_pkey PRIMARY KEY (id);


--
-- Name: watched_movies watched_movies_user_id_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_movies
    ADD CONSTRAINT watched_movies_user_id_movie_id_key UNIQUE (user_id, movie_id);


--
-- Name: watchlists watchlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_pkey PRIMARY KEY (id);


--
-- Name: watchlists watchlists_user_id_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_user_id_movie_id_key UNIQUE (user_id, movie_id);


--
-- Name: idx_actors_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_actors_name ON public.actors USING btree (first_name, last_name);


--
-- Name: idx_directors_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_directors_name ON public.directors USING btree (first_name, last_name);


--
-- Name: idx_movies_country; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movies_country ON public.movies USING btree (country_id);


--
-- Name: idx_movies_release_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movies_release_date ON public.movies USING btree (release_date);


--
-- Name: idx_movies_title_fulltext; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movies_title_fulltext ON public.movies USING gin (to_tsvector('french'::regconfig, (((title)::text || ' '::text) || (COALESCE(original_title, ''::character varying))::text)));


--
-- Name: idx_reviews_rating_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating_date ON public.reviews USING btree (rating, created_at);


--
-- Name: actors actors_nationality_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_nationality_id_fkey FOREIGN KEY (nationality_id) REFERENCES public.countries(id);


--
-- Name: collection_movies collection_movies_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_movies
    ADD CONSTRAINT collection_movies_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: collection_movies collection_movies_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection_movies
    ADD CONSTRAINT collection_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: collections collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: directors directors_nationality_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_nationality_id_fkey FOREIGN KEY (nationality_id) REFERENCES public.countries(id);


--
-- Name: movie_actors movie_actors_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_actors
    ADD CONSTRAINT movie_actors_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.actors(id) ON DELETE CASCADE;


--
-- Name: movie_actors movie_actors_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_actors
    ADD CONSTRAINT movie_actors_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_directors movie_directors_director_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_directors
    ADD CONSTRAINT movie_directors_director_id_fkey FOREIGN KEY (director_id) REFERENCES public.directors(id) ON DELETE CASCADE;


--
-- Name: movie_directors movie_directors_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_directors
    ADD CONSTRAINT movie_directors_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_platforms movie_platforms_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_platforms
    ADD CONSTRAINT movie_platforms_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_platforms movie_platforms_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_platforms
    ADD CONSTRAINT movie_platforms_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id) ON DELETE CASCADE;


--
-- Name: movie_studios movie_studios_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_studios
    ADD CONSTRAINT movie_studios_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_studios movie_studios_studio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_studios
    ADD CONSTRAINT movie_studios_studio_id_fkey FOREIGN KEY (studio_id) REFERENCES public.studios(id) ON DELETE CASCADE;


--
-- Name: movies movies_added_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_added_by_user_id_fkey FOREIGN KEY (added_by_user_id) REFERENCES public.users(id);


--
-- Name: movies movies_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_comments review_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.review_comments(id) ON DELETE CASCADE;


--
-- Name: review_comments review_comments_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_comments review_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_likes review_likes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_likes review_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: studios studios_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.studios
    ADD CONSTRAINT studios_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: tier_list_movies tier_list_movies_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier_list_movies
    ADD CONSTRAINT tier_list_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: tier_list_movies tier_list_movies_tier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier_list_movies
    ADD CONSTRAINT tier_list_movies_tier_id_fkey FOREIGN KEY (tier_id) REFERENCES public.tiers(id) ON DELETE CASCADE;


--
-- Name: tier_lists tier_lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier_lists
    ADD CONSTRAINT tier_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tiers tiers_tier_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiers
    ADD CONSTRAINT tiers_tier_list_id_fkey FOREIGN KEY (tier_list_id) REFERENCES public.tier_lists(id) ON DELETE CASCADE;


--
-- Name: user_follows user_follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_follows user_follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: watched_movies watched_movies_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_movies
    ADD CONSTRAINT watched_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: watched_movies watched_movies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_movies
    ADD CONSTRAINT watched_movies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: watchlists watchlists_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: watchlists watchlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

