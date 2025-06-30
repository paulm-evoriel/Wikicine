up:
	docker-compose up -d
	make minio-import
	./import_db.sh

down:
	./export_db.sh
	make minio-export
	docker-compose down

restart:
	make down
	make up

# Synchronisation des images MinIO (adapter le nom du conteneur si besoin)
minio-export:
	docker cp wikicine-minio-1:/data/wikicine-images ./wikicine-images-backup

minio-import:
	docker exec wikicine-minio-1 mkdir -p /data/wikicine-images
	docker cp ./wikicine-images-backup/. wikicine-minio-1:/data/wikicine-images 