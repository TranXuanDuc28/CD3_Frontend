# Stage 1: build frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Inject các biến VITE trực tiếp trước build
ENV VITE_API_URL=/api
ENV VITE_CLOUDINARY_CLOUD_NAME=dij1fbzfy
ENV VITE_CLOUDINARY_UPLOAD_PRESET=posted_images

# Build frontend
RUN npm run build

# Stage 2: nginx production
FROM nginx:1.23.3

# Xoá mặc định và copy build frontend
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy config Nginx nếu có
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
