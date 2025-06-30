@echo off
REM Démarre les conteneurs Docker
call docker-compose up -d
REM Importe les images MinIO
call docker exec wikicine-minio-1 mkdir -p /data/wikicine-images
call docker cp .\wikicine-images-backup\. wikicine-minio-1:/data/wikicine-images
REM Importe la base de données
call import_db.bat
pause 