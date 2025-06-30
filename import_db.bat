@echo off
REM Importe le dump SQL dans le conteneur PostgreSQL
call docker cp dump.sql wikicine-db-1:/tmp/dump.sql
call docker exec -it wikicine-db-1 psql -U postgres -d filmdb -f /tmp/dump.sql 