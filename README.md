# Wikicine
Wikicine is a film rating site
To export database execute this :   docker exec wikicine-db-1 pg_dump -U postgres -d filmdb > dump.sql
To import database execute those :   docker cp dump.sql wikicine-db-1:/dump.sql
  docker exec -it wikicine-db-1 psql -U postgres -d filmdb -f /dump.sql
