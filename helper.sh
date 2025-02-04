#!/bin/bash

start() {
  ./local-build.sh -l;
}

web() {
  podman exec -it $1 /bin/sh;
}

refresh-db() {
  # Wipe db and build
  (cd ../fetch-local && exec ./helper.sh wipe-inventory-db);
  # Give the db a moment to catch its breath
  sleep 5;
  # Then re-schema and re-seed
  (cd ../fetch-local \
    && export SEED_FAKE_DATA=true \
    && exec ./helper.sh build-inventory-api \
    && export SEED_FAKE_DATA=false);
    # Reset seed arg in case user runs compose elsewhere
}

build() {
  if [[ "$1" == "local" ]]; then
    ./local-build.sh;
  fi
  if [[ "$1" == "dev" ]]; then
    ./dev-build.sh;
  fi
  if [[ "$1" == "test" ]]; then
    ./test-build.sh;
  fi
}

"$@"
