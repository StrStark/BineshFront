# Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; \
  fi

# Build the Vite project
FROM node:18-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# Production image - serve static files using a lightweight web server
FROM nginx:1.25-alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy generated build output into nginx web root
COPY --from=build /app/dist .

# Expose the port nginx will serve on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
