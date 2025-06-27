-- Insertion des associations films-studios avec gestion des doublons
INSERT INTO movie_studios (movie_id, studio_id, role)
SELECT m.id, s.id, t.role::studio_role
FROM (VALUES
          ('Inception', 'Warner Bros.', 'production'),
          ('Inception', 'Legendary Pictures', 'co_production'),
          ('Les Évadés', 'Castle Rock Entertainment', 'production'),
          ('Les Évadés', 'Warner Bros.', 'distribution'),
          ('Le Parrain', 'Paramount Pictures', 'production'),
          ('Pulp Fiction', 'Miramax Films', 'production'),
          ('Le Loup de Wall Street', 'Paramount Pictures', 'production'),
          ('Le Loup de Wall Street', 'Universal Pictures', 'distribution'),
          ('Interstellar', 'Paramount Pictures', 'production'),
          ('Interstellar', 'Warner Bros.', 'distribution'),
          ('Les Dents de la mer', 'Universal Pictures', 'production'),
          ('Il faut sauver le soldat Ryan', 'DreamWorks Pictures', 'production'),
          ('Il faut sauver le soldat Ryan', 'Paramount Pictures', 'distribution'),
          ('Les Affranchis', 'Warner Bros.', 'production'),
          ('Django Unchained', 'The Weinstein Company', 'production'),
          ('Django Unchained', 'Columbia Pictures', 'distribution')
     ) AS t(movie_title, studio_name, role)
         JOIN movies m ON m.title = t.movie_title
         JOIN studios s ON s.name = t.studio_name
WHERE NOT EXISTS (
    SELECT 1 FROM movie_studios ms
    WHERE ms.movie_id = m.id
      AND ms.studio_id = s.id
      AND ms.role = t.role::studio_role
);