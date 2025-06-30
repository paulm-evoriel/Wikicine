#!/bin/bash
set -e

echo "Export de la base de données..."
docker exec wikicine-db-1 pg_dump -U postgres -d filmdb -f /tmp/dump.sql
docker cp wikicine-db-1:dump.sql ./dump.sql
echo "Export terminé : dump.sql mis à jour."
