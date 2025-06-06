#!/bin/bash

echo "Building image for express"
docker build -f Dockerfile . -t kube-full-stack-express-api:latest --no-cache