#!/bin/bash
set -e

echo "Import de la base de données..."
docker cp dump.sql wikicine-db-1:/tmp/dump.sql
docker exec -it wikicine-db-1 psql -U postgres -d filmdb -f /tmp/dump.sql
echo "Import terminé."
