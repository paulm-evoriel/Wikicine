# Wikicine

Wikicine is a film rating site

## Base de données

### Export de la base de données

```bash
# Démarrer les conteneurs si nécessaire
docker-compose up -d

# Créer le dump dans le conteneur
docker exec wikicine-db-1 pg_dump -U postgres -d filmdb -f /tmp/dump.sql

# Copier le dump vers votre machine locale
docker cp wikicine-db-1:/tmp/dump.sql ./dump.sql
```

### Import de la base de données

```bash
# Démarrer les conteneurs si nécessaire
docker-compose up -d

# Copier le dump vers le conteneur
docker cp dump.sql wikicine-db-1:/tmp/dump.sql

# Importer le dump dans la base de données
docker exec -it wikicine-db-1 psql -U postgres -d filmdb -f /tmp/dump.sql
```
