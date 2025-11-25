## Multi-stage Dockerfile: build the Vite frontend with Node, then copy the static `dist` into nginx

FROM node:18-alpine AS builder
WORKDIR /duc/frontend

# Install deps (use npm ci for reproducible builds). Copy package files first for caching.
COPY package*.json ./
RUN npm install
# Copy source and build
COPY . .
RUN npm run build

## Final stage: nginx serving static files
FROM nginx:1.23.3

# Remove default nginx html (optional) and copy built assets
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /duc/frontend/dist /usr/share/nginx/html

# Copy a custom nginx config if present in the build context
COPY ./default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]