-- Ajoute un utilisateur fictif "admin" si aucun utilisateur n'existe encore
INSERT INTO users (id, username, email)
VALUES (1, 'admin', 'admin@example.com')
ON CONFLICT DO NOTHING;

-- Pays
INSERT INTO countries (name, code)
VALUES ('China', 'CHN')
    ON CONFLICT DO NOTHING;

-- Studio
INSERT INTO studios (name, country_id)
VALUES (
           'Beijing Enlight Pictures', (SELECT id FROM countries WHERE code='CHN')
       )
    ON CONFLICT DO NOTHING;

-- Réalisateur
INSERT INTO directors (first_name, last_name, nationality_id)
VALUES ('Jiaozi','', (SELECT id FROM countries WHERE code='CHN'))
    ON CONFLICT DO NOTHING;

-- Film
INSERT INTO movies (title, original_title, synopsis, release_date, duration, country_id, language, budget, box_office, status, added_by_user_id)
VALUES (
           'Ne Zha 2', 'Ne Zha 2',
           'Sequel to Ne Zha – animated fantasy action adventure.',
           '2025-01-29', 144,
           (SELECT id FROM countries WHERE code='CHN'),
           'Mandarin',
           80000000, 2200000000,
           'released',
           1
       )
    ON CONFLICT DO NOTHING;

-- Liaison film-studio (production)
INSERT INTO movie_studios (movie_id, studio_id, role)
VALUES (
           (SELECT id FROM movies WHERE title='Ne Zha 2'),
           (SELECT id FROM studios WHERE name='Beijing Enlight Pictures'),
           'production'
       )
    ON CONFLICT DO NOTHING;

-- Liaison film-director
INSERT INTO movie_directors (movie_id, director_id)
VALUES (
           (SELECT id FROM movies WHERE title='Ne Zha 2'),
           (SELECT id FROM directors WHERE first_name='Jiaozi')
       )
    ON CONFLICT DO NOTHING;

INSERT INTO countries (name, code)
VALUES ('United States', 'USA')
    ON CONFLICT DO NOTHING;

INSERT INTO studios (name, country_id)
VALUES ('Warner Bros.', (SELECT id FROM countries WHERE code='USA'))
    ON CONFLICT DO NOTHING;

-- Réalisateur fictif
INSERT INTO directors (first_name, last_name, nationality_id)
VALUES ('Unknown','Director', (SELECT id FROM countries WHERE code='USA'))
    ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, synopsis, release_date, duration, country_id, language, budget, box_office, status, added_by_user_id)
VALUES (
           'A Minecraft Movie','A Minecraft Movie',
           'Adaptation of the popular sandbox game.',
           '2025-04-04', 0,
           (SELECT id FROM countries WHERE code='USA'),
           'en',
           0, 954000000,
           'released',
           1
       )
    ON CONFLICT DO NOTHING;

INSERT INTO movie_studios (movie_id, studio_id, role)
VALUES (
           (SELECT id FROM movies WHERE title='A Minecraft Movie'),
           (SELECT id FROM studios WHERE name='Warner Bros.'),
           'production'
       )
    ON CONFLICT DO NOTHING;

INSERT INTO movie_directors (movie_id, director_id)
VALUES (
           (SELECT id FROM movies WHERE title='A Minecraft Movie'),
           (SELECT id FROM directors WHERE first_name='Unknown' AND last_name='Director')
       )
    ON CONFLICT DO NOTHING;

INSERT INTO countries (name, code)
VALUES ('United States', 'USA')
    ON CONFLICT DO NOTHING;

INSERT INTO studios (name, country_id)
VALUES ('Disney', (SELECT id FROM countries WHERE code='USA'))
    ON CONFLICT DO NOTHING;

INSERT INTO directors (first_name, last_name, nationality_id)
VALUES ('Unknown','Director', (SELECT id FROM countries WHERE code='USA'))
    ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, synopsis, release_date, duration, country_id, language, budget, box_office, status, added_by_user_id)
VALUES (
           'Lilo & Stitch','Lilo & Stitch',
           'Live‑action adaptation of Disney classic.',
           '2025-05-21', 0,
           (SELECT id FROM countries WHERE code='USA'),
           'en',
           0, 911000000,
           'released',
           1
       )
    ON CONFLICT DO NOTHING;

INSERT INTO movie_studios (movie_id, studio_id, role)
VALUES (
           (SELECT id FROM movies WHERE title='Lilo & Stitch'),
           (SELECT id FROM studios WHERE name='Disney'),
           'production'
       )
    ON CONFLICT DO NOTHING;

INSERT INTO movie_directors (movie_id, director_id)
VALUES (
           (SELECT id FROM movies WHERE title='Lilo & Stitch'),
           (SELECT id FROM directors WHERE first_name='Unknown' AND last_name='Director')
       )
    ON CONFLICT DO NOTHING;
