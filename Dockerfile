# Install dependencies
FROM registry.bineshafzar.ir/library/node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install

# Build the Vite project
FROM registry.bineshafzar.ir/library/node:18-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm i -g vite
RUN npm run build

# Production image
FROM registry.bineshafzar.ir/library/nginx:1.25-alpine AS runner
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
