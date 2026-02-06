# Stage 1: Build the Vite app
FROM node:20-alpine AS builder

# Install some dependencies for building (optional but safer for Alpine)
RUN apk add --no-cache bash git

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm ci --include=dev

# Debug: check that vite exists (can remove later)
RUN ls -la node_modules/.bin
RUN npx vite --version

# Copy the rest of the application code
COPY . .

# Build using npx to guarantee local vite binary is used
RUN npx vite build

# Stage 2: Serve built files with Nginx
FROM nginx:alpine

# Copy the build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
