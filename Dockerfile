FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies for building
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

# Copy built artifacts and package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm ci --omit=dev

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
