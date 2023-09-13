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
is_port_blocked="$(lsof -i -P -n | grep ${HOST_PORT})"
if [[ "${#is_port_blocked}" -gt 0 ]]; then
    echo "Port ${HOST_PORT} already in use"
    echo "${is_port_blocked}"
    echo "Kill process id and try again"
    echo "You may need to restart the docker machine"
    exit 1
fi


docker build \
--file ${IMAGE_LOCATION} --tag ${IMAGE_TAG} .

# docker pod create --name ${POD_NAME}

# docker run -dt --pod ${POD_NAME} ${IMAGE_TAG} -p 8080:80

# docker run -it -p 8080:80 --rm dockerize-quasar

# run the fetch-web container
docker run --restart=always -it -d \
    -p${HOST_PORT}:${INTERNAL_PORT} \
    --name ${CONTAINER_NAME} \
    ${IMAGE_TAG}
