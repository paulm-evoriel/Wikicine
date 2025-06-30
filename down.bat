@echo off
REM Exporte la base de données
call export_db.bat
REM Exporte les images MinIO
call docker cp wikicine-minio-1:/data/wikicine-images ./wikicine-images-backup
REM Arrête les conteneurs Docker
call docker-compose down
pause 