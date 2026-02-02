# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
# Copy env if needed, or rely on docker-compose env. 
# We generally don't copy .env in Dockerfile for security, but for simplicity in some setups it's done. 
# Better to expect env vars injected.

EXPOSE 4000

CMD ["npm", "start"]
