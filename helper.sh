#!/bin/bash

start() {
  ./local-build.sh -l;
}

build() {
  ./local-build.sh;
}

"$@"
