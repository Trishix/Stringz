# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
# Copy any other necessary files (e.g., swagger.yaml, env example)
COPY swagger.yaml ./
COPY .env.example .env.example

EXPOSE 4000
CMD ["npm", "start"]
