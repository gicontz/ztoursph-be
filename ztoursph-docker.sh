y | docker system prune

# Stop all containers and running images
docker stop $(docker ps -a -q)

# Remove all images
docker rmi $(docker images -a -q) --force

# Remove all containers
docker rm $(docker ps -a -q) --force


# Build and run the app
docker build -t ztoursph-service .
docker run -d --restart unless-stopped -p 3001:3001 --name ztoursph-app ztoursph-service