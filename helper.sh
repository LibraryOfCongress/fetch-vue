#!/bin/bash

start() {
  ./local-build.sh -l;
}

web() {
  docker exec -it $1 /bin/sh;
}

build() {
  if [[ "$1" == "local" ]]; then
    ./local-build.sh;
  fi
  if [[ "$1" == "dev" ]]; then
    ./dev-build.sh;
  fi
}

"$@"
