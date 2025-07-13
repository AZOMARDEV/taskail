@echo off

REM Create output directory if it doesn't exist
if not exist "output" mkdir output

REM Build the Docker image
echo Building Docker image...
docker-compose build

REM Run the build
echo Starting Android build in container...
docker-compose run --rm expo-android-builder

echo Build completed! Check the ./output directory for your APK.
pause