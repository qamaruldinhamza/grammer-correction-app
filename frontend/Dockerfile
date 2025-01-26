# syntax = docker/dockerfile:1

# Base image for Node.js
ARG NODE_VERSION=18.18.2
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV="production"
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Final image
FROM node:${NODE_VERSION}-slim

# Install `serve` to serve the React build
RUN npm install -g serve

# Copy the build output
COPY --from=base /app/build /app/build

# Set working directory to build directory
WORKDIR /app/build

# Expose port 3000
EXPOSE 3000

# Serve the React build
CMD ["serve", "-s", ".", "-l", "3000"]