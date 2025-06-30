up:
	docker-compose up -d
	./import_db.sh

down:
	./export_db.sh
	docker-compose down

restart:
	make down
	make up 