@echo off
REM Exporte la base de données PostgreSQL
call docker exec wikicine-db-1 pg_dump -U postgres -d filmdb -f /tmp/dump.sql
call docker cp wikicine-db-1:/tmp/dump.sql dump.sql 