# Use Ubuntu 22.04 as base image for better compatibility
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/build-tools/34.0.0:${PATH}"
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    openjdk-17-jdk \
    build-essential \
    python3 \
    python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify Java installation
RUN java -version

# Install Node.js 22.12.0 (matching your local version)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Verify Node.js version
RUN node -v && npm -v

# Setup Android SDK
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
    cd /tmp && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O cmdline-tools.zip && \
    unzip cmdline-tools.zip -d cmdline-tools && \
    mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    mv cmdline-tools/cmdline-tools/* ${ANDROID_SDK_ROOT}/cmdline-tools/latest/ && \
    rm -rf cmdline-tools cmdline-tools.zip

# Accept licenses and install Android SDK components
RUN yes | sdkmanager --licenses || true
RUN sdkmanager \
    "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0" \
    "cmake;3.22.1" \
    "ndk;25.1.8937393"

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Create working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create a script to build the app
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting Android build..."\n\
\n\
# Clean any previous builds\n\
rm -rf android/\n\
\n\
# Prebuild for Android\n\
echo "Running expo prebuild..."\n\
npx expo prebuild -p android\n\
\n\
# Check if android directory was created\n\
if [ ! -d "android" ]; then\n\
    echo "Error: Android directory was not created by expo prebuild"\n\
    echo "Checking current directory contents:"\n\
    ls -la\n\
    exit 1\n\
fi\n\
\n\
# Navigate to android directory\n\
cd android\n\
\n\
# Make gradlew executable\n\
chmod +x ./gradlew\n\
\n\
# Clean and build\n\
echo "Building APK..."\n\
./gradlew clean\n\
./gradlew assembleRelease\n\
\n\
echo "Build completed successfully!"\n\
echo "APK location: $(find . -name "*.apk" -type f)"\n\
\n\
# Copy APK to output directory\n\
echo "Copying APK to output directory..."\n\
find . -name "*.apk" -type f -exec cp {} /app/output/ \;\n\
echo "APK copied to /app/output/"\n\
' > /app/build.sh

# Make the build script executable
RUN chmod +x /app/build.sh

# Create output directory
RUN mkdir -p /app/output

# Expose volume for output
VOLUME ["/app/output"]

# Default command
CMD ["/app/build.sh"]