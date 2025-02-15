# Frontend (Next.js)
FROM node:20

# Set working directory
WORKDIR /app

# Copy frontend files
COPY . /app/

# Install dependencies and build frontend
RUN npm install \
    && npm run build

# Expose frontend port
EXPOSE 3000

# Start the frontend
CMD ["npm", "run", "start"]
