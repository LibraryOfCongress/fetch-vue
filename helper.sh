#!/bin/bash

start() {
  npm run dev
}

build() {
  ./local-build.sh;
}

"$@"
