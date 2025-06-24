-- Création de l'utilisateur admin
INSERT INTO users (id, username, email, password_hash, is_admin)
VALUES (1, 'admin', 'admin@wikinema.com', 'hashed_password_placeholder', true)
ON CONFLICT DO NOTHING;

-- Ajout des pays principaux
INSERT INTO countries (name, code) VALUES
                                       ('United States', 'USA'),
                                       ('China', 'CHN'),
                                       ('United Kingdom', 'GBR')
ON CONFLICT DO NOTHING;

-- Ajout des studios majeurs
INSERT INTO studios (name, country_id) VALUES
                                           ('Universal Pictures', (SELECT id FROM countries WHERE code='USA')),
                                           ('Warner Bros.', (SELECT id FROM countries WHERE code='USA')),
                                           ('Walt Disney Pictures', (SELECT id FROM countries WHERE code='USA')),
                                           ('20th Century Studios', (SELECT id FROM countries WHERE code='USA')),
                                           ('Paramount Pictures', (SELECT id FROM countries WHERE code='USA'))
ON CONFLICT DO NOTHING;

-- Ajout des genres
INSERT INTO genres (name) VALUES
                              ('Action'),
                              ('Adventure'),
                              ('Animation'),
                              ('Comedy'),
                              ('Drama'),
                              ('Science Fiction'),
                              ('Fantasy')
ON CONFLICT DO NOTHING;

-- Ajout des réalisateurs
INSERT INTO directors (first_name, last_name, nationality_id) VALUES
                                                                  ('Christopher', 'Nolan', (SELECT id FROM countries WHERE code='GBR')),
                                                                  ('Greta', 'Gerwig', (SELECT id FROM countries WHERE code='USA')),
                                                                  ('James', 'Cameron', (SELECT id FROM countries WHERE code='USA'))
ON CONFLICT DO NOTHING;

-- Ajout des acteurs principaux
INSERT INTO actors (first_name, last_name, nationality_id) VALUES
                                                               ('Margot', 'Robbie', (SELECT id FROM countries WHERE code='USA')),
                                                               ('Tom', 'Cruise', (SELECT id FROM countries WHERE code='USA')),
                                                               ('Robert', 'Downey Jr.', (SELECT id FROM countries WHERE code='USA'))
ON CONFLICT DO NOTHING;

-- Ajout des films
INSERT INTO movies (
    title,
    original_title,
    synopsis,
    release_date,
    duration,
    country_id,
    language,
    budget,
    box_office,
    status,
    added_by_user_id
) VALUES
      (
          'Barbie',
          'Barbie',
          'Une poupée vivant dans Barbieland est expulsée du pays pour être loin d''être assez parfaite.',
          '2023-07-21',
          114,
          (SELECT id FROM countries WHERE code='USA'),
          'en',
          145000000,
          1441000000,
          'released',
          1
      ),
      (
          'Oppenheimer',
          'Oppenheimer',
          'L''histoire du scientifique américain J. Robert Oppenheimer et de son rôle dans le développement de la bombe atomique.',
          '2023-07-21',
          180,
          (SELECT id FROM countries WHERE code='USA'),
          'en',
          100000000,
          950000000,
          'released',
          1
      ),
      (
          'Avatar: La Voie de l''eau',
          'Avatar: The Way of Water',
          'Jake Sully et Neytiri ont formé une famille et font tout pour rester aussi soudés que possible.',
          '2022-12-14',
          192,
          (SELECT id FROM countries WHERE code='USA'),
          'en',
          350000000,
          2320000000,
          'released',
          1
      )
ON CONFLICT DO NOTHING;

-- Associations films-réalisateurs
INSERT INTO movie_directors (movie_id, director_id) VALUES
                                                        ((SELECT id FROM movies WHERE title='Barbie'),
                                                         (SELECT id FROM directors WHERE first_name='Greta' AND last_name='Gerwig')),
                                                        ((SELECT id FROM movies WHERE title='Oppenheimer'),
                                                         (SELECT id FROM directors WHERE first_name='Christopher' AND last_name='Nolan')),
                                                        ((SELECT id FROM movies WHERE title='Avatar: La Voie de l''eau'),
                                                         (SELECT id FROM directors WHERE first_name='James' AND last_name='Cameron'))
ON CONFLICT DO NOTHING;

-- Associations films-acteurs
INSERT INTO movie_actors (movie_id, actor_id, role_type) VALUES
    ((SELECT id FROM movies WHERE title='Barbie'),
     (SELECT id FROM actors WHERE first_name='Margot' AND last_name='Robbie'),
     'lead')
ON CONFLICT DO NOTHING;

-- Associations films-studios
INSERT INTO movie_studios (movie_id, studio_id, role) VALUES
                                                          ((SELECT id FROM movies WHERE title='Barbie'),
                                                           (SELECT id FROM studios WHERE name='Warner Bros.'),
                                                           'production'),
                                                          ((SELECT id FROM movies WHERE title='Oppenheimer'),
                                                           (SELECT id FROM studios WHERE name='Universal Pictures'),
                                                           'production'),
                                                          ((SELECT id FROM movies WHERE title='Avatar: La Voie de l''eau'),
                                                           (SELECT id FROM studios WHERE name='20th Century Studios'),
                                                           'production')
ON CONFLICT DO NOTHING;

-- Associations films-genres
INSERT INTO movie_genres (movie_id, genre_id) VALUES
                                                  ((SELECT id FROM movies WHERE title='Barbie'),
                                                   (SELECT id FROM genres WHERE name='Comedy')),
                                                  ((SELECT id FROM movies WHERE title='Oppenheimer'),
                                                   (SELECT id FROM genres WHERE name='Drama')),
                                                  ((SELECT id FROM movies WHERE title='Avatar: La Voie de l''eau'),
                                                   (SELECT id FROM genres WHERE name='Science Fiction'))
ON CONFLICT DO NOTHING;