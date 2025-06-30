UPDATE movies
SET poster = REPLACE(poster, 'localhost:9001', 'localhost:9000')
WHERE poster LIKE '%localhost:9001%';