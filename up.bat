@echo off
REM Démarre les conteneurs Docker
call docker-compose up -d
REM Importe les images MinIO
call docker exec wikicine-minio-1 mkdir -p /data/wikicine-images
call docker cp .\wikicine-images-backup\. wikicine-minio-1:/data/wikicine-images
REM Importe la base de données
call docker cp dump.sql wikicine-db-1:/tmp/dump.sql
call docker exec -it wikicine-db-1 psql -U postgres -d filmdb -f /tmp/dump.sql
REM Télécharge et configure le client MinIO
call Invoke-WebRequest -Uri https://dl.min.io/client/mc/release/windows-amd64/mc.exe -OutFile mc.exe
call .\mc.exe alias set minio http://localhost:9000/ minioadmin minioadmin
call .\mc.exe anonymous set public minio/wikicine-images
pause 