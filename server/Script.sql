-- Insertion des réalisateurs avec gestion des doublons
INSERT INTO directors (first_name, last_name, nationality_id, date_of_birth)
SELECT t.first_name, t.last_name, c.id, DATE t.date_of_birth
FROM (VALUES
          ('Christopher', 'Nolan', 'GBR', '1970-07-30'),
          ('Martin', 'Scorsese', 'USA', '1942-11-17'),
          ('Quentin', 'Tarantino', 'USA', '1963-03-27'),
          ('Steven', 'Spielberg', 'USA', '1946-12-18')
     ) AS t(first_name, last_name, country_code, date_of_birth)
         JOIN countries c ON c.code = t.country_code
WHERE NOT EXISTS (
    SELECT 1 FROM directors
    WHERE directors.first_name = t.first_name
      AND directors.last_name = t.last_name
);

-- Insertion des acteurs avec gestion des doublons
INSERT INTO actors (first_name, last_name, nationality_id, date_of_birth)
SELECT t.first_name, t.last_name, c.id, DATE t.date_of_birth
FROM (VALUES
          ('Leonardo', 'DiCaprio', 'USA', '1974-11-11'),
          ('Brad', 'Pitt', 'USA', '1963-12-18'),
          ('Tom', 'Cruise', 'USA', '1962-07-03'),
          ('Morgan', 'Freeman', 'USA', '1937-06-01'),
          ('Robert', 'De Niro', 'USA', '1943-08-17')
     ) AS t(first_name, last_name, country_code, date_of_birth)
         JOIN countries c ON c.code = t.country_code
WHERE NOT EXISTS (
    SELECT 1 FROM actors
    WHERE actors.first_name = t.first_name
      AND actors.last_name = t.last_name
);

-- Insertion des films avec gestion des doublons
INSERT INTO movies (title, original_title, release_date, duration, country_id, language)
SELECT t.title, t.original_title, DATE t.release_date, t.duration, c.id, t.language
FROM (VALUES
          ('Inception', 'Inception', '2010-07-16', 148, 'USA', 'English'),
          ('Les Évadés', 'The Shawshank Redemption', '1994-09-23', 142, 'USA', 'English'),
          ('Le Parrain', 'The Godfather', '1972-03-24', 175, 'USA', 'English'),
          ('Pulp Fiction', 'Pulp Fiction', '1994-10-14', 154, 'USA', 'English'),
          ('Le Loup de Wall Street', 'The Wolf of Wall Street', '2013-12-25', 180, 'USA', 'English'),
          ('Interstellar', 'Interstellar', '2014-11-07', 169, 'USA', 'English'),
          ('Les Dents de la mer', 'Jaws', '1975-06-20', 124, 'USA', 'English'),
          ('Il faut sauver le soldat Ryan', 'Saving Private Ryan', '1998-07-24', 169, 'USA', 'English'),
          ('Les Affranchis', 'Goodfellas', '1990-09-19', 146, 'USA', 'English'),
          ('Django Unchained', 'Django Unchained', '2012-12-25', 165, 'USA', 'English')
     ) AS t(title, original_title, release_date, duration, country_code, language)
         JOIN countries c ON c.code = t.country_code
WHERE NOT EXISTS (
    SELECT 1 FROM movies
    WHERE movies.title = t.title
      AND movies.original_title = t.original_title
);