start-services:
	- ./docker/scripts/init.sh
stop-services:
	- docker compose down
build:
	- docker build -f ./Dockerfile-prod -t ms-whatsapp-beeapp-container:latest .
start:
	- docker run --name ms-whatsapp-beeapp-container -p 5010:80 -d ms-whatsapp-beeapp-container:latest
exec:
	- docker exec -it ms-whatsapp-beeapp-container /bin/sh
logs:
	- docker logs -f --tail 50 --timestamps ms-whatsapp-beeapp-container
