#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p ./output

# Build the Docker image
echo "Building Docker image..."
docker-compose build

# Run the build
echo "Starting Android build in container..."
docker-compose run --rm expo-android-builder

echo "Build completed! Check the ./output directory for your APK."