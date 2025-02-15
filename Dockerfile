# Backend (Django)
FROM python:3.12.4-slim-bullseye AS backend

# Set environment variables
ENV PYTHONBUFFERED=1
ENV PORT=8080

# Set working directory for backend
WORKDIR /api/api/api

# Copy backend files
COPY . /api/

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r /api/requirements.txt

# Migrate database
RUN python manage.py makemigrations --noinput
RUN python manage.py migrate --noinput

# Frontend (Next.js)
FROM node:20 AS frontend

# Set working directory for frontend
WORKDIR /app/platform

# Copy frontend files
COPY app/platform /app/platform

# Install dependencies and build
RUN npm install
RUN npm run build

# Reverse Proxy (NGINX)
FROM nginx:alpine AS proxy

# Copy NGINX configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

# Production image
FROM python:3.12.4-slim-bullseye

# Set environment variables
ENV PYTHONBUFFERED=1
ENV PORT=8080

# Set working directory for backend
WORKDIR /api/api/api

# Copy backend from backend stage
COPY --from=backend /api /api

# Install backend dependencies
RUN pip install --upgrade pip
RUN pip install -r /api/requirements.txt

# Copy frontend build
WORKDIR /app
COPY --from=frontend /app/platform/.next /app/platform/.next
COPY --from=frontend /app/platform/public /app/platform/public
COPY --from=frontend /app/platform/package.json /app/platform/package.json
COPY --from=frontend /app/platform/node_modules /app/platform/node_modules

# Expose ports for backend (8080) and frontend (3000)
EXPOSE 8080 3000

# Start both services using NGINX as reverse proxy
CMD ["nginx", "-g", "daemon off;"]


