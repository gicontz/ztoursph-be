y | docker system prune

# Stop all containers and running images
docker stop $(docker ps -a -q)

# Remove all images
docker rmi $(docker images -a -q)

# Remove all containers
docker rm $(docker ps -a -q)


# Build and run the app
docker build -t ztoursph-service .
docker run -d -p 3001:3001 --name ztoursph-app ztoursph-service