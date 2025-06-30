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
#Vider le volume
docker-compose down -v

# Démarrer les conteneurs si nécessaire
docker-compose up -d

# Copier le dump vers le conteneur
docker cp dump.sql wikicine-db-1:/tmp/dump.sql

# Importer le dump dans la base de données
docker exec -it wikicine-db-1 psql -U postgres -d filmdb -f /tmp/dump.sql
```

# Synchroniser les images MinIO entre deux machines (procédure simplifiée)

1. **Sur la machine source (où les images sont présentes)**
   - Trouver le nom du conteneur MinIO :
     ```sh
     docker ps
     ```
   - Exporter les images :
     ```sh
     docker cp <nom_conteneur_minio>:/data/wikicine-images ./wikicine-images-backup
     ```

2. **Transférer le dossier `wikicine-images-backup`** à la machine cible (clé USB, réseau, etc.)

3. **Sur la machine cible**
   - Trouver le nom du conteneur MinIO :
     ```sh
     docker ps
     ```
   - Créer le dossier dans le conteneur (si besoin) :
     ```sh
     docker exec <nom_conteneur_minio> mkdir -p /data/wikicine-images
     ```
   - Importer les images :
     ```sh
     docker cp ./wikicine-images-backup/. <nom_conteneur_minio>:/data/wikicine-images
     ```

4. **Vérifier dans MinIO (http://localhost:9001)** que les images sont bien présentes.

5. **Rendre le bucket public** si besoin (via l'interface MinIO ou avec `mc`).

C'est tout ! Les images seront alors visibles sur toutes les pages de l'application.
