#!/usr/bin/env bash

set -x

IMAGE_LOCATION=images/web.local.Containerfile
IMAGE_TAG=fetch-web-image
CONTAINER_NAME=fetch-web
INTERNAL_PORT=80
HOST_PORT=8080

# stop the container if there is one running
CONTAINER_IDS=$(docker ps -q --filter name="^${CONTAINER_NAME}$")
if [ "$CONTAINER_IDS" != "" ]; then
    docker stop $CONTAINER_IDS
fi

# delete the container if there is one
CONTAINER_IDS=$(docker container ls -aq --filter name="^${CONTAINER_NAME}$")
if [ "$CONTAINER_IDS" != "" ]; then
    docker container rm -f $CONTAINER_IDS
fi

# delete the image if there is one
IMAGE_IDS=$(docker image ls -aq --filter "reference=${IMAGE_TAG}")
if [ "$IMAGE_IDS" != "" ]; then
    docker image rm -f $IMAGE_IDS
fi

# Test if port is clear
nc -vz -w 2 localhost ${HOST_PORT}

docker build \
--file ${IMAGE_LOCATION} --tag ${IMAGE_TAG} .

# run the fetch-web container
docker run --restart=always -it -d \
    -p${HOST_PORT}:${INTERNAL_PORT} \
    --name ${CONTAINER_NAME} \
    ${IMAGE_TAG}
